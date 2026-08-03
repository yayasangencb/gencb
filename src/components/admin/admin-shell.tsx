import { useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Newspaper,
  Radio,
  ScanLine,
  Award,
  HandCoins,
  Handshake,
  Sparkles,
  Sun,
  Users,
  UserCog,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo-gencb.png";
import { logoutAdmin, roleLabel, rolePermissions, type AdminModule, type AdminSession } from "@/lib/admin/auth";

const menu: { to: string; label: string; module: AdminModule; icon: typeof LayoutDashboard }[] = [
  { to: "/admin", label: "Overview", module: "overview", icon: LayoutDashboard },
  { to: "/admin/berita", label: "Kelola Berita", module: "berita", icon: Newspaper },
  { to: "/admin/event", label: "Kelola Event", module: "event", icon: CalendarDays },
  { to: "/admin/program", label: "Kelola Program", module: "program", icon: Sparkles },
  { to: "/admin/banner", label: "Banner / Hero", module: "banner", icon: ImageIcon },
  { to: "/admin/galeri", label: "Kelola Galeri", module: "galeri", icon: ImageIcon },
  { to: "/admin/sponsor", label: "Sponsor & Mitra", module: "sponsor", icon: Handshake },
  { to: "/admin/pendaftar", label: "Pendaftar Event", module: "pendaftar", icon: ClipboardList },
  { to: "/admin/sertifikat", label: "Kelola Sertifikat", module: "sertifikat", icon: Award },
  { to: "/admin/absensi", label: "Kelola Absensi", module: "absensi", icon: ScanLine },
  { to: "/admin/donasi", label: "Kelola Donasi", module: "donasi", icon: HandCoins },
  { to: "/admin/user", label: "Kelola User", module: "user", icon: UserCog },
  { to: "/admin/notifikasi", label: "Notifikasi", module: "notifikasi", icon: Bell },
  { to: "/admin/live", label: "Live Event Monitor", module: "live", icon: Radio },
];

export function AdminShell({
  session,
  children,
}: {
  session: AdminSession;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const allowed = rolePermissions[session.role];
  const visible = menu.filter((m) => allowed.includes(m.module));

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
      {visible.map((item) => {
        const active =
          item.to === "/admin"
            ? location.pathname === "/admin"
            : location.pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {!collapsed ? <span className="truncate">{item.label}</span> : null}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-card transition-all lg:flex",
          collapsed ? "w-[76px]" : "w-64",
        )}
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-4">
          <img src={logo} alt="Logo GEN-CB" className="size-9 rounded-lg object-contain" />
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold">GEN-CB Admin</p>
              <p className="truncate text-[11px] text-muted-foreground">Panel Pengelolaan</p>
            </div>
          ) : null}
        </div>
        {nav}
        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={() => setCollapsed((c) => !c)}
          >
            <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
            {!collapsed ? <span className="ml-1">Ciutkan</span> : null}
          </Button>
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Tutup menu"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-64 flex-col bg-card">
            <div className="flex items-center gap-2 border-b border-border px-4 py-4">
              <img src={logo} alt="Logo GEN-CB" className="size-9 rounded-lg object-contain" />
              <p className="font-display text-sm font-bold">GEN-CB Admin</p>
            </div>
            {nav}
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Dashboard Admin GEN-CB</p>
            <p className="truncate text-xs text-muted-foreground">
              Selamat datang kembali, {session.name}
            </p>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            {roleLabel[session.role]}
          </Badge>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Ganti tema">
            <Sun className="size-5 dark:hidden" />
            <Moon className="hidden size-5 dark:block" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifikasi" className="relative">
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-accent" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 rounded-full">
                <Users className="size-4" />
                <span className="hidden max-w-[120px] truncate sm:inline">{session.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-sm font-semibold">{session.name}</p>
                <p className="text-xs font-normal text-muted-foreground">{session.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/">Lihat situs publik</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  logoutAdmin();
                  navigate({ to: "/admin/login" });
                }}
              >
                <LogOut className="mr-2 size-4" /> Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}