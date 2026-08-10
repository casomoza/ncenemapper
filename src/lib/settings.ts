import { supabase } from "@/integrations/supabase/client";

export const SHOW_ASSOCIATE_MAPS_KEY = "show_associate_maps";

/** True when the program is an associate degree (A.S./A.A.) and not also a certificate. */
export function isAssociateOnlyProgram(degreeType: string): boolean {
  const d = degreeType ?? "";
  return /A\.[SA]\./i.test(d) && !/cert/i.test(d);
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
