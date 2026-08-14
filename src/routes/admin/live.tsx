import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Radio, AlertCircle, Send, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { RequireModule } from "@/components/admin/guard";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import { useCollection } from "@/lib/admin/store";
import { seedEvents, seedGallery, seedParticipants, type EventRow, type GalleryRow, type ParticipantRow } from "@/lib/admin/seed";

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
  const gallery = useCollection<GalleryRow>("gallery", seedGallery);

  const [announcement, setAnnouncement] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [activeAnnouncements, setActiveAnnouncements] = useState<string[]>([
    "Peserta cabang Murottal harap berkumpul di panggung utama jam 09.00 WIB.",
  ]);

  const live = events.find((e) => e.status === "ONGOING") ?? events[0];
  const eventParticipants = live ? participants.filter((p) => p.eventSlug === live.slug || p.eventTitle === live.title) : [];
  const present = eventParticipants.filter((p) => p.attendance === "CHECKIN" || p.attendance === "CHECKOUT").length;

  const handleSendAnnouncement = () => {
    if (!announcement.trim()) {
      toast.error("Pengumuman masih kosong");
      return;
    }
    setActiveAnnouncements([announcement.trim(), ...activeAnnouncements]);
    toast.success("Pengumuman realtime disebarkan ke halaman publik event!");
    setAnnouncement("");
  };

  const handleUploadLivePhoto = () => {
    if (!mediaUrl.trim()) {
      toast.error("Silakan unggah foto atau masukkan URL berkas");
      return;
    }
    gallery.create({
      caption: `Dokumentasi Realtime: ${live?.title || "Kegiatan GEN-CB"}`,
      album: live?.title || "Sport Community",
      type: "FOTO",
      date: new Date().toISOString().slice(0, 10),
      url: mediaUrl,
    });
    toast.success("Foto dokumentasi langsung diterbitkan ke Galeri!");
    setMediaUrl("");
  };

  if (!live) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-10 text-center shadow-sm space-y-3">
        <AlertCircle className="mx-auto size-10 text-muted-foreground" />
        <h1 className="font-display text-lg font-bold">Tidak Ada Event Berlangsung</h1>
        <p className="text-sm text-muted-foreground">
          Saat ini belum ada kegiatan dengan status ONGOING. Silakan atur status event menjadi ONGOING pada modul Kelola Event.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-bold">Live Event Monitor</h1>
        <Badge variant="destructive" className="animate-pulse gap-1">
          <Radio className="size-3" /> LIVE REALTIME
        </Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-1">
          <p className="text-sm text-muted-foreground font-medium">Kegiatan Berlangsung</p>
          <p className="font-display text-xl font-bold text-foreground truncate">{live.title}</p>
          <p className="text-xs text-muted-foreground truncate">{live.location}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
          <p className="text-sm text-muted-foreground font-medium">Kehadiran Peserta Terverifikasi</p>
          <div className="flex items-baseline justify-between">
            <p className="font-display text-2xl font-bold">
              {present} / {eventParticipants.length || live.quota}
            </p>
            <span className="text-xs font-semibold text-primary">
              {eventParticipants.length ? Math.round((present / eventParticipants.length) * 100) : 0}% Hadir
            </span>
          </div>
          <Progress
            value={eventParticipants.length ? (present / eventParticipants.length) * 100 : 0}
            className="h-2"
          />
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-1">
          <p className="text-sm text-muted-foreground font-medium">Agenda Berjalan</p>
          <p className="font-display text-lg font-bold text-emerald-600 dark:text-emerald-400">
            Sesi Pertandingan Utama
          </p>
          <p className="text-xs text-muted-foreground">Status Pendaftaran: {live.status}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Realtime Announcement Box */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div>
            <h2 className="font-display text-base font-semibold">Pengumuman Realtime Panggung</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Ketik pengumuman panitia untuk disebarkan ke layar monitor & halaman peserta.
            </p>
          </div>
          <Textarea
            rows={3}
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Contoh: Peserta nomor undi 15-20 harap menempati meja penyisihan 2."
          />
          <Button onClick={handleSendAnnouncement} className="rounded-xl text-xs gap-1.5">
            <Send className="size-3.5" /> Kirim Pengumuman Realtime
          </Button>

          {activeAnnouncements.length > 0 && (
            <div className="pt-2 space-y-2 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground">Pengumuman Terkirim:</p>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                {activeAnnouncements.map((a, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-muted/40 text-xs flex items-start gap-2 border border-border/50">
                    <Check className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Media Upload */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div>
            <h2 className="font-display text-base font-semibold">Dokumentasi Foto Realtime</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Seret & lepas foto dokumentasi terkini dari lokasi kegiatan.
            </p>
          </div>
          <ImageDropzone
            value={mediaUrl}
            onChange={setMediaUrl}
            label="Unggah Dokumentasi Live"
            placeholder="Seret foto suasana kegiatan ke sini"
          />
          <Button onClick={handleUploadLivePhoto} variant="outline" className="rounded-xl text-xs">
            Terbitkan Foto ke Galeri
          </Button>
        </div>
      </div>
    </div>
  );
}