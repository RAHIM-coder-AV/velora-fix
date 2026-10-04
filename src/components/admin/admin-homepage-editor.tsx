"use client";

import { useEffect, useState } from "react";
import type { Category, Localized, Product } from "@/types";
import {
  createDefaultHomepageContent,
  moveHomepageSection,
  updateHomepageProductSelection,
  type HomepageContent,
  type HomepageSection,
  type HomepageSectionId,
} from "@/lib/homepage/content";
import { getHomepageSupabaseClient } from "@/lib/homepage/persistence";
import { useHomepageStore } from "@/stores/homepage-store";

interface AdminHomepageEditorProps {
  products: Product[];
  categories: Category[];
}

const sectionNames: Record<HomepageSectionId, string> = {
  hero: "الواجهة الرئيسية",
  categories: "التصنيفات",
  featured: "المنتجات المختارة",
  editorial: "القسم التحريري",
  "new-arrivals": "المنتجات الجديدة",
};

function BilingualField({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: Localized;
  onChange: (value: Localized) => void;
  multiline?: boolean;
}) {
  const Input = multiline ? "textarea" : "input";
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(["ar", "fr"] as const).map((language) => (
        <label key={language} className="block text-sm font-medium text-stone-800">
          {label} ({language === "ar" ? "العربية" : "Français"})
          <Input
            dir={language === "ar" ? "rtl" : "ltr"}
            value={value[language]}
            onChange={(event) => onChange({ ...value, [language]: event.target.value })}
            className="mt-1 block min-h-10 w-full rounded border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 outline-none focus:border-stone-700"
            rows={multiline ? 3 : undefined}
          />
        </label>
      ))}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-medium text-stone-800">
      {label}
      <input
        dir="auto"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 block min-h-10 w-full rounded border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 outline-none focus:border-stone-700"
      />
    </label>
  );
}

function patchSection(
  content: HomepageContent,
  id: HomepageSectionId,
  patch: Partial<HomepageSection>,
): HomepageContent {
  return {
    ...content,
    sections: content.sections.map((section) =>
      section.id === id ? ({ ...section, ...patch } as HomepageSection) : section,
    ),
  };
}

export function AdminHomepageEditor({ products, categories }: AdminHomepageEditorProps) {
  const content = useHomepageStore((state) => state.content);
  const source = useHomepageStore((state) => state.source);
  const saving = useHomepageStore((state) => state.saving);
  const load = useHomepageStore((state) => state.load);
  const save = useHomepageStore((state) => state.save);
  const [draft, setDraft] = useState<HomepageContent>(content);
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  const databaseConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    void load()
      .then(() => {
        const state = useHomepageStore.getState();
        setDraft(state.source === "default" ? createDefaultHomepageContent(categories) : state.content);
        setReady(true);
      })
      .catch((error: unknown) => {
        setDraft(useHomepageStore.getState().content);
        setMessage(error instanceof Error ? error.message : "تعذر تحميل إعدادات الصفحة الرئيسية.");
        setReady(true);
      });
  }, [categories, load]);

  const sorted = [...draft.sections].sort((a, b) => a.order - b.order);

  function update(id: HomepageSectionId, patch: Partial<HomepageSection>) {
    setDraft((current) => patchSection(current, id, patch));
  }

  function addSection(id: HomepageSectionId) {
    const defaultSection = createDefaultHomepageContent(categories).sections.find(
      (section) => section.id === id,
    );
    if (!defaultSection || draft.sections.some((section) => section.id === id)) return;
    setDraft((current) => ({
      ...current,
      sections: [...current.sections, { ...defaultSection, order: current.sections.length, visible: true }],
    }));
  }

  function removeSection(id: HomepageSectionId) {
    setDraft((current) => ({
      ...current,
      sections: current.sections
        .filter((section) => section.id !== id)
        .sort((a, b) => a.order - b.order)
        .map((section, order) => ({ ...section, order })),
    }));
  }

  async function saveDraft() {
    setMessage("");
    try {
      await save(draft);
      setMessage(
        getHomepageSupabaseClient()
          ? "تم حفظ الصفحة الرئيسية في قاعدة البيانات، وستظهر لجميع الزوار."
          : "حُفظت هذه الإعدادات في هذا المتصفح فقط؛ اربط Supabase وطبّق migration 0005 لمشاركتها مع الزوار.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `لم يتم الحفظ: ${error.message}. تحقق من تطبيق migration 0005 وصلاحية حساب المدير.`
          : "لم يتم حفظ التغييرات.",
      );
    }
  }

  function resetDraft() {
    setDraft(createDefaultHomepageContent(categories));
    setMessage("تمت استعادة القيم الافتراضية في المحرر؛ اضغط حفظ لتطبيقها.");
  }

  return (
    <section id="homepage-editor" dir="rtl" className="mt-8 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">محتوى المتجر</p>
          <h2 className="mt-1 text-xl font-bold text-stone-950 sm:text-2xl">تحرير الصفحة الرئيسية</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            عدّل النصوص والصور والروابط، رتّب الأقسام، واختر المنتجات التي تظهر للزوار.
          </p>
        </div>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700">
          {source === "database" ? "محفوظ في قاعدة البيانات" : source === "local" ? "محفوظ محليًا" : "القيم الافتراضية"}
        </span>
      </div>

      <div className="mt-5">
        <label className="block max-w-sm text-sm font-semibold text-stone-800">
          قالب العرض
          <select
            value={draft.theme}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                theme: event.target.value as HomepageContent["theme"],
              }))
            }
            className="mt-1 block min-h-11 w-full rounded border border-stone-300 bg-white px-3 text-stone-950"
          >
            <option value="atelier">Atelier — واجهة واسعة</option>
            <option value="minimal">Minimal — تصميم هادئ</option>
            <option value="lookbook">Lookbook — صورة بارزة</option>
          </select>
        </label>
      </div>

      <div className="mt-5 space-y-4">
        {!ready && <p className="text-sm text-stone-600">جار تحميل المحتوى الحالي...</p>}
        {sorted.map((section, index) => (
          <fieldset key={section.id} className="min-w-0 rounded-lg border border-stone-200 p-4">
            <legend className="px-2 font-semibold text-stone-900">{sectionNames[section.id]}</legend>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <label className="inline-flex min-h-10 items-center gap-2 rounded bg-stone-100 px-3 text-sm text-stone-800">
                <input
                  type="checkbox"
                  checked={section.visible}
                  onChange={(event) => update(section.id, { visible: event.target.checked })}
                  className="accent-stone-900"
                />
                إظهار القسم
              </label>
              <button
                type="button"
                disabled={index === 0}
                onClick={() => setDraft((current) => moveHomepageSection(current, section.id, -1))}
                className="min-h-10 rounded border border-stone-300 px-3 text-sm text-stone-800 disabled:opacity-40"
              >
                للأعلى
              </button>
              <button
                type="button"
                disabled={index === sorted.length - 1}
                onClick={() => setDraft((current) => moveHomepageSection(current, section.id, 1))}
                className="min-h-10 rounded border border-stone-300 px-3 text-sm text-stone-800 disabled:opacity-40"
              >
                للأسفل
              </button>
              <button
                type="button"
                onClick={() => removeSection(section.id)}
                className="min-h-10 rounded border border-red-200 px-3 text-sm text-red-700"
              >
                حذف القسم
              </button>
            </div>

            {section.id === "hero" && (
              <div className="space-y-4">
                <BilingualField label="العنوان الرئيسي" value={section.title} onChange={(title) => update(section.id, { title })} />
                <BilingualField label="النص التمهيدي" value={section.kicker} onChange={(kicker) => update(section.id, { kicker })} />
                <BilingualField label="الوصف" value={section.body} onChange={(body) => update(section.id, { body })} multiline />
                <TextField label="رابط الصورة" value={section.imageUrl} onChange={(imageUrl) => update(section.id, { imageUrl })} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <BilingualField label="نص الزر الأول" value={section.primaryLabel} onChange={(primaryLabel) => update(section.id, { primaryLabel })} />
                  <TextField label="رابط الزر الأول" value={section.primaryHref} onChange={(primaryHref) => update(section.id, { primaryHref })} />
                  <BilingualField label="نص الزر الثاني" value={section.secondaryLabel} onChange={(secondaryLabel) => update(section.id, { secondaryLabel })} />
                  <TextField label="رابط الزر الثاني" value={section.secondaryHref} onChange={(secondaryHref) => update(section.id, { secondaryHref })} />
                </div>
              </div>
            )}

            {section.id === "categories" && (
              <div className="space-y-3">
                <BilingualField label="عنوان القسم" value={section.title} onChange={(title) => update(section.id, { title })} />
                <p className="text-sm leading-6 text-stone-600">
                  عدّل الاسم والصورة والرابط لكل بطاقة، بما فيها الأحذية والإكسسوارات، أو أخفِها وأعد ترتيبها.
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {categories.map((category) => {
                    const checked = section.items.some((item) => item.slug === category.slug);
                    return (
                      <label key={category.id} className="flex min-h-11 items-center gap-2 rounded border border-stone-200 px-3 text-sm text-stone-800">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) => {
                            const items = event.target.checked
                              ? [
                                  ...section.items,
                                  {
                                    slug: category.slug,
                                    title: category.name,
                                    imageUrl: category.image,
                                    href: `/products?category=${encodeURIComponent(category.slug)}`,
                                  },
                                ]
                              : section.items.filter((item) => item.slug !== category.slug);
                            update(section.id, { items });
                          }}
                        />
                        <span>{category.name.ar} <span className="text-stone-500">/ {category.name.fr}</span></span>
                      </label>
                    );
                  })}
                </div>
                {section.items.map((item, itemIndex) => (
                  <div key={item.slug} className="space-y-3 rounded border border-stone-200 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-stone-800">{item.title.ar} / {item.title.fr}</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={itemIndex === 0}
                          onClick={() => {
                            const items = [...section.items];
                            [items[itemIndex - 1], items[itemIndex]] = [items[itemIndex], items[itemIndex - 1]];
                            update(section.id, { items });
                          }}
                          className="min-h-9 rounded border border-stone-300 px-3 text-xs text-stone-800 disabled:opacity-40"
                        >
                          للأعلى
                        </button>
                        <button
                          type="button"
                          disabled={itemIndex === section.items.length - 1}
                          onClick={() => {
                            const items = [...section.items];
                            [items[itemIndex + 1], items[itemIndex]] = [items[itemIndex], items[itemIndex + 1]];
                            update(section.id, { items });
                          }}
                          className="min-h-9 rounded border border-stone-300 px-3 text-xs text-stone-800 disabled:opacity-40"
                        >
                          للأسفل
                        </button>
                      </div>
                    </div>
                    <BilingualField
                      label="اسم التصنيف في الصفحة الرئيسية"
                      value={item.title}
                      onChange={(title) => {
                        const items = section.items.map((entry) =>
                          entry.slug === item.slug ? { ...entry, title } : entry,
                        );
                        update(section.id, { items });
                      }}
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <TextField
                        label="رابط صورة التصنيف"
                        value={item.imageUrl}
                        onChange={(imageUrl) => {
                          const items = section.items.map((entry) =>
                            entry.slug === item.slug ? { ...entry, imageUrl } : entry,
                          );
                          update(section.id, { items });
                        }}
                      />
                      <TextField
                        label="رابط التصنيف"
                        value={item.href}
                        onChange={(href) => {
                          const items = section.items.map((entry) =>
                            entry.slug === item.slug ? { ...entry, href } : entry,
                          );
                          update(section.id, { items });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(section.id === "featured" || section.id === "new-arrivals") && (
              <div className="space-y-3">
                <BilingualField label="عنوان القسم" value={section.title} onChange={(title) => update(section.id, { title })} />
                <label className="flex min-h-11 w-fit items-center gap-2 text-sm text-stone-800">
                  <input
                    type="checkbox"
                    checked={section.selectionMode === "curated"}
                    onChange={(event) =>
                      update(section.id, {
                        selectionMode: event.target.checked ? "curated" : "automatic",
                      })
                    }
                  />
                  اختيار المنتجات يدويًا (بدل المنتجات المميزة تلقائيًا)
                </label>
                {section.selectionMode === "curated" && (
                  <>
                    <div className="grid max-h-64 gap-2 overflow-y-auto rounded border border-stone-200 p-2 sm:grid-cols-2">
                      {products.map((product) => (
                        <label key={product.id} className="flex min-h-11 items-center gap-2 rounded px-2 text-sm text-stone-800 hover:bg-stone-50">
                          <input
                            type="checkbox"
                            checked={section.productSlugs.includes(product.slug)}
                            onChange={(event) =>
                              update(
                                section.id,
                                updateHomepageProductSelection(section, product.slug, event.target.checked),
                              )
                            }
                          />
                          <span className="truncate">{product.name.ar} <span className="text-stone-500">/ {product.name.fr}</span></span>
                        </label>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-stone-800">ترتيب المنتجات الظاهرة</p>
                      {section.productSlugs.map((slug, productIndex) => {
                        const product = products.find((item) => item.slug === slug);
                        return (
                          <div key={slug} className="flex min-h-10 items-center justify-between gap-2 rounded border border-stone-200 px-3 text-sm text-stone-800">
                            <span className="truncate">{product ? `${product.name.ar} / ${product.name.fr}` : slug}</span>
                            <div className="flex shrink-0 gap-2">
                              <button
                                type="button"
                                aria-label="تحريك المنتج للأعلى"
                                disabled={productIndex === 0}
                                onClick={() => {
                                  const productSlugs = [...section.productSlugs];
                                  [productSlugs[productIndex - 1], productSlugs[productIndex]] = [
                                    productSlugs[productIndex],
                                    productSlugs[productIndex - 1],
                                  ];
                                  update(section.id, { productSlugs });
                                }}
                                className="rounded border border-stone-300 px-2 py-1 disabled:opacity-40"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                aria-label="تحريك المنتج للأسفل"
                                disabled={productIndex === section.productSlugs.length - 1}
                                onClick={() => {
                                  const productSlugs = [...section.productSlugs];
                                  [productSlugs[productIndex + 1], productSlugs[productIndex]] = [
                                    productSlugs[productIndex],
                                    productSlugs[productIndex + 1],
                                  ];
                                  update(section.id, { productSlugs });
                                }}
                                className="rounded border border-stone-300 px-2 py-1 disabled:opacity-40"
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                onClick={() => update(section.id, updateHomepageProductSelection(section, slug, false))}
                                className="rounded border border-red-200 px-2 py-1 text-red-700"
                              >
                                إزالة
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {section.id === "editorial" && (
              <div className="space-y-4">
                <BilingualField label="عنوان القسم" value={section.title} onChange={(title) => update(section.id, { title })} />
                <BilingualField label="الوصف" value={section.body} onChange={(body) => update(section.id, { body })} multiline />
                <TextField label="رابط الصورة" value={section.imageUrl} onChange={(imageUrl) => update(section.id, { imageUrl })} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <BilingualField label="نص الرابط الأول" value={section.firstLinkLabel} onChange={(firstLinkLabel) => update(section.id, { firstLinkLabel })} />
                  <TextField label="الرابط الأول" value={section.firstLinkHref} onChange={(firstLinkHref) => update(section.id, { firstLinkHref })} />
                  <BilingualField label="نص الرابط الثاني" value={section.secondLinkLabel} onChange={(secondLinkLabel) => update(section.id, { secondLinkLabel })} />
                  <TextField label="الرابط الثاني" value={section.secondLinkHref} onChange={(secondLinkHref) => update(section.id, { secondLinkHref })} />
                </div>
              </div>
            )}
          </fieldset>
        ))}
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-stone-800">إضافة قسم</p>
        <div className="flex flex-wrap gap-2">
          {(["hero", "categories", "featured", "editorial", "new-arrivals"] as const)
            .filter((id) => !draft.sections.some((section) => section.id === id))
            .map((id) => (
              <button key={id} type="button" onClick={() => addSection(id)} className="min-h-10 rounded border border-stone-300 px-3 text-sm text-stone-800">
                + {sectionNames[id]}
              </button>
            ))}
        </div>
      </div>

      {!databaseConfigured && (
        <p className="mt-5 rounded bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          Supabase غير متصل في هذه البيئة؛ الحفظ سيكون في هذا المتصفح فقط ولن يظهر للزوار الآخرين.
        </p>
      )}
      {message && <p role="status" className="mt-4 rounded bg-stone-100 p-3 text-sm leading-6 text-stone-800">{message}</p>}
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" disabled={saving || !ready} onClick={() => void saveDraft()} className="min-h-11 rounded bg-stone-950 px-5 text-sm font-semibold text-white disabled:opacity-50">
          {saving ? "جارٍ الحفظ..." : "حفظ تغييرات الصفحة"}
        </button>
        <button type="button" onClick={resetDraft} className="min-h-11 rounded border border-stone-300 px-5 text-sm text-stone-800">
          استعادة الافتراضي
        </button>
      </div>
    </section>
  );
}
