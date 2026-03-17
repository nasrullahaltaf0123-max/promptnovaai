
-- Create a trigger to prevent frontend users from updating the 'plan' column
-- Only service_role (edge functions) should be able to change the plan
CREATE OR REPLACE FUNCTION public.prevent_plan_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If plan is being changed and the request is NOT from service_role
  IF NEW.plan IS DISTINCT FROM OLD.plan THEN
    -- Check if current role is service_role (edge functions use this)
    IF current_setting('role', true) != 'service_role' THEN
      RAISE EXCEPTION 'Plan changes are not allowed from client. Use the payment system.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Attach trigger to profiles table
DROP TRIGGER IF EXISTS guard_plan_update ON public.profiles;
CREATE TRIGGER guard_plan_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_plan_update();
