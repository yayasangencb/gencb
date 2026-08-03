import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { RequireModule } from "@/components/admin/guard";
import { useCollection } from "@/lib/admin/store";
import { seedParticipants, type ParticipantRow } from "@/lib/admin/seed";
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
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                items
                  .filter((i) => !i.number)
                  .forEach((i, idx) =>
                    update(i.id, { number: `GENCB-2026-${String(9000 + idx).padStart(4, "0")}` }),
                  );
                toast.success("Nomor peserta & QR Code digenerate massal");
              }}
            >
              Generate Nomor & QR
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                downloadCsv("daftar-peserta", items as unknown as Record<string, unknown>[], headers);
                toast.success("Export Excel diunduh");
              }}
            >
              Export Excel
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                printTable("Daftar Peserta GEN-CB", items as unknown as Record<string, unknown>[], headers)
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
              size="sm"
              variant="outline"
              onClick={() => {
                update(row.id, { status: "ACCEPTED" });
                toast.success(`${row.name} diverifikasi`);
              }}
            >
              Terima
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive"
              onClick={() => {
                update(row.id, { status: "REJECTED" });
                toast.success(`Pendaftaran ${row.name} ditolak`);
              }}
            >
              Tolak
            </Button>
          </>
        )}
      />
    </div>
  );
}