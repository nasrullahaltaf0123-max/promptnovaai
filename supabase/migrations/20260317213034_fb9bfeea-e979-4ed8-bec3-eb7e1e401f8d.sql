
-- Referrals table
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  bonus_credited boolean NOT NULL DEFAULT false,
  UNIQUE(referred_id)
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own referrals" ON public.referrals
  FOR SELECT TO authenticated USING (auth.uid() = referrer_id);

CREATE POLICY "Users can insert referrals" ON public.referrals
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = referred_id);

-- Add referral_code and bonus_credits to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE DEFAULT substr(md5(random()::text), 1, 8),
  ADD COLUMN IF NOT EXISTS bonus_credits integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS streak_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_active_date date,
  ADD COLUMN IF NOT EXISTS total_xp integer NOT NULL DEFAULT 0;

-- Daily rewards tracking
CREATE TABLE public.daily_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claimed_at date NOT NULL DEFAULT CURRENT_DATE,
  credits_earned integer NOT NULL DEFAULT 5,
  UNIQUE(user_id, claimed_at)
);

ALTER TABLE public.daily_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own rewards" ON public.daily_rewards
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can claim rewards" ON public.daily_rewards
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
