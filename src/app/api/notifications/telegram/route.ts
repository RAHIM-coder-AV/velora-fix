import { NextResponse } from "next/server";
import type { Order } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, chatId, isTest, order } = body as {
      token?: string;
      chatId?: string;
      isTest?: boolean;
      order?: Order;
    };

    if (!token || !chatId) {
      return NextResponse.json(
        { success: false, error: "Bot Token and Chat ID are required" },
        { status: 400 }
      );
    }

    let text = "";

    if (isTest) {
      text = `🤖 *رسالة تجريبية من متجر VELORA!*\n━━━━━━━━━━━━━━━━━━━━━━\n✅ تم ربط إشعارات التلغرام بنجاح!\nستصلك إشعارات فورية عند قيام أي زبون بطلب جديد.\n\n⏰ *التوقيت:* ${new Date().toLocaleString("ar-DZ")}`;
    } else if (order) {
      const itemsList = order.items
        .map(
          (item) =>
            `• *${item.name?.ar || item.name?.fr || "منتج"}*\n  المقاس: \`${item.size}\` | اللون: \`${typeof item.color === "object" ? item.color.ar || item.color.fr : item.color}\` | الكمية: *${item.quantity}*`
        )
        .join("\n");

      const sourceTag = order.trafficSource
        ? order.trafficSource.toUpperCase()
        : "DIRECT";

      text = `🛍️ *طلب جديد في المتجر!* (#${order.reference})\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 *العميل:* ${order.customerName}\n` +
        `📞 *رقم الهاتف:* \`${order.phone}\`\n` +
        `📍 *الولاية:* ${order.wilaya} — ${order.commune}\n` +
        `🏠 *العنوان:* ${order.address}\n` +
        `\n📦 *تفاصيل المنتجات:*\n${itemsList}\n\n` +
        `💰 *المجموع الكلي:* *${order.total} دج*\n` +
        `🚚 *الشحن:* ${order.shipping} دج ${order.isStopdesk ? "(استلام من المكتب)" : "(توصيل للمنزل)"}\n` +
        `🌐 *المصدر الإعلاني:* #${sourceTag}\n` +
        (order.notes ? `📝 *ملاحظة الزبون:* ${order.notes}\n` : "") +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `⏰ *الوقت:* ${new Date(order.createdAt || Date.now()).toLocaleString("ar-DZ")}`;
    } else {
      return NextResponse.json(
        { success: false, error: "No order data provided" },
        { status: 400 }
      );
    }

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "Markdown",
        }),
      }
    );

    const data = await telegramRes.json();
    if (!telegramRes.ok || !data.ok) {
      return NextResponse.json(
        { success: false, error: data.description || "Failed to send telegram message" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Telegram notification error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
