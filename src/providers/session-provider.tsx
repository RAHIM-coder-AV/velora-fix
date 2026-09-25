"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useCatalogStore } from "@/stores/catalog-store";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const init = useAuthStore((s) => s.init);
  useEffect(() => {
    void init();
    void useCatalogStore.getState().refresh();
  }, [init]);
  return <>{children}</>;
}
