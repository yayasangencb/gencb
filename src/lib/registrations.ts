export type VerificationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type Registration = {
  id: string;
  number: string;
  eventSlug: string;
  eventTitle: string;
  eventDate: string;
  fullName: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  address: string;
  rw: string;
  phone: string;
  email: string;
  school: string;
  competition: string;
  documents: { ktp: string; kk: string; photo: string; payment: string };
  status: VerificationStatus;
  createdAt: string;
  certificate?: string;
};

const KEY = "gencb-registrations";

export function generateParticipantNumber(existing: number) {
  const year = new Date().getFullYear();
  const seq = String(existing + 1 + Math.floor(Math.random() * 40)).padStart(4, "0");
  return `GENCB-${year}-${seq}`;
}

export function listRegistrations(): Registration[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Registration[]) : [];
  } catch {
    return [];
  }
}

export function saveRegistration(
  data: Omit<Registration, "id" | "number" | "status" | "createdAt">,
): Registration {
  const all = listRegistrations();
  const entry: Registration = {
    ...data,
    id: crypto.randomUUID(),
    number: generateParticipantNumber(all.length),
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };
  const next = [entry, ...all];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("gencb-registrations-changed"));
  return entry;
}

export function getRegistration(id: string) {
  return listRegistrations().find((r) => r.id === id);
}

export const statusLabel: Record<VerificationStatus, string> = {
  PENDING: "Menunggu Verifikasi",
  ACCEPTED: "Diterima",
  REJECTED: "Ditolak",
};