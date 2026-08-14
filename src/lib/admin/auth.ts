import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "PANITIA";

export const roleLabel: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
  PANITIA: "Panitia",
};

const dbRoleToAdminRole: Record<string, AdminRole> = {
  super_admin: "SUPER_ADMIN",
  admin: "ADMIN",
  editor: "EDITOR",
  panitia: "PANITIA",
};

export type AdminModule =
  | "overview"
  | "berita"
  | "event"
  | "program"
  | "banner"
  | "galeri"
  | "sponsor"
  | "pendaftar"
  | "sertifikat"
  | "absensi"
  | "donasi"
  | "user"
  | "notifikasi"
  | "live"
  | "media";

const ALL: AdminModule[] = [
  "overview",
  "berita",
  "event",
  "program",
  "banner",
  "galeri",
  "sponsor",
  "pendaftar",
  "sertifikat",
  "absensi",
  "donasi",
  "user",
  "notifikasi",
  "live",
  "media",
];

export const rolePermissions: Record<AdminRole, AdminModule[]> = {
  SUPER_ADMIN: ALL,
  ADMIN: ALL.filter((m) => m !== "user"),
  EDITOR: ["overview", "berita", "galeri", "media"],
  PANITIA: ["overview", "event", "pendaftar", "absensi", "sertifikat", "live"],
};

export type AdminSession = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
};

export async function loginAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error || !data.user) return { session: null, error: "Email atau kata sandi salah." };
  const admin = await loadAdminSession();
  if (!admin) {
    await supabase.auth.signOut();
    return { session: null, error: "Akun ini tidak memiliki akses ke panel pengelolaan." };
  }
  return { session: admin, error: null };
}

export async function logoutAdmin() {
  await supabase.auth.signOut();
}

export async function loadAdminSession(): Promise<AdminSession | null> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);

  const adminRoles = (roles ?? [])
    .map((r) => dbRoleToAdminRole[r.role as string])
    .filter(Boolean) as AdminRole[];
  if (!adminRoles.length) return null;

  const priority: AdminRole[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "PANITIA"];
  const role = priority.find((r) => adminRoles.includes(r)) ?? adminRoles[0]!;

  const { data: profile } = await supabase
    .from("users_profile")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    name: profile?.full_name || user.email || "Pengelola",
    email: user.email ?? "",
    role,
  };
}

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const next = await loadAdminSession();
    setSession(next);
    setReady(true);
  }, []);

  useEffect(() => {
    let active = true;
    void loadAdminSession().then((next) => {
      if (!active) return;
      setSession(next);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      void refresh();
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [refresh]);

  return {
    session,
    ready,
    refresh,
    can: (m: AdminModule) => !!session && rolePermissions[session.role].includes(m),
  };
}
