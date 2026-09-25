"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit2, Trash2, Eye, Plus, Search, Tag, DollarSign, Check, X } from "lucide-react";
import type { Product, Category } from "@/types";
import { useLocale } from "@/providers/locale-provider";
import { formatPrice } from "@/lib/utils";
import { totalStock } from "@/lib/catalog/queries";
import { ProductEditModal } from "@/components/admin/product-edit-modal";
import { cn } from "@/lib/utils";

interface AdminProductsTableProps {
  products: Product[];
  categories: Category[];
  onUpsertProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleActive: (productId: string) => void;
}

export function AdminProductsTable({
  products,
  categories,
  onUpsertProduct,
  onDeleteProduct,
  onToggleActive,
}: AdminProductsTableProps) {
  const { locale } = useLocale();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.ar.toLowerCase().includes(q) ||
      p.name.fr.toLowerCase().includes(q) ||
      (p.sku && p.sku.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* Top Bar: Search + Add Product */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute start-3 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder={locale === "ar" ? "بحث باسم المنتج أو الرمز..." : "Rechercher un produit..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white py-2 ps-9 pe-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-900"
          />
        </div>

        {/* Add Product Button */}
        <button
          type="button"
          onClick={() => {
            const newProd: Product = {
              id: `p_${Date.now().toString(36)}`,
              slug: `product-${Date.now().toString(36)}`,
              sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
              name: { ar: "منتج جديد", fr: "Nouveau produit" },
              description: { ar: "وصف المنتج هنا...", fr: "Description du produit..." },
              categoryId: categories[0]?.id || "cat_men",
              price: 2000,
              compareAtPrice: 3000,
              images: [
                {
                  id: `img_${Date.now()}`,
                  url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
                  alt: { ar: "منتج جديد", fr: "Nouveau produit" },
                },
              ],
              variants: [
                {
                  id: `var_${Date.now()}`,
                  sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
                  size: "M",
                  color: { ar: "أسود", fr: "Noir" },
                  colorHex: "#111111",
                  stock: 20,
                },
              ],
              sizes: ["M", "L", "XL"],
              colors: [{ name: { ar: "أسود", fr: "Noir" }, hex: "#111111" }],
              offers: [
                {
                  id: `off_1`,
                  quantity: 1,
                  title: { ar: "قطعة واحدة", fr: "1 Pièce" },
                  price: 2000,
                  originalPrice: 3000,
                },
                {
                  id: `off_2`,
                  quantity: 2,
                  title: { ar: "2 قطع (توفير)", fr: "2 Pièces" },
                  price: 3500,
                  originalPrice: 6000,
                  badge: { ar: "الأكثر طلباً", fr: "Populaire" },
                },
              ],
              active: true,
              views: 1,
              featured: false,
              isNew: true,
              rating: 5,
              reviewCount: 0,
              createdAt: new Date().toISOString(),
            };
            setEditingProduct(newProd);
          }}
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/30 transition hover:bg-purple-700 active:scale-95"
        >
          <Plus size={16} />
          <span>{locale === "ar" ? "إضافة منتج جديد" : "Ajouter un produit"}</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full border-collapse text-right text-xs">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
              <th className="py-3.5 px-4">{locale === "ar" ? "المنتج" : "Produit"}</th>
              <th className="py-3.5 px-3">{locale === "ar" ? "اسم المنتج" : "Nom"}</th>
              <th className="py-3.5 px-3">{locale === "ar" ? "رمز المنتج SKU" : "SKU"}</th>
              <th className="py-3.5 px-3 text-center">{locale === "ar" ? "معاينة" : "Aperçu"}</th>
              <th className="py-3.5 px-3">{locale === "ar" ? "الكمية" : "Stock"}</th>
              <th className="py-3.5 px-3">{locale === "ar" ? "السعر" : "Prix"}</th>
              <th className="py-3.5 px-3">{locale === "ar" ? "الزيارات" : "Visites"}</th>
              <th className="py-3.5 px-3 text-center">{locale === "ar" ? "حالة" : "Statut"}</th>
              <th className="py-3.5 px-4 text-center">{locale === "ar" ? "الإجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-sm text-zinc-400">
                  {locale === "ar" ? "لا توجد منتجات." : "Aucun produit trouvé."}
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const stock = totalStock(p);
                const isActive = p.active !== false;

                return (
                  <tr
                    key={p.id}
                    className="transition hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40"
                  >
                    {/* Thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                        {p.images[0]?.url ? (
                          <Image
                            src={p.images[0].url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="50px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs">
                            🖼️
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-3 font-bold text-zinc-900 dark:text-zinc-100">
                      <div>{p.name[locale] || p.name.ar || p.name.fr}</div>
                      {p.offers && p.offers.length > 0 && (
                        <span className="inline-flex items-center gap-1 rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
                          <Tag size={10} />
                          {p.offers.length} {locale === "ar" ? "عروض مفعلة" : "offres"}
                        </span>
                      )}
                    </td>

                    {/* SKU */}
                    <td className="py-3.5 px-3 font-mono text-zinc-500">
                      {p.sku || p.variants[0]?.sku || "—"}
                    </td>

                    {/* Preview in Store (Direct Link) */}
                    <td className="py-3.5 px-3 text-center">
                      <Link
                        href={`/${locale}/product/${p.slug}`}
                        target="_blank"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 transition hover:bg-purple-100 hover:text-purple-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-purple-950/40"
                        title={locale === "ar" ? "معاينة في المتجر" : "Voir la fiche produit"}
                      >
                        <Eye size={14} />
                      </Link>
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-3">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 font-bold",
                          stock > 5
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : stock > 0
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                        )}
                      >
                        {stock}
                      </span>
                    </td>

                    {/* Price & CompareAtPrice */}
                    <td className="py-3.5 px-3">
                      <div className="font-serif font-bold text-zinc-900 dark:text-zinc-100">
                        {formatPrice(p.price, locale)}
                      </div>
                      {p.compareAtPrice && p.compareAtPrice > p.price && (
                        <div className="text-[10px] text-zinc-400 line-through">
                          {formatPrice(p.compareAtPrice, locale)}
                        </div>
                      )}
                    </td>

                    {/* Views Count */}
                    <td className="py-3.5 px-3 font-mono text-zinc-500">
                      {p.views ?? Math.floor(p.price * 1.5)}
                    </td>

                    {/* Active Toggle Switch (Matching Screenshot) */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleActive(p.id)}
                        className={cn(
                          "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          isActive ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                            isActive ? "translate-x-4 rtl:-translate-x-4" : "translate-x-0"
                          )}
                        />
                      </button>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(p)}
                          className="flex items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1.5 text-xs font-semibold text-purple-700 transition hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:hover:bg-purple-900/50"
                          title={locale === "ar" ? "تعديل السعر والصور والعروض" : "Modifier"}
                        >
                          <Edit2 size={13} />
                          <span>{locale === "ar" ? "تعديل" : "Modifier"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteProduct(p.id)}
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
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

      {/* Edit Product Modal */}
      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          categories={categories}
          isOpen={Boolean(editingProduct)}
          onClose={() => setEditingProduct(null)}
          onSave={(updated) => {
            onUpsertProduct(updated);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}
