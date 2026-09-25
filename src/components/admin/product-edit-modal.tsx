"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Plus, Trash2, Check, Upload, Tag, DollarSign, Image as ImageIcon, Layers } from "lucide-react";
import type { Product, ProductOffer, Category } from "@/types";
import { useLocale } from "@/providers/locale-provider";
import { uid } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProductEditModalProps {
  product: Product;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Product) => void;
}

export function ProductEditModal({
  product,
  categories,
  isOpen,
  onClose,
  onSave,
}: ProductEditModalProps) {
  const { locale } = useLocale();
  const [activeTab, setActiveTab] = useState<"general" | "offers" | "images">("general");

  // Local form state
  const [formData, setFormData] = useState<Product>({
    ...product,
    offers: product.offers || [
      {
        id: uid("off"),
        quantity: 1,
        title: { ar: "قطعة واحدة", fr: "1 pièce" },
        price: product.price,
        originalPrice: product.compareAtPrice,
      },
      {
        id: uid("off"),
        quantity: 2,
        title: { ar: "2 قطع", fr: "2 pièces" },
        price: Math.round(product.price * 1.8),
        originalPrice: (product.compareAtPrice || product.price) * 2,
        badge: { ar: "الأكثر طلباً", fr: "Populaire" },
      },
    ],
  });

  const [newImageUrl, setNewImageUrl] = useState("");

  if (!isOpen) return null;

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      if (url) {
        setFormData((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            { id: uid("img"), url, alt: { ar: prev.name.ar, fr: prev.name.fr } },
          ],
        }));
      }
    };
    reader.readAsDataURL(file);
  }

  function handleAddImageUrl() {
    if (!newImageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        { id: uid("img"), url: newImageUrl.trim(), alt: { ar: prev.name.ar, fr: prev.name.fr } },
      ],
    }));
    setNewImageUrl("");
  }

  function handleRemoveImage(imgId: string) {
    if (formData.images.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imgId),
    }));
  }

  function handleSetPrimaryImage(index: number) {
    if (index === 0) return;
    setFormData((prev) => {
      const imgs = [...prev.images];
      const [selected] = imgs.splice(index, 1);
      return { ...prev, images: [selected, ...imgs] };
    });
  }

  function handleAddOffer() {
    const nextQty = (formData.offers?.length || 0) + 1;
    const newOffer: ProductOffer = {
      id: uid("off"),
      quantity: nextQty,
      title: {
        ar: `${nextQty} قطع - عرض خاص`,
        fr: `Pack ${nextQty} pièces`,
      },
      price: Math.round(formData.price * nextQty * 0.85),
      originalPrice: (formData.compareAtPrice || formData.price) * nextQty,
      badge: { ar: "توفير", fr: "Remise" },
    };
    setFormData((prev) => ({
      ...prev,
      offers: [...(prev.offers || []), newOffer],
    }));
  }

  function handleRemoveOffer(offerId: string) {
    setFormData((prev) => ({
      ...prev,
      offers: (prev.offers || []).filter((o) => o.id !== offerId),
    }));
  }

  function handleOfferChange(
    index: number,
    field: "titleAr" | "titleFr" | "quantity" | "price" | "originalPrice" | "badgeAr",
    val: string | number
  ) {
    const updated = [...(formData.offers || [])];
    const target = { ...updated[index] };

    if (field === "titleAr") target.title = { ...target.title, ar: String(val) };
    if (field === "titleFr") target.title = { ...target.title, fr: String(val) };
    if (field === "quantity") target.quantity = Number(val) || 1;
    if (field === "price") target.price = Number(val) || 0;
    if (field === "originalPrice") target.originalPrice = Number(val) || 0;
    if (field === "badgeAr") target.badge = { ar: String(val), fr: String(val) };

    updated[index] = target;
    setFormData((prev) => ({ ...prev, offers: updated }));
  }

  function handleSave() {
    onSave(formData);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 dark:text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
              <Layers size={18} />
            </span>
            <h2 className="text-lg font-bold">
              {locale === "ar" ? "بيانات وتعديل المنتج" : "Modifier le produit"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-zinc-200 px-6 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition",
              activeTab === "general"
                ? "border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
            )}
          >
            <DollarSign size={15} />
            {locale === "ar" ? "الأسعار والبيانات" : "Prix & Informations"}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("images")}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition",
              activeTab === "images"
                ? "border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
            )}
          >
            <ImageIcon size={15} />
            {locale === "ar" ? "الصور" : "Photos"} ({formData.images.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("offers")}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition",
              activeTab === "offers"
                ? "border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
            )}
          >
            <Tag size={15} />
            {locale === "ar" ? "عروض الكمية (Packs)" : "Offres & Packs"} ({formData.offers?.length || 0})
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: General & Prices */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {locale === "ar" ? "اسم المنتج بالعربية *" : "Nom du produit (Arabe) *"}
                  </label>
                  <input
                    type="text"
                    value={formData.name.ar}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, name: { ...p.name, ar: e.target.value } }))
                    }
                    className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3.5 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {locale === "ar" ? "اسم المنتج بالفرنسية / الإنجليزية" : "Nom du produit (Français)"}
                  </label>
                  <input
                    type="text"
                    value={formData.name.fr}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, name: { ...p.name, fr: e.target.value } }))
                    }
                    className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3.5 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                </div>
              </div>

              {/* Price Fields (User Request: تعديل السعر وقبل التخفيض) */}
              <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-4 dark:border-purple-900/30 dark:bg-purple-950/20">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300">
                  {locale === "ar" ? "إعدادات الأسعار والتخفيض" : "Tarification"}
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      {locale === "ar" ? "سعر البيع الحالي (دج) *" : "Prix de vente (DZD) *"}
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, price: Number(e.target.value) || 0 }))
                      }
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-base font-bold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      {locale === "ar" ? "السعر قبل التخفيض (دج)" : "Prix barré (DZD)"}
                    </label>
                    <input
                      type="number"
                      value={formData.compareAtPrice || ""}
                      placeholder="مثال: 2500"
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          compareAtPrice: Number(e.target.value) || undefined,
                        }))
                      }
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      {locale === "ar" ? "رمز المنتج SKU" : "Code SKU"}
                    </label>
                    <input
                      type="text"
                      value={formData.sku || ""}
                      placeholder="SKU-100"
                      onChange={(e) => setFormData((p) => ({ ...p, sku: e.target.value }))}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {locale === "ar" ? "التصنيف" : "Catégorie"}
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData((p) => ({ ...p, categoryId: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3.5 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name[locale] || c.name.ar}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {locale === "ar" ? "رابط المنتج (Slug)" : "Identifiant URL (Slug)"}
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3.5 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  {locale === "ar" ? "وصف المنتج" : "Description"}
                </label>
                <textarea
                  rows={3}
                  value={formData.description.ar}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      description: { ...p.description, ar: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border border-zinc-300 bg-zinc-50 p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Images Management (User Request: تعديل الصور) */}
          {activeTab === "images" && (
            <div className="space-y-6">
              {/* Upload & Add by URL */}
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow transition hover:bg-purple-700">
                  <Upload size={16} />
                  <span>{locale === "ar" ? "رفع صورة من جهازك" : "Téléverser une image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                <div className="flex flex-1 items-center gap-2">
                  <input
                    type="url"
                    placeholder={locale === "ar" ? "أو أدخل رابط صورة مباشرة (URL)" : "Ou collez un lien d'image"}
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    {locale === "ar" ? "إضافة" : "Ajouter"}
                  </button>
                </div>
              </div>

              {/* Grid of Current Images */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                  {locale === "ar" ? "صور المنتج (انقر لتعيين الصورة الرئيسية)" : "Photos existantes"}
                </p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {formData.images.map((img, idx) => (
                    <div
                      key={img.id}
                      className={cn(
                        "group relative aspect-square overflow-hidden rounded-xl border-2 transition",
                        idx === 0
                          ? "border-emerald-500 ring-2 ring-emerald-500/20"
                          : "border-zinc-200 dark:border-zinc-700"
                      )}
                    >
                      <Image src={img.url} alt="" fill className="object-cover" sizes="150px" />

                      {/* Primary Badge */}
                      {idx === 0 && (
                        <span className="absolute start-2 top-2 rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                          {locale === "ar" ? "رئيسية" : "Principale"}
                        </span>
                      )}

                      {/* Actions overlay */}
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            className="rounded-full bg-white p-1.5 text-zinc-800 shadow hover:bg-emerald-50 hover:text-emerald-600"
                            title={locale === "ar" ? "تعيين كرئيسية" : "Définir comme principale"}
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className="rounded-full bg-white p-1.5 text-red-600 shadow hover:bg-red-50"
                          title={locale === "ar" ? "حذف" : "Supprimer"}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Offers / Packs Management (User Request: تعديل العروض) */}
          {activeTab === "offers" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">
                    {locale === "ar" ? "باقات وعروض المنتج" : "Offres promotionnelles"}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {locale === "ar"
                      ? "هذه العروض تظهر للزبون في صفحة المنتج لاختيار الكمية بسعر مخفض"
                      : "Ces offres s'affichent sur la fiche produit pour inciter à l'achat multiple"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddOffer}
                  className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-bold text-white shadow transition hover:bg-purple-700"
                >
                  <Plus size={14} />
                  {locale === "ar" ? "إضافة عرض جديد" : "Ajouter une offre"}
                </button>
              </div>

              <div className="space-y-3">
                {(formData.offers || []).map((offer, index) => (
                  <div
                    key={offer.id}
                    className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-800/40"
                  >
                    <div className="flex-1 grid gap-3 sm:grid-cols-4">
                      {/* Offer Title */}
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                          {locale === "ar" ? "اسم العرض (مثل: 2 تيشرت)" : "Titre de l'offre"}
                        </label>
                        <input
                          type="text"
                          value={offer.title.ar}
                          onChange={(e) => handleOfferChange(index, "titleAr", e.target.value)}
                          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800"
                        />
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                          {locale === "ar" ? "الكمية" : "Quantité"}
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={offer.quantity}
                          onChange={(e) => handleOfferChange(index, "quantity", e.target.value)}
                          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800"
                        />
                      </div>

                      {/* Offer Price */}
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                          {locale === "ar" ? "السعر الإجمالي (دج)" : "Prix du pack (DZD)"}
                        </label>
                        <input
                          type="number"
                          value={offer.price}
                          onChange={(e) => handleOfferChange(index, "price", e.target.value)}
                          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-bold text-emerald-600 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-emerald-400"
                        />
                      </div>
                    </div>

                    {/* Badge & Delete */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={locale === "ar" ? "شارة (اختياري)" : "Badge"}
                        value={offer.badge?.ar || ""}
                        onChange={(e) => handleOfferChange(index, "badgeAr", e.target.value)}
                        className="w-28 rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveOffer(offer.id)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                        title={locale === "ar" ? "حذف العرض" : "Supprimer"}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-300 px-5 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {locale === "ar" ? "إلغاء" : "Annuler"}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/30 hover:bg-purple-700 active:scale-95"
          >
            {locale === "ar" ? "حفظ التعديلات" : "Enregistrer les modifications"}
          </button>
        </div>
      </div>
    </div>
  );
}
