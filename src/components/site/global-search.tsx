import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { globalSearch, type SearchResult } from "@/lib/cloud/public-data";

const TYPES: SearchResult["type"][] = ["Program", "Berita", "Event", "Galeri"];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(async () => {
      if (term.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      setResults(await globalSearch(term));
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [term, open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Button variant="ghost" size="icon" aria-label="Cari" onClick={() => setOpen(true)}>
        <Search />
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 p-4 pt-24 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-border p-3">
              <Search className="ml-2 size-4 text-muted-foreground" />
              <Input
                autoFocus
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Cari program, berita, event, galeri..."
                className="border-0 shadow-none focus-visible:ring-0"
              />
              <Button variant="ghost" size="icon" aria-label="Tutup" onClick={() => setOpen(false)}>
                <X />
              </Button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-3">
              {loading ? (
                <p className="p-4 text-sm text-muted-foreground">Mencari...</p>
              ) : results.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">
                  {term.trim().length < 2 ? "Ketik minimal 2 huruf." : "Tidak ada hasil."}
                </p>
              ) : (
                TYPES.filter((t) => results.some((r) => r.type === t)).map((type) => (
                  <div key={type} className="mb-3">
                    <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {type}
                    </p>
                    {results
                      .filter((r) => r.type === type)
                      .map((r) => (
                        <Link
                          key={`${r.type}-${r.href}-${r.title}`}
                          to={r.href}
                          onClick={() => setOpen(false)}
                          className="block rounded-xl px-3 py-2 transition-colors hover:bg-secondary"
                        >
                          <span className="block text-sm font-medium">{r.title}</span>
                          <span className="block text-xs text-muted-foreground">{r.subtitle}</span>
                        </Link>
                      ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}