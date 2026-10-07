import type { Order, OrderStatus } from "@/types";
import type { TelegramNotificationSettings, WhatsAppNotificationSettings } from "@/types/settings";

/**
 * Formats Algerian phone numbers into international WhatsApp format (+213...)
 */
export function formatAlgerianWhatsAppPhone(phone: string): string {
  const clean = phone.replace(/[\s\-_]/g, "");
  if (clean.startsWith("0")) {
    return `213${clean.slice(1)}`;
  }
  if (clean.startsWith("+213")) {
    return clean.slice(1);
  }
  if (clean.startsWith("213")) {
    return clean;
  }
  return `213${clean}`;
}

/**
 * Builds formatted WhatsApp messages for different stages of the order lifecycle
 */
export function getWhatsAppMessage(
  order: Order,
  type: "received" | "confirmed" | "shipped" | "arrived" | "no_answer"
): string {
  const itemsText = order.items
    .map(
      (item) =>
        `${item.name?.ar || item.name?.fr || "منتج"} (${item.size} - ${typeof item.color === "object" ? item.color.ar || item.color.fr : item.color}) × ${item.quantity}`
    )
    .join("، ");

  switch (type) {
    case "received":
      return `مرحباً بك أستاذ(ة) ${order.customerName} 👋\n\nنشكرك على طلبك من متجر VELORA! ❤️\n\nتم تسجيل طلبك بنجاح:\n🔢 رقم الطلب: #${order.reference}\n📦 المنتج: ${itemsText}\n💰 الإجمالي: ${order.total} دج (الدفع عند الاستلام)\n📍 التوصيل إلى: ${order.wilaya} — ${order.commune}\n\n📞 سنتصل بك قريباً لتأكيد موعد الإرسال. يرجى إبقاء الهاتف مفتوحاً.`;

    case "confirmed":
      return `مرحباً ${order.customerName} ✅\n\nتم تأكيد طلبك رقم #${order.reference} بنجاح!\nيجري الآن تجهيز طردك لإرساله مع شركة التوصيل.\n💰 المبلغ المستحق عند الاستلام: ${order.total} دج.\nشكراً لاختيارك متجرنا!`;

    case "shipped":
      return `مرحباً ${order.customerName} 🚚\n\nطلبك رقم #${order.reference} في الطريق إليك الآن!\n${order.trackingCode ? `📦 كود التتبع: ${order.trackingCode}\n` : ""}📍 الوجهة: ${order.wilaya} — ${order.commune}\n💰 المبلغ: ${order.total} دج\n\nسيتصل بك موزع التوصيل خلال 24-48 ساعة لتسليمك الطرد. يرجى إبقاء هاتفك متاحاً.`;

    case "arrived":
      return `مرحباً ${order.customerName} 📦\n\nطردك رقم #${order.reference} وصل إلى ولايتك (${order.wilaya}) وهو جاهز للتسليم الآن!\nالموزع سيقوم بالاتصال بك قريباً على الرقم ${order.phone}.\nيرجى تجهيز المبلغ: ${order.total} دج.`;

    case "no_answer":
      return `مرحباً ${order.customerName} ⚠️\n\nحاولنا الاتصال بكم بخصوص طلبكم رقم #${order.reference} ولكن لم نتمكن من الوصول إليكم.\nيرجى التواصل معنا لتأكيد الطلب أو تحديد الموعد المناسب لإرساله. شكراً لتفهمكم!`;
  }
}

/**
 * Opens WhatsApp chat with customer with a pre-filled message
 */
export function openCustomerWhatsApp(
  order: Order,
  type: "received" | "confirmed" | "shipped" | "arrived" | "no_answer"
) {
  if (typeof window === "undefined") return;
  const phone = formatAlgerianWhatsAppPhone(order.phone);
  const text = encodeURIComponent(getWhatsAppMessage(order, type));
  window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
}

/**
 * Sends order notification to Telegram Bot if configured
 */
export async function sendTelegramOrderNotification(
  order: Order,
  settings?: TelegramNotificationSettings
): Promise<boolean> {
  if (!settings?.enabled || !settings.botToken || !settings.chatId) {
    return false;
  }

  try {
    const res = await fetch("/api/notifications/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: settings.botToken,
        chatId: settings.chatId,
        order,
      }),
    });
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error("Failed to notify Telegram:", err);
    return false;
  }
}
