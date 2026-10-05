"use client";

import { useState, type FormEvent } from "react";
import { Clock, Phone, ShoppingBag } from "lucide-react";
import type { AbandonedCheckout, AbandonedCheckoutItem, Order, OrderItem, OrderStatus } from "@/types";
import { isUndeliveredOrder } from "@/lib/orders/abandoned";
import { useLocale } from "@/providers/locale-provider";
import { formatPrice, orderReference, timeAgo, uid, isAlgerianPhone } from "@/lib/utils";
import { useCatalogStore } from "@/stores/catalog-store";
import { useSettingsStore } from "@/stores/settings-store";
import { ALGERIA_WILAYAS } from "@/lib/algeria-data";
import { toast } from "@/components/ui/toast";

interface AdminAbandonedCheckoutsProps {
  drafts: AbandonedCheckout[];
  orders: Order[];
}

const ORDER_STATUS_LABELS: Record<OrderStatus, { ar: string; fr: string }> = {
  pending: { ar: "جديد", fr: "Nouveau" },
  pending_confirmation: { ar: "قيد التأكيد", fr: "En confirmation" },
  confirmed: { ar: "مؤكد", fr: "Confirmé" },
  customer_confirmed: { ar: "مؤكد من العميل", fr: "Confirmé par le client" },
  processing: { ar: "قيد المعالجة", fr: "En préparation" },
  no_answer: { ar: "لم يرد", fr: "Ne répond pas" },
  postponed: { ar: "مؤجل", fr: "Reporté" },
  busy: { ar: "الخط مشغول", fr: "Ligne occupée" },
  waiting_customer: { ar: "بانتظار العميل", fr: "En attente du client" },
  shipped: { ar: "قيد التوصيل", fr: "Expédié" },
  delivered: { ar: "تم التسليم", fr: "Livré" },
  cancelled: { ar: "ملغى", fr: "Annulé" },
  customer_cancelled: { ar: "ملغى من العميل", fr: "Annulé par le client" },
  fake: { ar: "مزيف", fr: "Faux" },
  duplicate: { ar: "مكرر", fr: "Doublon" },
  returned: { ar: "مرجع", fr: "Retourné" },
};

export function AdminAbandonedCheckouts({ drafts, orders }: AdminAbandonedCheckoutsProps) {
  const { locale } = useLocale();
  const undeliveredOrders = orders.filter((order) => isUndeliveredOrder(order.status));
  const products = useCatalogStore((state) => state.products);
  const convertAbandonedCheckout = useCatalogStore((state) => state.convertAbandonedCheckout);
  const getShippingFee = useSettingsStore((state) => state.getShippingFee);
  const freeShippingThreshold = useSettingsStore((state) => state.settings.freeShippingThreshold);
  const [conversionDraft, setConversionDraft] = useState<AbandonedCheckout | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState<"home" | "desk">("home");
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);
  const [converting, setConverting] = useState(false);

  function getDraftItems(draft: AbandonedCheckout): AbandonedCheckoutItem[] {
    if (draft.items?.length) return draft.items;
    if (draft.productId === "cart") return [];
    const product = products.find((candidate) => candidate.id === draft.productId);
    if (!product) return [];
    const variant = product.variants.find(
      (candidate) =>
        candidate.size === draft.size &&
        (candidate.color.ar === draft.color || candidate.color.fr === draft.color),
    );
    return [{
      productId: product.id,
      variantId: variant?.id ?? "",
      name: product.name,
      size: draft.size,
      color: variant?.color ?? { ar: draft.color, fr: draft.color },
      image: product.images[0]?.url ?? "",
      unitPrice: product.price,
      quantity: draft.quantity,
      sku: variant?.sku,
    }];
  }

  function canConvertDraft(draft: AbandonedCheckout) {
    const items = getDraftItems(draft);
    return items.length > 0 && items.every((item) =>
      (products.find((product) => product.id === item.productId)?.variants.length ?? 0) > 0,
    );
  }

  function beginConversion(draft: AbandonedCheckout) {
    const items = getDraftItems(draft);
    const contactWilaya = draft.contactConsent ? draft.wilaya ?? "" : "";
    const normalizedWilaya = ALGERIA_WILAYAS.find((item) =>
      [item.nameAr, item.nameFr, item.code].some((name) => contactWilaya === name),
    )?.nameAr ?? contactWilaya;
    setConversionDraft(draft);
    setCustomerName(draft.contactConsent ? draft.customerName ?? "" : "");
    setPhone(draft.contactConsent ? draft.phone ?? "" : "");
    setWilaya(normalizedWilaya);
    setCommune(draft.contactConsent ? draft.commune ?? "" : "");
    setAddress("");
    setDeliveryType("home");
    setSelectedVariantIds(items.map((item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      const match = product?.variants.find((variant) =>
        variant.id === item.variantId ||
        (variant.size === item.size &&
          (variant.color.ar === item.color.ar || variant.color.fr === item.color.fr)),
      );
      return match?.id ?? product?.variants[0]?.id ?? "";
    }));
  }

  async function submitConversion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!conversionDraft) return;
    const draftItems = getDraftItems(conversionDraft);
    const orderItems: OrderItem[] = [];
    for (const [index, draftItem] of draftItems.entries()) {
      const product = products.find((candidate) => candidate.id === draftItem.productId);
      const variant = product?.variants.find(
        (candidate) => candidate.id === selectedVariantIds[index],
      );
      if (!product || !variant) {
        toast(locale === "ar" ? "تعذر العثور على أحد المنتجات أو متغيراته." : "Un produit ou une variante est introuvable.");
        return;
      }
      orderItems.push({
        id: uid("oi"),
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        size: variant.size,
        color: variant.color,
        image: product.images[0]?.url ?? draftItem.image,
        unitPrice: draftItem.unitPrice,
        quantity: draftItem.quantity,
        sku: variant.sku,
      });
    }
    if (!orderItems.length) {
      toast(locale === "ar" ? "هذه المسودة لا تحتوي على تفاصيل منتجات كافية لإنشاء طلب." : "Cette fiche ne contient pas assez de détails produit.");
      return;
    }
    if (!customerName.trim() || !isAlgerianPhone(phone) || !wilaya || !commune.trim() || !address.trim()) {
      toast(locale === "ar" ? "أكمل اسم العميل ورقم هاتف صحيحًا والولاية والبلدية والعنوان." : "Renseignez le client, un téléphone valide et l’adresse complète.");
      return;
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const shipping = subtotal >= freeShippingThreshold ? 0 : getShippingFee(wilaya, deliveryType);
    const order: Order = {
      id: uid("ord"),
      reference: orderReference(),
      customerName: customerName.trim(),
      phone: phone.trim(),
      wilaya,
      commune: commune.trim(),
      address: `${address.trim()}${deliveryType === "desk" ? " (استلام من المكتب)" : " (توصيل للمنزل)"}`,
      status: "pending",
      paymentMethod: "cod",
      subtotal,
      shipping,
      total: subtotal + shipping,
      isStopdesk: deliveryType === "desk",
      createdAt: new Date().toISOString(),
      items: orderItems,
    };

    setConverting(true);
    try {
      await convertAbandonedCheckout(conversionDraft, order);
      setConversionDraft(null);
      toast(locale === "ar" ? "تم إنشاء الطلب العادي وتحديث المخزون." : "Commande créée et stock mis à jour.");
    } catch (error) {
      console.error("Failed to convert abandoned checkout", error);
      toast(
        error instanceof Error && error.message.includes("OUT_OF_STOCK")
          ? locale === "ar" ? "المخزون غير كافٍ لهذا المتغير." : "Stock insuffisant pour cette variante."
          : locale === "ar" ? "تعذر إنشاء الطلب. تحقق من الاتصال بقاعدة البيانات." : "Impossible de créer la commande.",
      );
    } finally {
      setConverting(false);
    }
  }

  return (
    <div className="min-w-0 space-y-6" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div>
        <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
          {locale === "ar" ? "الطلبات المتروكة" : "Commandes abandonnées"}
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          {locale === "ar"
            ? "المسودات غير المؤكدة منفصلة عن الطلبات التي سُجلت وتنتظر التسليم."
            : "Les formulaires non confirmés sont séparés des commandes en attente de livraison."}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300">
          <Clock size={16} />
          {locale === "ar" ? `بدأ تعبئة الطلب ولم يؤكده (${drafts.length})` : `Formulaire commencé, non confirmé (${drafts.length})`}
        </h2>
        {drafts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 p-5 text-sm text-zinc-500 dark:border-zinc-700">
            {locale === "ar" ? "لا توجد مسودات طلبات حالياً." : "Aucun formulaire abandonné."}
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {drafts.map((draft) => (
              <article key={draft.sessionId} className="rounded-xl border border-amber-200 bg-white p-4 dark:border-amber-900 dark:bg-zinc-900">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{draft.productName}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {[draft.size, draft.color].filter(Boolean).join(" · ") || (locale === "ar" ? "دون خيارات محددة" : "Sans option")}
                      {" · "}{locale === "ar" ? `الكمية ${draft.quantity}` : `Qté ${draft.quantity}`}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-amber-700 dark:text-amber-300">{formatPrice(draft.value, locale)}</span>
                </div>
                {draft.contactConsent && (
                  <div className="mt-3 space-y-1 border-t border-zinc-100 pt-3 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
                    {draft.customerName && <p>{draft.customerName}</p>}
                    {draft.phone && <a className="flex items-center gap-1.5" href={`tel:${draft.phone}`}><Phone size={13} />{draft.phone}</a>}
                    {(draft.wilaya || draft.commune) && <p>{[draft.commune, draft.wilaya].filter(Boolean).join("، ")}</p>}
                  </div>
                )}
                <p className="mt-3 text-[11px] text-zinc-400">{timeAgo(draft.createdAt, locale)}</p>
                <button
                  type="button"
                  disabled={!canConvertDraft(draft)}
                  onClick={() => beginConversion(draft)}
                  className="mt-3 rounded-lg bg-amber-700 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {locale === "ar" ? "استكمال وإنشاء طلب عادي" : "Compléter et créer la commande"}
                </button>
                {!canConvertDraft(draft) && (
                  <p className="mt-2 text-[11px] text-amber-800 dark:text-amber-300">
                    {locale === "ar" ? "تفاصيل المنتجات غير متاحة لهذه المسودة، لذلك لا يمكن إنشاء طلب آمن منها." : "Les détails produit sont indisponibles pour cette fiche."}
                  </p>
                )}
                {conversionDraft?.sessionId === draft.sessionId && (
                  <form onSubmit={(event) => void submitConversion(event)} className="mt-4 space-y-3 border-t border-amber-200 pt-4 dark:border-amber-900" dir={locale === "ar" ? "rtl" : "ltr"}>
                    <p className="text-xs font-bold text-amber-950 dark:text-amber-200">
                      {locale === "ar" ? "استكمل البيانات الناقصة يدويًا؛ لن ننشئ معلومات اتصال غير موجودة." : "Complétez manuellement les coordonnées manquantes."}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input required aria-label={locale === "ar" ? "اسم العميل" : "Nom"} placeholder={locale === "ar" ? "اسم العميل" : "Nom du client"} value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
                      <input required aria-label={locale === "ar" ? "الهاتف" : "Téléphone"} placeholder={locale === "ar" ? "رقم الهاتف" : "Téléphone"} value={phone} onChange={(event) => setPhone(event.target.value)} dir="ltr" className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
                      <select required value={wilaya} onChange={(event) => { setWilaya(event.target.value); setCommune(""); }} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                        <option value="">{locale === "ar" ? "اختر الولاية" : "Choisir la wilaya"}</option>
                        {ALGERIA_WILAYAS.map((item) => <option key={item.code} value={item.nameAr}>{locale === "ar" ? item.nameAr : item.nameFr}</option>)}
                      </select>
                      {ALGERIA_WILAYAS.find((item) => item.nameAr === wilaya)?.communes.length ? (
                        <select required value={commune} onChange={(event) => setCommune(event.target.value)} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                          <option value="">{locale === "ar" ? "اختر البلدية" : "Choisir la commune"}</option>
                          {!ALGERIA_WILAYAS.find((item) => item.nameAr === wilaya)?.communes.includes(commune) && commune && <option value={commune}>{commune}</option>}
                          {ALGERIA_WILAYAS.find((item) => item.nameAr === wilaya)?.communes.map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                      ) : <input required placeholder={locale === "ar" ? "البلدية" : "Commune"} value={commune} onChange={(event) => setCommune(event.target.value)} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />}
                      <input required placeholder={locale === "ar" ? "العنوان أو مكتب الاستلام" : "Adresse ou point relais"} value={address} onChange={(event) => setAddress(event.target.value)} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white sm:col-span-2" />
                      <select value={deliveryType} onChange={(event) => setDeliveryType(event.target.value as "home" | "desk")} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white sm:col-span-2">
                        <option value="home">{locale === "ar" ? "توصيل للمنزل" : "Livraison à domicile"}</option>
                        <option value="desk">{locale === "ar" ? "استلام من المكتب" : "Retrait en bureau"}</option>
                      </select>
                    </div>
                    {getDraftItems(draft).map((draftItem, index) => {
                      const product = products.find((candidate) => candidate.id === draftItem.productId);
                      return (
                        <label key={`${draftItem.productId}-${index}`} className="block space-y-1 text-xs font-semibold">
                          <span>{draftItem.name[locale] || draftItem.name.ar} — {locale === "ar" ? "المقاس واللون" : "Taille et couleur"}</span>
                          <select required value={selectedVariantIds[index] ?? ""} onChange={(event) => setSelectedVariantIds((current) => current.map((id, itemIndex) => itemIndex === index ? event.target.value : id))} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                            {(product?.variants ?? []).map((variant) => <option key={variant.id} value={variant.id}>{variant.size} · {variant.color[locale] || variant.color.ar} ({locale === "ar" ? `المخزون ${variant.stock}` : `Stock ${variant.stock}`})</option>)}
                          </select>
                        </label>
                      );
                    })}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold">{locale === "ar" ? "قيمة المنتجات + التوصيل" : "Articles + livraison"}</span>
                      {(() => {
                        const itemsTotal = getDraftItems(draft).reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
                        const shipping = itemsTotal >= freeShippingThreshold ? 0 : getShippingFee(wilaya, deliveryType);
                        return <span className="text-sm font-bold">{formatPrice(itemsTotal + shipping, locale)}</span>;
                      })()}
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" disabled={converting} className="rounded-lg bg-amber-700 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{converting ? (locale === "ar" ? "جارٍ الإنشاء..." : "Création...") : (locale === "ar" ? "إنشاء الطلب وخصم المخزون" : "Créer la commande et réserver le stock")}</button>
                      <button type="button" disabled={converting} onClick={() => setConversionDraft(null)} className="rounded-lg border border-zinc-300 px-4 py-2 text-xs font-bold text-zinc-700 dark:border-zinc-700 dark:text-zinc-200">{locale === "ar" ? "إلغاء" : "Annuler"}</button>
                    </div>
                  </form>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-bold text-blue-800 dark:text-blue-300">
          <ShoppingBag size={16} />
          {locale === "ar" ? `طلبات حقيقية لم تُسلّم بعد (${undeliveredOrders.length})` : `Commandes réelles non livrées (${undeliveredOrders.length})`}
        </h2>
        {undeliveredOrders.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 p-5 text-sm text-zinc-500 dark:border-zinc-700">
            {locale === "ar" ? "لا توجد طلبات بانتظار التسليم." : "Aucune commande en attente de livraison."}
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {undeliveredOrders.map((order) => (
              <article key={order.id} className="rounded-xl border border-blue-200 bg-white p-4 dark:border-blue-900 dark:bg-zinc-900">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{order.customerName}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {order.reference} · {ORDER_STATUS_LABELS[order.status][locale]}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-blue-700 dark:text-blue-300">{formatPrice(order.total, locale)}</span>
                </div>
                <a href={`tel:${order.phone}`} className="mt-3 flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <Phone size={13} /> {order.phone}
                </a>
                <p className="mt-1 text-xs text-zinc-500">{[order.commune, order.wilaya].filter(Boolean).join("، ")}</p>
                <p className="mt-3 text-[11px] text-zinc-400">{timeAgo(order.createdAt, locale)}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
