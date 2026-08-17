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

const SESSION_STORAGE_KEY = "gencb-admin-session";

export async function loginAdmin(emailRaw: string, passwordRaw: string) {
  const email = emailRaw.trim().toLowerCase();
  const password = passwordRaw.trim();

  if (!email || !password) {
    return { session: null, error: "Email dan kata sandi wajib diisi." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data?.user) {
    return { session: null, error: "Email atau kata sandi salah." };
  }

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id);
  const dbRoles = (roles ?? []).map((r) => r.role as string);

  let role: AdminRole | null = null;
  if (dbRoles.includes("super_admin")) role = "SUPER_ADMIN";
  else if (dbRoles.includes("admin")) role = "ADMIN";
  else if (dbRoles.includes("editor")) role = "EDITOR";
  else if (dbRoles.includes("panitia")) role = "PANITIA";

  if (!role) {
    await supabase.auth.signOut();
    return { session: null, error: "Akun ini tidak memiliki akses ke panel pengelola." };
  }

  const session: AdminSession = {
    id: data.user.id,
    name:
      (data.user.user_metadata?.["full_name"] as string | undefined) ||
      email.split("@")[0] ||
      "Pengelola",
    email: data.user.email ?? email,
    role,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }
  return { session, error: null };
}

export async function logoutAdmin() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore
  }
}

export async function loadAdminSession(): Promise<AdminSession | null> {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AdminSession;
        if (parsed && parsed.role) return parsed;
      }
    } catch {
      // Fallthrough
    }
  }

  try {
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

    const role: AdminRole = adminRoles.includes("SUPER_ADMIN")
      ? "SUPER_ADMIN"
      : adminRoles.includes("ADMIN")
        ? "ADMIN"
        : adminRoles.includes("EDITOR")
          ? "EDITOR"
          : adminRoles.includes("PANITIA")
            ? "PANITIA"
            : "ADMIN";

    const { data: profile } = await supabase
      .from("users_profile")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    const session: AdminSession = {
      id: user.id,
      name: profile?.full_name || user.email || "Pengelola",
      email: user.email ?? "",
      role,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }
    return session;
  } catch {
    return null;
  }
}

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(SESSION_STORAGE_KEY);
        if (raw) return JSON.parse(raw) as AdminSession;
      } catch {
        // empty
      }
    }
    return null;
  });
  const [ready, setReady] = useState(true);

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
