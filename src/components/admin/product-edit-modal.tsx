"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Plus,
  Trash2,
  Check,
  Upload,
  Tag,
  DollarSign,
  Image as ImageIcon,
  Layers,
  Palette,
  Truck,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { Product, ProductOffer, Category } from "@/types";
import { useLocale } from "@/providers/locale-provider";
import { uid } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { reconcileProductVariants } from "@/lib/catalog/product-options";
import { errorMessage } from "@/lib/errors";

interface ProductEditModalProps {
  product: Product;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Product) => Promise<void>;
}

// Client-side canvas image compression to keep images sharp while keeping base64 under size limits
function compressImageFile(file: File, maxDimension = 1400, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = document.createElement("img");
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(readerEvent.target?.result as string);
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ProductEditModal({
  product,
  categories,
  isOpen,
  onClose,
  onSave,
}: ProductEditModalProps) {
  const { locale } = useLocale();
  const [activeTab, setActiveTab] = useState<"general" | "options" | "offers" | "images" | "shipping">("general");

  // Local form state initialized
  const [formData, setFormData] = useState<Product>(() => ({
    ...product,
    trackStock: product.trackStock !== undefined ? product.trackStock : true,
    shippingConfig: product.shippingConfig || {
      type: "store",
      fixedHomePrice: 0,
      fixedDeskPrice: 0,
    },
    landingImages: product.landingImages || [],
    variants: reconcileProductVariants(product.variants, product.sizes, product.colors),
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
  }));

  // Re-sync form state whenever the product prop or isOpen changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...product,
        trackStock: product.trackStock !== undefined ? product.trackStock : true,
        shippingConfig: product.shippingConfig || {
          type: "store",
          fixedHomePrice: 0,
          fixedDeskPrice: 0,
        },
        landingImages: product.landingImages || [],
        variants: reconcileProductVariants(product.variants, product.sizes, product.colors),
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
      setNewImageUrl("");
      setNewLandingImageUrl("");
      setOptionsError("");
      setSaveError("");
    }
  }, [product, isOpen]);

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newLandingImageUrl, setNewLandingImageUrl] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState({ ar: "", fr: "", hex: "#111111" });
  const [optionsError, setOptionsError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingLanding, setUploadingLanding] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  function updateProductOptions(sizes: string[], colors: Product["colors"]) {
    setFormData((prev) => ({
      ...prev,
      sizes,
      colors,
      variants: reconcileProductVariants(prev.variants, sizes, colors),
    }));
  }

  function handleAddSize() {
    const size = newSize.trim();
    if (!size) return;
    if (formData.sizes.some((existing) => existing.toLowerCase() === size.toLowerCase())) {
      setOptionsError(locale === "ar" ? "هذا المقاس موجود بالفعل." : "Cette taille existe déjà.");
      return;
    }
    updateProductOptions([...formData.sizes, size], formData.colors);
    setNewSize("");
    setOptionsError("");
  }

  function handleAddColor() {
    const ar = newColor.ar.trim();
    const fr = newColor.fr.trim();
    if (!ar || !fr) {
      setOptionsError(locale === "ar" ? "أدخل اسم اللون بالعربية والفرنسية." : "Saisissez le nom dans les deux langues.");
      return;
    }
    if (formData.colors.some((color) => color.hex.toLowerCase() === newColor.hex.toLowerCase())) {
      setOptionsError(locale === "ar" ? "هذا اللون موجود بالفعل." : "Cette couleur existe déjà.");
      return;
    }
    updateProductOptions(formData.sizes, [
      ...formData.colors,
      { name: { ar, fr }, hex: newColor.hex },
    ]);
    setNewColor({ ar: "", fr: "", hex: "#111111" });
    setOptionsError("");
  }

  function handleColorChange(index: number, field: "ar" | "fr" | "hex", value: string) {
    const updatedColors = [...formData.colors];
    const previous = updatedColors[index];
    const updatedColor =
      field === "hex"
        ? { ...previous, hex: value }
        : { ...previous, name: { ...previous.name, [field]: value } };
    if (
      field === "hex" &&
      updatedColors.some(
        (color, colorIndex) =>
          colorIndex !== index && color.hex.toLowerCase() === value.toLowerCase(),
      )
    ) {
      setOptionsError(locale === "ar" ? "هذا اللون موجود بالفعل." : "Cette couleur existe déjà.");
      return;
    }
    updatedColors[index] = updatedColor;
    const variants = formData.variants.map((variant) =>
      variant.colorHex.toLowerCase() === previous.hex.toLowerCase()
        ? {
            ...variant,
            color: updatedColor.name,
            colorHex: updatedColor.hex,
          }
        : variant,
    );
    setFormData((prev) => ({
      ...prev,
      colors: updatedColors,
      variants: reconcileProductVariants(variants, prev.sizes, updatedColors),
    }));
    setOptionsError("");
  }

  function handleVariantStockChange(variantId: string, stock: number) {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant) =>
        variant.id === variantId ? { ...variant, stock: Math.max(0, stock) } : variant,
      ),
    }));
  }

  if (!isOpen) return null;

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    try {
      const newImages: Product["images"] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedUrl = await compressImageFile(file, 1200, 0.85);
        if (compressedUrl) {
          newImages.push({
            id: uid("img"),
            url: compressedUrl,
            alt: { ar: formData.name.ar, fr: formData.name.fr },
          });
        }
      }
      if (newImages.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...newImages],
        }));
      }
    } catch (err) {
      console.error("Failed to upload image", err);
    } finally {
      e.target.value = "";
      setUploadingGallery(false);
    }
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

  // --- Landing Page Images Handlers ---
  async function handleLandingImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingLanding(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedUrl = await compressImageFile(file, 1400, 0.88);
        if (compressedUrl) {
          newUrls.push(compressedUrl);
        }
      }
      if (newUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          landingImages: [...(prev.landingImages || []), ...newUrls],
        }));
      }
    } catch (err) {
      console.error("Failed to upload landing images", err);
    } finally {
      e.target.value = "";
      setUploadingLanding(false);
    }
  }

  function handleAddLandingImageUrl() {
    const url = newLandingImageUrl.trim();
    if (!url) return;
    setFormData((prev) => ({
      ...prev,
      landingImages: [...(prev.landingImages || []), url],
    }));
    setNewLandingImageUrl("");
  }

  function handleRemoveLandingImage(index: number) {
    setFormData((prev) => ({
      ...prev,
      landingImages: (prev.landingImages || []).filter((_, i) => i !== index),
    }));
  }

  function handleMoveLandingImage(index: number, direction: "up" | "down") {
    const list = [...(formData.landingImages || [])];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setFormData((prev) => ({ ...prev, landingImages: list }));
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

  async function handleSave() {
    setSaving(true);
    setSaveError("");
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save product", error);
      setSaveError(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-4">
      <div className="flex max-h-[calc(100dvh-1rem)] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl sm:max-h-[90vh] dark:bg-zinc-900 dark:text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-zinc-200 px-3 py-3 sm:px-6 sm:py-4 dark:border-zinc-800">
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
        <div className="flex flex-wrap border-b border-zinc-200 px-2 sm:px-6 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={cn(
              "flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition",
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
              "flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition",
              activeTab === "images"
                ? "border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
            )}
          >
            <ImageIcon size={15} />
            {locale === "ar" ? "الصور وصفحة الهبوط" : "Photos & Landing Page"} ({formData.images.length + (formData.landingImages?.length || 0)})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("offers")}
            className={cn(
              "flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition",
              activeTab === "offers"
                ? "border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
            )}
          >
            <Tag size={15} />
            {locale === "ar" ? "عروض الكمية (Packs)" : "Offres & Packs"} ({formData.offers?.length || 0})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("options")}
            className={cn(
              "flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition",
              activeTab === "options"
                ? "border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
            )}
          >
            <Palette size={15} />
            {locale === "ar" ? "الألوان والمقاسات" : "Couleurs & tailles"}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("shipping")}
            className={cn(
              "flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition",
              activeTab === "shipping"
                ? "border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
            )}
          >
            <Truck size={15} />
            {locale === "ar" ? "أسعار التوصيل" : "Frais de livraison"}
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

              {/* Price Fields */}
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

              {/* Shipping Price Settings for this Product */}
              <div className="rounded-xl border border-purple-100 bg-purple-50/30 p-4 dark:border-purple-900/30 dark:bg-purple-950/20">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300">
                      {locale === "ar" ? "سعر وتكاليف التوصيل لهذا المنتج" : "Frais de livraison pour ce produit"}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("shipping")}
                    className="text-[11px] font-bold text-purple-700 underline hover:text-purple-900 dark:text-purple-400"
                  >
                    {locale === "ar" ? "إعدادات تفصيلية للتوصيل ←" : "Options détaillées →"}
                  </button>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-3">
                  {/* Store price */}
                  <label
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        shippingConfig: { ...(p.shippingConfig || { type: "store" }), type: "store" },
                      }))
                    }
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 rounded-lg border p-3 text-xs transition",
                      (formData.shippingConfig?.type || "store") === "store"
                        ? "border-purple-600 bg-white font-bold text-purple-700 ring-2 ring-purple-500/20 shadow-xs dark:bg-zinc-800 dark:text-purple-300"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="generalShippingType"
                      checked={(formData.shippingConfig?.type || "store") === "store"}
                      onChange={() =>
                        setFormData((p) => ({
                          ...p,
                          shippingConfig: { ...(p.shippingConfig || { type: "store" }), type: "store" },
                        }))
                      }
                      className="h-3.5 w-3.5 text-purple-600 focus:ring-purple-500"
                    />
                    <span>{locale === "ar" ? "سعر المتجر (الافتراضي)" : "Tarif boutique"}</span>
                  </label>

                  {/* Fixed price */}
                  <label
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        shippingConfig: { ...(p.shippingConfig || { type: "fixed" }), type: "fixed" },
                      }))
                    }
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 rounded-lg border p-3 text-xs transition",
                      formData.shippingConfig?.type === "fixed"
                        ? "border-purple-600 bg-white font-bold text-purple-700 ring-2 ring-purple-500/20 shadow-xs dark:bg-zinc-800 dark:text-purple-300"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="generalShippingType"
                      checked={formData.shippingConfig?.type === "fixed"}
                      onChange={() =>
                        setFormData((p) => ({
                          ...p,
                          shippingConfig: { ...(p.shippingConfig || { type: "fixed" }), type: "fixed" },
                        }))
                      }
                      className="h-3.5 w-3.5 text-purple-600 focus:ring-purple-500"
                    />
                    <span>{locale === "ar" ? "سعر ثابت لكل الولايات" : "Tarif fixe"}</span>
                  </label>

                  {/* Free shipping */}
                  <label
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        shippingConfig: { ...(p.shippingConfig || { type: "free" }), type: "free" },
                      }))
                    }
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 rounded-lg border p-3 text-xs transition",
                      formData.shippingConfig?.type === "free"
                        ? "border-emerald-600 bg-white font-bold text-emerald-700 ring-2 ring-emerald-500/20 shadow-xs dark:bg-zinc-800 dark:text-emerald-300"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="generalShippingType"
                      checked={formData.shippingConfig?.type === "free"}
                      onChange={() =>
                        setFormData((p) => ({
                          ...p,
                          shippingConfig: { ...(p.shippingConfig || { type: "free" }), type: "free" },
                        }))
                      }
                      className="h-3.5 w-3.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {locale === "ar" ? "توصيل مجاني (0 دج)" : "Livraison gratuite"}
                    </span>
                  </label>
                </div>

                {formData.shippingConfig?.type === "fixed" && (
                  <div className="mt-3 grid gap-3 border-t border-purple-200/60 pt-3 sm:grid-cols-2 dark:border-purple-900/40">
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                        {locale === "ar" ? "سعر التوصيل للمنزل (د.ج)" : "Prix livraison domicile (DZD)"}
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="600"
                        value={formData.shippingConfig?.fixedHomePrice ?? ""}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            shippingConfig: {
                              ...(p.shippingConfig || { type: "fixed" }),
                              type: "fixed",
                              fixedHomePrice: Number(e.target.value) || 0,
                            },
                          }))
                        }
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                        {locale === "ar" ? "سعر التوصيل للمكتب / نقطة الاستلام (د.ج)" : "Prix livraison bureau (DZD)"}
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="400"
                        value={formData.shippingConfig?.fixedDeskPrice ?? ""}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            shippingConfig: {
                              ...(p.shippingConfig || { type: "fixed" }),
                              type: "fixed",
                              fixedDeskPrice: Number(e.target.value) || 0,
                            },
                          }))
                        }
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                  </div>
                )}
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

              {/* Description & Landing Page Section */}
              <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                <div>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      {locale === "ar" ? "وصف قصير للمنتج" : "Description courte"}
                    </label>
                    <span className="text-[10px] text-zinc-400 font-medium">
                      {locale === "ar" ? "يظهر في كرت المنتج" : "Affiché avec le produit"}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={formData.description.ar}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        description: { ...p.description, ar: e.target.value },
                      }))
                    }
                    placeholder={locale === "ar" ? "اكتب نبذة تعريفية أو وصفاً للمنتج..." : "Description du produit..."}
                    className="w-full rounded-lg border border-zinc-300 bg-white p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                </div>

                {/* Landing Page Images (صور صفحة الهبوط) */}
                <div className="border-t border-zinc-200 pt-3 dark:border-zinc-700">
                  <div className="mb-2.5 flex items-center justify-between gap-2">
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        <ImageIcon size={15} className="text-purple-600" />
                        <span>{locale === "ar" ? "صور صفحة الهبوط للمنتج (Landing Page)" : "Images de la Landing Page"}</span>
                      </label>
                      <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                        {locale === "ar"
                          ? "أضف صوراً إعلانية أو تفصيلية عالية الدقة تظهر كصفحة هبوط تسويقية مخصصة تحت المنتج لزيادة المبيعات."
                          : "Ajoutez des visuels pleine largeur sous le formulaire pour booster vos ventes."}
                      </p>
                    </div>
                    <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[11px] font-bold text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                      {(formData.landingImages?.length || 0)} {locale === "ar" ? "صور" : "images"}
                    </span>
                  </div>

                  {/* Upload & Add URL controls */}
                  <div className="flex flex-wrap items-center gap-2">
                    <label className={cn(
                      "flex cursor-pointer items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-purple-700",
                      uploadingLanding && "opacity-60 cursor-wait"
                    )}>
                      <Upload size={14} />
                      <span>
                        {uploadingLanding
                          ? locale === "ar" ? "جارٍ الرفع..." : "Téléversement..."
                          : locale === "ar" ? "رفع صورة / صور من جهازك" : "Téléverser image(s)"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={uploadingLanding}
                        onChange={handleLandingImageUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="flex flex-1 items-center gap-2">
                      <input
                        type="url"
                        placeholder={locale === "ar" ? "أو ضع رابط صورة صفحة الهبوط مباشرة (URL)" : "Ou collez le lien de l'image (URL)"}
                        value={newLandingImageUrl}
                        onChange={(e) => setNewLandingImageUrl(e.target.value)}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800"
                      />
                      <button
                        type="button"
                        onClick={handleAddLandingImageUrl}
                        className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                      >
                        {locale === "ar" ? "إضافة" : "Ajouter"}
                      </button>
                    </div>
                  </div>

                  {/* Preview List of Landing Images with Reorder & Remove */}
                  {(formData.landingImages && formData.landingImages.length > 0) ? (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {formData.landingImages.map((url, idx) => (
                        <div
                          key={idx}
                          className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-200 bg-white p-2.5 shadow-xs dark:border-zinc-700 dark:bg-zinc-800"
                        >
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`Landing ${idx + 1}`} className="h-full w-full object-cover" />
                          </div>
                          <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-zinc-100 pt-2 dark:border-zinc-700/60">
                            <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                              {locale === "ar" ? `صورة صفحة الهبوط #${idx + 1}` : `Image Landing #${idx + 1}`}
                            </span>
                            <div className="flex items-center gap-1">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveLandingImage(idx, "up")}
                                  className="rounded p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                                  title={locale === "ar" ? "تحريك لأعلى" : "Monter"}
                                >
                                  <ArrowUp size={13} />
                                </button>
                              )}
                              {idx < formData.landingImages!.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveLandingImage(idx, "down")}
                                  className="rounded p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                                  title={locale === "ar" ? "تحريك لأسفل" : "Descendre"}
                                >
                                  <ArrowDown size={13} />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveLandingImage(idx)}
                                className="rounded p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                title={locale === "ar" ? "حذف الصورة" : "Supprimer"}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {activeTab === "options" && (
            <div className="space-y-6">
              {/* Inventory Tracking Toggle */}
              <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold text-white transition shadow-sm",
                    (formData.trackStock ?? true) ? "bg-emerald-600" : "bg-zinc-500"
                  )}>
                    <Layers size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {locale === "ar" ? "نظام تتبع وإدارة المخزون" : "Gestion et suivi du stock"}
                      </h3>
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold",
                        (formData.trackStock ?? true)
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                      )}>
                        {(formData.trackStock ?? true)
                          ? (locale === "ar" ? "مفعّل (حسب الكميات)" : "Activé")
                          : (locale === "ar" ? "معطّل (مخزون غير محدود)" : "Stock illimité")}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      {(formData.trackStock ?? true)
                        ? (locale === "ar"
                            ? "يتم تتبع كميات كل مقاس ولون بدقة، وإخفاء الخيارات التي ينفد مخزونها (0) تلقائياً من الزبائن."
                            : "Le stock de chaque taille et couleur est contrôlé. Les variantes épuisées sont masquées.")
                        : (locale === "ar"
                            ? "المنتج متوفر دائماً للطلب بدون قيود على المخزون (لن يتم إخفاء أي مقاس أو لون عند نفاذ الكمية)."
                            : "Le produit est toujours disponible sans limite de quantité pour les clients.")
                      }
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex cursor-pointer items-center shrink-0">
                  <input
                    type="checkbox"
                    checked={formData.trackStock ?? true}
                    onChange={(e) => setFormData((p) => ({ ...p, trackStock: e.target.checked }))}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-zinc-300 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-zinc-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-zinc-700 rtl:peer-checked:after:-translate-x-full"></div>
                </label>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold">{locale === "ar" ? "المقاسات المتاحة" : "Tailles disponibles"}</h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      {locale === "ar" ? "تظهر المقاسات المضافة للزبون في صفحة المنتج." : "Les tailles seront proposées sur la fiche produit."}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-500">{formData.sizes.length}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    value={newSize}
                    onChange={(event) => setNewSize(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleAddSize();
                      }
                    }}
                    placeholder={locale === "ar" ? "مثال: XL أو 42" : "Ex. XL ou 42"}
                    className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <button type="button" onClick={handleAddSize} className="flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-2 text-xs font-bold text-white hover:bg-purple-700">
                    <Plus size={14} /> {locale === "ar" ? "إضافة مقاس" : "Ajouter"}
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.sizes.map((size) => (
                    <span key={size} className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-semibold dark:border-zinc-700 dark:bg-zinc-800">
                      {size}
                      <button
                        type="button"
                        onClick={() => {
                          updateProductOptions(formData.sizes.filter((item) => item !== size), formData.colors);
                          setOptionsError("");
                        }}
                        aria-label={locale === "ar" ? `حذف المقاس ${size}` : `Supprimer la taille ${size}`}
                        className="rounded p-0.5 text-zinc-400 hover:bg-rose-100 hover:text-rose-600"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                  {formData.sizes.length === 0 && <p className="text-xs text-zinc-400">{locale === "ar" ? "لم تتم إضافة مقاسات." : "Aucune taille."}</p>}
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-5 dark:border-zinc-800">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold">{locale === "ar" ? "الألوان المتاحة" : "Couleurs disponibles"}</h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      {locale === "ar" ? "أدخل الاسم باللغتين وحدد لون العرض." : "Ajoutez le nom dans les deux langues et choisissez la couleur."}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-500">{formData.colors.length}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto]">
                  <input
                    value={newColor.ar}
                    onChange={(event) => setNewColor((color) => ({ ...color, ar: event.target.value }))}
                    placeholder={locale === "ar" ? "اسم اللون بالعربية" : "Nom arabe"}
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <input
                    value={newColor.fr}
                    onChange={(event) => setNewColor((color) => ({ ...color, fr: event.target.value }))}
                    placeholder={locale === "ar" ? "اسم اللون بالفرنسية" : "Nom français"}
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <input
                    type="color"
                    value={newColor.hex}
                    onChange={(event) => setNewColor((color) => ({ ...color, hex: event.target.value }))}
                    aria-label={locale === "ar" ? "اختيار اللون" : "Choisir la couleur"}
                    className="h-10 w-full cursor-pointer rounded-lg border border-zinc-300 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <button type="button" onClick={handleAddColor} className="flex items-center justify-center gap-1 rounded-lg bg-purple-600 px-3 py-2 text-xs font-bold text-white hover:bg-purple-700">
                    <Plus size={14} /> {locale === "ar" ? "إضافة لون" : "Ajouter"}
                  </button>
                </div>
                <div className="mt-3 space-y-2">
                  {formData.colors.map((color, index) => (
                    <div key={`${color.hex}-${index}`} className="grid items-center gap-2 rounded-lg border border-zinc-200 p-2 sm:grid-cols-[auto_1fr_1fr_auto_auto] dark:border-zinc-800">
                      <span className="h-7 w-7 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                      <input
                        value={color.name.ar}
                        onChange={(event) => handleColorChange(index, "ar", event.target.value)}
                        aria-label={locale === "ar" ? "اسم اللون بالعربية" : "Nom arabe"}
                        className="min-w-0 rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                      />
                      <input
                        value={color.name.fr}
                        onChange={(event) => handleColorChange(index, "fr", event.target.value)}
                        aria-label={locale === "ar" ? "اسم اللون بالفرنسية" : "Nom français"}
                        className="min-w-0 rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                      />
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(event) => handleColorChange(index, "hex", event.target.value)}
                        aria-label={locale === "ar" ? "تعديل اللون" : "Modifier la couleur"}
                        className="h-9 w-12 cursor-pointer rounded-md border border-zinc-300 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          updateProductOptions(formData.sizes, formData.colors.filter((_, i) => i !== index));
                          setOptionsError("");
                        }}
                        aria-label={locale === "ar" ? `حذف اللون ${color.name.ar}` : `Supprimer ${color.name.fr}`}
                        className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {formData.colors.length === 0 && <p className="text-xs text-zinc-400">{locale === "ar" ? "لم تتم إضافة ألوان." : "Aucune couleur."}</p>}
                </div>
              </div>

              {optionsError && <p role="alert" className="text-xs font-medium text-rose-600">{optionsError}</p>}

              <div className="border-t border-zinc-200 pt-5 dark:border-zinc-800">
                <div className="mb-3">
                  <h3 className="text-sm font-bold">{locale === "ar" ? "مخزون كل مقاس ولون" : "Stock par taille et couleur"}</h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    {locale === "ar" ? "تُحفظ تركيبات المقاس واللون كخيارات مستقلة. يبدأ المخزون لأي تركيبة جديدة من صفر." : "Chaque combinaison est enregistrée séparément. Le stock des nouvelles combinaisons commence à zéro."}
                  </p>
                </div>

                {!(formData.trackStock ?? true) ? (
                  <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-center dark:border-blue-900/40 dark:bg-blue-950/20">
                    <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                      {locale === "ar"
                        ? "✨ نظام تتبع المخزون معطّل لهذا المنتج — جميع المقاسات والألوان المضافة أعلاه متاحة للطلب غير المحدود."
                        : "✨ Suivi de stock désactivé — toutes les tailles et couleurs sont commandables en quantité illimitée."}
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, trackStock: true }))}
                      className="mt-2 text-xs font-bold text-blue-700 underline hover:text-blue-900 dark:text-blue-400"
                    >
                      {locale === "ar" ? "تفعيل تتبع كميات المخزون الآن" : "Activer la gestion par quantité"}
                    </button>
                  </div>
                ) : formData.variants.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-800">
                        <tr>
                          <th className="px-3 py-2">{locale === "ar" ? "المقاس" : "Taille"}</th>
                          <th className="px-3 py-2">{locale === "ar" ? "اللون" : "Couleur"}</th>
                          <th className="px-3 py-2">{locale === "ar" ? "المخزون" : "Stock"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {formData.variants.map((variant) => (
                          <tr key={variant.id}>
                            <td className="px-3 py-2 font-semibold">{variant.size}</td>
                            <td className="px-3 py-2">
                              <span className="inline-flex items-center gap-2">
                                <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: variant.colorHex }} />
                                {variant.color[locale] || variant.color.ar}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                min="0"
                                value={variant.stock}
                                onChange={(event) => handleVariantStockChange(variant.id, Number(event.target.value) || 0)}
                                aria-label={`${variant.size} ${variant.color.ar}`}
                                className="w-24 rounded-md border border-zinc-300 bg-white px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-800"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                    {locale === "ar" ? "أضف مقاساً واحداً ولوناً واحداً على الأقل لإنشاء تركيبات المنتج." : "Ajoutez au moins une taille et une couleur pour créer les variantes."}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Images Management (Gallery + Landing Page) */}
          {activeTab === "images" && (
            <div className="space-y-8">
              {/* Product Gallery Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {locale === "ar" ? "صور معرض المنتج (Gallery)" : "Galerie principale du produit"}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {locale === "ar" ? "الصور الأساسية التي تظهر في سلايدر المنتج أعلى الصفحة" : "Photos présentées dans le carrousel principal"}
                    </p>
                  </div>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {formData.images.length} {locale === "ar" ? "صور" : "photos"}
                  </span>
                </div>

                {/* Upload & Add by URL */}
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                  <label className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow transition hover:bg-purple-700",
                    uploadingGallery && "opacity-60 cursor-wait"
                  )}>
                    <Upload size={16} />
                    <span>
                      {uploadingGallery
                        ? locale === "ar" ? "جارٍ الرفع..." : "Téléversement..."
                        : locale === "ar" ? "رفع صورة من جهازك" : "Téléverser une image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={uploadingGallery}
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
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt="" className="h-full w-full object-cover" />

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

              {/* Landing Page Images in Images Tab */}
              <div className="space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-purple-900 dark:text-purple-300">
                      {locale === "ar" ? "صور صفحة الهبوط المخصصة (Landing Page Visuals)" : "Visuels Landing Page"}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {locale === "ar"
                        ? "هذه الصور تعرض بكامل العرض كصفحة هبوط تسويقية أسفل تفاصيل المنتج"
                        : "Images grand format affichées sous le formulaire de commande"}
                    </p>
                  </div>
                  <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                    {(formData.landingImages?.length || 0)} {locale === "ar" ? "صور" : "images"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-purple-100 bg-purple-50/40 p-3.5 dark:border-purple-900/30 dark:bg-purple-950/20">
                  <label className={cn(
                    "flex cursor-pointer items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-purple-700",
                    uploadingLanding && "opacity-60 cursor-wait"
                  )}>
                    <Upload size={14} />
                    <span>
                      {uploadingLanding
                        ? locale === "ar" ? "جارٍ الرفع..." : "Téléversement..."
                        : locale === "ar" ? "رفع صور صفحة الهبوط" : "Téléverser visuel(s)"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={uploadingLanding}
                      onChange={handleLandingImageUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex flex-1 items-center gap-2">
                    <input
                      type="url"
                      placeholder={locale === "ar" ? "رابط صورة صفحة الهبوط (URL)..." : "Lien URL du visuel..."}
                      value={newLandingImageUrl}
                      onChange={(e) => setNewLandingImageUrl(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                    <button
                      type="button"
                      onClick={handleAddLandingImageUrl}
                      className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                    >
                      {locale === "ar" ? "إضافة" : "Ajouter"}
                    </button>
                  </div>
                </div>

                {(formData.landingImages && formData.landingImages.length > 0) ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {formData.landingImages.map((url, idx) => (
                      <div
                        key={idx}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-200 bg-white p-2.5 shadow-xs dark:border-zinc-700 dark:bg-zinc-800"
                      >
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Landing ${idx + 1}`} className="h-full w-full object-cover" />
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2 border-t border-zinc-100 pt-2 dark:border-zinc-700/60">
                          <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                            {locale === "ar" ? `صورة صفحة الهبوط #${idx + 1}` : `Visuel #${idx + 1}`}
                          </span>
                          <div className="flex items-center gap-1">
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveLandingImage(idx, "up")}
                                className="rounded p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                                title={locale === "ar" ? "تحريك لأعلى" : "Monter"}
                              >
                                <ArrowUp size={13} />
                              </button>
                            )}
                            {idx < formData.landingImages!.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveLandingImage(idx, "down")}
                                className="rounded p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                                title={locale === "ar" ? "تحريك لأسفل" : "Descendre"}
                              >
                                <ArrowDown size={13} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveLandingImage(idx)}
                              className="rounded p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              title={locale === "ar" ? "حذف" : "Supprimer"}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-xs text-zinc-400">
                    {locale === "ar" ? "لم تتم إضافة أي صور لصفحة الهبوط بعد." : "Aucun visuel de landing page."}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Offers / Packs Management */}
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

          {/* TAB 5: Shipping Prices */}
          {activeTab === "shipping" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-800/30">
                <div className="mb-4 flex items-center gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
                  <Truck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {locale === "ar" ? "تسعير الولايات وتكاليف التوصيل" : "Tarification de livraison"}
                  </h3>
                </div>

                <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
                  {locale === "ar"
                    ? "اختر كيفية حساب تكلفة التوصيل لهذا المنتج عند طلب الزبون:"
                    : "Choisissez le mode de calcul des frais de livraison pour ce produit :"}
                </p>

                <div className="space-y-3">
                  {/* Option 1: Store Price */}
                  <label
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        shippingConfig: { ...(p.shippingConfig || { type: "store" }), type: "store" },
                      }))
                    }
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
                      (formData.shippingConfig?.type || "store") === "store"
                        ? "border-purple-600 bg-purple-50/40 ring-1 ring-purple-600/30 dark:border-purple-500 dark:bg-purple-950/20"
                        : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
                    )}
                  >
                    <input
                      type="radio"
                      name="shippingType"
                      checked={(formData.shippingConfig?.type || "store") === "store"}
                      onChange={() =>
                        setFormData((p) => ({
                          ...p,
                          shippingConfig: { ...(p.shippingConfig || { type: "store" }), type: "store" },
                        }))
                      }
                      className="mt-0.5 h-4 w-4 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {locale === "ar" ? "استخدام سعر المتجر للتوصيل" : "Utiliser les tarifs généraux de la boutique"}
                      </div>
                      <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                        {locale === "ar"
                          ? "تطبيق أسعار التوصيل المحددة في الإعدادات العامة للمتجر حسب كل ولاية."
                          : "Appliquer les tarifs configurés dans les paramètres généraux du magasin."}
                      </div>
                    </div>
                  </label>

                  {/* Option 2: Fixed Price */}
                  <div
                    className={cn(
                      "rounded-xl border p-4 transition",
                      formData.shippingConfig?.type === "fixed"
                        ? "border-purple-600 bg-purple-50/40 ring-1 ring-purple-600/30 dark:border-purple-500 dark:bg-purple-950/20"
                        : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
                    )}
                  >
                    <label
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          shippingConfig: { ...(p.shippingConfig || { type: "fixed" }), type: "fixed" },
                        }))
                      }
                      className="flex cursor-pointer items-start gap-3"
                    >
                      <input
                        type="radio"
                        name="shippingType"
                        checked={formData.shippingConfig?.type === "fixed"}
                        onChange={() =>
                          setFormData((p) => ({
                            ...p,
                            shippingConfig: { ...(p.shippingConfig || { type: "fixed" }), type: "fixed" },
                          }))
                        }
                        className="mt-0.5 h-4 w-4 text-purple-600 focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          {locale === "ar"
                            ? "تحديد سعر توصيل ثابت لكل الولايات"
                            : "Tarif de livraison fixe pour toutes les wilayas"}
                        </div>
                        <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                          {locale === "ar"
                            ? "تحديد سعر موحد للتوصيل للمنزل وللمكتب ينطبق على كافة الولايات لهذا المنتج."
                            : "Définir un prix fixe pour la livraison à domicile et en bureau pour ce produit."}
                        </div>
                      </div>
                    </label>

                    {formData.shippingConfig?.type === "fixed" && (
                      <div className="mt-4 grid gap-4 border-t border-purple-200/60 pt-4 sm:grid-cols-2 dark:border-purple-900/40">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            {locale === "ar" ? "سعر التوصيل للمنزل (د.ج)" : "Prix livraison domicile (DZD)"}
                          </label>
                          <input
                            type="number"
                            min="0"
                            placeholder="600"
                            value={formData.shippingConfig?.fixedHomePrice ?? ""}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                shippingConfig: {
                                  ...(p.shippingConfig || { type: "fixed" }),
                                  type: "fixed",
                                  fixedHomePrice: Number(e.target.value) || 0,
                                },
                              }))
                            }
                            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-bold text-zinc-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            {locale === "ar" ? "سعر التوصيل للمكتب / نقطة الاستلام (د.ج)" : "Prix livraison bureau (DZD)"}
                          </label>
                          <input
                            type="number"
                            min="0"
                            placeholder="400"
                            value={formData.shippingConfig?.fixedDeskPrice ?? ""}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                shippingConfig: {
                                  ...(p.shippingConfig || { type: "fixed" }),
                                  type: "fixed",
                                  fixedDeskPrice: Number(e.target.value) || 0,
                                },
                              }))
                            }
                            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-bold text-zinc-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Option 3: Custom / Default per wilaya */}
                  <label
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        shippingConfig: { ...(p.shippingConfig || { type: "custom" }), type: "custom" },
                      }))
                    }
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
                      formData.shippingConfig?.type === "custom"
                        ? "border-purple-600 bg-purple-50/40 ring-1 ring-purple-600/30 dark:border-purple-500 dark:bg-purple-950/20"
                        : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
                    )}
                  >
                    <input
                      type="radio"
                      name="shippingType"
                      checked={formData.shippingConfig?.type === "custom"}
                      onChange={() =>
                        setFormData((p) => ({
                          ...p,
                          shippingConfig: { ...(p.shippingConfig || { type: "custom" }), type: "custom" },
                        }))
                      }
                      className="mt-0.5 h-4 w-4 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {locale === "ar" ? "السعر الافتراضي لكل ولاية" : "Tarif par défaut pour chaque wilaya"}
                      </div>
                      <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                        {locale === "ar"
                          ? "استخدام تسعير كل ولاية الفردي المعتمد في المتجر."
                          : "Utiliser la tarification par défaut de chaque wilaya."}
                      </div>
                    </div>
                  </label>

                  {/* Option 4: Free Shipping */}
                  <label
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        shippingConfig: { ...(p.shippingConfig || { type: "free" }), type: "free" },
                      }))
                    }
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
                      formData.shippingConfig?.type === "free"
                        ? "border-purple-600 bg-purple-50/40 ring-1 ring-purple-600/30 dark:border-purple-500 dark:bg-purple-950/20"
                        : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
                    )}
                  >
                    <input
                      type="radio"
                      name="shippingType"
                      checked={formData.shippingConfig?.type === "free"}
                      onChange={() =>
                        setFormData((p) => ({
                          ...p,
                          shippingConfig: { ...(p.shippingConfig || { type: "free" }), type: "free" },
                        }))
                      }
                      className="mt-0.5 h-4 w-4 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {locale === "ar" ? "التوصيل مجاني" : "Livraison gratuite"}
                        </span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          0 DZD
                        </span>
                      </div>
                      <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                        {locale === "ar"
                          ? "توصيل مجاني 0 د.ج لجميع الولايات والزبائن لهذا المنتج."
                          : "Livraison 100% offerte (0 DZD) pour toutes les wilayas pour ce produit."}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
          {saveError ? (
            <p className="me-auto w-full text-xs text-red-700 dark:text-red-300" role="alert">
              {saveError}
            </p>
          ) : null}
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
            disabled={saving}
            className="rounded-lg bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/30 hover:bg-purple-700 active:scale-95 disabled:cursor-wait disabled:opacity-60"
          >
            {saving
              ? locale === "ar" ? "جارٍ الحفظ..." : "Enregistrement..."
              : locale === "ar" ? "حفظ التعديلات" : "Enregistrer les modifications"}
          </button>
        </div>
      </div>
    </div>
  );
}
