import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRO_PRICE_BDT = 99;
const ADMIN_EMAILS = ["aipromptnova@gmail.com"];

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
    const body = await req.json();
    const action = typeof body.action === "string" ? body.action : "";

    // Admin client for privileged operations
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // ─── CREATE: user submits a new payment ───
    if (action === "create") {
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
        console.error("Payment create error:", error);
        return new Response(JSON.stringify({ error: "Failed to create payment. Please try again." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({
          paymentId: payment.id,
          amount: PRO_PRICE_BDT,
          currency: "BDT",
          message: "Payment created. Complete payment to upgrade.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ─── VERIFY: user submits transaction ID ───
    if (action === "verify") {
      const paymentId = typeof body.paymentId === "string" ? body.paymentId : "";
      const transactionId = typeof body.transactionId === "string" ? body.transactionId.trim() : "";

      if (!paymentId || !transactionId) {
        return new Response(JSON.stringify({ error: "Missing payment ID or transaction ID" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Validate transaction ID format
      if (transactionId.length < 6 || transactionId.length > 30 || !/^[A-Za-z0-9]+$/.test(transactionId)) {
        return new Response(JSON.stringify({ error: "Invalid transaction ID format" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Fetch the payment record
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

      // Check for duplicate transaction ID
      const { data: existingTx } = await supabaseAdmin
        .from("payments")
        .select("id")
        .eq("transaction_id", transactionId)
        .neq("id", paymentId)
        .maybeSingle();

      if (existingTx) {
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
        .update({ transaction_id: transactionId })
        .eq("id", paymentId)
        .eq("status", "pending");

      if (updateError) {
        console.error("Payment update error:", updateError);
        return new Response(JSON.stringify({ error: "Failed to record transaction. Please try again." }), {
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

    // ─── CHECK: user checks their payment status ───
    if (action === "check") {
      const { data: latestPayment } = await supabaseAdmin
        .from("payments")
        .select("id, status, verified_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return new Response(
        JSON.stringify({ payment: latestPayment || null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ─── ADMIN APPROVE: only admin can approve payments ───
    if (action === "approve") {
      // Server-side admin check via email
      if (!ADMIN_EMAILS.includes(user.email || "")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const targetPaymentId = typeof body.targetPaymentId === "string" ? body.targetPaymentId : "";
      if (!targetPaymentId) {
        return new Response(JSON.stringify({ error: "Missing targetPaymentId" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Fetch the payment
      const { data: payment } = await supabaseAdmin
        .from("payments")
        .select("*")
        .eq("id", targetPaymentId)
        .single();

      if (!payment) {
        return new Response(JSON.stringify({ error: "Payment not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (payment.status === "completed") {
        return new Response(JSON.stringify({ error: "Payment already approved" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!payment.transaction_id) {
        return new Response(JSON.stringify({ error: "No transaction ID submitted yet" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Mark payment as completed
      const { error: paymentError } = await supabaseAdmin
        .from("payments")
        .update({
          status: "completed",
          verified_at: new Date().toISOString(),
        })
        .eq("id", targetPaymentId);

      if (paymentError) {
        console.error("Approve payment error:", paymentError);
        return new Response(JSON.stringify({ error: "Failed to approve payment" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Upgrade user profile to Pro (service_role bypasses triggers)
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({
          plan: "pro",
          bonus_credits: 999,
        })
        .eq("id", payment.user_id);

      if (profileError) {
        console.error("Profile upgrade error:", profileError);
        return new Response(JSON.stringify({ error: "Payment approved but profile upgrade failed" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `User ${payment.user_id} upgraded to Pro successfully.`,
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
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
