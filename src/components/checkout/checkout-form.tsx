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
import { useAbandonedCheckout } from "@/lib/orders/use-abandoned-checkout";
import { trackPurchaseEvent } from "@/components/analytics/analytics-scripts";

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
  const [contactConsent, setContactConsent] = useState(false);

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
  const draftQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const draftProductName = lines.map((line) => line.product.name[locale] || line.product.name.ar).join("، ");
  const abandonedCheckout = useAbandonedCheckout({
    productId: lines.length === 1 ? lines[0].product.id : "cart",
    productName: lines.length ? draftProductName : (locale === "ar" ? "سلة التسوق" : "Panier"),
    size: lines.length === 1 ? lines[0].variant.size : "",
    color: lines.length === 1 ? lines[0].variant.color[locale] : "",
    quantity: draftQuantity,
    value: totals.total,
    contactConsent,
    customerName: form.name,
    phone: form.phone,
    wilaya: form.wilaya,
    commune: form.commune,
  });

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
    const draftSessionId = await abandonedCheckout.saveBeforeSubmit().catch((error) => {
      console.error("Failed to save checkout draft before order placement", error);
      return null;
    });

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
        order.reference = await placeOrderDb(createClient()!, order, draftSessionId ?? undefined);
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
    }

    addOrder(order);
    trackPurchaseEvent({
      orderId: order.reference,
      total: order.total,
      currency: "DZD",
      items: order.items.map((item) => ({
        productId: item.productId,
        name: item.name.fr || item.name.ar,
        price: item.unitPrice,
        quantity: item.quantity,
      })),
    });
    if (draftSessionId && !isSupabaseConfigured()) {
      await abandonedCheckout.markCompleted(order.reference).catch((error) => {
        console.error("Failed to mark checkout draft as converted", error);
      });
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
    <form
      onSubmit={onSubmit}
      onFocusCapture={abandonedCheckout.startTracking}
      onClickCapture={abandonedCheckout.startTracking}
      className="grid min-w-0 gap-6 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12"
    >
      <div className="min-w-0 space-y-5">
        <h2 className="font-serif text-2xl">{dict.checkout.details}</h2>
        <label className="flex items-start gap-2 rounded-lg border border-line p-3 text-xs leading-5 text-muted">
          <input
            type="checkbox"
            checked={contactConsent}
            onChange={(event) => setContactConsent(event.target.checked)}
            className="mt-1"
          />
          <span>
            {locale === "ar"
              ? "أوافق اختيارياً على حفظ بيانات الاتصال التي أدخلها لاسترجاع الطلب غير المؤكد. لن تُرسل هذه البيانات إلى منصات الإعلانات."
              : "J'accepte facultativement la sauvegarde de mes coordonnées pour retrouver ma commande non confirmée. Elles ne seront pas transmises aux plateformes publicitaires."}
          </span>
        </label>
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
      <aside className="h-fit min-w-0 border border-line bg-white p-4 sm:p-6 lg:sticky lg:top-24">
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
