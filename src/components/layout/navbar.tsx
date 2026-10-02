"use client";

import { useState } from "react";
import { Heart, Menu, ShoppingBag, User, X } from "lucide-react";
import { STORE_NAME } from "@/lib/constants";
import { useLocale } from "@/providers/locale-provider";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { LanguageSwitcher, LocaleLink } from "@/components/layout/language-switcher";
import { SearchBar } from "@/components/layout/search-bar";

export function Navbar() {
  const { dict } = useLocale();
  const [open, setOpen] = useState(false);
  const hydrated = useHydrated();
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const user = useAuthStore((s) => s.user);

  const links = [
    { href: "/", label: dict.nav.home },
    { href: "/products", label: dict.nav.products },
    { href: "/categories", label: dict.nav.categories },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex min-w-0 max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-5 sm:py-4 md:px-8">
        <button type="button" className="md:hidden" onClick={() => setOpen(true)} aria-label="menu">
          <Menu size={20} />
        </button>
        <nav className="hidden items-center gap-6 text-[11px] tracking-[0.2em] uppercase md:flex">
          {links.map((l) => (
            <LocaleLink key={l.href} href={l.href} className="hover:text-sand">
              {l.label}
            </LocaleLink>
          ))}
        </nav>
        <LocaleLink href="/" className="min-w-0 truncate text-center font-serif text-xl tracking-[0.16em] sm:text-2xl sm:tracking-[0.28em]">
          {STORE_NAME}
        </LocaleLink>
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <SearchBar />
          <LanguageSwitcher />
          <LocaleLink href="/wishlist" aria-label={dict.nav.wishlist}>
            <Heart size={18} />
          </LocaleLink>
          <LocaleLink
            href={hydrated && user ? "/account" : "/login"}
            aria-label={dict.nav.account}
          >
            <User size={18} />
          </LocaleLink>
          <LocaleLink href="/cart" className="relative" aria-label={dict.nav.cart}>
            <ShoppingBag size={18} />
            {hydrated && count > 0 ? (
              <span className="absolute -end-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] text-cream">
                {count}
              </span>
            ) : null}
          </LocaleLink>
        </div>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-cream pb-[env(safe-area-inset-bottom)] md:hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="font-serif text-xl tracking-[0.24em]">{STORE_NAME}</span>
            <button type="button" onClick={() => setOpen(false)} aria-label={dict.common.close}>
              <X size={20} />
            </button>
          </div>
          <div className="space-y-6 px-5 pt-8">
            <SearchBar compact />
            {links.map((l) => (
              <LocaleLink
                key={l.href}
                href={l.href}
                className="block font-serif text-3xl"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </LocaleLink>
            ))}
            <LocaleLink href="/login" className="block text-sm tracking-[0.16em] uppercase">
              {dict.nav.login}
            </LocaleLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
