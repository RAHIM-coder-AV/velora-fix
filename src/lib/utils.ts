import { CURRENCY_CODE } from "@/lib/constants";
import type { Locale } from "@/i18n/config";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(amount: number, locale: Locale) {
  const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
    maximumFractionDigits: 0,
  }).format(amount);
  return locale === "ar" ? `${formatted} د.ج` : `${formatted} ${CURRENCY_CODE}`;
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function orderReference() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `VL-${n}`;
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function averageRating(ratings: number[]) {
  if (!ratings.length) return 0;
  return Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10;
}

export function isAlgerianPhone(phone: string) {
  const cleaned = phone.replace(/[\s\-_().]/g, "");
  return /^(0|\+213|00213)?[5-7]\d{8}$/.test(cleaned) || /^\d{9,10}$/.test(cleaned);
}

export function isEmail(value: string) {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function timeAgo(dateString: string, locale: "ar" | "fr" = "ar"): string {
  try {
    const diff = (Date.now() - new Date(dateString).getTime()) / 1000;
    if (diff < 60) {
      return locale === "ar" ? "الآن" : "À l'instant";
    }
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) {
      return locale === "ar" ? `منذ ${minutes} دقيقة` : `Il y a ${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return locale === "ar" ? `منذ ${hours} ساعة` : `Il y a ${hours} h`;
    }
    const days = Math.floor(hours / 24);
    if (days < 30) {
      return locale === "ar" ? `منذ ${days} يوم` : `Il y a ${days} j`;
    }
    return new Date(dateString).toLocaleDateString(locale === "ar" ? "ar-DZ" : "fr-DZ");
  } catch {
    return dateString;
  }
}
