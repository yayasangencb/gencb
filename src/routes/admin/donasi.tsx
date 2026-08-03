import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { RequireModule } from "@/components/admin/guard";
import { ResourceManager } from "@/components/admin/resource-manager";
import { useCollection } from "@/lib/admin/store";
import {
  seedDonationPrograms,
  seedDonors,
  type DonationProgramRow,
  type DonorRow,
} from "@/lib/admin/seed";
import { formatIdr } from "@/lib/admin/export";

export const Route = createFileRoute("/admin/donasi")({
  head: () => ({
    meta: [
      { title: "Kelola Donasi — Admin GEN-CB" },
      { name: "description", content: "Kelola program donasi, verifikasi bukti transfer, dan daftar donatur." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Kelola Donasi — Admin GEN-CB" },
      { property: "og:description", content: "Verifikasi donasi masuk dan pantau progres program." },
    ],
  }),
  component: () => (
    <RequireModule module="donasi">
      <DonasiAdmin />
    </RequireModule>
  ),
});

function DonasiAdmin() {
  const donors = useCollection<DonorRow>("donors", seedDonors);

  return (
    <div className="space-y-10">
      <ResourceManager<DonationProgramRow>
        title="Program Donasi"
        description="Target, dana terkumpul, dan batas waktu tiap program donasi."
        storageKey="donation-programs"
        seed={seedDonationPrograms}
        addLabel="Tambah Program Donasi"
        exportable
        searchKeys={["title"]}
        filters={[{ key: "status", label: "Status", options: ["AKTIF", "SELESAI"] }]}
        columns={[
          { key: "title", label: "Program" },
          { key: "target", label: "Target", render: (r) => formatIdr(Number(r.target)) },
          { key: "collected", label: "Terkumpul", render: (r) => formatIdr(Number(r.collected)) },
          { key: "deadline", label: "Batas waktu" },
          {
            key: "status",
            label: "Status",
            render: (r) => (
              <Badge variant={r.status === "AKTIF" ? "default" : "secondary"}>{r.status}</Badge>
            ),
          },
        ]}
        fields={[
          { key: "title", label: "Nama program" },
          { key: "target", label: "Target dana (Rp)", type: "number" },
          { key: "collected", label: "Dana terkumpul (Rp)", type: "number" },
          { key: "deadline", label: "Batas waktu", type: "date" },
          { key: "status", label: "Status", type: "select", options: ["AKTIF", "SELESAI"] },
        ]}
      />

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-bold">Verifikasi Donatur</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Periksa bukti transfer/QRIS lalu setujui atau tolak donasi yang masuk.
          </p>
        </div>
        <DataTable
          rows={donors.items}
          searchKeys={["name", "program"]}
          filters={[
            { key: "status", label: "Status", options: ["PENDING", "VERIFIED", "REJECTED"] },
            { key: "method", label: "Metode", options: ["TRANSFER", "QRIS"] },
          ]}
          columns={[
            { key: "name", label: "Donatur", render: (r) => (r.anonymous ? "Hamba Allah (anonim)" : r.name) },
            { key: "program", label: "Program" },
            { key: "amount", label: "Nominal", render: (r) => formatIdr(Number(r.amount)) },
            { key: "method", label: "Metode" },
            { key: "date", label: "Tanggal" },
            {
              key: "status",
              label: "Status",
              render: (r) => (
                <Badge
                  variant={
                    r.status === "VERIFIED" ? "default" : r.status === "PENDING" ? "secondary" : "destructive"
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
                  donors.update(row.id, { status: "VERIFIED" });
                  toast.success("Donasi diverifikasi");
                }}
              >
                Verifikasi
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-destructive"
                onClick={() => {
                  donors.update(row.id, { status: "REJECTED" });
                  toast.success("Donasi ditolak");
                }}
              >
                Tolak
              </Button>
            </>
          )}
        />
      </section>
    </div>
  );
}