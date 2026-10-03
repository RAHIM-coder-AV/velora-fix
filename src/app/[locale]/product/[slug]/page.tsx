"use client";

import { useParams } from "next/navigation";
import { useCatalogStore } from "@/stores/catalog-store";
import { useLocale } from "@/providers/locale-provider";
import { relatedProducts } from "@/lib/catalog/queries";
import { ProductDetail } from "@/components/product/product-detail";
import { Container } from "@/components/ui/container";
import { useHydrated } from "@/hooks/use-hydrated";

export default function ProductPage() {
  const { dict, locale } = useLocale();
  const hydrated = useHydrated();
  const params = useParams<{ slug: string }>();
  const products = useCatalogStore((s) => s.products);
  const catalogLoadState = useCatalogStore((s) => s.catalogLoadState);
  const allReviews = useCatalogStore((s) => s.reviews);
  const product = products.find((p) => p.slug === params.slug || p.id === params.slug);

  if (!hydrated || (!product && catalogLoadState === "loading")) {
    return (
      <Container className="py-20">
        <p className="text-sm text-muted">{dict.common.loading}</p>
      </Container>
    );
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
