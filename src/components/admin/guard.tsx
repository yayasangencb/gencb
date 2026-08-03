import type { ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { useAdminSession, type AdminModule } from "@/lib/admin/auth";

export function RequireModule({ module, children }: { module: AdminModule; children: ReactNode }) {
  const { session, ready, can } = useAdminSession();
  if (!ready || !session) return null;
  if (!can(module)) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
        <ShieldAlert className="mx-auto size-10 text-destructive" />
        <h1 className="mt-4 font-display text-lg font-bold">Akses ditolak</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Peran akun Anda tidak memiliki izin untuk membuka modul ini. Hubungi Super Admin bila
          membutuhkan akses.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}