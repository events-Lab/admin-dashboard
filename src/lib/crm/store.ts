"use client";

function canUseStorage() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("crm-store", { detail: { key } }));
}

export function createCollectionStore<T extends { id: string }>(
  key: string,
  seed: T[],
) {
  function list(): T[] {
    return readJson<T[]>(key, seed);
  }

  function get(id: string): T | undefined {
    return list().find((item) => item.id === id);
  }

  function saveAll(items: T[]) {
    writeJson(key, items);
  }

  function create(item: T): T {
    const items = list();
    saveAll([item, ...items]);
    return item;
  }

  function update(id: string, patch: Partial<T>): T | undefined {
    const items = list();
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return undefined;
    const next = { ...items[index], ...patch, id } as T;
    const copy = [...items];
    copy[index] = next;
    saveAll(copy);
    return next;
  }

  function remove(id: string): boolean {
    const items = list();
    const next = items.filter((item) => item.id !== id);
    if (next.length === items.length) return false;
    saveAll(next);
    return true;
  }

  function reset() {
    saveAll(seed);
  }

  return { key, list, get, create, update, remove, reset, saveAll };
}

export function nowLabel() {
  return new Date().toISOString().slice(0, 16).replace("T", " ");
}

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}
