
CREATE TABLE public.ge_areas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  area_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT '',
  units_note TEXT NOT NULL DEFAULT '',
  courses TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ge_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "GE areas are publicly readable"
  ON public.ge_areas FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert GE areas"
  ON public.ge_areas FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update GE areas"
  ON public.ge_areas FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete GE areas"
  ON public.ge_areas FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER ge_areas_set_updated_at
  BEFORE UPDATE ON public.ge_areas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
