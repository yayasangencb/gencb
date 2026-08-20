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
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-black/95 text-white backdrop-blur-md shadow-xl border-neutral-800"
          : "bg-white/95 text-gray-900 backdrop-blur-md shadow-xs border-gray-100 dark:bg-neutral-950 dark:text-white dark:border-neutral-800"
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
            <span className={scrolled ? "text-white" : "text-gray-900 dark:text-white"}>
              GEN-CB
            </span>
            <span
              className={cn(
                "block text-[10px] font-medium uppercase tracking-widest",
                scrolled ? "text-neutral-400" : "text-gray-500 dark:text-neutral-400"
              )}
            >
              Generasi Cerdas Beraksi
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const target = (link as { to?: string; href?: string }).to || link.href || "/";
            return (
              <Link
                key={target}
                to={target}
                activeOptions={{ exact: target === "/" }}
                activeProps={{
                  className: scrolled ? "text-white font-bold" : "text-emerald-700 font-bold dark:text-emerald-400",
                }}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  scrolled
                    ? "text-neutral-300 hover:text-white hover:bg-white/10"
                    : "text-gray-700 hover:text-black hover:bg-gray-100 dark:text-neutral-200 dark:hover:text-white dark:hover:bg-neutral-800"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <GlobalSearch />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Ubah tema"
            onClick={toggleTheme}
            className={scrolled ? "text-white hover:bg-white/10 hover:text-white" : ""}
          >
            {dark ? <Sun /> : <Moon />}
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={cn(
              "hidden lg:inline-flex",
              scrolled ? "text-white hover:bg-white/10 hover:text-white" : ""
            )}
          >
            <Link to="/dashboard" search={{ id: undefined }}>
              Dashboard
            </Link>
          </Button>
          <Button
            asChild
            variant="hero"
            size="sm"
            className="hidden sm:inline-flex bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-sm"
          >
            <Link to="/event">Daftar Kegiatan</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("lg:hidden", scrolled ? "text-white hover:bg-white/10" : "")}
            aria-label="Buka menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {open ? (
        <div
          className={cn(
            "border-t px-4 pb-6 pt-2 lg:hidden shadow-lg",
            scrolled
              ? "bg-black text-white border-neutral-800"
              : "bg-white text-gray-900 border-gray-100 dark:bg-neutral-950 dark:text-white dark:border-neutral-800"
          )}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const target = (link as { to?: string; href?: string }).to || link.href || "/";
              return (
                <Link
                  key={target}
                  to={target}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                    scrolled
                      ? "hover:bg-neutral-900 text-neutral-200"
                      : "hover:bg-gray-100 text-gray-800 dark:hover:bg-neutral-900 dark:text-neutral-200"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </header>
  );
}