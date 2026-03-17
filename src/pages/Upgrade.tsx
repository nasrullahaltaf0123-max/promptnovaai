import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Zap, Shield, Infinity, CreditCard, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useCredits } from "@/hooks/use-credits";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const proFeatures = [
  "999 credits per day (unlimited use)",
  "All AI tools unlocked",
  "Priority generation speed",
  "No watermarks on content",
  "Premium support",
  "Early access to new tools",
];

const Upgrade = () => {
  const { user, session, profile } = useAuth();
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
          <Link to="/dashboard" className="text-primary hover:underline text-caption">← Back to Dashboard</Link>
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
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPaymentId(data.paymentId);
      setStep("pay");
      toast({ title: "Payment created", description: `Send ৳${data.amount} via bKash` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const verifyPayment = async () => {
    if (!session || !transactionId.trim()) return;
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
          body: JSON.stringify({ action: "verify", paymentId, transactionId: transactionId.trim() }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ title: "🎉 Upgraded to Pro!", description: "Refresh to see your new plan." });
      setStep("verify");
      // Reload to refresh profile
      setTimeout(() => window.location.reload(), 1500);
    } catch (e: any) {
      toast({ title: "Verification failed", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-micro mb-4 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>
          <h1 className="text-heading text-foreground">Upgrade to Pro</h1>
          <p className="text-caption text-muted-foreground mt-1">
            Unlock unlimited AI power for ৳299/month
          </p>
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
                <p className="text-caption text-muted-foreground">৳299/month via bKash</p>
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-caption flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              {loading ? "Creating payment..." : "Pay with bKash — ৳299"}
            </button>
          </div>
        )}

        {step === "pay" && (
          <div className="glass-card-highlight rounded-2xl p-7 space-y-5">
            <h2 className="text-body-lg font-bold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Complete Payment
            </h2>

            <div className="bg-secondary/30 rounded-xl p-4 space-y-2">
              <p className="text-caption text-foreground font-medium">Send ৳299 via bKash to:</p>
              <p className="text-heading text-primary font-bold">01XXXXXXXXX</p>
              <p className="text-micro text-muted-foreground">Reference: {paymentId.slice(0, 8)}</p>
            </div>

            <div className="space-y-2">
              <label className="text-caption text-foreground font-medium">bKash Transaction ID</label>
              <input
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. TRX1234ABCD"
                className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-3 text-caption text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <button
              onClick={verifyPayment}
              disabled={loading || !transactionId.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-caption flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Payment"}
            </button>

            <button onClick={() => setStep("plan")} className="w-full text-micro text-muted-foreground hover:text-foreground transition-colors">
              ← Go back
            </button>
          </div>
        )}

        {step === "verify" && (
          <div className="glass-card-highlight rounded-2xl p-7 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-body-lg font-bold text-foreground">Payment Verified!</h2>
            <p className="text-caption text-muted-foreground">You now have Pro access. Enjoy unlimited AI tools!</p>
          </div>
        )}

        {/* Security note */}
        <p className="text-micro text-muted-foreground/50 text-center flex items-center justify-center gap-1">
          <Shield className="w-3 h-3" /> Payments verified server-side. No fake upgrades possible.
        </p>
      </motion.div>
    </div>
  );
};

export default Upgrade;
