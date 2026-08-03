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
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  }
  listeners.forEach((l) => l());
}

export function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export function useCollection<T extends Entity>(key: string, seed: T[]) {
  const [items, setItems] = useState<T[]>(seed);

  useEffect(() => {
    const sync = () => setItems([...read<T>(key, seed)]);
    sync();
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const create = useCallback(
    (item: Omit<T, "id">) => {
      const entry = { ...item, id: newId() } as unknown as T;
      write(key, [entry, ...read<T>(key, seed)]);
      return entry;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  const update = useCallback(
    (id: string, patch: Partial<T>) => {
      write(
        key,
        read<T>(key, seed).map((i) => (i.id === id ? { ...i, ...patch } : i)),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  const remove = useCallback(
    (id: string) => {
      write(
        key,
        read<T>(key, seed).filter((i) => i.id !== id),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  const duplicate = useCallback(
    (id: string) => {
      const all = read<T>(key, seed);
      const found = all.find((i) => i.id === id);
      if (!found) return;
      write(key, [{ ...found, id: newId() } as T, ...all]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  return { items, create, update, remove, duplicate };
}