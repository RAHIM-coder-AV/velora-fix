"use client";

import { Clock, Phone, ShoppingBag } from "lucide-react";
import type { AbandonedCheckout, Order, OrderStatus } from "@/types";
import { isUndeliveredOrder } from "@/lib/orders/abandoned";
import { useLocale } from "@/providers/locale-provider";
import { formatPrice, timeAgo } from "@/lib/utils";

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
