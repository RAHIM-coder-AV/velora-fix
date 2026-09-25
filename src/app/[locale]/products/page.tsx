"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { useCatalogStore } from "@/stores/catalog-store";
import { useLocale } from "@/providers/locale-provider";
import { useCatalogQuery, CatalogFilters } from "@/components/catalog/catalog-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { Container, SectionHeading } from "@/components/ui/container";

function ProductsPageContent() {
  const { dict } = useLocale();
  const params = useParams<{ locale: string }>();
  const categories = useCatalogStore((s) => s.categories);
  const listProducts = useCatalogStore((s) => s.listProducts);
  const filters = useCatalogQuery();
  const products = listProducts(filters);

  return (
    <Container className="py-14">
      <SectionHeading title={dict.catalog.title} />
      <div className="grid gap-10 md:grid-cols-[220px_1fr]">
        <CatalogFilters categories={categories} basePath={`/${params.locale}/products`} />
        <div>
          <p className="mb-6 text-xs uppercase tracking-[0.16em] text-muted">
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
