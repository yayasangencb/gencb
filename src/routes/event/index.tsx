import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { StatusBadge } from "@/components/site/status-badge";
import { events, eventCategories, eventStatuses, formatRupiah } from "@/data/events";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/event/")({
  head: () => ({
    meta: [
      { title: "Event & Kegiatan — GEN-CB" },
      {
        name: "description",
        content:
          "Jadwal kegiatan GEN-CB: MTQ, seminar, pelatihan, turnamen olahraga, bakti sosial, dan pendaftaran online.",
      },
      { property: "og:title", content: "Event & Kegiatan — GEN-CB" },
      {
        property: "og:description",
        content: "Lihat jadwal kegiatan GEN-CB dan daftar secara online.",
      },
    ],
  }),
  component: EventPage,
});

function EventPage() {
  const [category, setCategory] = useState<string>("Semua");
  const [status, setStatus] = useState<string>("SEMUA");

  const filtered = useMemo(
    () =>
      events.filter(
        (e) =>
          (category === "Semua" || e.category === category) &&
          (status === "SEMUA" || e.status === status),
      ),
    [category, status],
  );

  return (
    <>
      <PageHero
        label="Event & Kegiatan"
        title="Ikuti kegiatan GEN-CB"
        description="Pilih kegiatan sesuai minatmu, lihat detail lengkap, dan daftar secara online dalam beberapa menit."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Kategori
            </span>
            {eventCategories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
                  category === c
                    ? "border-transparent bg-gradient-brand text-primary-foreground"
                    : "border-border/70 text-muted-foreground hover:text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Status
            </span>
            {eventStatuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
                  status === s
                    ? "border-transparent bg-gradient-accent text-primary-foreground"
                    : "border-border/70 text-muted-foreground hover:text-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Menampilkan {filtered.length} dari {events.length} kegiatan.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e, i) => {
            const pct = Math.min(100, Math.round((e.registered / e.quota) * 100));
            return (
              <Reveal key={e.slug} delay={i * 0.05}>
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
                    <span className="absolute right-4 top-4 rounded-full bg-background/85 px-3 py-1 text-[11px] font-semibold backdrop-blur-sm">
                      {e.fee === 0 ? "Gratis" : formatRupiah(e.fee)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                      {e.category}
                    </span>
                    <h2 className="mt-2 font-display text-lg font-semibold">{e.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{e.excerpt}</p>
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
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-accent"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="mt-auto flex gap-2 pt-6">
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link to="/event/$slug" params={{ slug: e.slug }}>
                          Detail
                        </Link>
                      </Button>
                      {e.status === "OPEN" ? (
                        <Button asChild variant="hero" size="sm" className="flex-1">
                          <Link to="/event/$slug/daftar" params={{ slug: e.slug }}>
                            Daftar
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="hero" size="sm" className="flex-1" disabled>
                          {e.status === "CLOSED"
                            ? "Ditutup"
                            : e.status === "ONGOING"
                              ? "Berlangsung"
                              : "Segera"}
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-16 text-center text-sm text-muted-foreground">
            Belum ada kegiatan pada filter ini.
          </p>
        ) : null}
      </section>
    </>
  );
}