"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ALGERIA_WILAYAS, getCommunesForWilaya } from "@/lib/algeria-data";
import { isAlgerianPhone, orderReference, uid } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/configured";
import { placeOrder as placeOrderDb } from "@/lib/supabase/data";
import { useCartStore } from "@/stores/cart-store";
import { useCatalogStore } from "@/stores/catalog-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useAuthStore } from "@/stores/auth-store";
import { useLocale } from "@/providers/locale-provider";
import { cartTotals } from "@/components/cart/cart-view";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";
import { LocaleLink } from "@/components/layout/language-switcher";

export function CheckoutForm() {
  const { locale, dict } = useLocale();
  const user = useAuthStore((s) => s.user);
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const products = useCatalogStore((s) => s.products);
  const addOrder = useCatalogStore((s) => s.addOrder);
  const setVariantStock = useCatalogStore((s) => s.setVariantStock);
  const router = useRouter();

  const [form, setForm] = useState({
    name: user?.fullName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    wilaya: user?.wilaya ?? "",
    commune: "",
    address: user?.address ?? "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placed, setPlaced] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const lines = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          const variant = product?.variants.find((v) => v.id === item.variantId);
          if (!product || !variant) return null;
          return { item, product, variant };
        })
        .filter(Boolean) as Array<{
        item: (typeof items)[number];
        product: (typeof products)[number];
        variant: (typeof products)[number]["variants"][number];
      }>,
    [items, products],
  );

  const getShippingFee = useSettingsStore((s) => s.getShippingFee);
  const freeThreshold = useSettingsStore((s) => s.settings.freeShippingThreshold);

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.item.quantity, 0);
  const shippingFee = subtotal >= freeThreshold || subtotal === 0 ? 0 : getShippingFee(form.wilaya, "home");
  const totals = {
    subtotal,
    shipping: shippingFee,
    total: subtotal + shippingFee,
  };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = dict.checkout.errors.name;
    if (!isAlgerianPhone(form.phone)) e.phone = dict.checkout.errors.phone;
    if (!form.wilaya) e.wilaya = dict.checkout.errors.wilaya;
    if (!form.commune.trim()) e.commune = dict.checkout.errors.commune;
    if (!form.address.trim()) e.address = dict.checkout.errors.address;
    if (!lines.length) e.empty = dict.checkout.errors.empty;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);

    const order: Order = {
      id: uid("ord"),
      reference: orderReference(),
      userId: user?.id,
      email: form.email,
      customerName: form.name,
      phone: form.phone,
      wilaya: form.wilaya,
      commune: form.commune,
      address: form.address,
      notes: form.notes,
      status: "pending",
      paymentMethod: "cod",
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      total: totals.total,
      createdAt: new Date().toISOString(),
      items: lines.map((l) => ({
        id: uid("oi"),
        productId: l.product.id,
        variantId: l.variant.id,
        name: l.product.name,
        size: l.variant.size,
        color: l.variant.color,
        image: l.product.images[0].url,
        unitPrice: l.product.price,
        quantity: l.item.quantity,
      })),
    };

    if (isSupabaseConfigured()) {
      try {
        order.reference = await placeOrderDb(createClient()!, order);
        await useCatalogStore.getState().refresh(); // تحديث المخزون المعروض
      } catch (e) {
        const msg = String((e as { message?: string })?.message ?? e);
        if (msg.includes("OUT_OF_STOCK") || msg.includes("VARIANT_NOT_FOUND")) {
          await useCatalogStore.getState().refresh();
          setErrors({
            empty:
              locale === "ar"
                ? "وصل أحد المنتجات إلى نهاية المخزون. حدّث السلة وحاول مجدداً."
                : "Un article vient de passer en rupture de stock. Mettez le panier à jour.",
          });
        } else {
          setErrors({
            empty:
              locale === "ar"
                ? "تعذّر تسجيل الطلب. أعد المحاولة."
                : "Impossible d'enregistrer la commande. Réessayez.",
          });
        }
        setSubmitting(false);
        return;
      }
    } else {
      // وضع تجريبي بلا خادم
      lines.forEach((l) =>
        setVariantStock(l.product.id, l.variant.id, l.variant.stock - l.item.quantity),
      );
      addOrder(order);
    }

    setSubmitting(false);
    clear();
    setPlaced(order.reference);
    router.replace(`/${locale}/checkout/success?ref=${order.reference}`);
  }

  if (!lines.length && !placed) {
    return (
      <div className="py-16 text-center">
        <p>{dict.checkout.errors.empty}</p>
        <LocaleLink href="/products" className="mt-4 inline-block underline">
          {dict.cart.continue}
        </LocaleLink>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-12 lg:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        <h2 className="font-serif text-2xl">{dict.checkout.details}</h2>
        <Field label={dict.checkout.name} error={errors.name}>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label={dict.checkout.phone} error={errors.phone}>
          <Input value={form.phone} placeholder="0550 00 00 00" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </Field>
        <Field label={dict.checkout.wilaya} error={errors.wilaya}>
          <Select
            value={form.wilaya}
            onChange={(e) => {
              setForm({ ...form, wilaya: e.target.value, commune: "" });
            }}
          >
            <option value="" className="bg-white text-zinc-900">—</option>
            {ALGERIA_WILAYAS.map((w) => {
              const label = locale === "ar" ? w.nameAr : w.nameFr;
              return (
                <option key={w.code} value={label} className="bg-white text-zinc-900">
                  {label}
                </option>
              );
            })}
          </Select>
        </Field>
        <Field label={dict.checkout.commune} error={errors.commune}>
          {getCommunesForWilaya(form.wilaya).length > 0 ? (
            <Select
              value={form.commune}
              onChange={(e) => setForm({ ...form, commune: e.target.value })}
            >
              <option value="" className="bg-white text-zinc-900">— {locale === "ar" ? "اختر البلدية" : "Choisir la commune"} —</option>
              {getCommunesForWilaya(form.wilaya).map((c) => (
                <option key={c} value={c} className="bg-white text-zinc-900">
                  {c}
                </option>
              ))}
            </Select>
          ) : (
            <Input value={form.commune} onChange={(e) => setForm({ ...form, commune: e.target.value })} />
          )}
        </Field>
        <Field label={dict.checkout.address} error={errors.address}>
          <Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </Field>
        <Field label={dict.checkout.notes}>
          <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </Field>
        <div className="border border-line bg-white p-4">
          <p className="text-sm font-medium">{dict.checkout.cod}</p>
          <p className="mt-1 text-sm text-muted">{dict.checkout.codHelp}</p>
        </div>
      </div>
      <aside className="h-fit border border-line bg-white p-6">
        <h2 className="font-serif text-2xl">{dict.checkout.review}</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {lines.map((l) => (
            <li key={l.item.variantId} className="flex justify-between gap-2">
              <span>
                {l.product.name[locale]} × {l.item.quantity}
              </span>
              <span>{formatPrice(l.product.price * l.item.quantity, locale)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between border-t border-line pt-3">
          <span>{dict.cart.total}</span>
          <span>{formatPrice(totals.total, locale)}</span>
        </p>
        {errors.empty ? <p className="mt-2 text-sm text-red-800">{errors.empty}</p> : null}
        <Button type="submit" disabled={submitting} className="mt-6 w-full">
          {dict.checkout.place}
        </Button>
      </aside>
    </form>
  );
}
