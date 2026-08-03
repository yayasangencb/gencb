import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { RequireModule } from "@/components/admin/guard";
import { useCollection } from "@/lib/admin/store";
import { seedEvents, seedParticipants, type EventRow, type ParticipantRow } from "@/lib/admin/seed";

export const Route = createFileRoute("/admin/live")({
  head: () => ({
    meta: [
      { title: "Live Event Monitor — Admin GEN-CB" },
      { name: "description", content: "Pantau kehadiran, agenda berjalan, dan kirim pengumuman realtime saat kegiatan." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Live Event Monitor — Admin GEN-CB" },
      { property: "og:description", content: "Panel realtime pelaksanaan kegiatan GEN-CB." },
    ],
  }),
  component: () => (
    <RequireModule module="live">
      <LiveMonitor />
    </RequireModule>
  ),
});

function LiveMonitor() {
  const { items: events } = useCollection<EventRow>("events", seedEvents);
  const { items: participants } = useCollection<ParticipantRow>("participants", seedParticipants);
  const [announcement, setAnnouncement] = useState("");
  const [media, setMedia] = useState("");

  const live = events.find((e) => e.status === "ONGOING") ?? events[0];
  const eventParticipants = participants.filter((p) => p.eventSlug === live?.slug);
  const present = eventParticipants.filter((p) => p.attendance !== "BELUM").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-bold">Live Event Monitor</h1>
        <Badge variant="destructive">LIVE</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Kegiatan berjalan</p>
          <p className="mt-2 font-display text-lg font-bold">{live?.title ?? "-"}</p>
          <p className="text-xs text-muted-foreground">{live?.location}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Peserta hadir</p>
          <p className="mt-2 font-display text-2xl font-bold">
            {present} / {eventParticipants.length}
          </p>
          <Progress
            className="mt-3"
            value={eventParticipants.length ? (present / eventParticipants.length) * 100 : 0}
          />
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Agenda saat ini</p>
          <p className="mt-2 font-display text-lg font-bold">Babak pertandingan sore</p>
          <p className="text-xs text-muted-foreground">Berikutnya: sesi malam pukul 19.30</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-display text-base font-semibold">Pengumuman realtime</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Tampil langsung pada halaman publik detail kegiatan.
          </p>
          <Textarea
            className="mt-3"
            rows={4}
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Contoh: Peserta nomor 21–40 harap bersiap di ruang tunggu."
          />
          <Button
            className="mt-3"
            onClick={() => {
              if (!announcement.trim()) {
                toast.error("Pengumuman masih kosong");
                return;
              }
              toast.success("Pengumuman dikirim ke halaman publik");
              setAnnouncement("");
            }}
          >
            Kirim Pengumuman
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-display text-base font-semibold">Upload cepat dokumentasi</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Unggah foto/video terbaru agar langsung tampil di galeri kegiatan.
          </p>
          <Input
            className="mt-3"
            value={media}
            onChange={(e) => setMedia(e.target.value)}
            placeholder="nama-berkas.jpg"
          />
          <Button
            variant="outline"
            className="mt-3"
            onClick={() => {
              if (!media.trim()) {
                toast.error("Pilih berkas terlebih dahulu");
                return;
              }
              toast.success("Dokumentasi diunggah ke galeri kegiatan");
              setMedia("");
            }}
          >
            Unggah
          </Button>
        </div>
      </div>
    </div>
  );
}