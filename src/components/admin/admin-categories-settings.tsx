"use client";

import { useState } from "react";
import type { Category, Localized } from "@/types";
import { uid } from "@/lib/utils";
import { useLocale } from "@/providers/locale-provider";
import { toast } from "@/components/ui/toast";

interface AdminCategoriesSettingsProps {
  categories: Category[];
  onSave: (category: Category) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const emptyCategory = (): Category => ({
  id: uid("cat"),
  slug: "",
  name: { ar: "", fr: "" },
  description: { ar: "", fr: "" },
  image: "",
});

export function AdminCategoriesSettings({
  categories,
  onSave,
  onDelete,
}: AdminCategoriesSettingsProps) {
  const { locale } = useLocale();
  const [draft, setDraft] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  function updateLocalized(field: "name" | "description", language: keyof Localized, value: string) {
    setDraft((current) => current
      ? { ...current, [field]: { ...current[field], [language]: value } }
      : current);
  }

  async function save() {
    if (!draft || !draft.slug.trim() || !draft.name.ar.trim() || !draft.name.fr.trim()) {
      toast(locale === "ar" ? "أدخل الرابط والاسم بالعربية والفرنسية." : "Saisissez le slug et les noms en arabe et français.");
      return;
    }
    setSaving(true);
    try {
      await onSave({ ...draft, slug: draft.slug.trim().toLowerCase() });
      setDraft(null);
      toast(locale === "ar" ? "تم حفظ الفئة." : "Catégorie enregistrée.");
    } catch (error) {
      console.error("Failed to save category", error);
      toast(locale === "ar" ? "تعذر حفظ الفئة. تحقق من الاتصال وصلاحيات المدير." : "Impossible d'enregistrer la catégorie.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(category: Category) {
    if (!window.confirm(locale === "ar" ? `حذف فئة «${category.name.ar}»؟` : `Supprimer «${category.name.fr}» ?`)) return;
    try {
      await onDelete(category.id);
      toast(locale === "ar" ? "تم حذف الفئة." : "Catégorie supprimée.");
    } catch (error) {
      const inUse = error instanceof Error && error.message.includes("CATEGORY_IN_USE");
      toast(inUse
        ? locale === "ar" ? "لا يمكن حذف فئة مرتبطة بمنتجات. انقل المنتجات إلى فئة أخرى أولاً." : "Déplacez d'abord les produits liés à cette catégorie."
        : locale === "ar" ? "تعذر حذف الفئة." : "Impossible de supprimer la catégorie.");
    }
  }

  const inputClass = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

  return (
    <section className="space-y-4" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold">{locale === "ar" ? "فئات المتجر" : "Catégories du magasin"}</h2>
          <p className="mt-1 text-xs text-zinc-500">{locale === "ar" ? "الفئات المستخدمة لتصنيف المنتجات في المتجر." : "Classez les produits affichés dans votre boutique."}</p>
        </div>
        <button type="button" onClick={() => setDraft(emptyCategory())} className="rounded-lg bg-purple-700 px-4 py-2 text-xs font-bold text-white">
          {locale === "ar" ? "إضافة فئة" : "Ajouter une catégorie"}
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {categories.map((category) => (
          <article key={category.id} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-bold">{category.name[locale] || category.name.ar}</h3>
                <p className="mt-1 text-xs text-zinc-500">{category.slug}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setDraft({ ...category })} className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold dark:border-zinc-700">
                  {locale === "ar" ? "تعديل" : "Modifier"}
                </button>
                <button type="button" onClick={() => void remove(category)} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 dark:border-red-900 dark:text-red-300">
                  {locale === "ar" ? "حذف" : "Supprimer"}
                </button>
              </div>
            </div>
            {category.image && <p className="mt-2 truncate text-[11px] text-zinc-500">{category.image}</p>}
          </article>
        ))}
      </div>

      {draft && (
        <div className="space-y-4 rounded-xl border border-purple-300 bg-purple-50/60 p-4 dark:border-purple-900 dark:bg-purple-950/20">
          <h3 className="text-sm font-bold">{locale === "ar" ? "بيانات الفئة" : "Détails de la catégorie"}</h3>
          <label className="block space-y-1 text-xs font-semibold">
            <span>Slug</span>
            <input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value.replace(/\s+/g, "-") })} className={inputClass} dir="ltr" />
          </label>
          {(["name", "description"] as const).map((field) => (
            <fieldset key={field} className="grid gap-3 sm:grid-cols-2">
              <legend className="mb-2 text-xs font-bold">{field === "name" ? locale === "ar" ? "اسم الفئة" : "Nom" : locale === "ar" ? "الوصف" : "Description"}</legend>
              {(["ar", "fr"] as const).map((language) => (
                <label key={language} className="space-y-1 text-xs font-medium">
                  <span>{language === "ar" ? "العربية" : "Français"}</span>
                  <textarea value={draft[field][language]} onChange={(event) => updateLocalized(field, language, event.target.value)} className={inputClass} dir={language === "ar" ? "rtl" : "ltr"} rows={field === "name" ? 1 : 2} />
                </label>
              ))}
            </fieldset>
          ))}
          <label className="block space-y-1 text-xs font-semibold">
            <span>{locale === "ar" ? "رابط صورة الفئة" : "URL de l'image"}</span>
            <input value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} className={inputClass} dir="ltr" />
          </label>
          <div className="flex gap-2">
            <button type="button" disabled={saving} onClick={() => void save()} className="rounded-lg bg-purple-700 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{saving ? (locale === "ar" ? "جارٍ الحفظ..." : "Enregistrement...") : locale === "ar" ? "حفظ الفئة" : "Enregistrer"}</button>
            <button type="button" disabled={saving} onClick={() => setDraft(null)} className="rounded-lg border border-zinc-300 px-4 py-2 text-xs font-semibold dark:border-zinc-700">{locale === "ar" ? "إلغاء" : "Annuler"}</button>
          </div>
        </div>
      )}
    </section>
  );
}
