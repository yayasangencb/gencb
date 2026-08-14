import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoAsset from "@/assets/logo-gencb.png.asset.json";
const logo = logoAsset.url;
import { loginAdmin } from "@/lib/admin/auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Login Admin — GEN-CB" },
      { name: "description", content: "Masuk ke panel pengelolaan GEN-CB untuk admin, editor, dan panitia." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Login Admin — GEN-CB" },
      { property: "og:description", content: "Halaman masuk khusus pengelola GEN-CB." },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { session, error: loginError } = await loginAdmin(email, password);
      if (!session) {
        setError(loginError ?? "Email atau kata sandi tidak valid.");
        toast.error("Gagal masuk");
        return;
      }
      toast.success(`Selamat datang, ${session.name}`);
      navigate({ to: "/admin", replace: true });
    } catch {
      setError("Terjadi kesalahan saat masuk. Periksa kembali email & kata sandi.");
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-gradient-brand p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo GEN-CB" className="size-12 rounded-xl bg-white/90 object-contain p-1" />
          <div>
            <p className="font-display text-lg font-bold">GEN-CB</p>
            <p className="text-xs opacity-80">Generasi Cerdas Beraksi</p>
          </div>
        </div>
        <div>
          <h1 className="max-w-md font-display text-3xl font-bold">Panel Pengelolaan Yayasan</h1>
          <p className="mt-3 max-w-md text-sm opacity-85">
            Kelola berita, event, pendaftar, absensi, sertifikat, dan donasi dalam satu tempat dengan
            hak akses resmi pengelola.
          </p>
        </div>
        <p className="text-xs opacity-70">© 2026 Yayasan Generasi Cerdas Beraksi</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img src={logo} alt="Logo GEN-CB" className="size-10 object-contain" />
            <p className="font-display text-lg font-bold">GEN-CB Admin</p>
          </div>
          <h2 className="font-display text-2xl font-bold">Masuk sebagai pengelola</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Masukkan email dan kata sandi akun admin pengelola Anda.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Admin</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@gencb.or.id"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full rounded-full" disabled={loading}>
              {loading ? "Memproses..." : "Masuk ke Dashboard"}
            </Button>
          </form>
          <p className="mt-8 text-xs text-muted-foreground text-center">
            Akses panel resmi Yayasan Generasi Cerdas Beraksi.
          </p>
        </div>
      </div>
    </div>
  );
}