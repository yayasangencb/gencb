import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Eye, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const programs = useCollection<DonationProgramRow>("donation-programs", seedDonationPrograms);
  const [selectedDonor, setSelectedDonor] = useState<DonorRow | null>(null);

  const handleVerifyDonation = (donor: DonorRow, nextStatus: "VERIFIED" | "REJECTED") => {
    const prevStatus = donor.status;
    donors.update(donor.id, { status: nextStatus });

    // Update collected amount on matching donation program
    const matchingProgram = programs.items.find(
      (p) => p.title === donor.program || p.id === donor.program,
    );

    if (matchingProgram) {
      let currentCollected = Number(matchingProgram.collected || 0);
      const amount = Number(donor.amount || 0);

      if (prevStatus !== "VERIFIED" && nextStatus === "VERIFIED") {
        currentCollected += amount;
      } else if (prevStatus === "VERIFIED" && nextStatus !== "VERIFIED") {
        currentCollected = Math.max(0, currentCollected - amount);
      }

      programs.update(matchingProgram.id, { collected: currentCollected });
    }

    toast.success(
      nextStatus === "VERIFIED"
        ? `Donasi Rp ${formatIdr(Number(donor.amount))} berhasil diverifikasi`
        : `Donasi ditolak`,
    );
  };

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
          {
            key: "progress",
            label: "Progres",
            render: (r) => {
              const target = Number(r.target) || 1;
              const collected = Number(r.collected) || 0;
              const pct = Math.min(Math.round((collected / target) * 100), 100);
              return (
                <div className="w-28 space-y-1">
                  <Progress value={pct} className="h-2" />
                  <span className="text-[10px] font-semibold text-muted-foreground">{pct}% Terkumpul</span>
                </div>
              );
            },
          },
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
            {
              key: "name",
              label: "Donatur",
              render: (r) => (
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">{r.anonymous ? "Hamba Allah" : r.name}</span>
                  {r.anonymous && (
                    <Badge variant="outline" className="text-[10px]">
                      Anonim
                    </Badge>
                  )}
                </div>
              ),
            },
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
                size="icon"
                variant="outline"
                className="size-8"
                onClick={() => setSelectedDonor(row)}
                title="Lihat Bukti Transfer"
              >
                <Eye className="size-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1 text-emerald-600 dark:text-emerald-400"
                onClick={() => handleVerifyDonation(row, "VERIFIED")}
              >
                <CheckCircle2 className="size-3.5" /> Verifikasi
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1 text-destructive"
                onClick={() => handleVerifyDonation(row, "REJECTED")}
              >
                <XCircle className="size-3.5" /> Tolak
              </Button>
            </>
          )}
        />
      </section>

      {/* Donor Proof Dialog */}
      <Dialog open={!!selectedDonor} onOpenChange={(o) => !o && setSelectedDonor(null)}>
        {selectedDonor && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Bukti Transfer Donasi</DialogTitle>
              <DialogDescription>
                Donatur: {selectedDonor.anonymous ? "Hamba Allah (Anonim)" : selectedDonor.name} — Nominal: {formatIdr(Number(selectedDonor.amount))}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="aspect-video w-full rounded-xl bg-muted/40 border border-border flex items-center justify-center overflow-hidden">
                <div className="text-center p-6 space-y-2">
                  <Badge variant="outline" className="text-xs">
                    Metode {selectedDonor.method}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Bukti Pembayaran Terverifikasi untuk {selectedDonor.program}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 rounded-xl"
                  onClick={() => {
                    handleVerifyDonation(selectedDonor, "VERIFIED");
                    setSelectedDonor(null);
                  }}
                >
                  Setujui Donasi
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 rounded-xl"
                  onClick={() => {
                    handleVerifyDonation(selectedDonor, "REJECTED");
                    setSelectedDonor(null);
                  }}
                >
                  Tolak Donasi
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}