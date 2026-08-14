import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, UserPlus, UserCog, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { RequireModule } from "@/components/admin/guard";
import { supabase } from "@/integrations/supabase/client";
import { roleLabel, type AdminRole } from "@/lib/admin/auth";

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

type AdminAccount = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string | null;
  roles: string[];
  isActive: boolean;
};

const DEFAULT_ACCOUNTS: AdminAccount[] = [
  {
    id: "u-super",
    name: "Super Admin Yayasan",
    email: "superadmin@gencb.or.id",
    phone: "+62 812-1111-2222",
    createdAt: "2026-01-01T00:00:00Z",
    roles: ["super_admin"],
    isActive: true,
  },
  {
    id: "u-admin",
    name: "Admin Utama GEN-CB",
    email: "admin@gencb.or.id",
    phone: "+62 857-7220-2454",
    createdAt: "2026-01-15T00:00:00Z",
    roles: ["admin"],
    isActive: true,
  },
  {
    id: "u-editor",
    name: "Editor Konten",
    email: "editor@gencb.or.id",
    phone: "+62 813-3333-4444",
    createdAt: "2026-02-01T00:00:00Z",
    roles: ["editor"],
    isActive: true,
  },
  {
    id: "u-panitia",
    name: "Panitia Event & Absensi",
    email: "panitia@gencb.or.id",
    phone: "+62 814-5555-6666",
    createdAt: "2026-03-01T00:00:00Z",
    roles: ["panitia"],
    isActive: true,
  },
];

const dbRoleLabel: Record<string, string> = {
  super_admin: roleLabel.SUPER_ADMIN,
  admin: roleLabel.ADMIN,
  editor: roleLabel.EDITOR,
  panitia: roleLabel.PANITIA,
  peserta: "Peserta",
};

function UserPage() {
  const [localAccounts, setLocalAccounts] = useState<AdminAccount[]>(DEFAULT_ACCOUNTS);
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminAccount | null>(null);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRole, setFormRole] = useState<string>("admin");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin", "accounts"],
    queryFn: async () => {
      try {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("user_id, role, created_at")
          .order("created_at", { ascending: true });

        const ids = [...new Set((roles ?? []).map((r) => r.user_id))];
        if (!ids.length) return localAccounts;

        const { data: profiles } = await supabase
          .from("users_profile")
          .select("id, full_name, phone, created_at")
          .in("id", ids);

        const fetched: AdminAccount[] = ids.map((id) => {
          const profile = profiles?.find((p) => p.id === id);
          return {
            id,
            name: profile?.full_name ?? "Pengelola",
            email: `${id}@gencb.or.id`,
            phone: profile?.phone ?? "-",
            createdAt: profile?.created_at ?? null,
            roles: (roles ?? []).filter((r) => r.user_id === id).map((r) => r.role as string),
            isActive: true,
          };
        });

        // Merge fetched accounts with local demo accounts to ensure all roles are present
        const merged = [...fetched];
        DEFAULT_ACCOUNTS.forEach((d) => {
          if (!merged.some((m) => m.id === d.id || m.email === d.email)) {
            merged.push(d);
          }
        });
        return merged;
      } catch {
        return localAccounts;
      }
    },
  });

  const accountsList = data || localAccounts;

  const openAddModal = () => {
    setEditingUser(null);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormRole("admin");
    setOpenModal(true);
  };

  const openEditModal = (user: AdminAccount) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPhone(user.phone);
    setFormRole(user.roles[0] || "admin");
    setOpenModal(true);
  };

  const handleSaveUser = async () => {
    if (!formName.trim() || !formEmail.trim()) {
      toast.error("Nama dan Email wajib diisi");
      return;
    }

    if (editingUser) {
      // Update role
      const updated = accountsList.map((u) =>
        u.id === editingUser.id
          ? { ...u, name: formName, email: formEmail, phone: formPhone, roles: [formRole] }
          : u,
      );
      setLocalAccounts(updated);

      try {
        await supabase
          .from("user_roles")
          .update({ role: formRole as "super_admin" | "admin" | "editor" | "panitia" | "peserta" })
          .eq("user_id", editingUser.id);
      } catch {
        // ignore
      }

      toast.success(`Akun ${formName} berhasil diperbarui`);
    } else {
      // Create new user
      const newAcc: AdminAccount = {
        id: `u-${Date.now()}`,
        name: formName,
        email: formEmail,
        phone: formPhone || "-",
        createdAt: new Date().toISOString(),
        roles: [formRole],
        isActive: true,
      };
      setLocalAccounts([newAcc, ...accountsList]);
      toast.success(`Akun pengelola ${formName} ditambahkan`);
    }

    setOpenModal(false);
    void refetch();
  };

  const toggleUserActive = (userId: string) => {
    const next = accountsList.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u));
    setLocalAccounts(next);
    toast.success("Status akun diperbarui");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Kelola User & Peran</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Atur akun pengelola yayasan dan sesuaikan hak akses (Super Admin, Admin, Editor, Panitia).
          </p>
        </div>
        <Button onClick={openAddModal} className="rounded-full gap-1.5">
          <UserPlus className="size-4" /> Tambah User Pengelola
        </Button>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          Khusus <strong>Super Admin</strong> yang memiliki wewenang menambah user baru dan mengubah peran akses akun lain.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Pengelola</th>
                <th className="px-4 py-3">Peran Akses</th>
                <th className="px-4 py-3">Kontak</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {accountsList.map((u) => (
                <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map((r) => (
                        <Badge key={r} variant={r === "super_admin" ? "default" : "secondary"}>
                          {dbRoleLabel[r] ?? r}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.phone}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.isActive ? "default" : "destructive"}>
                      {u.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1 text-xs"
                      onClick={() => openEditModal(u)}
                    >
                      <UserCog className="size-3.5" /> Ubah Peran
                    </Button>
                    {u.id !== "u-super" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className={`h-8 gap-1 text-xs ${u.isActive ? "text-destructive" : "text-emerald-600"}`}
                        onClick={() => toggleUserActive(u.id)}
                      >
                        {u.isActive ? <UserX className="size-3.5" /> : <UserCheck className="size-3.5" />}
                        {u.isActive ? "Nonaktifkan" : "Aktifkan"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Ubah Peran User" : "Tambah User Pengelola"}</DialogTitle>
            <DialogDescription>
              Tentukan email, nama, dan tingkat hak akses pengelola di panel admin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="u-name">Nama Lengkap</Label>
              <Input
                id="u-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Contoh: Ahmad Fauzan"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="u-email">Email Akun</Label>
              <Input
                id="u-email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="ahmad@gencb.or.id"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="u-phone">Nomor HP / WhatsApp</Label>
              <Input
                id="u-phone"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="+62 812-3456-7890"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="u-role">Peran Akses (Role)</Label>
              <Select value={formRole} onValueChange={setFormRole}>
                <SelectTrigger id="u-role">
                  <SelectValue placeholder="Pilih Peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin (Akses Penuh + Kelola User)</SelectItem>
                  <SelectItem value="admin">Admin (Akses Semua Modul Konten & Event)</SelectItem>
                  <SelectItem value="editor">Editor (Hanya Berita & Galeri)</SelectItem>
                  <SelectItem value="panitia">Panitia (Event, Pendaftar, Absensi, Sertifikat)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenModal(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveUser}>Simpan Pengelola</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
