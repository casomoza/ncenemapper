export const NORCO_SCHOOLS = [
  "School of Applied Technologies & Apprenticeships",
  "School of Business & Management",
  "School of Communication, Humanities & Languages",
  "School of Human & Public Services",
  "School of Math, Engineering, Computer Science & Game Development",
  "School of Natural Sciences, Health & Kinesiology",
  "School of Social & Behavioral Sciences",
  "School of Visual & Performing Arts",
  "NC & UCR Bourns College of Engineering Transfer Pathway",
] as const;

export type NorcoSchool = (typeof NORCO_SCHOOLS)[number];

/** Map a stored cluster value (possibly missing "School of ") to its canonical school name. */
export function normalizeCluster(raw: string): string {
  const v = raw?.trim();
  if (!v) return "Unassigned";
  const list = NORCO_SCHOOLS as readonly string[];
  if (list.includes(v)) return v;
  if (list.includes(`School of ${v}`)) return `School of ${v}`;
  const tail = v.replace(/^School of /i, "");
  return NORCO_SCHOOLS.find((s) => s.replace(/^School of /i, "") === tail) ?? v;
}
