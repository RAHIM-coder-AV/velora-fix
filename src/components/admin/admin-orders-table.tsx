"use client";

import { useEffect, useMemo, useRef, useState, Fragment } from "react";
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
  ChevronUp,
  Printer,
  Download,
  FileText,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Save,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Order, OrderStatus, TrafficSource } from "@/types";
import { useLocale } from "@/providers/locale-provider";
import { formatPrice, timeAgo } from "@/lib/utils";
import { OrderDetailModal } from "@/components/admin/order-detail-modal";
import { TrafficSourceBadge } from "@/components/admin/traffic-source-badge";
import { DispatchErrorModal } from "@/components/admin/dispatch-error-modal";
import { openCustomerWhatsApp } from "@/lib/notifications/order-notifier";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settings-store";
import { useCatalogStore } from "@/stores/catalog-store";
import { toast } from "@/components/ui/toast";

interface AdminOrdersTableProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
}

interface FloatingDropdownState {
  orderId: string;
  top: number;
  left?: number;
  right?: number;
  openUpwards: boolean;
}

export function getOrderTrafficSource(order: Order): TrafficSource {
  return order.trafficSource || "direct";
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}

function OrderNoteEditor({ order, locale }: { order: Order; locale: string }) {
  const updateOrder = useCatalogStore((s) => s.updateOrder);
  const [noteText, setNoteText] = useState(order.notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setNoteText(order.notes || "");
  }, [order.notes]);

  async function handleSaveNote() {
    setIsSaving(true);
    try {
      const updated = { ...order, notes: noteText.trim() };
      await updateOrder(updated);
      setIsSaved(true);
      toast(locale === "ar" ? "✅ تم حفظ ملاحظات الطلب بنجاح!" : "✅ Note enregistrée !");
      setTimeout(() => setIsSaved(false), 2500);
    } catch {
      toast(locale === "ar" ? "حدث خطأ أثناء حفظ الملاحظة" : "Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="pt-2 border-t border-zinc-800 space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-zinc-400 text-[11px] font-bold flex items-center gap-1.5">
          <MessageSquare size={13} className="text-purple-400" />
          <span>{locale === "ar" ? "شريط الملاحظات على الطلب:" : "Notes sur la commande :"}</span>
        </label>
        {isSaved && (
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
            <Check size={11} /> {locale === "ar" ? "تم الحفظ" : "Enregistré"}
          </span>
        )}
      </div>
      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        rows={2}
        placeholder={locale === "ar" ? "أدخل ملاحظات حول هذا الطلب (مثال: طلب الاتصال بعد 2 زوالاً)..." : "Ajouter une note..."}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900/90 p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSaveNote}
          disabled={isSaving}
          className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-purple-700 active:scale-95 disabled:opacity-50"
        >
          <Save size={13} />
          <span>{isSaving ? (locale === "ar" ? "جاري الحفظ..." : "Enregistrement...") : (locale === "ar" ? "حفظ الملاحظة" : "Enregistrer")}</span>
        </button>
      </div>
    </div>
  );
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
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [bulkDispatching, setBulkDispatching] = useState<"ecotrack" | "nord_ouest" | null>(null);
  const [singleDispatching, setSingleDispatching] = useState<string | null>(null);
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message?: string; details?: string } | null>(null);
  const dispatchingOrderIds = useRef(new Set<string>());
  
  // Floating dropdown state (fixed position attached to viewport to avoid table overflow clipping)
  const [floatingDropdown, setFloatingDropdown] = useState<FloatingDropdownState | null>(null);
  const [bulkStatusToChange, setBulkStatusToChange] = useState<OrderStatus>("confirmed");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Pagination state (10 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, sourceFilter, searchQuery]);

  // Close floating dropdown on scroll or window resize (ignore scroll inside the menu itself)
  useEffect(() => {
    function handleScrollOrResize(e: Event) {
      if (!floatingDropdown) return;
      const target = e.target as HTMLElement | null;
      if (target && typeof target.closest === "function" && target.closest(".floating-status-menu")) {
        return; // Do not close if scrolling inside the dropdown menu!
      }
      setFloatingDropdown(null);
    }
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [floatingDropdown]);

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

    const source = getOrderTrafficSource(o).toLowerCase();
    let matchesSource = true;
    if (sourceFilter === "direct") {
      matchesSource = source === "direct" || !source;
    } else if (sourceFilter === "meta") {
      matchesSource = source.includes("meta") || source.includes("facebook") || source.includes("instagram") || source === "fb" || source === "ig";
    } else if (sourceFilter === "tiktok") {
      matchesSource = source.includes("tiktok") || source.includes("tt");
    } else if (sourceFilter === "snapchat") {
      matchesSource = source.includes("snap") || source.includes("sc");
    } else if (sourceFilter === "google") {
      matchesSource = source.includes("google") || source.includes("gads");
    }

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      o.customerName.toLowerCase().includes(query) ||
      o.phone.includes(query) ||
      o.wilaya.toLowerCase().includes(query) ||
      o.reference.toLowerCase().includes(query) ||
      (o.trackingCode && o.trackingCode.toLowerCase().includes(query)) ||
      (o.notes && o.notes.toLowerCase().includes(query));
    return matchesStatus && matchesSource && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  const statusBadges: Record<OrderStatus, { bg: string; text: string; label: string; icon: LucideIcon }> = {
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

  const statusDropdownOptions: { status: OrderStatus; labelAr: string; labelFr: string; icon: LucideIcon }[] = [
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

  // Open/toggle dropdown menu with fixed viewport coordinates
  function handleToggleDropdown(e: React.MouseEvent<HTMLButtonElement>, orderId: string) {
    e.stopPropagation();
    if (floatingDropdown?.orderId === orderId) {
      setFloatingDropdown(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const dropdownHeight = 360;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpwards = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

    if (locale === "ar") {
      const right = Math.max(12, Math.min(window.innerWidth - 275, window.innerWidth - rect.right));
      setFloatingDropdown({
        orderId,
        top: openUpwards ? rect.top - 6 : rect.bottom + 6,
        right,
        openUpwards,
      });
    } else {
      const left = Math.max(12, Math.min(window.innerWidth - 275, rect.left));
      setFloatingDropdown({
        orderId,
        top: openUpwards ? rect.top - 6 : rect.bottom + 6,
        left,
        openUpwards,
      });
    }
  }

  function handleOrderStatusChange(orderId: string, newStatus: OrderStatus) {
    onStatusChange(orderId, newStatus);
    setFloatingDropdown(null);
  }

  function toggleSelectAll() {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    }
  }

  function toggleSelectOrder(id: string) {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  // Single Order Dispatch
  async function handleSingleDispatch(order: Order, company: "ecotrack" | "nord_ouest") {
    const cfg = company === "ecotrack" ? ecotrack : nordEtOuest;
    const label = company === "ecotrack" ? "EcoTrack" : "Nord Et Ouest";

    if (!cfg?.enabled || !cfg.token) {
      setErrorModal({
        isOpen: true,
        message: locale === "ar" ? "حدث خطأ أثناء الإرسال" : "Une erreur est survenue lors de l'envoi.",
        details:
          locale === "ar"
            ? `يرجى ضبط وتفعيل ربط ${label} في الإعدادات أولاً.`
            : `Configurez et activez ${label} dans les paramètres d'abord.`,
      });
      return;
    }

    setSingleDispatching(order.id);
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
        try {
          await updateOrderDelivery(order.id, {
            deliveryCompany: company,
            trackingCode: tracking,
            status: "shipped",
            labelUrl: result.labelUrl,
          });
          onStatusChange(order.id, "shipped");
          toast(
            locale === "ar"
              ? `تم رفع الطلب بنجاح إلى ${label}! كود التتبع: ${tracking}`
              : `Commande expédiée via ${label} ! Suivi : ${tracking}`
          );
        } catch {
          toast(
            locale === "ar"
              ? `أُنشئت الشحنة (${tracking}) لكن تعذر حفظها محلياً. لا تعاود الرفع.`
              : `Expédiée (${tracking}), mais la sauvegarde a échoué.`
          );
        }
      } else {
        const errorMsg =
          result?.error ||
          data.error ||
          (locale === "ar"
            ? "تعذر إتمام الإرسال لدى شركة التوصيل."
            : "Échec de l'envoi.");
        setErrorModal({
          isOpen: true,
          message: locale === "ar" ? "حدث خطأ أثناء الإرسال" : "Une erreur est survenue lors de l'envoi.",
          details: errorMsg,
        });
      }
    } catch {
      setErrorModal({
        isOpen: true,
        message: locale === "ar" ? "حدث خطأ أثناء الإرسال" : "Une erreur est survenue lors de l'envoi.",
        details: locale === "ar" ? `فشل الاتصال بخادم ${label}` : `Erreur de connexion ${label}`,
      });
    } finally {
      setSingleDispatching(null);
    }
  }

  // Bulk Dispatch
  async function handleBulkDispatch(company: "ecotrack" | "nord_ouest") {
    const cfg = company === "ecotrack" ? ecotrack : nordEtOuest;
    const label = company === "ecotrack" ? "EcoTrack" : "Nord Et Ouest";

    if (!cfg?.enabled || !cfg.token) {
      setErrorModal({
        isOpen: true,
        message: locale === "ar" ? "حدث خطأ أثناء الإرسال" : "Une erreur est survenue lors de l'envoi.",
        details:
          locale === "ar"
            ? `يرجى ضبط وتفعيل ربط ${label} في الإعدادات أولاً.`
            : `Configurez et activez ${label} dans les paramètres d'abord.`,
      });
      return;
    }

    const selectedOrders = orders.filter((o) => selectedOrderIds.includes(o.id));
    if (selectedOrders.length === 0) {
      toast(locale === "ar" ? "يرجى تحديد طلب واحد على الأقل" : "Sélectionnez au moins une commande");
      return;
    }

    setBulkDispatching(company);
    try {
      const ordersPayload = selectedOrders.map((o) => ({
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
      }));

      const res = await fetch("/api/delivery/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          token: cfg.token,
          baseUrl: cfg.baseUrl,
          orders: ordersPayload,
        }),
      });

      const data = await res.json();
      const results: Array<{ orderId?: string; success: boolean; trackingCode?: string; labelUrl?: string; error?: string }> = data.results || [];

      let successCount = 0;
      let failCount = 0;
      let persistenceFailureCount = 0;
      const failedOrderIds: string[] = [];

      for (const order of selectedOrders) {
        const result = results.find((r) => r.orderId === order.id);
        if (!result?.success || typeof result.trackingCode !== "string") {
          failCount++;
          failedOrderIds.push(order.id);
          continue;
        }
        successCount++;
        try {
          await updateOrderDelivery(order.id, {
            deliveryCompany: company,
            trackingCode: result.trackingCode,
            status: "shipped",
            labelUrl: result.labelUrl,
          });
          onStatusChange(order.id, "shipped");
        } catch {
          persistenceFailureCount++;
        }
      }

      if (failCount > 0) {
        const firstErr = results.find((r) => !r.success && r.error)?.error;
        setErrorModal({
          isOpen: true,
          message: locale === "ar" ? "حدث خطأ أثناء الإرسال" : "Une erreur est survenue lors de l'envoi.",
          details: firstErr || (locale === "ar" ? `فشل إرسال ${failCount} طلب إلى ${label}.` : `Échec de l'envoi de ${failCount} commande(s).`),
        });
      } else {
        toast(
          locale === "ar"
            ? `تم إنشاء ${successCount} شحنة بنجاح لدى ${label}.`
            : `${successCount} envoi(s) créé(s) par ${label}.`
        );
      }
      setSelectedOrderIds(failedOrderIds);
    } catch {
      setErrorModal({
        isOpen: true,
        message: locale === "ar" ? "حدث خطأ أثناء الإرسال" : "Une erreur est survenue lors de l'envoi.",
        details: locale === "ar" ? `فشل الاتصال بخادم ${label}` : `Erreur de connexion ${label}`,
      });
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

    const headers = ["Reference", "Date", "Customer", "Phone", "Wilaya", "Commune", "Address", "Notes", "Total", "Status", "DeliveryCompany", "TrackingCode"];
    const rows = listToExport.map((o) => [
      `"${o.reference}"`,
      `"${new Date(o.createdAt).toLocaleDateString()}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      `"${o.wilaya.replace(/"/g, '""')}"`,
      `"${o.commune.replace(/"/g, '""')}"`,
      `"${(o.address || "").replace(/"/g, '""')}"`,
      `"${(o.notes || "").replace(/"/g, '""')}"`,
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
    selectedOrderIds.forEach((id) => handleOrderStatusChange(id, bulkStatusToChange));
    toast(locale === "ar" ? `تم تحديث حالة ${selectedOrderIds.length} طلب!` : `Statut mis à jour pour ${selectedOrderIds.length} commandes !`);
    setSelectedOrderIds([]);
  }

  const activeFloatingOrder = floatingDropdown ? orders.find((o) => o.id === floatingDropdown.orderId) : null;

  return (
    <div className="space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative min-w-0 flex-1 max-w-sm">
          <Search size={16} className="absolute start-3 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder={locale === "ar" ? "بحث برقم الهاتف، الاسم، الولاية، الملاحظات..." : "Rechercher par nom, tél, wilaya, note..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white py-2 ps-9 pe-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-900"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          {/* Status Filters */}
          <div className="flex flex-nowrap items-center gap-1.5 overflow-x-auto overscroll-x-contain pb-1 text-xs">
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
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition shrink-0",
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

          {/* Traffic Source Platform Filters */}
          <div className="flex flex-nowrap items-center gap-1.5 overflow-x-auto overscroll-x-contain text-xs">
            <span className="text-[11px] font-bold text-zinc-400 shrink-0">
              {locale === "ar" ? "مصدر الطلب:" : "Source :"}
            </span>
            {[
              { id: "all", label: locale === "ar" ? "الكل" : "Tous", icon: null },
              { id: "direct", label: locale === "ar" ? "مباشر" : "Direct", icon: "direct" as const },
              { id: "meta", label: "Meta Ads", icon: "meta" as const },
              { id: "tiktok", label: "TikTok Ads", icon: "tiktok" as const },
              { id: "snapchat", label: "Snapchat Ads", icon: "snapchat" as const },
              { id: "google", label: "Google", icon: "google" as const },
            ].map((src) => {
              const isActive = sourceFilter === src.id;
              const count = src.id === "all"
                ? orders.length
                : orders.filter((o) => {
                    const s = getOrderTrafficSource(o).toLowerCase();
                    if (src.id === "direct") return s === "direct" || !s;
                    if (src.id === "meta") return s.includes("meta") || s.includes("facebook") || s.includes("instagram") || s === "fb" || s === "ig";
                    if (src.id === "tiktok") return s.includes("tiktok") || s.includes("tt");
                    if (src.id === "snapchat") return s.includes("snap") || s.includes("sc");
                    if (src.id === "google") return s.includes("google") || s.includes("gads");
                    return false;
                  }).length;

              return (
                <button
                  key={src.id}
                  onClick={() => setSourceFilter(src.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition shrink-0 border",
                    isActive
                      ? "bg-zinc-900 border-purple-500 text-purple-300 dark:bg-purple-950/40 dark:border-purple-500/80"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                  )}
                >
                  {src.icon && <TrafficSourceBadge source={src.icon} size="sm" />}
                  <span>{src.label}</span>
                  <span className="rounded-full bg-zinc-200/60 px-1 text-[9px] font-bold dark:bg-zinc-800">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex w-full flex-wrap items-center gap-2 text-xs font-bold text-zinc-700 sm:w-auto dark:text-zinc-300">
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

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
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
          <div className="flex flex-wrap items-center gap-1">
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
      <div className="max-w-full overflow-x-auto overscroll-x-contain rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full min-w-[760px] border-collapse text-right text-xs">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
              <th className="py-3.5 px-4 text-center w-10">
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
              paginatedOrders.map((o) => {
                const firstItem = o.items[0];
                const badge = statusBadges[o.status] || statusBadges.pending;
                const BadgeIcon = badge.icon;
                const isSelected = selectedOrderIds.includes(o.id);
                const isExpanded = expandedOrderId === o.id;
                const phoneClean = o.phone.replace(/[\s\-_]/g, "");

                return (
                  <Fragment key={o.id}>
                    {/* Main Row */}
                    <tr
                      className={cn(
                        "transition hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 cursor-pointer",
                        isSelected && "bg-purple-50/40 dark:bg-purple-950/20",
                        isExpanded && "bg-zinc-50/90 dark:bg-zinc-800/60 border-b-transparent"
                      )}
                      onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOrder(o.id)}
                          className="rounded border-zinc-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>

                      {/* Product Thumbnail with Traffic Source Badge */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="relative h-10 w-10 flex-shrink-0 overflow-visible">
                            <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
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
                            {/* Floating Platform Badge (Meta / TikTok / Snap) */}
                            <div className="absolute -top-1.5 -start-1.5 z-10">
                              <TrafficSourceBadge source={getOrderTrafficSource(o)} size="sm" />
                            </div>
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
                              onClick={(e) => {
                                e.stopPropagation();
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
                      <td className="py-3.5 px-3" onClick={(e) => e.stopPropagation()}>
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

                      {/* Status Badge + Custom Dropdown Menu */}
                      <td className="py-3.5 px-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => handleToggleDropdown(e, o.id)}
                          className={cn(
                            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold shadow-xs transition hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
                            badge.bg
                          )}
                        >
                          <BadgeIcon size={12} />
                          <span>{badge.text}</span>
                          <ChevronDown size={11} className="opacity-70" />
                        </button>
                      </td>

                      {/* Total Price */}
                      <td className="py-3.5 px-3 font-serif font-bold text-zinc-900 dark:text-zinc-100">
                        {formatPrice(o.total, locale)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                            className={cn(
                              "flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold transition",
                              isExpanded
                                ? "bg-purple-700 text-white"
                                : "text-zinc-600 hover:bg-zinc-100 hover:text-purple-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            )}
                            title={locale === "ar" ? "عرض / إخفاء تفاصيل وملاحظات الطلب" : "Afficher les détails et notes"}
                          >
                            <Eye size={14} />
                            <span>{locale === "ar" ? "التفاصيل" : "Détails"}</span>
                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
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

                    {/* Inline Expanded Row matching screenshot */}
                    {isExpanded && (
                      <tr className="bg-[#141416] border-b border-zinc-800 text-zinc-200">
                        <td colSpan={9} className="p-4 sm:p-5">
                          <div className="grid gap-4 lg:grid-cols-3">
                            
                            {/* Col 1: Ordered Products Specs */}
                            <div className="rounded-xl border border-zinc-800 bg-[#1a1a1e] p-4 space-y-3">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                                <span>📦</span>
                                <span>{locale === "ar" ? "المنتجات والمواصفات" : "Produits & Spécifications"}</span>
                              </h4>
                              <div className="space-y-3">
                                {o.items.map((item) => (
                                  <div key={item.id} className="flex items-start gap-3 rounded-lg border border-zinc-800/80 bg-[#222228] p-3">
                                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                                      {item.image ? (
                                        <Image src={item.image} alt="" fill className="object-cover" sizes="56px" />
                                      ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs">📦</div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0 text-xs space-y-1">
                                      <p className="font-bold text-zinc-100 truncate">{item.name[locale] || item.name.ar}</p>
                                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-zinc-400">
                                        {item.size && <div><span className="text-zinc-500">{locale === "ar" ? "المقاس: " : "Taille: "}</span><span className="font-semibold text-zinc-200">{item.size}</span></div>}
                                        {item.color && <div><span className="text-zinc-500">{locale === "ar" ? "اللون: " : "Couleur: "}</span><span className="font-semibold text-zinc-200">{item.color[locale] || item.color.ar}</span></div>}
                                        <div><span className="text-zinc-500">{locale === "ar" ? "الكمية: " : "Qté: "}</span><span className="font-bold text-purple-300">{item.quantity}</span></div>
                                        <div><span className="text-zinc-500">{locale === "ar" ? "السعر: " : "Prix: "}</span><span className="font-bold text-emerald-400">{formatPrice(item.unitPrice, locale)}</span></div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Col 2: Customer Data + Notes Section */}
                            <div className="rounded-xl border border-zinc-800 bg-[#1a1a1e] p-4 space-y-3">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                                <span>👤</span>
                                <span>{locale === "ar" ? "بيانات العميل والملاحظات" : "Client & Notes"}</span>
                              </h4>
                              
                              <div className="space-y-2 text-xs">
                                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                                  <span className="text-zinc-400">{locale === "ar" ? "الاسم الكامل:" : "Nom :"}</span>
                                  <span className="font-bold text-zinc-100">{o.customerName}</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                                  <span className="text-zinc-400">{locale === "ar" ? "رقم الهاتف:" : "Téléphone :"}</span>
                                  <a href={`tel:${phoneClean}`} className="font-mono font-bold text-emerald-400 hover:underline">
                                    {o.phone}
                                  </a>
                                </div>
                                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                                  <span className="text-zinc-400">{locale === "ar" ? "الولاية والبلدية:" : "Wilaya / Commune :"}</span>
                                  <span className="font-medium text-zinc-200">{o.wilaya} — {o.commune || ""}</span>
                                </div>
                                {o.address && (
                                  <div className="border-b border-zinc-800 pb-2">
                                    <span className="text-zinc-400 block text-[10px]">{locale === "ar" ? "العنوان:" : "Adresse :"}</span>
                                    <span className="font-medium text-zinc-300">{o.address}</span>
                                  </div>
                                )}

                                {/* Customer Notes / Remarks (لائحة وشريط الملاحظات) */}
                                <OrderNoteEditor order={o} locale={locale} />

                                {/* WhatsApp Customer Quick Messaging Bar */}
                                <div className="pt-2 border-t border-zinc-800">
                                  <span className="text-zinc-400 block text-[10px] font-bold mb-1.5 flex items-center gap-1">
                                    <span className="text-emerald-400">💬</span>
                                    <span>{locale === "ar" ? "إرسال إشعار للعميل عبر الواتساب:" : "Notifier le client sur WhatsApp :"}</span>
                                  </span>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => openCustomerWhatsApp(o, "received")}
                                      className="flex items-center justify-center gap-1 rounded-lg bg-emerald-950/60 border border-emerald-800/80 px-2 py-1.5 text-[10px] font-bold text-emerald-300 hover:bg-emerald-900/80 transition"
                                      title="إرسال رسالة تم استلام طلبك بنجاح"
                                    >
                                      <span>📩</span>
                                      <span>{locale === "ar" ? "استلام الطلب" : "Reçu"}</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => openCustomerWhatsApp(o, "confirmed")}
                                      className="flex items-center justify-center gap-1 rounded-lg bg-teal-950/60 border border-teal-800/80 px-2 py-1.5 text-[10px] font-bold text-teal-300 hover:bg-teal-900/80 transition"
                                      title="إرسال رسالة تم تأكيد طلبك"
                                    >
                                      <span>✅</span>
                                      <span>{locale === "ar" ? "تم التأكيد" : "Confirmé"}</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => openCustomerWhatsApp(o, "shipped")}
                                      className="flex items-center justify-center gap-1 rounded-lg bg-blue-950/60 border border-blue-800/80 px-2 py-1.5 text-[10px] font-bold text-blue-300 hover:bg-blue-900/80 transition"
                                      title="إرسال رسالة طلبك في الطريق مع كود التتبع"
                                    >
                                      <span>🚚</span>
                                      <span>{locale === "ar" ? "في الطريق" : "En route"}</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => openCustomerWhatsApp(o, "arrived")}
                                      className="flex items-center justify-center gap-1 rounded-lg bg-amber-950/60 border border-amber-800/80 px-2 py-1.5 text-[10px] font-bold text-amber-300 hover:bg-amber-900/80 transition"
                                      title="إرسال رسالة طردك وصل إلى ولايتك جاهز للاستلام"
                                    >
                                      <span>📦</span>
                                      <span>{locale === "ar" ? "وصل للولاية" : "Arrivé"}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Col 3: Order Lifecycle, Totals & Quick Actions */}
                            <div className="rounded-xl border border-zinc-800 bg-[#1a1a1e] p-4 flex flex-col justify-between space-y-4">
                              <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                                  <span>💳</span>
                                  <span>{locale === "ar" ? "ملخص الحساب والحالة" : "Paiement & Statut"}</span>
                                </h4>

                                <div className="space-y-1.5 text-xs">
                                  <div className="flex justify-between text-zinc-400">
                                    <span>{locale === "ar" ? "قيمة المنتجات:" : "Sous-total :"}</span>
                                    <span>{formatPrice(o.subtotal, locale)}</span>
                                  </div>
                                  <div className="flex justify-between text-zinc-400">
                                    <span>{locale === "ar" ? "رسوم التوصيل:" : "Livraison :"}</span>
                                    <span>{formatPrice(o.shipping, locale)}</span>
                                  </div>
                                  <div className="flex justify-between border-t border-zinc-800 pt-2 font-bold text-sm text-zinc-100">
                                    <span>{locale === "ar" ? "المجموع الكلي:" : "Total :"}</span>
                                    <span className="text-emerald-400 font-serif">{formatPrice(o.total, locale)}</span>
                                  </div>
                                </div>

                                <div className="rounded-lg bg-zinc-900/90 border border-zinc-800 p-2.5 text-[11px] text-zinc-400 space-y-1">
                                  <div className="flex justify-between">
                                    <span>{locale === "ar" ? "استلام الطلب:" : "Reçu le :"}</span>
                                    <span className="font-mono text-zinc-200">{new Date(o.createdAt).toLocaleString(locale === "ar" ? "ar-DZ" : "fr-DZ")}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>{locale === "ar" ? "طريقة الاستلام:" : "Mode :"}</span>
                                    <span className="font-bold text-zinc-200">{o.isStopdesk ? (locale === "ar" ? "مكتب Stop Desk" : "Stop Desk") : (locale === "ar" ? "توصيل للمنزل" : "À domicile")}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800">
                                <button
                                  type="button"
                                  onClick={() => setSelectedOrder(o)}
                                  className="flex-1 min-h-9 flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
                                >
                                  <Eye size={14} />
                                  <span>{locale === "ar" ? "تعديل الطلب والرفع" : "Modifier & Expédier"}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleToggleDropdown(e, o.id)}
                                  className="min-h-9 px-3 flex items-center gap-1 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition"
                                >
                                  <span>{locale === "ar" ? "تغيير الحالة" : "Changer statut"}</span>
                                  <ChevronDown size={12} />
                                </button>
                              </div>

                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls (10 orders per page) */}
      {filteredOrders.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-xs text-zinc-500">
            {locale === "ar"
              ? `عرض ${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, filteredOrders.length)} من إجمالي ${filteredOrders.length} طلب`
              : `Affichage de ${(currentPage - 1) * pageSize + 1} à ${Math.min(currentPage * pageSize, filteredOrders.length)} sur ${filteredOrders.length} commandes`}
          </div>

          <div className="flex items-center gap-1.5" dir="ltr">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
              title={locale === "ar" ? "الصفحة السابقة" : "Précédent"}
            >
              ‹
            </button>

            {getPageNumbers(currentPage, totalPages).map((p, idx) => {
              if (p === "...") {
                return (
                  <span key={`dots-${idx}`} className="px-1 text-xs text-zinc-400">
                    ...
                  </span>
                );
              }
              const isCurr = p === currentPage;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p as number)}
                  className={cn(
                    "flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-bold transition",
                    isCurr
                      ? "bg-purple-600 text-white shadow-xs"
                      : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                  )}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
              title={locale === "ar" ? "الصفحة التالية" : "Suivant"}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* Floating Status & Dispatch Dropdown Menu (Fixed in Viewport to never be clipped) */}
      {floatingDropdown && activeFloatingOrder && (
        <>
          {/* Transparent Backdrop to close */}
          <div
            className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[1px]"
            onClick={() => setFloatingDropdown(null)}
          />

          {/* Floating Menu */}
          <div
            style={{
              position: "fixed",
              top: floatingDropdown.openUpwards ? "auto" : `${floatingDropdown.top}px`,
              bottom: floatingDropdown.openUpwards ? `${window.innerHeight - floatingDropdown.top}px` : "auto",
              left: floatingDropdown.left !== undefined ? `${floatingDropdown.left}px` : "auto",
              right: floatingDropdown.right !== undefined ? `${floatingDropdown.right}px` : "auto",
            }}
            className="floating-status-menu custom-scrollbar z-[9999] max-h-[380px] w-64 max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded-2xl border border-zinc-700/80 bg-[#1c1a22] p-2 text-zinc-100 shadow-2xl backdrop-blur-md"
            dir={locale === "ar" ? "rtl" : "ltr"}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="px-2 py-1 mb-1 text-[10px] font-bold text-zinc-400 border-b border-zinc-800">
              {locale === "ar" ? "تغيير حالة الطلب:" : "Changer le statut :"}
            </div>

            {/* Standard Statuses */}
            <div className="space-y-0.5">
              {statusDropdownOptions.map((opt) => {
                const OptIcon = opt.icon;
                const isCurrent = activeFloatingOrder.status === opt.status;
                return (
                  <button
                    key={opt.status}
                    type="button"
                    onClick={() => {
                      handleOrderStatusChange(activeFloatingOrder.id, opt.status);
                      toast(
                        locale === "ar"
                          ? `تم تغيير حالة الطلب إلى "${opt.labelAr}"`
                          : `Statut changé en "${opt.labelFr}"`
                      );
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition text-start",
                      isCurrent
                        ? "bg-purple-600/40 text-purple-300 font-bold border border-purple-500/40"
                        : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
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
            <div className="my-2 border-t border-zinc-800" />

            {/* Delivery Companies Direct Dispatch Options */}
            <div className="space-y-1">
              <div className="px-2 py-0.5 text-[10px] font-bold text-zinc-400">
                {locale === "ar" ? "الرفع المباشر لشركات التوصيل:" : "Expédition directe :"}
              </div>

              {/* Ecotrack dispatch */}
              <button
                type="button"
                disabled={singleDispatching === activeFloatingOrder.id}
                onClick={() => {
                  setFloatingDropdown(null);
                  void handleSingleDispatch(activeFloatingOrder, "ecotrack");
                }}
                className="flex w-full items-center gap-2 rounded-xl bg-emerald-950/50 border border-emerald-700/60 px-2.5 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-900/70 text-start"
              >
                {singleDispatching === activeFloatingOrder.id ? (
                  <span className="animate-spin text-sm">⏳</span>
                ) : (
                  <Truck size={14} className="text-emerald-400" />
                )}
                <span>{locale === "ar" ? "رفع إلى شركة التوصيل Ecotrack" : "Expédier via EcoTrack"}</span>
              </button>

              {/* Nord Et Ouest dispatch */}
              <button
                type="button"
                disabled={singleDispatching === activeFloatingOrder.id}
                onClick={() => {
                  setFloatingDropdown(null);
                  void handleSingleDispatch(activeFloatingOrder, "nord_ouest");
                }}
                className="flex w-full items-center gap-2 rounded-xl bg-blue-950/50 border border-blue-700/60 px-2.5 py-2 text-xs font-bold text-blue-300 transition hover:bg-blue-900/70 text-start"
              >
                {singleDispatching === activeFloatingOrder.id ? (
                  <span className="animate-spin text-sm">⏳</span>
                ) : (
                  <Truck size={14} className="text-blue-400" />
                )}
                <span>{locale === "ar" ? "رفع إلى شركة التوصيل Nord Et Ouest" : "Expédier via Nord Et Ouest"}</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={(newStatus) => {
            handleOrderStatusChange(selectedOrder.id, newStatus);
            setSelectedOrder({ ...selectedOrder, status: newStatus });
          }}
          onOrderSaved={setSelectedOrder}
        />
      )}

      {/* Dispatch Error Modal */}
      <DispatchErrorModal
        isOpen={Boolean(errorModal?.isOpen)}
        onClose={() => setErrorModal(null)}
        message={errorModal?.message}
        details={errorModal?.details}
      />
    </div>
  );
}
