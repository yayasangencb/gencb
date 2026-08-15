import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { StatusBadge } from "@/components/site/status-badge";
import { eventCategories, eventStatuses, formatRupiah } from "@/data/events";
import { images, getDummyImage } from "@/data/gencb";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicEvents, statusToBadge } from "@/lib/cloud/home";
import { formatDateId } from "@/lib/cloud/public-data";
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

function resolveImg(src?: string, category?: string, fallback?: string) {
  return getDummyImage(src, category, fallback);
}

function EventPage() {
  const [category, setCategory] = useState<string>("Semua");
  const [status, setStatus] = useState<string>("SEMUA");

  const { data: liveEvents = [] } = useQuery({
    queryKey: ["public-events"],
    queryFn: fetchPublicEvents,
  });

  const filtered = useMemo(
    () =>
      liveEvents.filter(
        (e) =>
          (category === "Semua" || e.category === category) &&
          (status === "SEMUA" || statusToBadge(e.status) === status),
      ),
    [liveEvents, category, status],
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
          Menampilkan {filtered.length} dari {liveEvents.length} kegiatan.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e, i) => {
            const quota = Number(e.quota) || 1;
            const registered = Number(e.registered_count) || 0;
            const pct = Math.min(100, Math.round((registered / quota) * 100));
            const imgSrc = resolveImg(e.poster_url ?? undefined, e.category, images.heroImg);
            const feeVal = Number(e.price || 0);

            return (
              <Reveal key={e.id} delay={i * 0.05}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={e.title}
                      loading="lazy"
                      width={1200}
                      height={800}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-4 top-4">
                      <StatusBadge status={statusToBadge(e.status)} />
                    </div>
                    <span className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                      {feeVal > 0 ? formatRupiah(feeVal) : "Gratis"}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-accent">
                      <span>{e.category}</span>
                    </div>
                    <h2 className="mt-2 font-display text-lg font-semibold leading-snug">
                      {e.title}
                    </h2>
                    <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="size-4 shrink-0 text-primary" />
                        <span>{formatDateId(e.event_date_start)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 shrink-0 text-primary" />
                        <span className="truncate">{e.location_text ?? "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="size-4 shrink-0 text-primary" />
                        <span>
                          {registered}/{quota} Peserta
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-brand transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="mt-6 flex items-center gap-2">
                      <Button asChild variant="outline" size="sm" className="flex-1 rounded-full">
                        <Link to="/event/$slug" params={{ slug: e.slug }}>
                          Detail
                        </Link>
                      </Button>
                      {statusToBadge(e.status) === "OPEN" ? (
                        <Button asChild variant="accent" size="sm" className="flex-1 rounded-full">
                          <Link to="/daftar/$slug" params={{ slug: e.slug }}>
                            Daftar
                          </Link>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}