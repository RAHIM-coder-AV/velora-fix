"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/providers/locale-provider";
import { LocaleLink } from "@/components/layout/language-switcher";
import { Container } from "@/components/ui/container";
import { useCatalogStore } from "@/stores/catalog-store";
import { trackPurchaseEvent } from "@/components/analytics/analytics-scripts";

function CheckoutSuccessPageContent() {
  const { dict } = useLocale();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") ?? "";
  const orders = useCatalogStore((s) => s.orders);

  useEffect(() => {
    if (!ref) return;
    const order = orders.find((o) => o.reference === ref);
    if (order) {
      trackPurchaseEvent({
        orderId: order.reference,
        total: order.total,
        currency: "DZD",
        items: order.items.map((i) => ({
          name: i.name.fr || i.name.ar,
          price: i.unitPrice,
          quantity: i.quantity,
        })),
      });
    }
  }, [ref, orders]);

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
