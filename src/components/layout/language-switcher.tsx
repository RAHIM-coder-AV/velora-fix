"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { useLocale } from "@/providers/locale-provider";

export function LanguageSwitcher() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    const parts = pathname.split("/");
    parts[1] = next;
    router.push(parts.join("/") || `/${next}`);
  }

  return (
    <div className="flex shrink-0 items-center gap-1 text-[10px] tracking-[0.12em] uppercase sm:gap-2 sm:text-[11px] sm:tracking-[0.18em]">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          className={`px-1.5 py-2 ${l === locale ? "text-ink" : "text-muted hover:text-ink"}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function LocaleLink({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const { locale } = useLocale();
  const path = href.startsWith("/") ? `/${locale}${href}` : href;
  return (
    <Link href={path} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
