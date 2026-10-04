"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { MarketingConsentBanner } from "@/components/analytics/marketing-consent-banner";
import { SessionProvider } from "@/providers/session-provider";

export function StoreChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.split("/").includes("admin") ?? false;

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className="min-w-0 flex-1">
        <SessionProvider>{children}</SessionProvider>
      </main>
      {!isAdmin && (
        <>
          <Footer />
          <MobileBottomNav />
          <MarketingConsentBanner />
        </>
      )}
    </>
  );
}
