"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useCatalogStore } from "@/stores/catalog-store";
import { useLocale } from "@/providers/locale-provider";
import { useCatalogQuery, CatalogFilters } from "@/components/catalog/catalog-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { Container, SectionHeading } from "@/components/ui/container";

function ProductsPageContent() {
  const { dict } = useLocale();
  const params = useParams<{ locale: string }>();
  const searchParams = useSearchParams();
  const showAll = searchParams.get("view") === "all";
  const categories = useCatalogStore((s) => s.categories);
  const listProducts = useCatalogStore((s) => s.listProducts);
  const filters = useCatalogQuery();
  const products = listProducts(showAll ? { sort: filters.sort } : filters);

  return (
    <Container className="py-8 sm:py-14">
      <SectionHeading title={dict.catalog.title} />
      <div className={`grid min-w-0 gap-6 md:gap-10 ${showAll ? "" : "md:grid-cols-[220px_minmax(0,1fr)]"}`}>
        {!showAll && <CatalogFilters categories={categories} basePath={`/${params.locale}/products`} />}
        <div className="min-w-0">
          <p className="mb-4 text-xs uppercase tracking-[0.1em] text-muted sm:mb-6 sm:tracking-[0.16em]">
            {products.length} {dict.catalog.results}
          </p>
          {products.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted">{dict.catalog.empty}</p>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </Container>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Container className="py-14"><div className="h-8 w-48 rounded bg-muted/10" /></Container>}>
      <ProductsPageContent />
    </Suspense>
  );
}
