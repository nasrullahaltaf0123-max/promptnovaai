import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRO_PRICE_BDT = 299;

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

      // In production: call bKash Execute Payment / Query Payment API
      // to verify the transactionId is legitimate and matches the amount.
      // For simulation, we accept any transactionId as valid.
      const isValid = transactionId.length >= 4;

      if (!isValid) {
        return new Response(JSON.stringify({ error: "Invalid transaction ID" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Mark payment as completed
      await supabaseAdmin
        .from("payments")
        .update({
          status: "completed",
          transaction_id: transactionId,
          verified_at: new Date().toISOString(),
        })
        .eq("id", paymentId);

      // Upgrade user to pro
      await supabaseAdmin
        .from("profiles")
        .update({ plan: "pro" })
        .eq("id", userId);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Payment verified! You are now a Pro user.",
          plan: "pro",
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
