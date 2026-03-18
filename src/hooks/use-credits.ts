import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

const FREE_DAILY_CREDITS = 5;
const PRO_DAILY_CREDITS = 999;

export function useCredits() {
  const { user, profile } = useAuth();
  const [used, setUsed] = useState(0);
  const [loading, setLoading] = useState(true);

  const plan = profile?.plan || "free";
  const isAdmin = profile?.role === "admin";
  const bonusCredits = (profile as any)?.bonus_credits || 0;
  const dailyLimit = isAdmin ? Infinity : (plan === "pro" ? PRO_DAILY_CREDITS : FREE_DAILY_CREDITS) + bonusCredits;
  const remaining = isAdmin ? Infinity : Math.max(0, dailyLimit - used);

  const refresh = useCallback(async () => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("usage_tracking")
      .select("count")
      .eq("user_id", user.id)
      .eq("used_at", today);

    const total = (data as any[] || []).reduce((s: number, r: any) => s + (r.count || 0), 0);
    setUsed(total);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { used, remaining, dailyLimit, loading, refresh, plan, isAdmin };
}
