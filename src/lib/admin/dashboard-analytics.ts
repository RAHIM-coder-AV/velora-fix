import type { AbandonedCheckout, Order, OrderStatus, Product } from "@/types";

const CONFIRMED_STATUSES = new Set<OrderStatus>([
  "confirmed",
  "customer_confirmed",
  "processing",
  "shipped",
  "delivered",
]);

const CANCELLED_STATUSES = new Set<OrderStatus>([
  "cancelled",
  "customer_cancelled",
  "fake",
]);

const RETURNED_STATUSES = new Set<OrderStatus>([
  "returned",
]);

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function buildDashboardAnalytics(
  orders: Order[],
  products: Product[],
  now: Date,
  dayCount = 7,
  abandonedCheckouts: AbandonedCheckout[] = [],
) {
  const todayKey = dateKey(now);
  const todayOrders = orders.filter((order) => dateKey(new Date(order.createdAt)) === todayKey);
  const todayAbandoned = abandonedCheckouts.filter((a) => dateKey(new Date(a.createdAt)) === todayKey);
  const days = Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (dayCount - index - 1));
    return {
      date,
      key: dateKey(date),
      orders: 0,
      confirmed: 0,
      abandoned: 0,
    };
  });
  const daysByKey = new Map(days.map((day) => [day.key, day]));

  for (const order of orders) {
    const day = daysByKey.get(dateKey(new Date(order.createdAt)));
    if (!day) continue;
    day.orders += 1;
    if (CONFIRMED_STATUSES.has(order.status)) day.confirmed += 1;
  }
  for (const abandoned of abandonedCheckouts) {
    const day = daysByKey.get(dateKey(new Date(abandoned.createdAt)));
    if (!day) continue;
    day.abandoned += 1;
  }

  const productStats = new Map<
    string,
    { product: Product | undefined; name: Order["items"][number]["name"]; units: number; revenue: number; image: string }
  >();
  for (const order of orders) {
    if (CANCELLED_STATUSES.has(order.status)) continue;
    for (const item of order.items) {
      const key = item.productId || item.name.ar || item.name.fr;
      const current = productStats.get(key) ?? {
        product: products.find((product) => product.id === item.productId),
        name: item.name,
        units: 0,
        revenue: 0,
        image: item.image,
      };
      current.units += item.quantity;
      current.revenue += item.unitPrice * item.quantity;
      productStats.set(key, current);
    }
  }

  const bestProducts = [...productStats.entries()]
    .map(([id, stat]) => ({ id, ...stat }))
    .sort((left, right) => right.units - left.units || right.revenue - left.revenue)
    .slice(0, 5);

  const totalUnits = bestProducts.reduce((sum, item) => sum + item.units, 0);
  const bestProductsWithPercent = bestProducts.map((item) => ({
    ...item,
    percent: totalUnits ? Math.round((item.units / totalUnits) * 1000) / 10 : 0,
  }));

  const productOrderStats = new Map<string, { total: number; confirmed: number; returned: number }>();
  for (const order of orders) {
    for (const item of order.items) {
      const key = item.productId || item.name.ar || item.name.fr;
      const current = productOrderStats.get(key) ?? { total: 0, confirmed: 0, returned: 0 };
      current.total += 1;
      if (CONFIRMED_STATUSES.has(order.status)) current.confirmed += 1;
      if (RETURNED_STATUSES.has(order.status)) current.returned += 1;
      productOrderStats.set(key, current);
    }
  }
  const bestProductsDetailed = bestProductsWithPercent.map((item) => {
    const stats = productOrderStats.get(item.id) ?? { total: 0, confirmed: 0, returned: 0 };
    return {
      ...item,
      confirmRate: stats.total ? Math.round((stats.confirmed / stats.total) * 1000) / 10 : 0,
      returnRate: stats.total ? Math.round((stats.returned / stats.total) * 1000) / 10 : 0,
      orderCount: stats.total,
    };
  });

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = dateKey(yesterday);
  const yesterdayOrders = orders.filter((order) => dateKey(new Date(order.createdAt)) === yesterdayKey);
  const yesterdayAbandoned = abandonedCheckouts.filter((a) => dateKey(new Date(a.createdAt)) === yesterdayKey);

  const ordersToday = todayOrders.length;
  const confirmedToday = todayOrders.filter((order) => CONFIRMED_STATUSES.has(order.status)).length;
  const cancelledToday = todayOrders.filter((order) => CANCELLED_STATUSES.has(order.status)).length;
  const abandonedToday = todayAbandoned.length;

  const ordersYesterday = yesterdayOrders.length;
  const confirmedYesterday = yesterdayOrders.filter((order) => CONFIRMED_STATUSES.has(order.status)).length;
  const cancelledYesterday = yesterdayOrders.filter((order) => CANCELLED_STATUSES.has(order.status)).length;
  const abandonedYesterday = yesterdayAbandoned.length;

  const changeRate = (today: number, yesterdayValue: number) => {
    if (yesterdayValue === 0) return today === 0 ? 0 : 100;
    return Math.round(((today - yesterdayValue) / yesterdayValue) * 100);
  };

  const topViewedProducts = [...products]
    .filter((product) => product.active !== false)
    .sort((left, right) => (right.views ?? 0) - (left.views ?? 0))
    .slice(0, 5);

  return {
    ordersToday,
    confirmedToday,
    cancelledToday,
    abandonedToday,
    ordersYesterday,
    confirmedYesterday,
    cancelledYesterday,
    abandonedYesterday,
    ordersChange: changeRate(ordersToday, ordersYesterday),
    confirmedChange: changeRate(confirmedToday, confirmedYesterday),
    cancelledChange: changeRate(cancelledToday, cancelledYesterday),
    abandonedChange: changeRate(abandonedToday, abandonedYesterday),
    totalRevenue: [...productStats.values()].reduce((sum, s) => sum + s.revenue, 0),
    days,
    bestProducts: bestProductsWithPercent,
    bestProductsDetailed,
    topViewedProducts,
  };
}
