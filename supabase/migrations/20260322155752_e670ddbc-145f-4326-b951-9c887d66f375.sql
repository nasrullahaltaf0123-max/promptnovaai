
-- Force payments to always insert with status='pending' and verified_at=NULL
CREATE OR REPLACE FUNCTION public.enforce_pending_payment_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF current_setting('role', true) != 'service_role' THEN
    NEW.status := 'pending';
    NEW.verified_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_pending_payment
  BEFORE INSERT ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_pending_payment_insert();
