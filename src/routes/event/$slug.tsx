import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Download,
  Facebook,
  Link2,
  MapPin,
  MessageCircle,
  Send,
  Twitter,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Countdown } from "@/components/site/countdown";
import { Reveal } from "@/components/site/reveal";
import { StatusBadge } from "@/components/site/status-badge";
import { getEvent, formatRupiah, type GencbEvent } from "@/data/events";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/event/$slug")({
  loader: ({ params }) => {
    const event = getEvent(params.slug);
    if (!event) throw notFound();
    return event;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — GEN-CB` },
          { name: "description", content: loaderData.excerpt },
          { property: "og:title", content: `${loaderData.title} — GEN-CB` },
          { property: "og:description", content: loaderData.excerpt },
          { property: "og:type", content: "article" },
        ]
      : [],
  }),
  component: EventDetail,
});

type Comment = { name: string; message: string; time: string };

function EventDetail() {
  const e = Route.useLoaderData() as GencbEvent;
  const [comments, setComments] = useState<Comment[]>([
    {
      name: "Rani Aprilia",
      message: "Apakah peserta boleh mendaftar dua cabang lomba sekaligus?",
      time: "2 hari lalu",
    },
    {
      name: "Panitia GEN-CB",
      message: "Boleh, maksimal dua cabang selama jadwalnya tidak bentrok.",
      time: "1 hari lalu",
    },
  ]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const pct = Math.min(100, Math.round((e.registered / e.quota) * 100));
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const share = (target: "wa" | "fb" | "x" | "copy") => {
    const text = `${e.title} — ${e.date} di ${e.location}`;
    if (target === "copy") {
      navigator.clipboard?.writeText(shareUrl);
      toast.success("Tautan kegiatan disalin");
      return;
    }
    const urls = {
      wa: `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`,
      fb: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
    };
    window.open(urls[target], "_blank", "noopener");
  };

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-32">
        <img
          src={e.image}
          alt={e.title}
          width={1600}
          height={900}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-brand opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="text-primary-foreground">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={e.status} />
              <span className="glass rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest">
                {e.category}
              </span>
              <span className="glass rounded-full px-3 py-1 text-[11px] font-semibold">
                {e.fee === 0 ? "Gratis" : formatRupiah(e.fee)}
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-bold sm:text-5xl">{e.title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed opacity-90 sm:text-base">
              {e.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap gap-5 text-sm opacity-90">
              <span className="flex items-center gap-2">
                <CalendarDays className="size-4" /> {e.date}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="size-4" /> {e.location}
              </span>
              <span className="flex items-center gap-2">
                <Users className="size-4" /> {e.registered}/{e.quota} peserta
              </span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {e.status === "OPEN" ? (
                <Button asChild variant="accent" size="xl">
                  <Link to="/daftar/$slug" params={{ slug: e.slug }}>
                    Daftar Sekarang
                  </Link>
                </Button>
              ) : (
                <Button variant="accent" size="xl" disabled>
                  Pendaftaran {e.status === "CLOSED" ? "Ditutup" : "Belum Dibuka"}
                </Button>
              )}
              <Button asChild variant="glass" size="xl">
                <Link to="/event">Kegiatan Lain</Link>
              </Button>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 text-primary-foreground">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80">
              Menuju hari-H
            </p>
            <div className="mt-4">
              <Countdown target={e.startAt} />
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs opacity-85">
                <span>Kuota terisi</span>
                <span>{pct}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-gradient-accent" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <Button variant="glass" size="icon" aria-label="Bagikan ke WhatsApp" onClick={() => share("wa")}>
                <MessageCircle />
              </Button>
              <Button variant="glass" size="icon" aria-label="Bagikan ke Facebook" onClick={() => share("fb")}>
                <Facebook />
              </Button>
              <Button variant="glass" size="icon" aria-label="Bagikan ke X" onClick={() => share("x")}>
                <Twitter />
              </Button>
              <Button variant="glass" size="icon" aria-label="Salin tautan" onClick={() => share("copy")}>
                <Link2 />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-14">
          <Reveal>
            <h2 className="font-display text-2xl font-bold">Tentang kegiatan</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              {e.description.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>

          {e.competitions.length > 0 ? (
            <Reveal>
              <h2 className="font-display text-2xl font-bold">Kategori lomba</h2>
              <Tabs defaultValue={e.competitions[0]?.name ?? ""} className="mt-5">
                <TabsList className="flex h-auto flex-wrap justify-start gap-1 rounded-2xl">
                  {e.competitions.map((c) => (
                    <TabsTrigger key={c.name} value={c.name} className="rounded-xl text-xs">
                      {c.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {e.competitions.map((c) => (
                  <TabsContent key={c.name} value={c.name}>
                    <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
                      <h3 className="font-display text-lg font-semibold">{c.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                      <p className="mt-4 text-xs font-medium uppercase tracking-widest text-accent">
                        Usia peserta: {c.age}
                      </p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </Reveal>
          ) : null}

          <Reveal>
            <h2 className="font-display text-2xl font-bold">Rundown acara</h2>
            <div className="mt-5 space-y-3">
              {e.rundown.map((r) => (
                <div
                  key={r.time}
                  className="flex gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-soft"
                >
                  <span className="w-16 shrink-0 font-display text-sm font-bold text-accent">
                    {r.time}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-2xl font-bold">Timeline persiapan</h2>
            <ol className="mt-5 space-y-5 border-l border-border pl-6">
              {e.timeline.map((t) => (
                <li key={t.title} className="relative">
                  <span className="absolute -left-[31px] top-0.5 bg-background">
                    {t.done ? (
                      <CheckCircle2 className="size-5 text-status-open" />
                    ) : (
                      <Circle className="size-5 text-muted-foreground/50" />
                    )}
                  </span>
                  <p className={cn("text-sm font-semibold", !t.done && "text-muted-foreground")}>
                    {t.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.date}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-2xl font-bold">Persyaratan peserta</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {e.requirements.map((r) => (
                <li
                  key={r}
                  className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 text-sm shadow-soft"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span className="text-muted-foreground">{r}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-2xl font-bold">Lokasi kegiatan</h2>
            <p className="mt-2 text-sm text-muted-foreground">{e.address}</p>
            <div className="mt-5 overflow-hidden rounded-3xl border border-border/60 shadow-soft">
              <iframe
                title={`Peta lokasi ${e.title}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(e.mapQuery)}&output=embed`}
                loading="lazy"
                className="h-80 w-full border-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>

          {e.gallery.length > 0 ? (
            <Reveal>
              <h2 className="font-display text-2xl font-bold">Galeri kegiatan</h2>
              <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
                {e.gallery.map((g) => (
                  <div key={g.caption} className="group relative overflow-hidden rounded-3xl shadow-soft">
                    <img
                      src={g.src}
                      alt={g.caption}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-xs font-medium text-primary-foreground">
                      {g.caption}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          ) : null}

          <Reveal>
            <h2 className="font-display text-2xl font-bold">Pertanyaan umum</h2>
            <Accordion type="single" collapsible className="mt-5">
              {e.faq.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-2xl font-bold">Diskusi peserta</h2>
            <div className="mt-5 space-y-4">
              {comments.map((c, i) => (
                <div key={`${c.name}-${i}`} className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{c.name}</p>
                    <span className="text-[11px] text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{c.message}</p>
                </div>
              ))}
            </div>
            <form
              className="mt-5 space-y-3 rounded-3xl border border-border/60 bg-card p-5 shadow-soft"
              onSubmit={(ev) => {
                ev.preventDefault();
                if (!name.trim() || !message.trim()) {
                  toast.error("Nama dan komentar wajib diisi");
                  return;
                }
                setComments((prev) => [...prev, { name, message, time: "Baru saja" }]);
                setName("");
                setMessage("");
                toast.success("Komentar terkirim");
              }}
            >
              <Input placeholder="Nama kamu" value={name} onChange={(ev) => setName(ev.target.value)} />
              <Textarea
                placeholder="Tulis pertanyaan atau komentar…"
                value={message}
                rows={3}
                onChange={(ev) => setMessage(ev.target.value)}
              />
              <Button type="submit" variant="hero" size="sm">
                <Send /> Kirim komentar
              </Button>
            </form>
          </Reveal>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
            <h3 className="font-display text-base font-semibold">Dokumen kegiatan</h3>
            <div className="mt-4 space-y-3">
              {e.documents.map((d) => (
                <button
                  key={d.label}
                  onClick={() => toast.info("Dokumen akan tersedia setelah backend tersambung")}
                  className="flex w-full items-center gap-3 rounded-2xl border border-border/60 p-3 text-left transition-colors hover:bg-secondary"
                >
                  <Download className="size-4 shrink-0 text-accent" />
                  <span>
                    <span className="block text-xs font-semibold">{d.label}</span>
                    <span className="block text-[11px] text-muted-foreground">{d.size}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
            <h3 className="font-display text-base font-semibold">Panitia pelaksana</h3>
            <ul className="mt-4 space-y-3">
              {e.committee.map((c) => (
                <li key={c.name} className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-primary-foreground">
                    {c.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{c.name}</span>
                    <span className="block text-[11px] text-muted-foreground">{c.role}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
            <h3 className="font-display text-base font-semibold">Sponsor & partner</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {e.sponsors.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-border/60 px-3 py-1.5 text-[11px] font-medium text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}