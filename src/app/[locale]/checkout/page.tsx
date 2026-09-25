"use client";

import { useLocale } from "@/providers/locale-provider";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Container, SectionHeading } from "@/components/ui/container";

export default function CheckoutPage() {
  const { dict } = useLocale();
  return (
    <Container className="py-14">
      <SectionHeading title={dict.checkout.title} />
      <CheckoutForm />
    </Container>
  );
}
