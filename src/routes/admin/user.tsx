import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { RequireModule } from "@/components/admin/guard";
import { ResourceManager } from "@/components/admin/resource-manager";
import { seedUsers, type UserRow } from "@/lib/admin/seed";

export const Route = createFileRoute("/admin/user")({
  head: () => ({
    meta: [
      { title: "Kelola User — Admin GEN-CB" },
      { name: "description", content: "Kelola akun admin, editor, panitia, dan peserta terdaftar GEN-CB." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Kelola User — Admin GEN-CB" },
      { property: "og:description", content: "Manajemen akun dan hak akses pengguna." },
    ],
  }),
  component: () => (
    <RequireModule module="user">
      <ResourceManager<UserRow>
        title="Kelola User"
        description="Khusus Super Admin: kelola akun pengelola beserta peran dan penugasan event."
        storageKey="users"
        seed={seedUsers}
        addLabel="Tambah User"
        searchKeys={["name", "email", "role"]}
        filters={[{ key: "role", label: "Peran", options: ["SUPER_ADMIN", "ADMIN", "EDITOR", "PANITIA"] }]}
        columns={[
          { key: "name", label: "Nama" },
          { key: "email", label: "Email" },
          { key: "role", label: "Peran", render: (r) => <Badge variant="secondary">{r.role}</Badge> },
          { key: "event", label: "Event ditugaskan", render: (r) => r.event ?? "-" },
          { key: "lastLogin", label: "Login terakhir" },
        ]}
        fields={[
          { key: "name", label: "Nama lengkap" },
          { key: "email", label: "Email" },
          { key: "password", label: "Kata sandi" },
          {
            key: "role",
            label: "Peran",
            type: "select",
            options: ["SUPER_ADMIN", "ADMIN", "EDITOR", "PANITIA"],
          },
          { key: "event", label: "Event ditugaskan (panitia)", required: false },
          { key: "lastLogin", label: "Login terakhir", required: false },
        ]}
      />
    </RequireModule>
  ),
});