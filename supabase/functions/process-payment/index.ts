import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRO_PRICE_BDT = 99;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Validate user via getUser (server-side JWT verification)
    const supabaseUser = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;
    const { action, paymentId, transactionId } = await req.json();

    // Admin client for privileged operations
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    if (action === "create") {
      // Create a pending payment record
      const { data: payment, error } = await supabaseAdmin
        .from("payments")
        .insert({
          user_id: userId,
          amount: PRO_PRICE_BDT,
          currency: "BDT",
          method: "bkash",
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: "Failed to create payment" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // In production, this would call bKash tokenized checkout API
      // For now, return a simulated payment ID for the user to "confirm"
      return new Response(
        JSON.stringify({
          paymentId: payment.id,
          amount: PRO_PRICE_BDT,
          currency: "BDT",
          // Simulated bKash payment URL — replace with real bKash API in production
          bkashUrl: `https://bkash.com/pay?ref=${payment.id}`,
          message: "Payment created. Complete payment to upgrade.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify") {
      if (!paymentId || !transactionId) {
        return new Response(JSON.stringify({ error: "Missing paymentId or transactionId" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Fetch the payment record (admin client bypasses RLS)
      const { data: payment } = await supabaseAdmin
        .from("payments")
        .select("*")
        .eq("id", paymentId)
        .eq("user_id", userId)
        .single();

      if (!payment) {
        return new Response(JSON.stringify({ error: "Payment not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (payment.status === "completed") {
        return new Response(JSON.stringify({ error: "Payment already processed" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Validate transaction ID format (alphanumeric, 6-30 chars)
      const txIdRegex = /^[A-Za-z0-9]{6,30}$/;
      if (!txIdRegex.test(transactionId)) {
        // Log failed attempt
        await supabaseAdmin
          .from("payments")
          .update({ status: "failed", transaction_id: transactionId })
          .eq("id", paymentId);

        return new Response(JSON.stringify({ error: "Invalid transaction ID format" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check for duplicate transaction ID (prevent reuse)
      const { data: existingTx } = await supabaseAdmin
        .from("payments")
        .select("id")
        .eq("transaction_id", transactionId)
        .eq("status", "completed")
        .maybeSingle();

      if (existingTx) {
        await supabaseAdmin
          .from("payments")
          .update({ status: "failed", transaction_id: transactionId })
          .eq("id", paymentId);

        return new Response(JSON.stringify({ error: "Transaction ID already used" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // In production: call bKash Execute/Query Payment API here
      // to verify transactionId is legitimate and matches amount.
      // DO NOT auto-upgrade — admin must manually verify and approve.

      // Record the transaction ID for admin review (keep status as pending)
      const { error: updateError } = await supabaseAdmin
        .from("payments")
        .update({
          transaction_id: transactionId,
        })
        .eq("id", paymentId)
        .eq("status", "pending");

      if (updateError) {
        return new Response(JSON.stringify({ error: "Failed to record transaction" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Transaction ID recorded. Your payment is pending admin verification.",
          status: "pending",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("process-payment error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
