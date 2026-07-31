import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { news } from "@/data/gencb";

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
  return (
    <>
      <PageHero
        label="Berita"
        title="Kabar & pengumuman GEN-CB"
        description="Informasi kegiatan, prestasi, dan pengumuman resmi yayasan."
      />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {news.map((n, i) => (
            <Reveal key={n.slug} delay={i * 0.07}>
              <article className="group h-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <img
                  src={n.image}
                  alt={n.title}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-semibold text-accent">{n.category}</span>
                    <span>{n.date}</span>
                  </div>
                  <h2 className="mt-3 font-display text-lg font-semibold">{n.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{n.excerpt}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}