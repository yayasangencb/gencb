import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, HandCoins, Newspaper, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCollection } from "@/lib/admin/store";
import {
  seedDonationPrograms,
  seedDonors,
  seedEvents,
  seedNews,
  seedParticipants,
  type DonationProgramRow,
  type DonorRow,
  type EventRow,
  type NewsRow,
  type ParticipantRow,
} from "@/lib/admin/seed";
import { formatIdr } from "@/lib/admin/export";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Overview Admin — GEN-CB" },
      { name: "description", content: "Ringkasan statistik event, pendaftar, donasi, dan berita GEN-CB." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Overview Admin — GEN-CB" },
      { property: "og:description", content: "Ringkasan operasional yayasan dalam satu layar." },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  const { items: events } = useCollection<EventRow>("events", seedEvents);
  const { items: news } = useCollection<NewsRow>("news", seedNews);
  const { items: participants } = useCollection<ParticipantRow>("participants", seedParticipants);
  const { items: donors } = useCollection<DonorRow>("donors", seedDonors);
  const { items: donationPrograms } = useCollection<DonationProgramRow>(
    "donation-programs",
    seedDonationPrograms,
  );

  const activeEvents = events.filter((e) => e.status === "OPEN" || e.status === "ONGOING").length;
  const pending = participants.filter((p) => p.status === "PENDING").length;
  const donationTotal = donors
    .filter((d) => d.status === "VERIFIED")
    .reduce((sum, d) => sum + Number(d.amount), 0);
  const publishedThisMonth = news.filter((n) => n.status === "PUBLISH").length;

  const cards = [
    { label: "Event aktif", value: String(activeEvents), icon: CalendarDays, hint: `${events.length} total event` },
    { label: "Pendaftar menunggu verifikasi", value: String(pending), icon: Users, hint: `${participants.length} total pendaftar` },
    { label: "Donasi terverifikasi", value: formatIdr(donationTotal), icon: HandCoins, hint: `${donors.length} transaksi masuk` },
    { label: "Berita terbit", value: String(publishedThisMonth), icon: Newspaper, hint: `${news.length} artikel tersimpan` },
  ];

  const maxRegistered = Math.max(...events.map((e) => e.registered), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ringkasan aktivitas yayasan hari ini.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <Icon className="size-5 text-primary" />
              </div>
              <p className="mt-3 font-display text-2xl font-bold">{c.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.hint}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <h2 className="font-display text-base font-semibold">Pendaftar per event</h2>
          <div className="mt-4 space-y-3">
            {events.slice(0, 6).map((e) => (
              <div key={e.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate font-medium">{e.title}</span>
                  <span className="text-muted-foreground">
                    {e.registered}/{e.quota}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-brand"
                    style={{ width: `${(e.registered / maxRegistered) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-display text-base font-semibold">Progress donasi</h2>
          <div className="mt-4 space-y-4">
            {donationPrograms.map((p) => (
              <div key={p.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate font-medium">{p.title}</span>
                  <Badge variant={p.status === "AKTIF" ? "default" : "secondary"}>{p.status}</Badge>
                </div>
                <Progress value={Math.min((p.collected / p.target) * 100, 100)} />
                <p className="text-xs text-muted-foreground">
                  {formatIdr(p.collected)} dari {formatIdr(p.target)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="font-display text-base font-semibold">Pendaftar terbaru</h2>
        <div className="mt-4 divide-y divide-border">
          {participants.slice(0, 6).map((p) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.eventTitle} · {p.competition}
                </p>
              </div>
              <Badge
                variant={
                  p.status === "ACCEPTED" ? "default" : p.status === "PENDING" ? "secondary" : "destructive"
                }
              >
                {p.status}
              </Badge>
            </div>
          ))}
        </div>
        <Link to="/admin/pendaftar" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
          Lihat semua pendaftar →
        </Link>
      </div>
    </div>
  );
}