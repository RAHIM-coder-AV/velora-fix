"use client";

import { useState } from "react";
import {
  Save,
  MessageSquare,
  User,
  MapPin,
  FileText,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  Check,
  ChevronDown,
  Info,
} from "lucide-react";
import type { ProductFormConfiguration } from "@/types/settings";
import { useSettingsStore } from "@/stores/settings-store";
import { useLocale } from "@/providers/locale-provider";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function AdminFormSettings() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const saveSharedSettings = useSettingsStore((s) => s.saveSharedSettings);
  const [saving, setSaving] = useState(false);

  const [formConfig, setFormConfig] = useState<ProductFormConfiguration>({
    intro: settings.storefront.productForm?.intro || {
      ar: "املأ الإستمارة في الأسفل لتقديم طلبك",
      fr: "Remplissez le formulaire ci-dessous pour commander",
    },
    buttonText: settings.storefront.productForm?.buttonText || {
      ar: "اشتري الآن",
      fr: "Acheter maintenant",
    },
    buttonDisableMode: settings.storefront.productForm?.buttonDisableMode || "never",
    showName: settings.storefront.productForm?.showName ?? true,
    namePlaceholder: settings.storefront.productForm?.namePlaceholder || {
      ar: "الإسم و اللقب",
      fr: "Nom et prénom",
    },
    nameRequired: settings.storefront.productForm?.nameRequired ?? true,
    showPhone: settings.storefront.productForm?.showPhone ?? true,
    phonePlaceholder: settings.storefront.productForm?.phonePlaceholder || {
      ar: "رقم الهاتف",
      fr: "Numéro de téléphone",
    },
    phoneRequired: settings.storefront.productForm?.phoneRequired ?? true,
    minPhoneDigits: settings.storefront.productForm?.minPhoneDigits ?? 10,
    maxPhoneDigits: settings.storefront.productForm?.maxPhoneDigits ?? 10,
    showWilaya: settings.storefront.productForm?.showWilaya ?? true,
    wilayaPlaceholder: settings.storefront.productForm?.wilayaPlaceholder || {
      ar: "الولاية",
      fr: "Wilaya",
    },
    wilayaRequired: settings.storefront.productForm?.wilayaRequired ?? true,
    allowManualWilaya: settings.storefront.productForm?.allowManualWilaya ?? false,
    showCommune: settings.storefront.productForm?.showCommune ?? true,
    communePlaceholder: settings.storefront.productForm?.communePlaceholder || {
      ar: "البلدية",
      fr: "Commune",
    },
    communeRequired: settings.storefront.productForm?.communeRequired ?? true,
    allowManualCommune: settings.storefront.productForm?.allowManualCommune ?? false,
    showAddress: settings.storefront.productForm?.showAddress ?? true,
    addressPlaceholder: settings.storefront.productForm?.addressPlaceholder || {
      ar: "العنوان",
      fr: "Adresse",
    },
    addressRequired: settings.storefront.productForm?.addressRequired ?? false,
    showNotes: settings.storefront.productForm?.showNotes ?? false,
    notesPlaceholder: settings.storefront.productForm?.notesPlaceholder || {
      ar: "ملاحظات إضافية حول التوصيل",
      fr: "Notes pour la livraison",
    },
    notesRequired: settings.storefront.productForm?.notesRequired ?? false,
    keepSummaryOpen: settings.storefront.productForm?.keepSummaryOpen ?? false,
    hidePhoneNotice: settings.storefront.productForm?.hidePhoneNotice ?? false,
    hideShippingPrice: settings.storefront.productForm?.hideShippingPrice ?? false,
    showFreeShippingBadge: settings.storefront.productForm?.showFreeShippingBadge ?? true,
    hideOrderSummary: settings.storefront.productForm?.hideOrderSummary ?? false,
    enableSpamProtection: settings.storefront.productForm?.enableSpamProtection ?? true,
    blockDuplicateOrdersMinutes: settings.storefront.productForm?.blockDuplicateOrdersMinutes ?? 5,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      updateSettings({
        storefront: {
          ...settings.storefront,
          productForm: formConfig,
        },
      });
      await saveSharedSettings();
      toast(isAr ? "تم حفظ إعدادات النموذج بنجاح!" : "Paramètres du formulaire enregistrés !");
    } catch {
      toast(isAr ? "تم الحفظ محلياً." : "Enregistré localement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6" dir={isAr ? "rtl" : "ltr"}>
      {/* Top Header bar with Save button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-black text-white sm:text-2xl">
            {isAr ? "إعدادات النموذج" : "Paramètres du formulaire"}
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            {isAr
              ? "تخصيص حقول وسلوك نموذج الطلب وتحديد متى يتعطل أو يُفعل زر الشراء في متجرك."
              : "Personnalisez les champs, le comportement et les règles d'activation du bouton d'achat."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition hover:bg-purple-500 active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Save size={15} />
          )}
          <span>{isAr ? "حفظ التغييرات" : "Enregistrer"}</span>
        </button>
      </div>

      {/* 2 Columns: Live Preview on Left, Form controls on Right */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* LEFT COLUMN: LIVE FORM PREVIEW (4 cols) */}
        <div className="lg:col-span-4 sticky top-20">
          <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-4 sm:p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                <ShoppingCart size={14} />
                {isAr ? "معاينة النموذج" : "Aperçu du formulaire"}
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                {isAr ? "مباشر" : "En direct"}
              </span>
            </div>

            {/* Inner Simulated Checkout Form */}
            <div className="space-y-3 rounded-xl border border-zinc-800/80 bg-[#1e1e1e] p-3.5 text-xs shadow-inner">
              {/* Header text */}
              <div className="text-center font-bold text-zinc-200">
                {formConfig.intro[locale] || formConfig.intro.ar}
              </div>

              {!formConfig.hidePhoneNotice && (
                <div className="text-center text-[11px] font-medium text-red-400">
                  {isAr ? `يتطلب ${formConfig.minPhoneDigits} أرقام` : `Requis ${formConfig.minPhoneDigits} chiffres`}
                </div>
              )}

              {/* Name field */}
              {formConfig.showName && (
                <div className="rounded-lg border border-zinc-700/60 bg-zinc-900/90 px-3 py-2 text-zinc-400">
                  <span>{formConfig.namePlaceholder?.[locale] || formConfig.namePlaceholder?.ar || (isAr ? "الإسم واللقب" : "Nom")}</span>
                  {formConfig.nameRequired && <span className="text-red-400 ms-1">*</span>}
                </div>
              )}

              {/* Phone field */}
              {formConfig.showPhone && (
                <div className="rounded-lg border border-zinc-700/60 bg-zinc-900/90 px-3 py-2 text-zinc-400">
                  <span>{formConfig.phonePlaceholder?.[locale] || formConfig.phonePlaceholder?.ar || (isAr ? "رقم الهاتف" : "Téléphone")}</span>
                  {formConfig.phoneRequired && <span className="text-red-400 ms-1">*</span>}
                </div>
              )}

              {/* Wilaya & Baladiya */}
              <div className="grid grid-cols-2 gap-2">
                {formConfig.showWilaya && (
                  <div className="flex items-center justify-between rounded-lg border border-zinc-700/60 bg-zinc-900/90 px-2.5 py-2 text-zinc-400 text-[11px]">
                    <span className="truncate">{formConfig.wilayaPlaceholder?.[locale] || formConfig.wilayaPlaceholder?.ar || (isAr ? "الولاية" : "Wilaya")}</span>
                    <ChevronDown size={12} className="shrink-0 text-zinc-500" />
                  </div>
                )}
                {formConfig.showCommune && (
                  <div className="flex items-center justify-between rounded-lg border border-zinc-700/60 bg-zinc-900/90 px-2.5 py-2 text-zinc-400 text-[11px]">
                    <span className="truncate">{formConfig.communePlaceholder?.[locale] || formConfig.communePlaceholder?.ar || (isAr ? "البلدية" : "Commune")}</span>
                    <ChevronDown size={12} className="shrink-0 text-zinc-500" />
                  </div>
                )}
              </div>

              {/* Address */}
              {formConfig.showAddress && (
                <div className="rounded-lg border border-zinc-700/60 bg-zinc-900/90 px-3 py-2 text-zinc-400">
                  <span>{formConfig.addressPlaceholder?.[locale] || formConfig.addressPlaceholder?.ar || (isAr ? "العنوان" : "Adresse")}</span>
                  {formConfig.addressRequired && <span className="text-red-400 ms-1">*</span>}
                </div>
              )}

              {/* Notes */}
              {formConfig.showNotes && (
                <div className="rounded-lg border border-zinc-700/60 bg-zinc-900/90 px-3 py-2 text-zinc-400">
                  <span>{formConfig.notesPlaceholder?.[locale] || formConfig.notesPlaceholder?.ar || (isAr ? "ملاحظة" : "Note")}</span>
                  {formConfig.notesRequired && <span className="text-red-400 ms-1">*</span>}
                </div>
              )}

              {/* Live Styled Buy Now Button */}
              <button
                type="button"
                className="w-full rounded-xl bg-cyan-400 py-3 text-center text-xs font-black text-black shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300"
              >
                {formConfig.buttonText?.[locale] || formConfig.buttonText?.ar || (isAr ? "اشتري الآن" : "Acheter maintenant")}
              </button>

              {/* Summary option */}
              {!formConfig.hideOrderSummary && (
                <div className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-700/60 bg-zinc-900/60 py-1.5 text-[11px] text-zinc-300">
                  <ShoppingCart size={12} />
                  <span>{isAr ? "ملخص الطلبية" : "Récapitulatif"}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONFIGURATION SECTIONS (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION 1: رسالة النموذج وسلوك زر الشراء */}
          <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-bold text-white mb-4">
              <MessageSquare size={16} className="text-purple-400" />
              <span>{isAr ? "رسالة النموذج ونصوص الأزرار" : "Message et bouton du formulaire"}</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  {isAr ? "رسالة توجيهية تظهر فوق استمارة تقديم الطلب" : "Message d'en-tête du formulaire"}
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    dir="rtl"
                    value={formConfig.intro.ar}
                    onChange={(e) =>
                      setFormConfig({ ...formConfig, intro: { ...formConfig.intro, ar: e.target.value } })
                    }
                    placeholder="العربية..."
                    className="rounded-xl border border-zinc-700/80 bg-[#202020] px-3.5 py-2.5 text-xs text-white outline-none focus:border-purple-500"
                  />
                  <input
                    type="text"
                    dir="ltr"
                    value={formConfig.intro.fr}
                    onChange={(e) =>
                      setFormConfig({ ...formConfig, intro: { ...formConfig.intro, fr: e.target.value } })
                    }
                    placeholder="Français..."
                    className="rounded-xl border border-zinc-700/80 bg-[#202020] px-3.5 py-2.5 text-xs text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  {isAr ? "نص زر الشراء" : "Texte du bouton d'achat"}
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    dir="rtl"
                    value={formConfig.buttonText?.ar || "اشتري الآن"}
                    onChange={(e) =>
                      setFormConfig({
                        ...formConfig,
                        buttonText: { ...formConfig.buttonText, ar: e.target.value, fr: formConfig.buttonText?.fr || "Acheter" },
                      })
                    }
                    placeholder="اشتري الآن"
                    className="rounded-xl border border-zinc-700/80 bg-[#202020] px-3.5 py-2.5 text-xs text-white outline-none focus:border-purple-500"
                  />
                  <input
                    type="text"
                    dir="ltr"
                    value={formConfig.buttonText?.fr || "Acheter maintenant"}
                    onChange={(e) =>
                      setFormConfig({
                        ...formConfig,
                        buttonText: { ...formConfig.buttonText, fr: e.target.value, ar: formConfig.buttonText?.ar || "اشتري الآن" },
                      })
                    }
                    placeholder="Acheter maintenant"
                    className="rounded-xl border border-zinc-700/80 bg-[#202020] px-3.5 py-2.5 text-xs text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* BUTTON DISABLE CONDITION SELECTOR */}
              <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4 mt-3">
                <label className="block text-xs font-bold text-purple-300 mb-1.5">
                  {isAr ? "⚙️ تحديد متى يتعطل زر الشراء في النموذج:" : "⚙️ Règle de désactivation du bouton d'achat :"}
                </label>
                <select
                  value={formConfig.buttonDisableMode || "never"}
                  onChange={(e) =>
                    setFormConfig({
                      ...formConfig,
                      buttonDisableMode: e.target.value as "never" | "out_of_stock" | "invalid_fields",
                    })
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-[#1a1a1a] px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-purple-400"
                >
                  <option value="never">
                    {isAr ? "🟢 دائماً نشط ومفعل (لا يتعطل أبداً - الأفضل لزيادة المبيعات)" : "🟢 Toujours actif (Jamais désactivé)"}
                  </option>
                  <option value="out_of_stock">
                    {isAr ? "🔴 يتعطل فقط عند نفاذ المخزون بالكامل للمنتج" : "🔴 Désactivé uniquement en cas de rupture de stock"}
                  </option>
                  <option value="invalid_fields">
                    {isAr ? "🟡 يتعطل حتى يكمل الزبون تعبئة الاسم والهاتف المطلوبين" : "🟡 Désactivé jusqu'à remplissage des champs obligatoires"}
                  </option>
                </select>
                <p className="mt-2 text-[11px] text-zinc-400">
                  {isAr
                    ? "عند اختيار 'دائماً نشط'، لن يواجه الزبون أي زر معطل وسيقوم المتجر باستقبال طلبه فوراً وبأقصى سرعة."
                    : "En mode toujours actif, le bouton ne sera jamais bloqué pour une conversion maximale."}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: معلومات العميل */}
          <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-5 shadow-sm space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-white">
              <User size={16} className="text-purple-400" />
              <span>{isAr ? "معلومات العميل" : "Informations client"}</span>
            </h2>

            {/* Name Field Card */}
            <div className="rounded-xl border border-zinc-800/90 bg-[#1c1c1c] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formConfig.showName}
                    onChange={(e) => setFormConfig({ ...formConfig, showName: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-purple-500"
                  />
                  <span>{isAr ? "خانة الإسم و اللقب" : "Champ Nom et prénom"}</span>
                </label>
                <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer">
                  <span>{isAr ? "الحقل إلزامي" : "Obligatoire"}</span>
                  <input
                    type="checkbox"
                    checked={formConfig.nameRequired}
                    onChange={(e) => setFormConfig({ ...formConfig, nameRequired: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-purple-500"
                  />
                </label>
              </div>
              <input
                type="text"
                value={formConfig.namePlaceholder?.ar || ""}
                onChange={(e) =>
                  setFormConfig({
                    ...formConfig,
                    namePlaceholder: { ...formConfig.namePlaceholder, ar: e.target.value, fr: formConfig.namePlaceholder?.fr || "Nom" },
                  })
                }
                placeholder={isAr ? "النص الذي يظهر في حقل الإسم واللقب" : "Placeholder du nom"}
                className="w-full rounded-xl border border-zinc-700/80 bg-[#202020] px-3.5 py-2 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>

            {/* Phone Field Card */}
            <div className="rounded-xl border border-zinc-800/90 bg-[#1c1c1c] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formConfig.showPhone}
                    onChange={(e) => setFormConfig({ ...formConfig, showPhone: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-purple-500"
                  />
                  <span>{isAr ? "خانة رقم الهاتف" : "Champ Numéro de téléphone"}</span>
                </label>
                <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer">
                  <span>{isAr ? "الحقل إلزامي" : "Obligatoire"}</span>
                  <input
                    type="checkbox"
                    checked={formConfig.phoneRequired}
                    onChange={(e) => setFormConfig({ ...formConfig, phoneRequired: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-purple-500"
                  />
                </label>
              </div>
              <input
                type="text"
                value={formConfig.phonePlaceholder?.ar || ""}
                onChange={(e) =>
                  setFormConfig({
                    ...formConfig,
                    phonePlaceholder: { ...formConfig.phonePlaceholder, ar: e.target.value, fr: formConfig.phonePlaceholder?.fr || "Téléphone" },
                  })
                }
                placeholder={isAr ? "الذي يظهر في حقل رقم الهاتف" : "Placeholder téléphone"}
                className="w-full rounded-xl border border-zinc-700/80 bg-[#202020] px-3.5 py-2 text-xs text-white outline-none focus:border-purple-500"
              />
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">{isAr ? "الحد الأدنى للأرقام" : "Min chiffres"}</label>
                  <input
                    type="number"
                    value={formConfig.minPhoneDigits}
                    onChange={(e) => setFormConfig({ ...formConfig, minPhoneDigits: Number(e.target.value) || 10 })}
                    className="w-full rounded-lg border border-zinc-700/80 bg-[#202020] px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">{isAr ? "الحد الأقصى للأرقام" : "Max chiffres"}</label>
                  <input
                    type="number"
                    value={formConfig.maxPhoneDigits}
                    onChange={(e) => setFormConfig({ ...formConfig, maxPhoneDigits: Number(e.target.value) || 10 })}
                    className="w-full rounded-lg border border-zinc-700/80 bg-[#202020] px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: معلومات العنوان */}
          <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-5 shadow-sm space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-white">
              <MapPin size={16} className="text-purple-400" />
              <span>{isAr ? "معلومات العنوان" : "Informations de livraison"}</span>
            </h2>

            {/* Wilaya Card */}
            <div className="rounded-xl border border-zinc-800/90 bg-[#1c1c1c] p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formConfig.showWilaya}
                    onChange={(e) => setFormConfig({ ...formConfig, showWilaya: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-purple-500"
                  />
                  <span>{isAr ? "خانة الولاية" : "Champ Wilaya"}</span>
                </label>
                <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer">
                  <span>{isAr ? "الحقل إلزامي" : "Obligatoire"}</span>
                  <input
                    type="checkbox"
                    checked={formConfig.wilayaRequired}
                    onChange={(e) => setFormConfig({ ...formConfig, wilayaRequired: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-purple-500"
                  />
                </label>
              </div>
              <input
                type="text"
                value={formConfig.wilayaPlaceholder?.ar || ""}
                onChange={(e) =>
                  setFormConfig({
                    ...formConfig,
                    wilayaPlaceholder: { ...formConfig.wilayaPlaceholder, ar: e.target.value, fr: formConfig.wilayaPlaceholder?.fr || "Wilaya" },
                  })
                }
                placeholder={isAr ? "الذي يظهر في حقل الولاية" : "Placeholder wilaya"}
                className="w-full rounded-xl border border-zinc-700/80 bg-[#202020] px-3.5 py-2 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>

            {/* Commune Card */}
            <div className="rounded-xl border border-zinc-800/90 bg-[#1c1c1c] p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formConfig.showCommune}
                    onChange={(e) => setFormConfig({ ...formConfig, showCommune: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-purple-500"
                  />
                  <span>{isAr ? "خانة البلدية" : "Champ Commune"}</span>
                </label>
                <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer">
                  <span>{isAr ? "الحقل إلزامي" : "Obligatoire"}</span>
                  <input
                    type="checkbox"
                    checked={formConfig.communeRequired}
                    onChange={(e) => setFormConfig({ ...formConfig, communeRequired: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-purple-500"
                  />
                </label>
              </div>
              <input
                type="text"
                value={formConfig.communePlaceholder?.ar || ""}
                onChange={(e) =>
                  setFormConfig({
                    ...formConfig,
                    communePlaceholder: { ...formConfig.communePlaceholder, ar: e.target.value, fr: formConfig.communePlaceholder?.fr || "Commune" },
                  })
                }
                placeholder={isAr ? "الذي يظهر في حقل البلدية" : "Placeholder commune"}
                className="w-full rounded-xl border border-zinc-700/80 bg-[#202020] px-3.5 py-2 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>

            {/* Address Card */}
            <div className="rounded-xl border border-zinc-800/90 bg-[#1c1c1c] p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formConfig.showAddress}
                    onChange={(e) => setFormConfig({ ...formConfig, showAddress: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-purple-500"
                  />
                  <span>{isAr ? "خانة العنوان" : "Champ Adresse"}</span>
                </label>
                <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer">
                  <span>{isAr ? "الحقل إلزامي" : "Obligatoire"}</span>
                  <input
                    type="checkbox"
                    checked={formConfig.addressRequired}
                    onChange={(e) => setFormConfig({ ...formConfig, addressRequired: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-purple-500"
                  />
                </label>
              </div>
              <input
                type="text"
                value={formConfig.addressPlaceholder?.ar || ""}
                onChange={(e) =>
                  setFormConfig({
                    ...formConfig,
                    addressPlaceholder: { ...formConfig.addressPlaceholder, ar: e.target.value, fr: formConfig.addressPlaceholder?.fr || "Adresse" },
                  })
                }
                placeholder={isAr ? "الذي يظهر في حقل العنوان" : "Placeholder adresse"}
                className="w-full rounded-xl border border-zinc-700/80 bg-[#202020] px-3.5 py-2 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* SECTION 4: خانة الملاحظة */}
          <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-5 shadow-sm space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-white">
              <FileText size={16} className="text-purple-400" />
              <span>{isAr ? "خانة الملاحظة" : "Champ Note"}</span>
            </h2>

            <div className="rounded-xl border border-zinc-800/90 bg-[#1c1c1c] p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formConfig.showNotes}
                    onChange={(e) => setFormConfig({ ...formConfig, showNotes: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-purple-500"
                  />
                  <span>{isAr ? "تفعيل خانة الملاحظة" : "Activer la case note"}</span>
                </label>
                <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer">
                  <span>{isAr ? "الحقل إلزامي" : "Obligatoire"}</span>
                  <input
                    type="checkbox"
                    checked={formConfig.notesRequired}
                    onChange={(e) => setFormConfig({ ...formConfig, notesRequired: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-purple-500"
                  />
                </label>
              </div>
              <input
                type="text"
                value={formConfig.notesPlaceholder?.ar || ""}
                onChange={(e) =>
                  setFormConfig({
                    ...formConfig,
                    notesPlaceholder: { ...formConfig.notesPlaceholder, ar: e.target.value, fr: formConfig.notesPlaceholder?.fr || "Notes" },
                  })
                }
                placeholder={isAr ? "الذي يظهر في حقل الملاحظة" : "Placeholder note"}
                className="w-full rounded-xl border border-zinc-700/80 bg-[#202020] px-3.5 py-2 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* SECTION 5: إعدادات أخرى */}
          <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-5 shadow-sm space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-white mb-2">
              <Settings2 size={16} className="text-purple-400" />
              <span>{isAr ? "إعدادات أخرى" : "Autres paramètres"}</span>
            </h2>

            <div className="space-y-2 divide-y divide-zinc-800/60">
              <label className="flex items-center justify-between py-2 text-xs text-zinc-300 cursor-pointer">
                <span>{isAr ? "إبقاء ملخص الطلبية مفتوح" : "Garder le récapitulatif ouvert"}</span>
                <input
                  type="checkbox"
                  checked={formConfig.keepSummaryOpen}
                  onChange={(e) => setFormConfig({ ...formConfig, keepSummaryOpen: e.target.checked })}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-purple-500"
                />
              </label>

              <label className="flex items-center justify-between py-2 text-xs text-zinc-300 cursor-pointer">
                <span>{isAr ? "إخفاء ملاحظة رقم الهاتف" : "Masquer la note du numéro de téléphone"}</span>
                <input
                  type="checkbox"
                  checked={formConfig.hidePhoneNotice}
                  onChange={(e) => setFormConfig({ ...formConfig, hidePhoneNotice: e.target.checked })}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-purple-500"
                />
              </label>

              <label className="flex items-center justify-between py-2 text-xs text-zinc-300 cursor-pointer">
                <span>{isAr ? "إخفاء تسعير التوصيل" : "Masquer le tarif de livraison"}</span>
                <input
                  type="checkbox"
                  checked={formConfig.hideShippingPrice}
                  onChange={(e) => setFormConfig({ ...formConfig, hideShippingPrice: e.target.checked })}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-purple-500"
                />
              </label>

              <label className="flex items-center justify-between py-2 text-xs text-zinc-300 cursor-pointer">
                <span>{isAr ? "عرض التوصيل المجاني" : "Afficher la livraison gratuite"}</span>
                <input
                  type="checkbox"
                  checked={formConfig.showFreeShippingBadge}
                  onChange={(e) => setFormConfig({ ...formConfig, showFreeShippingBadge: e.target.checked })}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-purple-500"
                />
              </label>

              <label className="flex items-center justify-between py-2 text-xs text-zinc-300 cursor-pointer">
                <span>{isAr ? "إخفاء ملخص الطلبية" : "Masquer le récapitulatif de commande"}</span>
                <input
                  type="checkbox"
                  checked={formConfig.hideOrderSummary}
                  onChange={(e) => setFormConfig({ ...formConfig, hideOrderSummary: e.target.checked })}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-purple-500"
                />
              </label>
            </div>
          </div>

          {/* SECTION 6: خصائص الطلبات المزيفة وحماية النموذج (Matching Screenshot 1) */}
          <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                <ShieldCheck size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-purple-300">
                  {isAr ? "خصائص الطلبات المزيفة وحماية النموذج" : "Protection contre les fausses commandes"}
                </h3>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                  {isAr
                    ? "حظر تلقائي أو يدوي لعناوين IP التي ترسل طلبات مزيفة أو مفرطة، لحماية المنصة من النشاطات المشبوهة."
                    : "Blocage automatique ou manuel des adresses IP suspectes pour protéger votre boutique."}
                </p>

                <div className="mt-3 flex items-center justify-between rounded-xl bg-[#202020] p-3 border border-zinc-800">
                  <span className="text-xs font-semibold text-zinc-200">
                    {isAr ? "تفعيل نظام الحماية الذكية والتحقق من الأرقام" : "Activer la protection intelligente"}
                  </span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={formConfig.enableSpamProtection}
                      onChange={(e) => setFormConfig({ ...formConfig, enableSpamProtection: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="h-5 w-9 rounded-full bg-zinc-700 peer-checked:bg-purple-600 peer-checked:after:translate-x-full after:absolute after:top-[2px] after:start-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
