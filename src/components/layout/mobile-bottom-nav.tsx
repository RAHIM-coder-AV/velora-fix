"use client";

import { Heart, Home, ShoppingBag, Store, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/providers/locale-provider";
import { LocaleLink } from "@/components/layout/language-switcher";
import { useCartStore } from "@/stores/cart-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const { locale, dict } = useLocale();
  const pathname = usePathname();
  const hydrated = useHydrated();
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  if (pathname.includes("/admin") || pathname.includes("/checkout")) return null;

  const items = [
    { href: "/", icon: Home, label: dict.nav.home },
    { href: "/products", icon: Store, label: dict.nav.products },
    { href: "/wishlist", icon: Heart, label: dict.nav.wishlist },
    { href: "/cart", icon: ShoppingBag, label: dict.nav.cart, badge: count },
    { href: "/account", icon: User, label: dict.nav.account },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 pb-[env(safe-area-inset-bottom)] md:hidden">
      <ul className="grid grid-cols-5 pb-1">
        {items.map((item) => {
          const href = `/${locale}${item.href === "/" ? "" : item.href}`;
          const active = pathname === href || (item.href !== "/" && pathname.startsWith(href));
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <LocaleLink
                href={item.href}
                className={cn(
                  "relative flex min-w-0 flex-col items-center gap-1 px-0.5 py-2 text-center text-[9px] leading-tight tracking-normal sm:text-[10px] sm:tracking-wide",
                  active ? "text-ink" : "text-muted",
                )}
              >
                <Icon size={18} />
                {item.label}
                {hydrated && item.badge ? (
                  <span className="absolute end-4 top-1 h-1.5 w-1.5 rounded-full bg-ink" />
                ) : null}
              </LocaleLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
