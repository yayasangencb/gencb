import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, HeartHandshake, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { StatCounter } from "@/components/site/stat-counter";
import { StatusBadge } from "@/components/site/status-badge";
import { events as defaultEvents, gallery as defaultGallery, images, resolvePublicImage, news as defaultNews, ORG, partners as defaultPartners, programs as defaultPrograms, stats } from "@/data/gencb";
import { useCollection } from "@/lib/admin/store";
import { seedEvents, seedGallery, seedNews, seedPrograms, seedSponsors, seedDonationPrograms, type EventRow, type GalleryRow, type NewsRow, type ProgramRow, type SponsorRow, type DonationProgramRow } from "@/lib/admin/seed";
import { fetchPublicPrograms, fetchPublicEvents, fetchNewsList, fetchPublicSponsors, fetchDonationPrograms } from "@/lib/cloud/public-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GEN-CB — Yayasan Generasi Cerdas Beraksi" },
      {
        name: "description",
        content:
          "Pusat informasi program, kegiatan, berita, dan donasi Yayasan Generasi Cerdas Beraksi (GEN-CB).",
      },
      { property: "og:title", content: "GEN-CB — Yayasan Generasi Cerdas Beraksi" },
      {
        property: "og:description",
        content: "Pusat informasi program, kegiatan, berita, dan donasi Yayasan Generasi Cerdas Beraksi (GEN-CB).",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const programsStore = useCollection<ProgramRow>("programs", seedPrograms);
  const eventsStore = useCollection<EventRow>("events", seedEvents);
  const newsStore = useCollection<NewsRow>("news", seedNews);
  const sponsorsStore = useCollection<SponsorRow>("sponsor", seedSponsors);

  const [livePrograms, setLivePrograms] = useState<ProgramRow[]>([]);
  const [liveEvents, setLiveEvents] = useState<EventRow[]>([]);
  const [liveNews, setLiveNews] = useState<NewsRow[]>([]);
  const [liveSponsors, setLiveSponsors] = useState<SponsorRow[]>([]);

  useEffect(() => {
    let active = true;
    const fetchLive = async () => {
      try {
        const p = await fetchPublicPrograms();
        if (p.length && active) setLivePrograms(p as ProgramRow[]);

        const e = await fetchPublicEvents();
        if (e.length && active) setLiveEvents(e as EventRow[]);

        const n = await fetchNewsList();
        if (n.length && active) {
          const mapped: NewsRow[] = n.map((item) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            author: "Nabila Rahmawati",
            date: item.published_at ? item.published_at.slice(0, 10) : item.created_at.slice(0, 10),
            status: "PUBLISH",
            tags: (item.tags ?? []).join(", "),
            seoTitle: item.seo_title ?? item.title,
            seoDescription: item.seo_description ?? "",
            content: item.content ?? "",
            image: item.cover_image ?? "",
          }));
          setLiveNews(mapped);
        }

        const s = await fetchPublicSponsors();
        if (s.length && active) setLiveSponsors(s as SponsorRow[]);
      } catch {
        // Fallthrough to local store if offline
      }
    };
    void fetchLive();
    return () => {
      active = false;
    };
  }, []);

  const displayPrograms = livePrograms.length ? livePrograms : programsStore.items;
  const activePrograms = displayPrograms.filter((p) => p.status !== "ARSIP");

  const displayEvents = liveEvents.length ? liveEvents : eventsStore.items;

  const displayNews = liveNews.length ? liveNews : newsStore.items;
  const publishedNews = displayNews.filter((n) => n.status === "PUBLISH" || !n.status);

  const displaySponsors = liveSponsors.length ? liveSponsors : sponsorsStore.items;
  const partnerList = displaySponsors.length ? displaySponsors.map((s) => s.name) : defaultPartners;

  return (
    <>
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <img
          src={images.heroImg}
          alt="Relawan dan anak-anak GEN-CB dalam kegiatan belajar bersama"
          width={1600}
          height={1000}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-brand opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        <motion.div
          aria-hidden
          animate={{ y: [0, -24, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute right-10 top-24 size-64 rounded-full bg-brand-sky/40 blur-3xl"
        />
        <motion.div
          aria-hidden
          animate={{ y: [0, 28, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -left-10 bottom-16 size-72 rounded-full bg-brand-orange/30 blur-3xl"
        />

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 pt-28 pb-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-primary-foreground"
          >
            <span className="glass inline-flex rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
              Yayasan Kepemudaan & Sosial
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] sm:text-6xl">
              Generasi Cerdas Beraksi
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed opacity-90 sm:text-lg">
              {ORG.tagline}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild variant="accent" size="xl">
                <Link to="/program">Lihat Program</Link>
              </Button>
              <Button asChild variant="glass" size="xl">
                <Link to="/event">Daftar Kegiatan</Link>
              </Button>
              <Button asChild variant="ghost" size="xl" className="text-primary-foreground hover:bg-white/10">
                <Link to="/tentang">
                  Tentang Kami <ArrowRight />
                </Link>
              </Button>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Users, title: "3.200+ Peserta", desc: "Terlibat dalam kegiatan GEN-CB" },
              { icon: CalendarDays, title: "26 Kegiatan/Tahun", desc: "Terjadwal & terdokumentasi" },
              { icon: HeartHandshake, title: `${partnerList.length}+ Mitra`, desc: "Desa, sekolah, masjid, komunitas" },
              { icon: MapPin, title: "Berbasis Desa", desc: "Dampak nyata di akar rumput" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.12, duration: 0.6 }}
                className="glass rounded-3xl p-5 text-primary-foreground shadow-soft"
              >
                <item.icon className="size-6" />
                <p className="mt-4 font-display font-semibold">{item.title}</p>
                <p className="mt-1 text-xs opacity-80">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-14 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <StatCounter key={s.label} {...s} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionHeading
          label="Program Unggulan"
          title="Pilar gerakan GEN-CB"
          description="Program berkelanjutan yang dirancang bersama masyarakat, dari pendidikan hingga teknologi."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(activePrograms.length ? activePrograms : defaultPrograms).map((p, i) => {
            const imgSrc = resolvePublicImage((p as { image?: string }).image, p.category, images.progPendidikan);
            return (
              <Reveal key={p.id || p.title} delay={i * 0.06}>
                <article className="group h-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={p.title}
                      loading="lazy"
                      width={1200}
                      height={800}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-gradient-accent px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                    <p className="mt-4 text-xs font-medium uppercase tracking-widest text-accent">
                      Target: {p.target}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-secondary/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            label="Upcoming Event"
            title="Kegiatan yang akan datang"
            description="Pendaftaran online tersedia untuk kegiatan berstatus OPEN."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {displayEvents.slice(0, 4).map((e, i) => {
              const eventImg = resolvePublicImage(e.image, e.category, images.heroImg);
              return (
                <Reveal key={e.id || e.slug} delay={i * 0.06}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={eventImg}
                        alt={e.title}
                        loading="lazy"
                        width={1200}
                        height={800}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute left-4 top-4">
                        <StatusBadge status={(e.status || "OPEN") as "OPEN" | "SOON" | "ONGOING" | "CLOSED"} />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-base font-semibold">{e.title}</h3>
                      <p className="mt-2 text-xs text-muted-foreground">{e.date}</p>
                      <p className="text-xs text-muted-foreground">{e.location}</p>
                      <p className="mt-3 text-xs font-medium text-accent">
                        {e.registered}/{e.quota} peserta
                      </p>
                      <Button asChild variant="hero" size="sm" className="mt-5 w-full">
                        <Link to="/event/$slug" params={{ slug: e.slug || "mtq-desa-sasak-panjang" }}>
                          Detail
                        </Link>
                      </Button>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionHeading
          label="Berita Terbaru"
          title="Kabar dari lapangan"
          description="Dokumentasi dan pengumuman terbaru dari kegiatan GEN-CB."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {(publishedNews.length ? publishedNews : defaultNews).map((n, i) => {
            const newsImg = resolvePublicImage((n as { image?: string }).image, n.category, images.progKeagamaan);
            return (
              <Reveal key={n.id || n.title} delay={i * 0.08}>
                <article className="group h-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <img
                    src={newsImg}
                    alt={n.title}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-semibold text-accent">{n.category}</span>
                      <span>{n.date}</span>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-semibold">{n.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {(n as { excerpt?: string; content?: string }).excerpt || (n as { content?: string }).content || ""}
                    </p>
                    <Button asChild variant="ghost" size="sm" className="mt-4 px-0 font-semibold text-accent">
                      <Link to="/berita/$slug" params={{ slug: n.slug || "pendaftaran-mtq-2026" }}>
                        Baca Selengkapnya <ArrowRight />
                      </Link>
                    </Button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Mitra & Kolaborator
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm font-semibold text-muted-foreground">
            {partnerList.map((p) => (
              <span key={p} className="rounded-xl border border-border/60 bg-card px-4 py-2 shadow-xs">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
