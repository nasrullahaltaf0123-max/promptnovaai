import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Gift, Users, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Referrals = () => {
  const { user, profile } = useAuth();
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user || !profile) return;
    setReferralCode((profile as any).referral_code || "");

    supabase
      .from("referrals")
      .select("id", { count: "exact", head: true })
      .eq("referrer_id", user.id)
      .then(({ count }) => setReferralCount(count || 0));
  }, [user, profile]);

  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: "Referral link copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-heading text-foreground">Refer & Earn</h1>
          <p className="text-caption text-muted-foreground mt-1">Share your link and earn +20 bonus credits for each friend who joins!</p>
        </div>

        {/* Referral Link */}
        <div className="glass-card-highlight rounded-2xl p-6 space-y-4">
          <h2 className="text-body-lg font-semibold text-foreground flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" /> Your Referral Link
          </h2>
          <div className="flex gap-2">
            <input
              readOnly
              value={referralLink}
              className="flex-1 bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-caption text-foreground focus:outline-none"
            />
            <button
              onClick={copyLink}
              className="bg-foreground text-background px-4 py-2.5 rounded-xl font-medium text-caption flex items-center gap-2 hover:bg-foreground/90 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="glass-card rounded-2xl p-5 text-center">
            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-heading text-foreground">{referralCount}</p>
            <p className="text-micro text-muted-foreground">Friends Joined</p>
          </div>
          <div className="glass-card rounded-2xl p-5 text-center">
            <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-heading text-foreground">{referralCount * 20}</p>
            <p className="text-micro text-muted-foreground">Credits Earned</p>
          </div>
          <div className="glass-card rounded-2xl p-5 text-center">
            <Gift className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-heading text-foreground">{(profile as any)?.bonus_credits || 0}</p>
            <p className="text-micro text-muted-foreground">Total Bonus</p>
          </div>
        </div>

        {/* How it works */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-body-lg font-semibold text-foreground mb-4">How it works</h3>
          <div className="space-y-3">
            {[
              { step: "1", text: "Share your unique referral link with friends" },
              { step: "2", text: "They sign up using your link" },
              { step: "3", text: "You both get +20 bonus credits instantly!" },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-caption font-bold text-primary">{s.step}</span>
                </div>
                <p className="text-caption text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Referrals;
