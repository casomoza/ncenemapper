import { supabase } from "@/integrations/supabase/client";

export const SHOW_ASSOCIATE_MAPS_KEY = "show_associate_maps";
export const SHOW_UCR_TRANSFER_KEY = "show_ucr_transfer_maps";

export const UCR_TRANSFER_CLUSTER =
  "NC & UCR Bourns College of Engineering Transfer Pathway";

/** True if the program belongs to the dedicated UCR transfer cluster. */
export function isUcrTransferProgram(cluster: string): boolean {
  return (cluster ?? "").trim() === UCR_TRANSFER_CLUSTER;
}

/** True when the program is an associate degree (A.S./A.A.) and not also a certificate. */
export function isAssociateOnlyProgram(degreeType: string): boolean {
  const d = degreeType ?? "";
  return /A\.[SA]\./i.test(d) && !/cert/i.test(d);
}

/** True when a program offers both an associate degree and a certificate. */
export function isDualProgram(degreeType: string): boolean {
  const d = degreeType ?? "";
  return /A\.[SA]\./i.test(d) && /cert/i.test(d);
}

type CourseLike = {
  code: string;
  units: number;
  category?: string;
  satisfies?: string[];
};

/**
 * Courses that belong to the certificate track: any non-GE course, plus any
 * course explicitly tagged as satisfying a certificate requirement.
 */
export function certificateOnlyCourses<T extends CourseLike>(courses: T[]): T[] {
  return (courses ?? []).filter((c) => {
    const isGe =
      c.category === "ge" || /^(RCCD GE\s|CalGETC\s|Cal-GETC\s)/i.test(c.code ?? "");
    if (!isGe) return true;
    return (c.satisfies ?? []).some((s) => /\bcert\b/i.test(s));
  });
}

export async function fetchSiteSetting(key: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("bool_value")
    .eq("key", key)
    .maybeSingle();
  if (error) return false;
  return !!(data as { bool_value: boolean } | null)?.bool_value;
}

export async function setSiteSetting(key: string, value: boolean): Promise<void> {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, bool_value: value }, { onConflict: "key" });
  if (error) throw error;
}
