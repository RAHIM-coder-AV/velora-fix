"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  X,
  Phone,
  MapPin,
  Printer,
  User,
  CheckCircle2,
  Truck,
  Copy,
  SendHorizonal,
  Pencil,
} from "lucide-react";
import type { Order, OrderItem, OrderStatus } from "@/types";
import { useLocale } from "@/providers/locale-provider";
import { formatPrice } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settings-store";
import { useCatalogStore } from "@/stores/catalog-store";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { ALGERIA_WILAYAS } from "@/lib/algeria-data";
import { calculateOrderTotals, canEditOrder } from "@/lib/orders/order-editing";
import { TrafficSourceBadge } from "@/components/admin/traffic-source-badge";
import { getOrderTrafficSource } from "@/components/admin/admin-orders-table";

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (status: OrderStatus) => void;
  onOrderSaved: (order: Order) => void;
}

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onStatusChange,
  onOrderSaved,
}: OrderDetailModalProps) {
  const { locale } = useLocale();
  const ecotrack = useSettingsStore((s) => s.settings.ecotrack);
  const nordEtOuest = useSettingsStore((s) => s.settings.nordEtOuest);
  const updateOrderDelivery = useCatalogStore((s) => s.updateOrderDelivery);
  const updateOrder = useCatalogStore((s) => s.updateOrder);
  const products = useCatalogStore((s) => s.products);
  const getShippingFee = useSettingsStore((s) => s.getShippingFee);
  const freeShippingThreshold = useSettingsStore((s) => s.settings.freeShippingThreshold);

  const [dispatching, setDispatching] = useState<"ecotrack" | "nord_ouest" | null>(null);
  const [editing, setEditing] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const editFormRef = useRef<HTMLElement>(null);
  const [dispatchResult, setDispatchResult] = useState<{
    company: string;
    trackingCode: string;
  } | null>(null);

  useEffect(() => {
    if (editing) {
      editFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [editing]);

  async function handleDispatch(company: "ecotrack" | "nord_ouest") {
    if (!order) return;

    const cfg = company === "ecotrack" ? ecotrack : nordEtOuest;
    const companyLabel = company === "ecotrack" ? "EcoTrack" : "Nord Et Ouest";

    if (!cfg?.enabled || !cfg.token) {
      toast(
        locale === "ar"
          ? `فعّل الربط وأدخل رمز API حقيقيًا لـ ${companyLabel} في الإعدادات أولاً.`
          : `Activez l'intégration et configurez un vrai jeton API ${companyLabel}.`
      );
      return;
    }

    setDispatching(company);
    try {
      const res = await fetch("/api/delivery/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          token: cfg.token,
          baseUrl: cfg.baseUrl,
          orders: [
            {
              id: order.id,
              reference: order.reference,
              customerName: order.customerName,
              phone: order.phone,
              phone2: order.phone2 || "",
              wilaya: order.wilaya,
              commune: order.commune,
              address: order.address,
              total: order.total,
              shipping: order.shipping,
              isStopdesk: order.isStopdesk || false,
              notes: order.notes || "",
              items: order.items.map((i) => ({
                name: i.name,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
              })),
            },
          ],
        }),
      });

      const data = await res.json();
      const result = data.results?.[0];

      if (res.ok && result?.success && typeof result.trackingCode === "string") {
        const tracking = result.trackingCode;
        setDispatchResult({
          company: companyLabel,
          trackingCode: tracking,
        });
        try {
          await updateOrderDelivery(order.id, {
            deliveryCompany: company,
            trackingCode: tracking,
            status: "shipped",
            labelUrl: result.labelUrl,
          });
          onStatusChange("shipped");
          toast(
            locale === "ar"
              ? `تم إنشاء الشحنة لدى ${companyLabel}. كود التتبع: ${tracking}`
              : `Expédiée via ${companyLabel}. Suivi : ${tracking}`
          );
        } catch {
          toast(locale === "ar"
            ? `أُنشئت الشحنة (${tracking}) لكن تعذر حفظ بياناتها في قاعدة البيانات. لا تعاود الرفع كي لا تتكرر.`
            : `Expédiée (${tracking}), mais la sauvegarde a échoué. Ne relancez pas l'envoi.`);
        }
      } else {
        toast(
          locale === "ar"
            ? `❌ خطأ في الرفع: ${result?.error || data.error || "خطأ غير معروف"}`
            : `❌ Erreur: ${result?.error || data.error}`
        );
      }
    } catch {
      toast(
        locale === "ar"
          ? `فشل الاتصال بخادم ${companyLabel}`
          : `Erreur de connexion avec ${companyLabel}`
      );
    } finally {
      setDispatching(null);
    }
  }

  if (!isOpen || !order) return null;

  const phoneClean = order.phone.replace(/[\s\-_]/g, "");
  const whatsappPhone = phoneClean.startsWith("0") ? `213${phoneClean.slice(1)}` : phoneClean;

  const statusColors: Partial<Record<OrderStatus, { bg: string; text: string; label: string }>> = {
    pending: { bg: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300", text: "قيد الانتظار", label: "En attente" },
    confirmed: { bg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300", text: "مؤكد", label: "Confirmée" },
    processing: { bg: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300", text: "قيد المعالجة", label: "En préparation" },
    shipped: { bg: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300", text: "في التوصيل", label: "Expédiée" },
    delivered: { bg: "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300", text: "تم التوصيل", label: "Livrée" },
    cancelled: { bg: "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300", text: "ملغى", label: "Annulée" },
    no_answer: { bg: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400", text: "لا يرد", label: "Pas de réponse" },
    postponed: { bg: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300", text: "مؤجل", label: "Reportée" },
  };

  const currentStatus = statusColors[order.status] ?? {
    bg: "bg-zinc-100 text-zinc-600",
    text: order.status,
    label: order.status,
  };

  function handlePrint() {
    window.print();
  }

  const alreadyDispatched = !canEditOrder(order.trackingCode, order.deliveryDispatchedAt);
  const editWilaya = editedOrder
    ? ALGERIA_WILAYAS.find((wilaya) =>
        [wilaya.nameAr, wilaya.nameFr, wilaya.code].some((name) => editedOrder.wilaya === name),
      )
    : undefined;
  const editedTotals = editedOrder
      ? calculateOrderTotals(
          editedOrder.items,
          editedOrder.wilaya,
          editedOrder.isStopdesk ?? false,
          freeShippingThreshold,
          getShippingFee,
          editedOrder.subtotal,
        )
      : null;

  function beginEditing() {
    if (!order) return;
    const wilaya = ALGERIA_WILAYAS.find((item) =>
      [item.nameAr, item.nameFr, item.code].some((name) => order.wilaya === name),
    );
    setEditedOrder({
      ...order,
      wilaya: wilaya?.nameAr ?? order.wilaya,
      items: order.items.map((item) => ({ ...item })),
    });
    setEditError("");
    setEditing(true);
  }

  function updateEditedItem(itemId: string, patch: Partial<OrderItem>) {
    setEditedOrder((current) => {
      if (!current) return current;
      const items = current.items.map((item) =>
        item.id === itemId ? { ...item, ...patch } : item,
      );
      const totals = calculateOrderTotals(
        items,
        current.wilaya,
        current.isStopdesk ?? false,
        freeShippingThreshold,
        getShippingFee,
        current.subtotal,
      );
      return { ...current, items, ...totals };
    });
  }

  async function saveEditedOrder() {
    if (!editedOrder) return;
    setSavingEdit(true);
    setEditError("");
    const totals = calculateOrderTotals(
      editedOrder.items,
      editedOrder.wilaya,
      editedOrder.isStopdesk ?? false,
      freeShippingThreshold,
      getShippingFee,
      editedOrder.subtotal,
    );
    const nextOrder = {
      ...editedOrder,
      ...totals,
    };
    try {
      await updateOrder(nextOrder);
      onOrderSaved(nextOrder);
      setEditing(false);
      toast(locale === "ar" ? "تم حفظ تعديلات الطلب." : "Commande mise à jour.");
    } catch (error) {
      console.error("Failed to update order details", error);
      const message =
        error instanceof Error && error.message.includes("ORDER_ALREADY_DISPATCHED")
          ? locale === "ar"
            ? "لا يمكن تعديل طلب أُرسل إلى شركة التوصيل."
            : "Une commande déjà expédiée ne peut pas être modifiée."
          : locale === "ar"
            ? "تعذر حفظ التعديلات. تحقق من الاتصال والترحيل 0007."
            : "Échec de l’enregistrement. Vérifiez la connexion et la migration 0007.";
      setEditError(message);
      toast(message);
    } finally {
      setSavingEdit(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-4">
      <div className="flex max-h-[calc(100dvh-1rem)] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl sm:max-h-[90vh] dark:bg-zinc-900 dark:text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-zinc-200 px-3 py-3 sm:px-6 sm:py-4 dark:border-zinc-800">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="break-all font-serif text-base font-bold sm:text-lg">
                {locale === "ar" ? "طلب رقم" : "Commande"} #{order.reference}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${currentStatus.bg}`}>
                {locale === "ar" ? currentStatus.text : currentStatus.label}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-zinc-500">
              {new Date(order.createdAt).toLocaleString(locale === "ar" ? "ar-DZ" : "fr-DZ")}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {alreadyDispatched ? (
              <span
                title={locale === "ar" ? "لا يمكن تعديل الطلب بعد إرساله لشركة التوصيل." : "Une commande expédiée ne peut plus être modifiée."}
                className="rounded-lg bg-zinc-100 px-2 py-1.5 text-[10px] font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 sm:text-xs"
              >
                {locale === "ar" ? "تم إرساله" : "Expédiée"}
              </span>
            ) : (
              <button
                type="button"
                onClick={editing ? () => setEditing(false) : beginEditing}
                className="flex items-center gap-1.5 rounded-lg bg-purple-700 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-purple-800 sm:px-3 sm:text-xs"
                aria-label={locale === "ar" ? "تعديل بيانات الطلب" : "Modifier la commande"}
              >
                <Pencil size={14} />
                <span>{editing
                  ? locale === "ar" ? "إلغاء" : "Annuler"
                  : locale === "ar" ? "تعديل الطلب" : "Modifier"}</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-300 px-2 py-1.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100 sm:px-3 sm:text-xs dark:border-zinc-700 dark:text-zinc-300"
              title={locale === "ar" ? "طباعة وصل الطلب" : "Imprimer"}
            >
              <Printer size={15} />
              <span>{locale === "ar" ? "طباعة" : "Imprimer"}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 sm:space-y-5 sm:p-6">
          {/* Dispatch Banner: already dispatched */}
          {alreadyDispatched && !dispatchResult && (
            <div className="flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-3.5 dark:border-indigo-800 dark:bg-indigo-950/30">
              <CheckCircle2 size={18} className="flex-shrink-0 text-indigo-600" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-indigo-800 dark:text-indigo-300">
                  {locale === "ar" ? "تم إرسال هذا الطلب مسبقاً" : "Commande déjà expédiée"}
                </p>
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400">
                  {locale === "ar" ? "كود التتبع: " : "Tracking: "}
                  <span className="font-mono font-bold">{order.trackingCode}</span>
                  {order.deliveryCompany && (
                    <span className="ml-2 rounded bg-indigo-200 px-1.5 py-0.5 text-[10px] font-bold dark:bg-indigo-900/60">
                      {order.deliveryCompany === "ecotrack" ? "EcoTrack" : "Nord Et Ouest"}
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(order.trackingCode || "");
                  toast(locale === "ar" ? "تم نسخ كود التتبع!" : "Code copié !");
                }}
                className="rounded p-1 text-indigo-500 hover:bg-indigo-100"
                title={locale === "ar" ? "نسخ" : "Copier"}
              >
                <Copy size={14} />
              </button>
            </div>
          )}

          {/* Dispatch Result Banner */}
          {dispatchResult && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 dark:border-emerald-800 dark:bg-emerald-950/30">
              <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-600" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  {locale === "ar"
                    ? `تم إنشاء الشحنة لدى ${dispatchResult.company}.`
                    : `Expédiée via ${dispatchResult.company}.`}
                </p>
                <p className="mt-0.5 text-[11px] text-emerald-700 dark:text-emerald-400">
                  {locale === "ar" ? "كود التتبع: " : "Code suivi: "}
                  <span className="font-mono font-bold">{dispatchResult.trackingCode}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(dispatchResult.trackingCode);
                  toast(locale === "ar" ? "تم نسخ كود التتبع!" : "Code copié !");
                }}
                className="rounded p-1 text-emerald-600 hover:bg-emerald-100"
                title={locale === "ar" ? "نسخ" : "Copier"}
              >
                <Copy size={14} />
              </button>
            </div>
          )}

          {/* Dispatch Section */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              <Truck size={14} />
              {locale === "ar" ? "رفع الطلب إلى شركة التوصيل" : "Expédier vers une société de livraison"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {/* EcoTrack */}
              <button
                type="button"
                disabled={dispatching !== null}
                onClick={() => handleDispatch("ecotrack")}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition",
                  ecotrack?.enabled
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 active:scale-95"
                    : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
                )}
                title={!ecotrack?.enabled ? (locale === "ar" ? "EcoTrack غير مفعل" : "EcoTrack désactivé") : undefined}
              >
                {dispatching === "ecotrack" ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <SendHorizonal size={14} />
                )}
                <span>
                  {dispatching === "ecotrack"
                    ? (locale === "ar" ? "جاري الرفع..." : "Envoi...")
                    : (locale === "ar" ? "رفع إلى EcoTrack" : "Envoyer à EcoTrack")}
                </span>
                {!ecotrack?.enabled && (
                  <span className="rounded bg-zinc-300 px-1 py-0.5 text-[9px] dark:bg-zinc-600">
                    {locale === "ar" ? "معطل" : "Désactivé"}
                  </span>
                )}
              </button>

              {/* Nord Et Ouest */}
              <button
                type="button"
                disabled={dispatching !== null}
                onClick={() => handleDispatch("nord_ouest")}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition",
                  nordEtOuest?.enabled
                    ? "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 active:scale-95"
                    : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
                )}
                title={!nordEtOuest?.enabled ? (locale === "ar" ? "Nord Et Ouest غير مفعل" : "Nord Et Ouest désactivé") : undefined}
              >
                {dispatching === "nord_ouest" ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <SendHorizonal size={14} />
                )}
                <span>
                  {dispatching === "nord_ouest"
                    ? (locale === "ar" ? "جاري الرفع..." : "Envoi...")
                    : (locale === "ar" ? "رفع إلى Nord Et Ouest" : "Envoyer à Nord Et Ouest")}
                </span>
                {!nordEtOuest?.enabled && (
                  <span className="rounded bg-zinc-300 px-1 py-0.5 text-[9px] dark:bg-zinc-600">
                    {locale === "ar" ? "معطل" : "Désactivé"}
                  </span>
                )}
              </button>
            </div>
            <p className="mt-2 text-[10px] text-zinc-400">
              {locale === "ar"
                ? "سيتم تغيير حالة الطلب تلقائياً إلى 'في التوصيل' ويُحفظ كود التتبع."
                : "Le statut passera automatiquement à 'Expédiée' et le code de suivi sera enregistré."}
            </p>
          </div>

          {/* Customer Details */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
              {locale === "ar" ? "بيانات العميل والتوصيل" : "Client & Livraison"}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <User size={16} className="text-zinc-400" />
                <span className="font-bold">{order.customerName}</span>
              </div>

              {editing && editedOrder && (
                <section ref={editFormRef} className="order-edit-form space-y-4 rounded-xl border border-purple-200 bg-purple-50/70 p-4 sm:col-span-2 dark:border-purple-900 dark:bg-purple-950/20" dir={locale === "ar" ? "rtl" : "ltr"}>
                  <h3 className="text-sm font-bold text-purple-950 dark:text-purple-200">
                    {locale === "ar" ? "تعديل بيانات العميل والتوصيل والخيارات" : "Modifier le client, la livraison et les options"}
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1 text-xs font-semibold">
                      <span>{locale === "ar" ? "اسم العميل" : "Nom du client"}</span>
                      <input value={editedOrder.customerName} onChange={(event) => setEditedOrder({ ...editedOrder, customerName: event.target.value })} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                    </label>
                    <label className="space-y-1 text-xs font-semibold">
                      <span>{locale === "ar" ? "الهاتف" : "Téléphone"}</span>
                      <input value={editedOrder.phone} onChange={(event) => setEditedOrder({ ...editedOrder, phone: event.target.value })} dir="ltr" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                    </label>
                    <label className="space-y-1 text-xs font-semibold">
                      <span>{locale === "ar" ? "الولاية" : "Wilaya"}</span>
                      <select
                        value={editWilaya?.nameAr ?? editedOrder.wilaya}
                        onChange={(event) => setEditedOrder({ ...editedOrder, wilaya: event.target.value, commune: "" })}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                      >
                        {!editWilaya && <option value={editedOrder.wilaya}>{editedOrder.wilaya}</option>}
                        {ALGERIA_WILAYAS.map((wilaya) => <option key={wilaya.code} value={wilaya.nameAr}>{locale === "ar" ? wilaya.nameAr : wilaya.nameFr}</option>)}
                      </select>
                    </label>
                    <label className="space-y-1 text-xs font-semibold">
                      <span>{locale === "ar" ? "البلدية" : "Commune"}</span>
                      {(ALGERIA_WILAYAS.find((wilaya) => wilaya.nameAr === editedOrder.wilaya)?.communes ?? []).length > 0 ? (
                        <select value={editedOrder.commune} onChange={(event) => setEditedOrder({ ...editedOrder, commune: event.target.value })} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
                          {!ALGERIA_WILAYAS.find((wilaya) => wilaya.nameAr === editedOrder.wilaya)?.communes.includes(editedOrder.commune) && <option value={editedOrder.commune}>{editedOrder.commune}</option>}
                          {ALGERIA_WILAYAS.find((wilaya) => wilaya.nameAr === editedOrder.wilaya)?.communes.map((commune) => <option key={commune} value={commune}>{commune}</option>)}
                        </select>
                      ) : (
                        <input value={editedOrder.commune} onChange={(event) => setEditedOrder({ ...editedOrder, commune: event.target.value })} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                      )}
                    </label>
                    <label className="space-y-1 text-xs font-semibold sm:col-span-2">
                      <span>{locale === "ar" ? "العنوان" : "Adresse"}</span>
                      <input value={editedOrder.address} onChange={(event) => setEditedOrder({ ...editedOrder, address: event.target.value })} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                    </label>
                    <label className="space-y-1 text-xs font-semibold">
                      <span>{locale === "ar" ? "طريقة التوصيل" : "Mode de livraison"}</span>
                      <select value={editedOrder.isStopdesk ? "desk" : "home"} onChange={(event) => setEditedOrder({ ...editedOrder, isStopdesk: event.target.value === "desk" })} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
                        <option value="home">{locale === "ar" ? "توصيل للمنزل" : "À domicile"}</option>
                        <option value="desk">{locale === "ar" ? "استلام من المكتب" : "Point relais"}</option>
                      </select>
                    </label>
                    <label className="space-y-1 text-xs font-semibold sm:col-span-2">
                      <span>{locale === "ar" ? "ملاحظة العميل / الطلب" : "Note du client / Commande"}</span>
                      <textarea
                        value={editedOrder.notes || ""}
                        onChange={(event) => setEditedOrder({ ...editedOrder, notes: event.target.value })}
                        rows={2}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                        placeholder={locale === "ar" ? "أدخل ملاحظات حول هذا الطلب..." : "Notes sur cette commande..."}
                      />
                    </label>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold">{locale === "ar" ? "المقاس واللون" : "Taille et couleur"}</h4>
                    {editedOrder.items.map((item) => {
                      const product = products.find((entry) => entry.id === item.productId);
                      const variants = product?.variants ?? [];
                      return (
                        <div key={item.id} className="grid gap-2 rounded-lg border border-purple-100 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900 sm:grid-cols-[1fr_2fr]">
                          <p className="self-center text-xs font-bold">{item.name[locale] || item.name.ar}</p>
                          {variants.length ? (
                            <select
                              value={item.variantId}
                              onChange={(event) => {
                                const variant = variants.find((entry) => entry.id === event.target.value);
                                if (variant) updateEditedItem(item.id, { variantId: variant.id, size: variant.size, color: variant.color });
                              }}
                              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                            >
                              {!variants.some((variant) => variant.id === item.variantId) && <option value={item.variantId}>{item.size} · {item.color[locale] || item.color.ar}</option>}
                              {variants.map((variant) => <option key={variant.id} value={variant.id}>{variant.size} · {variant.color[locale] || variant.color.ar} ({locale === "ar" ? `المخزون ${variant.stock}` : `Stock ${variant.stock}`})</option>)}
                            </select>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              <input aria-label={locale === "ar" ? "المقاس" : "Taille"} value={item.size} onChange={(event) => updateEditedItem(item.id, { size: event.target.value, variantId: "" })} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                              <input aria-label={locale === "ar" ? "اللون" : "Couleur"} value={item.color[locale] || item.color.ar} onChange={(event) => updateEditedItem(item.id, { color: { ...item.color, [locale]: event.target.value }, variantId: "" })} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-purple-200 pt-3 dark:border-purple-900">
                    <p className="text-xs font-semibold">
                      {locale === "ar" ? "الإجمالي بعد التعديل: " : "Total après modification : "}
                      {formatPrice(editedTotals?.total ?? editedOrder.total, locale)}
                    </p>
                    <button type="button" disabled={savingEdit} onClick={() => void saveEditedOrder()} className="rounded-lg bg-purple-700 px-4 py-2 text-xs font-bold text-white disabled:opacity-60">
                      {savingEdit ? (locale === "ar" ? "جارٍ الحفظ..." : "Enregistrement...") : (locale === "ar" ? "حفظ التعديلات" : "Enregistrer")}
                    </button>
                  </div>
                  {editError && <p role="alert" className="text-xs font-semibold text-red-700 dark:text-red-300">{editError}</p>}
                </section>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Phone size={16} className="text-emerald-600" />
                <a
                  href={`tel:${phoneClean}`}
                  className="font-bold text-emerald-700 underline dark:text-emerald-400"
                  dir="ltr"
                >
                  {order.phone}
                </a>
                <a
                  href={`https://wa.me/${whatsappPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ms-2 rounded bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-green-600"
                >
                  WhatsApp
                </a>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-zinc-400" />
                <span>
                  {order.wilaya} — {order.commune}
                </span>
              </div>

              <div className="text-sm">
                <span className="text-xs text-zinc-500">{locale === "ar" ? "العنوان: " : "Adresse: "}</span>
                <span className="font-medium">{order.address}</span>
              </div>

              {order.isStopdesk && (
                <div className="sm:col-span-2">
                  <span className="rounded-full bg-amber-100 px-3 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                    📦 {locale === "ar" ? "استلام من المكتب (Stop Desk)" : "Retrait en Stop Desk"}
                  </span>
                </div>
              )}

              {/* Customer Notes / Remarks Section */}
              <div className="sm:col-span-2 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">
                  <span>📝</span>
                  <span>{locale === "ar" ? "ملاحظة العميل / الطلب:" : "Note du client / Commande :"}</span>
                </div>
                <div className={cn(
                  "rounded-lg p-2.5 text-xs font-semibold leading-relaxed border",
                  order.notes?.trim()
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-300"
                    : "bg-zinc-50 border-zinc-200 text-zinc-500 dark:bg-zinc-900/60 dark:border-zinc-800 dark:text-zinc-400"
                )}>
                  {order.notes?.trim() ? order.notes : (locale === "ar" ? "بدون ملاحظة" : "Sans remarque")}
                </div>
              </div>

              {/* Traffic Source Attribution */}
              <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-500">
                    {locale === "ar" ? "مصدر الإعلان / المنصة:" : "Source publicitaire :"}
                  </span>
                  <TrafficSourceBadge source={order.trafficSource || getOrderTrafficSource(order)} size="md" showLabel />
                </div>
                {order.utmCampaign && (
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {locale === "ar" ? "الحملة: " : "Campagne: "} {order.utmCampaign}
                  </span>
                )}
              </div>
            </div>

            {order.offerTitle && (
              <div className="mt-3 border-t border-zinc-200 pt-2 text-xs font-semibold text-purple-700 dark:border-zinc-700 dark:text-purple-300">
                {locale === "ar" ? "العرض المختار: " : "Offre choisie : "}
                <span className="rounded bg-purple-100 px-2 py-0.5 dark:bg-purple-900/50">
                  {order.offerTitle}
                </span>
              </div>
            )}
          </div>

          {/* Ordered Products */}
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
              {locale === "ar" ? "المنتجات المطلوبة" : "Articles commandés"}
            </h3>
            <div className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3.5">
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    {item.image && (
                      <Image src={item.image} alt="" fill className="object-cover" sizes="60px" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-bold text-sm">{item.name[locale] || item.name.ar}</p>
                    <div className="mt-1 flex gap-2 text-xs text-zinc-500">
                      <span>
                        {locale === "ar" ? "المقاس: " : "Taille : "}
                        {item.size}
                      </span>
                      {item.color && (
                        <span>
                          · {locale === "ar" ? "اللون: " : "Couleur : "}
                          {item.color[locale] || item.color.ar}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-zinc-500">
                      {formatPrice(item.unitPrice, locale)} × {item.quantity}
                    </p>
                    <p className="font-serif font-bold text-sm">
                      {formatPrice(item.unitPrice * item.quantity, locale)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>{locale === "ar" ? "المجموع الفرعي" : "Sous-total"}</span>
                <span>{formatPrice(order.subtotal, locale)}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>{locale === "ar" ? "التوصيل" : "Livraison"}</span>
                <span>{formatPrice(order.shipping, locale)}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-2 font-serif text-base font-bold text-zinc-900 dark:border-zinc-800 dark:text-zinc-100">
                <span>{locale === "ar" ? "المبلغ الإجمالي للدفع" : "Total à payer"}</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {formatPrice(order.total, locale)}
                </span>
              </div>
            </div>
          </div>

          {/* Status update */}
          <div className="flex items-center justify-between rounded-xl bg-purple-50 p-4 dark:bg-purple-950/20">
            <span className="text-xs font-bold text-purple-900 dark:text-purple-300">
              {locale === "ar" ? "تغيير حالة الطلب:" : "Changer le statut :"}
            </span>

            <select
              value={order.status}
              onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
              className="rounded-lg border border-purple-200 bg-white px-3 py-1.5 text-xs font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-purple-800 dark:bg-zinc-800 dark:text-purple-200"
            >
              <option value="pending">{locale === "ar" ? "جديد (قيد الانتظار)" : "Nouveau (En attente)"}</option>
              <option value="pending_confirmation">{locale === "ar" ? "قيد التأكيد" : "En confirmation"}</option>
              <option value="confirmed">{locale === "ar" ? "مؤكدة" : "Confirmée"}</option>
              <option value="customer_confirmed">{locale === "ar" ? "مؤكدة من قبل العميل" : "Confirmée par client"}</option>
              <option value="processing">{locale === "ar" ? "قيد المعالجة" : "En préparation"}</option>
              <option value="shipped">{locale === "ar" ? "عند شركة التوصيل" : "Chez livreur"}</option>
              <option value="delivered">{locale === "ar" ? "مكتملة" : "Livrée"}</option>
              <option value="cancelled">{locale === "ar" ? "ملغاة" : "Annulée"}</option>
              <option value="customer_cancelled">{locale === "ar" ? "ملغاة من قبل العميل" : "Annulée par client"}</option>
              <option value="no_answer">{locale === "ar" ? "لم يرد على الاتصال" : "Ne répond pas"}</option>
              <option value="postponed">{locale === "ar" ? "مؤجلة" : "Reportée"}</option>
              <option value="waiting_customer">{locale === "ar" ? "في انتظار اتصال العميل" : "En attente client"}</option>
              <option value="busy">{locale === "ar" ? "الخط مشغول" : "Ligne occupée"}</option>
              <option value="fake">{locale === "ar" ? "طلب مزيف" : "Fausse commande"}</option>
              <option value="duplicate">{locale === "ar" ? "مكرر" : "Doublon"}</option>
              <option value="returned">{locale === "ar" ? "مرجع" : "Retournée"}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
