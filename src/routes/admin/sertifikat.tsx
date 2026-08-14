import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Download, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { RequireModule } from "@/components/admin/guard";
import { ResourceManager } from "@/components/admin/resource-manager";
import { useCollection } from "@/lib/admin/store";
import {
  seedCertificateTemplates,
  seedParticipants,
  type CertificateTemplateRow,
  type ParticipantRow,
} from "@/lib/admin/seed";
import { printTable } from "@/lib/admin/export";

export const Route = createFileRoute("/admin/sertifikat")({
  head: () => ({
    meta: [
      { title: "Kelola Sertifikat — Admin GEN-CB" },
      { name: "description", content: "Template sertifikat per kegiatan dan generate massal PDF peserta GEN-CB." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Kelola Sertifikat — Admin GEN-CB" },
      { property: "og:description", content: "Buat dan terbitkan sertifikat peserta." },
    ],
  }),
  component: () => (
    <RequireModule module="sertifikat">
      <SertifikatAdmin />
    </RequireModule>
  ),
});

function printSingleCertificate(participant: ParticipantRow) {
  const win = window.open("", "_blank", "width=1024,height=720");
  if (!win) return;
  const certNumber = `CERT-GENCB-2026-${participant.number?.replace(/[^0-9]/g, "") || "001"}`;
  win.document.write(`<!doctype html><html><head><title>Sertifikat — ${participant.name}</title><style>
    @page { size: landscape; margin: 0; }
    body { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; margin: 0; padding: 40px; background: #fff; color: #0f172a; text-align: center; }
    .border-box { border: 12px double #10b981; padding: 40px; border-radius: 20px; background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%); }
    .header { font-size: 14px; letter-spacing: 3px; text-transform: uppercase; color: #047857; font-weight: 700; margin-bottom: 8px; }
    .title { font-size: 36px; font-weight: 800; color: #065f46; margin: 0 0 10px; text-transform: uppercase; }
    .sub { font-size: 14px; color: #64748b; margin-bottom: 24px; }
    .name { font-size: 32px; font-weight: 800; color: #0b1b3a; text-decoration: underline; margin: 16px 0; }
    .event { font-size: 18px; font-weight: 700; color: #047857; margin: 12px 0; }
    .cert-no { font-family: monospace; font-size: 12px; color: #64748b; margin-top: 20px; }
    .footer { margin-top: 40px; display: flex; justify-content: space-around; font-size: 12px; }
    .sig { border-top: 1px solid #94a3b8; width: 180px; padding-top: 6px; font-weight: 600; margin: 40px auto 0; }
  </style></head><body>
  <div class="border-box">
    <div class="header">Yayasan Generasi Cerdas Beraksi</div>
    <div class="title">Sertifikat Penghargaan</div>
    <div class="sub">Diberikan secara resmi kepada:</div>
    <div class="name">${participant.name}</div>
    <div class="sub">Atas keikutsertaan dan prestasinya pada kegiatan:</div>
    <div class="event">${participant.eventTitle} (${participant.competition || "Peserta Utama"})</div>
    <div class="cert-no">Nomor Sertifikat: ${certNumber}</div>
    <div class="footer">
      <div><div class="sig">Ketua GEN-CB</div></div>
      <div><div class="sig">Kepala Desa Sasak Panjang</div></div>
    </div>
  </div>
  </body></html>`);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 300);
}

function SertifikatAdmin() {
  const participants = useCollection<ParticipantRow>("participants", seedParticipants);
  const accepted = participants.items.filter((p) => p.status === "ACCEPTED");

  return (
    <div className="space-y-10">
      <ResourceManager<CertificateTemplateRow>
        title="Template Sertifikat"
        description="Setiap kegiatan dapat memakai template dan penandatangan berbeda."
        storageKey="certificate-templates"
        seed={seedCertificateTemplates}
        addLabel="Tambah Template"
        allowDuplicate
        searchKeys={["name", "eventSlug", "signer"]}
        filters={[{ key: "status", label: "Status", options: ["AKTIF", "DRAFT"] }]}
        columns={[
          { key: "name", label: "Template" },
          { key: "eventSlug", label: "Kegiatan" },
          { key: "orientation", label: "Orientasi" },
          { key: "signer", label: "Penandatangan" },
          {
            key: "status",
            label: "Status",
            render: (r) => (
              <Badge variant={r.status === "AKTIF" ? "default" : "secondary"}>{r.status}</Badge>
            ),
          },
        ]}
        fields={[
          { key: "name", label: "Nama template" },
          { key: "eventSlug", label: "Slug kegiatan" },
          { key: "orientation", label: "Orientasi", type: "select", options: ["LANDSCAPE", "PORTRAIT"] },
          { key: "signer", label: "Penandatangan" },
          { key: "background", label: "Desain Background Sertifikat", type: "image", required: false },
          { key: "status", label: "Status", type: "select", options: ["AKTIF", "DRAFT"] },
        ]}
      />

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold">Penerbitan Sertifikat</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate otomatis nama, nomor peserta, dan QR verifikasi untuk peserta yang lulus.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                accepted.forEach((p) => participants.update(p.id, { certificate: "TERBIT" }));
                toast.success(`${accepted.length} sertifikat digenerate`);
              }}
            >
              Generate Massal
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                printTable(
                  "Daftar Sertifikat GEN-CB 2026",
                  accepted as unknown as Record<string, unknown>[],
                  [
                    { key: "number", label: "Nomor" },
                    { key: "name", label: "Nama" },
                    { key: "eventTitle", label: "Kegiatan" },
                    { key: "certificate", label: "Status Sertifikat" },
                  ],
                )
              }
            >
              Download PDF Massal
            </Button>
          </div>
        </div>

        <DataTable
          rows={accepted}
          searchKeys={["name", "number", "eventTitle"]}
          filters={[{ key: "certificate", label: "Sertifikat", options: ["BELUM", "TERBIT"] }]}
          pageSize={10}
          columns={[
            { key: "number", label: "Nomor" },
            { key: "name", label: "Nama" },
            { key: "eventTitle", label: "Kegiatan" },
            {
              key: "certificate",
              label: "Sertifikat",
              render: (r) => (
                <Badge variant={r.certificate === "TERBIT" ? "default" : "secondary"}>
                  {r.certificate}
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
                  participants.update(row.id, { certificate: "TERBIT" });
                  toast.success(`Sertifikat ${row.name} diterbitkan`);
                }}
              >
                Terbitkan
              </Button>
              {row.certificate === "TERBIT" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 text-emerald-600 dark:text-emerald-400"
                  onClick={() => printSingleCertificate(row)}
                  title="Cetak / Download PDF Sertifikat"
                >
                  <Printer className="size-3.5" /> PDF
                </Button>
              )}
            </>
          )}
        />
      </section>
    </div>
  );
}