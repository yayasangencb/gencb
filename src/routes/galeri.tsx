import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { gallery } from "@/data/gencb";
import { cn } from "@/lib/utils";

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
  const tags = ["Semua", ...Array.from(new Set(gallery.map((g) => g.tag)))];
  const [active, setActive] = useState("Semua");
  const items = active === "Semua" ? gallery : gallery.filter((g) => g.tag === active);

  return (
    <>
      <PageHero
        label="Galeri"
        title="Dokumentasi kegiatan"
        description="Setiap momen kebersamaan, belajar, dan aksi sosial yang kami abadikan."
      />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-xs font-medium transition-all",
                active === t
                  ? "border-transparent bg-gradient-brand text-primary-foreground shadow-soft"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g, i) => (
            <Reveal key={`${g.caption}-${i}`} delay={i * 0.05}>
              <div className="group relative overflow-hidden rounded-3xl shadow-soft">
                <img
                  src={g.src}
                  alt={g.caption}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-xs font-medium text-white">
                  {g.caption}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}