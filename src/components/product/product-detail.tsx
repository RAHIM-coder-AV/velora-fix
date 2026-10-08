"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Sparkles, ShoppingBag } from "lucide-react";
import type { Product, Review } from "@/types";
import { useLocale } from "@/providers/locale-provider";
import { formatPrice } from "@/lib/utils";
import { findVariant } from "@/lib/catalog/queries";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/ui/rating-stars";
import { toast } from "@/components/ui/toast";
import { ProductGrid } from "@/components/product/product-grid";
import { QuickOrderForm } from "@/components/product/quick-order-form";
import { cn } from "@/lib/utils";

export function ProductDetail({
  product,
  reviews,
  related,
}: {
  product: Product;
  reviews: Review[];
  related: Product[];
}) {
  const { locale, dict } = useLocale();
  const [image, setImage] = useState(0);

  // Available sizes (if tracking stock is enabled, only show stock > 0)
  const availableSizes = (() => {
    if (product.trackStock === false) return product.sizes;
    if (!product.variants || product.variants.length === 0) return product.sizes;
    const inStock = product.sizes.filter((s) =>
      product.variants.some((v) => v.size === s && v.stock > 0)
    );
    return inStock.length > 0 ? inStock : product.sizes;
  })();

  const initialSize = availableSizes[0] || product.sizes[0] || "M";

  // Available colors for the size
  const getAvailableColorsForSize = (targetSize: string) => {
    if (product.trackStock === false) return product.colors;
    if (!product.variants || product.variants.length === 0) return product.colors;
    const inStock = product.colors.filter((c) =>
      product.variants.some(
        (v) =>
          v.size === targetSize &&
          v.colorHex.toLowerCase() === c.hex.toLowerCase() &&
          v.stock > 0
      )
    );
    if (inStock.length > 0) return inStock;
    const inStockAny = product.colors.filter((c) =>
      product.variants.some(
        (v) => v.colorHex.toLowerCase() === c.hex.toLowerCase() && v.stock > 0
      )
    );
    return inStockAny.length > 0 ? inStockAny : product.colors;
  };

  const initialColors = getAvailableColorsForSize(initialSize);
  const initialColor = initialColors[0]?.hex || product.colors[0]?.hex || "#111111";

  const [size, setSize] = useState(initialSize);
  const [color, setColor] = useState(initialColor);

  const handleSizeChange = (newSize: string) => {
    setSize(newSize);
    const validColors = getAvailableColorsForSize(newSize);
    if (validColors.length > 0 && !validColors.some((c) => c.hex.toLowerCase() === color.toLowerCase())) {
      setColor(validColors[0].hex);
    }
  };

  const addItem = useCartStore((s) => s.addItem);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.ids.includes(product.id));
  const hydrated = useHydrated();
  const variant = findVariant(product, size, color);

  function add() {
    if (!variant || (product.trackStock !== false && variant.stock < 1)) {
      toast(dict.product.selectVariant);
      return;
    }
    addItem({ productId: product.id, variantId: variant.id, quantity: 1 });
    toast(dict.product.added);
  }

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div>
      {/* Top Welcome announcement banner (matching screenshot) */}
      <div className="mb-6 flex items-start justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-center text-[11px] font-semibold leading-5 text-white shadow-sm sm:items-center sm:px-4 sm:text-xs">
        <Sparkles size={16} className="mt-0.5 shrink-0 text-yellow-300 sm:mt-0" />
        <span>
          {locale === "ar"
            ? `مرحباً بكم في متجرنا — التوصيل متوفر لـ 58 ولاية والدفع عند الاستلام`
            : `Bienvenue sur notre boutique — Livraison 58 wilayas, paiement à la livraison`}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1.3fr] lg:gap-12">
        {/* Left/Images Column */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <Image
              src={product.images[image]?.url ?? product.images[0]?.url ?? ""}
              alt={product.name[locale] || product.name.ar}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {hasDiscount && (
              <span className="absolute start-4 top-4 rounded-md bg-amber-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-zinc-900 shadow">
                {locale === "ar" ? "تخفيض" : "Promo"}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 ? (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setImage(i)}
                  className={cn(
                    "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition",
                    i === image
                      ? "border-emerald-600 shadow-md ring-2 ring-emerald-500/20"
                      : "border-zinc-200 opacity-70 hover:opacity-100 dark:border-zinc-800"
                  )}
                >
                  <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          ) : null}

          {/* Description Section on Left for desktop */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              {locale === "ar" ? "وصف المنتج" : "Description"}
            </h3>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {product.description[locale] || product.description.ar}
            </p>
          </div>
        </div>

        {/* Right/Order Column */}
        <div className="min-w-0 space-y-5 sm:space-y-6">
          {/* Header & Price info */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="break-words font-serif text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl md:text-4xl">
                  {product.name[locale] || product.name.ar}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 sm:gap-3">
                  <div className="flex items-center gap-1.5">
                    <RatingStars value={product.rating} />
                    <span className="text-xs font-semibold text-zinc-600">
                      ({product.rating.toFixed(1)})
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400">·</span>
                  <span className="text-xs text-zinc-600">
                    {product.reviewCount} {locale === "ar" ? "تقييم" : "avis"}
                  </span>
                  {product.sku && (
                    <>
                      <span className="text-xs text-zinc-400">·</span>
                      <span className="text-xs text-zinc-600">SKU: {product.sku}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Wishlist toggle button */}
              <button
                type="button"
                onClick={() => toggleWish(product.id)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100 sm:h-10 sm:w-10"
                aria-label="Wishlist"
              >
                <Heart
                  size={18}
                  className={cn(hydrated && wished ? "fill-red-500 text-red-500" : "")}
                />
              </button>
            </div>

            {/* Price badge bar */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-serif text-2xl font-extrabold text-emerald-700 sm:text-3xl dark:text-emerald-400">
                {formatPrice(product.price, locale)}
              </span>
              {hasDiscount && (
                <span className="text-lg font-medium text-zinc-400 line-through">
                  {formatPrice(product.compareAtPrice!, locale)}
                </span>
              )}
            </div>
          </div>

          {/* Direct COD Checkout Form (User Request: Name, Phone, Wilaya, Baladiya, Offers, No Email) */}
          <QuickOrderForm
            product={product}
            selectedSize={size}
            selectedColorHex={color}
            onSizeChange={handleSizeChange}
            onColorChange={setColor}
          />

          {/* Secondary Add to Cart Option */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <span className="min-w-0 flex-1 text-xs text-zinc-500 dark:text-zinc-400">
              {locale === "ar" ? "ترغب في إضافة هذا المنتج إلى السلة ومتابعة التسوق؟" : "Vous préférez ajouter au panier ?"}
            </span>
            <button
              type="button"
              onClick={add}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 underline underline-offset-4 hover:text-emerald-600"
            >
              <ShoppingBag size={14} />
              {dict.product.addToCart}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16 border-t border-zinc-200 pt-10 dark:border-zinc-800">
        <h2 className="font-serif text-2xl font-bold">{dict.product.reviews}</h2>
        <div className="mt-6 space-y-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-muted">
              {locale === "ar" ? "لا توجد تقييمات بعد لهذا المنتج." : "Aucun avis pour le moment."}
            </p>
          ) : (
            reviews.map((r) => (
              <article key={r.id} className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{r.author}</p>
                  <RatingStars value={r.rating} />
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{r.comment[locale] || r.comment.ar}</p>
              </article>
            ))
          )}
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-8 font-serif text-2xl font-bold">{dict.product.related}</h2>
          <ProductGrid products={related} />
        </section>
      ) : null}
    </div>
  );
}
