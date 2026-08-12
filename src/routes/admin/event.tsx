import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { RequireModule } from "@/components/admin/guard";
import { ResourceManager } from "@/components/admin/resource-manager";
import { seedEvents, type EventRow } from "@/lib/admin/seed";
import { formatIdr } from "@/lib/admin/export";

export const Route = createFileRoute("/admin/event")({
  head: () => ({
    meta: [
      { title: "Kelola Event — Admin GEN-CB" },
      { name: "description", content: "Kelola kegiatan GEN-CB: kuota, status, biaya, lokasi, dan panitia." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Kelola Event — Admin GEN-CB" },
      { property: "og:description", content: "Atur jadwal, kuota, dan status pendaftaran kegiatan." },
    ],
  }),
  component: () => (
    <RequireModule module="event">
      <EventAdmin />
    </RequireModule>
  ),
});

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  OPEN: "default",
  SOON: "secondary",
  ONGOING: "outline",
  CLOSED: "destructive",
};

function EventAdmin() {
  return (
    <ResourceManager<EventRow>
      title="Kelola Event / Kegiatan"
      description="Tambah dan perbarui kegiatan, atur status pendaftaran serta panitia yang ditugaskan."
      storageKey="events"
      seed={seedEvents}
      exportable
      allowDuplicate
      addLabel="Tambah Event"
      searchKeys={["title", "category", "location"]}
      filters={[
        {
          key: "category",
          label: "Kategori",
          options: ["Keagamaan", "Kepemudaan", "Olahraga", "Sosial", "Pendidikan", "Kebangsaan"],
        },
        { key: "status", label: "Status", options: ["OPEN", "SOON", "ONGOING", "CLOSED"] },
      ]}
      columns={[
        { key: "title", label: "Nama Event" },
        { key: "category", label: "Kategori" },
        { key: "date", label: "Tanggal" },
        {
          key: "status",
          label: "Status",
          render: (r) => <Badge variant={statusVariant[r.status] ?? "secondary"}>{r.status}</Badge>,
        },
        {
          key: "registered",
          label: "Pendaftar / Kuota",
          render: (r) => `${r.registered} / ${r.quota}`,
        },
        {
          key: "fee",
          label: "Biaya",
          render: (r) => (Number(r.fee) > 0 ? formatIdr(Number(r.fee)) : "Gratis"),
        },
      ]}
      fields={[
        { key: "title", label: "Nama Event" },
        { key: "slug", label: "Slug URL" },
        {
          key: "category",
          label: "Kategori",
          type: "select",
          options: ["Keagamaan", "Kepemudaan", "Olahraga", "Sosial", "Pendidikan", "Kebangsaan"],
        },
        { key: "status", label: "Status", type: "select", options: ["OPEN", "SOON", "ONGOING", "CLOSED"] },
        { key: "date", label: "Tanggal pelaksanaan" },
        { key: "location", label: "Lokasi" },
        { key: "mapQuery", label: "Koordinat / kata kunci maps" },
        { key: "quota", label: "Kuota", type: "number" },
        { key: "registered", label: "Jumlah pendaftar", type: "number" },
        { key: "fee", label: "Biaya (Rp, 0 = gratis)", type: "number" },
        { key: "image", label: "Gambar / Poster Event", type: "image", required: false },
        { key: "openDate", label: "Pendaftaran dibuka" },
        { key: "closeDate", label: "Pendaftaran ditutup" },
        { key: "committee", label: "Panitia ditugaskan", required: false },
        { key: "description", label: "Deskripsi & rundown singkat", type: "textarea" },
      ]}
    />
  );
}