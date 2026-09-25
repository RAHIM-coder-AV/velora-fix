"use client";

import { AccountView } from "@/components/account/account-view";
import { Container } from "@/components/ui/container";

export default function AccountPage() {
  return (
    <Container className="py-14">
      <AccountView />
    </Container>
  );
}
