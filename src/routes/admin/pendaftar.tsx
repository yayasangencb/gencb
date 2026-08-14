import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { Eye, FileCheck, FileX, QrCode } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/admin/data-table";
import { RequireModule } from "@/components/admin/guard";
import { useCollection } from "@/lib/admin/store";
import { seedEvents, seedParticipants, type EventRow, type ParticipantRow } from "@/lib/admin/seed";
import { downloadCsv, printTable } from "@/lib/admin/export";

export const Route = createFileRoute("/admin/pendaftar")({
  head: () => ({
    meta: [
      { title: "Kelola Pendaftar — Admin GEN-CB" },
      { name: "description", content: "Verifikasi pendaftar event, generate nomor peserta & QR, export Excel/PDF." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Kelola Pendaftar — Admin GEN-CB" },
      { property: "og:description", content: "Verifikasi dan kelola data peserta kegiatan." },
    ],
  }),
  component: () => (
    <RequireModule module="pendaftar">
      <PendaftarAdmin />
    </RequireModule>
  ),
});

const headers = [
  { key: "number", label: "Nomor Peserta" },
  { key: "name", label: "Nama" },
  { key: "eventTitle", label: "Event" },
  { key: "competition", label: "Kategori Lomba" },
  { key: "phone", label: "Kontak" },
  { key: "school", label: "Asal" },
  { key: "status", label: "Status" },
];

function PendaftarAdmin() {
  const { items, update } = useCollection<ParticipantRow>("participants", seedParticipants);
  const events = useCollection<EventRow>("events", seedEvents);
  const [selectedRow, setSelectedRow] = useState<ParticipantRow | null>(null);

  const handleStatusChange = (row: ParticipantRow, nextStatus: "ACCEPTED" | "REJECTED") => {
    update(row.id, { status: nextStatus });

    // Update registered count on associated event
    const event = events.items.find((e) => e.title === row.eventTitle || e.slug === row.eventSlug);
    if (event) {
      const acceptedCount = items.filter(
        (i) =>
          (i.eventTitle === row.eventTitle || i.id === row.id) &&
          (i.id === row.id ? nextStatus === "ACCEPTED" : i.status === "ACCEPTED"),
      ).length;
      events.update(event.id, { registered: acceptedCount });
    }

    toast.success(
      nextStatus === "ACCEPTED"
        ? `Pendaftaran ${row.name} berhasil diverifikasi`
        : `Pendaftaran ${row.name} ditolak`,
    );
  };

  const handleGenerateNumbers = () => {
    let count = 0;
    items.forEach((i, idx) => {
      const formattedNum = `GENCB-2026-${String(1001 + idx).padStart(4, "0")}`;
      if (i.number !== formattedNum) {
        update(i.id, { number: formattedNum });
        count++;
      }
    });
    toast.success(`Nomor peserta & QR Code berhasil diperbarui (${count} peserta)`);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold">Kelola Form Pendaftaran</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Verifikasi dokumen peserta, generate nomor & QR Code, lalu export atau cetak daftar peserta.
        </p>
      </div>

      <DataTable
        rows={items}
        searchKeys={["name", "number", "eventTitle", "competition"]}
        filters={[
          { key: "status", label: "Verifikasi", options: ["PENDING", "ACCEPTED", "REJECTED"] },
          { key: "eventTitle", label: "Event", options: [...new Set(items.map((i) => i.eventTitle))] },
        ]}
        pageSize={10}
        toolbar={
          <>
            <Button size="sm" variant="outline" onClick={handleGenerateNumbers}>
              Generate Nomor & QR
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                downloadCsv("daftar-peserta-gencb", items as unknown as Record<string, unknown>[], headers);
                toast.success("Export Excel (.csv/.xlsx) diunduh");
              }}
            >
              Export Excel
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                printTable("Daftar Peserta GEN-CB 2026", items as unknown as Record<string, unknown>[], headers)
              }
            >
              Export PDF / Cetak
            </Button>
          </>
        }
        columns={[
          { key: "number", label: "Nomor" },
          { key: "name", label: "Nama" },
          { key: "eventTitle", label: "Event" },
          { key: "competition", label: "Kategori" },
          { key: "documents", label: "Dokumen" },
          {
            key: "status",
            label: "Verifikasi",
            render: (r) => (
              <Badge
                variant={
                  r.status === "ACCEPTED" ? "default" : r.status === "PENDING" ? "secondary" : "destructive"
                }
              >
                {r.status}
              </Badge>
            ),
          },
        ]}
        actions={(row) => (
          <>
            <Button
              size="icon"
              variant="outline"
              className="size-8"
              onClick={() => setSelectedRow(row)}
              title="Lihat Detail & QR"
            >
              <Eye className="size-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1 text-emerald-600 dark:text-emerald-400"
              onClick={() => handleStatusChange(row, "ACCEPTED")}
            >
              <FileCheck className="size-3.5" /> Terima
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1 text-destructive"
              onClick={() => handleStatusChange(row, "REJECTED")}
            >
              <FileX className="size-3.5" /> Tolak
            </Button>
          </>
        )}
      />

      {/* Participant Detail & QR Dialog */}
      <Dialog open={!!selectedRow} onOpenChange={(o) => !o && setSelectedRow(null)}>
        {selectedRow && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Detail Peserta — {selectedRow.name}</DialogTitle>
              <DialogDescription>
                Informasi pendaftaran dan QR verifikasi check-in kegiatan.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-2xl border border-border text-center space-y-2">
                <QRCodeSVG value={selectedRow.number || selectedRow.id} size={140} />
                <p className="font-mono text-sm font-bold text-primary">{selectedRow.number}</p>
                <p className="text-xs text-muted-foreground">Scan QR ini saat check-in di lokasi</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Kegiatan</p>
                  <p className="font-semibold text-foreground">{selectedRow.eventTitle}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Kategori Lomba</p>
                  <p className="font-semibold text-foreground">{selectedRow.competition}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Nomor HP / WA</p>
                  <p className="font-semibold text-foreground">{selectedRow.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Asal Sekolah / Instansi</p>
                  <p className="font-semibold text-foreground">{selectedRow.school}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status Verifikasi</p>
                  <Badge
                    variant={
                      selectedRow.status === "ACCEPTED"
                        ? "default"
                        : selectedRow.status === "PENDING"
                          ? "secondary"
                          : "destructive"
                    }
                    className="mt-1"
                  >
                    {selectedRow.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Kelengkapan Dokumen</p>
                  <p className="font-semibold text-foreground">{selectedRow.documents}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}