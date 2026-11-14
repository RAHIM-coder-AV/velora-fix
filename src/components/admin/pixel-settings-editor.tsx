"use client";

import { useEffect, useState } from "react";
import { Save, CheckCircle2, Info } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { toast } from "@/components/ui/toast";
import { useSettingsStore } from "@/stores/settings-store";
import type { PixelSettings } from "@/types/settings";
import { isValidMetaPixelId, isValidTikTokPixelId } from "@/lib/analytics/pixels";

export function PixelSettingsEditor() {
  const { locale } = useLocale();
  const pixels = useSettingsStore((state) => state.settings.pixels);
  const refreshPixels = useSettingsStore((state) => state.refreshPixels);

  useEffect(() => {
    void refreshPixels().catch((error) => {
      console.error("Failed to load pixel settings", error);
    });
  }, [refreshPixels]);

  return <PixelSettingsForm key={JSON.stringify(pixels)} initialPixels={pixels} />;
}

function PixelSettingsForm({ initialPixels }: { initialPixels: PixelSettings }) {
  const { locale } = useLocale();
  const updatePixels = useSettingsStore((state) => state.updatePixels);
  const [metaIds, setMetaIds] = useState(initialPixels.metaPixelIds);
  const [metaEnabled, setMetaEnabled] = useState(initialPixels.metaPixelEnabled);
  const [tiktokIds, setTiktokIds] = useState(initialPixels.tiktokPixelIds);
  const [tiktokEnabled, setTiktokEnabled] = useState(initialPixels.tiktokPixelEnabled);
  const [saving, setSaving] = useState(false);

  const envMetaId = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() : undefined;

  async function save() {
    if (metaIds.some((id) => !isValidMetaPixelId(id))) {
      toast(locale === "ar" ? "تحقق من معرّفات Meta: يجب أن تتكون من أرقام فقط." : "Un ID Meta doit contenir uniquement des chiffres.");
      return;
    }
    if (tiktokIds.some((id) => !isValidTikTokPixelId(id))) {
      toast(locale === "ar" ? "تحقق من صيغة معرّف TikTok." : "Format d'identifiant TikTok invalide.");
      return;
    }
    setSaving(true);
    try {
      await updatePixels({
        metaPixelIds: metaIds,
        metaPixelEnabled: metaEnabled,
        tiktokPixelIds: tiktokIds,
        tiktokPixelEnabled: tiktokEnabled,
      });
      toast(locale === "ar" ? "تم حفظ وتفعيل إعدادات البيكسل بنجاح!" : "Pixels enregistrés et activés avec succès !");
    } catch (error) {
      console.error("Failed to save pixel settings", error);
      toast(locale === "ar" ? "تم حفظ البيكسل محلياً. إذا ظهر خطأ في الخادم، طبق migration 0010 في Supabase." : "Enregistré localement. Vérifiez les droits Supabase.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100";

  return (
    <section className="min-w-0 max-w-2xl space-y-5" dir={locale === "ar" ? "rtl" : "ltr"}>
      {envMetaId && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
          <span>
            {locale === "ar"
              ? `معرّف Meta Pixel مفعل عبر متغيرات البيئة (ENV): ${envMetaId}`
              : `Meta Pixel actif via les variables d'environnement (ENV) : ${envMetaId}`}
          </span>
        </div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          {locale === "ar" ? "معرّفات Meta Pixel (Facebook & Instagram)" : "Identifiants Meta Pixel"}
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          {locale === "ar"
            ? "أدخل معرّف Meta Pixel (ID) الخاص بحملتك الإعلانية. سيتم تتبع الزيارات والطلبات وإرسالها فورياً إلى Ads Manager."
            : "Saisissez les identifiants Meta Pixel pour suivre les conversions dans Ads Manager."}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {metaIds.map((id, index) => (
            <label key={`meta-${index}`} className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
              <span className="mb-2 flex items-center justify-between text-xs font-bold">
                <span>{locale === "ar" ? `Meta Pixel ${index + 1}` : `Meta Pixel ${index + 1}`}</span>
                <input
                  type="checkbox"
                  checked={metaEnabled[index] ?? false}
                  disabled={!id}
                  onChange={(event) =>
                    setMetaEnabled((current) =>
                      current.map((enabled, slot) => slot === index ? event.target.checked : enabled),
                    )
                  }
                  aria-label={locale === "ar" ? `تفعيل Meta Pixel ${index + 1}` : `Activer Meta Pixel ${index + 1}`}
                />
              </span>
              <input
                value={id}
                onChange={(event) => {
                  const val = event.target.value;
                  setMetaIds((current) => current.map((value, slot) => slot === index ? val : value));
                  if (val.trim() && !metaEnabled[index]) {
                    setMetaEnabled((current) => current.map((en, slot) => slot === index ? true : en));
                  }
                }}
                placeholder={locale === "ar" ? "معرّف رقمي (مثال: 123456789012345)" : "ID numérique"}
                inputMode="numeric"
                autoComplete="off"
                className={inputClass}
                aria-label={locale === "ar" ? `معرّف Meta Pixel ${index + 1}` : `ID Meta Pixel ${index + 1}`}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">TikTok Pixel</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {tiktokIds.map((id, index) => (
            <label key={`tiktok-${index}`} className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
              <span className="mb-2 flex items-center justify-between text-xs font-bold">
                <span>TikTok Pixel {index + 1}</span>
                <input
                  type="checkbox"
                  checked={tiktokEnabled[index] ?? false}
                  disabled={!id}
                  onChange={(event) =>
                    setTiktokEnabled((current) =>
                      current.map((enabled, slot) => slot === index ? event.target.checked : enabled),
                    )
                  }
                  aria-label={locale === "ar" ? `تفعيل TikTok Pixel ${index + 1}` : `Activer TikTok Pixel ${index + 1}`}
                />
              </span>
              <input
                value={id}
                onChange={(event) => {
                  const val = event.target.value;
                  setTiktokIds((current) => current.map((value, slot) => slot === index ? val : value));
                  if (val.trim() && !tiktokEnabled[index]) {
                    setTiktokEnabled((current) => current.map((en, slot) => slot === index ? true : en));
                  }
                }}
                placeholder={locale === "ar" ? "معرّف TikTok (مثال: C123456789ABC)" : "ID TikTok"}
                autoComplete="off"
                className={inputClass}
                aria-label={locale === "ar" ? `معرّف TikTok Pixel ${index + 1}` : `ID TikTok Pixel ${index + 1}`}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-purple-500/10 p-3 text-xs text-purple-900 dark:text-purple-300">
        <Info size={16} className="mt-0.5 shrink-0" />
        <span>
          {locale === "ar"
            ? "يتم إرسال أحداث PageView (زيارة الصفحة)، ViewContent (معاينة المنتج)، AddToCart (إضافة للسلة)، InitiateCheckout (بدء الطلب)، و Purchase (إتمام الشراء مع رقم الطلب والقيمة بالدينار) تلقائياً."
            : "Les événements PageView, ViewContent, AddToCart, InitiateCheckout et Purchase sont envoyés automatiquement."}
        </span>
      </div>

      <button
        type="button"
        onClick={() => void save()}
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-xs font-bold text-white transition hover:bg-purple-700 disabled:opacity-60 active:scale-[0.98]"
      >
        <Save size={15} />
        {saving
          ? (locale === "ar" ? "جارٍ الحفظ..." : "Enregistrement...")
          : (locale === "ar" ? "حفظ وتفعيل معرّفات البيكسل" : "Enregistrer et activer les Pixels")}
      </button>
    </section>
  );
}
