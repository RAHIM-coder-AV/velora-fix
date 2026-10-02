"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Phone,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  Check,
  XCircle,
  Search,
  SendHorizonal,
  Copy,
  UserCheck,
  PhoneOff,
  CalendarClock,
  ShieldAlert,
  PhoneCall,
  PhoneForwarded,
  RotateCcw,
  CheckCheck,
  ChevronDown,
  Printer,
  Download,
  ExternalLink,
} from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { useLocale } from "@/providers/locale-provider";
import { formatPrice, timeAgo } from "@/lib/utils";
import { OrderDetailModal } from "@/components/admin/order-detail-modal";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settings-store";
import { useCatalogStore } from "@/stores/catalog-store";
import { toast } from "@/components/ui/toast";

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
  const ecotrack = useSettingsStore((s) => s.settings.ecotrack);
  const nordEtOuest = useSettingsStore((s) => s.settings.nordEtOuest);
  const updateOrderDelivery = useCatalogStore((s) => s.updateOrderDelivery);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [bulkDispatching, setBulkDispatching] = useState<"ecotrack" | "nord_ouest" | null>(null);
  const [singleDispatching, setSingleDispatching] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [bulkStatusToChange, setBulkStatusToChange] = useState<OrderStatus>("confirmed");

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    let matchesStatus = true;
    if (statusFilter === "pending") matchesStatus = o.status === "pending";
    else if (statusFilter === "pending_confirmation") matchesStatus = o.status === "pending_confirmation";
    else if (statusFilter === "confirmed") matchesStatus = o.status === "confirmed" || o.status === "customer_confirmed";
    else if (statusFilter === "shipped") matchesStatus = o.status === "shipped" || o.status === "processing";
    else if (statusFilter === "delivered") matchesStatus = o.status === "delivered";
    else if (statusFilter === "cancelled") matchesStatus = o.status === "cancelled" || o.status === "customer_cancelled" || o.status === "fake";
    else if (statusFilter === "returned") matchesStatus = o.status === "returned";
    else if (statusFilter !== "all") matchesStatus = o.status === statusFilter;

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      o.customerName.toLowerCase().includes(query) ||
      o.phone.includes(query) ||
      o.wilaya.toLowerCase().includes(query) ||
      o.reference.toLowerCase().includes(query) ||
      (o.trackingCode && o.trackingCode.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  const statusBadges: Record<OrderStatus, { bg: string; text: string; label: string; icon: any }> = {
    pending: {
      bg: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800",
      text: "جديد",
      label: "Nouveau",
      icon: Clock,
    },
    pending_confirmation: {
      bg: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
      text: "قيد التأكيد",
      label: "En confirmation",
      icon: Clock,
    },
    confirmed: {
      bg: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
      text: "مؤكدة",
      label: "Confirmée",
      icon: CheckCircle2,
    },
    customer_confirmed: {
      bg: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800",
      text: "مؤكدة من قبل العميل",
      label: "Confirmée par client",
      icon: UserCheck,
    },
    processing: {
      bg: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
      text: "قيد المعالجة",
      label: "En préparation",
      icon: Clock,
    },
    shipped: {
      bg: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
      text: "عند شركة التوصيل",
      label: "Chez livreur",
      icon: Truck,
    },
    delivered: {
      bg: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
      text: "مكتملة",
      label: "Livrée",
      icon: CheckCheck,
    },
    cancelled: {
      bg: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
      text: "ملغاة",
      label: "Annulée",
      icon: XCircle,
    },
    customer_cancelled: {
      bg: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
      text: "ملغاة من قبل العميل",
      label: "Annulée par client",
      icon: XCircle,
    },
    no_answer: {
      bg: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
      text: "لم يرد على الاتصال",
      label: "Ne répond pas",
      icon: PhoneOff,
    },
    postponed: {
      bg: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800",
      text: "مؤجلة",
      label: "Reportée",
      icon: CalendarClock,
    },
    busy: {
      bg: "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800",
      text: "الخط مشغول",
      label: "Ligne occupée",
      icon: PhoneForwarded,
    },
    waiting_customer: {
      bg: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
      text: "في انتظار اتصال العميل",
      label: "En attente client",
      icon: PhoneCall,
    },
    fake: {
      bg: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
      text: "طلب مزيف",
      label: "Fausse commande",
      icon: ShieldAlert,
    },
    duplicate: {
      bg: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
      text: "مكرر",
      label: "Doublon",
      icon: Copy,
    },
    returned: {
      bg: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 dark:bg-fuchsia-950/40 dark:text-fuchsia-300 dark:border-fuchsia-800",
      text: "مرجع",
      label: "Retournée",
      icon: RotateCcw,
    },
  };

  const statusDropdownOptions: { status: OrderStatus; labelAr: string; labelFr: string; icon: any }[] = [
    { status: "confirmed", labelAr: "مؤكدة", labelFr: "Confirmée", icon: CheckCircle2 },
    { status: "customer_confirmed", labelAr: "مؤكدة من قبل العميل", labelFr: "Confirmée par client", icon: UserCheck },
    { status: "no_answer", labelAr: "لم يرد على الاتصال", labelFr: "Ne répond pas", icon: PhoneOff },
    { status: "postponed", labelAr: "مؤجلة", labelFr: "Reportée", icon: CalendarClock },
    { status: "cancelled", labelAr: "ملغاة", labelFr: "Annulée", icon: XCircle },
    { status: "fake", labelAr: "مزيف", labelFr: "Faux", icon: ShieldAlert },
    { status: "duplicate", labelAr: "مكرر", labelFr: "Doublon", icon: Copy },
    { status: "customer_cancelled", labelAr: "ملغاة من قبل العميل", labelFr: "Annulée par client", icon: XCircle },
    { status: "waiting_customer", labelAr: "في انتظار اتصال العميل", labelFr: "En attente client", icon: PhoneCall },
    { status: "busy", labelAr: "الخط مشغول", labelFr: "Ligne occupée", icon: PhoneForwarded },
    { status: "shipped", labelAr: "عند شركة التوصيل", labelFr: "Chez livreur", icon: Truck },
    { status: "returned", labelAr: "مرجع", labelFr: "Retournée", icon: RotateCcw },
    { status: "delivered", labelAr: "مكتملة", labelFr: "Livrée", icon: CheckCheck },
  ];

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

  async function handleSingleDispatch(order: Order, company: "ecotrack" | "nord_ouest") {
    const cfg = company === "ecotrack" ? ecotrack : nordEtOuest;
    const label = company === "ecotrack" ? "EcoTrack" : "Nord Et Ouest";

    setSingleDispatching(order.id);
    try {
      const res = await fetch("/api/delivery/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          token: cfg?.token || "",
          baseUrl: cfg?.baseUrl || "",
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

      if (result?.success) {
        onStatusChange(order.id, "shipped");
        updateOrderDelivery(order.id, {
          deliveryCompany: company,
          trackingCode: result.trackingCode,
          status: "shipped",
          labelUrl: result.labelUrl,
        });
        toast(
          locale === "ar"
            ? `✅ تم رفع الطلب (${order.reference}) إلى ${label} بنجاح! كود التتبع: ${result.trackingCode}`
            : `✅ Commande envoyée à ${label} ! Suivi: ${result.trackingCode}`
        );
      } else {
        toast(
          locale === "ar"
            ? `❌ تعذر رفع الطلب: ${result?.error || data.error || "خطأ"}`
            : `❌ Erreur: ${result?.error || data.error}`
        );
      }
    } catch {
      toast(locale === "ar" ? `فشل الاتصال بخادم ${label}` : `Erreur de connexion ${label}`);
    } finally {
      setSingleDispatching(null);
    }
  }

  async function handleBulkDispatch(company: "ecotrack" | "nord_ouest") {
    if (selectedOrderIds.length === 0) {
      toast(locale === "ar" ? "يرجى تحديد طلب واحد على الأقل" : "Veuillez sélectionner au moins une commande");
      return;
    }
    const cfg = company === "ecotrack" ? ecotrack : nordEtOuest;
    const label = company === "ecotrack" ? "EcoTrack" : "Nord Et Ouest";

    const ordersToDispatch = orders.filter((o) => selectedOrderIds.includes(o.id));

    setBulkDispatching(company);
    try {
      const res = await fetch("/api/delivery/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          token: cfg?.token || "",
          baseUrl: cfg?.baseUrl || "",
          orders: ordersToDispatch.map((o) => ({
            id: o.id,
            reference: o.reference,
            customerName: o.customerName,
            phone: o.phone,
            phone2: o.phone2 || "",
            wilaya: o.wilaya,
            commune: o.commune,
            address: o.address,
            total: o.total,
            shipping: o.shipping,
            isStopdesk: o.isStopdesk || false,
            notes: o.notes || "",
            items: o.items.map((i) => ({
              name: i.name,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
            })),
          })),
        }),
      });

      const data = await res.json();
      let successCount = 0;
      let failCount = 0;

      for (const result of data.results || []) {
        if (result.success) {
          successCount++;
          onStatusChange(result.orderId, "shipped");
          updateOrderDelivery(result.orderId, {
            deliveryCompany: company,
            trackingCode: result.trackingCode,
            status: "shipped",
          });
        } else {
          failCount++;
        }
      }

      toast(
        locale === "ar"
          ? `✅ تم رفع ${successCount} طلب إلى ${label}${failCount > 0 ? ` — ${failCount} طلب فشل` : ""}!`
          : `✅ ${successCount} commande(s) envoyée(s) à ${label}${failCount > 0 ? ` — ${failCount} échouée(s)` : ""}`
      );
      setSelectedOrderIds([]);
    } catch {
      toast(locale === "ar" ? `فشل الاتصال بخادم ${label}` : `Erreur de connexion ${label}`);
    } finally {
      setBulkDispatching(null);
    }
  }

  function handleExportCsv() {
    const listToExport = selectedOrderIds.length > 0
      ? orders.filter((o) => selectedOrderIds.includes(o.id))
      : filteredOrders;

    if (listToExport.length === 0) {
      toast(locale === "ar" ? "لا توجد طلبات للتصدير" : "Aucune commande à exporter");
      return;
    }

    const headers = ["Reference", "Date", "Customer", "Phone", "Wilaya", "Commune", "Address", "Total", "Status", "DeliveryCompany", "TrackingCode"];
    const rows = listToExport.map((o) => [
      `"${o.reference}"`,
      `"${new Date(o.createdAt).toLocaleDateString()}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      `"${o.wilaya.replace(/"/g, '""')}"`,
      `"${o.commune.replace(/"/g, '""')}"`,
      `"${(o.address || "").replace(/"/g, '""')}"`,
      o.total,
      `"${o.status}"`,
      `"${o.deliveryCompany || ""}"`,
      `"${o.trackingCode || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast(locale === "ar" ? `تم تصدير ${listToExport.length} طلب بنجاح!` : `Exporté ${listToExport.length} commandes !`);
  }

  function handlePrintSelected() {
    window.print();
  }

  function handleApplyBulkStatus() {
    if (selectedOrderIds.length === 0) {
      toast(locale === "ar" ? "يرجى تحديد طلب واحد على الأقل" : "Sélectionnez au moins une commande");
      return;
    }
    selectedOrderIds.forEach((id) => onStatusChange(id, bulkStatusToChange));
    toast(locale === "ar" ? `تم تحديث حالة ${selectedOrderIds.length} طلب!` : `Statut mis à jour pour ${selectedOrderIds.length} commandes !`);
    setSelectedOrderIds([]);
  }

  return (
    <div className="space-y-4">
      {/* Click outside overlay to close dropdown */}
      {openDropdownId && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setOpenDropdownId(null)}
        />
      )}

      {/* Top Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute start-3 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder={locale === "ar" ? "بحث برقم الهاتف، الاسم، الولاية، أو رقم التتبع..." : "Rechercher par nom, tél, wilaya, suivi..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white py-2 ps-9 pe-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-900"
          />
        </div>

        {/* Filter Badges matching screenshot */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: "all", label: locale === "ar" ? "الكل" : "Tous", count: orders.length },
            { id: "pending", label: locale === "ar" ? "جديد" : "Nouveau", count: orders.filter((o) => o.status === "pending").length },
            { id: "pending_confirmation", label: locale === "ar" ? "قيد التأكيد" : "En confirmation", count: orders.filter((o) => o.status === "pending_confirmation").length },
            { id: "confirmed", label: locale === "ar" ? "مؤكدة" : "Confirmées", count: orders.filter((o) => o.status === "confirmed" || o.status === "customer_confirmed").length },
            { id: "shipped", label: locale === "ar" ? "عند شركة التوصيل" : "Chez livreur", count: orders.filter((o) => o.status === "shipped" || o.status === "processing").length },
            { id: "delivered", label: locale === "ar" ? "مكتملة" : "Livrées", count: orders.filter((o) => o.status === "delivered").length },
            { id: "returned", label: locale === "ar" ? "مرجع" : "Retournées", count: orders.filter((o) => o.status === "returned").length },
            { id: "cancelled", label: locale === "ar" ? "ملغاة" : "Annulées", count: orders.filter((o) => o.status === "cancelled" || o.status === "customer_cancelled" || o.status === "fake").length },
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

      {/* Bulk Action Bar matching Screenshot style */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
          <span className="rounded-lg bg-purple-100 px-2 py-1 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
            {locale === "ar" ? `الطلبات المحددة: ${selectedOrderIds.length}` : `Sélectionnés : ${selectedOrderIds.length}`}
          </span>
          {selectedOrderIds.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedOrderIds([])}
              className="text-[11px] text-zinc-400 hover:text-red-500 hover:underline"
            >
              {locale === "ar" ? "إلغاء التحديد" : "Désélectionner"}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export button */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          >
            <Download size={13} />
            <span>{locale === "ar" ? "تصدير" : "Exporter"}</span>
          </button>

          {/* Print button */}
          <button
            type="button"
            onClick={handlePrintSelected}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          >
            <Printer size={13} />
            <span>{locale === "ar" ? "طباعة" : "Imprimer"}</span>
          </button>

          {/* Delivery Dispatch Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={selectedOrderIds.length === 0 || bulkDispatching !== null}
              onClick={() => handleBulkDispatch("ecotrack")}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50"
              title={locale === "ar" ? "رفع الطلبات المحددة إلى EcoTrack" : "Expédier vers EcoTrack"}
            >
              {bulkDispatching === "ecotrack" ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <Truck size={13} />
              )}
              <span>{locale === "ar" ? "رفع لـ EcoTrack" : "EcoTrack"}</span>
            </button>

            <button
              type="button"
              disabled={selectedOrderIds.length === 0 || bulkDispatching !== null}
              onClick={() => handleBulkDispatch("nord_ouest")}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50"
              title={locale === "ar" ? "رفع الطلبات المحددة إلى Nord Et Ouest" : "Expédier vers Nord Et Ouest"}
            >
              {bulkDispatching === "nord_ouest" ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <Truck size={13} />
              )}
              <span>{locale === "ar" ? "رفع لـ Nord Et Ouest" : "Nord Et Ouest"}</span>
            </button>
          </div>

          {/* Bulk Status Change */}
          <div className="flex items-center gap-1">
            <select
              value={bulkStatusToChange}
              onChange={(e) => setBulkStatusToChange(e.target.value as OrderStatus)}
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs font-medium focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
            >
              <option value="confirmed">{locale === "ar" ? "مؤكدة" : "Confirmée"}</option>
              <option value="shipped">{locale === "ar" ? "عند شركة التوصيل" : "Chez livreur"}</option>
              <option value="delivered">{locale === "ar" ? "مكتملة" : "Livrée"}</option>
              <option value="cancelled">{locale === "ar" ? "ملغاة" : "Annulée"}</option>
              <option value="no_answer">{locale === "ar" ? "لم يرد" : "Pas de réponse"}</option>
            </select>
            <button
              type="button"
              disabled={selectedOrderIds.length === 0}
              onClick={handleApplyBulkStatus}
              className="rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {locale === "ar" ? "تغيير الحالة" : "Appliquer"}
            </button>
          </div>
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
                const isDropdownOpen = openDropdownId === o.id;

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
                      {o.trackingCode && (
                        <div className="mt-1 inline-flex items-center gap-1 rounded-md bg-indigo-50 px-1.5 py-0.5 font-mono text-[9px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                          <Truck size={10} className="text-indigo-600" />
                          <span>{o.deliveryCompany === "nord_ouest" ? "NO:" : "ECO:"}</span>
                          <span>{o.trackingCode}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(o.trackingCode || "");
                              toast(locale === "ar" ? "تم نسخ كود التتبع!" : "Code copié !");
                            }}
                            className="ms-0.5 hover:text-indigo-900"
                            title={locale === "ar" ? "نسخ كود التتبع" : "Copier"}
                          >
                            <Copy size={9} />
                          </button>
                        </div>
                      )}
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

                    {/* Time Ago */}
                    <td className="py-3.5 px-3 text-zinc-500 dark:text-zinc-400">
                      {timeAgo(o.createdAt, locale)}
                    </td>

                    {/* Wilaya */}
                    <td className="py-3.5 px-3 font-medium text-zinc-700 dark:text-zinc-300">
                      {o.wilaya}
                    </td>

                    {/* Status Badge + Custom Dropdown Menu matching the user screenshot */}
                    <td className="py-3.5 px-3">
                      <div className="relative inline-block text-start">
                        {/* Status Button / Dropdown Trigger */}
                        <button
                          type="button"
                          onClick={() => setOpenDropdownId(isDropdownOpen ? null : o.id)}
                          className={cn(
                            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold shadow-xs transition hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
                            badge.bg
                          )}
                        >
                          <BadgeIcon size={12} />
                          <span>{badge.text}</span>
                          <ChevronDown size={11} className="opacity-70" />
                        </button>

                        {/* Interactive Dropdown Menu (Styled exactly as in reference screenshot) */}
                        {isDropdownOpen && (
                          <div
                            className="absolute start-0 top-full z-30 mt-1.5 w-64 max-h-80 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900 p-1.5 shadow-2xl text-zinc-200"
                            dir={locale === "ar" ? "rtl" : "ltr"}
                          >
                            {/* Standard Statuses */}
                            <div className="space-y-0.5">
                              {statusDropdownOptions.map((opt) => {
                                const OptIcon = opt.icon;
                                const isCurrent = o.status === opt.status;
                                return (
                                  <button
                                    key={opt.status}
                                    type="button"
                                    onClick={() => {
                                      onStatusChange(o.id, opt.status);
                                      setOpenDropdownId(null);
                                      toast(
                                        locale === "ar"
                                          ? `تم تغيير حالة الطلب إلى "${opt.labelAr}"`
                                          : `Statut changé en "${opt.labelFr}"`
                                      );
                                    }}
                                    className={cn(
                                      "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition hover:bg-zinc-800 text-start",
                                      isCurrent ? "bg-purple-600/30 text-purple-300 font-bold" : "text-zinc-300"
                                    )}
                                  >
                                    <OptIcon size={13} className={isCurrent ? "text-purple-400" : "text-zinc-400"} />
                                    <span className="flex-1">{locale === "ar" ? opt.labelAr : opt.labelFr}</span>
                                    {isCurrent && <Check size={12} className="text-purple-400" />}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Separator */}
                            <div className="my-1.5 border-t border-zinc-800" />

                            {/* Delivery Companies Direct Dispatch Options */}
                            <div className="space-y-1">
                              {/* Ecotrack dispatch */}
                              <button
                                type="button"
                                disabled={singleDispatching === o.id}
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  void handleSingleDispatch(o, "ecotrack");
                                }}
                                className="flex w-full items-center gap-2 rounded-lg bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-900/60 text-start"
                              >
                                {singleDispatching === o.id ? (
                                  <span className="animate-spin text-sm">⏳</span>
                                ) : (
                                  <Truck size={14} className="text-emerald-400" />
                                )}
                                <span>{locale === "ar" ? "رفع إلى شركة التوصيل Ecotrack" : "Expédier via EcoTrack"}</span>
                              </button>

                              {/* Nord Et Ouest dispatch */}
                              <button
                                type="button"
                                disabled={singleDispatching === o.id}
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  void handleSingleDispatch(o, "nord_ouest");
                                }}
                                className="flex w-full items-center gap-2 rounded-lg bg-blue-950/40 border border-blue-800/60 px-2.5 py-2 text-xs font-bold text-blue-300 transition hover:bg-blue-900/60 text-start"
                              >
                                {singleDispatching === o.id ? (
                                  <span className="animate-spin text-sm">⏳</span>
                                ) : (
                                  <Truck size={14} className="text-blue-400" />
                                )}
                                <span>{locale === "ar" ? "رفع إلى شركة التوصيل Nord Et Ouest" : "Expédier via Nord Et Ouest"}</span>
                              </button>
                            </div>
                          </div>
                        )}
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
                          title={locale === "ar" ? "تفاصيل الطلب ورفع الشحن" : "Détails"}
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
