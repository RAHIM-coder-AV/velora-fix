"use client";

import { useCatalogStore } from "@/stores/catalog-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useLocale } from "@/providers/locale-provider";
import { ProductGrid } from "@/components/product/product-grid";
import { LocaleLink } from "@/components/layout/language-switcher";
import { useHydrated } from "@/hooks/use-hydrated";

export function WishlistView() {
  const { dict } = useLocale();
  const hydrated = useHydrated();
  const ids = useWishlistStore((s) => s.ids);
  const products = useCatalogStore((s) => s.products);
  const list = products.filter((p) => ids.includes(p.id));

  if (!hydrated) return <p>{dict.common.loading}</p>;
  if (!list.length) {
    return (
      <div className="py-16 text-center">
        <p className="font-serif text-3xl">{dict.cart.empty}</p>
        <LocaleLink href="/products" className="mt-4 inline-block underline">
          {dict.cart.continue}
        </LocaleLink>
      </div>
    );
  }
  return <ProductGrid products={list} />;
}
