import { supabase } from "@/integrations/supabase/client";

export type HomeStat = { label: string; value: number; suffix: string };

export function statusToBadge(status: string): "OPEN" | "SOON" | "ONGOING" | "CLOSED" {
  if (status === "open") return "OPEN";
  if (status === "ongoing") return "ONGOING";
  if (status === "soon") return "SOON";
  return "CLOSED";
}

export async function fetchHomeContent() {
  const [programs, events, news, gallery, partners, donationPrograms, testimonials, registrations] =
    await Promise.all([
      supabase
        .from("programs")
        .select("id, title, category, description, target_text, cover_image")
        .eq("is_published", true)
        .order("created_at", { ascending: true })
        .limit(6),
      supabase
        .from("events")
        .select("id, slug, title, category, status, poster_url, location_text, event_date_start, quota, registered_count")
        .is("deleted_at", null)
        .not("status", "in", "(draft,cancelled)")
        .order("event_date_start", { ascending: true })
        .limit(8),
      supabase
        .from("news")
        .select("id, slug, title, category, excerpt, content, cover_image, published_at")
        .eq("status", "published")
        .is("deleted_at", null)
        .order("published_at", { ascending: false })
        .limit(3),
      supabase
        .from("gallery_media")
        .select("id, url, caption")
        .eq("media_type", "photo")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase.from("partners").select("id, name").eq("is_active", true).order("name"),
      supabase
        .from("donation_programs")
        .select("id, title, target_amount, collected_amount")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1),
      supabase
        .from("testimonials")
        .select("id, name, role_or_affiliation, message, rating")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(3),
      supabase.from("registrations").select("id", { count: "exact", head: true }).is("deleted_at", null),
    ]);

  const eventRows = events.data ?? [];
  const partnerRows = partners.data ?? [];
  const participantCount = registrations.count ?? 0;

  const stats: HomeStat[] = [
    { label: "Program Berjalan", value: (programs.data ?? []).length, suffix: "" },
    { label: "Kegiatan Terjadwal", value: eventRows.length, suffix: "" },
    { label: "Peserta Terdaftar", value: participantCount, suffix: "" },
    { label: "Mitra & Sponsor", value: partnerRows.length, suffix: "" },
  ];

  return {
    programs: programs.data ?? [],
    events: eventRows,
    news: (news.data ?? []).map((n) => ({
      ...n,
      excerpt: n.excerpt ?? (n.content ? `${n.content.replace(/<[^>]*>/g, "").slice(0, 140)}...` : ""),
    })),
    gallery: gallery.data ?? [],
    partners: partnerRows.map((p) => p.name),
    donationPrograms: donationPrograms.data ?? [],
    testimonials: testimonials.data ?? [],
    stats,
  };
}
export type PublicEvent = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  poster_url: string | null;
  location_text: string | null;
  event_date_start: string | null;
  quota: number;
  registered_count: number;
  price: number | null;
};

export async function fetchPublicEvents(): Promise<PublicEvent[]> {
  const { data } = await supabase
    .from("events")
    .select(
      "id, slug, title, category, status, poster_url, location_text, event_date_start, quota, registered_count, price",
    )
    .is("deleted_at", null)
    .not("status", "in", "(draft,cancelled)")
    .order("event_date_start", { ascending: true });
  return data ?? [];
}

export type PublicProgram = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  target_text: string | null;
  cover_image: string | null;
};

export async function fetchPublicPrograms(): Promise<PublicProgram[]> {
  const { data } = await supabase
    .from("programs")
    .select("id, title, category, description, target_text, cover_image")
    .eq("is_published", true)
    .order("created_at", { ascending: true });
  return data ?? [];
}
