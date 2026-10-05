"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
  const body = (thankYou.body[locale] || dict.checkout.successBody).replace("{ref}", ref);
  const title = thankYou.title[locale] || dict.checkout.successTitle;
  const buttonLabel = thankYou.buttonLabel[locale] || dict.checkout.backHome;

  return (
    <Container className="py-24 text-center">
      <h1 className="font-serif text-4xl">{title}</h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted">{body}</p>
      <LocaleLink
        href="/"
        className="mt-8 inline-block text-xs uppercase tracking-[0.16em] underline underline-offset-4"
      >
        {buttonLabel}
      </LocaleLink>
    </Container>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<Container className="py-24 text-center"><div className="h-8 w-48 rounded bg-muted/10 mx-auto" /></Container>}>
      <CheckoutSuccessPageContent />
    </Suspense>
  );
}
