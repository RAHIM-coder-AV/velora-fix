import assert from "node:assert/strict";
import { test } from "node:test";
import { isUndeliveredOrder } from "@/lib/orders/abandoned";

test("only placed orders still in the fulfilment lifecycle appear as undelivered", () => {
  for (const status of ["pending", "pending_confirmation", "confirmed", "processing", "shipped"] as const) {
    assert.equal(isUndeliveredOrder(status), true, status);
  }
  for (const status of ["delivered", "cancelled", "customer_cancelled", "fake", "duplicate", "returned"] as const) {
    assert.equal(isUndeliveredOrder(status), false, status);
  }
});
