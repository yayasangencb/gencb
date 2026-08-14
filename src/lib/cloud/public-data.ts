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

function getLocalStore<T>(key: string): T[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`gencb-admin:${key}`);
    if (raw) return JSON.parse(raw) as T[];
  } catch {
    // ignore
  }
  return null;
}

export async function fetchNewsList() {
  // Check local admin updates first for instant real-time sync
  const localNews = getLocalStore<any>("news");
  if (localNews && localNews.length) {
    const published = localNews.filter((n) => n.status === "PUBLISH");
    if (published.length) {
      return published.map((n) => ({
        id: n.id,
        slug: n.slug || `berita-${n.id}`,
        title: n.title,
        category: n.category,
        content: n.content,
        cover_image: n.image || n.cover_image || "/assets/prog-keagamaan.jpg",
        published_at: n.date || new Date().toISOString(),
        created_at: n.date || new Date().toISOString(),
        tags: typeof n.tags === "string" ? n.tags.split(",").map((t: string) => t.trim()) : n.tags || [],
        video_url: null,
        seo_title: n.seoTitle || n.title,
        seo_description: n.seoDescription || n.content,
      })) as NewsRow[];
    }
  }

  try {
    const { data } = await supabase
      .from("news")
      .select(
        "id, slug, title, category, content, cover_image, published_at, created_at, tags, video_url, seo_title, seo_description",
      )
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false });
    if (data && data.length) return data as NewsRow[];
  } catch {
    // fallback
  }

  return [];
}

export async function fetchNewsBySlug(slug: string) {
  const newsList = await fetchNewsList();
  const found = newsList.find((n) => n.slug === slug);
  if (found) return found;

  try {
    const { data } = await supabase
      .from("news")
      .select(
        "id, slug, title, category, content, cover_image, published_at, created_at, tags, video_url, seo_title, seo_description",
      )
      .eq("slug", slug)
      .maybeSingle();
    if (data) return data as NewsRow;
  } catch {
    // fallback
  }
  return null;
}

export async function fetchApprovedComments(newsId: string) {
  try {
    const { data } = await supabase
      .from("news_comments")
      .select("id, name, comment_text, created_at")
      .eq("news_id", newsId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });
    if (data) return data;
  } catch {
    // fallback
  }
  return [];
}

export async function submitComment(input: { newsId: string; name: string; text: string }) {
  try {
    const { error } = await supabase.from("news_comments").insert({
      news_id: input.newsId,
      name: input.name,
      comment_text: input.text,
      is_approved: false,
    });
    return !error;
  } catch {
    return true;
  }
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
  const localGallery = getLocalStore<any>("gallery");
  if (localGallery && localGallery.length) {
    const albumsSet = [...new Set(localGallery.map((g) => g.album || "Umum"))];
    return albumsSet.map((title, idx) => ({
      id: `alb-${idx}`,
      title,
      description: `Album kegiatan ${title}`,
    })) as AlbumRow[];
  }

  try {
    const { data } = await supabase
      .from("gallery_albums")
      .select("id, title, description")
      .order("created_at", { ascending: false });
    if (data && data.length) return data as AlbumRow[];
  } catch {
    // fallback
  }
  return [];
}

export async function fetchMediaPage(opts: { albumId?: string; from: number; to: number }) {
  const localGallery = getLocalStore<any>("gallery");
  if (localGallery && localGallery.length) {
    return localGallery.slice(opts.from, opts.to + 1).map((g, idx) => ({
      id: g.id || `m-${idx}`,
      album_id: opts.albumId || "alb-0",
      url: g.url || g.src || "",
      caption: g.caption || "Dokumentasi GEN-CB",
      media_type: g.type === "VIDEO" ? "VIDEO" : "FOTO",
    })) as MediaRow[];
  }

  try {
    let q = supabase
      .from("gallery_media")
      .select("id, album_id, url, caption, media_type")
      .order("created_at", { ascending: false })
      .range(opts.from, opts.to);
    if (opts.albumId) q = q.eq("album_id", opts.albumId);
    const { data } = await q;
    if (data && data.length) return data as MediaRow[];
  } catch {
    // fallback
  }
  return [];
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
  const localDonations = getLocalStore<any>("donation-programs");
  if (localDonations && localDonations.length) {
    const active = localDonations.filter((d) => d.status === "AKTIF" || !d.status);
    if (active.length) {
      return active.map((d) => ({
        id: d.id,
        title: d.title,
        description: `Batas waktu: ${d.deadline || "2026-12-31"}`,
        cover_image: null,
        target_amount: Number(d.target || 0),
        collected_amount: Number(d.collected || 0),
      })) as DonationProgramRow[];
    }
  }

  try {
    const { data } = await supabase
      .from("donation_programs")
      .select("id, title, description, cover_image, target_amount, collected_amount")
      .eq("is_active", true)
      .order("created_at", { ascending: true });
    if (data && data.length) return data as DonationProgramRow[];
  } catch {
    // fallback
  }
  return [];
}

export async function fetchVerifiedDonations(programId?: string) {
  const localDonors = getLocalStore<any>("donors");
  if (localDonors && localDonors.length) {
    const verified = localDonors.filter((d) => d.status === "VERIFIED");
    if (verified.length) {
      return verified.map((d) => ({
        id: d.id,
        donor_name: d.anonymous ? null : d.name,
        amount: Number(d.amount || 0),
        is_anonymous: !!d.anonymous,
        created_at: d.date || new Date().toISOString(),
        donation_program_id: programId || "dp-1",
      }));
    }
  }

  try {
    let q = supabase
      .from("donations")
      .select("id, donor_name, amount, is_anonymous, created_at, donation_program_id")
      .eq("is_verified", true)
      .order("created_at", { ascending: false })
      .limit(20);
    if (programId) q = q.eq("donation_program_id", programId);
    const { data } = await q;
    if (data) return data;
  } catch {
    // fallback
  }
  return [];
}

export async function submitDonation(input: {
  programId: string;
  donorName: string;
  amount: number;
  method: "transfer" | "qris";
  isAnonymous: boolean;
  proofUrl: string | null;
}) {
  try {
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
  } catch {
    return true;
  }
}

export type SearchResult = {
  type: "Program" | "Berita" | "Event" | "Galeri";
  title: string;
  subtitle: string;
  href: string;
};

export async function globalSearch(term: string): Promise<SearchResult[]> {
  const q = term.trim().toLowerCase();
  if (q.length < 2) return [];

  const results: SearchResult[] = [];

  const localPrograms = getLocalStore<any>("programs");
  if (localPrograms) {
    for (const p of localPrograms) {
      if (p.title?.toLowerCase().includes(q)) {
        results.push({ type: "Program", title: p.title, subtitle: p.category || "Program", href: "/program" });
      }
    }
  }

  const localNews = getLocalStore<any>("news");
  if (localNews) {
    for (const n of localNews) {
      if (n.title?.toLowerCase().includes(q)) {
        results.push({ type: "Berita", title: n.title, subtitle: n.category || "Berita", href: `/berita/${n.slug || "berita"}` });
      }
    }
  }

  const localEvents = getLocalStore<any>("events");
  if (localEvents) {
    for (const e of localEvents) {
      if (e.title?.toLowerCase().includes(q)) {
        results.push({ type: "Event", title: e.title, subtitle: e.category || "Kegiatan", href: `/event/${e.slug || "event"}` });
      }
    }
  }

  if (results.length) return results;

  try {
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
  } catch {
    // fallback
  }

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