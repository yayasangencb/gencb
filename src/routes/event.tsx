import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { StatusBadge } from "@/components/site/status-badge";
import { events } from "@/data/gencb";

export const Route = createFileRoute("/event")({
  head: () => ({
    meta: [
      { title: "Event & Kegiatan — GEN-CB" },
      {
        name: "description",
        content:
          "Daftar kegiatan GEN-CB: MTQ, seminar, pelatihan, turnamen olahraga, bakti sosial, dan lainnya.",
      },
      { property: "og:title", content: "Event & Kegiatan — GEN-CB" },
      {
        property: "og:description",
        content: "Lihat jadwal kegiatan GEN-CB dan ikuti pendaftaran online.",
      },
    ],
  }),
  component: EventPage,
});

function EventPage() {
  return (
    <>
      <PageHero
        label="Event & Kegiatan"
        title="Ikuti kegiatan GEN-CB"
        description="Pilih kegiatan sesuai minatmu. Pendaftaran online akan tersedia pada tahap berikutnya."
      />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((e, i) => (
            <Reveal key={e.slug} delay={i * 0.06}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={e.image}
                    alt={e.title}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4">
                    <StatusBadge status={e.status} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                    {e.category}
                  </span>
                  <h2 className="mt-2 font-display text-lg font-semibold">{e.title}</h2>
                  <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="size-4" /> {e.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="size-4" /> {e.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="size-4" /> {e.registered}/{e.quota} peserta
                    </p>
                  </div>
                  <div className="mt-6 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Detail
                    </Button>
                    <Button
                      variant="hero"
                      size="sm"
                      className="flex-1"
                      disabled={e.status === "CLOSED"}
                    >
                      {e.status === "CLOSED" ? "Ditutup" : "Daftar"}
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}