"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCatalogStore } from "@/stores/catalog-store";
import { useLocale } from "@/providers/locale-provider";
import { ProductGrid } from "@/components/product/product-grid";
import { Container, SectionHeading } from "@/components/ui/container";

function SearchPageContent() {
  const { dict } = useLocale();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const listProducts = useCatalogStore((s) => s.listProducts);
  const products = q ? listProducts({ q }) : [];

  return (
    <Container className="py-14">
      <SectionHeading title={`${dict.catalog.searchTitle} — “${q}”`} />
      <p className="mb-6 text-xs uppercase tracking-[0.16em] text-muted">
        {products.length} {dict.catalog.results}
      </p>
      {products.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">{dict.catalog.empty}</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </Container>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Container className="py-14"><div className="h-8 w-48 rounded bg-muted/10" /></Container>}>
      <SearchPageContent />
    </Suspense>
  );
}
