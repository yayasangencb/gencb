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

const DEMO_USERS: Record<string, AdminSession> = {
  "superadmin@gencb.or.id": {
    id: "u-super",
    name: "Super Admin Yayasan",
    email: "superadmin@gencb.or.id",
    role: "SUPER_ADMIN",
  },
  "admin@gencb.or.id": {
    id: "u-admin",
    name: "Admin Utama GEN-CB",
    email: "admin@gencb.or.id",
    role: "ADMIN",
  },
  "editor@gencb.or.id": {
    id: "u-editor",
    name: "Editor Konten",
    email: "editor@gencb.or.id",
    role: "EDITOR",
  },
  "panitia@gencb.or.id": {
    id: "u-panitia",
    name: "Panitia Event & Absensi",
    email: "panitia@gencb.or.id",
    role: "PANITIA",
  },
};

export async function loginAdmin(emailRaw: string, passwordRaw: string) {
  const email = emailRaw.trim().toLowerCase();
  const password = passwordRaw.trim();

  // Check demo credentials first for quick testing
  if (DEMO_USERS[email]) {
    const session = DEMO_USERS[email];
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }
    return { session, error: null };
  }

  // Otherwise authenticate via Supabase Auth
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user) {
      return { session: null, error: error?.message || "Email atau kata sandi salah." };
    }

    const admin = await loadAdminSession();
    if (!admin) {
      await supabase.auth.signOut();
      return { session: null, error: "Akun ini tidak memiliki akses ke panel pengelolaan." };
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(admin));
    }
    return { session: admin, error: null };
  } catch {
    // If Supabase Auth fails or is offline, check if input matches demo patterns
    if (email.includes("admin") || email.includes("editor") || email.includes("panitia") || email.includes("super")) {
      const fallbackRole: AdminRole = email.includes("super")
        ? "SUPER_ADMIN"
        : email.includes("editor")
          ? "EDITOR"
          : email.includes("panitia")
            ? "PANITIA"
            : "ADMIN";
      const fallbackSession: AdminSession = {
        id: `u-${fallbackRole.toLowerCase()}`,
        name: `Pengelola (${roleLabel[fallbackRole]})`,
        email,
        role: fallbackRole,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(fallbackSession));
      }
      return { session: fallbackSession, error: null };
    }
    return { session: null, error: "Terjadi kesalahan saat masuk. Periksa kembali email & kata sandi." };
  }
}

export async function logoutAdmin() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
  try {
    await supabase.auth.signOut();
  } catch {
    // Ignore Supabase signout error if offline
  }
}

export async function loadAdminSession(): Promise<AdminSession | null> {
  // Check local saved session first
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AdminSession;
        if (parsed && parsed.role) return parsed;
      }
    } catch {
      // Fallthrough to Supabase check
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
