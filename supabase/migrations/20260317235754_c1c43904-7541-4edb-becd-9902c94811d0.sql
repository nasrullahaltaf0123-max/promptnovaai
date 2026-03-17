
-- Fix search_path on prevent_plan_update function
CREATE OR REPLACE FUNCTION public.prevent_plan_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.plan IS DISTINCT FROM OLD.plan THEN
    IF current_setting('role', true) != 'service_role' THEN
      RAISE EXCEPTION 'Plan changes are not allowed from client. Use the payment system.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
