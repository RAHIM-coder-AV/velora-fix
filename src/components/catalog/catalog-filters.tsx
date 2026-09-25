"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category, Filters } from "@/types";
import { useLocale } from "@/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";

export function CatalogFilters({
  categories,
  basePath,
}: {
  categories: Category[];
  basePath: string;
}) {
  const { locale, dict } = useLocale();
  const params = useSearchParams();
  const router = useRouter();
  const [min, setMin] = useState(params.get("min") ?? "");
  const [max, setMax] = useState(params.get("max") ?? "");

  function push(next: Record<string, string | undefined>) {
    const sp = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (!v) sp.delete(k);
      else sp.set(k, v);
    });
    router.push(`${basePath}?${sp.toString()}`);
  }

  return (
    <aside className="space-y-6 border-b border-line pb-6 md:border-b-0 md:border-e md:pe-8 md:pb-0">
      <p className="text-[11px] tracking-[0.2em] uppercase text-muted">{dict.catalog.filters}</p>
      <Field label={dict.catalog.category}>
        <Select
          value={params.get("category") ?? ""}
          onChange={(e) => push({ category: e.target.value || undefined })}
        >
          <option value="">{dict.catalog.all}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name[locale]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label={dict.catalog.price}>
        <div className="flex gap-2">
          <Input
            inputMode="numeric"
            placeholder={dict.catalog.min}
            value={min}
            onChange={(e) => setMin(e.target.value)}
          />
          <Input
            inputMode="numeric"
            placeholder={dict.catalog.max}
            value={max}
            onChange={(e) => setMax(e.target.value)}
          />
        </div>
      </Field>
      <Field label={dict.catalog.sort}>
        <Select
          value={params.get("sort") ?? "newest"}
          onChange={(e) => push({ sort: e.target.value })}
        >
          <option value="newest">{dict.catalog.newest}</option>
          <option value="price-asc">{dict.catalog.priceAsc}</option>
          <option value="price-desc">{dict.catalog.priceDesc}</option>
          <option value="rating">{dict.catalog.rating}</option>
        </Select>
      </Field>
      <div className="flex gap-2">
        <Button
          type="button"
          className="flex-1"
          onClick={() => push({ min: min || undefined, max: max || undefined })}
        >
          {dict.catalog.apply}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setMin("");
            setMax("");
            router.push(basePath);
          }}
        >
          {dict.catalog.reset}
        </Button>
      </div>
    </aside>
  );
}

export function filtersFromSearch(sp: URLSearchParams): Filters {
  return {
    category: sp.get("category") || undefined,
    minPrice: sp.get("min") ? Number(sp.get("min")) : undefined,
    maxPrice: sp.get("max") ? Number(sp.get("max")) : undefined,
    q: sp.get("q") || undefined,
    sort: (sp.get("sort") as Filters["sort"]) || "newest",
  };
}

export function useCatalogQuery() {
  const params = useSearchParams();
  return useMemo(() => filtersFromSearch(params), [params]);
}
