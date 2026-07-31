import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Award,
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  IdCard,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { listRegistrations, statusLabel, type Registration } from "@/lib/registrations";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Dashboard Peserta — GEN-CB" },
      {
        name: "description",
        content:
          "Pantau status pendaftaran, nomor peserta, QR check-in, kartu peserta, dan sertifikat kegiatan GEN-CB.",
      },
      { property: "og:title", content: "Dashboard Peserta — GEN-CB" },
      {
        property: "og:description",
        content: "Status verifikasi, kartu peserta digital, dan riwayat kegiatan GEN-CB.",
      },
    ],
  }),
  component: Dashboard,
});

const statusStyle: Record<Registration["status"], string> = {
  PENDING: "bg-status-soon/15 text-status-soon border-status-soon/30",
  ACCEPTED: "bg-status-open/15 text-status-open border-status-open/30",
  REJECTED: "bg-status-closed/15 text-status-closed border-status-closed/30",
};

function Dashboard() {
  const { id } = Route.useSearch();
  const [items, setItems] = useState<Registration[]>([]);

  useEffect(() => {
    const sync = () => setItems(listRegistrations());
    sync();
    window.addEventListener("gencb-registrations-changed", sync);
    return () => window.removeEventListener("gencb-registrations-changed", sync);
  }, []);

  const active = items.find((r) => r.id === id) ?? items[0];

  return (
    <>
      <PageHero
        label="Dashboard Peserta"
        title="Pantau status pendaftaranmu"
        description="Lihat status verifikasi, nomor peserta, QR code check-in, kartu peserta digital, dan sertifikat kegiatan."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {!active ? (
          <div className="rounded-3xl border border-border/60 bg-card p-10 text-center shadow-soft">
            <IdCard className="mx-auto size-10 text-accent" />
            <h2 className="mt-4 font-display text-xl font-semibold">Belum ada pendaftaran</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Daftar salah satu kegiatan GEN-CB untuk mendapatkan nomor peserta, QR check-in, dan
              kartu peserta digital.
            </p>
            <Button asChild variant="hero" size="lg" className="mt-6">
              <Link to="/event">Lihat Kegiatan</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <div className="rounded-3xl bg-gradient-brand p-6 text-primary-foreground shadow-lift">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
                  Kartu Peserta GEN-CB
                </p>
                <h2 className="mt-3 font-display text-xl font-bold">{active.fullName}</h2>
                <p className="text-sm opacity-85">{active.eventTitle}</p>
                <div className="mt-5 flex items-center gap-4">
                  <div className="rounded-2xl bg-white p-3">
                    <QRCodeSVG value={`GENCB|${active.number}|${active.eventSlug}`} size={96} />
                  </div>
                  <div className="text-xs">
                    <p className="opacity-75">Nomor Peserta</p>
                    <p className="font-display text-lg font-bold tracking-wide">{active.number}</p>
                    <p className="mt-2 opacity-75">Kategori</p>
                    <p className="font-medium">{active.competition}</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => {
                      toast.success("Menyiapkan kartu peserta…");
                      window.print();
                    }}
                  >
                    <Download /> Unduh Kartu
                  </Button>
                  <Button asChild variant="glass" size="sm">
                    <Link to="/event/$slug" params={{ slug: active.eventSlug }}>
                      Detail Kegiatan
                    </Link>
                  </Button>
                </div>
              </div>
            </Reveal>

            <div className="space-y-6">
              <Reveal>
                <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
                  <h3 className="font-display text-base font-semibold">Status pendaftaran</h3>
                  <span
                    className={cn(
                      "mt-3 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold",
                      statusStyle[active.status],
                    )}
                  >
                    {active.status === "ACCEPTED" ? (
                      <CheckCircle2 className="size-4" />
                    ) : active.status === "REJECTED" ? (
                      <XCircle className="size-4" />
                    ) : (
                      <Clock className="size-4" />
                    )}
                    {statusLabel[active.status]}
                  </span>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                      ["Foto KTP / Kartu Pelajar", active.documents.ktp],
                      ["Kartu Keluarga", active.documents.kk],
                      ["Pas Foto", active.documents.photo],
                      ["Bukti Pembayaran", active.documents.payment],
                    ].map(([label, file]) => (
                      <div
                        key={label}
                        className="flex items-center gap-3 rounded-2xl border border-border/60 p-3"
                      >
                        <FileCheck2
                          className={cn("size-4 shrink-0", file ? "text-status-open" : "text-muted-foreground/50")}
                        />
                        <span className="min-w-0">
                          <span className="block text-xs font-medium">{label}</span>
                          <span className="block truncate text-[11px] text-muted-foreground">
                            {file ? `${file} · menunggu diperiksa` : "Tidak diunggah"}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
                  <h3 className="font-display text-base font-semibold">Riwayat kegiatan</h3>
                  <div className="mt-4 space-y-3">
                    {items.map((r) => (
                      <Link
                        key={r.id}
                        to="/dashboard"
                        search={{ id: r.id }}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-2xl border p-4 transition-colors hover:bg-secondary",
                          r.id === active.id ? "border-accent/50" : "border-border/60",
                        )}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">{r.eventTitle}</span>
                          <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <CalendarDays className="size-3" /> {r.eventDate} · {r.number}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "shrink-0 rounded-full border px-3 py-1 text-[10px] font-semibold",
                            statusStyle[r.status],
                          )}
                        >
                          {statusLabel[r.status]}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
                  <h3 className="font-display text-base font-semibold">Sertifikat</h3>
                  {items.some((r) => r.status === "ACCEPTED" && r.certificate) ? (
                    <div className="mt-4 space-y-3">
                      {items
                        .filter((r) => r.certificate)
                        .map((r) => (
                          <div
                            key={r.id}
                            className="flex items-center justify-between rounded-2xl border border-border/60 p-4"
                          >
                            <span className="flex items-center gap-3 text-sm">
                              <Award className="size-4 text-accent" /> {r.eventTitle}
                            </span>
                            <Button variant="outline" size="sm">
                              <Download /> Unduh
                            </Button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Sertifikat terbit setelah kegiatan selesai dan kehadiran terverifikasi melalui
                      QR check-in.
                    </p>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        )}
      </section>
    </>
  );
}