"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  LogOut,
  Users,
  Settings,
  Bell,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useCatalogStore } from "@/stores/catalog-store";
import { useLocale } from "@/providers/locale-provider";
import { formatPrice } from "@/lib/utils";
import { totalStock } from "@/lib/catalog/queries";
import { AdminOrdersTable } from "@/components/admin/admin-orders-table";
import { AdminAbandonedCheckouts } from "@/components/admin/admin-abandoned-checkouts";
import { isUndeliveredOrder } from "@/lib/orders/abandoned";
import { AdminProductsTable } from "@/components/admin/admin-products-table";
import { AdminSettingsView } from "@/components/admin/admin-settings-view";
import { cn } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/configured";

type AdminTab = "stats" | "orders" | "abandoned" | "products" | "settings";

export default function AdminPage() {
  const { locale, dict } = useLocale();
  const ready = useAuthStore((s) => s.ready);
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const products = useCatalogStore((s) => s.products);
  const categories = useCatalogStore((s) => s.categories);
  const orders = useCatalogStore((s) => s.orders);
  const abandonedCheckouts = useCatalogStore((s) => s.abandonedCheckouts);
  const upsertProduct = useCatalogStore((s) => s.upsertProduct);
  const deleteProduct = useCatalogStore((s) => s.deleteProduct);
  const toggleProductActive = useCatalogStore((s) => s.toggleProductActive);
  const setOrderStatus = useCatalogStore((s) => s.setOrderStatus);
  const deleteOrder = useCatalogStore((s) => s.deleteOrder);
  const refreshOrders = useCatalogStore((s) => s.refreshOrders);
  const refreshAbandonedCheckouts = useCatalogStore((s) => s.refreshAbandonedCheckouts);

  const [activeTab, setActiveTab] = useState<AdminTab>("orders");

  useEffect(() => {
    if (ready && user?.role === "admin") {
      void refreshOrders(true);
      void refreshAbandonedCheckouts().catch((error) => {
        console.error("Failed to load abandoned checkout records", error);
      });
    }
  }, [ready, user?.role, refreshOrders, refreshAbandonedCheckouts]);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (o.status !== "cancelled" ? o.total : 0), 0),
    [orders]
  );

  const pendingOrdersCount = useMemo(
    () => orders.filter((o) => o.status === "pending" || o.status === "processing").length,
    [orders]
  );

  const lowStockCount = useMemo(
    () => products.filter((p) => totalStock(p) < 5).length,
    [products]
  );

  // If user is not yet logged in as admin, provide 1-click demo admin login
  if (ready && (!user || user.role !== "admin")) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            <ShieldCheck size={28} />
          </div>
          <h2 className="mt-4 font-serif text-2xl font-bold">
            {locale === "ar" ? "لوحة تحكم المتجر" : "Administration du magasin"}
          </h2>
          <p className="mt-2 text-xs text-zinc-500">
            {locale === "ar"
              ? "يرجى تسجيل الدخول للوصول إلى إدارة الطلبات وتعديل المنتجات والأسعار والعروض"
              : "Connectez-vous pour gérer les commandes, prix et offres."}
          </p>

          <button
            onClick={() => void login("admin@velora.dz", "admin123")}
            className="mt-6 w-full rounded-xl bg-purple-600 py-3 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition hover:bg-purple-700 active:scale-95"
          >
            {locale === "ar" ? "الدخول الفوري كمدير (Demo Admin)" : "Accès direct Admin (Démo)"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 dark:bg-zinc-950">
      {!isSupabaseConfigured() && (
        <div className="mx-auto max-w-7xl px-3 pt-3 sm:px-6" role="alert">
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
            <p className="font-bold">
              {locale === "ar" ? "المتجر غير متصل بقاعدة بيانات مشتركة" : "La boutique n’est pas reliée à une base de données"}
            </p>
            <p className="mt-1">
              {locale === "ar"
                ? "المنتجات التي تحفظها هنا تبقى في هذا المتصفح فقط ولا تظهر للعملاء على أجهزتهم. اربط Supabase في إعدادات النشر لحفظها ومشاركتها."
                : "Les produits enregistrés ici restent dans ce navigateur et ne sont pas visibles par les clients sur leurs appareils. Configurez Supabase dans le déploiement pour les enregistrer et les partager."}
            </p>
          </div>
        </div>
      )}
      {/* Admin Top Header Navigation */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95">
        <div className="mx-auto flex min-w-0 max-w-7xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-3 py-3 sm:flex-nowrap sm:px-6">
          {/* Brand & Store Link */}
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 font-bold text-white shadow-md shadow-purple-600/30">
              V
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2">
                <span className="truncate font-serif text-sm font-bold sm:text-base">Velora Admin</span>
                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                  لوحة التحكم
                </span>
              </div>
              <p className="truncate text-[10px] text-zinc-500">
                {user?.fullName || "Abderrahim kouriche"}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/${locale}`}
              target="_blank"
              className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 shadow-xs transition hover:bg-zinc-50 hover:text-purple-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <ExternalLink size={13} />
              <span>{locale === "ar" ? "زيارة المتجر" : "Voir le magasin"}</span>
            </Link>

            <button
              onClick={() => void logout()}
              className="rounded-xl border border-zinc-200 p-2 text-zinc-500 transition hover:bg-red-50 hover:text-red-600 dark:border-zinc-800 dark:hover:bg-red-950/30"
              title={locale === "ar" ? "تسجيل الخروج" : "Déconnexion"}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar (Matching Screenshot Style) */}
        <div className="mx-auto flex max-w-7xl overflow-x-auto px-4 sm:px-6">
          <nav className="flex w-max min-w-full gap-2 py-1 text-xs">
            <button
              onClick={() => setActiveTab("orders")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 font-bold transition",
                activeTab === "orders"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              )}
            >
              <ShoppingBag size={15} />
              <span>{locale === "ar" ? "الطلبات" : "Commandes"}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                  activeTab === "orders" ? "bg-white/20 text-white" : "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                )}
              >
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("abandoned")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 font-bold transition",
                activeTab === "abandoned"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              )}
            >
              <AlertTriangle size={15} />
              <span>{locale === "ar" ? "الطلبات المتروكة" : "Abandonnées"}</span>
              <span className={cn(
                "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                activeTab === "abandoned" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
              )}>
                {abandonedCheckouts.length + orders.filter((order) => isUndeliveredOrder(order.status)).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 font-bold transition",
                activeTab === "products"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              )}
            >
              <Package size={15} />
              <span>{locale === "ar" ? "المنتجات وتعديل الأسعار" : "Produits & Prix"}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                  activeTab === "products" ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                )}
              >
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("stats")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 font-bold transition",
                activeTab === "stats"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              )}
            >
              <LayoutDashboard size={15} />
              <span>{locale === "ar" ? "الإحصائيات" : "Tableau de bord"}</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 font-bold transition",
                activeTab === "settings"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              )}
            >
              <Settings size={15} />
              <span>{locale === "ar" ? "الإعدادات والربط" : "Paramètres & Intégrations"}</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto min-w-0 max-w-7xl px-3 pt-4 sm:px-6 sm:pt-6">
        {/* Quick KPI Overview Cards */}
        <div className="mb-5 grid grid-cols-2 gap-2 sm:mb-6 sm:gap-4 sm:grid-cols-4">
          <div className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xs sm:p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {locale === "ar" ? "المبيعات الإجمالية" : "Revenu"}
              </span>
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <p className="mt-2 font-serif text-xl font-black text-zinc-900 sm:text-2xl dark:text-zinc-100">
              {formatPrice(totalRevenue, locale)}
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xs sm:p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {locale === "ar" ? "إجمالي الطلبات" : "Commandes"}
              </span>
              <ShoppingBag size={16} className="text-purple-500" />
            </div>
            <p className="mt-2 font-serif text-xl font-black text-zinc-900 sm:text-2xl dark:text-zinc-100">
              {orders.length}
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xs sm:p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {locale === "ar" ? "قيد المعالجة" : "En cours"}
              </span>
              <Bell size={16} className="text-amber-500" />
            </div>
            <p className="mt-2 font-serif text-xl font-black text-zinc-900 sm:text-2xl dark:text-zinc-100">
              {pendingOrdersCount}
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xs sm:p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {locale === "ar" ? "إجمالي المنتجات" : "Produits"}
              </span>
              <Package size={16} className="text-blue-500" />
            </div>
            <p className="mt-2 font-serif text-xl font-black text-zinc-900 sm:text-2xl dark:text-zinc-100">
              {products.length}
            </p>
          </div>
        </div>

        {/* View Switcher based on Tab */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                  {locale === "ar" ? "إدارة الطلبات" : "Gestion des commandes"}
                </h1>
                <p className="text-xs text-zinc-500">
                  {locale === "ar"
                    ? "متابعة وتأكيد طلبات الزبائن وتغيير حالات التوصيل"
                    : "Suivi des commandes en direct, expédition et confirmation"}
                </p>
              </div>
            </div>

            <AdminOrdersTable
              orders={orders}
              onStatusChange={(id, status) => void setOrderStatus(id, status)}
              onDeleteOrder={(id) => deleteOrder(id)}
            />
          </div>
        )}

        {activeTab === "abandoned" && (
          <AdminAbandonedCheckouts drafts={abandonedCheckouts} orders={orders} />
        )}

        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                  {locale === "ar" ? "قائمة المنتجات وتعديل الأسعار والعروض" : "Gestion des produits"}
                </h1>
                <p className="text-xs text-zinc-500">
                  {locale === "ar"
                    ? "تعديل صور المنتجات، الأسعار، العروض الترويجية، المخزون، وتفعيل/تعطيل المنتجات"
                    : "Gérez les photos, prix, packs de réduction et le stock de votre boutique"}
                </p>
              </div>
            </div>

            <AdminProductsTable
              products={products}
              categories={categories}
              onUpsertProduct={(prod) => void upsertProduct(prod)}
              onDeleteProduct={(id) => void deleteProduct(id)}
              onToggleActive={(id) => toggleProductActive(id)}
            />
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
              {locale === "ar" ? "الإحصائيات ونشاط المتجر" : "Statistiques de vente"}
            </h1>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Best Selling Products */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  {locale === "ar" ? "أكثر المنتجات مشاهدة وطلباً" : "Produits populaires"}
                </h3>
                <div className="space-y-3">
                  {products.slice(0, 5).map((p) => (
                    <div key={p.id} className="flex items-center justify-between border-b border-zinc-100 pb-2.5 last:border-0 dark:border-zinc-800">
                      <div>
                        <p className="text-xs font-bold">{p.name[locale] || p.name.ar}</p>
                        <p className="text-[10px] text-zinc-400">SKU: {p.sku || "—"}</p>
                      </div>
                      <span className="font-serif text-xs font-bold text-emerald-600">
                        {formatPrice(p.price, locale)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  {locale === "ar" ? "آخر الطلبات المسجلة" : "Dernières commandes"}
                </h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((o) => (
                    <div key={o.id} className="flex items-center justify-between border-b border-zinc-100 pb-2.5 last:border-0 dark:border-zinc-800">
                      <div>
                        <p className="text-xs font-bold">{o.customerName}</p>
                        <p className="text-[10px] text-zinc-400">{o.wilaya} · {o.phone}</p>
                      </div>
                      <span className="font-serif text-xs font-bold text-purple-600">
                        {formatPrice(o.total, locale)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && <AdminSettingsView />}
      </main>
    </div>
  );
}
