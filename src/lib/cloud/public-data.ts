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
  const local = getLocalStore<any>("news");
  try {
    const { data, error } = await supabase
      .from("news")
      .select(
        "id, slug, title, category, content, cover_image, published_at, created_at, tags, video_url, seo_title, seo_description",
      )
      .order("created_at", { ascending: false });

    if (!error && data && data.length) {
      const dbMapped = data as NewsRow[];
      if (local && local.length) {
        const localMap = new Map(local.map((item: any) => [item.id || item.title || item.slug, item]));
        const merged = dbMapped.map((dbItem) => {
          const loc = localMap.get(dbItem.id) || localMap.get(dbItem.title) || localMap.get(dbItem.slug);
          if (loc) {
            return {
              ...dbItem,
              title: loc.title || dbItem.title,
              category: loc.category || dbItem.category,
              content: loc.content || dbItem.content,
              cover_image: loc.image || loc.cover_image || dbItem.cover_image,
            };
          }
          return dbItem;
        });
        return merged;
      }
      return dbMapped;
    }
  } catch {
    // fallback
  }

  if (local && local.length) {
    const published = local.filter((n) => n.status === "PUBLISH" || !n.status);
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

  return [];
}

export async function fetchNewsBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from("news")
      .select(
        "id, slug, title, category, content, cover_image, published_at, created_at, tags, video_url, seo_title, seo_description",
      )
      .eq("slug", slug)
      .maybeSingle();
    if (!error && data) {
      const local = getLocalStore<any>("news");
      if (local && local.length) {
        const loc = local.find((i: any) => i.id === data.id || i.slug === slug || i.title === data.title);
        if (loc) {
          return {
            ...data,
            cover_image: loc.image || loc.cover_image || data.cover_image,
          } as NewsRow;
        }
      }
      return data as NewsRow;
    }
  } catch {
    // fallback
  }

  const newsList = await fetchNewsList();
  const found = newsList.find((n) => n.slug === slug);
  if (found) return found;

  return null;
}

export async function fetchPublicPrograms() {
  const local = getLocalStore<any>("programs");
  try {
    const { data, error } = await supabase
      .from("programs")
      .select("id, title, category, description, target_text, cover_image, is_published")
      .order("created_at", { ascending: false });

    if (!error && data && data.length) {
      const dbMapped = data.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        target: p.target_text ?? "Masyarakat Umum",
        description: p.description ?? "",
        status: p.is_published ? "AKTIF" : "ARSIP",
        image: p.cover_image ?? "",
      }));

      if (local && local.length) {
        const localMap = new Map(local.map((item: any) => [item.id || item.title || item.slug, item]));
        const merged = dbMapped.map((dbItem) => {
          const loc = localMap.get(dbItem.id) || localMap.get(dbItem.title) || localMap.get(dbItem.slug);
          if (loc) {
            return {
              ...dbItem,
              title: loc.title || dbItem.title,
              category: loc.category || dbItem.category,
              target: loc.target || dbItem.target,
              description: loc.description || dbItem.description,
              image: loc.image || loc.cover_image || dbItem.image,
              status: loc.status || dbItem.status,
            };
          }
          return dbItem;
        });

        // Add any locally added programs not in DB
        const dbIds = new Set(dbMapped.map((i) => i.id));
        const extraLocal = local.filter((i: any) => i.id && !dbIds.has(i.id));
        return [...merged, ...extraLocal];
      }

      return dbMapped;
    }
  } catch {
    // fallback
  }

  if (local && local.length) return local;

  return [];
}

export async function fetchPublicEvents() {
  const local = getLocalStore<any>("events");
  try {
    const { data, error } = await supabase
      .from("events")
      .select("id, title, slug, category, status, quota, registered_count, price, description, location_text, poster_url, event_date_start, registration_start, registration_end")
      .order("created_at", { ascending: false });

    if (!error && data && data.length) {
      const dbMapped = data.map((e) => ({
        id: e.id,
        title: e.title,
        slug: e.slug,
        category: e.category,
        status: (e.status?.toUpperCase() as string) || "OPEN",
        date: e.event_date_start ? new Date(e.event_date_start).toLocaleDateString("id-ID") : "12 September 2026",
        location: e.location_text ?? "Sasak Panjang",
        mapQuery: e.location_text ?? "Sasak Panjang",
        quota: e.quota ?? 100,
        registered: e.registered_count ?? 0,
        fee: e.price ?? 0,
        openDate: e.registration_start ?? "-",
        closeDate: e.registration_end ?? "-",
        committee: "Ahmad Fauzan, Nabila Rahmawati",
        description: e.description ?? "",
        image: e.poster_url ?? "",
      }));

      if (local && local.length) {
        const localMap = new Map(local.map((item: any) => [item.id || item.title || item.slug, item]));
        const merged = dbMapped.map((dbItem) => {
          const loc = localMap.get(dbItem.id) || localMap.get(dbItem.title) || localMap.get(dbItem.slug);
          if (loc) {
            return {
              ...dbItem,
              title: loc.title || dbItem.title,
              category: loc.category || dbItem.category,
              image: loc.image || loc.poster_url || dbItem.image,
              status: loc.status || dbItem.status,
            };
          }
          return dbItem;
        });
        return merged;
      }

      return dbMapped;
    }
  } catch {
    // fallback
  }

  if (local && local.length) return local;

  return [];
}

export async function fetchPublicSponsors() {
  const local = getLocalStore<any>("sponsor");
  try {
    const { data, error } = await supabase
      .from("partners")
      .select("id, name, logo_url, is_active")
      .order("created_at", { ascending: false });

    if (!error && data && data.length) {
      const dbMapped = data.map((s) => ({
        id: s.id,
        name: s.name,
        category: "Mitra Strategis",
        contactPerson: "-",
        status: s.is_active ? "AKTIF" : "NONAKTIF",
        logo: s.logo_url ?? "",
      }));

      if (local && local.length) {
        const localMap = new Map(local.map((item: any) => [item.id || item.name, item]));
        return dbMapped.map((dbItem) => {
          const loc = localMap.get(dbItem.id) || localMap.get(dbItem.name);
          return loc ? { ...dbItem, ...loc } : dbItem;
        });
      }

      return dbMapped;
    }
  } catch {
    // fallback
  }

  if (local && local.length) return local;

  return [];
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
  try {
    const { data, error } = await supabase
      .from("gallery_albums")
      .select("id, title, description")
      .order("created_at", { ascending: false });
    if (!error && data && data.length) return data as AlbumRow[];
  } catch {
    // fallback
  }

  const localGallery = getLocalStore<any>("gallery");
  if (localGallery && localGallery.length) {
    const albumsSet = [...new Set(localGallery.map((g) => g.album || "Umum"))];
    return albumsSet.map((title, idx) => ({
      id: `alb-${idx}`,
      title,
      description: `Album kegiatan ${title}`,
    })) as AlbumRow[];
  }

  return [];
}

export async function fetchMediaPage(opts: { albumId?: string; from: number; to: number }) {
  const local = getLocalStore<any>("gallery");
  try {
    let q = supabase
      .from("gallery_media")
      .select("id, album_id, url, caption, media_type")
      .order("created_at", { ascending: false })
      .range(opts.from, opts.to);
    if (opts.albumId) q = q.eq("album_id", opts.albumId);
    const { data, error } = await q;
    if (!error && data && data.length) {
      const dbMapped = data as MediaRow[];
      if (local && local.length) {
        const localMap = new Map(local.map((item: any) => [item.id || item.url, item]));
        return dbMapped.map((dbItem) => {
          const loc = localMap.get(dbItem.id) || localMap.get(dbItem.url);
          return loc ? { ...dbItem, url: loc.url || loc.image || dbItem.url } : dbItem;
        });
      }
      return dbMapped;
    }
  } catch {
    // fallback
  }

  if (local && local.length) {
    return local.slice(opts.from, opts.to + 1).map((g, idx) => ({
      id: g.id || `m-${idx}`,
      album_id: opts.albumId || "alb-0",
      url: g.url || g.src || g.image || "",
      caption: g.caption || "Dokumentasi GEN-CB",
      media_type: g.type === "VIDEO" ? "VIDEO" : "FOTO",
    })) as MediaRow[];
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
  const local = getLocalStore<any>("donation-programs");
  try {
    const { data, error } = await supabase
      .from("donation_programs")
      .select("id, title, description, cover_image, target_amount, collected_amount")
      .order("created_at", { ascending: true });
    if (!error && data && data.length) {
      const dbMapped = data as DonationProgramRow[];
      if (local && local.length) {
        const localMap = new Map(local.map((item: any) => [item.id || item.title, item]));
        return dbMapped.map((dbItem) => {
          const loc = localMap.get(dbItem.id) || localMap.get(dbItem.title);
          return loc ? { ...dbItem, target_amount: Number(loc.target || dbItem.target_amount), collected_amount: Number(loc.collected || dbItem.collected_amount) } : dbItem;
        });
      }
      return dbMapped;
    }
  } catch {
    // fallback
  }

  if (local && local.length) {
    const active = local.filter((d) => d.status === "AKTIF" || !d.status);
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

  return [];
}

export async function fetchVerifiedDonations(programId?: string) {
  try {
    let q = supabase
      .from("donations")
      .select("id, donor_name, amount, is_anonymous, created_at, donation_program_id")
      .eq("is_verified", true)
      .order("created_at", { ascending: false })
      .limit(20);
    if (programId) q = q.eq("donation_program_id", programId);
    const { data, error } = await q;
    if (!error && data && data.length) return data;
  } catch {
    // fallback
  }

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

  try {
    const like = `%${q}%`;
    const [programs, news, events, albums] = await Promise.all([
      supabase.from("programs").select("id, title, category").ilike("title", like).limit(5),
      supabase
        .from("news")
        .select("slug, title, category")
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
    if (results.length) return results;
  } catch {
    // fallback
  }

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