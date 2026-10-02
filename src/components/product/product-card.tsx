"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/types";
import { useLocale } from "@/providers/locale-provider";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore } from "@/stores/wishlist-store";
import { RatingStars } from "@/components/ui/rating-stars";
import { useHydrated } from "@/hooks/use-hydrated";

export function ProductCard({ product }: { product: Product }) {
  const { locale, dict } = useLocale();
  const hydrated = useHydrated();
  const toggle = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.ids.includes(product.id));
  const href = `/${locale}/product/${product.slug}`;

  return (
    <article className="group">
      <div className="relative mb-3 aspect-[3/4] overflow-hidden bg-cream-2">
        <Link href={href} className="block h-full">
          <Image
            src={product.images[0]?.url ?? ""}
            alt={product.name[locale]}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggle(product.id)}
          className="absolute end-3 top-3 rounded-full bg-white/90 p-2 text-ink shadow-sm"
          aria-label={hydrated && wished ? dict.product.wishlistRemove : dict.product.wishlistAdd}
        >
          <Heart size={16} className={hydrated && wished ? "fill-ink" : ""} />
        </button>
        {product.isNew ? (
          <span className="absolute start-3 top-3 bg-white px-2 py-1 text-[10px] tracking-[0.18em] uppercase">
            {dict.product.new}
          </span>
        ) : null}
      </div>
      <Link href={href} className="block space-y-1">
        <h3 className="break-words text-sm">{product.name[locale]}</h3>
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <p className="min-w-0 text-xs sm:text-sm">
            {formatPrice(product.price, locale)}
            {product.compareAtPrice ? (
              <span className="ms-2 text-muted line-through">
                {formatPrice(product.compareAtPrice, locale)}
              </span>
            ) : null}
          </p>
          <RatingStars value={product.rating} size={11} />
        </div>
      </Link>
    </article>
  );
}
