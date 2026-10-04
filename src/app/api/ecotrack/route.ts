import { NextResponse } from "next/server";
import { POST as dispatchOrders } from "@/app/api/delivery/dispatch/route";

interface EcoTrackOrderPayload {
  token: string;
  baseUrl?: string;
  order: {
    id?: string;
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
  let body: EcoTrackOrderPayload;
  try {
    body = (await request.json()) as EcoTrackOrderPayload;
  } catch {
    return NextResponse.json(
      { success: false, error: "بيانات الطلب غير صالحة." },
      { status: 400 },
    );
  }

  const order = body?.order;
  if (
    !order ||
    !Array.isArray(order.items) ||
    order.items.some((item) => !item || typeof item !== "object")
  ) {
    return NextResponse.json(
      { success: false, error: "بيانات الطلب ناقصة أو غير صالحة." },
      { status: 400 },
    );
  }

  const dispatchResponse = await dispatchOrders(
    new Request(request.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company: "ecotrack",
        token: body.token,
        baseUrl: body.baseUrl || "https://api.ecotrack.dz/api/v1",
        orders: [
          {
            ...order,
            id: order.id || order.reference,
            notes: order.note,
            items: order.items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.price,
            })),
          },
        ],
      }),
    }),
  );
  const resultBody = await dispatchResponse.json();
  const result = resultBody.results?.[0];
  return NextResponse.json(
    {
      success:
        dispatchResponse.ok &&
        result?.success === true &&
        typeof result.trackingCode === "string",
      trackingCode: result?.trackingCode,
      error: result?.error || resultBody.error,
      data: result,
    },
    { status: dispatchResponse.status },
  );
}
