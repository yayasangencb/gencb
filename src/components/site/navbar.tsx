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
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border/80 shadow-md py-1"
          : "bg-transparent py-2",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logoAsset.url}
            alt="Logo Generasi Cerdas Beraksi"
            width={40}
            height={40}
            className="size-10 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="hidden font-display text-base font-bold leading-tight sm:block">
            <span className={cn("transition-colors", scrolled ? "text-foreground" : "text-white")}>
              GEN-CB
            </span>
            <span
              className={cn(
                "block text-[10px] font-medium uppercase tracking-widest transition-colors",
                scrolled ? "text-muted-foreground" : "text-white/80",
              )}
            >
              Generasi Cerdas Beraksi
            </span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const target = link.href || (link as { to?: string }).to || "/";
            return (
              <Link
                key={target}
                to={target}
                activeOptions={{ exact: target === "/" }}
                activeProps={{
                  className: scrolled
                    ? "font-bold text-foreground bg-muted/80"
                    : "font-bold text-white bg-white/20",
                }}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200",
                  scrolled
                    ? "text-foreground/90 hover:text-foreground hover:bg-muted/80"
                    : "text-white/90 hover:text-white hover:bg-white/10",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <GlobalSearch />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Ubah tema"
            onClick={toggleTheme}
            className={cn(
              "rounded-full transition-colors",
              scrolled
                ? "text-foreground hover:bg-muted"
                : "text-white hover:bg-white/15 hover:text-white",
            )}
          >
            {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>

          <Button
            asChild
            variant="hero"
            size="sm"
            className="hidden sm:inline-flex rounded-full px-5"
          >
            <Link to="/event">Daftar Kegiatan</Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "lg:hidden rounded-full transition-colors",
              scrolled ? "text-foreground" : "text-white hover:bg-white/15 hover:text-white",
            )}
            aria-label="Buka menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {open ? (
        <div className="bg-background/98 border-b border-border px-4 pb-6 pt-3 shadow-xl backdrop-blur-lg lg:hidden animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const target = link.href || (link as { to?: string }).to || "/";
              return (
                <Link
                  key={target}
                  to={target}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: target === "/" }}
                  activeProps={{
                    className: "bg-muted text-foreground font-bold",
                  }}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
              <Button asChild variant="hero" className="w-full justify-center">
                <Link to="/event" onClick={() => setOpen(false)}>
                  Daftar Kegiatan
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}