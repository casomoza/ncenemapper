import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error("Could not verify admin role");
  if (!data) throw new Error("Forbidden: admin role required");
}

export type AdminUser = { userId: string; email: string; confirmed: boolean };

export const listAdmins = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUser[]> => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: roles, error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");
    if (rolesError) throw new Error(rolesError.message);
    const ids = new Set((roles ?? []).map((r) => r.user_id));
    if (ids.size === 0) return [];

    const emails = new Map<string, { email: string; confirmed: boolean }>();
    for (let page = 1; page <= 10; page++) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw new Error(error.message);
      for (const u of data.users) {
        emails.set(u.id, {
          email: u.email ?? "(no email)",
          confirmed: !!(u.email_confirmed_at || u.last_sign_in_at),
        });
      }
      if (data.users.length < 200) break;
    }

    return [...ids].map((id) => ({
      userId: id,
      email: emails.get(id)?.email ?? "(unknown user)",
      confirmed: emails.get(id)?.confirmed ?? false,
    })).sort((a, b) => a.email.localeCompare(b.email));
  });

export const inviteAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { email: string; redirectTo?: string }) => {
    const email = (input?.email ?? "").trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Enter a valid email address");
    return { email, redirectTo: input.redirectTo };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let userId: string | null = null;
    let invited = false;

    const { data: inviteData, error: inviteError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, {
        redirectTo: data.redirectTo,
      });

    if (inviteError) {
      // Likely already registered — find the existing user instead.
      for (let page = 1; page <= 10 && !userId; page++) {
        const { data: list, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
        if (error) throw new Error(error.message);
        const found = list.users.find((u) => (u.email ?? "").toLowerCase() === data.email);
        if (found) userId = found.id;
        if (list.users.length < 200) break;
      }
      if (!userId) throw new Error(inviteError.message);
    } else {
      userId = inviteData.user?.id ?? null;
      invited = true;
    }

    if (!userId) throw new Error("Could not resolve the invited user");

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
    if (roleError) throw new Error(roleError.message);

    return { ok: true, invited, email: data.email };
  });

export const revokeAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string }) => {
    if (!input?.userId) throw new Error("Missing user id");
    return { userId: input.userId };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.userId === context.userId) {
      throw new Error("You cannot revoke your own admin access");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId)
      .eq("role", "admin");
    if (error) throw new Error(error.message);
    return { ok: true };
  });
