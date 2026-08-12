import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { RequireModule } from "@/components/admin/guard";
import { ResourceManager } from "@/components/admin/resource-manager";
import { seedBanners, type BannerRow } from "@/lib/admin/seed";

export const Route = createFileRoute("/admin/banner")({
  head: () => ({
    meta: [
      { title: "Kelola Banner — Admin GEN-CB" },
      { name: "description", content: "Atur banner dan slide hero yang tampil di beranda GEN-CB." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Kelola Banner — Admin GEN-CB" },
      { property: "og:description", content: "Kelola slide hero halaman utama." },
    ],
  }),
  component: () => (
    <RequireModule module="banner">
      <ResourceManager<BannerRow>
        title="Kelola Banner / Hero"
        description="Slide yang tampil pada bagian hero halaman utama, diurutkan sesuai nomor urut."
        storageKey="banners"
        seed={seedBanners}
        addLabel="Tambah Banner"
        searchKeys={["title", "subtitle"]}
        filters={[{ key: "status", label: "Status", options: ["AKTIF", "NONAKTIF"] }]}
        columns={[
          { key: "order", label: "Urutan" },
          { key: "title", label: "Judul" },
          { key: "subtitle", label: "Subjudul" },
          { key: "ctaLabel", label: "Tombol" },
          { key: "ctaLink", label: "Tautan" },
          {
            key: "status",
            label: "Status",
            render: (r) => (
              <Badge variant={r.status === "AKTIF" ? "default" : "secondary"}>{r.status}</Badge>
            ),
          },
        ]}
        fields={[
          { key: "title", label: "Judul banner" },
          { key: "subtitle", label: "Subjudul" },
          { key: "ctaLabel", label: "Label tombol" },
          { key: "ctaLink", label: "Tautan tombol" },
          { key: "order", label: "Urutan tampil", type: "number" },
          { key: "status", label: "Status", type: "select", options: ["AKTIF", "NONAKTIF"] },
          { key: "image", label: "Gambar Banner / Background", type: "image", required: false },
        ]}
      />
    </RequireModule>
  ),
});