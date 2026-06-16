-- Course catalog table — stores courses parsed from the annual PDF catalog.
-- Allows the admin to upload each year's catalog without code changes or redeployment.

CREATE TABLE IF NOT EXISTS public.catalog_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  title text NOT NULL,
  units numeric NOT NULL DEFAULT 0,
  prerequisite text,
  description text,
  catalog_year text NOT NULL DEFAULT '2026-2027',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(code, catalog_year)
);

GRANT SELECT ON public.catalog_courses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.catalog_courses TO authenticated;
GRANT ALL ON public.catalog_courses TO service_role;

ALTER TABLE public.catalog_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Catalog courses are publicly readable"
  ON public.catalog_courses FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage catalog courses"
  ON public.catalog_courses FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
