"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { Category, Localized, Product } from "@/types";
import {
  createDefaultHomepageContent,
  productsForHomepageSection,
  type HomepageContent,
  type HomepageSection,
} from "@/lib/homepage/content";
import { useHomepageStore } from "@/stores/homepage-store";
import { HomepageImage } from "@/components/store/homepage-image";
import { useCatalogStore } from "@/stores/catalog-store";

interface StoreHomepageProps {
  locale: string;
}

function text(value: Localized, locale: string): string {
  return locale === "ar" ? value.ar : value.fr;
}

function formatPrice(price: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
    style: "currency",
    currency: "DZD",
    maximumFractionDigits: 0,
  }).format(price);
}

function localizedHref(href: string, locale: string): string {
  if (/^(https?:|mailto:|tel:|#)/i.test(href)) return href;
  if (href === `/${locale}` || href.startsWith(`/${locale}/`) || href.startsWith(`/${locale}?`)) {
    return href;
  }
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

function ProductCards({
  products,
  locale,
}: {
  products: Product[];
  locale: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {products.map((product) => (
        <Link
          href={`/${locale}/product/${product.slug}`}
          key={product.id}
          className="group min-w-0"
        >
          <div className="aspect-[4/5] overflow-hidden bg-stone-100">
            <HomepageImage
              src={product.images[0]?.url ?? ""}
              alt={text(product.name, locale)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="pt-3">
            <h3 className="line-clamp-2 text-sm font-medium text-stone-900 sm:text-base">
              {text(product.name, locale)}
            </h3>
            <p className="mt-1 text-sm text-stone-700">{formatPrice(product.price, locale)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function SectionView({
  section,
  content,
  locale,
  products,
  categories,
}: {
  section: HomepageSection;
  content: HomepageContent;
  locale: string;
  products: Product[];
  categories: Category[];
}) {
  const title = "title" in section ? text(section.title, locale) : "";
  const sectionSurface = {
    atelier: "bg-white",
    minimal: "bg-stone-50",
    lookbook: "bg-stone-100",
  }[content.theme];
  if (!section.visible) return null;

  if (section.id === "hero") {
    const themeClass = {
      atelier: "min-h-[560px] md:min-h-[650px]",
      minimal: "min-h-[440px] md:min-h-[540px]",
      lookbook: "min-h-[600px] md:min-h-[720px]",
    }[content.theme];
    const heroDirection = locale === "ar" ? "text-right" : "text-left";
    return (
      <section className={`relative isolate flex ${themeClass} items-end overflow-hidden bg-[#f4efe8]`}>
        <HomepageImage
          src={section.imageUrl}
          alt={text(section.title, locale)}
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-40"
          imageClassName="object-contain object-right opacity-70"
        />
        <div className="absolute inset-0 -z-[5] bg-gradient-to-r from-[#f4efe8] via-[#f4efe8]/90 to-transparent rtl:bg-gradient-to-l" />
        <div className={`relative z-10 mx-auto w-full max-w-7xl px-5 pb-12 text-stone-950 sm:px-8 sm:pb-16 md:pb-24 ${heroDirection}`}>
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-stone-600 sm:text-sm">
            {text(section.kicker, locale)}
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl md:text-7xl">
            {text(section.title, locale)}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-stone-700 sm:text-lg">
            {text(section.body, locale)}
          </p>
          <div className={`mt-8 flex flex-wrap gap-3 ${locale === "ar" ? "justify-start" : ""}`}>
            <Link href={localizedHref(section.primaryHref, locale)} className="bg-stone-950 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-800">
              {text(section.primaryLabel, locale)}
            </Link>
            <Link href={localizedHref(section.secondaryHref, locale)} className="border border-stone-500 px-6 py-3 text-sm font-semibold text-stone-950 hover:bg-black/5">
              {text(section.secondaryLabel, locale)}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (section.id === "categories") {
    const available = new Set(categories.map((category) => category.slug));
    const visibleCategories = section.items.filter((item) => available.has(item.slug));
    return (
      <section className={`${sectionSurface} mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20`}>
        <h2 className="mb-7 text-2xl font-semibold text-stone-900 sm:mb-10 sm:text-3xl">
          {title}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {visibleCategories.map((category) => (
            <Link
              key={category.slug}
              href={localizedHref(category.href, locale)}
              className="group relative aspect-[4/5] overflow-hidden bg-stone-200"
            >
              <HomepageImage
                src={category.imageUrl}
                alt={text(category.title, locale)}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-12 text-lg font-medium text-white">
                {text(category.title, locale)}
              </span>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  if (section.id === "featured" || section.id === "new-arrivals") {
    const selectedProducts = productsForHomepageSection(section, products);
    return (
      <section className={`${sectionSurface} mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20`}>
        <div className="mb-7 flex items-end justify-between gap-4 sm:mb-10">
          <h2 className="text-2xl font-semibold text-stone-900 sm:text-3xl">{title}</h2>
          <Link href={`/${locale}/products`} className="shrink-0 text-sm text-stone-700 underline underline-offset-4">
            {locale === "ar" ? "عرض الكل" : "Tout voir"}
          </Link>
        </div>
        {selectedProducts.length ? (
          <ProductCards products={selectedProducts} locale={locale} />
        ) : (
          <p className="border border-stone-200 p-6 text-sm text-stone-600">
            {locale === "ar" ? "لا توجد منتجات في هذا القسم حالياً." : "Aucun produit dans cette section pour le moment."}
          </p>
        )}
      </section>
    );
  }

  if (section.id !== "editorial") return null;
  return (
    <section className={`${sectionSurface} mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 sm:py-20 md:grid-cols-2 md:items-center md:gap-14 ${content.theme === "lookbook" ? "md:gap-20" : ""} ${locale === "ar" ? "md:[direction:rtl]" : ""}`}>
      <div className="aspect-[5/4] overflow-hidden bg-stone-200">
        <HomepageImage
          src={section.imageUrl}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="text-stone-900">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-600">
          {locale === "ar" ? "قصة فيلورا" : "L'esprit Velora"}
        </p>
        <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
        <p className="mt-5 max-w-xl leading-7 text-stone-700">{text(section.body, locale)}</p>
        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
          <Link href={localizedHref(section.firstLinkHref, locale)} className="text-sm font-semibold underline underline-offset-4">
            {text(section.firstLinkLabel, locale)}
          </Link>
          <Link href={localizedHref(section.secondLinkHref, locale)} className="text-sm font-semibold underline underline-offset-4">
            {text(section.secondLinkLabel, locale)}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function StoreHomepage({ locale }: StoreHomepageProps) {
  const products = useCatalogStore((state) => state.products);
  const categories = useCatalogStore((state) => state.categories);
  const content = useHomepageStore((state) => state.content);
  const source = useHomepageStore((state) => state.source);
  const load = useHomepageStore((state) => state.load);
  useEffect(() => {
    void load().catch((error: unknown) => {
      console.error("Homepage content could not be loaded.", error);
    });
  }, [load]);
  const homepage = source === "default" ? createDefaultHomepageContent(categories) : content;
  return (
    <main dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-white">
      {[...homepage.sections]
        .sort((a, b) => a.order - b.order)
        .map((section) => (
          <SectionView
            key={section.id}
            section={section}
            content={homepage}
            locale={locale}
            products={products}
            categories={categories}
          />
        ))}
    </main>
  );
}
