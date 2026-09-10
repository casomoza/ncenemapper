CREATE TABLE public.prereq_concurrency (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_code text NOT NULL,
  prereq_code text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_code, prereq_code)
);

GRANT SELECT ON public.prereq_concurrency TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prereq_concurrency TO authenticated;
GRANT ALL ON public.prereq_concurrency TO service_role;

ALTER TABLE public.prereq_concurrency ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Concurrency pairs are publicly readable"
  ON public.prereq_concurrency FOR SELECT USING (true);
CREATE POLICY "Admins can insert concurrency pairs"
  ON public.prereq_concurrency FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update concurrency pairs"
  ON public.prereq_concurrency FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete concurrency pairs"
  ON public.prereq_concurrency FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER prereq_concurrency_updated_at
  BEFORE UPDATE ON public.prereq_concurrency
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();