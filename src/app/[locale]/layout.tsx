import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond, Cairo } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { isLocale, localeDir, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { LocaleProvider } from "@/providers/locale-provider";
import { SessionProvider } from "@/providers/session-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { ToastHost } from "@/components/ui/toast";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import { MarketingConsentBanner } from "@/components/analytics/marketing-consent-banner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const dir = localeDir(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${outfit.variable} ${cormorant.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col" dir={dir}>
        <LocaleProvider locale={locale} dict={dict}>
          <Navbar />
          <main className="flex-1">
            <SessionProvider>{children}</SessionProvider>
          </main>
          <Footer />
          <MobileBottomNav />
          <ToastHost />
          <AnalyticsScripts />
          <MarketingConsentBanner />
        </LocaleProvider>
      </body>
    </html>
  );
}
