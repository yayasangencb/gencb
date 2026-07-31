import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, HeartHandshake, MapPin, Quote, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { StatCounter } from "@/components/site/stat-counter";
import { StatusBadge } from "@/components/site/status-badge";
import { events, gallery, images, news, ORG, partners, programs, stats, testimonials } from "@/data/gencb";

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
        content: "Membangun Generasi Cerdas, Berkarakter, dan Berdampak untuk Indonesia.",
      },
    ],
  }),
  component: Index,
});

function Index() {
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
              { icon: HeartHandshake, title: "34 Mitra", desc: "Desa, sekolah, masjid, komunitas" },
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
          title="Enam pilar gerakan GEN-CB"
          description="Program berkelanjutan yang dirancang bersama masyarakat, dari pendidikan hingga teknologi."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <article className="group h-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={p.image}
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
          ))}
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
            {events.slice(0, 4).map((e, i) => (
              <Reveal key={e.slug} delay={i * 0.06}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="relative h-40 overflow-hidden">
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
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-base font-semibold">{e.title}</h3>
                    <p className="mt-2 text-xs text-muted-foreground">{e.date}</p>
                    <p className="text-xs text-muted-foreground">{e.location}</p>
                    <p className="mt-3 text-xs font-medium text-accent">
                      {e.registered}/{e.quota} peserta
                    </p>
                    <Button asChild variant="hero" size="sm" className="mt-5 w-full">
                      <Link to="/event/$slug" params={{ slug: e.slug }}>
                        Detail
                      </Link>
                    </Button>
                  </div>
                </article>
              </Reveal>
            ))}
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
          {news.map((n, i) => (
            <Reveal key={n.slug} delay={i * 0.08}>
              <article className="group h-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <img
                  src={n.image}
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
                  <h3 className="mt-3 font-display text-lg font-semibold">{n.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{n.excerpt}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-secondary/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading label="Dokumentasi" title="Galeri kegiatan terbaru" />
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
            {gallery.slice(0, 6).map((g, i) => (
              <Reveal key={`${g.caption}-${i}`} delay={i * 0.05}>
                <div className="group relative overflow-hidden rounded-3xl shadow-soft">
                  <img
                    src={g.src}
                    alt={g.caption}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-xs font-medium text-white">
                    {g.caption}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl bg-gradient-brand p-10 text-primary-foreground shadow-lift sm:p-14">
            <div className="pointer-events-none absolute -right-10 -top-10 size-64 rounded-full bg-brand-orange/30 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <h2 className="text-3xl font-bold sm:text-4xl">Dukung gerakan ini lewat donasi</h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed opacity-90">
                  Setiap rupiah membantu biaya operasional Rumah Belajar, santunan anak yatim, dan
                  penyelenggaraan kegiatan komunitas.
                </p>
                <Button asChild variant="accent" size="xl" className="mt-8">
                  <Link to="/donasi">Donasi Sekarang</Link>
                </Button>
              </div>
              <div className="glass rounded-3xl p-6">
                <p className="text-sm opacity-85">Program Donasi Aktif</p>
                <p className="mt-1 font-display text-xl font-semibold">Beasiswa Anak Desa</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full w-[68%] rounded-full bg-gradient-accent" />
                </div>
                <p className="mt-3 text-xs opacity-85">Rp 34.000.000 dari target Rp 50.000.000</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="overflow-hidden py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading label="Partner & Sponsor" title="Mereka yang berkolaborasi bersama kami" />
        </div>
        <div className="relative mt-10 flex overflow-hidden">
          <motion.div
            className="flex shrink-0 gap-4 pr-4"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            {[...partners, ...partners].map((p, i) => (
              <span
                key={`${p}-${i}`}
                className="whitespace-nowrap rounded-2xl border border-border/60 bg-card px-6 py-4 text-sm font-medium text-muted-foreground shadow-soft"
              >
                {p}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionHeading label="Testimoni" title="Kata mereka tentang GEN-CB" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="h-full rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
                <Quote className="size-7 text-accent" />
                <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6">
                  <p className="font-display text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
