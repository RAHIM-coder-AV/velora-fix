"use client";

import { useLocale } from "@/providers/locale-provider";
import { CartView } from "@/components/cart/cart-view";
import { Container, SectionHeading } from "@/components/ui/container";

export default function CartPage() {
  const { dict } = useLocale();
  return (
    <Container className="py-14">
      <SectionHeading title={dict.cart.title} />
      <CartView />
    </Container>
  );
}
