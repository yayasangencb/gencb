import { useCallback, useEffect, useState } from "react";

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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  return { items, create, update, remove, duplicate };
}