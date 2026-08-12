import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RequireModule } from "@/components/admin/guard";
import { supabase } from "@/integrations/supabase/client";
import { roleLabel } from "@/lib/admin/auth";

export const Route = createFileRoute("/admin/user")({
  head: () => ({
    meta: [
      { title: "Kelola User — Admin GEN-CB" },
      { name: "description", content: "Daftar akun pengelola beserta perannya di sistem GEN-CB." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Kelola User — Admin GEN-CB" },
      { property: "og:description", content: "Manajemen akun dan hak akses pengguna." },
    ],
  }),
  component: () => (
    <RequireModule module="user">
      <UserPage />
    </RequireModule>
  ),
});

const dbRoleLabel: Record<string, string> = {
  super_admin: roleLabel.SUPER_ADMIN,
  admin: roleLabel.ADMIN,
  editor: roleLabel.EDITOR,
  panitia: roleLabel.PANITIA,
  peserta: "Peserta",
};

function UserPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "accounts"],
    queryFn: async () => {
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role, created_at")
        .order("created_at", { ascending: true });
      if (rolesError) throw rolesError;

      const ids = [...new Set((roles ?? []).map((r) => r.user_id))];
      if (!ids.length) return [];

      const { data: profiles, error: profileError } = await supabase
        .from("users_profile")
        .select("id, full_name, phone, created_at")
        .in("id", ids);
      if (profileError) throw profileError;

      return ids.map((id) => {
        const profile = profiles?.find((p) => p.id === id);
        return {
          id,
          name: profile?.full_name ?? "Tanpa nama",
          phone: profile?.phone ?? "-",
          createdAt: profile?.created_at ?? null,
          roles: (roles ?? []).filter((r) => r.user_id === id).map((r) => r.role as string),
        };
      });
    },
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Kelola User</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Daftar akun yang terdaftar pada sistem beserta peran aksesnya.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          Pendaftaran akun pengelola tidak dibuka untuk publik. Saat ini sistem dijalankan oleh satu
          akun Super Admin resmi yayasan.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ) : error ? (
        <p className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Gagal memuat data akun. Coba muat ulang halaman.
        </p>
      ) : !data?.length ? (
        <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Belum ada akun terdaftar.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Peran</th>
                <th className="px-4 py-3">Kontak</th>
                <th className="px-4 py-3">Terdaftar</th>
              </tr>
            </thead>
            <tbody>
              {data.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map((r) => (
                        <Badge key={r} variant="secondary">
                          {dbRoleLabel[r] ?? r}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.phone}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {u.createdAt
                      ? new Intl.DateTimeFormat("id-ID", {
                          dateStyle: "medium",
                          timeZone: "Asia/Jakarta",
                        }).format(new Date(u.createdAt))
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
