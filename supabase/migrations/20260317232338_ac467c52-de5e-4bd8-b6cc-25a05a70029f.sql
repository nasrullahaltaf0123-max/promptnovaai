-- Add RLS policies to study_history
CREATE POLICY "Users can read own study history" ON public.study_history
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study history" ON public.study_history
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own study history" ON public.study_history
  FOR DELETE TO authenticated USING (auth.uid() = user_id);