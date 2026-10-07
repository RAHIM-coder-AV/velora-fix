"use client";

import { useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import {
  Clock,
  Phone,
  ShoppingBag,
  ShoppingCart,
  Package,
  Search,
  Copy,
  Check,
  Trash2,
  Printer,
  Download,
  CheckCircle2,
  X,
  User,
  MapPin,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import type {
  AbandonedCheckout,
  AbandonedCheckoutItem,
  Order,
  OrderItem,
  OrderStatus,
  Product,
} from "@/types";
import { isUndeliveredOrder } from "@/lib/orders/abandoned";
import { useLocale } from "@/providers/locale-provider";
import { formatPrice, orderReference, timeAgo, uid, isAlgerianPhone, cn } from "@/lib/utils";
import { useCatalogStore } from "@/stores/catalog-store";
import { useSettingsStore } from "@/stores/settings-store";
import { ALGERIA_WILAYAS } from "@/lib/algeria-data";
import { toast } from "@/components/ui/toast";

interface AdminAbandonedCheckoutsProps {
  drafts: AbandonedCheckout[];
  orders: Order[];
}

export function AdminAbandonedCheckouts({ drafts, orders }: AdminAbandonedCheckoutsProps) {
  const { locale } = useLocale();
  const undeliveredOrders = useMemo(
    () => orders.filter((order) => isUndeliveredOrder(order.status)),
    [orders],
  );
  const products = useCatalogStore((state) => state.products);
  const convertAbandonedCheckout = useCatalogStore((state) => state.convertAbandonedCheckout);
  const completeAbandonedCheckout = useCatalogStore((state) => state.completeAbandonedCheckout);
  const getShippingFee = useSettingsStore((state) => state.getShippingFee);
  const freeShippingThreshold = useSettingsStore((state) => state.settings.freeShippingThreshold);

  const [filterTab, setFilterTab] = useState<"all" | "with_phone" | "no_phone" | "undelivered">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  // Conversion Modal State
  const [conversionDraft, setConversionDraft] = useState<AbandonedCheckout | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState<"home" | "desk">("home");
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);
  const [converting, setConverting] = useState(false);

  // Total Statistics
  const totalDraftsCount = drafts.length;
  const uniqueDraftsCount = useMemo(() => {
    const phones = new Set(drafts.map((d) => d.phone?.trim()).filter(Boolean));
    const sessions = new Set(drafts.map((d) => d.sessionId));
    return phones.size > 0 ? phones.size : sessions.size;
  }, [drafts]);

  const totalDraftsValue = useMemo(() => {
    return drafts.reduce((sum, d) => sum + (d.value || 0), 0);
  }, [drafts]);

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
    return [
      {
        productId: product.id,
        variantId: variant?.id ?? "",
        name: product.name,
        size: draft.size,
        color: variant?.color ?? { ar: draft.color, fr: draft.color },
        image: product.images[0]?.url ?? "",
        unitPrice: product.price,
        quantity: draft.quantity,
        sku: variant?.sku,
      },
    ];
  }

  function canConvertDraft(draft: AbandonedCheckout) {
    const items = getDraftItems(draft);
    return (
      items.length > 0 &&
      items.every(
        (item) =>
          (products.find((product) => product.id === item.productId)?.variants.length ?? 0) > 0,
      )
    );
  }

  function beginConversion(draft: AbandonedCheckout) {
    const items = getDraftItems(draft);
    const contactWilaya = draft.contactConsent ? draft.wilaya ?? "" : "";
    const normalizedWilaya =
      ALGERIA_WILAYAS.find((item) =>
        [item.nameAr, item.nameFr, item.code].some((name) => contactWilaya === name),
      )?.nameAr ?? contactWilaya;

    setConversionDraft(draft);
    setCustomerName(draft.contactConsent ? draft.customerName ?? "" : "");
    setPhone(draft.contactConsent ? draft.phone ?? "" : "");
    setWilaya(normalizedWilaya);
    setCommune(draft.contactConsent ? draft.commune ?? "" : "");
    setAddress("");
    setDeliveryType("home");
    setSelectedVariantIds(
      items.map((item) => {
        const product = products.find((candidate) => candidate.id === item.productId);
        const match = product?.variants.find(
          (variant) =>
            variant.id === item.variantId ||
            (variant.size === item.size &&
              (variant.color.ar === item.color.ar || variant.color.fr === item.color.fr)),
        );
        return match?.id ?? product?.variants[0]?.id ?? "";
      }),
    );
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
        toast(
          locale === "ar"
            ? "تعذر العثور على أحد المنتجات أو متغيراته."
            : "Un produit ou une variante est introuvable.",
        );
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
      toast(
        locale === "ar"
          ? "هذه المسودة لا تحتوي على تفاصيل منتجات كافية لإنشاء طلب."
          : "Cette fiche ne contient pas assez de détails produit.",
      );
      return;
    }

    if (!customerName.trim() || !isAlgerianPhone(phone) || !wilaya || !commune.trim() || !address.trim()) {
      toast(
        locale === "ar"
          ? "أكمل اسم العميل ورقم هاتف صحيحًا والولاية والبلدية والعنوان."
          : "Renseignez le client, un téléphone valide et l’adresse complète.",
      );
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
      toast(
        locale === "ar"
          ? "تم إنشاء الطلب وتحديث المخزون بنجاح!"
          : "Commande créée et stock mis à jour avec succès !",
      );
    } catch (error) {
      console.error("Failed to convert abandoned checkout", error);
      toast(
        error instanceof Error && error.message.includes("OUT_OF_STOCK")
          ? locale === "ar"
            ? "المخزون غير كافٍ لهذا المتغير."
            : "Stock insuffisant pour cette variante."
          : locale === "ar"
            ? "تعذر إنشاء الطلب. تحقق من الاتصال بقاعدة البيانات."
            : "Impossible de créer la commande.",
      );
    } finally {
      setConverting(false);
    }
  }

  async function handleDeleteDraft(sessionId: string) {
    if (confirm(locale === "ar" ? "هل أنت متأكد من حذف هذه المسودة؟" : "Supprimer ce panier abandonné ?")) {
      await completeAbandonedCheckout(sessionId, "dismissed");
      setSelectedIds((prev) => prev.filter((id) => id !== sessionId));
      toast(locale === "ar" ? "تم حذف المسودة." : "Panier supprimé.");
    }
  }

  async function handleBulkDelete() {
    if (!selectedIds.length) return;
    if (confirm(locale === "ar" ? `هل أنت متأكد من حذف ${selectedIds.length} مسودة؟` : `Supprimer ${selectedIds.length} paniers ?`)) {
      for (const id of selectedIds) {
        await completeAbandonedCheckout(id, "dismissed");
      }
      setSelectedIds([]);
      toast(locale === "ar" ? "تم حذف المسودات المحددة." : "Paniers supprimés.");
    }
  }

  function handleCopyPhone(phoneStr: string, id: string) {
    navigator.clipboard.writeText(phoneStr);
    setCopiedPhoneId(id);
    setTimeout(() => setCopiedPhoneId(null), 2000);
    toast(locale === "ar" ? "تم نسخ رقم الهاتف" : "Numéro copié");
  }

  function handleExportCSV() {
    const rows = [
      ["Session ID", "Product", "Client", "Phone", "Wilaya", "Commune", "Value", "Date"],
      ...filteredDrafts.map((d) => [
        d.sessionId,
        `"${d.productName || ""}"`,
        `"${d.customerName || ""}"`,
        `"${d.phone || ""}"`,
        `"${d.wilaya || ""}"`,
        `"${d.commune || ""}"`,
        d.value || 0,
        d.createdAt,
      ]),
    ];
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `abandoned_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Filtered List
  const filteredDrafts = useMemo(() => {
    return drafts.filter((draft) => {
      let matchesTab = true;
      if (filterTab === "with_phone") matchesTab = Boolean(draft.phone?.trim());
      else if (filterTab === "no_phone") matchesTab = !draft.phone?.trim();

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        draft.productName?.toLowerCase().includes(query) ||
        draft.customerName?.toLowerCase().includes(query) ||
        draft.phone?.includes(query) ||
        draft.wilaya?.toLowerCase().includes(query) ||
        draft.sessionId.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [drafts, filterTab, searchQuery]);

  const allSelected =
    filteredDrafts.length > 0 &&
    filteredDrafts.every((d) => selectedIds.includes(d.sessionId));

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDrafts.map((d) => d.sessionId));
    }
  }

  function toggleSelectOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  return (
    <div className="space-y-5" dir={locale === "ar" ? "rtl" : "ltr"}>
      {/* Header Stat Cards (Matching Admin Theme) */}
      <div className="grid gap-3.5 sm:grid-cols-3">
        {/* Card 1: Value */}
        <div className="overflow-hidden rounded-xl border border-[#262835] bg-[#181920] p-4 text-start shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">
              {locale === "ar" ? "قيمة الطلبات المتروكة" : "Valeur des paniers"}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20">
              <Package size={17} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-white">
              {formatPrice(totalDraftsValue, locale)}
            </span>
          </div>
        </div>

        {/* Card 2: Unique */}
        <div className="overflow-hidden rounded-xl border border-[#262835] bg-[#181920] p-4 text-start shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">
              {locale === "ar" ? "الطلبات المتروكة الفريدة" : "Paniers uniques"}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">
              <ShoppingCart size={17} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-white">
              {uniqueDraftsCount}
            </span>
          </div>
        </div>

        {/* Card 3: Total Count */}
        <div className="overflow-hidden rounded-xl border border-[#262835] bg-[#181920] p-4 text-start shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">
              {locale === "ar" ? "جميع الطلبات المتروكة" : "Total des paniers"}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/20">
              <ShoppingBag size={17} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-white">
              {totalDraftsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              locale === "ar"
                ? "بحث باسم العميل أو الهاتف أو المنتج..."
                : "Rechercher par client, tél ou produit..."
            }
            className="w-full rounded-xl border border-[#262835] bg-[#181920] py-2.5 pe-4 ps-10 text-xs text-white placeholder-zinc-500 transition focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-1 rounded-xl border border-[#262835] bg-[#181920] p-1 text-xs">
          {[
            { key: "all", label: locale === "ar" ? "الكل" : "Tous", count: drafts.length },
            {
              key: "with_phone",
              label: locale === "ar" ? "مع هاتف" : "Avec tél",
              count: drafts.filter((d) => d.phone?.trim()).length,
            },
            {
              key: "no_phone",
              label: locale === "ar" ? "بدون هاتف" : "Sans tél",
              count: drafts.filter((d) => !d.phone?.trim()).length,
            },
            {
              key: "undelivered",
              label: locale === "ar" ? "غير مستلمة" : "Non livrées",
              count: undeliveredOrders.length,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterTab(tab.key as typeof filterTab)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition",
                filterTab === tab.key
                  ? "bg-purple-600 font-bold text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200",
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px]",
                  filterTab === tab.key
                    ? "bg-purple-800 text-purple-100"
                    : "bg-zinc-800 text-zinc-400",
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#262835] bg-[#181920] px-4 py-2.5 text-xs text-zinc-300">
        <div className="flex items-center gap-3">
          <span>
            {locale === "ar"
              ? `المحددة: ${selectedIds.length}`
              : `Sélectionnés : ${selectedIds.length}`}
          </span>
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={() => void handleBulkDelete()}
              className="flex items-center gap-1 rounded-lg bg-rose-500/15 px-2.5 py-1 text-rose-300 hover:bg-rose-500/25 transition"
            >
              <Trash2 size={13} />
              <span>{locale === "ar" ? "حذف المحدد" : "Supprimer"}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 font-semibold text-zinc-200 hover:bg-zinc-800 transition"
          >
            <Download size={13} />
            <span>{locale === "ar" ? "تصدير CSV" : "Exporter"}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 font-semibold text-zinc-200 hover:bg-zinc-800 transition"
          >
            <Printer size={13} />
            <span>{locale === "ar" ? "طباعة" : "Imprimer"}</span>
          </button>
        </div>
      </div>

      {/* Main Abandoned Orders Table */}
      {filterTab === "undelivered" ? (
        /* Render undelivered orders list if requested */
        <div className="overflow-hidden rounded-xl border border-[#262835] bg-[#181920]">
          <div className="p-4 border-b border-[#262835]">
            <h3 className="text-sm font-bold text-amber-400">
              {locale === "ar"
                ? `الطلبات المسجلة التي تنتظر التسليم (${undeliveredOrders.length})`
                : `Commandes en attente de livraison (${undeliveredOrders.length})`}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-start text-xs">
              <thead className="border-b border-[#262835] bg-zinc-900/50 text-zinc-400">
                <tr>
                  <th className="px-4 py-3 text-start">{locale === "ar" ? "المرجع" : "Réf."}</th>
                  <th className="px-4 py-3 text-start">{locale === "ar" ? "العميل" : "Client"}</th>
                  <th className="px-4 py-3 text-start">{locale === "ar" ? "الهاتف" : "Tél"}</th>
                  <th className="px-4 py-3 text-start">{locale === "ar" ? "الولاية" : "Wilaya"}</th>
                  <th className="px-4 py-3 text-start">{locale === "ar" ? "المجموع" : "Total"}</th>
                  <th className="px-4 py-3 text-start">{locale === "ar" ? "الحالة" : "Statut"}</th>
                </tr>
              </thead>
              <tbody>
                {undeliveredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[#262835]/60 hover:bg-zinc-900/30">
                    <td className="px-4 py-3 font-mono font-bold text-purple-300">{order.reference}</td>
                    <td className="px-4 py-3 text-zinc-200">{order.customerName}</td>
                    <td className="px-4 py-3 font-mono text-zinc-300" dir="ltr">{order.phone}</td>
                    <td className="px-4 py-3 text-zinc-300">{order.wilaya}</td>
                    <td className="px-4 py-3 font-bold text-white">{formatPrice(order.total, locale)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Regular Abandoned Table */
        <div className="overflow-hidden rounded-xl border border-[#262835] bg-[#181920] shadow-sm">
          {filteredDrafts.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">
              <ShoppingCart size={40} className="mx-auto mb-3 opacity-30 text-zinc-400" />
              <p className="text-sm font-semibold">
                {locale === "ar" ? "لا توجد طلبات متروكة تطابق البحث" : "Aucun panier abandonné"}
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                {locale === "ar"
                  ? "عندما يقوم العملاء ببدء الشراء دون تأكيده ستظهر بياناتهم هنا فوراً."
                  : "Les paniers commencés non validés apparaîtront automatiquement ici."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-start text-xs">
                <thead className="border-b border-[#262835] bg-zinc-900/50 text-zinc-400 text-[11px]">
                  <tr>
                    <th className="w-10 px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-purple-600 focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-3.5 text-start font-semibold">{locale === "ar" ? "المنتج" : "Produit"}</th>
                    <th className="px-4 py-3.5 text-start font-semibold">{locale === "ar" ? "العميل" : "Client"}</th>
                    <th className="px-4 py-3.5 text-start font-semibold">{locale === "ar" ? "الهاتف" : "Téléphone"}</th>
                    <th className="px-4 py-3.5 text-start font-semibold">{locale === "ar" ? "الولاية" : "Wilaya"}</th>
                    <th className="px-4 py-3.5 text-start font-semibold">{locale === "ar" ? "التاريخ" : "Date"}</th>
                    <th className="px-4 py-3.5 text-start font-semibold">{locale === "ar" ? "الحالة" : "Statut"}</th>
                    <th className="px-4 py-3.5 text-start font-semibold">{locale === "ar" ? "المجموع" : "Total"}</th>
                    <th className="px-4 py-3.5 text-center font-semibold">{locale === "ar" ? "الإجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262835]/60">
                  {filteredDrafts.map((draft) => {
                    const isSelected = selectedIds.includes(draft.sessionId);
                    const items = getDraftItems(draft);
                    const firstItem = items[0];
                    const hasPhone = Boolean(draft.phone?.trim());

                    return (
                      <tr
                        key={draft.sessionId}
                        className={cn(
                          "transition hover:bg-zinc-900/40",
                          isSelected && "bg-purple-950/20",
                        )}
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(draft.sessionId)}
                            className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-purple-600 focus:ring-0 cursor-pointer"
                          />
                        </td>

                        {/* Product Thumbnail & Details */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-zinc-700/60 bg-zinc-900">
                              {firstItem?.image ? (
                                <Image
                                  src={firstItem.image}
                                  alt=""
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-zinc-500 font-bold text-xs">
                                  V
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 max-w-[200px]">
                              <p className="truncate font-semibold text-zinc-100">
                                {draft.productName || (firstItem?.name ? (firstItem.name[locale] || firstItem.name.ar) : "منتج")}
                              </p>
                              <p className="mt-0.5 truncate text-[11px] text-zinc-400">
                                {[draft.size, draft.color].filter(Boolean).join(" · ") ||
                                  (locale === "ar" ? "بدون خيارات" : "Standard")}
                                {draft.quantity > 1 ? ` (×${draft.quantity})` : ""}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-zinc-300">
                              <User size={13} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-zinc-200">
                                {draft.customerName || (locale === "ar" ? "عميل زائر" : "Visiteur")}
                              </p>
                              <p className="text-[10px] text-zinc-500 font-mono">
                                {draft.sessionId.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Phone with Call & Copy */}
                        <td className="px-4 py-3.5">
                          {hasPhone ? (
                            <div className="flex items-center gap-1.5" dir="ltr">
                              <a
                                href={`tel:${draft.phone}`}
                                className="flex items-center gap-1 font-mono font-semibold text-purple-400 hover:text-purple-300 hover:underline"
                              >
                                <Phone size={12} />
                                <span>{draft.phone}</span>
                              </a>
                              <button
                                type="button"
                                onClick={() => handleCopyPhone(draft.phone!, draft.sessionId)}
                                className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                                title={locale === "ar" ? "نسخ الرقم" : "Copier"}
                              >
                                {copiedPhoneId === draft.sessionId ? (
                                  <Check size={12} className="text-emerald-400" />
                                ) : (
                                  <Copy size={12} />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-zinc-500 text-[11px]">
                              {locale === "ar" ? "غير متوفر" : "Non renseigné"}
                            </span>
                          )}
                        </td>

                        {/* Wilaya / Commune */}
                        <td className="px-4 py-3.5 text-zinc-300">
                          {draft.wilaya ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800/80 px-2 py-0.5 text-[11px]">
                              <MapPin size={11} className="text-zinc-400" />
                              {draft.wilaya}
                            </span>
                          ) : (
                            <span className="text-zinc-500 text-[11px]">—</span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3.5 text-zinc-400 text-[11px] whitespace-nowrap">
                          {timeAgo(draft.createdAt, locale)}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
                            <Clock size={10} />
                            {locale === "ar" ? "متروكة" : "Abandonné"}
                          </span>
                        </td>

                        {/* Total Price */}
                        <td className="px-4 py-3.5 font-bold text-white whitespace-nowrap">
                          {formatPrice(draft.value || 0, locale)}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Convert Button */}
                            <button
                              type="button"
                              onClick={() => beginConversion(draft)}
                              disabled={!canConvertDraft(draft)}
                              className="flex items-center gap-1 rounded-lg bg-purple-600/20 border border-purple-500/30 px-2.5 py-1.5 text-xs font-bold text-purple-200 hover:bg-purple-600 hover:text-white transition disabled:opacity-40 disabled:pointer-events-none"
                              title={locale === "ar" ? "استكمال وإنشاء طلب" : "Créer commande"}
                            >
                              <Sparkles size={13} />
                              <span>{locale === "ar" ? "إنشاء طلب" : "Convertir"}</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => void handleDeleteDraft(draft.sessionId)}
                              className="rounded-lg p-1.5 text-zinc-400 hover:bg-rose-500/20 hover:text-rose-300 transition"
                              title={locale === "ar" ? "حذف" : "Supprimer"}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Convert to Regular Order Modal Dialog */}
      {conversionDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#262835] bg-[#181920] p-6 shadow-2xl text-start"
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#262835] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/20 text-purple-300">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {locale === "ar" ? "استكمال وإنشاء طلب عادي" : "Créer une commande normale"}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {locale === "ar"
                      ? "تحويل المسودة المتروكة إلى طلب حقيقي مؤكد وتحديث المخزون"
                      : "Transformer ce panier en commande réelle avec stock"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConversionDraft(null)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={(e) => void submitConversion(e)} className="mt-5 space-y-4">
              {/* Product Variants Preview */}
              <div className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
                <p className="text-xs font-semibold text-zinc-300">
                  {locale === "ar" ? "المنتجات والمتغيرات المطلوبة:" : "Produits sélectionnés :"}
                </p>
                {getDraftItems(conversionDraft).map((item, idx) => {
                  const product = products.find((p) => p.id === item.productId);
                  return (
                    <div key={idx} className="flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 overflow-hidden rounded-md border border-zinc-700 bg-zinc-800">
                          {item.image ? (
                            <Image src={item.image} alt="" fill unoptimized className="object-cover" />
                          ) : null}
                        </div>
                        <span className="font-semibold text-zinc-200">
                          {item.name[locale] || item.name.ar} (×{item.quantity})
                        </span>
                      </div>

                      {product?.variants && product.variants.length > 0 && (
                        <select
                          value={selectedVariantIds[idx] || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedVariantIds((prev) => {
                              const copy = [...prev];
                              copy[idx] = val;
                              return copy;
                            });
                          }}
                          className="rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-white"
                        >
                          {product.variants.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.size} - {v.color[locale] || v.color.ar} (المتوفر: {v.stock})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Customer Inputs */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-300">
                    {locale === "ar" ? "اسم العميل *" : "Nom du client *"}
                  </label>
                  <input
                    required
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={locale === "ar" ? "الاسم الكامل" : "Nom & Prénom"}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-300">
                    {locale === "ar" ? "رقم الهاتف *" : "Numéro de téléphone *"}
                  </label>
                  <input
                    required
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0550000000"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-300">
                    {locale === "ar" ? "الولاية *" : "Wilaya *"}
                  </label>
                  <select
                    required
                    value={wilaya}
                    onChange={(e) => {
                      setWilaya(e.target.value);
                      setCommune("");
                    }}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">{locale === "ar" ? "اختر الولاية" : "Sélectionner la wilaya"}</option>
                    {ALGERIA_WILAYAS.map((item) => (
                      <option key={item.code} value={item.nameAr}>
                        {item.code} - {locale === "ar" ? item.nameAr : item.nameFr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-300">
                    {locale === "ar" ? "البلدية *" : "Commune *"}
                  </label>
                  <input
                    required
                    type="text"
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    placeholder={locale === "ar" ? "البلدية" : "Commune"}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-300">
                  {locale === "ar" ? "العنوان بالتفصيل *" : "Adresse détaillée *"}
                </label>
                <input
                  required
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={locale === "ar" ? "الحي أو الشارع أو النقطة الدالة" : "Rue, quartier, etc."}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-300">
                  {locale === "ar" ? "نوع التوصيل" : "Type de livraison"}
                </label>
                <div className="flex gap-4 text-xs text-zinc-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryType"
                      checked={deliveryType === "home"}
                      onChange={() => setDeliveryType("home")}
                      className="text-purple-600 focus:ring-0"
                    />
                    <span>{locale === "ar" ? "توصيل للمنزل" : "À domicile"}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryType"
                      checked={deliveryType === "desk"}
                      onChange={() => setDeliveryType("desk")}
                      className="text-purple-600 focus:ring-0"
                    />
                    <span>{locale === "ar" ? "استلام من المكتب (StopDesk)" : "En bureau (StopDesk)"}</span>
                  </label>
                </div>
              </div>

              {/* Submit / Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-[#262835] pt-4">
                <button
                  type="button"
                  onClick={() => setConversionDraft(null)}
                  className="rounded-xl border border-zinc-700 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition"
                >
                  {locale === "ar" ? "إلغاء" : "Annuler"}
                </button>
                <button
                  type="submit"
                  disabled={converting}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 active:scale-95 transition disabled:opacity-50"
                >
                  <CheckCircle2 size={15} />
                  <span>
                    {converting
                      ? locale === "ar"
                        ? "جاري الإنشاء..."
                        : "Création..."
                      : locale === "ar"
                        ? "تأكيد وإنشاء الطلب"
                        : "Confirmer la commande"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
