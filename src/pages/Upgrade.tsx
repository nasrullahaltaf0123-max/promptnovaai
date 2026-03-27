import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Zap, Shield, CreditCard, ArrowLeft, Copy, AlertTriangle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useCredits } from "@/hooks/use-credits";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BKASH_NUMBER = "01760208757";
const BKASH_REFERENCE = "promptnova";
const PRO_PRICE = 99;

const proFeatures = [
  "999 credits per day (unlimited use)",
  "All AI tools unlocked",
  "Priority generation speed",
  "No watermarks on content",
  "Premium support",
  "Early access to new tools",
];

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text);
  toast({ title: "Copied!", description: `${label} copied to clipboard` });
};

const Upgrade = () => {
  const { session } = useAuth();
  const { remaining, dailyLimit, plan } = useCredits();
  const [step, setStep] = useState<"plan" | "pay" | "verify">("plan");
  const [paymentId, setPaymentId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);

  if (plan === "pro") {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Crown className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-heading text-foreground mb-2">You're a Pro!</h1>
          <p className="text-caption text-muted-foreground mb-6">You have full access to all PromptNova AI tools.</p>
          <Link to="/dashboard" className="text-primary hover:underline text-caption">
            ← Back to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  const createPayment = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/process-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ action: "create" }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPaymentId(data.paymentId);
      setStep("pay");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const verifyPayment = async () => {
    const trimmedTxId = transactionId.trim();
    if (!session || !trimmedTxId) {
      toast({ title: "Error", description: "Enter a valid transaction ID", variant: "destructive" });
      return;
    }
    if (trimmedTxId.length < 6) {
      toast({ title: "Error", description: "Transaction ID must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (!/^[A-Za-z0-9]+$/.test(trimmedTxId)) {
      toast({ title: "Error", description: "Transaction ID must be alphanumeric only", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/process-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ action: "verify", paymentId, transactionId: trimmedTxId }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      toast({ title: "✅ Submitted!", description: "Your payment is pending admin verification. You'll be upgraded once verified." });
      setStep("plan");
      setTransactionId("");
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Something went wrong. Please try again.", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-micro mb-4 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>
          <h1 className="text-heading text-foreground">Upgrade to Pro</h1>
          <p className="text-caption text-muted-foreground mt-1">
            Unlock unlimited AI power for <span className="text-foreground font-bold">৳{PRO_PRICE}/month</span>{" "}
            <span className="text-muted-foreground/50 line-through">৳299</span>
          </p>
          <p className="text-micro text-primary font-semibold mt-1">🔥 Launch Offer — Only for first 100 users</p>
        </div>

        {/* Current usage warning */}
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <p className="text-caption font-medium text-foreground">
              You have {remaining}/{dailyLimit} credits left today
            </p>
            <p className="text-micro text-muted-foreground">Free plan resets daily. Upgrade for 999 credits/day.</p>
          </div>
        </div>

        {step === "plan" && (
          <div className="glass-card-highlight rounded-2xl p-7 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-body-lg font-bold text-foreground">Pro Plan</h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-caption font-bold text-primary">৳{PRO_PRICE}/month</span>
                  <span className="text-micro text-muted-foreground/50 line-through">৳299/month</span>
                </div>
              </div>
            </div>

            <ul className="space-y-3">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-caption text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={createPayment}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-caption flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-primary/25"
            >
              <CreditCard className="w-4 h-4" />
              {loading ? "Creating payment..." : `Pay with bKash — ৳${PRO_PRICE}`}
            </button>
          </div>
        )}

        {step === "pay" && (
          <div className="glass-card-highlight rounded-2xl p-7 space-y-5">
            <h2 className="text-body-lg font-bold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Complete Payment
            </h2>

            {/* bKash details */}
            <div className="bg-secondary/30 rounded-xl p-5 space-y-4">
              <p className="text-caption text-foreground font-medium">Send ৳{PRO_PRICE} via bKash to:</p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-micro text-muted-foreground uppercase tracking-wider mb-1">bKash Number</p>
                  <p className="text-heading text-primary font-extrabold tracking-wide">{BKASH_NUMBER}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(BKASH_NUMBER, "bKash number")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-micro font-medium hover:bg-primary/20 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-micro text-muted-foreground uppercase tracking-wider mb-1">Reference</p>
                  <p className="text-body-lg text-foreground font-bold">{BKASH_REFERENCE}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(BKASH_REFERENCE, "Reference")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-micro font-medium hover:bg-primary/20 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>

              <p className="text-micro text-muted-foreground">
                Send exact amount <span className="text-foreground font-medium">৳{PRO_PRICE}</span> and include
                reference <span className="text-foreground font-medium">"{BKASH_REFERENCE}"</span>
              </p>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2.5 bg-destructive/5 border border-destructive/20 rounded-xl p-3.5">
              <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-micro text-destructive/90">Wrong reference or amount = payment will NOT be verified</p>
            </div>

            {/* Transaction ID input */}
            <div className="space-y-2">
              <label className="text-caption text-foreground font-medium">bKash Transaction ID *</label>
              <input
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. TRX1234ABCD"
                className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-3 text-caption text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Verify CTA with glow */}
            <button
              onClick={verifyPayment}
              disabled={loading || !transactionId.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-caption flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_0_24px_-4px_hsl(var(--primary)/0.5)]"
            >
              {loading ? "Verifying..." : "✅ Verify Payment"}
            </button>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-micro text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-primary" /> Secure server-side verification
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-primary" /> Usually verifies within 1–5 minutes
              </span>
            </div>

            <button
              onClick={() => setStep("plan")}
              className="w-full text-micro text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Go back
            </button>
          </div>
        )}

        <p className="text-micro text-muted-foreground/50 text-center flex items-center justify-center gap-1">
          <Shield className="w-3 h-3" /> Payments verified server-side. No fake upgrades possible.
        </p>
      </motion.div>
    </div>
  );
};

export default Upgrade;
