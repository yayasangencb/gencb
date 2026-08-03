import { useEffect, useState } from "react";

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "PANITIA";

export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  event?: string | undefined;
  active: boolean;
};

export const roleLabel: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
  PANITIA: "Panitia",
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
  | "live";

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
];

export const rolePermissions: Record<AdminRole, AdminModule[]> = {
  SUPER_ADMIN: ALL,
  ADMIN: ALL.filter((m) => m !== "user"),
  EDITOR: ["overview", "berita", "galeri"],
  PANITIA: ["overview", "event", "pendaftar", "absensi", "sertifikat", "live"],
};

export const demoAccounts: AdminAccount[] = [
  {
    id: "u-1",
    name: "Ahmad Fauzan",
    email: "superadmin@gencb.or.id",
    password: "gencb123",
    role: "SUPER_ADMIN",
    active: true,
  },
  {
    id: "u-2",
    name: "Nabila Rahmawati",
    email: "admin@gencb.or.id",
    password: "gencb123",
    role: "ADMIN",
    active: true,
  },
  {
    id: "u-3",
    name: "Intan Permata",
    email: "editor@gencb.or.id",
    password: "gencb123",
    role: "EDITOR",
    active: true,
  },
  {
    id: "u-4",
    name: "Bagas Saputra",
    email: "panitia@gencb.or.id",
    password: "gencb123",
    role: "PANITIA",
    event: "mtq-desa-sasak-panjang",
    active: true,
  },
];

export type AdminSession = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  event?: string | undefined;
};

const SESSION_KEY = "gencb-admin-session";
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function readSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AdminSession) : null;
  } catch {
    return null;
  }
}

export function loginAdmin(email: string, password: string, accounts: AdminAccount[] = demoAccounts) {
  const found = accounts.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password && a.active,
  );
  if (!found) return null;
  const session: AdminSession = {
    id: found.id,
    name: found.name,
    email: found.email,
    role: found.role,
    event: found.event,
  };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  emit();
  return session;
}

export function logoutAdmin() {
  window.localStorage.removeItem(SESSION_KEY);
  emit();
}

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setSession(readSession());
    sync();
    setReady(true);
    listeners.add(sync);
    window.addEventListener("storage", sync);
    return () => {
      listeners.delete(sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return {
    session,
    ready,
    can: (m: AdminModule) => !!session && rolePermissions[session.role].includes(m),
  };
}