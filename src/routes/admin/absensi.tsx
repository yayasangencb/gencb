import { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, CheckCircle2, AlertTriangle, ScanLine, Clock, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/admin/data-table";
import { RequireModule } from "@/components/admin/guard";
import { useCollection } from "@/lib/admin/store";
import { seedParticipants, type ParticipantRow } from "@/lib/admin/seed";

export const Route = createFileRoute("/admin/absensi")({
  head: () => ({
    meta: [
      { title: "Kelola Absensi — Admin GEN-CB" },
      { name: "description", content: "QR check-in/check-out peserta dan riwayat kehadiran per kegiatan." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Kelola Absensi — Admin GEN-CB" },
      { property: "og:description", content: "Pantau kehadiran peserta kegiatan." },
    ],
  }),
  component: () => (
    <RequireModule module="absensi">
      <AbsensiAdmin />
    </RequireModule>
  ),
});

function AbsensiAdmin() {
  const { items, update } = useCollection<ParticipantRow>("participants", seedParticipants);
  const [code, setCode] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<{
    name: string;
    mode: "CHECKIN" | "CHECKOUT";
    time: string;
    alreadyChecked: boolean;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isCameraActive) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: "environment" } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          toast.error("Kamera tidak dapat diakses atau tidak diizinkan.");
          setIsCameraActive(false);
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraActive]);

  const processScan = (scannedCode: string, mode: "CHECKIN" | "CHECKOUT") => {
    const trimmed = scannedCode.trim().toLowerCase();
    if (!trimmed) {
      toast.error("Masukkan nomor peserta atau scan QR Code");
      return;
    }

    const found = items.find(
      (i) =>
        i.number.toLowerCase() === trimmed ||
        i.id.toLowerCase() === trimmed ||
        `gencb-2026-${i.id.toLowerCase()}` === trimmed,
    );

    if (!found) {
      toast.error(`Nomor peserta "${scannedCode}" tidak ditemukan dalam daftar`);
      return;
    }

    const nowStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    // Double check-in validation
    if (mode === "CHECKIN" && found.attendance === "CHECKIN") {
      setLastScanResult({
        name: found.name,
        mode: "CHECKIN",
        time: nowStr,
        alreadyChecked: true,
      });
      toast.warning(`[Peringatan] ${found.name} sudah melakukan Check-In sebelumnya!`);
      setCode("");
      return;
    }

    update(found.id, { attendance: mode });

    setLastScanResult({
      name: found.name,
      mode,
      time: nowStr,
      alreadyChecked: false,
    });

    toast.success(`Berhasil! ${found.name} melakukan ${mode === "CHECKIN" ? "Check-In" : "Check-Out"}`);
    setCode("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Kelola Absensi & QR Scanner</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Scan QR peserta menggunakan kamera panitia atau masukkan nomor peserta secara manual.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-1 space-y-4">
          <div className="relative aspect-video w-full flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40 overflow-hidden">
            {isCameraActive ? (
              <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
            ) : (
              <div className="text-center p-4">
                <ScanLine className="mx-auto size-10 text-primary animate-pulse" />
                <p className="mt-2 text-sm font-medium">Kamera Panitia</p>
                <p className="text-xs text-muted-foreground">Aktifkan scanner kamera untuk scan cepat</p>
              </div>
            )}
          </div>

          <Button
            variant={isCameraActive ? "destructive" : "outline"}
            className="w-full gap-2 rounded-xl text-xs"
            onClick={() => setIsCameraActive(!isCameraActive)}
          >
            <Camera className="size-4" />
            {isCameraActive ? "Matikan Kamera Scanner" : "Nyalakan Kamera Scanner"}
          </Button>

          {/* Last Scan Result Alert */}
          {lastScanResult && (
            <div
              className={`p-3 rounded-xl border text-xs space-y-1 ${
                lastScanResult.alreadyChecked
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                {lastScanResult.alreadyChecked ? (
                  <AlertTriangle className="size-4 text-amber-500" />
                ) : (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                )}
                <span>
                  {lastScanResult.alreadyChecked
                    ? "Duplikasi Check-In Terdeteksi"
                    : `Absensi ${lastScanResult.mode} Berhasil`}
                </span>
              </div>
              <p className="font-semibold">{lastScanResult.name}</p>
              <p className="text-[10px] opacity-80 flex items-center gap-1">
                <Clock className="size-3" /> Waktu: {lastScanResult.time} WIB
              </p>
            </div>
          )}

          <div className="space-y-2 pt-2 border-t border-border">
            <label className="text-xs font-semibold text-foreground block">Scan / Input Manual Nomor Peserta</label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Contoh: GENCB-2026-0001"
              className="text-xs"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), processScan(code, "CHECKIN"))}
            />
            <div className="flex gap-2">
              <Button className="flex-1 rounded-xl text-xs" onClick={() => processScan(code, "CHECKIN")}>
                <UserCheck className="size-3.5 mr-1" /> Check-In
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-xl text-xs"
                onClick={() => processScan(code, "CHECKOUT")}
              >
                Check-Out
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <DataTable
            rows={items}
            searchKeys={["name", "number", "eventTitle"]}
            filters={[
              { key: "attendance", label: "Kehadiran", options: ["BELUM", "CHECKIN", "CHECKOUT"] },
              { key: "eventTitle", label: "Event", options: [...new Set(items.map((i) => i.eventTitle))] },
            ]}
            pageSize={8}
            columns={[
              { key: "number", label: "Nomor" },
              { key: "name", label: "Nama Peserta" },
              { key: "eventTitle", label: "Kegiatan" },
              {
                key: "attendance",
                label: "Status Kehadiran",
                render: (r) => (
                  <Badge variant={r.attendance === "BELUM" ? "secondary" : "default"}>
                    {r.attendance}
                  </Badge>
                ),
              },
            ]}
            actions={(row) => (
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                onClick={() => {
                  const nextMode = row.attendance === "CHECKIN" ? "CHECKOUT" : "CHECKIN";
                  update(row.id, { attendance: nextMode });
                  toast.success(`Status ${row.name} diubah menjadi ${nextMode}`);
                }}
              >
                Toggle {row.attendance === "CHECKIN" ? "Check-Out" : "Check-In"}
              </Button>
            )}
          />
        </div>
      </div>
    </div>
  );
}