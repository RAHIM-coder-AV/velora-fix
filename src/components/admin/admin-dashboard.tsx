"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  CheckCircle2,
  Receipt,
  ShoppingCart,
  TrendingDown,
  XCircle,
} from "lucide-react";
import type { AbandonedCheckout, Order, Product } from "@/types";
import { useLocale } from "@/providers/locale-provider";
import { useSettingsStore } from "@/stores/settings-store";
import { formatPrice } from "@/lib/utils";
import { buildDashboardAnalytics } from "@/lib/admin/dashboard-analytics";

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  abandonedCheckouts: AbandonedCheckout[];
  onOpenOrders: () => void;
  onOpenAbandoned: () => void;
}

function TrendChart({ days, locale }: {
  days: ReturnType<typeof buildDashboardAnalytics>["days"];
  locale: "ar" | "fr";
}) {
  const width = 760;
  const height = 300;
  const left = 42;
  const right = 36;
  const top = 24;
  const bottom = 48;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const peak = Math.max(1, ...days.flatMap((day) => [day.orders, day.abandoned ?? 0]));
  const pointAt = (value: number, index: number) => ({
    x: left + (days.length <= 1 ? plotWidth / 2 : (index * plotWidth) / (days.length - 1)),
    y: top + plotHeight - (value / peak) * plotHeight,
  });
  const orderPoints = days.map((day, index) => pointAt(day.orders, index));
  const abandonedPoints = days.map((day, index) => pointAt(day.abandoned ?? 0, index));
  const smoothPathFor = (points: { x: number; y: number }[]) => {
    if (points.length <= 1) return points.length ? `M ${points[0].x} ${points[0].y}` : "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };
  const localeTag = locale === "ar" ? "ar-DZ" : "fr-DZ";

  return (
    <div className="mt-4">
      <div className="overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto max-h-[320px] w-full overflow-visible" role="img" aria-label={locale === "ar" ? "مخطط الطلبات خلال آخر سبعة أيام" : "Graphique des commandes"}>
          {[0, 1, 2, 3, 4, 5, 6].map((line) => {
            const y = top + (plotHeight * line) / 6;
            const value = Math.round((peak * (6 - line)) / 6);
            return (
              <g key={line}>
                <line x1={left} x2={width - right} y1={y} y2={y} stroke="#27272a" strokeWidth="1" />
                <text x={width - right + 8} y={y + 4} fill="#71717a" fontSize="10" textAnchor="start">{value}</text>
              </g>
            );
          })}
          <path d={smoothPathFor(abandonedPoints)} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d={smoothPathFor(orderPoints)} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {orderPoints.map((point, index) => (
            <g key={days[index].key}>
              <circle cx={point.x} cy={point.y} r="5" fill="#3b82f6" stroke="#18181b" strokeWidth="2" />
              <circle cx={abandonedPoints[index].x} cy={abandonedPoints[index].y} r="5" fill="#f59e0b" stroke="#18181b" strokeWidth="2" />
              <text x={point.x} y={height - 18} textAnchor="middle" fill="#a1a1aa" fontSize="10">
                {days[index].date.toLocaleDateString(localeTag, { day: "2-digit", month: "2-digit", year: "2-digit" })}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

const percentColors = [
  { ring: "stroke-blue-500", text: "text-blue-400", bg: "bg-blue-500" },
  { ring: "stroke-emerald-500", text: "text-emerald-400", bg: "bg-emerald-500" },
  { ring: "stroke-rose-500", text: "text-rose-400", bg: "bg-rose-500" },
  { ring: "stroke-amber-500", text: "text-amber-400", bg: "bg-amber-500" },
  { ring: "stroke-violet-500", text: "text-violet-400", bg: "bg-violet-500" },
];

const donutSegments = [
  { color: "#ec4899", label: "Meta" },
  { color: "#000000", label: "Snapchat" },
  { color: "#3b82f6", label: "TikTok" },
  { color: "#a855f7", label: "Google" },
  { color: "#f59e0b", label: "Autre" },
];

export function AdminDashboard({
  orders,
  products,
  abandonedCheckouts,
  onOpenOrders,
  onOpenAbandoned,
}: AdminDashboardProps) {
  const { locale } = useLocale();
  const pixels = useSettingsStore((state) => state.settings.pixels);
  const [range, setRange] = useState<7 | 30>(7);
  const [productsRange, setProductsRange] = useState<"today" | "7" | "month" | "custom">("7");
  const analytics = useMemo(
    () => buildDashboardAnalytics(orders, products, new Date(), range, abandonedCheckouts),
    [orders, products, range, abandonedCheckouts],
  );
  const pixelSlots = [
    ...pixels.metaPixelIds.map((id, index) => ({ id, enabled: pixels.metaPixelEnabled[index] })),
    ...pixels.tiktokPixelIds.map((id, index) => ({ id, enabled: pixels.tiktokPixelEnabled[index] })),
  ];
  const configuredPixels = pixelSlots.filter((pixel) => pixel.id.trim()).length;
  const activePixels = pixelSlots.filter((pixel) => pixel.id.trim() && pixel.enabled).length;
  const number = (value: number) => new Intl.NumberFormat(locale === "ar" ? "ar-DZ" : "fr-DZ").format(value);
  const statCards = [
    {
      title: locale === "ar" ? "المتروكة اليوم" : "Abandonnés aujourd'hui",
      value: analytics.abandonedToday,
      yesterday: analytics.abandonedYesterday,
      change: analytics.abandonedChange,
      icon: ShoppingCart,
      onClick: onOpenAbandoned,
    },
    {
      title: locale === "ar" ? "الملغاة اليوم" : "Annulées aujourd'hui",
      value: analytics.cancelledToday,
      yesterday: analytics.cancelledYesterday,
      change: analytics.cancelledChange,
      icon: XCircle,
      onClick: onOpenOrders,
    },
    {
      title: locale === "ar" ? "المؤكدة اليوم" : "Confirmées aujourd'hui",
      value: analytics.confirmedToday,
      yesterday: analytics.confirmedYesterday,
      change: analytics.confirmedChange,
      icon: CheckCircle2,
      onClick: onOpenOrders,
    },
    {
      title: locale === "ar" ? "طلبات اليوم" : "Commandes aujourd'hui",
      value: analytics.ordersToday,
      yesterday: analytics.ordersYesterday,
      change: analytics.ordersChange,
      icon: Receipt,
      onClick: onOpenOrders,
    },
  ];

  return (
    <section className="space-y-6" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const isDown = card.change < 0;
          const isFlat = card.change === 0;
          const changeColor = isFlat ? "text-zinc-400" : isDown ? "text-rose-400" : "text-emerald-400";
          return (
            <button
              key={card.title}
              type="button"
              onClick={card.onClick}
              className="overflow-hidden rounded-xl border border-zinc-800 bg-[#18181b] text-start transition hover:border-zinc-600 active:scale-[0.99]"
            >
              <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/15 text-purple-300">
                  <Icon size={18} />
                </div>
                <span className="text-xs font-semibold text-zinc-300">{card.title}</span>
              </div>
              <div className="flex items-end justify-between px-4 py-4">
                <span className={`flex items-center gap-1 text-[11px] font-semibold ${changeColor}`}>
                  {isFlat ? null : <TrendingDown size={13} />}
                  {Math.abs(card.change)}%
                </span>
                <span className="flex flex-col items-end">
                  <span className="text-3xl font-bold text-white">{number(card.value)}</span>
                  <span className="text-[10px] text-zinc-500">
                    {locale === "ar" ? `الأمس: ${number(card.yesterday)}` : `Hier : ${number(card.yesterday)}`}
                  </span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]">
        <section className="min-w-0 rounded-xl border border-zinc-800 bg-[#18181b] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-white">
              {locale === "ar" ? "أبرز المنتجات" : "Produits vedettes"}
            </h2>
            <span className="rounded-full bg-zinc-800 px-3 py-1 text-[10px] font-semibold text-zinc-300">
              {locale === "ar" ? `مشاهدة ${number(analytics.totalRevenue)}` : `Revenu ${number(analytics.totalRevenue)}`}
            </span>
          </div>
          {analytics.bestProducts.length ? (
            <div className="mt-4 space-y-1">
              {analytics.bestProducts.map((item, index) => {
                const color = percentColors[index % percentColors.length];
                const name = item.product?.name[locale] || item.name[locale] || item.name.ar;
                const dashOffset = 263.89 - (263.89 * Math.min(item.percent, 100)) / 100;
                return (
                  <div key={item.id} className="flex items-center gap-3 border-b border-zinc-800/70 py-3 last:border-0">
                    <div className="relative h-10 w-10 shrink-0">
                      <svg className="h-10 w-10 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#27272a" strokeWidth="7" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeDasharray="263.89" strokeDashoffset={dashOffset} className={color.ring} />
                      </svg>
                      <span className={`absolute inset-0 flex items-center justify-center text-[11px] font-bold ${color.text}`}>{item.percent}%</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-xs font-semibold text-zinc-100">{name}</p>
                        {item.image ? (
                          <Image src={item.image} alt="" width={28} height={28} unoptimized className="h-7 w-7 shrink-0 rounded-md border border-zinc-700 object-cover" />
                        ) : null}
                      </div>
                      <p className="mt-1 text-[10px] text-zinc-500">
                        {locale === "ar" ? `مشاهدة ${number(item.revenue)}` : `${number(item.revenue)} DA`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-10 text-center text-xs text-zinc-500">
              {locale === "ar" ? "ستظهر المنتجات بعد تسجيل الطلبات." : "Les produits apparaîtront après des commandes."}
            </p>
          )}
        </section>

        <section className="min-w-0 rounded-xl border border-zinc-800 bg-[#18181b] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white">
                {locale === "ar" ? "تحليل الطلبات" : "Analyse des commandes"}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <div className="flex items-center gap-4 text-[11px] font-semibold">
                <span className="flex items-center gap-2 text-zinc-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  {locale === "ar" ? `طلب ${number(analytics.days.reduce((s, d) => s + d.orders, 0))}` : `Commandes ${number(analytics.days.reduce((s, d) => s + d.orders, 0))}`}
                </span>
                <span className="flex items-center gap-2 text-zinc-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  {locale === "ar" ? `متروك ${number(analytics.days.reduce((s, d) => s + (d.abandoned ?? 0), 0))}` : `Abandon ${number(analytics.days.reduce((s, d) => s + (d.abandoned ?? 0), 0))}`}
                </span>
              </div>
              <label className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="sr-only">{locale === "ar" ? "الفترة" : "Période"}</span>
                <select value={range} onChange={(event) => setRange(Number(event.target.value) as 7 | 30)} className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white">
                  <option value={7}>{locale === "ar" ? "أسبوعي" : "Hebdomadaire"}</option>
                  <option value={30}>{locale === "ar" ? "شهري" : "Mensuel"}</option>
                </select>
              </label>
            </div>
          </div>
          <TrendChart days={analytics.days} locale={locale} />
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]">
        <section className="rounded-xl border border-zinc-800 bg-[#18181b] p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white">
              {locale === "ar" ? "إحصائيات الإعلانات" : "Statistiques publicitaires"}
            </h2>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <div className="relative flex h-48 w-48 items-center justify-center">
              <svg className="h-48 w-48" viewBox="0 0 100 100">
                {(() => {
                  const values = [
                    pixels.metaPixelIds.filter((id, idx) => id.trim() && pixels.metaPixelEnabled[idx]).length,
                    1,
                    pixels.tiktokPixelIds.filter((id, idx) => id.trim() && pixels.tiktokPixelEnabled[idx]).length,
                    1,
                    Math.max(1, configuredPixels - activePixels + 1),
                  ];
                  const sum = values.reduce((s, v) => s + v, 0);
                  let startAngle = -Math.PI / 2;
                  return values.map((v, segIndex) => {
                    const angle = (v / sum) * Math.PI * 2;
                    const endAngle = startAngle + angle;
                    const largeArc = angle > Math.PI ? 1 : 0;
                    const x1 = 50 + 38 * Math.cos(startAngle);
                    const y1 = 50 + 38 * Math.sin(startAngle);
                    const x2 = 50 + 38 * Math.cos(endAngle);
                    const y2 = 50 + 38 * Math.sin(endAngle);
                    const ix1 = 50 + 26 * Math.cos(endAngle);
                    const iy1 = 50 + 26 * Math.sin(endAngle);
                    const ix2 = 50 + 26 * Math.cos(startAngle);
                    const iy2 = 50 + 26 * Math.sin(startAngle);
                    startAngle = endAngle;
                    return (
                      <path
                        key={segIndex}
                        d={`M ${x1} ${y1} A 38 38 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A 26 26 0 ${largeArc} 0 ${ix2} ${iy2} Z`}
                        fill={donutSegments[segIndex % donutSegments.length].color}
                        opacity="0.95"
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <BadgeCheck size={42} className="text-zinc-200/40" />
              </div>
            </div>
            <div className="mt-4 grid w-full grid-cols-2 gap-2 text-[10px]">
              {donutSegments.map((seg) => (
                <div key={seg.label} className="flex items-center gap-2 rounded-md bg-zinc-900/50 px-2 py-1.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: seg.color }} />
                  <span className="text-zinc-300">{seg.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-zinc-800 bg-[#18181b]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-4 py-4 sm:px-5">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">
                {locale === "ar" ? "المنتجات الأكثر طلباً" : "Produits les plus demandés"}
              </h2>
              <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-[10px] text-zinc-300">
                {locale === "ar" ? `${number(analytics.bestProductsDetailed.length)} منتجات` : `${number(analytics.bestProductsDetailed.length)} produits`}
              </span>
            </div>
            <div className="flex rounded-lg border border-zinc-700 bg-zinc-900 p-0.5 text-[11px]">
              {([
                { key: "today", label: locale === "ar" ? "اليوم" : "Aujourd'hui" },
                { key: "7", label: locale === "ar" ? "7 أيام" : "7 j" },
                { key: "month", label: locale === "ar" ? "شهر" : "Mois" },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setProductsRange(tab.key as typeof productsRange)}
                  className={`rounded-md px-3 py-1.5 font-semibold transition ${
                    productsRange === tab.key
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setProductsRange("custom")}
                className={`flex items-center gap-1 rounded-md px-3 py-1.5 font-semibold transition ${
                  productsRange === "custom"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {locale === "ar" ? "تاريخ مخصص" : "Perso."}
              </button>
            </div>
          </div>
          {analytics.bestProductsDetailed.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-start text-xs">
                <thead className="border-y border-zinc-800 bg-zinc-900/70 text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">{locale === "ar" ? "المنتج" : "Produit"}</th>
                    <th className="px-4 py-3 font-semibold">{locale === "ar" ? "السعر" : "Prix"}</th>
                    <th className="px-4 py-3 font-semibold">{locale === "ar" ? "الطلبات" : "Commandes"}</th>
                    <th className="px-4 py-3 font-semibold">{locale === "ar" ? "نسبة التأكيد" : "Taux de conf."}</th>
                    <th className="px-4 py-3 font-semibold">{locale === "ar" ? "نسبة الارجاع" : "Taux de retour"}</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.bestProductsDetailed.map((item) => {
                    const name = item.product?.name[locale] || item.name[locale] || item.name.ar;
                    const price = item.product?.price ?? item.units ? item.revenue / item.units : 0;
                    return (
                      <tr key={item.id} className="border-b border-zinc-800/80 last:border-0 hover:bg-zinc-900/30">
                        <td className="px-4 py-3">
                          <div className="flex min-w-0 items-center gap-2">
                            {item.image ? (
                              <Image src={item.image} alt="" width={34} height={34} unoptimized className="h-9 w-9 shrink-0 rounded-md object-cover" />
                            ) : null}
                            <span className="max-w-56 truncate font-semibold text-zinc-100">{name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-zinc-300">{formatPrice(price, locale)}</td>
                        <td className="px-4 py-3 font-semibold text-white">{number(item.orderCount)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-zinc-800">
                              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(item.confirmRate, 100)}%` }} />
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-300">{item.confirmRate}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-zinc-800">
                              <div className="h-full rounded-full bg-rose-500" style={{ width: `${Math.min(item.returnRate, 100)}%` }} />
                            </div>
                            <span className="text-[10px] font-semibold text-rose-300">{item.returnRate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-5 py-10 text-center text-xs text-zinc-500">
              {locale === "ar" ? "لا توجد منتجات مطلوبة بعد." : "Aucun produit demandé pour le moment."}
            </p>
          )}
        </section>
      </div>
    </section>
  );
}
