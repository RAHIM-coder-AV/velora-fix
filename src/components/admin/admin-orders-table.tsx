"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, Eye, Trash2, CheckCircle2, Clock, Truck, Check, AlertCircle, XCircle, Filter, Search, Printer, Download } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { useLocale } from "@/providers/locale-provider";
import { formatPrice, timeAgo } from "@/lib/utils";
import { OrderDetailModal } from "@/components/admin/order-detail-modal";
import { cn } from "@/lib/utils";

interface AdminOrdersTableProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
}

export function AdminOrdersTable({
  orders,
  onStatusChange,
  onDeleteOrder,
}: AdminOrdersTableProps) {
  const { locale } = useLocale();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      o.customerName.toLowerCase().includes(query) ||
      o.phone.includes(query) ||
      o.wilaya.toLowerCase().includes(query) ||
      o.reference.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const statusBadges: Record<OrderStatus, { bg: string; text: string; label: string; icon: any }> = {
    pending: {
      bg: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
      text: "قيد الانتظار",
      label: "En attente",
      icon: Clock,
    },
    confirmed: {
      bg: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
      text: "مؤكد",
      label: "Confirmée",
      icon: CheckCircle2,
    },
    processing: {
      bg: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
      text: "قيد المعالجة",
      label: "En préparation",
      icon: Clock,
    },
    shipped: {
      bg: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
      text: "في التوصيل",
      label: "Expédiée",
      icon: Truck,
    },
    delivered: {
      bg: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
      text: "تم التوصيل",
      label: "Livrée",
      icon: Check,
    },
    cancelled: {
      bg: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
      text: "ملغى",
      label: "Annulée",
      icon: XCircle,
    },
  };

  function toggleSelectAll() {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    }
  }

  function toggleSelectOrder(id: string) {
    if (selectedOrderIds.includes(id)) {
      setSelectedOrderIds(selectedOrderIds.filter((item) => item !== id));
    } else {
      setSelectedOrderIds([...selectedOrderIds, id]);
    }
  }

  return (
    <div className="space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute start-3 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder={locale === "ar" ? "بحث برقم الهاتف أو اسم العميل..." : "Rechercher par nom ou tél..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white py-2 ps-9 pe-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-900"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: "all", label: locale === "ar" ? "الكل" : "Tous", count: orders.length },
            { id: "pending", label: locale === "ar" ? "قيد الانتظار" : "En attente", count: orders.filter((o) => o.status === "pending").length },
            { id: "confirmed", label: locale === "ar" ? "مؤكدة" : "Confirmées", count: orders.filter((o) => o.status === "confirmed").length },
            { id: "shipped", label: locale === "ar" ? "في التوصيل" : "Expédiées", count: orders.filter((o) => o.status === "shipped" || o.status === "processing").length },
            { id: "delivered", label: locale === "ar" ? "تم التوصيل" : "Livrées", count: orders.filter((o) => o.status === "delivered").length },
            { id: "cancelled", label: locale === "ar" ? "ملغاة" : "Annulées", count: orders.filter((o) => o.status === "cancelled").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition",
                statusFilter === tab.id
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
              )}
            >
              <span>{tab.label}</span>
              <span className="rounded-full bg-black/10 px-1.5 py-0.2 text-[10px] font-bold">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full border-collapse text-right text-xs">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
              <th className="py-3.5 px-4 text-center">
                <input
                  type="checkbox"
                  checked={
                    filteredOrders.length > 0 &&
                    selectedOrderIds.length === filteredOrders.length
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-zinc-300 text-purple-600 focus:ring-purple-500"
                />
              </th>
              <th className="py-3.5 px-3">{locale === "ar" ? "المنتج" : "Produit"}</th>
              <th className="py-3.5 px-3">{locale === "ar" ? "العميل" : "Client"}</th>
              <th className="py-3.5 px-3">{locale === "ar" ? "رقم الهاتف" : "Téléphone"}</th>
              <th className="py-3.5 px-3">{locale === "ar" ? "تاريخ الطلب" : "Date"}</th>
              <th className="py-3.5 px-3">{locale === "ar" ? "الولاية" : "Wilaya"}</th>
              <th className="py-3.5 px-3">{locale === "ar" ? "حالة الطلب" : "Statut"}</th>
              <th className="py-3.5 px-3">{locale === "ar" ? "المجموع" : "Total"}</th>
              <th className="py-3.5 px-4 text-center">{locale === "ar" ? "الإجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-sm text-zinc-400">
                  {locale === "ar" ? "لا توجد طلبات مطابقة." : "Aucune commande trouvée."}
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => {
                const firstItem = o.items[0];
                const badge = statusBadges[o.status] || statusBadges.pending;
                const BadgeIcon = badge.icon;
                const isSelected = selectedOrderIds.includes(o.id);
                const phoneClean = o.phone.replace(/[\s\-_]/g, "");

                return (
                  <tr
                    key={o.id}
                    className={cn(
                      "transition hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40",
                      isSelected && "bg-purple-50/40 dark:bg-purple-950/20"
                    )}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOrder(o.id)}
                        className="rounded border-zinc-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>

                    {/* Product Thumbnail */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                          {firstItem?.image ? (
                            <Image
                              src={firstItem.image}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400">
                              📦
                            </div>
                          )}
                        </div>
                        {o.items.length > 1 && (
                          <span className="rounded bg-zinc-200 px-1 py-0.5 text-[10px] font-bold dark:bg-zinc-700">
                            +{o.items.length - 1}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Customer Name */}
                    <td className="py-3.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">
                      <div>{o.customerName}</div>
                      <div className="text-[10px] font-mono text-zinc-400">{o.reference}</div>
                    </td>

                    {/* Phone Number with Click-to-Call */}
                    <td className="py-3.5 px-3">
                      <a
                        href={`tel:${phoneClean}`}
                        className="inline-flex items-center gap-1 font-mono font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                        dir="ltr"
                      >
                        <Phone size={12} />
                        <span>{o.phone}</span>
                      </a>
                    </td>

                    {/* Time Ago (Matching Screenshot) */}
                    <td className="py-3.5 px-3 text-zinc-500 dark:text-zinc-400">
                      {timeAgo(o.createdAt, locale)}
                    </td>

                    {/* Wilaya */}
                    <td className="py-3.5 px-3 font-medium text-zinc-700 dark:text-zinc-300">
                      {o.wilaya}
                    </td>

                    {/* Status Badge + Dropdown for quick update */}
                    <td className="py-3.5 px-3">
                      <div className="relative inline-block">
                        <select
                          value={o.status}
                          onChange={(e) => onStatusChange(o.id, e.target.value as OrderStatus)}
                          className={cn(
                            "cursor-pointer appearance-none rounded-full border px-3 py-1 pe-7 text-[11px] font-bold shadow-xs transition focus:outline-none focus:ring-2 focus:ring-purple-500",
                            badge.bg
                          )}
                        >
                          <option value="pending">{locale === "ar" ? "قيد الانتظار" : "En attente"}</option>
                          <option value="confirmed">{locale === "ar" ? "مؤكد" : "Confirmée"}</option>
                          <option value="processing">{locale === "ar" ? "قيد المعالجة" : "En préparation"}</option>
                          <option value="shipped">{locale === "ar" ? "في التوصيل" : "Expédiée"}</option>
                          <option value="delivered">{locale === "ar" ? "تم التوصيل" : "Livrée"}</option>
                          <option value="cancelled">{locale === "ar" ? "ملغى" : "Annulée"}</option>
                        </select>
                        <BadgeIcon
                          size={12}
                          className="pointer-events-none absolute end-2.5 top-2 opacity-70"
                        />
                      </div>
                    </td>

                    {/* Total Price */}
                    <td className="py-3.5 px-3 font-serif font-bold text-zinc-900 dark:text-zinc-100">
                      {formatPrice(o.total, locale)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(o)}
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-purple-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
                          title={locale === "ar" ? "تفاصيل الطلب" : "Détails"}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteOrder(o.id)}
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                          title={locale === "ar" ? "حذف" : "Supprimer"}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={(newStatus) => {
            onStatusChange(selectedOrder.id, newStatus);
            setSelectedOrder({ ...selectedOrder, status: newStatus });
          }}
        />
      )}
    </div>
  );
}
