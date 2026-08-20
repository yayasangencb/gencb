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
    if (key === "programs") {
      if (action === "insert" || action === "update") {
        const { error } = await supabase.from("programs").upsert({
          id: String(payload.id),
          title: String(payload.title ?? ""),
          category: String(payload.category ?? "Keagamaan"),
          description: String(payload.description ?? ""),
          target_text: String(payload.target ?? ""),
          cover_image: String(payload.image ?? payload.cover_image ?? ""),
          is_published: payload.status !== "ARSIP",
        } as never, { onConflict: "id" });
        if (error) console.warn("[Supabase Sync] programs upsert notice:", error.message);
      } else if (action === "delete") {
        await supabase.from("programs").delete().eq("id", String(payload.id));
      }
    } else if (key === "events") {
      if (action === "insert" || action === "update") {
        const { error } = await supabase.from("events").upsert({
          id: String(payload.id),
          title: String(payload.title ?? ""),
          slug: String(payload.slug ?? `event-${payload.id}`),
          category: String(payload.category ?? "Umum"),
          status: payload.status ? String(payload.status).toLowerCase() : "open",
          quota: Number(payload.quota ?? 100),
          registered_count: Number(payload.registered ?? 0),
          price: Number(payload.fee ?? 0),
          description: String(payload.description ?? ""),
          location_text: String(payload.location ?? ""),
          poster_url: String(payload.image ?? payload.poster_url ?? ""),
        } as never, { onConflict: "id" });
        if (error) console.warn("[Supabase Sync] events upsert notice:", error.message);
      } else if (action === "delete") {
        await supabase.from("events").delete().eq("id", String(payload.id));
      }
    } else if (key === "news") {
      if (action === "insert" || action === "update") {
        const { error } = await supabase.from("news").upsert({
          id: String(payload.id),
          title: String(payload.title ?? ""),
          slug: String(payload.slug ?? `berita-${payload.id}`),
          category: String(payload.category ?? "Pengumuman"),
          content: String(payload.content ?? ""),
          cover_image: String(payload.image ?? payload.cover_image ?? ""),
          status: payload.status === "DRAFT" ? "draft" : "published",
          seo_title: String(payload.seoTitle ?? payload.title ?? ""),
          seo_description: String(payload.seoDescription ?? payload.content ?? ""),
        } as never, { onConflict: "id" });
        if (error) console.warn("[Supabase Sync] news upsert notice:", error.message);
      } else if (action === "delete") {
        await supabase.from("news").delete().eq("id", String(payload.id));
      }
    } else if (key === "donation-programs") {
      if (action === "insert" || action === "update") {
        const { error } = await supabase.from("donation_programs").upsert({
          id: String(payload.id),
          title: String(payload.title ?? ""),
          target_amount: Number(payload.target ?? 0),
          collected_amount: Number(payload.collected ?? 0),
          is_active: payload.status === "AKTIF",
        } as never, { onConflict: "id" });
        if (error) console.warn("[Supabase Sync] donation_programs upsert notice:", error.message);
      }
    } else if (key === "gallery") {
      if (action === "insert" || action === "update") {
        const { error } = await supabase.from("gallery_media").upsert({
          id: String(payload.id),
          album_id: "00000000-0000-0000-0000-000000000000",
          url: String(payload.url ?? payload.image ?? payload.src ?? ""),
          caption: String(payload.caption ?? payload.title ?? ""),
          media_type: payload.type === "VIDEO" ? "VIDEO" : "FOTO",
        } as never, { onConflict: "id" });
        if (error) console.warn("[Supabase Sync] gallery_media upsert notice:", error.message);
      } else if (action === "delete") {
        await supabase.from("gallery_media").delete().eq("id", String(payload.id));
      }
    } else if (key === "sponsor") {
      if (action === "insert" || action === "update") {
        const { error } = await supabase.from("partners").upsert({
          id: String(payload.id),
          name: String(payload.name ?? ""),
          logo_url: String(payload.logo ?? payload.image ?? ""),
          is_active: payload.status !== "NONAKTIF",
        } as never, { onConflict: "id" });
        if (error) console.warn("[Supabase Sync] partners upsert notice:", error.message);
      }
    }
  } catch (err) {
    console.warn(`[Supabase Sync] ${key} ${action} notice:`, err);
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
      const dup = { ...found, id: newId(), title: `${(found as Record<string, unknown>)["title"] ?? ""} (Salinan)` } as T;
      write(key, [dup, ...all]);
      void syncToSupabase(key, "insert", dup as unknown as Record<string, unknown>);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  return { items, create, update, remove, duplicate };
}