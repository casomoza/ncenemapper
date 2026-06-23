ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS dual_enrollment boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS de_hs_year smallint,
  ADD COLUMN IF NOT EXISTS de_hs_semester text;

COMMENT ON COLUMN courses.dual_enrollment IS 'True if this course is available via high-school dual enrollment';
COMMENT ON COLUMN courses.de_hs_year IS 'High-school grade year the DE course is typically offered (9–12)';
COMMENT ON COLUMN courses.de_hs_semester IS 'High-school semester the DE course is typically offered (Fall / Spring)';
