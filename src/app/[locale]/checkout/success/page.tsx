"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/providers/locale-provider";
import { LocaleLink } from "@/components/layout/language-switcher";
import { Container } from "@/components/ui/container";

function CheckoutSuccessPageContent() {
  const { dict } = useLocale();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") ?? "";
  const body = dict.checkout.successBody.replace("{ref}", ref);

  return (
    <Container className="py-24 text-center">
      <h1 className="font-serif text-4xl">{dict.checkout.successTitle}</h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted">{body}</p>
      <LocaleLink
        href="/"
        className="mt-8 inline-block text-xs uppercase tracking-[0.16em] underline underline-offset-4"
      >
        {dict.checkout.backHome}
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
