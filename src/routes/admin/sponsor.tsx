import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { RequireModule } from "@/components/admin/guard";
import { ResourceManager } from "@/components/admin/resource-manager";
import { seedSponsors, type SponsorRow } from "@/lib/admin/seed";

export const Route = createFileRoute("/admin/sponsor")({
  head: () => ({
    meta: [
      { title: "Kelola Sponsor & Mitra — Admin GEN-CB" },
      { name: "description", content: "Kelola data sponsor, mitra, dan lembaga pendukung kegiatan GEN-CB." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Kelola Sponsor & Mitra — Admin GEN-CB" },
      { property: "og:description", content: "Data mitra dan sponsor yayasan." },
    ],
  }),
  component: () => (
    <RequireModule module="sponsor">
      <ResourceManager<SponsorRow>
        title="Kelola Sponsor & Mitra"
        description="Logo dan data mitra yang tampil pada halaman publik."
        storageKey="sponsors"
        seed={seedSponsors}
        addLabel="Tambah Mitra"
        searchKeys={["name", "contact", "website"]}
        filters={[
          { key: "type", label: "Tipe", options: ["SPONSOR", "MITRA", "PEMERINTAH"] },
          { key: "status", label: "Status", options: ["AKTIF", "NONAKTIF"] },
        ]}
        columns={[
          { key: "name", label: "Nama" },
          { key: "type", label: "Tipe" },
          { key: "contact", label: "Kontak" },
          { key: "website", label: "Website" },
          {
            key: "status",
            label: "Status",
            render: (r) => (
              <Badge variant={r.status === "AKTIF" ? "default" : "secondary"}>{r.status}</Badge>
            ),
          },
        ]}
        fields={[
          { key: "name", label: "Nama mitra" },
          { key: "type", label: "Tipe", type: "select", options: ["SPONSOR", "MITRA", "PEMERINTAH"] },
          { key: "contact", label: "Kontak" },
          { key: "website", label: "Website", required: false },
          { key: "status", label: "Status", type: "select", options: ["AKTIF", "NONAKTIF"] },
        ]}
      />
    </RequireModule>
  ),
});