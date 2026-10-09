"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCatalogStore, getStoredProducts } from "@/stores/catalog-store";
import { useLocale } from "@/providers/locale-provider";
import { relatedProducts } from "@/lib/catalog/queries";
import { products as seedProducts } from "@/lib/catalog/seed";
import { ProductDetail } from "@/components/product/product-detail";
import { Container } from "@/components/ui/container";

function ProductSkeleton() {
  return (
    <Container className="py-10 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="mb-6 h-10 w-full rounded-lg bg-emerald-100/60 dark:bg-emerald-950/20" />
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1.3fr] lg:gap-12">
        {/* Left Column Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex gap-2.5">
            <div className="h-20 w-20 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-20 w-20 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-20 w-20 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="h-28 rounded-xl bg-zinc-100 dark:bg-zinc-900" />
        </div>
        {/* Right Column Skeleton */}
        <div className="space-y-5">
          <div className="h-9 w-3/4 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-7 w-1/3 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-96 rounded-2xl border border-zinc-200/60 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900" />
        </div>
      </div>
    </Container>
  );
}

export default function ProductPage() {
  const { dict, locale } = useLocale();
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const products = useCatalogStore((s) => s.products);
  const catalogLoadState = useCatalogStore((s) => s.catalogLoadState);
  const localDataReady = useCatalogStore((s) => s.localDataReady);
  const allReviews = useCatalogStore((s) => s.reviews);

  // Fast direct resolution: store -> localStorage -> seed
  const product =
    products.find((p) => p.slug === params.slug || p.id === params.slug) ||
    (typeof window !== "undefined"
      ? getStoredProducts().find((p) => p.slug === params.slug || p.id === params.slug)
      : undefined) ||
    seedProducts.find((p) => p.slug === params.slug || p.id === params.slug);

  useEffect(() => {
    // Prefetch checkout success page for instant redirect upon order placement
    router.prefetch(`/${locale}/checkout/success`);
  }, [router, locale]);

  // If product is not yet in store and catalog is still initializing, show sleek skeleton
  if (!product && (catalogLoadState === "loading" || !localDataReady)) {
    return <ProductSkeleton />;
  }

  if (!product && catalogLoadState === "error") {
    return (
      <Container className="py-20 text-center">
        <p className="font-serif text-xl">
          {locale === "ar"
            ? "تعذر تحميل كتالوج المتجر. يرجى إعادة تحميل الصفحة لاحقًا."
            : "Impossible de charger le catalogue. Veuillez réessayer plus tard."}
        </p>
      </Container>
    );
  }

  if (!product || product.active === false) {
    return (
      <Container className="py-20 text-center">
        <p className="font-serif text-3xl">{dict.catalog.empty}</p>
      </Container>
    );
  }

  const reviews = allReviews.filter((r) => r.productId === product.id);
  const related = relatedProducts(product, products);

  return (
    <Container className="py-14">
      <ProductDetail product={product} reviews={reviews} related={related} />
    </Container>
  );
}
