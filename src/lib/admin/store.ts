import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const PREFIX = "gencb-admin:";
const cache = new Map<string, unknown>();
const listeners = new Set<() => void>();

export type Entity = { id: string };

function read<T>(key: string, seed: T[]): T[] {
  if (cache.has(key)) return cache.get(key) as T[];
  let value = seed;
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      if (raw) value = JSON.parse(raw) as T[];
    } catch {
      value = seed;
    }
  }
  cache.set(key, value);
  return value;
}

function write<T>(key: string, value: T[]) {
  cache.set(key, value);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }
  listeners.forEach((l) => l());
}

export function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

// Asynchronously sync local updates with Supabase Database in background
async function syncToSupabase(key: string, action: "insert" | "update" | "delete", payload: Record<string, unknown>) {
  try {
    if (key === "news") {
      const isDraft = payload.status === "DRAFT";
      if (action === "insert") {
        const { error } = await supabase.from("news").insert({
          id: String(payload.id),
          title: String(payload.title ?? ""),
          slug: String(payload.slug ?? `berita-${Date.now()}`),
          category: String(payload.category ?? "Pengumuman"),
          content: String(payload.content ?? ""),
          cover_image: String(payload.image ?? payload.cover_image ?? ""),
          status: isDraft ? "draft" : "published",
          published_at: isDraft ? null : new Date().toISOString(),
          seo_title: String(payload.seoTitle ?? payload.title ?? ""),
          seo_description: String(payload.seoDescription ?? payload.content ?? ""),
        } as never);
        if (error) console.warn("[Supabase Sync] news insert:", error.message);
      } else if (action === "update") {
        const { error } = await supabase.from("news").update({
          title: payload.title !== undefined ? String(payload.title) : undefined,
          category: payload.category !== undefined ? String(payload.category) : undefined,
          content: payload.content !== undefined ? String(payload.content) : undefined,
          cover_image: payload.image !== undefined ? String(payload.image) : undefined,
          status: payload.status !== undefined ? (payload.status === "DRAFT" ? "draft" : "published") : undefined,
        } as never).eq("id", String(payload.id));
        if (error) console.warn("[Supabase Sync] news update:", error.message);
      } else if (action === "delete") {
        const { error } = await supabase.from("news").delete().eq("id", String(payload.id));
        if (error) console.warn("[Supabase Sync] news delete:", error.message);
      }
    } else if (key === "events") {
      if (action === "insert") {
        const { error } = await supabase.from("events").insert({
          id: String(payload.id),
          title: String(payload.title ?? ""),
          slug: String(payload.slug ?? `event-${Date.now()}`),
          category: String(payload.category ?? "Umum"),
          status: payload.status ? String(payload.status).toLowerCase() : "open",
          quota: Number(payload.quota ?? 100),
          registered_count: Number(payload.registered ?? 0),
          price: Number(payload.fee ?? 0),
          description: String(payload.description ?? ""),
          location_text: String(payload.location ?? ""),
          poster_url: String(payload.image ?? ""),
        } as never);
        if (error) console.warn("[Supabase Sync] events insert:", error.message);
      } else if (action === "update") {
        const { error } = await supabase.from("events").update({
          title: payload.title !== undefined ? String(payload.title) : undefined,
          status: payload.status !== undefined ? String(payload.status).toLowerCase() : undefined,
          quota: payload.quota !== undefined ? Number(payload.quota) : undefined,
          registered_count: payload.registered !== undefined ? Number(payload.registered) : undefined,
          price: payload.fee !== undefined ? Number(payload.fee) : undefined,
          poster_url: payload.image !== undefined ? String(payload.image) : undefined,
          location_text: payload.location !== undefined ? String(payload.location) : undefined,
        } as never).eq("id", String(payload.id));
        if (error) console.warn("[Supabase Sync] events update:", error.message);
      } else if (action === "delete") {
        const { error } = await supabase.from("events").delete().eq("id", String(payload.id));
        if (error) console.warn("[Supabase Sync] events delete:", error.message);
      }
    } else if (key === "programs") {
      if (action === "insert") {
        const { error } = await supabase.from("programs").insert({
          id: String(payload.id),
          title: String(payload.title ?? ""),
          category: String(payload.category ?? "Pendidikan"),
          description: String(payload.description ?? ""),
          target_text: String(payload.target ?? ""),
          cover_image: String(payload.image ?? ""),
          is_published: payload.status !== "ARSIP",
        } as never);
        if (error) console.warn("[Supabase Sync] programs insert:", error.message);
      } else if (action === "update") {
        const { error } = await supabase.from("programs").update({
          title: payload.title !== undefined ? String(payload.title) : undefined,
          category: payload.category !== undefined ? String(payload.category) : undefined,
          description: payload.description !== undefined ? String(payload.description) : undefined,
          target_text: payload.target !== undefined ? String(payload.target) : undefined,
          cover_image: payload.image !== undefined ? String(payload.image) : undefined,
          is_published: payload.status !== undefined ? payload.status !== "ARSIP" : undefined,
        } as never).eq("id", String(payload.id));
        if (error) console.warn("[Supabase Sync] programs update:", error.message);
      } else if (action === "delete") {
        const { error } = await supabase.from("programs").delete().eq("id", String(payload.id));
        if (error) console.warn("[Supabase Sync] programs delete:", error.message);
      }
    } else if (key === "gallery") {
      if (action === "insert") {
        const { error } = await supabase.from("gallery_media").insert({
          id: String(payload.id),
          album_id: "00000000-0000-0000-0000-000000000000",
          url: String(payload.url ?? payload.src ?? ""),
          caption: String(payload.caption ?? ""),
          media_type: payload.type === "VIDEO" ? "VIDEO" : "FOTO",
        } as never);
        if (error) console.warn("[Supabase Sync] gallery insert:", error.message);
      } else if (action === "update") {
        const { error } = await supabase.from("gallery_media").update({
          url: payload.url !== undefined ? String(payload.url) : undefined,
          caption: payload.caption !== undefined ? String(payload.caption) : undefined,
        } as never).eq("id", String(payload.id));
        if (error) console.warn("[Supabase Sync] gallery update:", error.message);
      } else if (action === "delete") {
        const { error } = await supabase.from("gallery_media").delete().eq("id", String(payload.id));
        if (error) console.warn("[Supabase Sync] gallery delete:", error.message);
      }
    } else if (key === "sponsor") {
      if (action === "insert") {
        const { error } = await supabase.from("partners").insert({
          id: String(payload.id),
          name: String(payload.name ?? ""),
          is_active: payload.status !== "NONAKTIF",
        } as never);
        if (error) console.warn("[Supabase Sync] partners insert:", error.message);
      } else if (action === "update") {
        const { error } = await supabase.from("partners").update({
          name: payload.name !== undefined ? String(payload.name) : undefined,
          is_active: payload.status !== undefined ? payload.status !== "NONAKTIF" : undefined,
        } as never).eq("id", String(payload.id));
        if (error) console.warn("[Supabase Sync] partners update:", error.message);
      }
    } else if (key === "donation-programs") {
      if (action === "insert") {
        const { error } = await supabase.from("donation_programs").insert({
          id: String(payload.id),
          title: String(payload.title ?? ""),
          target_amount: Number(payload.target ?? 0),
          collected_amount: Number(payload.collected ?? 0),
          is_active: payload.status === "AKTIF",
        } as never);
        if (error) console.warn("[Supabase Sync] donation_programs insert:", error.message);
      } else if (action === "update") {
        const { error } = await supabase.from("donation_programs").update({
          title: payload.title !== undefined ? String(payload.title) : undefined,
          target_amount: payload.target !== undefined ? Number(payload.target) : undefined,
          collected_amount: payload.collected !== undefined ? Number(payload.collected) : undefined,
          is_active: payload.status !== undefined ? payload.status === "AKTIF" : undefined,
        } as never).eq("id", String(payload.id));
        if (error) console.warn("[Supabase Sync] donation_programs update:", error.message);
      }
    } else if (key === "notifications") {
      if (action === "insert" || action === "update") {
        const { error } = await supabase.from("notifications_log").insert({
          title: String(payload.title ?? "Broadcast"),
          message: String(payload.message ?? ""),
          channel: ((payload.channel as string)?.toLowerCase() as "email" | "whatsapp" | "push") ?? "email",
          status: String(payload.status ?? "DRAFT"),
        } as never);
        if (error) console.warn("[Supabase Sync] notifications_log insert:", error.message);
      }
    }
  } catch (err) {
    console.warn(`[Supabase Sync] ${key} ${action} error:`, err);
  }
}

export function useCollection<T extends Entity>(key: string, seed: T[]) {
  const [items, setItems] = useState<T[]>(() => read<T>(key, seed));

  useEffect(() => {
    let isMounted = true;
    const syncLocal = () => {
      if (isMounted) setItems([...read<T>(key, seed)]);
    };
    syncLocal();
    listeners.add(syncLocal);

    // Fetch initial data from Supabase asynchronously if table exists
    const fetchSupabase = async () => {
      try {
        if (key === "news") {
          const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false });
          if (!error && data && data.length && isMounted) {
            const mapped: T[] = data.map((n) => ({
              id: n.id,
              title: n.title,
              category: n.category,
              author: "Nabila Rahmawati",
              date: n.published_at ? n.published_at.slice(0, 10) : n.created_at.slice(0, 10),
              status: n.status === "draft" ? "DRAFT" : "PUBLISH",
              tags: (n.tags ?? []).join(", "),
              seoTitle: n.seo_title ?? n.title,
              seoDescription: n.seo_description ?? "",
              content: n.content ?? "",
              image: n.cover_image ?? "prog-keagamaan",
            })) as unknown as T[];
            write(key, mapped);
          }
        } else if (key === "events") {
          const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false });
          if (!error && data && data.length && isMounted) {
            const mapped: T[] = data.map((e) => ({
              id: e.id,
              title: e.title,
              slug: e.slug,
              category: e.category,
              status: e.status?.toUpperCase() as string,
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
            })) as unknown as T[];
            write(key, mapped);
          }
        } else if (key === "programs") {
          const { data, error } = await supabase.from("programs").select("*").order("created_at", { ascending: false });
          if (!error && data && data.length && isMounted) {
            const mapped: T[] = data.map((p) => ({
              id: p.id,
              title: p.title,
              category: p.category,
              target: p.target_text ?? "Masyarakat Umum",
              description: p.description ?? "",
              status: p.is_published ? "AKTIF" : "ARSIP",
              image: p.cover_image ?? "",
            })) as unknown as T[];
            write(key, mapped);
          }
        } else if (key === "gallery") {
          const { data, error } = await supabase.from("gallery_media").select("*").order("created_at", { ascending: false });
          if (!error && data && data.length && isMounted) {
            const mapped: T[] = data.map((g) => ({
              id: g.id,
              caption: g.caption ?? "Dokumentasi GEN-CB",
              album: "Galeri Utama",
              type: g.media_type === "VIDEO" ? "VIDEO" : "FOTO",
              date: g.created_at ? g.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
              url: g.url ?? "",
            })) as unknown as T[];
            write(key, mapped);
          }
        } else if (key === "donation-programs") {
          const { data, error } = await supabase.from("donation_programs").select("*").order("created_at", { ascending: false });
          if (!error && data && data.length && isMounted) {
            const mapped: T[] = data.map((d) => ({
              id: d.id,
              title: d.title,
              target: d.target_amount,
              collected: d.collected_amount,
              deadline: "2026-12-31",
              status: d.is_active ? "AKTIF" : "SELESAI",
            })) as unknown as T[];
            write(key, mapped);
          }
        }
      } catch {
        // Fallback to local cache / seed if table fetch fails
      }
    };

    void fetchSupabase();

    return () => {
      isMounted = false;
      listeners.delete(syncLocal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const create = useCallback(
    (item: Omit<T, "id">) => {
      const entry = { ...item, id: newId() } as unknown as T;
      const next = [entry, ...read<T>(key, seed)];
      write(key, next);
      void syncToSupabase(key, "insert", entry as unknown as Record<string, unknown>);
      return entry;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  const update = useCallback(
    (id: string, patch: Partial<T>) => {
      const current = read<T>(key, seed);
      const updated = current.map((i) => (i.id === id ? { ...i, ...patch } : i));
      write(key, updated);
      const target = updated.find((i) => i.id === id);
      if (target) {
        void syncToSupabase(key, "update", target as unknown as Record<string, unknown>);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  const remove = useCallback(
    (id: string) => {
      const current = read<T>(key, seed);
      const found = current.find((i) => i.id === id);
      write(
        key,
        current.filter((i) => i.id !== id),
      );
      if (found) {
        void syncToSupabase(key, "delete", found as unknown as Record<string, unknown>);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  const duplicate = useCallback(
    (id: string) => {
      const all = read<T>(key, seed);
      const found = all.find((i) => i.id === id);
      if (!found) return;
      const dup = { ...found, id: newId(), title: `${(found as Record<string, unknown>).title ?? ""} (Salinan)` } as T;
      write(key, [dup, ...all]);
      void syncToSupabase(key, "insert", dup as unknown as Record<string, unknown>);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  return { items, create, update, remove, duplicate };
}