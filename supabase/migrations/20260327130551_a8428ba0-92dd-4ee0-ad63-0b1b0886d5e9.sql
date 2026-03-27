
-- Delete duplicate transaction_id rows, keep only the latest one per transaction_id
DELETE FROM public.payments
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY transaction_id ORDER BY created_at DESC) as rn
    FROM public.payments
    WHERE transaction_id IS NOT NULL
  ) sub
  WHERE rn > 1
);

-- Now create the unique index
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_transaction_id_unique
  ON public.payments (transaction_id)
  WHERE transaction_id IS NOT NULL;
