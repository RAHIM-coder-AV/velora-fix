"use client";

import { useSyncExternalStore } from "react";
import { useLocale } from "@/providers/locale-provider";
import {
  marketingConsentSnapshot,
  resetMarketingConsent,
  serverMarketingConsentSnapshot,
  setMarketingConsent,
  subscribeToMarketingConsent,
} from "@/lib/analytics/consent";

export function MarketingConsentBanner() {
  const { locale } = useLocale();
  const consent = useSyncExternalStore(
    subscribeToMarketingConsent,
    marketingConsentSnapshot,
    serverMarketingConsentSnapshot,
  );

  if (consent !== null) {
    return (
      <button
        type="button"
        onClick={resetMarketingConsent}
        className="fixed bottom-3 end-3 z-[80] rounded-full border border-zinc-600 bg-zinc-950 px-3 py-2 text-[11px] font-bold text-white shadow-lg hover:bg-zinc-800"
      >
        {locale === "ar" ? "الخصوصية" : "Confidentialité"}
      </button>
    );
  }

  return (
    <aside
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-2xl rounded-2xl border border-zinc-700 bg-zinc-950 p-4 text-white shadow-2xl"
      aria-label={locale === "ar" ? "إعدادات ملفات التتبع" : "Préférences de suivi"}
    >
      <p className="text-sm font-bold">
        {locale === "ar" ? "الخصوصية وملفات التتبع" : "Confidentialité et suivi"}
      </p>
      <p className="mt-1 text-xs leading-5 text-zinc-300">
        {locale === "ar"
          ? "لن يتم تحميل Meta أو TikTok إلا إذا وافقت على التسويق. لا تُرسل بيانات الاتصال إلى منصات الإعلانات."
          : "Meta et TikTok ne seront chargés qu'avec votre accord. Vos coordonnées ne sont jamais envoyées aux plateformes publicitaires."}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMarketingConsent("accepted")}
          className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-zinc-200"
        >
          {locale === "ar" ? "موافقة" : "Accepter"}
        </button>
        <button
          type="button"
          onClick={() => setMarketingConsent("rejected")}
          className="rounded-lg border border-zinc-600 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800"
        >
          {locale === "ar" ? "رفض" : "Refuser"}
        </button>
      </div>
    </aside>
  );
}
