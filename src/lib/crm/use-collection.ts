"use client";

import { useCallback, useEffect, useState } from "react";

type Store<T extends { id: string }> = {
  key: string;
  list: () => T[];
  get: (id: string) => T | undefined;
  create: (item: T) => T;
  update: (id: string, patch: Partial<T>) => T | undefined;
  remove: (id: string) => boolean;
};

export function useCollection<T extends { id: string }>(store: Store<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setItems(store.list());
    setReady(true);
  }, [store]);

  useEffect(() => {
    refresh();
    function onStorage(event: StorageEvent) {
      if (event.key === store.key) refresh();
    }
    function onCrm(event: Event) {
      const detail = (event as CustomEvent<{ key: string }>).detail;
      if (detail?.key === store.key) refresh();
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener("crm-store", onCrm as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("crm-store", onCrm as EventListener);
    };
  }, [refresh, store.key]);

  return {
    items,
    ready,
    refresh,
    create: (item: T) => {
      const created = store.create(item);
      refresh();
      return created;
    },
    update: (id: string, patch: Partial<T>) => {
      const updated = store.update(id, patch);
      refresh();
      return updated;
    },
    remove: (id: string) => {
      const ok = store.remove(id);
      refresh();
      return ok;
    },
    get: (id: string) => store.get(id),
  };
}
