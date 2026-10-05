"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  LogOut,
  Settings,
  Bell,
  Palette,
  Warehouse,
  ChevronLeft,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useCatalogStore } from "@/stores/catalog-store";
import { useLocale } from "@/providers/locale-provider";
import { formatPrice } from "@/lib/utils";
import { AdminOrdersTable } from "@/components/admin/admin-orders-table";
import { AdminAbandonedCheckouts } from "@/components/admin/admin-abandoned-checkouts";
import { isUndeliveredOrder } from "@/lib/orders/abandoned";
import { AdminProductsTable } from "@/components/admin/admin-products-table";
import { AdminHomepageEditor } from "@/components/admin/admin-homepage-editor";
import { AdminSettingsView } from "@/components/admin/admin-settings-view";
import { cn } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/configured";
import { getLocalProductsToImport } from "@/lib/catalog/catalog-sync";
import { products as seedProducts } from "@/lib/catalog/seed";
import { errorMessage } from "@/lib/errors";

type AdminTab = "stats" | "orders" | "abandoned" | "products" | "settings";

export default function AdminPage() {
  const { locale } = useLocale();
  const ready = useAuthStore((s) => s.ready);
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  const products = useCatalogStore((s) => s.products);
  const categories = useCatalogStore((s) => s.categories);
  const catalogLoadState = useCatalogStore((s) => s.catalogLoadState);
  const refreshCatalog = useCatalogStore((s) => s.refresh);
  const orders = useCatalogStore((s) => s.orders);
  const abandonedCheckouts = useCatalogStore((s) => s.abandonedCheckouts);
  const upsertProduct = useCatalogStore((s) => s.upsertProduct);
  const deleteProduct = useCatalogStore((s) => s.deleteProduct);
  const deleteAllProducts = useCatalogStore((s) => s.deleteAllProducts);
  const toggleProductActive = useCatalogStore((s) => s.toggleProductActive);
  const importLocalProducts = useCatalogStore((s) => s.importLocalProducts);
  const upsertCategory = useCatalogStore((s) => s.upsertCategory);
  const deleteCategory = useCatalogStore((s) => s.deleteCategory);
  const setOrderStatus = useCatalogStore((s) => s.setOrderStatus);
  const deleteOrder = useCatalogStore((s) => s.deleteOrder);
  const refreshOrders = useCatalogStore((s) => s.refreshOrders);
  const refreshAbandonedCheckouts = useCatalogStore((s) => s.refreshAbandonedCheckouts);

  const [activeTab, setActiveTab] = useState<AdminTab>("orders");
  const [adminLoginError, setAdminLoginError] = useState("");

  async function loginDemoAdmin() {
    setAdminLoginError("");
    try {
      const error = await login("admin@velora.dz", "admin123");
      if (error) {
        setAdminLoginError(
          locale === "ar"
            ? "تعذر الدخول بالحساب التجريبي. استخدم حسابًا مسجلًا، وتأكد من تعيين role إلى admin في profiles."
            : "Le compte démo est indisponible. Utilisez un compte enregistré dont le rôle profiles est admin.",
        );
        console.error("Admin demo login failed", error);
        return;
      }
      if (useAuthStore.getState().user?.role !== "admin") {
        setAdminLoginError(
          locale === "ar"
            ? "تم تسجيل الدخول، لكن هذا الحساب ليس مديرًا. يجب تعيين role إلى admin في جدول profiles."
            : "Connecté, mais ce compte n’est pas administrateur. Définissez role sur admin dans profiles.",
        );
      }
    } catch (error) {
      console.error("Admin login failed", error);
      setAdminLoginError(errorMessage(error));
    }
  }

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
            onClick={() => void loginDemoAdmin()}
            className="mt-6 w-full rounded-xl bg-purple-600 py-3 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition hover:bg-purple-700 active:scale-95"
          >
            {locale === "ar" ? "الدخول الفوري كمدير (Demo Admin)" : "Accès direct Admin (Démo)"}
          </button>
          {adminLoginError ? (
            <p className="mt-3 text-xs text-red-700 dark:text-red-300" role="alert">
              {adminLoginError}
            </p>
          ) : null}
          {isSupabaseConfigured() ? (
            <Link href={`/${locale}/login`} className="mt-4 inline-block text-xs font-semibold text-purple-700 underline dark:text-purple-300">
              {locale === "ar" ? "تسجيل الدخول بحساب آخر" : "Se connecter avec un autre compte"}
            </Link>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-[#111111] pb-20 text-zinc-100">
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
      <aside
        className={cn(
          "fixed inset-y-0 z-40 hidden w-64 flex-col border-zinc-800 bg-[#191719] lg:flex",
          locale === "ar" ? "right-0 border-l" : "left-0 border-r",
        )}
      >
        <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-300/40 bg-purple-500/15 font-serif text-xl text-purple-300">V</div>
          <div className="min-w-0">
            <p className="truncate font-serif text-lg font-semibold tracking-[0.16em]">VELORA</p>
            <p className="text-[10px] text-zinc-500">{locale === "ar" ? "إدارة المتجر" : "Administration"}</p>
          </div>
        </div>
        <div className="border-b border-zinc-800 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-400/20 text-sm font-bold text-purple-200">
              {(user?.fullName || "V").slice(0, 1)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.fullName || "Velora Admin"}</p>
              <p className="text-[11px] text-zinc-500">{locale === "ar" ? "مدير المتجر" : "Administrateur"}</p>
            </div>
          </div>
          <Link
            href={`/${locale}`}
            target="_blank"
            className="mt-4 flex min-h-10 items-center justify-center gap-2 rounded-full bg-purple-400/20 px-3 text-xs font-semibold text-purple-200 transition hover:bg-purple-400/30"
          >
            <ExternalLink size={14} />
            {locale === "ar" ? "زيارة المتجر" : "Visiter la boutique"}
          </Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 text-sm">
          {([
            { tab: "stats", label: locale === "ar" ? "الرئيسية" : "Accueil", icon: LayoutDashboard },
            { tab: "orders", label: locale === "ar" ? "الطلبات" : "Commandes", icon: ShoppingBag, count: orders.length },
            { tab: "abandoned", label: locale === "ar" ? "الطلبات المتروكة" : "Commandes abandonnées", icon: AlertTriangle, count: abandonedCheckouts.length + orders.filter((order) => isUndeliveredOrder(order.status)).length },
            { tab: "products", label: locale === "ar" ? "المنتجات" : "Produits", icon: Package, count: products.length },
            { tab: "products", label: locale === "ar" ? "تصميم المتجر" : "Design du magasin", icon: Palette, anchor: "homepage-editor" },
            { tab: "products", label: locale === "ar" ? "إدارة المخزون" : "Stock", icon: Warehouse },
            { tab: "settings", label: locale === "ar" ? "الإعدادات" : "Paramètres", icon: Settings },
          ] as const).map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab && (item.tab !== "products" || index === 3);
            return (
              <button
                key={`${item.label}-${index}`}
                type="button"
                onClick={() => {
                  setActiveTab(item.tab);
                  if ("anchor" in item) {
                    window.setTimeout(() => document.getElementById(item.anchor)?.scrollIntoView({ behavior: "smooth" }), 80);
                  }
                }}
                className={cn(
                  "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-start transition",
                  isActive
                    ? "bg-purple-700/60 font-semibold text-white"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white",
                )}
              >
                <Icon size={17} className={isActive ? "text-purple-200" : "text-zinc-400"} />
                <span className="flex-1">{item.label}</span>
                {"count" in item && (
                  <span className="rounded-full bg-purple-400/25 px-2 py-0.5 text-[10px] text-purple-200">{item.count}</span>
                )}
                {isActive && <ChevronLeft size={14} className="text-purple-200" />}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-zinc-800 p-3">
          <button
            type="button"
            onClick={() => void logout()}
            className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-zinc-400 transition hover:bg-red-950/40 hover:text-red-300"
          >
            <LogOut size={16} />
            {locale === "ar" ? "تسجيل الخروج" : "Déconnexion"}
          </button>
        </div>
      </aside>

      <div className={cn("min-h-screen", locale === "ar" ? "lg:pr-64" : "lg:pl-64")}>
        <header className="sticky top-0 z-30 border-b border-zinc-800 bg-[#141414]/95 backdrop-blur-md">
          <div className="flex min-h-[68px] items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/20 font-serif text-lg text-purple-200 lg:hidden">V</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-100">{user?.fullName || "Velora Admin"}</p>
                <p className="text-[11px] text-zinc-500">{locale === "ar" ? "لوحة إدارة المتجر" : "Espace de gestion"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/${locale}`} target="_blank" className="hidden min-h-10 items-center gap-2 rounded-full border border-zinc-700 px-4 text-xs font-semibold text-zinc-300 hover:border-purple-400 hover:text-white sm:flex">
                <ExternalLink size={14} />
                {locale === "ar" ? "زيارة المتجر" : "Voir la boutique"}
              </Link>
              <button type="button" onClick={() => void logout()} className="rounded-lg border border-zinc-700 p-2 text-zinc-400 hover:bg-red-950/40 hover:text-red-300 lg:hidden" aria-label={locale === "ar" ? "تسجيل الخروج" : "Déconnexion"}>
                <LogOut size={16} />
              </button>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-zinc-800 px-3 py-2 lg:hidden">
            {([
              { tab: "stats", label: locale === "ar" ? "الرئيسية" : "Accueil", icon: LayoutDashboard },
              { tab: "orders", label: locale === "ar" ? "الطلبات" : "Commandes", icon: ShoppingBag },
              { tab: "abandoned", label: locale === "ar" ? "المتروكة" : "Abandonnées", icon: AlertTriangle },
              { tab: "products", label: locale === "ar" ? "المنتجات" : "Produits", icon: Package },
              { tab: "settings", label: locale === "ar" ? "الإعدادات" : "Paramètres", icon: Settings },
            ] as const).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.tab}
                  type="button"
                  onClick={() => setActiveTab(item.tab)}
                  className={cn(
                    "flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-semibold",
                    activeTab === item.tab ? "bg-purple-700 text-white" : "text-zinc-400 hover:bg-zinc-800",
                  )}
                >
                  <Icon size={14} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </header>

      {/* Main Content Area */}
      <main className="mx-auto min-w-0 max-w-[1800px] px-3 pt-4 sm:px-5 sm:pt-6 xl:px-8">
        <div className="mb-5 rounded-xl border border-zinc-800 bg-[#181818] px-4 py-4 sm:mb-6 sm:px-6 sm:py-5">
          <h1 className="text-lg font-bold text-purple-300 sm:text-xl">
            {activeTab === "orders"
              ? locale === "ar" ? "إدارة الطلبات" : "Gestion des commandes"
              : activeTab === "abandoned"
                ? locale === "ar" ? "الطلبات المتروكة" : "Commandes abandonnées"
                : activeTab === "products"
                  ? locale === "ar" ? "إدارة المنتجات وتصميم المتجر" : "Produits et design du magasin"
                  : activeTab === "settings"
                    ? locale === "ar" ? "إعدادات المتجر" : "Paramètres du magasin"
                    : locale === "ar" ? "الرئيسية والإحصائيات" : "Accueil et statistiques"}
          </h1>
          <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
            {activeTab === "orders"
              ? locale === "ar" ? "مراقبة وإدارة طلبات الزبائن في متجرك" : "Suivez et gérez les commandes de votre boutique"
              : activeTab === "products"
                ? locale === "ar" ? "إدارة المنتجات والفئات والمخزون وتخصيص واجهة المتجر" : "Gérez les produits, catégories, stocks et contenu de la boutique"
                : locale === "ar" ? "نظرة واضحة على نشاط المتجر وإعداداته" : "Vue d’ensemble de l’activité et des paramètres"}
          </p>
        </div>
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
            {catalogLoadState === "error" ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200" role="alert">
                <span>
                  {locale === "ar"
                    ? "تعذر تحميل المنتجات المحفوظة؛ لم تُحذف المنتجات المحلية."
                    : "Impossible de charger les produits enregistrés ; les produits locaux sont conservés."}
                </span>
                <button
                  type="button"
                  onClick={() => void refreshCatalog().catch((error) => console.error("Catalog refresh failed", error))}
                  className="rounded-lg border border-red-400 px-3 py-1.5 font-bold"
                >
                  {locale === "ar" ? "إعادة المحاولة" : "Réessayer"}
                </button>
              </div>
            ) : null}
            {isSupabaseConfigured() && getLocalProductsToImport(products, seedProducts).length > 0 ? (
              <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100" role="status">
                {locale === "ar"
                  ? `توجد ${getLocalProductsToImport(products, seedProducts).length} منتجات مخصصة محلية لم تُحفظ في قاعدة البيانات. يمكنك استيرادها بأمان من زر الاستيراد؛ المنتجات التجريبية والمكررة مستبعدة.`
                  : `${getLocalProductsToImport(products, seedProducts).length} produit(s) personnalisé(s) sont locaux et absents de la base. Utilisez l’import sécurisé ; les exemples et doublons sont exclus.`}
              </p>
            ) : null}
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

            <AdminHomepageEditor products={products} categories={categories} />
            <AdminProductsTable
              products={products}
              categories={categories}
              localImportCount={getLocalProductsToImport(products, seedProducts).length}
              onImportLocalProducts={importLocalProducts}
              onUpsertProduct={upsertProduct}
              onDeleteProduct={deleteProduct}
              onDeleteAllProducts={deleteAllProducts}
              onToggleActive={toggleProductActive}
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

        {activeTab === "settings" && (
          <AdminSettingsView
            categories={categories}
            onSaveCategory={upsertCategory}
            onDeleteCategory={deleteCategory}
            onOpenHomepage={() => {
              setActiveTab("products");
              window.setTimeout(() => document.getElementById("homepage-editor")?.scrollIntoView({ behavior: "smooth" }), 100);
            }}
          />
        )}
      </main>
      </div>
    </div>
  );
}
