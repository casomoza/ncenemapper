import { supabase } from "@/integrations/supabase/client";
import type { Course, Program } from "@/lib/program";

export type DbProgram = {
  id: string;
  slug: string;
  name: string;
  degree_type: string;
  total_units: number;
  description: string | null;
  outcomes: string[];
  cluster: string | null;
};

export type DbCourse = {
  id: string;
  program_id: string;
  code: string;
  title: string;
  units: number;
  year: number;
  semester: string;
  category: string;
  prerequisite: string | null;
  satisfies: string[];
  description: string | null;
  optional: boolean;
  note: string | null;
  sort_order: number;
};

function toProgram(p: DbProgram, courses: DbCourse[]): Program {
  return {
    id: p.slug,
    name: p.name,
    degreeType: p.degree_type,
    totalUnits: p.total_units,
    description: p.description ?? "",
    outcomes: p.outcomes ?? [],
    cluster: p.cluster ?? "",
    courses: courses.map(toCourse),
  };
}

function toCourse(c: DbCourse): Course {
  return {
    code: c.code,
    title: c.title,
    units: c.units,
    year: c.year,
    semester: c.semester as Course["semester"],
    category: (c.category as Course["category"]) ?? "core",
    prerequisite: c.prerequisite,
    satisfies: c.satisfies ?? [],
    description: c.description,
    optional: c.optional,
    note: c.note ?? undefined,
  };
}

export async function fetchPrograms(): Promise<Program[]> {
  const { data: progs, error } = await supabase
    .from("programs")
    .select("*")
    .order("name");
  if (error) throw error;
  const { data: courses, error: cErr } = await supabase
    .from("courses")
    .select("*")
    .order("sort_order");
  if (cErr) throw cErr;
  return (progs as DbProgram[]).map((p) =>
    toProgram(
      p,
      (courses as DbCourse[]).filter((c) => c.program_id === p.id),
    ),
  );
}

export async function fetchProgramBySlug(slug: string): Promise<Program | null> {
  const { data: prog, error } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!prog) return null;
  const { data: courses, error: cErr } = await supabase
    .from("courses")
    .select("*")
    .eq("program_id", (prog as DbProgram).id)
    .order("sort_order");
  if (cErr) throw cErr;
  return toProgram(prog as DbProgram, (courses as DbCourse[]) ?? []);
}

export async function fetchDbProgramBySlug(slug: string): Promise<DbProgram | null> {
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as DbProgram) ?? null;
}

export async function fetchDbCourses(programId: string): Promise<DbCourse[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("program_id", programId)
    .order("sort_order");
  if (error) throw error;
  return (data as DbCourse[]) ?? [];
}
