"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Settings2,
  ChevronDown,
  ChevronUp,
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingDown,
  TrendingUp,
  Layers,
  Plus,
  Minus,
  Save,
  Edit2,
  ExternalLink,
  Download,
  RefreshCw,
  Eye,
  Check,
  X,
} from "lucide-react";
import type { Product, Category, ProductVariant } from "@/types";
import { useLocale } from "@/providers/locale-provider";
import { formatPrice, cn } from "@/lib/utils";
import { totalStock } from "@/lib/catalog/queries";
import { toast } from "@/components/ui/toast";
import { errorMessage } from "@/lib/errors";
import { ProductEditModal } from "@/components/admin/product-edit-modal";

interface AdminInventoryViewProps {
  products: Product[];
  categories: Category[];
  onUpsertProduct: (product: Product) => Promise<void>;
  onSetVariantStock?: (productId: string, variantId: string, stock: number) => Promise<void>;
}

export function AdminInventoryView({
  products,
  categories,
  onUpsertProduct,
  onSetVariantStock,
}: AdminInventoryViewProps) {
  const { locale } = useLocale();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<"all" | "in_stock" | "low_stock" | "out_of_stock">("all");
  const [sortBy, setSortBy] = useState<"default" | "stock_asc" | "stock_desc" | "name">("default");

  // UI Modals & Popovers
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDisplaySettings, setShowDisplaySettings] = useState(false);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [visibleColumns, setVisibleColumns] = useState({
    sku: true,
    quantity: true,
    price: true,
    variants: true,
    status: true,
  });

  // Expanded product rows
  const [expandedProductIds, setExpandedProductIds] = useState<Set<string>>(new Set());

  // Editing product modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // In-line editing states
  const [editingSkuId, setEditingSkuId] = useState<string | null>(null);
  const [tempSku, setTempSku] = useState<string>("");
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  // Variant editing state: Map of variantId -> temporary stock value
  const [variantStockChanges, setVariantStockChanges] = useState<Record<string, number>>({});

  // Toggle row expansion
  const toggleExpand = (productId: string) => {
    setExpandedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedProductIds(new Set(products.map((p) => p.id)));
  };

  const collapseAll = () => {
    setExpandedProductIds(new Set());
  };

  // KPI Calculations
  const stats = useMemo(() => {
    let totalStockCount = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let inStockCount = 0;

    for (const p of products) {
      const stock = totalStock(p);
      totalStockCount += stock;
      if (stock === 0) {
        outOfStockCount++;
      } else if (stock <= lowStockThreshold) {
        lowStockCount++;
      } else {
        inStockCount++;
      }
    }

    return {
      totalProducts: products.length,
      totalStockCount,
      lowStockCount,
      outOfStockCount,
      inStockCount,
    };
  }, [products, lowStockThreshold]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      // Search
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const matchesName =
          p.name.ar.toLowerCase().includes(q) ||
          p.name.fr.toLowerCase().includes(q);
        const matchesSku = p.sku?.toLowerCase().includes(q);
        const matchesVariantSku = p.variants?.some((v) =>
          v.sku.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesSku && !matchesVariantSku) return false;
      }

      // Category
      if (selectedCategory !== "all" && p.categoryId !== selectedCategory) {
        return false;
      }

      // Stock status
      const stock = totalStock(p);
      if (stockFilter === "in_stock" && stock <= lowStockThreshold) return false;
      if (stockFilter === "low_stock" && (stock === 0 || stock > lowStockThreshold)) return false;
      if (stockFilter === "out_of_stock" && stock !== 0) return false;

      return true;
    });

    // Sorting
    if (sortBy === "stock_asc") {
      result.sort((a, b) => totalStock(a) - totalStock(b));
    } else if (sortBy === "stock_desc") {
      result.sort((a, b) => totalStock(b) - totalStock(a));
    } else if (sortBy === "name") {
      result.sort((a, b) =>
        locale === "ar"
          ? a.name.ar.localeCompare(b.name.ar)
          : a.name.fr.localeCompare(b.name.fr)
      );
    }

    return result;
  }, [products, searchQuery, selectedCategory, stockFilter, sortBy, lowStockThreshold, locale]);

  // Adjust variant stock quickly
  const handleVariantStockChange = async (
    product: Product,
    variantId: string,
    newStock: number
  ) => {
    const validStock = Math.max(0, newStock);
    try {
      if (onSetVariantStock) {
        await onSetVariantStock(product.id, variantId, validStock);
      } else {
        const updatedVariants = product.variants.map((v) =>
          v.id === variantId ? { ...v, stock: validStock } : v
        );
        await onUpsertProduct({ ...product, variants: updatedVariants });
      }
      toast(
        locale === "ar"
          ? "تم تحديث كمية المخزون بنجاح"
          : "Stock de la variante mis à jour"
      );
    } catch (err) {
      console.error(err);
      toast(
        locale === "ar"
          ? `تعذر تحديث المخزون: ${errorMessage(err)}`
          : `Erreur de mise à jour: ${errorMessage(err)}`
      );
    }
  };

  // Adjust entire product stock uniformly across all variants
  const handleBulkProductStock = async (product: Product, delta: number) => {
    setLoadingProductId(product.id);
    try {
      const updatedVariants = product.variants.map((v) => ({
        ...v,
        stock: Math.max(0, v.stock + delta),
      }));
      await onUpsertProduct({ ...product, variants: updatedVariants });
      toast(
        locale === "ar"
          ? `تم تعديل مخزون جميع المتغيرات (${delta > 0 ? `+${delta}` : delta})`
          : `Stock de toutes les variantes modifié (${delta > 0 ? `+${delta}` : delta})`
      );
    } catch (err) {
      console.error(err);
      toast(
        locale === "ar"
          ? `تعذر تحديث المخزون: ${errorMessage(err)}`
          : `Erreur: ${errorMessage(err)}`
      );
    } finally {
      setLoadingProductId(null);
    }
  };

  // Save product SKU
  const handleSaveProductSku = async (product: Product) => {
    if (!tempSku.trim()) {
      setEditingSkuId(null);
      return;
    }
    setLoadingProductId(product.id);
    try {
      await onUpsertProduct({ ...product, sku: tempSku.trim() });
      toast(locale === "ar" ? "تم تحديث رمز SKU للمنتج" : "Code SKU du produit mis à jour");
      setEditingSkuId(null);
    } catch (err) {
      console.error(err);
      toast(locale === "ar" ? "تعذر حفظ SKU" : "Erreur de sauvegarde SKU");
    } finally {
      setLoadingProductId(null);
    }
  };

  // Export Inventory as CSV
  const exportInventoryCSV = () => {
    const headers = [
      locale === "ar" ? "معرف المنتج" : "Product ID",
      locale === "ar" ? "اسم المنتج" : "Product Name",
      locale === "ar" ? "رمز SKU للمنتج" : "Product SKU",
      locale === "ar" ? "المقاس" : "Size",
      locale === "ar" ? "اللون" : "Color",
      locale === "ar" ? "رمز SKU للمتغير" : "Variant SKU",
      locale === "ar" ? "الكمية بالمخزون" : "Stock Quantity",
      locale === "ar" ? "السعر (دج)" : "Price (DZD)",
      locale === "ar" ? "الحالة" : "Status",
    ];

    const rows: string[][] = [];
    products.forEach((p) => {
      p.variants.forEach((v) => {
        const status =
          v.stock === 0
            ? locale === "ar" ? "نفد" : "Épuisé"
            : v.stock <= lowStockThreshold
            ? locale === "ar" ? "منخفض" : "Faible"
            : locale === "ar" ? "متوفر" : "En stock";

        rows.push([
          p.id,
          `"${(locale === "ar" ? p.name.ar : p.name.fr).replace(/"/g, '""')}"`,
          p.sku || "",
          v.size || "Standard",
          `"${(locale === "ar" ? v.color.ar : v.color.fr).replace(/"/g, '""')}"`,
          v.sku || "",
          String(v.stock),
          String(v.price ?? p.price),
          status,
        ]);
      });
    });

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `velora_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast(locale === "ar" ? "تم تصدير ملف المخزون بنجاح" : "Fichier d'inventaire exporté");
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-xl border border-zinc-800 bg-[#161616] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              {locale === "ar" ? "إجمالي المنتجات" : "Total produits"}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <Package size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-zinc-100">{stats.totalProducts}</p>
          <p className="mt-1 text-[11px] text-zinc-500">
            {locale === "ar" ? "منتج مسجل في المتجر" : "produits actifs"}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-[#161616] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              {locale === "ar" ? "إجمالي القطع المتوفرة" : "Total pièces stock"}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Layers size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-400">{stats.totalStockCount}</p>
          <p className="mt-1 text-[11px] text-zinc-500">
            {locale === "ar" ? "قطعة عبر جميع المتغيرات" : "unités au total"}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-[#161616] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              {locale === "ar" ? "مخزون منخفض" : "Stock faible"}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-400">{stats.lowStockCount}</p>
          <p className="mt-1 text-[11px] text-zinc-500">
            {locale === "ar"
              ? `أقل من ${lowStockThreshold} قطع`
              : `Moins de ${lowStockThreshold} unités`}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-[#161616] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              {locale === "ar" ? "نفد من المخزون" : "Rupture de stock"}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
              <XCircle size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-red-400">{stats.outOfStockCount}</p>
          <p className="mt-1 text-[11px] text-zinc-500">
            {locale === "ar" ? "بحاجة لإعادة التزويد" : "à réapprovisionner"}
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-4 shadow-md sm:p-6">
        {/* Top Controls Bar matching Screenshot */}
        <div className="flex flex-col-reverse gap-4 pb-5 border-b border-zinc-800/80 sm:flex-row sm:items-center sm:justify-between">
          {/* Action Buttons (Left in RTL, Right in LTR) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Display Settings Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowDisplaySettings(!showDisplaySettings);
                  setShowFilterDropdown(false);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition",
                  showDisplaySettings
                    ? "border-purple-500 bg-purple-600/20 text-purple-200"
                    : "border-purple-600/60 bg-purple-900/30 text-purple-300 hover:bg-purple-900/50"
                )}
              >
                <Settings2 size={14} className="text-purple-300" />
                <span>{locale === "ar" ? "إعدادات العرض" : "Paramètres d'affichage"}</span>
              </button>

              {/* Display Settings Dropdown Popover */}
              {showDisplaySettings && (
                <div
                  className={cn(
                    "absolute top-full mt-2 z-50 w-72 rounded-xl border border-zinc-700 bg-[#1e1e1e] p-4 shadow-2xl backdrop-blur-md",
                    locale === "ar" ? "right-0" : "left-0"
                  )}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-700">
                    <span className="text-xs font-bold text-zinc-200">
                      {locale === "ar" ? "خيارات عرض المخزون" : "Options d'affichage"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowDisplaySettings(false)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="mt-3 space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        {locale === "ar"
                          ? "عتبة تنبيه المخزون المنخفض (قطع)"
                          : "Seuil de stock faible (unités)"}
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={lowStockThreshold}
                        onChange={(e) => setLowStockThreshold(Number(e.target.value) || 5)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-100 focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div className="pt-2 border-t border-zinc-800">
                      <p className="text-[11px] font-medium text-zinc-400 mb-2">
                        {locale === "ar" ? "إظهار / إخفاء الأعمدة:" : "Affichage des colonnes:"}
                      </p>
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={visibleColumns.sku}
                            onChange={(e) =>
                              setVisibleColumns({ ...visibleColumns, sku: e.target.checked })
                            }
                            className="rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-0"
                          />
                          <span className="text-zinc-300">رمز المنتج (SKU)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={visibleColumns.price}
                            onChange={(e) =>
                              setVisibleColumns({ ...visibleColumns, price: e.target.checked })
                            }
                            className="rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-0"
                          />
                          <span className="text-zinc-300">السعر</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={visibleColumns.variants}
                            onChange={(e) =>
                              setVisibleColumns({ ...visibleColumns, variants: e.target.checked })
                            }
                            className="rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-0"
                          />
                          <span className="text-zinc-300">البارات / الخيارات</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2 border-t border-zinc-800">
                      <button
                        type="button"
                        onClick={expandAll}
                        className="flex-1 rounded-lg bg-zinc-800 py-1.5 text-[11px] font-semibold text-zinc-200 hover:bg-zinc-700"
                      >
                        {locale === "ar" ? "توسيع الكل" : "Développer tout"}
                      </button>
                      <button
                        type="button"
                        onClick={collapseAll}
                        className="flex-1 rounded-lg bg-zinc-800 py-1.5 text-[11px] font-semibold text-zinc-200 hover:bg-zinc-700"
                      >
                        {locale === "ar" ? "طي الكل" : "Réduire tout"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowFilterDropdown(!showFilterDropdown);
                  setShowDisplaySettings(false);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition",
                  showFilterDropdown || stockFilter !== "all" || selectedCategory !== "all"
                    ? "border-purple-500 bg-purple-600/20 text-purple-200"
                    : "border-purple-600/60 bg-purple-900/30 text-purple-300 hover:bg-purple-900/50"
                )}
              >
                <SlidersHorizontal size={14} className="text-purple-300" />
                <span>{locale === "ar" ? "تصفية" : "Filtrer"}</span>
                {(stockFilter !== "all" || selectedCategory !== "all") && (
                  <span className="h-2 w-2 rounded-full bg-purple-400"></span>
                )}
              </button>

              {/* Filter Popover */}
              {showFilterDropdown && (
                <div
                  className={cn(
                    "absolute top-full mt-2 z-50 w-72 rounded-xl border border-zinc-700 bg-[#1e1e1e] p-4 shadow-2xl backdrop-blur-md",
                    locale === "ar" ? "right-0" : "left-0"
                  )}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-700">
                    <span className="text-xs font-bold text-zinc-200">
                      {locale === "ar" ? "تصفية المخزون" : "Filtrer l'inventaire"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowFilterDropdown(false)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="mt-3 space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        {locale === "ar" ? "حالة المخزون" : "État du stock"}
                      </label>
                      <select
                        value={stockFilter}
                        onChange={(e) =>
                          setStockFilter(e.target.value as "all" | "in_stock" | "low_stock" | "out_of_stock")
                        }
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-100 focus:border-purple-500 focus:outline-none"
                      >
                        <option value="all">{locale === "ar" ? "الكل" : "Tous"}</option>
                        <option value="in_stock">{locale === "ar" ? "متوفر بالمخزون" : "En stock"}</option>
                        <option value="low_stock">
                          {locale === "ar" ? `مخزون منخفض (≤ ${lowStockThreshold})` : `Stock faible (≤ ${lowStockThreshold})`}
                        </option>
                        <option value="out_of_stock">
                          {locale === "ar" ? "نفد من المخزون (0)" : "Rupture de stock (0)"}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        {locale === "ar" ? "الفئة" : "Catégorie"}
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-100 focus:border-purple-500 focus:outline-none"
                      >
                        <option value="all">{locale === "ar" ? "جميع الفئات" : "Toutes les catégories"}</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {locale === "ar" ? cat.name.ar : cat.name.fr}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        {locale === "ar" ? "الترتيب حسب" : "Trier par"}
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) =>
                          setSortBy(e.target.value as "default" | "stock_asc" | "stock_desc" | "name")
                        }
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-100 focus:border-purple-500 focus:outline-none"
                      >
                        <option value="default">{locale === "ar" ? "الافتراضي" : "Par défaut"}</option>
                        <option value="stock_asc">
                          {locale === "ar" ? "الأقل مخزوناً أولاً" : "Stock croissant"}
                        </option>
                        <option value="stock_desc">
                          {locale === "ar" ? "الأكثر مخزوناً أولاً" : "Stock décroissant"}
                        </option>
                        <option value="name">{locale === "ar" ? "اسم المنتج" : "Nom du produit"}</option>
                      </select>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setStockFilter("all");
                          setSelectedCategory("all");
                          setSortBy("default");
                          setSearchQuery("");
                        }}
                        className="w-full rounded-lg bg-zinc-800 py-1.5 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-700"
                      >
                        {locale === "ar" ? "إعادة ضبط الفلاتر" : "Réinitialiser"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={exportInventoryCSV}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-700/80 bg-zinc-800/60 px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
              title={locale === "ar" ? "تصدير المخزون كملف CSV" : "Exporter CSV"}
            >
              <Download size={13} />
              <span className="hidden sm:inline">{locale === "ar" ? "تصدير" : "Exporter"}</span>
            </button>
          </div>

          {/* Search Bar (Right in RTL, Left in LTR) */}
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder={locale === "ar" ? "البحث عن منتج..." : "Rechercher un produit..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900/90 py-2.5 ps-9 pe-3 text-xs text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <Search size={15} className="absolute start-3 top-3 text-zinc-400" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute end-3 top-3 text-zinc-500 hover:text-zinc-300"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Section Subheader: المنتجات : */}
        <div className="mt-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-zinc-200">
              {locale === "ar" ? "المنتجات :" : "Produits :"}
            </h2>
            <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-semibold text-purple-300">
              {filteredProducts.length}
            </span>
          </div>
          {(stockFilter !== "all" || selectedCategory !== "all" || searchQuery) && (
            <span className="text-xs text-zinc-400">
              {locale === "ar"
                ? `(تمت التصفية من أصل ${products.length} منتج)`
                : `(Filtré sur ${products.length} produits)`}
            </span>
          )}
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#131313]">
          <table className="w-full border-collapse text-start text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400">
                <th className="py-3.5 px-4 text-start font-semibold">
                  {locale === "ar" ? "المنتج" : "Produit"}
                </th>
                <th className="py-3.5 px-4 text-start font-semibold">
                  {locale === "ar" ? "الاسم" : "Nom"}
                </th>
                {visibleColumns.sku && (
                  <th className="py-3.5 px-4 text-start font-semibold">
                    {locale === "ar" ? "رمز المنتج SKU" : "Code SKU"}
                  </th>
                )}
                {visibleColumns.quantity && (
                  <th className="py-3.5 px-4 text-start font-semibold">
                    {locale === "ar" ? "الكمية" : "Quantité"}
                  </th>
                )}
                {visibleColumns.price && (
                  <th className="py-3.5 px-4 text-start font-semibold">
                    {locale === "ar" ? "السعر" : "Prix"}
                  </th>
                )}
                {visibleColumns.variants && (
                  <th className="py-3.5 px-4 text-start font-semibold">
                    {locale === "ar" ? "البارات" : "Options / Variantes"}
                  </th>
                )}
                <th className="py-3.5 px-4 text-center font-semibold w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    <Package size={36} className="mx-auto mb-2 text-zinc-600" />
                    <p className="text-sm font-medium">
                      {locale === "ar" ? "لا توجد منتجات مطابقة للبحث" : "Aucun produit trouvé"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isExpanded = expandedProductIds.has(product.id);
                  const stock = totalStock(product);
                  const isLowStock = stock > 0 && stock <= lowStockThreshold;
                  const isOutOfStock = stock === 0;
                  const firstImage = product.images?.[0]?.url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80";

                  return (
                    <ProductRow
                      key={product.id}
                      product={product}
                      stock={stock}
                      isLowStock={isLowStock}
                      isOutOfStock={isOutOfStock}
                      isExpanded={isExpanded}
                      firstImage={firstImage}
                      visibleColumns={visibleColumns}
                      editingSkuId={editingSkuId}
                      tempSku={tempSku}
                      loadingProductId={loadingProductId}
                      lowStockThreshold={lowStockThreshold}
                      locale={locale}
                      onToggleExpand={() => toggleExpand(product.id)}
                      onStartEditSku={() => {
                        setEditingSkuId(product.id);
                        setTempSku(product.sku || "");
                      }}
                      onCancelEditSku={() => setEditingSkuId(null)}
                      onSaveSku={() => void handleSaveProductSku(product)}
                      onTempSkuChange={setTempSku}
                      onEditFullProduct={() => setEditingProduct(product)}
                      onVariantStockChange={(variantId, newStock) =>
                        void handleVariantStockChange(product, variantId, newStock)
                      }
                      onBulkProductStock={(delta) => void handleBulkProductStock(product, delta)}
                    />
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Full Product Modal */}
      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          categories={categories}
          isOpen={true}
          onClose={() => setEditingProduct(null)}
          onSave={async (updated) => {
            await onUpsertProduct(updated);
            setEditingProduct(null);
            toast(locale === "ar" ? "تم حفظ التعديلات بنجاح" : "Produit mis à jour");
          }}
        />
      )}
    </div>
  );
}

// Single Product Row Component with expandable variant drawer
function ProductRow({
  product,
  stock,
  isLowStock,
  isOutOfStock,
  isExpanded,
  firstImage,
  visibleColumns,
  editingSkuId,
  tempSku,
  loadingProductId,
  lowStockThreshold,
  locale,
  onToggleExpand,
  onStartEditSku,
  onCancelEditSku,
  onSaveSku,
  onTempSkuChange,
  onEditFullProduct,
  onVariantStockChange,
  onBulkProductStock,
}: {
  product: Product;
  stock: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  isExpanded: boolean;
  firstImage: string;
  visibleColumns: {
    sku: boolean;
    quantity: boolean;
    price: boolean;
    variants: boolean;
    status: boolean;
  };
  editingSkuId: string | null;
  tempSku: string;
  loadingProductId: string | null;
  lowStockThreshold: number;
  locale: "ar" | "fr";
  onToggleExpand: () => void;
  onStartEditSku: () => void;
  onCancelEditSku: () => void;
  onSaveSku: () => void;
  onTempSkuChange: (v: string) => void;
  onEditFullProduct: () => void;
  onVariantStockChange: (variantId: string, newStock: number) => void;
  onBulkProductStock: (delta: number) => void;
}) {
  const isEditingThisSku = editingSkuId === product.id;
  const isLoading = loadingProductId === product.id;

  return (
    <>
      <tr
        onClick={onToggleExpand}
        className={cn(
          "cursor-pointer transition hover:bg-zinc-800/40",
          isExpanded ? "bg-zinc-800/30" : "bg-transparent"
        )}
      >
        {/* Product Image */}
        <td className="py-3 px-4">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800">
            <Image
              src={firstImage}
              alt={locale === "ar" ? product.name.ar : product.name.fr}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
        </td>

        {/* Product Name */}
        <td className="py-3 px-4">
          <div className="font-semibold text-zinc-100 group-hover:text-purple-300">
            {locale === "ar" ? product.name.ar || product.name.fr : product.name.fr || product.name.ar}
          </div>
          <div className="mt-0.5 text-[11px] text-zinc-500">
            {product.variants.length}{" "}
            {locale === "ar" ? "متغيرات مقاس/لون" : "variantes"}
          </div>
        </td>

        {/* SKU */}
        {visibleColumns.sku && (
          <td className="py-3 px-4 text-zinc-300" onClick={(e) => e.stopPropagation()}>
            {isEditingThisSku ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={tempSku}
                  onChange={(e) => onTempSkuChange(e.target.value)}
                  className="w-24 rounded border border-purple-500 bg-zinc-900 px-2 py-1 text-xs text-zinc-100 focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={onSaveSku}
                  className="rounded bg-purple-600 p-1 text-white hover:bg-purple-700"
                >
                  <Check size={12} />
                </button>
                <button
                  type="button"
                  onClick={onCancelEditSku}
                  className="rounded bg-zinc-700 p-1 text-zinc-300 hover:bg-zinc-600"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 group">
                <span className="font-mono text-xs">{product.sku || "—"}</span>
                <button
                  type="button"
                  onClick={onStartEditSku}
                  className="text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-zinc-300 transition"
                  title={locale === "ar" ? "تعديل SKU" : "Modifier SKU"}
                >
                  <Edit2 size={11} />
                </button>
              </div>
            )}
          </td>
        )}

        {/* Total Stock Quantity with Badge */}
        {visibleColumns.quantity && (
          <td className="py-3 px-4">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "font-bold text-sm",
                  isOutOfStock
                    ? "text-red-400"
                    : isLowStock
                    ? "text-amber-400"
                    : "text-zinc-100"
                )}
              >
                {stock}
              </span>
              {isOutOfStock ? (
                <span className="rounded-md bg-red-950/70 border border-red-800/80 px-2 py-0.5 text-[10px] font-bold text-red-300">
                  {locale === "ar" ? "نفد" : "Épuisé"}
                </span>
              ) : isLowStock ? (
                <span className="rounded-md bg-amber-950/70 border border-amber-800/80 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  {locale === "ar" ? "منخفض" : "Faible"}
                </span>
              ) : (
                <span className="rounded-md bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                  {locale === "ar" ? "متوفر" : "En stock"}
                </span>
              )}
            </div>
          </td>
        )}

        {/* Price Badge matching screenshot */}
        {visibleColumns.price && (
          <td className="py-3 px-4">
            <span className="inline-block rounded-full bg-purple-900/60 border border-purple-500/40 px-3.5 py-1 text-xs font-bold text-purple-200 shadow-sm">
              {formatPrice(product.price, locale)}
            </span>
          </td>
        )}

        {/* Variants / Barcode count matching screenshot */}
        {visibleColumns.variants && (
          <td className="py-3 px-4 text-zinc-400 font-mono text-xs">
            {/* Generate or display internal variant code identifier like 20058 */}
            <span className="inline-block rounded bg-zinc-800/80 px-2 py-0.5 text-zinc-300">
              {product.variants.reduce((acc, v) => acc + (v.stock > 0 ? 1 : 0), 0)} / {product.variants.length}
            </span>
          </td>
        )}

        {/* Chevron Expand Indicator */}
        <td className="py-3 px-4 text-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-700 hover:text-white transition"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </td>
      </tr>

      {/* Expanded Variant Inventory Details Sub-table */}
      {isExpanded && (
        <tr className="bg-zinc-900/90 border-b border-zinc-800">
          <td colSpan={7} className="p-4 sm:p-6">
            <div className="rounded-xl border border-zinc-800 bg-[#171717] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Layers size={15} className="text-purple-400" />
                  <span className="text-xs font-bold text-zinc-200">
                    {locale === "ar"
                      ? "إدارة مخزون المتغيرات (المقاسات والألوان)"
                      : "Détail du stock par variantes (tailles & couleurs)"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Quick Adjust Buttons */}
                  <span className="text-[11px] text-zinc-500">
                    {locale === "ar" ? "تعديل موحد:" : "Ajustement rapide:"}
                  </span>
                  <button
                    type="button"
                    onClick={() => onBulkProductStock(5)}
                    className="rounded bg-zinc-800 px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-700 transition"
                  >
                    +5 {locale === "ar" ? "للجميع" : "tous"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onBulkProductStock(10)}
                    className="rounded bg-zinc-800 px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-700 transition"
                  >
                    +10 {locale === "ar" ? "للجميع" : "tous"}
                  </button>
                  <button
                    type="button"
                    onClick={onEditFullProduct}
                    className="flex items-center gap-1 rounded-lg border border-purple-500/40 bg-purple-900/30 px-2.5 py-1 text-[11px] font-semibold text-purple-200 hover:bg-purple-900/60 transition"
                  >
                    <Edit2 size={11} />
                    <span>{locale === "ar" ? "تعديل المنتج كاملاً" : "Modifier le produit"}</span>
                  </button>
                </div>
              </div>

              {/* Variants Grid / Mini Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800/80 text-[11px] font-semibold text-zinc-500">
                      <th className="py-2 px-3 text-start">{locale === "ar" ? "اللون" : "Couleur"}</th>
                      <th className="py-2 px-3 text-start">{locale === "ar" ? "المقاس" : "Taille"}</th>
                      <th className="py-2 px-3 text-start">{locale === "ar" ? "رمز SKU للمتغير" : "SKU Variante"}</th>
                      <th className="py-2 px-3 text-start">{locale === "ar" ? "الكمية بالمخزون" : "Quantité"}</th>
                      <th className="py-2 px-3 text-start">{locale === "ar" ? "الحالة" : "État"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40">
                    {product.variants.map((variant) => (
                      <VariantRow
                        key={variant.id}
                        variant={variant}
                        lowStockThreshold={lowStockThreshold}
                        locale={locale}
                        onStockChange={(newVal) => onVariantStockChange(variant.id, newVal)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// Single Variant Row inside Expanded Product
function VariantRow({
  variant,
  lowStockThreshold,
  locale,
  onStockChange,
}: {
  variant: ProductVariant;
  lowStockThreshold: number;
  locale: "ar" | "fr";
  onStockChange: (newVal: number) => void;
}) {
  const [stockInput, setStockInput] = useState(variant.stock);

  const isLow = variant.stock > 0 && variant.stock <= lowStockThreshold;
  const isOut = variant.stock === 0;

  const handleApply = (val: number) => {
    const valid = Math.max(0, val);
    setStockInput(valid);
    onStockChange(valid);
  };

  return (
    <tr className="hover:bg-zinc-800/20">
      {/* Color with circle badge */}
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-2">
          <span
            className="h-4 w-4 rounded-full border border-zinc-600 shrink-0 shadow-sm"
            style={{ backgroundColor: variant.colorHex || "#111" }}
          />
          <span className="font-medium text-zinc-200">
            {locale === "ar" ? variant.color.ar : variant.color.fr}
          </span>
        </div>
      </td>

      {/* Size */}
      <td className="py-2.5 px-3">
        <span className="inline-block rounded bg-zinc-800 border border-zinc-700 px-2 py-0.5 text-xs font-semibold text-zinc-200">
          {variant.size || "Standard"}
        </span>
      </td>

      {/* Variant SKU */}
      <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-400">
        {variant.sku || "—"}
      </td>

      {/* Stock stepper & direct input */}
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleApply(variant.stock - 1)}
            disabled={variant.stock <= 0}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-30 transition"
          >
            <Minus size={12} />
          </button>
          <input
            type="number"
            min={0}
            value={stockInput}
            onChange={(e) => setStockInput(Number(e.target.value))}
            onBlur={() => handleApply(stockInput)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleApply(stockInput);
              }
            }}
            className="h-7 w-16 rounded-lg border border-zinc-700 bg-zinc-900 text-center font-bold text-xs text-zinc-100 focus:border-purple-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleApply(variant.stock + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-purple-600 hover:text-white transition"
          >
            <Plus size={12} />
          </button>
          {stockInput !== variant.stock && (
            <button
              type="button"
              onClick={() => handleApply(stockInput)}
              className="ms-1 flex h-7 items-center gap-1 rounded-lg bg-emerald-600 px-2 text-[10px] font-bold text-white hover:bg-emerald-500"
            >
              <Check size={12} />
              <span>{locale === "ar" ? "حفظ" : "OK"}</span>
            </button>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="py-2.5 px-3">
        {isOut ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-red-950/60 border border-red-800/80 px-2 py-0.5 text-[10px] font-bold text-red-400">
            <XCircle size={10} />
            {locale === "ar" ? "نفد" : "Épuisé"}
          </span>
        ) : isLow ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 text-[10px] font-bold text-amber-400">
            <AlertTriangle size={10} />
            {locale === "ar" ? "منخفض" : "Faible"}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
            <CheckCircle2 size={10} />
            {locale === "ar" ? "متوفر" : "En stock"}
          </span>
        )}
      </td>
    </tr>
  );
}
