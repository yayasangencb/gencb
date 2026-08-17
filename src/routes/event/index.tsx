import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { StatusBadge } from "@/components/site/status-badge";
import { events as defaultEvents, eventCategories, eventStatuses, formatRupiah } from "@/data/events";
import { images, resolvePublicImage } from "@/data/gencb";
import { useCollection } from "@/lib/admin/store";
import { seedEvents, type EventRow } from "@/lib/admin/seed";
import { fetchPublicEvents } from "@/lib/cloud/public-data";
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
  const [liveEventsList, setLiveEventsList] = useState<EventRow[]>([]);

  const eventsStore = useCollection<EventRow>("events", seedEvents);

  useEffect(() => {
    let active = true;
    void fetchPublicEvents().then((e) => {
      if (e.length && active) setLiveEventsList(e as EventRow[]);
    });
    return () => {
      active = false;
    };
  }, []);

  const liveEvents = liveEventsList.length ? liveEventsList : eventsStore.items.length ? eventsStore.items : (defaultEvents as unknown as EventRow[]);

  const filtered = useMemo(
    () =>
      liveEvents.filter(
        (e) =>
          (category === "Semua" || e.category === category) &&
          (status === "SEMUA" || e.status === status),
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
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="self-center text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-2">
              Kategori:
            </span>
            {eventCategories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                  category === c
                    ? "bg-accent text-accent-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="self-center text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-2">
              Status:
            </span>
            {eventStatuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "rounded-full px-3.5 py-1 text-xs font-semibold transition-all",
                  status === s
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80",
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
            const registered = Number(e.registered) || 0;
            const pct = Math.min(100, Math.round((registered / quota) * 100));
            const imgSrc = resolvePublicImage(e.image, e.category, images.heroImg);
            const feeVal = Number(e.fee || 0);

            return (
              <Reveal key={e.id || e.slug || e.title} delay={i * 0.05}>
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
                      <StatusBadge status={(e.status || "OPEN") as "OPEN" | "SOON" | "ONGOING" | "CLOSED"} />
                    </div>
                    <span className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                      {e.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-display text-lg font-semibold">{e.title}</h2>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {e.description}
                    </p>

                    <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="size-4 text-accent" />
                        <span>{e.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-accent" />
                        <span className="truncate">{e.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="size-4 text-accent" />
                        <span>
                          {registered} terdaftar dari {quota} kuota
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">Kuota Terisi</span>
                        <span className="text-accent">{pct}%</span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-gradient-brand transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/60">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                          Biaya
                        </span>
                        <span className="font-display text-sm font-bold text-foreground">
                          {feeVal > 0 ? formatRupiah(feeVal) : "Gratis"}
                        </span>
                      </div>
                      <Button asChild variant="hero" size="sm">
                        <Link to="/event/$slug" params={{ slug: e.slug || "mtq-desa-sasak-panjang" }}>
                          Lihat Detail
                        </Link>
                      </Button>
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