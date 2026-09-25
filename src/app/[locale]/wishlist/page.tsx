"use client";

import { useLocale } from "@/providers/locale-provider";
import { WishlistView } from "@/components/wishlist/wishlist-view";
import { Container, SectionHeading } from "@/components/ui/container";

export default function WishlistPage() {
  const { dict } = useLocale();
  return (
    <Container className="py-14">
      <SectionHeading title={dict.nav.wishlist} />
      <WishlistView />
    </Container>
  );
}
