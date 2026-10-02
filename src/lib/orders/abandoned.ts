import type { OrderStatus } from "@/types";

const CLOSED_ORDER_STATUSES = new Set([
  "delivered",
  "cancelled",
  "customer_cancelled",
  "fake",
  "duplicate",
  "returned",
]);

export function isUndeliveredOrder(status: OrderStatus): boolean {
  return !CLOSED_ORDER_STATUSES.has(status);
}
