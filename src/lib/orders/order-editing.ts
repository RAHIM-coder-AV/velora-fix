import type { OrderItem } from "@/types";

export function calculateOrderTotals(
  items: Pick<OrderItem, "unitPrice" | "quantity">[],
  wilaya: string,
  isStopdesk: boolean,
  freeShippingThreshold: number,
  getShippingFee: (wilaya: string, deliveryType: "home" | "desk") => number,
  preservedSubtotal?: number,
) {
  const subtotal =
    preservedSubtotal ?? items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping =
    subtotal >= freeShippingThreshold
      ? 0
      : getShippingFee(wilaya, isStopdesk ? "desk" : "home");
  return { subtotal, shipping, total: subtotal + shipping };
}

export function canEditOrder(trackingCode?: string, dispatchedAt?: string) {
  return !trackingCode && !dispatchedAt;
}
