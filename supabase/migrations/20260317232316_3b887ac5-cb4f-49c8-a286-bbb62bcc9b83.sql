-- Payment history table
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'BDT',
  method text NOT NULL DEFAULT 'bkash',
  status text NOT NULL DEFAULT 'pending',
  transaction_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  verified_at timestamptz
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own payments" ON public.payments
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments" ON public.payments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);