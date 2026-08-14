import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, HandCoins, Newspaper, Users, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
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

const statusLabel: Record<string, string> = {
  pending: "Menunggu",
  verified: "Terverifikasi",
  accepted: "Diterima",
  rejected: "Ditolak",
  waiting: "Menunggu",
  present: "Hadir",
  absent: "Tidak hadir",
};

async function loadOverview() {
  const [events, news, registrations, donations, donationPrograms, messages] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, status, quota, registered_count")
      .is("deleted_at", null)
      .order("event_date_start", { ascending: true }),
    supabase.from("news").select("id, status").is("deleted_at", null),
    supabase
      .from("registrations")
      .select("id, full_name, verification_status, created_at, event_id, events(title)")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase.from("donations").select("amount, is_verified"),
    supabase.from("donation_programs").select("id, title, target_amount, collected_amount, is_active"),
    supabase.from("contact_messages").select("id, is_read"),
  ]);

  return {
    events: events.data ?? [],
    news: news.data ?? [],
    registrations: registrations.data ?? [],
    donations: donations.data ?? [],
    donationPrograms: donationPrograms.data ?? [],
    messages: messages.data ?? [],
  };
}

function OverviewPage() {
  const { data, isLoading } = useQuery({ queryKey: ["admin-overview"], queryFn: loadOverview });

  if (isLoading || !data) {
    return <p className="text-sm text-muted-foreground">Memuat data terkini...</p>;
  }

  const { events, news, registrations, donations, donationPrograms, messages } = data;

  const activeEvents = events.filter((e) => e.status === "open" || e.status === "ongoing").length;
  const pending = registrations.filter(
    (r) => r.verification_status === "pending" || r.verification_status === "waiting",
  ).length;
  const donationTotal = donations
    .filter((d) => d.is_verified)
    .reduce((sum, d) => sum + Number(d.amount ?? 0), 0);
  const published = news.filter((n) => n.status === "published").length;
  const unread = messages.filter((m) => !m.is_read).length;

  const cards = [
    { label: "Event aktif", value: String(activeEvents), icon: CalendarDays, hint: `${events.length} total event` },
    { label: "Pendaftar menunggu verifikasi", value: String(pending), icon: Users, hint: `${registrations.length} total pendaftar` },
    { label: "Donasi terverifikasi", value: formatIdr(donationTotal), icon: HandCoins, hint: `${donations.length} transaksi masuk` },
    { label: "Berita terbit", value: String(published), icon: Newspaper, hint: `${news.length} artikel tersimpan` },
  ];

  const maxRegistered = Math.max(...events.map((e) => Number(e.registered_count ?? 0)), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Data langsung dari database — diperbarui setiap kali halaman dibuka.
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

      {unread > 0 ? (
        <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm">
          <Inbox className="size-5 text-primary" />
          <span>
            <strong>{unread}</strong> pesan masuk belum dibaca dari formulir kontak.
          </span>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <h2 className="font-display text-base font-semibold">Pendaftar per event</h2>
          {events.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Belum ada event.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {events.slice(0, 6).map((e) => (
                <div key={e.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate font-medium">{e.title}</span>
                    <span className="text-muted-foreground">
                      {e.registered_count}/{e.quota}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-brand"
                      style={{ width: `${(Number(e.registered_count ?? 0) / maxRegistered) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-display text-base font-semibold">Progress donasi</h2>
          {donationPrograms.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Belum ada program donasi.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {donationPrograms.map((p) => (
                <div key={p.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate font-medium">{p.title}</span>
                    <Badge variant={p.is_active ? "default" : "secondary"}>
                      {p.is_active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                  <Progress
                    value={Math.min(
                      (Number(p.collected_amount ?? 0) / Math.max(Number(p.target_amount ?? 1), 1)) * 100,
                      100,
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formatIdr(Number(p.collected_amount ?? 0))} dari {formatIdr(Number(p.target_amount ?? 0))}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="font-display text-base font-semibold">Pendaftar terbaru</h2>
        {registrations.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Belum ada pendaftar masuk. Data akan muncul otomatis setelah ada yang mendaftar event.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-border">
            {registrations.slice(0, 6).map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                <div>
                  <p className="font-medium">{p.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(p as { events?: { title?: string } | null }).events?.title ?? "-"}
                  </p>
                </div>
                <Badge
                  variant={
                    p.verification_status === "verified" || p.verification_status === "accepted"
                      ? "default"
                      : p.verification_status === "rejected"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {statusLabel[p.verification_status] ?? p.verification_status}
                </Badge>
              </div>
            ))}
          </div>
        )}
        <Link to="/admin/pendaftar" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
          Lihat semua pendaftar →
        </Link>
      </div>
    </div>
  );
}
