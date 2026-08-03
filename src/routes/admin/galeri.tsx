import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { RequireModule } from "@/components/admin/guard";
import { ResourceManager } from "@/components/admin/resource-manager";
import { seedGallery, type GalleryRow } from "@/lib/admin/seed";

export const Route = createFileRoute("/admin/galeri")({
  head: () => ({
    meta: [
      { title: "Kelola Galeri — Admin GEN-CB" },
      { name: "description", content: "Unggah dan kelompokkan foto serta video kegiatan GEN-CB per album." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Kelola Galeri — Admin GEN-CB" },
      { property: "og:description", content: "Kelola dokumentasi foto dan video kegiatan." },
    ],
  }),
  component: () => (
    <RequireModule module="galeri">
      <ResourceManager<GalleryRow>
        title="Kelola Galeri"
        description="Dokumentasi foto dan video, dikelompokkan per album atau kegiatan."
        storageKey="gallery"
        seed={seedGallery}
        addLabel="Unggah Media"
        searchKeys={["caption", "album", "url"]}
        filters={[
          { key: "type", label: "Tipe", options: ["FOTO", "VIDEO"] },
          { key: "album", label: "Album", options: ["MTQ 2026", "Rumah Belajar", "Baksos Ramadan", "Sport Community"] },
        ]}
        columns={[
          { key: "caption", label: "Keterangan" },
          { key: "album", label: "Album" },
          { key: "type", label: "Tipe", render: (r) => <Badge variant="secondary">{r.type}</Badge> },
          { key: "date", label: "Tanggal" },
          { key: "url", label: "Berkas" },
        ]}
        fields={[
          { key: "caption", label: "Keterangan" },
          { key: "album", label: "Album / kegiatan" },
          { key: "type", label: "Tipe media", type: "select", options: ["FOTO", "VIDEO"] },
          { key: "date", label: "Tanggal", type: "date" },
          { key: "url", label: "Nama berkas", placeholder: "contoh: dokumentasi-mtq.jpg" },
        ]}
      />
    </RequireModule>
  ),
});