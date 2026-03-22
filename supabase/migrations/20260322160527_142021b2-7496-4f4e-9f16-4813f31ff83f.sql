
-- Secure RPC to claim daily reward server-side
CREATE OR REPLACE FUNCTION public.claim_daily_reward()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_today date := CURRENT_DATE;
  v_yesterday date := CURRENT_DATE - 1;
  v_profile record;
  v_already_claimed boolean;
  v_is_consecutive boolean;
  v_new_streak integer;
  v_credits integer;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Not authenticated');
  END IF;

  -- Check if already claimed today
  SELECT EXISTS(
    SELECT 1 FROM daily_rewards WHERE user_id = v_user_id AND claimed_at = v_today
  ) INTO v_already_claimed;

  IF v_already_claimed THEN
    RETURN jsonb_build_object('error', 'Already claimed today');
  END IF;

  -- Get current profile
  SELECT streak_count, last_active_date, bonus_credits, total_xp
  INTO v_profile FROM profiles WHERE id = v_user_id;

  -- Calculate streak
  v_is_consecutive := (v_profile.last_active_date = v_yesterday);
  v_new_streak := CASE WHEN v_is_consecutive THEN v_profile.streak_count + 1 ELSE 1 END;
  v_credits := 5 + LEAST(v_new_streak, 10);

  -- Insert daily reward record
  INSERT INTO daily_rewards (user_id, claimed_at, credits_earned)
  VALUES (v_user_id, v_today, v_credits);

  -- Update profile (this runs as service_role owner, bypasses trigger)
  UPDATE profiles SET
    bonus_credits = v_profile.bonus_credits + v_credits,
    streak_count = v_new_streak,
    last_active_date = v_today,
    total_xp = v_profile.total_xp + v_credits * 10
  WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'credits', v_credits,
    'streak', v_new_streak,
    'total_xp', v_profile.total_xp + v_credits * 10,
    'bonus_credits', v_profile.bonus_credits + v_credits
  );
END;
$$;
