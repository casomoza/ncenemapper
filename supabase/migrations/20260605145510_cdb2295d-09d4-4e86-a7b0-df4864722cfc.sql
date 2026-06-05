CREATE TABLE public.program_electives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL,
  group_code text NOT NULL,
  title text NOT NULL DEFAULT '',
  units_note text NOT NULL DEFAULT '',
  courses text[] NOT NULL DEFAULT '{}',
  course_descriptions jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (program_id, group_code)
);

GRANT SELECT ON public.program_electives TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.program_electives TO authenticated;
GRANT ALL ON public.program_electives TO service_role;

ALTER TABLE public.program_electives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Program electives are publicly readable"
  ON public.program_electives FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert program electives"
  ON public.program_electives FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update program electives"
  ON public.program_electives FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete program electives"
  ON public.program_electives FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_program_electives_updated_at
  BEFORE UPDATE ON public.program_electives
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();