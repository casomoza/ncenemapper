ALTER TABLE public.program_electives ADD COLUMN IF NOT EXISTS option_terms jsonb NOT NULL DEFAULT '{}'::jsonb;
COMMENT ON COLUMN public.program_electives.option_terms IS 'Per-option term availability: { "<COURSE CODE uppercase>": ["Fall","Spring",...] }';
-- Backfill each option from the terms that same course code already has elsewhere in the catalog.
UPDATE public.program_electives e SET option_terms = COALESCE((
  SELECT jsonb_object_agg(k, terms) FROM (
    SELECT upper(split_part(trim(opt), ' ', 1)) AS k,
      (SELECT to_jsonb(array_agg(DISTINCT t)) FROM public.courses c,
         LATERAL unnest(array_append(c.terms_offered, c.semester)) t
       WHERE upper(trim(c.code)) = upper(split_part(trim(opt), ' ', 1))) AS terms
    FROM unnest(e.courses) opt
  ) s WHERE terms IS NOT NULL
), '{}'::jsonb);