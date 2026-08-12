import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
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
                  "Daftar Sertifikat GEN-CB",
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
          )}
        />
      </section>
    </div>
  );
}