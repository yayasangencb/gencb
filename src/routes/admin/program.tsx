import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { RequireModule } from "@/components/admin/guard";
import { ResourceManager } from "@/components/admin/resource-manager";
import { seedPrograms, type ProgramRow } from "@/lib/admin/seed";

export const Route = createFileRoute("/admin/program")({
  head: () => ({
    meta: [
      { title: "Kelola Program — Admin GEN-CB" },
      { name: "description", content: "CRUD program unggulan GEN-CB beserta kategori dan target sasaran." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Kelola Program — Admin GEN-CB" },
      { property: "og:description", content: "Atur program unggulan yayasan." },
    ],
  }),
  component: () => (
    <RequireModule module="program">
      <ResourceManager<ProgramRow>
        title="Kelola Program"
        description="Program unggulan yang tampil pada halaman publik."
        storageKey="programs"
        seed={seedPrograms}
        addLabel="Tambah Program"
        exportable
        searchKeys={["title", "category", "target"]}
        filters={[
          {
            key: "category",
            label: "Kategori",
            options: ["Pendidikan", "Keagamaan", "Sosial", "Olahraga", "Lingkungan", "Teknologi"],
          },
          { key: "status", label: "Status", options: ["AKTIF", "ARSIP"] },
        ]}
        columns={[
          { key: "title", label: "Program" },
          { key: "category", label: "Kategori" },
          { key: "target", label: "Target" },
          {
            key: "status",
            label: "Status",
            render: (r) => (
              <Badge variant={r.status === "AKTIF" ? "default" : "secondary"}>{r.status}</Badge>
            ),
          },
        ]}
        fields={[
          { key: "title", label: "Nama Program" },
          {
            key: "category",
            label: "Kategori",
            type: "select",
            options: ["Pendidikan", "Keagamaan", "Sosial", "Olahraga", "Lingkungan", "Teknologi"],
          },
          { key: "target", label: "Target sasaran" },
          { key: "image", label: "Gambar / Cover Program", type: "image", required: false },
          { key: "status", label: "Status", type: "select", options: ["AKTIF", "ARSIP"] },
          { key: "description", label: "Deskripsi", type: "textarea" },
        ]}
      />
    </RequireModule>
  ),
});