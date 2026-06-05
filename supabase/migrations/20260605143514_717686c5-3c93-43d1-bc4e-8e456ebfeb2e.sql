ALTER TABLE public.ge_areas DROP CONSTRAINT ge_areas_area_code_key;
ALTER TABLE public.ge_areas ADD CONSTRAINT ge_areas_system_area_code_key UNIQUE (system, area_code);