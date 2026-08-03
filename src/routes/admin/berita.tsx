import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RequireModule } from "@/components/admin/guard";
import { ResourceManager } from "@/components/admin/resource-manager";
import { DataTable } from "@/components/admin/data-table";
import { useCollection } from "@/lib/admin/store";
import {
  newsCategories,
  seedComments,
  seedNews,
  type CommentRow,
  type NewsRow,
} from "@/lib/admin/seed";

export const Route = createFileRoute("/admin/berita")({
  head: () => ({
    meta: [
      { title: "Kelola Berita — Admin GEN-CB" },
      { name: "description", content: "CRUD artikel berita, meta SEO, dan moderasi komentar GEN-CB." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Kelola Berita — Admin GEN-CB" },
      { property: "og:description", content: "Kelola artikel berita dan komentar pembaca." },
    ],
  }),
  component: () => (
    <RequireModule module="berita">
      <BeritaAdmin />
    </RequireModule>
  ),
});

function BeritaAdmin() {
  const comments = useCollection<CommentRow>("comments", seedComments);

  return (
    <div className="space-y-10">
      <ResourceManager<NewsRow>
        title="Kelola Berita"
        description="Tulis, publikasikan, duplikat, dan atur meta SEO artikel berita."
        storageKey="news"
        seed={seedNews}
        allowDuplicate
        exportable
        addLabel="Tambah Berita"
        searchKeys={["title", "category", "author"]}
        filters={[
          { key: "category", label: "Kategori", options: newsCategories },
          { key: "status", label: "Status", options: ["DRAFT", "PUBLISH"] },
        ]}
        columns={[
          { key: "title", label: "Judul" },
          { key: "category", label: "Kategori" },
          {
            key: "status",
            label: "Status",
            render: (r) => (
              <Badge variant={r.status === "PUBLISH" ? "default" : "secondary"}>{r.status}</Badge>
            ),
          },
          { key: "date", label: "Tanggal" },
          { key: "author", label: "Penulis" },
        ]}
        fields={[
          { key: "title", label: "Judul" },
          { key: "category", label: "Kategori", type: "select", options: newsCategories },
          { key: "author", label: "Penulis" },
          { key: "date", label: "Tanggal", type: "date" },
          { key: "status", label: "Status", type: "select", options: ["DRAFT", "PUBLISH"] },
          { key: "image", label: "Nama file foto/video", placeholder: "contoh: prog-pendidikan" },
          { key: "tags", label: "Tag (pisahkan koma)", required: false },
          { key: "seoTitle", label: "Judul SEO", required: false },
          { key: "seoDescription", label: "Deskripsi SEO", required: false },
          { key: "content", label: "Konten artikel", type: "textarea" },
        ]}
      />

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-bold">Moderasi Komentar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Setujui, tandai spam, atau hapus komentar pembaca pada artikel berita.
          </p>
        </div>
        <DataTable
          rows={comments.items}
          searchKeys={["news", "name", "message"]}
          filters={[{ key: "status", label: "Status", options: ["PENDING", "APPROVED", "SPAM"] }]}
          columns={[
            { key: "name", label: "Nama" },
            { key: "news", label: "Artikel" },
            { key: "message", label: "Komentar" },
            { key: "date", label: "Tanggal" },
            {
              key: "status",
              label: "Status",
              render: (r) => (
                <Badge
                  variant={
                    r.status === "APPROVED" ? "default" : r.status === "PENDING" ? "secondary" : "destructive"
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
                  comments.update(row.id, { status: "APPROVED" });
                  toast.success("Komentar disetujui");
                }}
              >
                Setujui
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  comments.update(row.id, { status: "SPAM" });
                  toast.success("Ditandai sebagai spam");
                }}
              >
                Spam
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-destructive"
                onClick={() => {
                  comments.remove(row.id);
                  toast.success("Komentar dihapus");
                }}
              >
                Hapus
              </Button>
            </>
          )}
        />
      </section>
    </div>
  );
}