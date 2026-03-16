import { supabase } from "@/integrations/supabase/client";

const DAILY_LIMITS: Record<string, number> = {
  chat: 100,
  image: 10,
  blog: 2,
  logo: 5,
  script: 10,
  prompt: 20,
};

export const getLimit = (toolType: string) => DAILY_LIMITS[toolType] ?? 50;

export async function getDailyUsage(userId: string, toolType: string): Promise<number> {
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("usage_tracking")
    .select("count")
    .eq("user_id", userId)
    .eq("tool_type", toolType)
    .eq("used_at", today)
    .maybeSingle();
  return (data as any)?.count ?? 0;
}

export async function incrementUsage(userId: string, toolType: string): Promise<boolean> {
  const current = await getDailyUsage(userId, toolType);
  const limit = getLimit(toolType);
  if (current >= limit) return false;

  const today = new Date().toISOString().split("T")[0];
  // Upsert: insert or increment
  const { error } = await supabase.from("usage_tracking").upsert(
    { user_id: userId, tool_type: toolType, used_at: today, count: current + 1 },
    { onConflict: "user_id,tool_type,used_at" }
  );
  return !error;
}

export async function saveToHistory(
  userId: string,
  toolType: string,
  title: string,
  prompt: string,
  result: string
) {
  await supabase.from("generation_history").insert({
    user_id: userId,
    tool_type: toolType,
    title,
    prompt,
    result,
  });
}

export async function getAllDailyUsage(userId: string): Promise<Record<string, number>> {
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("usage_tracking")
    .select("tool_type, count")
    .eq("user_id", userId)
    .eq("used_at", today);
  const usage: Record<string, number> = {};
  if (data) {
    for (const row of data as any[]) {
      usage[row.tool_type] = row.count;
    }
  }
  return usage;
}
