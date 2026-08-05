import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";
import { fetchAlbums, fetchMediaPage, type MediaRow } from "@/lib/cloud/public-data";

export const Route = createFileRoute("/galeri")({
  head: () => ({
    meta: [
      { title: "Galeri — GEN-CB" },
      {
        name: "description",
        content: "Dokumentasi foto dan video kegiatan Yayasan Generasi Cerdas Beraksi.",
      },
      { property: "og:title", content: "Galeri — GEN-CB" },
      { property: "og:description", content: "Lihat dokumentasi kegiatan GEN-CB." },
    ],
  }),
  component: GaleriPage,
});

function GaleriPage() {
  const { data: albums = [] } = useQuery({ queryKey: ["albums"], queryFn: fetchAlbums });
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null);
  const [items, setItems] = useState<MediaRow[]>([]);
  const [page, setPage] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [zoom, setZoom] = useState(false);
  const sentinel = useRef<HTMLDivElement | null>(null);
  const PAGE = 9;

  useEffect(() => {
    setItems([]);
    setPage(0);
    setDone(false);
  }, [activeAlbum]);

  const loadMore = useCallback(async () => {
    if (loading || done) return;
    setLoading(true);
    const from = page * PAGE;
    const rows = await fetchMediaPage({
      ...(activeAlbum ? { albumId: activeAlbum } : {}),
      from,
      to: from + PAGE - 1,
    });
    setItems((prev) => (page === 0 ? rows : [...prev, ...rows]));
    setPage((p) => p + 1);
    if (rows.length < PAGE) setDone(true);
    setLoading(false);
  }, [loading, done, page, activeAlbum]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) void loadMore();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % items.length));
      if (e.key === "ArrowLeft")
        setLightbox((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, items.length]);

  const current = lightbox === null ? null : items[lightbox];

  return (
    <>
      <PageHero
        label="Galeri"
        title="Dokumentasi kegiatan"
        description="Setiap momen kebersamaan, belajar, dan aksi sosial yang kami abadikan."
      />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {[{ id: null as string | null, title: "Semua" }, ...albums].map((a) => (
            <button
              key={a.id ?? "all"}
              onClick={() => setActiveAlbum(a.id)}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-xs font-medium transition-all",
                activeAlbum === a.id
                  ? "border-transparent bg-gradient-brand text-primary-foreground shadow-soft"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {a.title}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g, i) => (
            <Reveal key={g.id} delay={(i % 9) * 0.05}>
              <button
                type="button"
                onClick={() => {
                  setZoom(false);
                  setLightbox(i);
                }}
                className="group relative block w-full overflow-hidden rounded-3xl shadow-soft"
              >
                {g.media_type === "video" ? (
                  <video src={g.url} className="h-56 w-full object-cover" muted playsInline />
                ) : (
                  <img
                    src={g.url}
                    alt={g.caption ?? "Dokumentasi GEN-CB"}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <span className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <ZoomIn className="size-4" />
                </span>
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-left text-xs font-medium text-white">
                  {g.caption ?? "Dokumentasi kegiatan"}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
        <div ref={sentinel} className="h-16" />
        <p className="text-center text-sm text-muted-foreground">
          {loading ? "Memuat media..." : done && items.length === 0 ? "Belum ada dokumentasi." : ""}
        </p>
      </section>

      {current ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            aria-label="Tutup"
            className="absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white"
            onClick={() => setLightbox(null)}
          >
            <X className="size-5" />
          </button>
          <button
            aria-label="Sebelumnya"
            className="absolute left-4 rounded-full bg-white/10 p-3 text-white"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? i : (i - 1 + items.length) % items.length));
            }}
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            aria-label="Berikutnya"
            className="absolute right-4 rounded-full bg-white/10 p-3 text-white"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? i : (i + 1) % items.length));
            }}
          >
            <ChevronRight className="size-6" />
          </button>
          <figure className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {current.media_type === "video" ? (
              <video src={current.url} controls autoPlay className="max-h-[80vh] rounded-2xl" />
            ) : (
              <img
                src={current.url}
                alt={current.caption ?? "Dokumentasi GEN-CB"}
                onClick={() => setZoom((z) => !z)}
                className={cn(
                  "max-h-[80vh] cursor-zoom-in rounded-2xl object-contain transition-transform duration-300",
                  zoom && "scale-150 cursor-zoom-out",
                )}
              />
            )}
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {current.caption ?? ""}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}