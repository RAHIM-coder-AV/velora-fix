import assert from "node:assert/strict";
import test from "node:test";
import { calculateOrderTotals, canEditOrder } from "./order-editing";

test("order edits recalculate subtotal, delivery type fee, and total", () => {
  const totals = calculateOrderTotals(
    [
      { unitPrice: 2400, quantity: 1 },
      { unitPrice: 1200, quantity: 2 },
    ],
    "16 - الجزائر",
    true,
    10000,
    (_wilaya, type) => (type === "desk" ? 300 : 600),
  );
  assert.deepEqual(totals, { subtotal: 4800, shipping: 300, total: 5100 });
});

test("free-shipping threshold removes delivery cost after order edits", () => {
  const totals = calculateOrderTotals(
    [{ unitPrice: 5000, quantity: 2 }],
    "31 - وهران",
    false,
    10000,
    () => 600,
  );
  assert.deepEqual(totals, { subtotal: 10000, shipping: 0, total: 10000 });
});

test("editing shipping preserves legacy bundle pricing instead of multiplying it by quantity", () => {
  const totals = calculateOrderTotals(
    [{ unitPrice: 3600, quantity: 2 }],
    "16 - الجزائر",
    false,
    10000,
    () => 600,
    3600,
  );
  assert.deepEqual(totals, { subtotal: 3600, shipping: 600, total: 4200 });
});

test("dispatched orders cannot be edited", () => {
  assert.equal(canEditOrder(), true);
  assert.equal(canEditOrder("TRK-1"), false);
  assert.equal(canEditOrder(undefined, "2025-01-01T00:00:00Z"), false);
});
