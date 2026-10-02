"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const { locale, dict } = useLocale();
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`/${locale}/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "w-full" : "hidden md:block"}>
      <label className="relative block">
        <Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={dict.catalog.searchPlaceholder}
          className="w-full min-w-0 border-b border-line bg-transparent py-2 ps-9 pe-3 text-sm outline-none focus:border-ink"
        />
      </label>
    </form>
  );
}
