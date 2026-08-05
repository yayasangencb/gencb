import { supabase } from "@/integrations/supabase/client";

export type NewsRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  content: string | null;
  cover_image: string | null;
  published_at: string | null;
  created_at: string;
  tags: string[];
  video_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

export const NEWS_CATEGORIES = [
  "Pendidikan",
  "Sosial",
  "Olahraga",
  "Keagamaan",
  "Pengumuman",
  "Prestasi",
];

export async function fetchNewsList() {
  const { data } = await supabase
    .from("news")
    .select(
      "id, slug, title, category, content, cover_image, published_at, created_at, tags, video_url, seo_title, seo_description",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });
  return (data ?? []) as NewsRow[];
}

export async function fetchNewsBySlug(slug: string) {
  const { data } = await supabase
    .from("news")
    .select(
      "id, slug, title, category, content, cover_image, published_at, created_at, tags, video_url, seo_title, seo_description",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return (data as NewsRow | null) ?? null;
}

export async function fetchApprovedComments(newsId: string) {
  const { data } = await supabase
    .from("news_comments")
    .select("id, name, comment_text, created_at")
    .eq("news_id", newsId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function submitComment(input: { newsId: string; name: string; text: string }) {
  const { error } = await supabase.from("news_comments").insert({
    news_id: input.newsId,
    name: input.name,
    comment_text: input.text,
    is_approved: false,
  });
  return !error;
}

export type AlbumRow = { id: string; title: string; description: string | null };
export type MediaRow = {
  id: string;
  album_id: string;
  url: string;
  caption: string | null;
  media_type: string;
};

export async function fetchAlbums() {
  const { data } = await supabase
    .from("gallery_albums")
    .select("id, title, description")
    .order("created_at", { ascending: false });
  return (data ?? []) as AlbumRow[];
}

export async function fetchMediaPage(opts: { albumId?: string; from: number; to: number }) {
  let q = supabase
    .from("gallery_media")
    .select("id, album_id, url, caption, media_type")
    .order("created_at", { ascending: false })
    .range(opts.from, opts.to);
  if (opts.albumId) q = q.eq("album_id", opts.albumId);
  const { data } = await q;
  return (data ?? []) as MediaRow[];
}

export type DonationProgramRow = {
  id: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  target_amount: number;
  collected_amount: number;
};

export async function fetchDonationPrograms() {
  const { data } = await supabase
    .from("donation_programs")
    .select("id, title, description, cover_image, target_amount, collected_amount")
    .eq("is_active", true)
    .order("created_at", { ascending: true });
  return (data ?? []) as DonationProgramRow[];
}

export async function fetchVerifiedDonations(programId?: string) {
  let q = supabase
    .from("donations")
    .select("id, donor_name, amount, is_anonymous, created_at, donation_program_id")
    .eq("is_verified", true)
    .order("created_at", { ascending: false })
    .limit(20);
  if (programId) q = q.eq("donation_program_id", programId);
  const { data } = await q;
  return data ?? [];
}

export async function submitDonation(input: {
  programId: string;
  donorName: string;
  amount: number;
  method: "transfer" | "qris";
  isAnonymous: boolean;
  proofUrl: string | null;
}) {
  const { error } = await supabase.from("donations").insert({
    donation_program_id: input.programId,
    donor_name: input.isAnonymous ? null : input.donorName,
    amount: input.amount,
    method: input.method,
    is_anonymous: input.isAnonymous,
    proof_url: input.proofUrl,
    is_verified: false,
  });
  return !error;
}

export type SearchResult = {
  type: "Program" | "Berita" | "Event" | "Galeri";
  title: string;
  subtitle: string;
  href: string;
};

export async function globalSearch(term: string): Promise<SearchResult[]> {
  const q = term.trim();
  if (q.length < 2) return [];
  const like = `%${q}%`;
  const [programs, news, events, albums] = await Promise.all([
    supabase.from("programs").select("id, title, category").ilike("title", like).limit(5),
    supabase
      .from("news")
      .select("slug, title, category")
      .eq("status", "published")
      .ilike("title", like)
      .limit(5),
    supabase.from("events").select("slug, title, category").ilike("title", like).limit(5),
    supabase.from("gallery_albums").select("id, title").ilike("title", like).limit(5),
  ]);

  const results: SearchResult[] = [];
  for (const p of programs.data ?? [])
    results.push({
      type: "Program",
      title: p.title,
      subtitle: String(p.category ?? "Program"),
      href: "/program",
    });
  for (const n of news.data ?? [])
    results.push({
      type: "Berita",
      title: n.title,
      subtitle: String(n.category ?? "Berita"),
      href: `/berita/${n.slug}`,
    });
  for (const e of events.data ?? [])
    results.push({
      type: "Event",
      title: e.title,
      subtitle: String(e.category ?? "Kegiatan"),
      href: `/event/${e.slug}`,
    });
  for (const a of albums.data ?? [])
    results.push({ type: "Galeri", title: a.title, subtitle: "Album dokumentasi", href: "/galeri" });
  return results;
}

export function formatRupiah(n: number) {
  return `Rp ${Math.round(n).toLocaleString("id-ID")}`;
}

export function formatDateId(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}