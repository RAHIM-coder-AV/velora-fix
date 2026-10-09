"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useCatalogStore } from "@/stores/catalog-store";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const init = useAuthStore((s) => s.init);
  useEffect(() => {
    void init();
    // Load browser-stored catalog data only after hydration so the first
    // client render always matches the server-rendered markup.
    useCatalogStore.getState().hydrateLocalData();
    void useCatalogStore.getState().refresh().catch((error) => {
      console.warn("Catalog refresh notice:", error);
    });
  }, [init]);
  return <>{children}</>;
}
