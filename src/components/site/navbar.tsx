import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/data/gencb";
import { GlobalSearch } from "@/components/site/global-search";
import logoAsset from "@/assets/logo-gencb.png.asset.json";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem("gencb-theme");
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("gencb-theme", next ? "dark" : "light");
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-soft" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logoAsset.url}
            alt="Logo Generasi Cerdas Beraksi"
            width={44}
            height={44}
            className="size-11 object-contain"
          />
          <span className="hidden font-display text-sm font-bold leading-tight sm:block">
            GEN-CB
            <span className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Generasi Cerdas Beraksi
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <GlobalSearch />
          <Button variant="ghost" size="icon" aria-label="Ubah tema" onClick={toggleTheme}>
            {dark ? <Sun /> : <Moon />}
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex">
            <Link to="/dashboard" search={{ id: undefined }}>
              Dashboard
            </Link>
          </Button>
          <Button asChild variant="hero" size="sm" className="hidden sm:inline-flex">
            <Link to="/event">Daftar Kegiatan</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Buka menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {open ? (
        <div className="glass border-t border-border/40 px-4 pb-6 pt-2 lg:hidden">
          <div className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}