"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useCartStore } from "@/stores/cart-store";
import { useCatalogStore } from "@/stores/catalog-store";
import { useLocale } from "@/providers/locale-provider";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/lib/constants";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { Button } from "@/components/ui/button";
import { LocaleLink } from "@/components/layout/language-switcher";
import { useHydrated } from "@/hooks/use-hydrated";

export function cartTotals(subtotal: number) {
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  return { subtotal, shipping, total: subtotal + shipping };
}

export function CartView() {
  const { locale, dict } = useLocale();
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const products = useCatalogStore((s) => s.products);

  const lines = useMemo(() => {
    return items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        const variant = product?.variants.find((v) => v.id === item.variantId);
        if (!product || !variant) return null;
        return { item, product, variant };
      })
      .filter(Boolean) as Array<{
      item: (typeof items)[number];
      product: (typeof products)[number];
      variant: (typeof products)[number]["variants"][number];
    }>;
  }, [items, products]);

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.item.quantity, 0);
  const totals = cartTotals(subtotal);

  if (!hydrated) return <p className="text-sm text-muted">{dict.common.loading}</p>;

  if (!lines.length) {
    return (
      <div className="py-16 text-center">
        <p className="font-serif text-3xl">{dict.cart.empty}</p>
        <LocaleLink href="/products" className="mt-6 inline-block text-sm tracking-[0.16em] uppercase underline">
          {dict.cart.continue}
        </LocaleLink>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
      <ul className="divide-y divide-line">
        {lines.map(({ item, product, variant }) => (
          <li key={item.variantId} className="flex gap-4 py-6">
            <div className="relative h-28 w-20 shrink-0 overflow-hidden bg-cream-2">
              <Image src={product.images[0].url} alt="" fill className="object-cover" sizes="80px" />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <LocaleLink href={`/product/${product.slug}`} className="text-sm">
                  {product.name[locale]}
                </LocaleLink>
                <p className="mt-1 text-xs text-muted">
                  {variant.size} · {variant.color[locale]}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <QuantitySelector
                  value={item.quantity}
                  max={variant.stock}
                  onChange={(n) => setQty(item.variantId, n)}
                />
                <button
                  type="button"
                  className="text-xs uppercase tracking-widest text-muted"
                  onClick={() => removeItem(item.variantId)}
                >
                  {dict.cart.remove}
                </button>
              </div>
            </div>
            <p className="text-sm">{formatPrice(product.price * item.quantity, locale)}</p>
          </li>
        ))}
      </ul>
      <aside className="h-fit border border-line bg-white p-6">
        <h2 className="font-serif text-2xl">{dict.cart.title}</h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt>{dict.cart.subtotal}</dt>
            <dd>{formatPrice(totals.subtotal, locale)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>{dict.cart.shipping}</dt>
            <dd>{totals.shipping === 0 ? dict.cart.freeShipping : formatPrice(totals.shipping, locale)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base">
            <dt>{dict.cart.total}</dt>
            <dd>{formatPrice(totals.total, locale)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-muted">{dict.cart.codNote}</p>
        <p className="mt-1 text-xs text-muted">{dict.cart.shippingHint}</p>
        <LocaleLink href="/checkout">
          <Button className="mt-6 w-full">{dict.cart.checkout}</Button>
        </LocaleLink>
      </aside>
    </div>
  );
}
