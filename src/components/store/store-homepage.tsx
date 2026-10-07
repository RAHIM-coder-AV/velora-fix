"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RefreshCw,
  Gem,
  Star,
  ShoppingBag,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Heart,
  Eye,
  Mail,
  Award,
} from "lucide-react";
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
import { ProductCard } from "@/components/product/product-card";
import { formatPrice, cn } from "@/lib/utils";

interface StoreHomepageProps {
  locale: string;
}

function text(value: Localized, locale: string): string {
  return locale === "ar" ? value.ar : value.fr;
}

function localizedHref(href: string, locale: string): string {
  if (/^(https?:|mailto:|tel:|#)/i.test(href)) return href;
  if (href === `/${locale}` || href.startsWith(`/${locale}/`) || href.startsWith(`/${locale}?`)) {
    return href;
  }
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

const FALLBACK_HERO_IMAGE =
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85";
const FALLBACK_EDITORIAL_IMAGE =
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=85";

export function StoreHomepage({ locale }: StoreHomepageProps) {
  const products = useCatalogStore((state) => state.products);
  const categories = useCatalogStore((state) => state.categories);
  const content = useHomepageStore((state) => state.content);
  const source = useHomepageStore((state) => state.source);
  const load = useHomepageStore((state) => state.load);
  const isAr = locale === "ar";
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  useEffect(() => {
    void load().catch((error: unknown) => {
      console.error("Homepage content could not be loaded.", error);
    });
  }, [load]);

  const homepage = source === "default" ? createDefaultHomepageContent(categories) : content;

  // Hero section data
  const heroSection = homepage.sections.find((s) => s.id === "hero");
  const heroImageUrl =
    heroSection && "imageUrl" in heroSection && heroSection.imageUrl && !heroSection.imageUrl.includes("watermark")
      ? heroSection.imageUrl
      : FALLBACK_HERO_IMAGE;

  // Top featured product for the floating hero card
  const topProduct = products.find((p) => p.featured) || products[0];

  return (
    <main dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-[#faf8f5] text-stone-900 selection:bg-stone-900 selection:text-white">
      {/* 1. Luxury Brand Announcement Bar */}
      <div className="overflow-hidden whitespace-nowrap border-b border-stone-200/80 bg-stone-900 py-2.5 text-[11px] font-medium tracking-[0.2em] uppercase text-stone-200">
        <div className="inline-flex animate-marquee gap-8">
          <span>{isAr ? "• تشكيلة الموسم الجديدة 2026" : "• NOUVELLE COLLECTION 2026"}</span>
          <span>{isAr ? "• توصيل سريع لـ 58 ولاية إلى باب المنزل" : "• LIVRAISON 58 WILAYAS À DOMICILE"}</span>
          <span>{isAr ? "• الدفع عند الاستلام مع إمكانية المعاينة" : "• PAIEMENT À LA LIVRAISON AVEC VÉRIFICATION"}</span>
          <span>{isAr ? "• خامات وأقمشة ممتازة مختارة بعناية" : "• MATIÈRES NOBLES & CONFECTION SOIGNÉE"}</span>
          <span>{isAr ? "• استبدال سهل وضمان الجودة 100%" : "• ÉCHANGE FACILE & QUALITÉ 100% GARANTIE"}</span>
          <span>{isAr ? "• تشكيلة الموسم الجديدة 2026" : "• NOUVELLE COLLECTION 2026"}</span>
          <span>{isAr ? "• توصيل سريع لـ 58 ولاية إلى باب المنزل" : "• LIVRAISON 58 WILAYAS À DOMICILE"}</span>
        </div>
      </div>

      {/* 2. Hero Section: Editorial Fashion Maison */}
      {heroSection && heroSection.visible && (
        <section className="relative isolate overflow-hidden border-b border-stone-200/70 bg-[#f4efe8]">
          <div className="mx-auto grid min-h-[640px] max-w-7xl grid-cols-1 items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:min-h-[720px] lg:grid-cols-12 lg:gap-12 lg:py-20">
            {/* Content Column (7 cols) */}
            <div className="z-10 flex flex-col items-start lg:col-span-7">
              {/* Season Tag Pill */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-stone-400/50 bg-white/80 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-stone-800 shadow-sm backdrop-blur-sm">
                <Sparkles size={13} className="text-amber-600" />
                <span>{text(heroSection.kicker, locale)}</span>
                <span className="h-1 w-1 rounded-full bg-stone-400"></span>
                <span className="text-stone-500">{isAr ? "تشكيلة 2026" : "Édition 2026"}</span>
              </div>

              {/* High-fashion Headline */}
              <h1 className="font-serif text-4xl font-semibold leading-[1.12] tracking-tight text-stone-950 sm:text-5xl md:text-6xl xl:text-7xl">
                {text(heroSection.title, locale)}
              </h1>

              {/* Subtitle / Brand Description */}
              <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-700 sm:text-lg sm:leading-8">
                {text(heroSection.body, locale)}
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href={localizedHref(heroSection.primaryHref, locale)}
                  className="group inline-flex items-center gap-2 rounded-full bg-stone-950 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-stone-950/15 transition duration-300 hover:bg-stone-800 active:scale-95"
                >
                  <span>{text(heroSection.primaryLabel, locale)}</span>
                  {isAr ? (
                    <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
                  ) : (
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  )}
                </Link>
                <Link
                  href={localizedHref(heroSection.secondaryHref, locale)}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-800/80 bg-transparent px-7 py-4 text-sm font-semibold text-stone-950 transition duration-300 hover:bg-stone-950/5 active:scale-95"
                >
                  <span>{text(heroSection.secondaryLabel, locale)}</span>
                </Link>
              </div>

              {/* Micro Trust Points */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-stone-300/70 pt-6 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-stone-900 shrink-0" />
                  <span>{isAr ? "توصيل لـ 58 ولاية" : "Livraison 58 wilayas"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-stone-900 shrink-0" />
                  <span>{isAr ? "الدفع عند الاستلام" : "Paiement à réception"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-stone-900 shrink-0" />
                  <span>{isAr ? "خامات أصلية 100%" : "Qualité certifiée"}</span>
                </div>
              </div>
            </div>

            {/* Visual Column: Editorial Photography (5 cols) */}
            <div className="relative lg:col-span-5">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl bg-stone-200 shadow-2xl ring-1 ring-stone-900/10">
                <Image
                  src={heroImageUrl}
                  alt={text(heroSection.title, locale)}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 inset-x-5 text-white">
                  <span className="text-[11px] font-semibold tracking-widest uppercase text-stone-300">
                    {isAr ? "إطلالات دار فيلورا" : "VELORA ATELIER"}
                  </span>
                  <p className="mt-1 font-serif text-lg font-medium sm:text-xl">
                    {isAr ? "أناقة معاصرة، جودة لا تضاهى" : "L'art du vêtement intemporel"}
                  </p>
                </div>
              </div>

              {/* Floating Featured Product Highlight Card */}
              {topProduct && (
                <Link
                  href={`/${locale}/product/${topProduct.slug}`}
                  className="group absolute -bottom-6 -start-4 hidden sm:flex items-center gap-3 rounded-2xl border border-stone-200/80 bg-white/95 p-3 shadow-xl backdrop-blur-md transition hover:scale-105 md:-start-8"
                >
                  <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-stone-100 shrink-0">
                    <Image
                      src={topProduct.images[0]?.url || heroImageUrl}
                      alt={text(topProduct.name, locale)}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="pe-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600">
                      <Star size={10} className="fill-amber-500 text-amber-500" />
                      {isAr ? "القطعة الأيقونية" : "Pièce Iconique"}
                    </span>
                    <p className="line-clamp-1 text-xs font-bold text-stone-900 group-hover:text-amber-700">
                      {text(topProduct.name, locale)}
                    </p>
                    <p className="text-xs font-semibold text-stone-700">
                      {formatPrice(topProduct.price, locale as "ar" | "fr")}
                    </p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 3. Brand Pillars & Values Bar */}
      <section className="border-b border-stone-200 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-stone-900">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 sm:text-sm">
                  {isAr ? "توصيل لـ 58 ولاية" : "Livraison 58 Wilayas"}
                </h4>
                <p className="mt-0.5 text-[11px] leading-relaxed text-stone-500 sm:text-xs">
                  {isAr ? "شحن سريع وآمن إلى باب المنزل" : "Expédition rapide à domicile"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-stone-900">
                <Gem size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 sm:text-sm">
                  {isAr ? "خامات نبيلة وفاخرة" : "Matières Nobles"}
                </h4>
                <p className="mt-0.5 text-[11px] leading-relaxed text-stone-500 sm:text-xs">
                  {isAr ? "أقمشة أصلية وقصات مدروسة" : "Tissus de haute qualité"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-stone-900">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 sm:text-sm">
                  {isAr ? "دفع عند الاستلام" : "Paiement à la Livraison"}
                </h4>
                <p className="mt-0.5 text-[11px] leading-relaxed text-stone-500 sm:text-xs">
                  {isAr ? "افحص طلبك قبل الدفع بكل ثقة" : "Vérifiez avant de régler"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-stone-900">
                <RefreshCw size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 sm:text-sm">
                  {isAr ? "استبدال المقاس مضمون" : "Échange Facile"}
                </h4>
                <p className="mt-0.5 text-[11px] leading-relaxed text-stone-500 sm:text-xs">
                  {isAr ? "خدمة زبائن مرافقة بعد الشراء" : "Service client dédié"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Dynamic Sections: Categories, Featured, Editorial, New Arrivals */}
      {homepage.sections
        .filter((s) => s.id !== "hero")
        .sort((a, b) => a.order - b.order)
        .map((section) => {
          if (!section.visible) return null;

          // Category Universe Section
          if (section.id === "categories") {
            const available = new Set(categories.map((c) => c.slug));
            const visibleCategories = section.items.filter((item) => available.has(item.slug));
            return (
              <section key={section.id} className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                      {isAr ? "عوالم التشكيلات" : "UNIVERS & COLLECTIONS"}
                    </span>
                    <h2 className="mt-1 font-serif text-3xl font-semibold text-stone-950 sm:text-4xl">
                      {text(section.title, locale)}
                    </h2>
                  </div>
                  <Link
                    href={`/${locale}/categories`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-amber-700 transition"
                  >
                    <span>{isAr ? "عرض جميع التصنيفات" : "Toutes les catégories"}</span>
                    {isAr ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                  {visibleCategories.map((category) => {
                    const catProductsCount = products.filter((p) => p.categoryId.includes(category.slug)).length;
                    return (
                      <Link
                        key={category.slug}
                        href={localizedHref(category.href, locale)}
                        className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-200 shadow-md ring-1 ring-stone-900/5 transition duration-500 hover:-translate-y-1 hover:shadow-xl"
                      >
                        <HomepageImage
                          src={category.imageUrl}
                          alt={text(category.title, locale)}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent transition duration-300 group-hover:from-stone-950/90" />
                        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                          <span className="text-[10px] uppercase tracking-widest text-stone-300">
                            {isAr ? "مجموعة" : "Collection"}
                          </span>
                          <h3 className="font-serif text-lg font-bold sm:text-xl">
                            {text(category.title, locale)}
                          </h3>
                          <div className="mt-2 flex items-center justify-between text-xs text-stone-300 opacity-0 transform translate-y-2 transition duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                            <span>{isAr ? "اكتشف المجموعة" : "Explorer"}</span>
                            {isAr ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          }

          // Featured Products / Best Sellers
          if (section.id === "featured") {
            const selectedProducts = productsForHomepageSection(section, products);
            return (
              <section key={section.id} className="border-t border-stone-200 bg-white py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-5 sm:px-8">
                  <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                        {isAr ? "الأكثر تميزاً" : "SÉLECTION ICONIQUE"}
                      </span>
                      <h2 className="mt-1 font-serif text-3xl font-semibold text-stone-950 sm:text-4xl">
                        {text(section.title, locale)}
                      </h2>
                    </div>
                    <Link
                      href={`/${locale}/products`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-amber-700 transition"
                    >
                      <span>{isAr ? "تصفح كل التشكيلة" : "Voir toute la collection"}</span>
                      {isAr ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                    </Link>
                  </div>

                  {selectedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                      {selectedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-xl border border-stone-200 p-8 text-center text-sm text-stone-500">
                      {isAr ? "جاري تجهيز مختارات التشكيلة..." : "Aucun produit disponible pour le moment."}
                    </p>
                  )}
                </div>
              </section>
            );
          }

          // Editorial & Lookbook Story
          if (section.id === "editorial") {
            const editorialImageUrl =
              section.imageUrl && !section.imageUrl.includes("watermark")
                ? section.imageUrl
                : FALLBACK_EDITORIAL_IMAGE;

            return (
              <section key={section.id} className="border-t border-stone-200 bg-[#f4efe8] py-16 sm:py-24">
                <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
                  {/* Left Column: Layered Lookbook Images (6 cols) */}
                  <div className="relative lg:col-span-6">
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-stone-200 shadow-2xl">
                      <HomepageImage
                        src={editorialImageUrl}
                        alt={text(section.title, locale)}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent" />
                    </div>

                    {/* Floating Luxury Quote Badge */}
                    <div className="absolute -bottom-6 end-6 hidden sm:block max-w-xs rounded-2xl border border-stone-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-md">
                      <p className="font-serif italic text-xs leading-relaxed text-stone-800">
                        {isAr
                          ? "«الأناقة الحقيقية تكمن في البساطة وجودة الخامات التي ترافقك كل يوم.»"
                          : "« L'élégance réside dans la pureté des lignes et la sincérité des matières. »"}
                      </p>
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        — VELORA ATELIER
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Narrative (6 cols) */}
                  <div className="lg:col-span-6">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                      {isAr ? "قصة الدار والخياطة الرفيعة" : "L'ATELIER & LE SAVOIR-FAIRE"}
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-stone-950 sm:text-4xl md:text-5xl">
                      {text(section.title, locale)}
                    </h2>
                    <p className="mt-6 text-base leading-relaxed text-stone-700 sm:text-lg sm:leading-8">
                      {text(section.body, locale)}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <Link
                        href={localizedHref(section.firstLinkHref, locale)}
                        className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-6 py-3.5 text-xs font-semibold text-white shadow-md transition hover:bg-stone-800"
                      >
                        <span>{text(section.firstLinkLabel, locale)}</span>
                        {isAr ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                      </Link>
                      <Link
                        href={localizedHref(section.secondLinkHref, locale)}
                        className="inline-flex items-center gap-2 rounded-full border border-stone-800 px-6 py-3.5 text-xs font-semibold text-stone-950 transition hover:bg-stone-950/5"
                      >
                        <span>{text(section.secondLinkLabel, locale)}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          // New Arrivals
          if (section.id === "new-arrivals") {
            const newProducts = productsForHomepageSection(section, products);
            return (
              <section key={section.id} className="border-t border-stone-200 bg-white py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-5 sm:px-8">
                  <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                        {isAr ? "أحدث الإضافات" : "DERNIERS ARRIVAGES"}
                      </span>
                      <h2 className="mt-1 font-serif text-3xl font-semibold text-stone-950 sm:text-4xl">
                        {text(section.title, locale)}
                      </h2>
                    </div>
                    <Link
                      href={`/${locale}/products`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-amber-700 transition"
                    >
                      <span>{isAr ? "مشاهدة الكل" : "Tout voir"}</span>
                      {isAr ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                    </Link>
                  </div>

                  {newProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                      {newProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-xl border border-stone-200 p-8 text-center text-sm text-stone-500">
                      {isAr ? "لا توجد منتجات جديدة حالياً." : "Aucune nouveauté pour le moment."}
                    </p>
                  )}
                </div>
              </section>
            );
          }

          return null;
        })}

      {/* 5. Customer Testimonials & Reviews Showcase */}
      <section className="border-t border-stone-200 bg-[#faf8f5] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
              {isAr ? "تجارب حقيقية" : "AVIS DE NOS CLIENTS"}
            </span>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-stone-950 sm:text-4xl">
              {isAr ? "ماذا يقول عملاؤنا عن فيلورا" : "Ils ont choisi la Maison Velora"}
            </h2>
            <div className="mt-3 flex items-center justify-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-amber-500" />
              ))}
              <span className="ms-2 text-xs font-bold text-stone-700">4.9 / 5 (1200+ {isAr ? "تقييم" : "avis"})</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-500" />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-stone-700 sm:text-sm">
                {isAr
                  ? "«القماش خيالي وفخم جداً، وصلني الطلب في وهران خلال يومين فقط مع إمكانية المعاينة. تجربة تسوق راقية بكل المقاييس.»"
                  : "« Qualité de tissu exceptionnelle et coupe parfaite. Commande reçue en 48h à Oran. Une vraie marque haut de gamme. »"}
              </p>
              <div className="mt-4 flex items-center gap-3 border-t border-stone-100 pt-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-800 text-xs">
                  S
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Samah B.</p>
                  <p className="text-[10px] text-stone-500">{isAr ? "وهران • زبون موثق" : "Oran • Achat vérifié"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-500" />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-stone-700 sm:text-sm">
                {isAr
                  ? "«تيشرت Old Money وبنطلون الكتان أروع من الصور! المقاسات مضبوطة بدقة والتعامل مع خدمة الزبائن احترافي وسريع.»"
                  : "« Le polo Old Money et le pantalon en lin sont sublimes ! Tailles parfaites et service client d'un grand professionnalisme. »"}
              </p>
              <div className="mt-4 flex items-center gap-3 border-t border-stone-100 pt-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 font-bold text-stone-800 text-xs">
                  I
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Ilyas B.</p>
                  <p className="text-[10px] text-stone-500">{isAr ? "الجزائر العاصمة • زبون موثق" : "Alger • Achat vérifié"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-500" />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-stone-700 sm:text-sm">
                {isAr
                  ? "«فستان Rope أنيق جداً وخفيف وناعم على البشرة. طلبت قطعتين واستفدت من العرض الخاص، أنصح بالتعامل معهم دائماً.»"
                  : "« Robe Rope d'une élégance rare, tissu fluide et agréable. Les packs promo sont très avantageux. Je recommande vivement ! »"}
              </p>
              <div className="mt-4 flex items-center gap-3 border-t border-stone-100 pt-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-800 text-xs">
                  N
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Nour E.</p>
                  <p className="text-[10px] text-stone-500">{isAr ? "قسنطينة • زبون موثق" : "Constantine • Achat vérifié"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VIP Club / Newsletter Invitation */}
      <section className="border-t border-stone-200 bg-stone-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            <Sparkles size={13} />
            {isAr ? "نادي فيلورا الحصري" : "LE CLUB PRIVÉ VELORA"}
          </span>
          <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl md:text-5xl">
            {isAr ? "انضموا إلى عائلة فيلورا" : "Rejoignez le Cercle Velora"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xs leading-relaxed text-stone-400 sm:text-sm sm:leading-7">
            {isAr
              ? "كونوا أول من يكتشف التشكيلات الحصرية الجديدة والعروض الخاصة الموجهة لأعضاء الدار."
              : "Soyez les premiers informés des nouvelles sorties, des éditions limitées et des privilèges exclusifs."}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (emailInput.trim()) {
                setEmailSubscribed(true);
              }
            }}
            className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row"
          >
            {emailSubscribed ? (
              <div className="w-full rounded-full bg-emerald-950/80 border border-emerald-500/40 p-3 text-xs font-semibold text-emerald-300">
                {isAr ? "شكراً لانضمامكم! تم تسجيل بريدكم بنجاح." : "Merci ! Vous êtes bien inscrit(e)."}
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  placeholder={isAr ? "أدخل بريدك الإلكتروني..." : "Votre adresse email..."}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full rounded-full border border-stone-700 bg-stone-900/90 px-5 py-3.5 text-xs text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="rounded-full bg-white px-7 py-3.5 text-xs font-bold text-stone-950 transition hover:bg-stone-200 active:scale-95 shrink-0"
                >
                  {isAr ? "انضمام" : "Rejoindre"}
                </button>
              </>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
