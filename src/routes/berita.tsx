import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { fetchNewsList, formatDateId, NEWS_CATEGORIES } from "@/lib/cloud/public-data";

export const Route = createFileRoute("/berita")({
  head: () => ({
    meta: [
      { title: "Berita — GEN-CB" },
      {
        name: "description",
        content: "Berita, pengumuman, dan prestasi terbaru dari Yayasan Generasi Cerdas Beraksi.",
      },
      { property: "og:title", content: "Berita — GEN-CB" },
      { property: "og:description", content: "Kabar terbaru kegiatan dan program GEN-CB." },
    ],
  }),
  component: BeritaPage,
});

function BeritaPage() {
  const { data: news = [], isLoading } = useQuery({
    queryKey: ["news-list"],
    queryFn: fetchNewsList,
  });
  const [category, setCategory] = useState("Semua");
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return news.filter((n) => {
      const matchCat = category === "Semua" || n.category === category;
      const matchQuery =
        !q ||
        n.title.toLowerCase().includes(q) ||
        (n.content ?? "").toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [news, category, query]);

  return (
    <>
      <PageHero
        label="Berita"
        title="Kabar & pengumuman GEN-CB"
        description="Informasi kegiatan, prestasi, dan pengumuman resmi yayasan."
      />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {["Semua", ...NEWS_CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-2 text-xs font-medium transition-all",
                  category === c
                    ? "border-transparent bg-gradient-brand text-primary-foreground shadow-soft"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari berita..."
              className="rounded-full pl-9"
            />
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((n, i) => (
            <Reveal key={n.slug} delay={i * 0.07}>
              <Link
                to="/berita/$slug"
                params={{ slug: n.slug }}
                className="group block h-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <img
                  src={n.cover_image ?? "/favicon.png"}
                  alt={n.title}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-semibold text-accent">{n.category}</span>
                    <span>{formatDateId(n.published_at ?? n.created_at)}</span>
                  </div>
                  <h2 className="mt-3 font-display text-lg font-semibold">{n.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {(n.content ?? "").slice(0, 160)}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        {!isLoading && items.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Tidak ada berita yang cocok dengan pencarian Anda.
          </p>
        ) : null}
      </section>
    </>
  );
}