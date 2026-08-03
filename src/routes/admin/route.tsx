import { useEffect } from "react";
import { Outlet, createFileRoute, useLocation, useNavigate } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminSession } from "@/lib/admin/auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel Admin — GEN-CB" },
      { name: "description", content: "Panel pengelolaan konten, event, peserta, dan donasi GEN-CB." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Panel Admin — GEN-CB" },
      { property: "og:description", content: "Area terbatas pengelola Yayasan Generasi Cerdas Beraksi." },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { session, ready } = useAdminSession();
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/admin/login";

  useEffect(() => {
    if (ready && !session && !isLogin) {
      navigate({ to: "/admin/login", replace: true });
    }
    if (ready && session && isLogin) {
      navigate({ to: "/admin", replace: true });
    }
  }, [ready, session, isLogin, navigate]);

  if (isLogin) return <Outlet />;

  if (!ready || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <p className="text-sm text-muted-foreground">Memeriksa sesi admin...</p>
      </div>
    );
  }

  return (
    <AdminShell session={session}>
      <Outlet />
    </AdminShell>
  );
}