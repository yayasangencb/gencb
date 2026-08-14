import { supabase } from "@/integrations/supabase/client";

export const MEDIA_BUCKET = "media";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export const MEDIA_FOLDERS = [
  "berita",
  "event",
  "program",
  "galeri",
  "banner",
  "mitra",
  "pengurus",
  "dokumen",
  "general",
] as const;

export type MediaFolder = (typeof MEDIA_FOLDERS)[number];

export type MediaAsset = {
  id: string;
  bucket: string;
  path: string;
  url: string;
  folder: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

export function publicMediaUrl(path: string) {
  return `/api/public/media/${path.split("/").map(encodeURIComponent).join("/")}`;
}

export function absoluteUrl(url: string | null | undefined, origin?: string) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url) || url.startsWith("data:")) return url;
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
}

function slugifyFileName(name: string) {
  const dot = name.lastIndexOf(".");
  const ext = dot > -1 ? name.slice(dot + 1).toLowerCase() : "bin";
  const base = (dot > -1 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return `${base || "file"}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}.${ext}`;
}

export function validateImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Format tidak didukung. Gunakan JPG, PNG, WEBP, GIF, atau SVG.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `Ukuran maksimal 5 MB (berkas Anda ${(file.size / 1024 / 1024).toFixed(1)} MB).`;
  }
  return null;
}

async function readDimensions(file: File): Promise<{ width: number | null; height: number | null }> {
  if (typeof window === "undefined" || file.type === "image/svg+xml") {
    return { width: null, height: null };
  }
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: null, height: null });
    };
    img.src = objectUrl;
  });
}

export async function uploadMedia(
  file: File,
  folder: string = "general",
): Promise<{ asset: MediaAsset | null; error: string | null }> {
  const invalid = validateImage(file);
  if (invalid) return { asset: null, error: invalid };

  const path = `${folder}/${slugifyFileName(file.name)}`;
  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: "31536000", contentType: file.type, upsert: false });
  if (uploadError) {
    return { asset: null, error: uploadError.message };
  }

  const dims = await readDimensions(file);
  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      bucket: MEDIA_BUCKET,
      path,
      url: publicMediaUrl(path),
      folder,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      width: dims.width,
      height: dims.height,
      uploaded_by: userData.user?.id ?? null,
    })
    .select("id, bucket, path, url, folder, file_name, mime_type, size_bytes, created_at")
    .single();

  if (error) return { asset: null, error: error.message };
  return { asset: data as MediaAsset, error: null };
}

export async function listMedia(folder?: string) {
  let query = supabase
    .from("media_assets")
    .select("id, bucket, path, url, folder, file_name, mime_type, size_bytes, created_at")
    .order("created_at", { ascending: false })
    .limit(300);
  if (folder && folder !== "all") query = query.eq("folder", folder);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as MediaAsset[];
}

export async function deleteMedia(asset: MediaAsset) {
  await supabase.storage.from(asset.bucket).remove([asset.path]);
  const { error } = await supabase.from("media_assets").delete().eq("id", asset.id);
  if (error) throw error;
}

export function formatBytes(bytes: number | null) {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}