"use client";

import Image from "next/image";
import { X, Phone, MapPin, Printer, User, Calendar, CheckCircle2, AlertCircle, Truck, Package, MessageSquare } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { useLocale } from "@/providers/locale-provider";
import { formatPrice } from "@/lib/utils";

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (status: OrderStatus) => void;
}

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onStatusChange,
}: OrderDetailModalProps) {
  const { locale, dict } = useLocale();

  if (!isOpen || !order) return null;

  const phoneClean = order.phone.replace(/[\s\-_]/g, "");
  const whatsappPhone = phoneClean.startsWith("0") ? `213${phoneClean.slice(1)}` : phoneClean;

  const statusColors: Record<OrderStatus, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300", text: "قيد الانتظار", label: "En attente" },
    confirmed: { bg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300", text: "مؤكد", label: "Confirmée" },
    processing: { bg: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300", text: "قيد المعالجة", label: "En préparation" },
    shipped: { bg: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300", text: "في التوصيل", label: "Expédiée" },
    delivered: { bg: "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300", text: "تم التوصيل", label: "Livrée" },
    cancelled: { bg: "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300", text: "ملغى", label: "Annulée" },
  };

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 dark:text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold">
                {locale === "ar" ? "طلب رقم" : "Commande"} #{order.reference}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  statusColors[order.status]?.bg
                }`}
              >
                {locale === "ar"
                  ? statusColors[order.status]?.text
                  : statusColors[order.status]?.label}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-zinc-500">
              {new Date(order.createdAt).toLocaleString(locale === "ar" ? "ar-DZ" : "fr-DZ")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300"
              title="طباعة وصل الطلب"
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
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Customer Details Box */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
              {locale === "ar" ? "بيانات العميل والتوصيل" : "Client & Livraison"}
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <User size={16} className="text-zinc-400" />
                <span className="font-bold">{order.customerName}</span>
              </div>

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

          {/* Ordered Products Table */}
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

          {/* Update Status Bar */}
          <div className="flex items-center justify-between rounded-xl bg-purple-50 p-4 dark:bg-purple-950/20">
            <span className="text-xs font-bold text-purple-900 dark:text-purple-300">
              {locale === "ar" ? "تغيير حالة الطلب:" : "Changer le statut :"}
            </span>

            <select
              value={order.status}
              onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
              className="rounded-lg border border-purple-200 bg-white px-3 py-1.5 text-xs font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-purple-800 dark:bg-zinc-800 dark:text-purple-200"
            >
              <option value="pending">{locale === "ar" ? "قيد الانتظار" : "En attente"}</option>
              <option value="confirmed">{locale === "ar" ? "مؤكد" : "Confirmée"}</option>
              <option value="processing">{locale === "ar" ? "قيد المعالجة" : "En préparation"}</option>
              <option value="shipped">{locale === "ar" ? "في التوصيل" : "Expédiée"}</option>
              <option value="delivered">{locale === "ar" ? "تم التوصيل" : "Livrée"}</option>
              <option value="cancelled">{locale === "ar" ? "ملغى" : "Annulée"}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
