import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Gift, Zap, Trophy } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const GamificationWidget = () => {
  const { user, profile } = useAuth();
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [bonusCredits, setBonusCredits] = useState(0);
  const [canClaim, setCanClaim] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (!user || !profile) return;
    setStreak((profile as any).streak_count || 0);
    setXp((profile as any).total_xp || 0);
    setBonusCredits((profile as any).bonus_credits || 0);

    // Check if daily reward already claimed
    const today = new Date().toISOString().split("T")[0];
    supabase
      .from("daily_rewards")
      .select("id")
      .eq("user_id", user.id)
      .eq("claimed_at", today)
      .maybeSingle()
      .then(({ data }) => setCanClaim(!data));
  }, [user, profile]);

  const claimDailyReward = async () => {
    if (!user || claiming || !canClaim) return;
    setClaiming(true);

    const { data, error } = await supabase.rpc("claim_daily_reward");

    if (!error && data && (data as any).success) {
      const result = data as any;
      setStreak(result.streak);
      setBonusCredits(result.bonus_credits);
      setXp(result.total_xp);
      setCanClaim(false);
      toast({ title: `🎁 +${result.credits} credits claimed!`, description: `${result.streak} day streak! Keep it up!` });
    } else if (data && (data as any).error) {
      toast({ title: "Could not claim reward", description: (data as any).error, variant: "destructive" });
    }
    setClaiming(false);
  };

  const level = Math.floor(xp / 500) + 1;
  const xpInLevel = xp % 500;
  const xpProgress = (xpInLevel / 500) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-highlight rounded-2xl p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-caption font-semibold text-foreground flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" /> Your Progress
        </h3>
        <span className="text-micro text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-md">
          Lv. {level}
        </span>
      </div>

      {/* XP Bar */}
      <div>
        <div className="flex justify-between text-micro text-muted-foreground mb-1">
          <span>{xpInLevel} / 500 XP</span>
          <span>Level {level + 1}</span>
        </div>
        <Progress value={xpProgress} className="h-2 bg-secondary/50" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-secondary/30 rounded-xl p-3 text-center">
          <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
          <p className="text-body-lg font-bold text-foreground">{streak}</p>
          <p className="text-[10px] text-muted-foreground">Day Streak</p>
        </div>
        <div className="bg-secondary/30 rounded-xl p-3 text-center">
          <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
          <p className="text-body-lg font-bold text-foreground">{bonusCredits}</p>
          <p className="text-[10px] text-muted-foreground">Bonus</p>
        </div>
        <div className="bg-secondary/30 rounded-xl p-3 text-center">
          <Trophy className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-body-lg font-bold text-foreground">{xp}</p>
          <p className="text-[10px] text-muted-foreground">Total XP</p>
        </div>
      </div>

      {/* Daily Reward */}
      <button
        onClick={claimDailyReward}
        disabled={!canClaim || claiming}
        className={`w-full py-2.5 rounded-xl text-caption font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
          canClaim
            ? "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
            : "bg-secondary/40 text-muted-foreground/50 cursor-not-allowed"
        }`}
      >
        <Gift className="w-4 h-4" />
        {canClaim ? `Claim Daily Reward (+${5 + Math.min(streak, 10)} credits)` : "✓ Claimed Today"}
      </button>
    </motion.div>
  );
};

export default GamificationWidget;
