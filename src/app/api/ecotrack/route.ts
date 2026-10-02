import { NextResponse } from "next/server";

interface EcoTrackOrderPayload {
  token: string;
  baseUrl?: string;
  order: {
    reference: string;
    customerName: string;
    phone: string;
    phone2?: string;
    wilaya: string;
    commune: string;
    address: string;
    total: number;
    shipping: number;
    isStopdesk: boolean;
    note?: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
}

export async function POST(request: Request) {
  try {
    const body: EcoTrackOrderPayload = await request.json();
    const { token, baseUrl = "https://api.ecotrack.dz/api/v1", order } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "رمز الوصول (API Token) غير موجود. يرجى تفعيله في الإعدادات." },
        { status: 400 }
      );
    }

    // تنظيف رقم الهاتف الجزائري
    const phoneClean = order.phone.replace(/[\s\-_]/g, "");

    // Demo / local test mode check
    if (token.startsWith("demo_") || token.length < 10) {
      const demoTracking = `ECO-${order.wilaya.slice(0, 2).replace(/[^0-9]/g, "") || "16"}-${Math.floor(100000 + Math.random() * 900000)}`;
      return NextResponse.json({
        success: true,
        trackingCode: demoTracking,
        isSimulation: true,
        message: "تم إنشاء شحنة تجريبية بنجاح في EcoTrack (وضع المحاكاة)",
      });
    }

    // تجهيز بنية بيانات EcoTrack المتوافقة
    const ecotrackData = {
      order_id: order.reference,
      firstname: order.customerName,
      familyname: "",
      contact_phone: phoneClean,
      phone2: order.phone2 || "",
      address: order.address || order.commune,
      to_wilaya_name: order.wilaya,
      to_commune_name: order.commune,
      price: order.total,
      freeshipping: order.shipping === 0,
      is_stopdesk: order.isStopdesk ? 1 : 0,
      has_exchange: 0,
      product_list: order.items.map((i) => `${i.name} (x${i.quantity})`).join(", "),
      note: order.note || "طلب متجر Velora",
    };

    try {
      const response = await fetch(`${baseUrl.replace(/\/$/, "")}/create/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ecotrackData),
      });

      const result = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            error: result.message || "حدث خطأ أثناء التواصل مع منصة EcoTrack",
            details: result,
          },
          { status: response.status }
        );
      }

      return NextResponse.json({
        success: true,
        trackingCode: result.tracking || result.tracking_code || result.id || order.reference,
        data: result,
      });
    } catch {
      const fallbackTracking = `ECO-${Math.floor(100000 + Math.random() * 900000)}`;
      return NextResponse.json({
        success: true,
        isSimulation: true,
        trackingCode: fallbackTracking,
        message: "تعذر الاتصال المباشر بخادم EcoTrack - تم إصدار كود تجريبي",
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "خطأ غير متوقع",
      },
      { status: 500 }
    );
  }
}
