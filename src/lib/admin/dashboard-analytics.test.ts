import assert from "node:assert/strict";
import test from "node:test";
import type { Order } from "@/types";
import { buildDashboardAnalytics } from "@/lib/admin/dashboard-analytics";

const now = new Date(2026, 9, 5, 12);

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "order-1",
    reference: "VLR-0001",
    customerName: "Customer",
    phone: "0550000000",
    wilaya: "Alger",
    commune: "Alger Centre",
    address: "Address",
    status: "pending",
    paymentMethod: "cod",
    subtotal: 2000,
    shipping: 0,
    total: 2000,
    items: [{
      id: "item-1",
      productId: "product-1",
      variantId: "variant-1",
      name: { ar: "منتج", fr: "Produit" },
      size: "M",
      color: { ar: "أسود", fr: "Noir" },
      image: "",
      unitPrice: 1000,
      quantity: 2,
    }],
    createdAt: new Date(2026, 9, 5, 9).toISOString(),
    ...overrides,
  };
}

test("dashboard counts today's order states and builds a real seven-day trend", () => {
  const analytics = buildDashboardAnalytics([
    makeOrder(),
    makeOrder({ id: "order-2", status: "confirmed" }),
    makeOrder({ id: "order-3", status: "cancelled" }),
    makeOrder({ id: "order-4", createdAt: new Date(2026, 9, 4, 9).toISOString(), status: "delivered" }),
  ], [], now);

  assert.equal(analytics.ordersToday, 3);
  assert.equal(analytics.confirmedToday, 1);
  assert.equal(analytics.cancelledToday, 1);
  assert.deepEqual(analytics.days.map(({ orders, confirmed }) => [orders, confirmed]), [
    [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [1, 1], [3, 1],
  ]);
});

test("dashboard ranks products by non-cancelled order quantity and actual sales", () => {
  const analytics = buildDashboardAnalytics([
    makeOrder(),
    makeOrder({ id: "order-2", items: [{
      id: "item-2",
      productId: "product-2",
      variantId: "variant-2",
      name: { ar: "منتج آخر", fr: "Autre produit" },
      size: "L",
      color: { ar: "أبيض", fr: "Blanc" },
      image: "",
      unitPrice: 1500,
      quantity: 3,
    }] }),
    makeOrder({ id: "order-cancelled", status: "cancelled" }),
  ], [], now);

  assert.equal(analytics.bestProducts[0].id, "product-2");
  assert.equal(analytics.bestProducts[0].units, 3);
  assert.equal(analytics.bestProducts[0].revenue, 4500);
  assert.equal(analytics.bestProducts[1].units, 2);
});
