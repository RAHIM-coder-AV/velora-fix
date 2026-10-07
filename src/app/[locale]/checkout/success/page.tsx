"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Gift, ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { LocaleLink } from "@/components/layout/language-switcher";
import { Container } from "@/components/ui/container";
import { useSettingsStore } from "@/stores/settings-store";

function CheckoutSuccessPageContent() {
  const { dict, locale } = useLocale();
  const searchParams = useSearchParams();
  const thankYou = useSettingsStore((state) => state.settings.storefront.thankYou);
  const refreshSharedSettings = useSettingsStore((state) => state.refreshSharedSettings);

  useEffect(() => {
    void refreshSharedSettings().catch((error) => console.error("Failed to load thank-you page settings", error));
  }, [refreshSharedSettings]);

  const ref = searchParams.get("ref") ?? "";
  const body = (thankYou?.body?.[locale] || dict.checkout.successBody).replace("{ref}", ref);
  const title = thankYou?.title?.[locale] || dict.checkout.successTitle;
  const highlightBanner = thankYou?.highlightBanner?.[locale] || (locale === "ar" ? "تم تسجيل طلبك بنجاح وسنتصل بك لتأكيده" : "Votre commande a été enregistrée avec succès");
  const importantNote = thankYou?.importantNote?.[locale] || (locale === "ar" ? "ملاحظة مهمة: يرجى إبقاء هاتفك مفتوحاً لتلقي اتصال مندوب التوصيل وتأكيد العنوان." : "Note importante : Veuillez garder votre téléphone allumé pour l'appel de confirmation.");
  const buttonLabel = thankYou?.buttonLabel?.[locale] || (locale === "ar" ? "العودة للرئيسية ومواصلة التسوق" : "Retour à l'accueil");

  return (
    <Container className="py-12 sm:py-20">
      <div className="mx-auto max-w-xl">
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 text-center shadow-xl dark:border-zinc-800 dark:bg-[#18181b] sm:p-10">
          
          {/* Green Checkmark Badge */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 ring-8 ring-emerald-500/10 dark:bg-emerald-500/20 dark:text-emerald-400">
            <CheckCircle2 size={46} strokeWidth={2.2} />
          </div>

          {/* Cyan Title */}
          <h1 className="font-serif text-2xl font-black tracking-tight text-cyan-700 dark:text-cyan-400 sm:text-3xl">
            {title}
          </h1>

          {/* Highlight Banner */}
          {highlightBanner && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              <SparkleDot />
              <span>{highlightBanner}</span>
            </div>
          )}

          {/* Order Ref */}
          {ref && (
            <div className="mt-4 inline-block rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300">
              {locale === "ar" ? `رقم الطلب: #${ref}` : `N° de commande : #${ref}`}
            </div>
          )}

          {/* Body description */}
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {body}
          </p>

          {/* Yellow Important Alert Box */}
          {importantNote && (
            <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-start text-xs leading-relaxed text-amber-900 dark:bg-amber-500/15 dark:text-amber-200">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-300">
                  <Gift size={16} />
                </div>
                <div className="flex-1 font-medium">
                  {importantNote}
                </div>
              </div>
            </div>
          )}

          {/* Guarantee Badges */}
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-zinc-100 pt-6 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <div className="flex items-center justify-center gap-2">
              <Truck size={16} className="text-purple-500" />
              <span>{locale === "ar" ? "توصيل سريع لباب المنزل" : "Livraison rapide"}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>{locale === "ar" ? "الدفع عند الاستلام" : "Paiement à la livraison"}</span>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="mt-8 space-y-3">
            <a
              href={`https://wa.me/${(useSettingsStore.getState().settings.whatsapp?.storePhone || "0697041176").replace(/[\s\-_]/g, "").replace(/^0/, "213")}?text=${encodeURIComponent(
                locale === "ar"
                  ? `مرحباً، قمت بتسجيل الطلب رقم #${ref} وأود متابعة وتأكيد الطلب معكم.`
                  : `Bonjour, j'ai passé la commande #${ref} et je souhaite la confirmer.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 active:scale-[0.98]"
            >
              <span>💬</span>
              <span>{locale === "ar" ? "تواصل معنا عبر واتساب لتأكيد الطلب فوراً" : "Confirmer la commande sur WhatsApp"}</span>
            </a>

            <LocaleLink
              href="/"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-8 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 active:scale-[0.98]"
            >
              <ShoppingBag size={16} />
              <span>{buttonLabel}</span>
              {locale === "ar" ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </LocaleLink>
          </div>

        </div>
      </div>
    </Container>
  );
}

function SparkleDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
    </span>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-24 text-center">
          <div className="mx-auto h-8 w-48 rounded bg-muted/10 animate-pulse" />
        </Container>
      }
    >
      <CheckoutSuccessPageContent />
    </Suspense>
  );
}
