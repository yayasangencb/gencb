import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RequireModule } from "@/components/admin/guard";
import {
  MEDIA_FOLDERS,
  deleteMedia,
  formatBytes,
  listMedia,
  uploadMedia,
  type MediaAsset,
} from "@/lib/cloud/media";

export const Route = createFileRoute("/admin/media")({
  head: () => ({
    meta: [
      { title: "Media Library — Admin GEN-CB" },
      { name: "description", content: "Kelola seluruh gambar dan berkas website GEN-CB dalam satu pustaka media." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Media Library — Admin GEN-CB" },
      { property: "og:description", content: "Unggah, cari, salin tautan, dan hapus berkas media website." },
    ],
  }),
  component: () => (
    <RequireModule module="media">
      <MediaLibraryPage />
    </RequireModule>
  ),
});

function MediaLibraryPage() {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState<string>("all");
  const [uploadFolder, setUploadFolder] = useState<string>("general");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [toDelete, setToDelete] = useState<MediaAsset | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await listMedia(folder));
    } catch (e) {
      toast.error("Gagal memuat media");
    } finally {
      setLoading(false);
    }
  }, [folder]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    let ok = 0;
    for (const file of Array.from(files)) {
      const { asset, error } = await uploadMedia(file, uploadFolder);
      if (error || !asset) toast.error(`${file.name}: ${error ?? "gagal diunggah"}`);
      else ok += 1;
    }
    setUploading(false);
    if (ok) toast.success(`${ok} berkas berhasil diunggah`);
    void load();
  };

  const filtered = items.filter((i) =>
    search.trim() ? i.file_name.toLowerCase().includes(search.trim().toLowerCase()) : true,
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Media Library</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Semua gambar website tersimpan permanen di penyimpanan cloud dan bisa dipakai ulang di
          modul mana pun.
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          dragging ? "border-primary bg-primary/10" : "border-muted-foreground/25 bg-card hover:bg-muted/40"
        }`}
      >
        {uploading ? (
          <Loader2 className="size-8 animate-spin text-primary" />
        ) : (
          <UploadCloud className="size-8 text-primary" />
        )}
        <p className="mt-3 text-sm font-semibold">
          {uploading ? "Mengunggah..." : "Seret & lepas berkas ke sini"}
        </p>
        <p className="text-xs text-muted-foreground">JPG, PNG, WEBP, GIF, SVG — maksimal 5 MB per berkas</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            void handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Cari nama berkas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-56"
        />
        <Select value={folder} onValueChange={setFolder}>
          <SelectTrigger className="h-9 w-44">
            <SelectValue placeholder="Semua folder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua folder</SelectItem>
            {MEDIA_FOLDERS.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span>Unggah ke folder</span>
          <Select value={uploadFolder} onValueChange={setUploadFolder}>
            <SelectTrigger className="h-9 w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEDIA_FOLDERS.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Memuat media...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          Belum ada media pada folder ini.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((asset) => (
            <div key={asset.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="aspect-square bg-muted/40">
                <img
                  src={asset.url}
                  alt={asset.file_name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-1 p-2">
                <p className="truncate text-xs font-medium" title={asset.file_name}>
                  {asset.file_name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {asset.folder} · {formatBytes(asset.size_bytes)}
                </p>
                <div className="flex gap-1 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 flex-1 text-[11px]"
                    onClick={() => {
                      void navigator.clipboard.writeText(asset.url);
                      toast.success("Tautan disalin");
                    }}
                  >
                    <Copy className="mr-1 size-3" /> Salin
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-7 text-destructive"
                    onClick={() => setToDelete(asset)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus berkas ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Berkas akan dihapus permanen dari penyimpanan. Konten yang masih memakai tautan ini
              akan kehilangan gambarnya.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!toDelete) return;
                try {
                  await deleteMedia(toDelete);
                  toast.success("Berkas dihapus");
                  void load();
                } catch {
                  toast.error("Gagal menghapus berkas");
                }
                setToDelete(null);
              }}
            >
              Ya, hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}