"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Palette,
  Store,
  Tags,
  Check,
  LayoutTemplate,
  Upload,
  X,
  CreditCard,
  RotateCcw,
  Lightbulb,
  Sparkles,
  Save,
  Trash2,
  Plus,
  Globe,
  ExternalLink,
  CheckCircle2,
  Gift,
  Star,
} from "lucide-react";
import type { Category, Localized, Product } from "@/types";
import { useLocale } from "@/providers/locale-provider";
import { useSettingsStore } from "@/stores/settings-store";
import { AdminHomepageEditor } from "@/components/admin/admin-homepage-editor";
import { toast } from "@/components/ui/toast";
import { isSupabaseConfigured } from "@/lib/supabase/configured";
import { uid } from "@/lib/utils";

interface AdminStoreDesignProps {
  products: Product[];
  categories: Category[];
  onSaveCategory: (category: Category) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

type DesignTab = "identity" | "categories" | "thankyou" | "themes";

export function AdminStoreDesign({
  products,
  categories,
  onSaveCategory,
  onDeleteCategory,
}: AdminStoreDesignProps) {
  const { locale } = useLocale();
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const saveSharedSettings = useSettingsStore((s) => s.saveSharedSettings);
  const storefront = settings.storefront;

  const [activeTab, setActiveTab] = useState<DesignTab>("identity");
  const [saving, setSaving] = useState(false);

  // Thank You Page Preview Modal
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showPaymentPolicyModal, setShowPaymentPolicyModal] = useState(false);
  const [showExchangePolicyModal, setShowExchangePolicyModal] = useState(false);

  // Local Category Editing State
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  const [savingCategoryIndex, setSavingCategoryIndex] = useState<number | null>(null);

  function updateStorefront(patch: Partial<typeof storefront>) {
    updateSettings({
      storefront: {
        ...useSettingsStore.getState().settings.storefront,
        ...patch,
      },
    });
  }

  async function handleSaveChanges() {
    setSaving(true);
    try {
      if (isSupabaseConfigured()) {
        await saveSharedSettings();
        toast(
          locale === "ar"
            ? "تم حفظ كافة التغييرات ونشرها في المتجر بنجاح!"
            : "Toutes les modifications ont été enregistrées avec succès !",
        );
      } else {
        toast(
          locale === "ar"
            ? "تم حفظ التغييرات محلياً في المتصفح."
            : "Modifications enregistrées localement.",
        );
      }
    } catch (error) {
      console.error("Failed to save store design", error);
      toast(
        locale === "ar"
          ? "تعذر حفظ التعديلات. تحقق من الاتصال بالخادم."
          : "Erreur lors de l'enregistrement.",
      );
    } finally {
      setSaving(false);
    }
  }

  // Handle image upload from file or URL
  function handleImageUpload(
    file: File,
    callback: (url: string) => void,
  ) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) callback(result);
    };
    reader.readAsDataURL(file);
  }

  // Category Add / Update
  function handleAddCategory() {
    const newCat: Category = {
      id: uid("cat"),
      slug: `category-${Date.now().toString(36)}`,
      name: { ar: `تصنيف جديد`, fr: `Nouvelle catégorie` },
      description: { ar: "", fr: "" },
      image: "",
    };
    setLocalCategories((prev) => [...prev, newCat]);
  }

  async function handleSaveSingleCategory(category: Category, index: number) {
    if (!category.name.ar.trim() || !category.name.fr.trim()) {
      toast(locale === "ar" ? "أدخل اسم التصنيف بالعربية والفرنسية." : "Renseignez le nom de la catégorie.");
      return;
    }
    setSavingCategoryIndex(index);
    try {
      await onSaveCategory(category);
      toast(locale === "ar" ? `تم حفظ تصنيف «${category.name.ar}»!` : "Catégorie enregistrée !");
    } catch (error) {
      console.error("Failed to save category", error);
      toast(locale === "ar" ? "تعذر حفظ التصنيف." : "Erreur lors de l'enregistrement.");
    } finally {
      setSavingCategoryIndex(null);
    }
  }

  async function handleDeleteCategory(id: string, name: string) {
    if (confirm(locale === "ar" ? `هل أنت متأكد من حذف تصنيف «${name}»؟` : `Supprimer «${name}» ?`)) {
      try {
        await onDeleteCategory(id);
        setLocalCategories((prev) => prev.filter((c) => c.id !== id));
        toast(locale === "ar" ? "تم حذف التصنيف." : "Catégorie supprimée.");
      } catch (error) {
        toast(
          locale === "ar"
            ? "لا يمكن حذف تصنيف مرتبط بمنتجات، قم بتغيير فئة المنتجات أولاً."
            : "Impossible de supprimer une catégorie liée à des produits.",
        );
      }
    }
  }

  return (
    <div className="space-y-6" dir={locale === "ar" ? "rtl" : "ltr"}>
      {/* Top Header & Subtabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2.5">
            <Palette className="text-purple-400" size={22} />
            <span>{locale === "ar" ? "تصميم المتجر" : "Design du magasin"}</span>
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            {locale === "ar"
              ? "تخصيص مظهر وسمات وهوية متجرك وصفحة الشكر والفئات"
              : "Personnalisez l'identité, les catégories, la page de remerciement et le thème de votre boutique"}
          </p>
        </div>

        {/* Global Save Button */}
        <button
          type="button"
          disabled={saving}
          onClick={() => void handleSaveChanges()}
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 active:scale-95 transition disabled:opacity-50"
        >
          <Save size={15} />
          <span>{saving ? (locale === "ar" ? "جاري الحفظ..." : "Enregistrement...") : (locale === "ar" ? "حفظ التغييرات" : "Enregistrer")}</span>
        </button>
      </div>

      {/* Navigation Subtabs (Matching Reference) */}
      <div className="flex rounded-xl bg-zinc-900 border border-zinc-800 p-1 text-xs font-bold">
        {[
          { key: "identity", label: locale === "ar" ? "هوية المتجر" : "Identité du magasin", icon: Store },
          { key: "categories", label: locale === "ar" ? "الفئات" : "Catégories", icon: Tags },
          { key: "thankyou", label: locale === "ar" ? "صفحة الشكر والسياسات" : "Page de remerciement & Politiques", icon: Check },
          { key: "themes", label: locale === "ar" ? "الثيمات وقالب الصفحة" : "Thèmes & Modèle", icon: LayoutTemplate },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition ${
                isActive
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: هوية المتجر (Store Identity)                      */}
      {/* ======================================================== */}
      {activeTab === "identity" && (
        <div className="space-y-6">
          {/* Colors Section */}
          <section className="rounded-2xl border border-[#262835] bg-[#181920] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                  <Palette size={16} />
                  <span>{locale === "ar" ? "الألوان" : "Couleurs"}</span>
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  {locale === "ar"
                    ? "يرجى تجنب استخدام اللون الأبيض لتفادي إخفاء الأزرار والميزات"
                    : "Évitez le blanc pour assurer la lisibilité des boutons"}
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_260px] items-center">
              {/* Inputs */}
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Primary Color */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">
                      {locale === "ar" ? "اللون الأساسي" : "Couleur principale"}
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2">
                      <input
                        type="color"
                        value={storefront.primaryColor || "#ababab"}
                        onChange={(e) => updateStorefront({ primaryColor: e.target.value })}
                        className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={storefront.primaryColor || "#ababab"}
                        onChange={(e) => updateStorefront({ primaryColor: e.target.value })}
                        className="w-full bg-transparent font-mono text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">
                      {locale === "ar" ? "اللون الفرعي" : "Couleur secondaire"}
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2">
                      <input
                        type="color"
                        value={storefront.secondaryColor || "#02d6f2"}
                        onChange={(e) => updateStorefront({ secondaryColor: e.target.value })}
                        className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={storefront.secondaryColor || "#02d6f2"}
                        onChange={(e) => updateStorefront({ secondaryColor: e.target.value })}
                        className="w-full bg-transparent font-mono text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Mockup Preview */}
              <div className="flex justify-center">
                <div className="w-36 rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-2 shadow-xl">
                  <div className="h-2 w-8 mx-auto rounded-full bg-zinc-700 mb-2" />
                  <div
                    className="h-12 w-full rounded-lg mb-2 flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                    style={{ backgroundColor: storefront.primaryColor || "#ababab" }}
                  >
                    Hero
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mb-2">
                    <div className="h-8 rounded bg-zinc-800" />
                    <div className="h-8 rounded bg-zinc-800" />
                  </div>
                  <div
                    className="h-5 w-full rounded text-[9px] flex items-center justify-center font-bold text-black"
                    style={{ backgroundColor: storefront.secondaryColor || "#02d6f2" }}
                  >
                    Button
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Store Logo Section */}
          <section className="rounded-2xl border border-[#262835] bg-[#181920] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                  <Store size={16} />
                  <span>{locale === "ar" ? "شعار المتجر" : "Logo du magasin"}</span>
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  {locale === "ar"
                    ? "المواصفات: العرض: 800 بكسل، الطول: 800 بكسل، الحجم الأقصى: 2 ميجابايت (JPEG, PNG)"
                    : "Spécifications : 800x800 px, Max 2 Mo (JPEG, PNG)"}
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 items-center">
              {/* Logo Uploader / Preview */}
              <div className="flex flex-col items-center justify-center">
                {storefront.logoUrl ? (
                  <div className="relative flex h-32 w-32 items-center justify-center rounded-2xl border border-zinc-700 bg-white p-2 shadow-md">
                    <Image
                      src={storefront.logoUrl}
                      alt="Logo"
                      width={100}
                      height={100}
                      unoptimized
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => updateStorefront({ logoUrl: "" })}
                      className="absolute -top-2 -end-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 w-48 rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 hover:border-purple-500 cursor-pointer transition">
                    <Upload size={24} className="text-purple-400 mb-1" />
                    <span className="text-xs font-semibold text-zinc-300">
                      {locale === "ar" ? "رفع صورة الشعار" : "Téléverser le logo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, (url) => updateStorefront({ logoUrl: url }));
                      }}
                    />
                  </label>
                )}
                <div className="mt-3 w-full max-w-xs">
                  <input
                    type="url"
                    placeholder={locale === "ar" ? "أو أدخل رابط الشعار (URL)..." : "Ou lien direct du logo..."}
                    value={storefront.logoUrl || ""}
                    onChange={(e) => updateStorefront({ logoUrl: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Mock Header Preview */}
              <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-center">
                <p className="text-[11px] font-semibold text-zinc-400 mb-2">
                  {locale === "ar" ? "معاينة رأس الصفحة" : "Aperçu de l'en-tête"}
                </p>
                <div className="h-16 w-full rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  {storefront.logoUrl ? (
                    <div className="h-10 w-10 relative overflow-hidden rounded-full border border-white/20 bg-white">
                      <Image
                        src={storefront.logoUrl}
                        alt=""
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="font-serif font-bold text-white text-base tracking-widest">
                      {storefront.storeName || "VELORA"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Favicon / Store Icon Section */}
          <section className="rounded-2xl border border-[#262835] bg-[#181920] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                  <Globe size={16} />
                  <span>{locale === "ar" ? "أيقونة المتجر (Favicon)" : "Icône du navigateur (Favicon)"}</span>
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  {locale === "ar"
                    ? "المواصفات: العرض: 32 بكسل، الطول: 32 بكسل، تظهر في لسان المتصفح بجانب اسم المتجر"
                    : "Spécifications : 32x32 px, apparaît dans l'onglet du navigateur"}
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 items-center">
              {/* Favicon Uploader */}
              <div className="flex flex-col items-center justify-center">
                {storefront.faviconUrl ? (
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-xl border border-zinc-700 bg-white p-2 shadow-md">
                    <Image
                      src={storefront.faviconUrl}
                      alt="Favicon"
                      width={40}
                      height={40}
                      unoptimized
                      className="object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => updateStorefront({ faviconUrl: "" })}
                      className="absolute -top-2 -end-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white hover:bg-rose-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-20 w-36 rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 hover:border-purple-500 cursor-pointer transition">
                    <Upload size={18} className="text-purple-400 mb-1" />
                    <span className="text-[11px] font-semibold text-zinc-300">
                      {locale === "ar" ? "رفع الأيقونة" : "Téléverser l'icône"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, (url) => updateStorefront({ faviconUrl: url }));
                      }}
                    />
                  </label>
                )}
                <div className="mt-3 w-full max-w-xs">
                  <input
                    type="url"
                    placeholder={locale === "ar" ? "رابط أيقونة Favicon..." : "URL de l'icône..."}
                    value={storefront.faviconUrl || ""}
                    onChange={(e) => updateStorefront({ faviconUrl: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Browser Tab Mockup */}
              <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
                <p className="text-[11px] font-semibold text-zinc-400 mb-2">
                  {locale === "ar" ? "معاينة لسان المتصفح" : "Aperçu de l'onglet"}
                </p>
                <div className="flex items-center gap-2 rounded-t-lg bg-zinc-800 px-3 py-2 border-b border-zinc-700 max-w-xs mx-auto">
                  {storefront.faviconUrl ? (
                    <Image
                      src={storefront.faviconUrl}
                      alt=""
                      width={16}
                      height={16}
                      unoptimized
                      className="h-4 w-4 rounded object-contain"
                    />
                  ) : (
                    <div className="h-4 w-4 rounded bg-purple-600 text-white font-bold text-[9px] flex items-center justify-center">
                      V
                    </div>
                  )}
                  <span className="text-xs font-semibold text-zinc-200 truncate">
                    {storefront.storeName || "Velora Store"}
                  </span>
                  <X size={12} className="ms-auto text-zinc-400" />
                </div>
              </div>
            </div>
          </section>

          {/* Announcements Bar Section */}
          <section className="rounded-2xl border border-[#262835] bg-[#181920] p-5 sm:p-6 shadow-sm">
            <h3 className="text-sm font-bold text-purple-300 border-b border-zinc-800 pb-3 mb-4">
              {locale === "ar" ? "شريط إعلانات المتجر العلوية" : "Barre d'annonces supérieure"}
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map((num) => {
                const key = `announcement${num}` as keyof typeof storefront.announcements;
                const value = storefront.announcements?.[key] || { ar: "", fr: "" };
                return (
                  <div key={num} className="grid gap-2 sm:grid-cols-2">
                    <label className="text-xs text-zinc-300">
                      {locale === "ar" ? `إعلان ${num} (العربية)` : `Annonce ${num} (Arabe)`}
                      <input
                        type="text"
                        dir="rtl"
                        value={value.ar}
                        onChange={(e) => {
                          const updated = {
                            ...storefront.announcements,
                            [key]: { ...value, ar: e.target.value },
                          };
                          updateStorefront({ announcements: updated as any });
                        }}
                        className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white"
                      />
                    </label>
                    <label className="text-xs text-zinc-300">
                      {locale === "ar" ? `إعلان ${num} (Français)` : `Annonce ${num} (Français)`}
                      <input
                        type="text"
                        dir="ltr"
                        value={value.fr}
                        onChange={(e) => {
                          const updated = {
                            ...storefront.announcements,
                            [key]: { ...value, fr: e.target.value },
                          };
                          updateStorefront({ announcements: updated as any });
                        }}
                        className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white"
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: الفئات (Categories with Image & Name)              */}
      {/* ======================================================== */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                <Tags size={18} />
                <span>{locale === "ar" ? "الفئات وتصنيفات المتجر" : "Catégories de produits"}</span>
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                {locale === "ar"
                  ? "أضف صورة واسم لكل تصنيف يظهر لزوار متجرك"
                  : "Ajoutez une image et un nom pour chaque catégorie"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddCategory}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-500 transition"
            >
              <Plus size={14} />
              <span>{locale === "ar" ? "إضافة تصنيف جديد" : "Ajouter catégorie"}</span>
            </button>
          </div>

          {/* Categories Grid (Matching Image 2) */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {localCategories.map((category, index) => (
              <div
                key={category.id || index}
                className="flex flex-col justify-between rounded-2xl border border-[#262835] bg-[#181920] p-4 text-center shadow-sm relative group"
              >
                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => void handleDeleteCategory(category.id, category.name.ar)}
                  className="absolute top-2.5 end-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600/80 text-white opacity-0 group-hover:opacity-100 transition hover:bg-rose-600"
                  title={locale === "ar" ? "حذف" : "Supprimer"}
                >
                  <Trash2 size={12} />
                </button>

                {/* Category Image Box */}
                <div className="mb-3">
                  {category.image ? (
                    <div className="relative h-28 w-full overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900">
                      <Image
                        src={category.image}
                        alt=""
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...localCategories];
                          updated[index].image = "";
                          setLocalCategories(updated);
                        }}
                        className="absolute bottom-2 end-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] text-white"
                      >
                        {locale === "ar" ? "تغيير" : "Changer"}
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-28 w-full rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 hover:border-purple-500 cursor-pointer transition p-2">
                      <Upload size={20} className="text-purple-400 mb-1" />
                      <span className="text-[11px] font-semibold text-zinc-300">
                        {locale === "ar" ? "صورة التصنيف" : "Image catégorie"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file, (url) => {
                              const updated = [...localCategories];
                              updated[index].image = url;
                              setLocalCategories(updated);
                            });
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* Category Name Inputs */}
                <div className="space-y-2 mb-3">
                  <input
                    type="text"
                    dir="rtl"
                    placeholder={locale === "ar" ? "اسم التصنيف (بالعربية)" : "Nom (Arabe)"}
                    value={category.name.ar}
                    onChange={(e) => {
                      const updated = [...localCategories];
                      updated[index].name.ar = e.target.value;
                      setLocalCategories(updated);
                    }}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-semibold text-center"
                  />
                  <input
                    type="text"
                    dir="ltr"
                    placeholder={locale === "ar" ? "الاسم بالفرنسية" : "Nom (Français)"}
                    value={category.name.fr}
                    onChange={(e) => {
                      const updated = [...localCategories];
                      updated[index].name.fr = e.target.value;
                      setLocalCategories(updated);
                    }}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 text-center"
                  />
                </div>

                {/* Save Single Category Button */}
                <button
                  type="button"
                  disabled={savingCategoryIndex === index}
                  onClick={() => void handleSaveSingleCategory(category, index)}
                  className="w-full rounded-lg bg-zinc-800 hover:bg-purple-600 hover:text-white py-1.5 text-xs font-bold text-zinc-300 transition"
                >
                  {savingCategoryIndex === index
                    ? locale === "ar"
                      ? "جاري الحفظ..."
                      : "..."
                    : locale === "ar"
                      ? "حفظ التصنيف"
                      : "Enregistrer"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: صفحة الشكر والسياسات (Thank You Page & Policies)  */}
      {/* ======================================================== */}
      {activeTab === "thankyou" && (
        <div className="space-y-6">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="text-sm font-bold text-purple-300 flex items-center gap-2">
              <Check size={18} />
              <span>{locale === "ar" ? "صفحة الشكر وسياسات المتجر" : "Page de remerciement et politiques"}</span>
            </h2>
            <p className="mt-1 text-xs text-zinc-400">
              {locale === "ar"
                ? "تخصيص الرسائل التي تظهر للعميل بعد تقديم الطلب وسياسات الدفع والاسترجاع"
                : "Personnalisez les messages affichés après commande et les politiques"}
            </p>
          </div>

          {/* 3 Main Action Cards (Matching Image 3) */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Card 1: Payment Policy */}
            <button
              type="button"
              onClick={() => setShowPaymentPolicyModal(true)}
              className="flex flex-col items-center justify-center rounded-2xl border border-[#262835] bg-[#181920] p-6 text-center shadow-sm hover:border-purple-500 hover:bg-purple-950/10 transition group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/15 text-purple-300 mb-3 group-hover:scale-110 transition">
                <CreditCard size={24} />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                {locale === "ar" ? "سياسة الدفع" : "Politique de paiement"}
              </h3>
              <p className="text-xs text-zinc-400">
                {locale === "ar" ? "تحديد سياسات الدفع الخاصة بالمتجر" : "Définir les conditions de paiement"}
              </p>
            </button>

            {/* Card 2: Return Policy */}
            <button
              type="button"
              onClick={() => setShowExchangePolicyModal(true)}
              className="flex flex-col items-center justify-center rounded-2xl border border-[#262835] bg-[#181920] p-6 text-center shadow-sm hover:border-purple-500 hover:bg-purple-950/10 transition group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/15 text-emerald-300 mb-3 group-hover:scale-110 transition">
                <RotateCcw size={24} />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                {locale === "ar" ? "سياسة الاستبدال والاسترجاع" : "Politique de retour et échange"}
              </h3>
              <p className="text-xs text-zinc-400">
                {locale === "ar" ? "تحديد سياسات الاستبدال لمنتجاتك" : "Définir les conditions d'échange"}
              </p>
            </button>

            {/* Card 3: Thank You Page Editor */}
            <button
              type="button"
              onClick={() => setShowThankYouModal(true)}
              className="flex flex-col items-center justify-center rounded-2xl border border-purple-500/50 bg-[#181920] p-6 text-center shadow-lg hover:border-purple-400 hover:bg-purple-950/20 transition group ring-1 ring-purple-500/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 mb-3 group-hover:scale-110 transition">
                <Lightbulb size={24} />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                {locale === "ar" ? "صفحة الشكر (معاينة وتحرير)" : "Page de remerciement (Aperçu)"}
              </h3>
              <p className="text-xs text-zinc-400">
                {locale === "ar" ? "تخصيص محتوى صفحة الشكر بعد إتمام الطلب" : "Personnaliser le message de confirmation"}
              </p>
            </button>
          </div>

          {/* Thank You Page Live Modal Preview (Matching Image 4) */}
          {showThankYouModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <div
                className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-[#262835] bg-[#14151b] p-6 shadow-2xl"
                dir={locale === "ar" ? "rtl" : "ltr"}
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setShowThankYouModal(false)}
                  className="absolute top-4 end-4 z-10 rounded-full bg-zinc-800 p-2 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                >
                  <X size={18} />
                </button>

                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Lightbulb size={18} className="text-amber-400" />
                  <span>{locale === "ar" ? "تخصيص ومعاينة صفحة الشكر" : "Personnalisation de la page de remerciement"}</span>
                </h3>

                {/* Visual Card Preview (Matching Image 4 Exactly) */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 text-center shadow-xl text-zinc-900 mb-6">
                  {/* Top Checkmark Circle */}
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 border-4 border-cyan-400 text-cyan-600 shadow-sm">
                    <CheckCircle2 size={36} className="stroke-[2.5]" />
                  </div>

                  {/* Main Title */}
                  <h2 className="text-2xl font-black text-cyan-600 mb-4">
                    {storefront.thankYou?.title?.[locale] || (locale === "ar" ? "شُكراً جزيلاً على ثقتكم" : "Merci beaucoup pour votre confiance")}
                  </h2>

                  {/* Highlight Green Banner */}
                  <div className="mx-auto max-w-lg rounded-xl bg-emerald-600 px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-md flex items-center justify-center gap-2 mb-4">
                    <Star size={16} className="fill-current text-white shrink-0" />
                    <span>
                      {storefront.thankYou?.highlightBanner?.[locale] || (locale === "ar" ? "تم استلام الطلب بنجاح! سيصل طلبك بعد 24 أو 48 ساعة على الأكثر" : "Commande reçue avec succès ! Livraison sous 24 à 48h")}
                    </span>
                    <Star size={16} className="fill-current text-white shrink-0" />
                  </div>

                  {/* Description text */}
                  <p className="mx-auto max-w-md text-xs sm:text-sm leading-relaxed text-zinc-700 mb-5 font-medium">
                    {storefront.thankYou?.body?.[locale] || (locale === "ar" ? "نحن نقدر تفضيلك لمنتجاتنا ونحن سعداء لإعلامك أن طلبك قد تم استلامه بنجاح." : "Nous apprécions votre commande.")}
                  </p>

                  {/* Yellow Alert Box */}
                  <div className="mx-auto max-w-lg rounded-xl border border-amber-300 bg-amber-50/80 p-3.5 text-xs text-amber-900 flex items-start gap-2.5 text-start">
                    <Gift size={20} className="text-amber-700 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold text-amber-950 mb-0.5">
                        {locale === "ar" ? "ملاحظة مهمة:" : "Note importante :"}
                      </p>
                      <p className="leading-relaxed">
                        {storefront.thankYou?.importantNote?.[locale] || (locale === "ar" ? "يرجى الاطلاع على الإشعار في الأسفل لتأكيد طلبك (لن يتم إرسال الطلب بدون تأكيده)" : "Veuillez répondre à notre appel pour confirmer l'envoi.")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit Fields for Thank You Page */}
                <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 text-xs">
                  <p className="font-bold text-purple-300">
                    {locale === "ar" ? "تعديل نصوص صفحة الشكر:" : "Modifier les textes :"}
                  </p>

                  {/* Main Title input */}
                  <div>
                    <label className="block text-zinc-400 mb-1">
                      {locale === "ar" ? "العنوان الرئيسي" : "Titre principal"}
                    </label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        dir="rtl"
                        value={storefront.thankYou?.title?.ar || ""}
                        onChange={(e) => updateStorefront({
                          thankYou: {
                            ...storefront.thankYou,
                            title: { ...storefront.thankYou.title, ar: e.target.value }
                          }
                        })}
                        placeholder="العنوان بالعربية"
                        className="rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-white"
                      />
                      <input
                        dir="ltr"
                        value={storefront.thankYou?.title?.fr || ""}
                        onChange={(e) => updateStorefront({
                          thankYou: {
                            ...storefront.thankYou,
                            title: { ...storefront.thankYou.title, fr: e.target.value }
                          }
                        })}
                        placeholder="Titre en français"
                        className="rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-white"
                      />
                    </div>
                  </div>

                  {/* Green Banner input */}
                  <div>
                    <label className="block text-zinc-400 mb-1">
                      {locale === "ar" ? "نص الشريط الأخضر البارز" : "Bannière verte"}
                    </label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        dir="rtl"
                        value={storefront.thankYou?.highlightBanner?.ar || ""}
                        onChange={(e) => updateStorefront({
                          thankYou: {
                            ...storefront.thankYou,
                            highlightBanner: { ar: e.target.value, fr: storefront.thankYou?.highlightBanner?.fr || "" }
                          }
                        })}
                        placeholder="نص الشريط الأخضر"
                        className="rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-white"
                      />
                      <input
                        dir="ltr"
                        value={storefront.thankYou?.highlightBanner?.fr || ""}
                        onChange={(e) => updateStorefront({
                          thankYou: {
                            ...storefront.thankYou,
                            highlightBanner: { ar: storefront.thankYou?.highlightBanner?.ar || "", fr: e.target.value }
                          }
                        })}
                        placeholder="Texte bannière"
                        className="rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-white"
                      />
                    </div>
                  </div>

                  {/* Body description */}
                  <div>
                    <label className="block text-zinc-400 mb-1">
                      {locale === "ar" ? "رسالة الشكر والتوضيح" : "Message de confirmation"}
                    </label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <textarea
                        rows={2}
                        dir="rtl"
                        value={storefront.thankYou?.body?.ar || ""}
                        onChange={(e) => updateStorefront({
                          thankYou: {
                            ...storefront.thankYou,
                            body: { ...storefront.thankYou.body, ar: e.target.value }
                          }
                        })}
                        className="rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-white"
                      />
                      <textarea
                        rows={2}
                        dir="ltr"
                        value={storefront.thankYou?.body?.fr || ""}
                        onChange={(e) => updateStorefront({
                          thankYou: {
                            ...storefront.thankYou,
                            body: { ...storefront.thankYou.body, fr: e.target.value }
                          }
                        })}
                        className="rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-white"
                      />
                    </div>
                  </div>

                  {/* Important note */}
                  <div>
                    <label className="block text-zinc-400 mb-1">
                      {locale === "ar" ? "نص الملاحظة المهمة (الصندوق الأصفر)" : "Note importante"}
                    </label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        dir="rtl"
                        value={storefront.thankYou?.importantNote?.ar || ""}
                        onChange={(e) => updateStorefront({
                          thankYou: {
                            ...storefront.thankYou,
                            importantNote: { ar: e.target.value, fr: storefront.thankYou?.importantNote?.fr || "" }
                          }
                        })}
                        placeholder="ملاحظة هامة بالعربية"
                        className="rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-white"
                      />
                      <input
                        dir="ltr"
                        value={storefront.thankYou?.importantNote?.fr || ""}
                        onChange={(e) => updateStorefront({
                          thankYou: {
                            ...storefront.thankYou,
                            importantNote: { ar: storefront.thankYou?.importantNote?.ar || "", fr: e.target.value }
                          }
                        })}
                        placeholder="Note en français"
                        className="rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Buttons */}
                <div className="mt-5 flex items-center justify-end gap-3 border-t border-zinc-800 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowThankYouModal(false)}
                    className="rounded-xl border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
                  >
                    {locale === "ar" ? "إغلاق" : "Fermer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void handleSaveChanges();
                      setShowThankYouModal(false);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500"
                  >
                    <Save size={14} />
                    <span>{locale === "ar" ? "حفظ التغييرات" : "Enregistrer"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment Policy Modal */}
          {showPaymentPolicyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#181920] p-6 shadow-2xl text-start" dir={locale === "ar" ? "rtl" : "ltr"}>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <CreditCard size={18} className="text-purple-400" />
                    <span>{locale === "ar" ? "سياسة الدفع" : "Politique de paiement"}</span>
                  </h3>
                  <button type="button" onClick={() => setShowPaymentPolicyModal(false)} className="rounded-lg p-1 text-zinc-400 hover:text-white">
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-3 text-xs">
                  <label className="block text-zinc-300 font-semibold">
                    {locale === "ar" ? "نص سياسة الدفع (بالعربية)" : "Politique de paiement (Arabe)"}
                    <textarea
                      rows={3}
                      dir="rtl"
                      value={storefront.policies?.payment?.ar || ""}
                      onChange={(e) => updateStorefront({
                        policies: {
                          payment: { ar: e.target.value, fr: storefront.policies?.payment?.fr || "" },
                          exchange: storefront.policies?.exchange || { ar: "", fr: "" },
                        }
                      })}
                      className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                    />
                  </label>
                  <label className="block text-zinc-300 font-semibold">
                    {locale === "ar" ? "نص سياسة الدفع (بالفرنسية)" : "Politique de paiement (Français)"}
                    <textarea
                      rows={3}
                      dir="ltr"
                      value={storefront.policies?.payment?.fr || ""}
                      onChange={(e) => updateStorefront({
                        policies: {
                          payment: { ar: storefront.policies?.payment?.ar || "", fr: e.target.value },
                          exchange: storefront.policies?.exchange || { ar: "", fr: "" },
                        }
                      })}
                      className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                    />
                  </label>
                </div>
                <div className="mt-4 flex justify-end gap-2 border-t border-zinc-800 pt-3">
                  <button type="button" onClick={() => setShowPaymentPolicyModal(false)} className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300">
                    {locale === "ar" ? "إلغاء" : "Annuler"}
                  </button>
                  <button type="button" onClick={() => { void handleSaveChanges(); setShowPaymentPolicyModal(false); }} className="rounded-lg bg-purple-600 px-4 py-1.5 text-xs font-bold text-white">
                    {locale === "ar" ? "حفظ" : "Enregistrer"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Exchange Policy Modal */}
          {showExchangePolicyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#181920] p-6 shadow-2xl text-start" dir={locale === "ar" ? "rtl" : "ltr"}>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <RotateCcw size={18} className="text-emerald-400" />
                    <span>{locale === "ar" ? "سياسة الاستبدال والاسترجاع" : "Politique d'échange et retour"}</span>
                  </h3>
                  <button type="button" onClick={() => setShowExchangePolicyModal(false)} className="rounded-lg p-1 text-zinc-400 hover:text-white">
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-3 text-xs">
                  <label className="block text-zinc-300 font-semibold">
                    {locale === "ar" ? "نص سياسة الاستبدال (بالعربية)" : "Politique d'échange (Arabe)"}
                    <textarea
                      rows={3}
                      dir="rtl"
                      value={storefront.policies?.exchange?.ar || ""}
                      onChange={(e) => updateStorefront({
                        policies: {
                          payment: storefront.policies?.payment || { ar: "", fr: "" },
                          exchange: { ar: e.target.value, fr: storefront.policies?.exchange?.fr || "" },
                        }
                      })}
                      className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                    />
                  </label>
                  <label className="block text-zinc-300 font-semibold">
                    {locale === "ar" ? "نص سياسة الاستبدال (بالفرنسية)" : "Politique d'échange (Français)"}
                    <textarea
                      rows={3}
                      dir="ltr"
                      value={storefront.policies?.exchange?.fr || ""}
                      onChange={(e) => updateStorefront({
                        policies: {
                          payment: storefront.policies?.payment || { ar: "", fr: "" },
                          exchange: { ar: storefront.policies?.exchange?.ar || "", fr: e.target.value },
                        }
                      })}
                      className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                    />
                  </label>
                </div>
                <div className="mt-4 flex justify-end gap-2 border-t border-zinc-800 pt-3">
                  <button type="button" onClick={() => setShowExchangePolicyModal(false)} className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300">
                    {locale === "ar" ? "إلغاء" : "Annuler"}
                  </button>
                  <button type="button" onClick={() => { void handleSaveChanges(); setShowExchangePolicyModal(false); }} className="rounded-lg bg-purple-600 px-4 py-1.5 text-xs font-bold text-white">
                    {locale === "ar" ? "حفظ" : "Enregistrer"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: الثيمات وقالب الصفحة (Themes & Layout Editor)     */}
      {/* ======================================================== */}
      {activeTab === "themes" && (
        <div className="space-y-4">
          <AdminHomepageEditor products={products} categories={categories} />
        </div>
      )}
    </div>
  );
}
