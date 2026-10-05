"use client";

import { useState, useMemo, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { User, Home, Truck, ShieldCheck, Tag, Building2 } from "lucide-react";
import type { Product, ProductOffer, Order } from "@/types";
import { useLocale } from "@/providers/locale-provider";
import { ALGERIA_WILAYAS, getCommunesForWilaya } from "@/lib/algeria-data";
import { formatPrice, isAlgerianPhone, orderReference, uid } from "@/lib/utils";
import { useCatalogStore } from "@/stores/catalog-store";
import { useSettingsStore } from "@/stores/settings-store";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { useAbandonedCheckout } from "@/lib/orders/use-abandoned-checkout";
import { placeOrder as placeOrderDb } from "@/lib/supabase/data";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/configured";
import { trackPurchaseEvent } from "@/components/analytics/analytics-scripts";

interface QuickOrderFormProps {
  product: Product;
  selectedSize: string;
  selectedColorHex?: string;
  onSizeChange?: (size: string) => void;
  onColorChange?: (colorHex: string) => void;
}

export function QuickOrderForm({
  product,
  selectedSize,
  selectedColorHex,
  onSizeChange,
  onColorChange,
}: QuickOrderFormProps) {
  const { locale } = useLocale();
  const router = useRouter();
  const addOrder = useCatalogStore((s) => s.addOrder);
  const setVariantStock = useCatalogStore((s) => s.setVariantStock);

  // Offers configuration: use product.offers or fallback to standard packs
  const offers: ProductOffer[] = useMemo(() => {
    if (product.offers && product.offers.length > 0) {
      return product.offers;
    }
    return [
      {
        id: "pack_1",
        quantity: 1,
        title: {
          ar: `قطعة واحدة (${product.name.ar || product.name.fr})`,
          fr: `1 pièce (${product.name.fr})`,
        },
        price: product.price,
        originalPrice: product.compareAtPrice || Math.round(product.price * 1.3),
      },
      {
        id: "pack_2",
        quantity: 2,
        title: {
          ar: `2 قطع (${product.name.ar || product.name.fr})`,
          fr: `Pack 2 pièces`,
        },
        price: Math.round(product.price * 1.8),
        originalPrice: (product.compareAtPrice || product.price) * 2,
        badge: { ar: "الأكثر طلباً 🔥", fr: "Populaire 🔥" },
      },
      {
        id: "pack_3",
        quantity: 3,
        title: {
          ar: `عرض 3 قطع - توفير إضافي`,
          fr: `Pack 3 pièces`,
        },
        price: Math.round(product.price * 2.5),
        originalPrice: (product.compareAtPrice || product.price) * 3,
        badge: { ar: "عرض التوفير 💰", fr: "Économique 💰" },
      },
    ];
  }, [product]);

  const [selectedOfferId, setSelectedOfferId] = useState<string>(offers[0]?.id || "pack_1");
  const selectedOffer = offers.find((o) => o.id === selectedOfferId) || offers[0];

  // Customer form inputs (WITHOUT EMAIL!)
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState(ALGERIA_WILAYAS[15]?.nameAr || "16 - الجزائر");
  const [commune, setCommune] = useState("");
  const [address, setAddress] = useState("");
  const [contactConsent, setContactConsent] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"home" | "desk">("home");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getShippingFee = useSettingsStore((s) => s.getShippingFee);
  const storefront = useSettingsStore((s) => s.settings.storefront);
  const refreshSharedSettings = useSettingsStore((s) => s.refreshSharedSettings);
  const shippingFee = useMemo(() => getShippingFee(wilaya, deliveryType), [getShippingFee, wilaya, deliveryType]);

  useEffect(() => {
    void refreshSharedSettings().catch((error) => console.error("Failed to load product form settings", error));
  }, [refreshSharedSettings]);

  // Dynamic communes list based on selected wilaya
  const communes = useMemo(() => getCommunesForWilaya(wilaya), [wilaya]);

  const currentPrice = selectedOffer ? selectedOffer.price : product.price;
  const selectedVariant = product.variants.find(
    (variant) =>
      variant.size === selectedSize &&
      (!selectedColorHex || variant.colorHex.toLowerCase() === selectedColorHex.toLowerCase()),
  );
  const abandonedCheckout = useAbandonedCheckout({
    productId: product.id,
    productName: product.name[locale] || product.name.ar || product.name.fr,
    size: selectedSize,
    color: selectedVariant?.color[locale] || selectedVariant?.color.ar || "",
    quantity: selectedOffer?.quantity ?? 1,
    value: currentPrice + shippingFee,
    contactConsent,
    customerName,
    phone,
    wilaya,
    commune,
    items: selectedVariant
      ? [{
          productId: product.id,
          variantId: selectedVariant.id,
          name: product.name,
          size: selectedVariant.size,
          color: selectedVariant.color,
          image: product.images[0]?.url ?? "",
          unitPrice: Math.round(currentPrice / (selectedOffer?.quantity ?? 1)),
          quantity: selectedOffer?.quantity ?? 1,
          sku: selectedVariant.sku,
        }]
      : [],
  });

  function validate() {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) {
      errs.name = locale === "ar" ? "يرجى كتابة الاسم الكامل" : "Veuillez entrer votre nom";
    }
    if (!phone.trim()) {
      errs.phone = locale === "ar" ? "يرجى كتابة رقم الهاتف" : "Veuillez entrer votre numéro de téléphone";
    } else if (!isAlgerianPhone(phone)) {
      errs.phone = locale === "ar" ? "رقم الهاتف غير صحيح (مثال: 0550000000)" : "Numéro de téléphone invalide";
    }
    if (!wilaya) {
      errs.wilaya = locale === "ar" ? "يرجى اختيار الولاية" : "Veuillez sélectionner votre wilaya";
    }
    if (!commune.trim()) {
      errs.commune = locale === "ar" ? "يرجى اختيار أو كتابة البلدية" : "Veuillez indiquer la commune";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);

    try {
      const draftSessionId = await abandonedCheckout.saveBeforeSubmit().catch((error) => {
        console.error("Failed to save checkout draft before order placement", error);
        return null;
      });
      const qty = selectedOffer ? selectedOffer.quantity : 1;
      const activeVariant = product.variants.find(
        (variant) =>
          variant.size === selectedSize &&
          (!selectedColorHex ||
            variant.colorHex.toLowerCase() === selectedColorHex.toLowerCase()),
      );
      if (!activeVariant || activeVariant.stock < qty) {
        toast(
          locale === "ar"
            ? "الكمية المطلوبة غير متوفرة لهذا المقاس واللون."
            : "Cette combinaison taille/couleur n'est pas disponible en quantité suffisante.",
        );
        setSubmitting(false);
        return;
      }

      const ref = orderReference();

      const newOrder: Order = {
        id: uid("ord"),
        reference: ref,
        customerName: customerName.trim(),
        phone: phone.trim(),
        wilaya: wilaya,
        commune: commune.trim(),
        address: (storefront.productForm.showAddress ? address.trim() || "توصيل للعنوان" : "بدون عنوان إضافي") + (deliveryType === "desk" ? " (استلام من المكتب)" : " (توصيل للمنزل)"),
        status: "pending",
        paymentMethod: "cod",
        subtotal: currentPrice,
        shipping: shippingFee,
        total: currentPrice + shippingFee,
        offerTitle: selectedOffer ? (selectedOffer.title[locale] || selectedOffer.title.ar) : undefined,
        createdAt: new Date().toISOString(),
        items: [
          {
            id: uid("oi"),
            productId: product.id,
            variantId: activeVariant?.id || uid("var"),
            name: product.name,
            size: selectedSize || activeVariant?.size || "M",
            color: activeVariant?.color || product.colors[0]?.name || { ar: "أساسي", fr: "Standard" },
            image: product.images[0]?.url || "",
            unitPrice: currentPrice,
            quantity: qty,
            sku: activeVariant?.sku || product.sku,
          },
        ],
      };

      if (isSupabaseConfigured()) {
        newOrder.reference = await placeOrderDb(createClient()!, newOrder, draftSessionId ?? undefined);
        await useCatalogStore.getState().refresh();
      } else if (activeVariant) {
        await setVariantStock(product.id, activeVariant.id, Math.max(0, activeVariant.stock - qty));
      }

      addOrder(newOrder);
      trackPurchaseEvent({
        orderId: newOrder.reference,
        total: newOrder.total,
        currency: "DZD",
        items: newOrder.items.map((item) => ({
          productId: item.productId,
          name: item.name.fr || item.name.ar,
          price: item.unitPrice,
          quantity: item.quantity,
        })),
      });
      if (draftSessionId && !isSupabaseConfigured()) {
        await abandonedCheckout.markCompleted(newOrder.reference).catch((error) => {
          console.error("Failed to mark checkout draft as converted", error);
        });
      }
      toast(locale === "ar" ? "تم تسجيل طلبك بنجاح! سنتصل بك لتأكيده." : "Commande enregistrée avec succès !");
      router.push(`/${locale}/checkout/success?ref=${ref}`);
    } catch {
      toast(locale === "ar" ? "حدث خطأ أثناء إرسال الطلب، أعد المحاولة." : "Erreur lors de la validation");
      setSubmitting(false);
    }
  }

  return (
    <div className="product-order-form min-w-0 rounded-xl border-2 border-emerald-500/30 bg-white p-3 shadow-xl sm:p-5 md:p-7 dark:bg-zinc-900">
      {/* Top Banner Notice */}
      <div className="mb-5 flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
        <span className="flex items-center gap-1.5">
          <Truck size={16} className="text-emerald-600" />
          {locale === "ar" ? "الدفع عند الاستلام والتوصيل متوفر لجميع الولايات" : "Paiement à la livraison partout en Algérie"}
        </span>
        <span className="flex items-center gap-1">
          <ShieldCheck size={16} className="text-emerald-600" />
          {locale === "ar" ? "ضمان الاستبدال" : "Garantie"}
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        onFocusCapture={abandonedCheckout.startTracking}
        onClickCapture={abandonedCheckout.startTracking}
        className="space-y-5"
      >
        <p className="text-xs leading-5 text-zinc-600 dark:text-zinc-300">{storefront.productForm.intro[locale]}</p>
        {/* Customer Information Section */}
        <div className="space-y-3">
          <label className="flex items-start gap-2 rounded-lg border border-zinc-200 p-3 text-[11px] leading-5 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={contactConsent}
              onChange={(event) => setContactConsent(event.target.checked)}
              className="mt-1"
            />
            <span>
              {locale === "ar"
                ? "أوافق اختيارياً على حفظ بيانات الاتصال التي أدخلها لاسترجاع الطلب غير المؤكد. لن تُرسل هذه البيانات إلى منصات الإعلانات."
                : "J'accepte facultativement la sauvegarde de mes coordonnées pour retrouver ma commande non confirmée. Elles ne seront pas transmises aux plateformes publicitaires."}
            </span>
          </label>
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            <User size={16} className="text-emerald-600" />
            {locale === "ar" ? "معلومات الزبون" : "Vos coordonnées"}
          </h3>

          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {locale === "ar" ? "الاسم الكامل *" : "Nom complet *"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  placeholder={locale === "ar" ? "الاسم واللقب" : "Nom et prénom"}
                  className={cn(
                    "form-control w-full rounded-lg border px-3.5 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500",
                    errors.name ? "border-red-500 ring-1 ring-red-500" : "border-zinc-300 dark:border-zinc-300"
                  )}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {locale === "ar" ? "رقم الهاتف *" : "Numéro de téléphone *"}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: "" });
                  }}
                  placeholder={locale === "ar" ? "05 / 06 / 07 ..." : "0550 00 00 00"}
                  dir="ltr"
                  className={cn(
                    "form-control w-full rounded-lg border px-3.5 py-2.5 text-sm text-right transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500",
                    errors.phone ? "border-red-500 ring-1 ring-red-500" : "border-zinc-300 dark:border-zinc-300"
                  )}
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Wilaya Dropdown */}
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {locale === "ar" ? "الولاية *" : "Wilaya *"}
              </label>
              <select
                value={wilaya}
                onChange={(e) => {
                  setWilaya(e.target.value);
                  setCommune("");
                  if (errors.wilaya) setErrors({ ...errors, wilaya: "" });
                }}
                className={cn(
                  "public-select form-control w-full rounded-lg border px-3.5 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500",
                  errors.wilaya ? "border-red-500" : "border-zinc-300 dark:border-zinc-300"
                )}
              >
                {ALGERIA_WILAYAS.map((w) => (
                  <option key={w.code} value={locale === "ar" ? w.nameAr : w.nameFr} className="bg-white text-zinc-900">
                    {locale === "ar" ? w.nameAr : w.nameFr}
                  </option>
                ))}
              </select>
              {errors.wilaya && <p className="mt-1 text-xs text-red-500">{errors.wilaya}</p>}
            </div>

            {/* Commune Selection / Input */}
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {locale === "ar" ? "البلدية *" : "Commune *"}
              </label>
              {communes.length > 0 ? (
                <div className="flex gap-2">
                  <select
                    value={communes.includes(commune) ? commune : ""}
                    onChange={(e) => {
                      setCommune(e.target.value);
                      if (errors.commune) setErrors({ ...errors, commune: "" });
                    }}
                    className={cn(
                      "public-select form-control w-full rounded-lg border px-3 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500",
                      errors.commune ? "border-red-500" : "border-zinc-300 dark:border-zinc-300"
                    )}
                  >
                    <option value="" className="bg-white text-zinc-900">{locale === "ar" ? "اختر البلدية..." : "Choisir la commune..."}</option>
                    {communes.map((c) => (
                      <option key={c} value={c} className="bg-white text-zinc-900">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <input
                  type="text"
                  required
                  value={commune}
                  onChange={(e) => {
                    setCommune(e.target.value);
                    if (errors.commune) setErrors({ ...errors, commune: "" });
                  }}
                  placeholder={locale === "ar" ? "اكتب البلدية" : "Entrez votre commune"}
                  className={cn(
                    "form-control w-full rounded-lg border px-3.5 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500",
                    errors.commune ? "border-red-500" : "border-zinc-300 dark:border-zinc-300"
                  )}
                />
              )}
              {errors.commune && <p className="mt-1 text-xs text-red-500">{errors.commune}</p>}
            </div>
          </div>

          {/* Delivery Type Option (Home vs Stop Desk) */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {locale === "ar" ? "طريقة التوصيل:" : "Mode de livraison :"}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setDeliveryType("home")}
                className={cn(
                  "flex items-center justify-between rounded-xl border-2 p-2.5 text-xs font-bold transition",
                  deliveryType === "home"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200"
                    : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Home size={14} className="text-emerald-600" />
                  {locale === "ar" ? "إلى باب المنزل" : "À domicile"}
                </span>
                <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400">
                  {formatPrice(getShippingFee(wilaya, "home"), locale)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType("desk")}
                className={cn(
                  "flex items-center justify-between rounded-xl border-2 p-2.5 text-xs font-bold transition",
                  deliveryType === "desk"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200"
                    : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Building2 size={14} className="text-purple-600" />
                  {locale === "ar" ? "استلام من المكتب" : "Stop Desk"}
                </span>
                <span className="text-[11px] font-extrabold text-purple-700 dark:text-purple-400">
                  {formatPrice(getShippingFee(wilaya, "desk"), locale)}
                </span>
              </button>
            </div>
          </div>

          {/* Address */}
          {storefront.productForm.showAddress && <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              {deliveryType === "home"
                ? (locale === "ar" ? "العنوان أو الحي بالتفصيل" : "Adresse de livraison (Rue, Quartier)")
                : (locale === "ar" ? "اسم أو موقع مكتب الاستلام المفضل" : "Bureau Stop Desk préféré")}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={
                deliveryType === "home"
                  ? (locale === "ar" ? "الحي، الشارع، أو علامة مميزة" : "Rue, quartier, etc.")
                  : (locale === "ar" ? "مثال: مكتب ياليدين أو برو كوليس في وسط المدينة" : "Ex: Bureau Yalidine centre-ville")
              }
              className="form-control w-full rounded-lg border px-3.5 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>}
        </div>

        {/* Offers / Packs Selection Section */}
        {offers.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                <Tag size={16} className="text-emerald-600" />
                {locale === "ar" ? "اختر العرض المناسب" : "Choisissez une offre"}
              </h3>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                {locale === "ar" ? "خصم خاص على الكميات" : "Remise sur quantité"}
              </span>
            </div>

            <div className="grid gap-2.5">
              {offers.map((offer) => {
                const isSelected = selectedOfferId === offer.id;
                return (
                  <label
                    key={offer.id}
                    onClick={() => setSelectedOfferId(offer.id)}
                    className={cn(
                      "relative flex cursor-pointer items-center justify-between rounded-xl border-2 p-3.5 transition-all",
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/60 shadow-sm dark:border-emerald-500 dark:bg-emerald-950/30"
                        : "border-zinc-200 bg-zinc-50/50 hover:border-zinc-300 hover:bg-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {/* Custom Radio Circle */}
                      <div
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border-2 transition",
                          isSelected
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-800"
                        )}
                      >
                        {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">
                            {offer.title[locale] || offer.title.ar}
                          </span>
                          {offer.badge && (
                            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                              {offer.badge[locale] || offer.badge.ar}
                            </span>
                          )}
                        </div>
                        {offer.originalPrice && offer.originalPrice > offer.price && (
                          <span className="text-xs text-zinc-400 line-through">
                            {formatPrice(offer.originalPrice, locale)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-serif text-lg font-bold text-emerald-700 dark:text-emerald-400">
                        {formatPrice(offer.price, locale)}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Variants (Size & Color) if available */}
        {(product.sizes.length > 1 || product.colors.length > 1) && (
          <div className="space-y-3 rounded-lg bg-zinc-50 p-3.5 dark:bg-zinc-800/50">
            {/* Sizes */}
            {product.sizes.length > 1 && (
              <div>
                <p className="mb-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {locale === "ar" ? "المقاس المطلوب:" : "Taille :"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onSizeChange?.(s)}
                      className={cn(
                        "min-w-10 rounded-md border px-3 py-1.5 text-xs font-semibold transition",
                        selectedSize === s
                          ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                          : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors.length > 1 && (
              <div>
                <p className="mb-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {locale === "ar" ? "اللون المفضل:" : "Couleur :"}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {product.colors.map((c) => {
                    const isSelected = selectedColorHex?.toLowerCase() === c.hex.toLowerCase();
                    return (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => onColorChange?.(c.hex)}
                        title={c.name[locale]}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition",
                          isSelected
                            ? "border-emerald-600 ring-2 ring-emerald-500/30"
                            : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700"
                        )}
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name[locale]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Big Green Buy Now Button */}
        <button
          type="submit"
          disabled={submitting}
          className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 py-4 text-base font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:from-emerald-500 hover:to-green-500 hover:shadow-xl active:scale-[0.99] disabled:opacity-70"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {locale === "ar" ? "جاري تسجيل طلبك..." : "Validation en cours..."}
            </span>
          ) : (
            <span className="flex items-center gap-2 tracking-wide">
              <span>{locale === "ar" ? "اشتري الآن" : "Acheter maintenant"}</span>
              <span className="rounded-md bg-white/20 px-2 py-0.5 text-sm font-extrabold">
                {formatPrice(currentPrice, locale)}
              </span>
            </span>
          )}
        </button>

        <p className="text-center text-[11px] text-zinc-500 dark:text-zinc-400">
          {locale === "ar"
            ? "🔒 طلب سريع ومضمون بدون بطاقة بنكية. ادفع نقداً عند استلام طلبك ومعاينته."
            : "🔒 Commande rapide sans carte bancaire. Payez en espèces à la livraison."}
        </p>
      </form>
    </div>
  );
}
