export const NORCO_SCHOOLS = [
  "School of Applied Technologies & Apprenticeships",
  "School of Business & Management",
  "School of Communication, Humanities & Languages",
  "School of Human & Public Services",
  "School of Math, Engineering, Computer Science & Game Development",
  "School of Natural Sciences, Health & Kinesiology",
  "School of Social & Behavioral Sciences",
  "School of Visual & Performing Arts",
] as const;

export type NorcoSchool = (typeof NORCO_SCHOOLS)[number];
