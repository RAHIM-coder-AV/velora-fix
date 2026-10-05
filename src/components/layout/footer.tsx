"use client";

import { FormEvent, useState } from "react";
import { usePathname } from "next/navigation";
import { STORE_NAME } from "@/lib/constants";
import { useLocale } from "@/providers/locale-provider";
import { LocaleLink } from "@/components/layout/language-switcher";
import { toast } from "@/components/ui/toast";
import { useSettingsStore } from "@/stores/settings-store";

export function Footer() {
  const { dict } = useLocale();
  const pathname = usePathname();
  const storefront = useSettingsStore((state) => state.settings.storefront);
  const storeName = storefront.storeName.trim() || STORE_NAME;
  const hasMobileBottomNav = !pathname.includes("/admin") && !pathname.includes("/checkout");
  const [email, setEmail] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    toast(dict.account.saved);
    setEmail("");
  }

  return (
    <footer className={`mt-auto border-t border-line bg-cream-2 ${hasMobileBottomNav ? "pb-20 md:pb-0" : ""}`}>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:gap-10 sm:px-5 sm:py-14 md:grid-cols-4 md:px-8">
        <div>
          <p className="font-serif text-2xl tracking-[0.24em]">{storeName}</p>
          {storefront.storeTagline ? <p className="mt-2 text-sm text-muted">{storefront.storeTagline}</p> : null}
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted">{dict.hero.subtitle}</p>
          <p className="mt-4 text-sm text-muted">{dict.footer.address}</p>
          <p className="text-sm text-muted">{dict.footer.phone}</p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase">{dict.footer.house}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <LocaleLink href="/categories">{dict.nav.categories}</LocaleLink>
            </li>
            <li>
              <LocaleLink href="/products">{dict.nav.products}</LocaleLink>
            </li>
            <li>
              <LocaleLink href="/account">{dict.footer.about}</LocaleLink>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase">{dict.footer.service}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <LocaleLink href="/checkout">{dict.footer.shipping}</LocaleLink>
            </li>
            <li>
              <LocaleLink href="/account">{dict.footer.returns}</LocaleLink>
            </li>
            <li>
              <LocaleLink href="/login">{dict.footer.contact}</LocaleLink>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase">{dict.footer.newsletter}</p>
          <p className="mt-4 text-sm text-muted">{dict.footer.newsletterHint}</p>
          <form onSubmit={onSubmit} className="mt-4 flex border-b border-ink">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full bg-transparent py-2 text-sm outline-none"
              placeholder="email"
            />
            <button type="submit" className="text-[11px] tracking-[0.16em] uppercase">
              {dict.footer.subscribe}
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-line px-5 py-4 text-center text-xs text-muted md:px-8">
        © {new Date().getFullYear()} {storeName}. {dict.footer.rights}
      </div>
    </footer>
  );
}
