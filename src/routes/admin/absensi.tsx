import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ScanLine } from "lucide-react";
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

  const scan = (mode: "CHECKIN" | "CHECKOUT") => {
    const found = items.find((i) => i.number.toLowerCase() === code.trim().toLowerCase());
    if (!found) {
      toast.error("Nomor peserta tidak ditemukan");
      return;
    }
    update(found.id, { attendance: mode });
    toast.success(`${found.name} berhasil ${mode === "CHECKIN" ? "check-in" : "check-out"}`);
    setCode("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Kelola Absensi</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Scan QR peserta menggunakan kamera panitia atau masukkan nomor peserta secara manual.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-1">
          <div className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50">
            <div className="text-center">
              <ScanLine className="mx-auto size-10 text-primary" />
              <p className="mt-2 text-sm font-medium">Area Scanner QR</p>
              <p className="text-xs text-muted-foreground">Arahkan QR peserta ke kamera</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="GENCB-2026-0001"
            />
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => scan("CHECKIN")}>
                Check-In
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => scan("CHECKOUT")}>
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
              { key: "name", label: "Nama" },
              { key: "eventTitle", label: "Kegiatan" },
              {
                key: "attendance",
                label: "Status",
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
                onClick={() => {
                  update(row.id, { attendance: row.attendance === "CHECKIN" ? "CHECKOUT" : "CHECKIN" });
                  toast.success("Kehadiran diperbarui");
                }}
              >
                {row.attendance === "CHECKIN" ? "Check-Out" : "Check-In"}
              </Button>
            )}
          />
        </div>
      </div>
    </div>
  );
}