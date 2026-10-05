import { NextResponse } from "next/server";

interface OrderItemPayload {
  name: string | { ar?: string; fr?: string };
  quantity: number;
  unitPrice?: number;
}

interface OrderPayload {
  id: string;
  reference: string;
  customerName: string;
  phone: string;
  phone2?: string;
  wilaya: string;
  commune: string;
  address: string;
  total: number;
  shipping: number;
  isStopdesk?: boolean;
  notes?: string;
  items: OrderItemPayload[];
}

interface DispatchRequest {
  company: "ecotrack" | "nord_ouest" | string;
  token?: string;
  baseUrl?: string;
  orders: OrderPayload[];
}

interface DispatchResult {
  orderId: string;
  reference: string;
  success: boolean;
  deliveryCompany: string;
  companyName: string;
  trackingCode?: string;
  labelUrl?: string;
  dispatchedAt?: string;
  error?: string;
}

function getProviderConfig(company: string, baseUrl: string) {
  const suffix =
    company === "ecotrack" ? ".ecotrack.dz" : ".nordetouest.com";
  const root = company === "ecotrack" ? "ecotrack.dz" : "nordetouest.com";

  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    return null;
  }

  if (
    url.protocol !== "https:" ||
    (company === "ecotrack"
      ? !url.hostname.endsWith(suffix) || url.hostname === "api.ecotrack.dz"
      : url.hostname !== root && !url.hostname.endsWith(suffix)) ||
    url.username ||
    url.password ||
    url.port ||
    url.search ||
    url.hash
  ) {
    return null;
  }

  const path = url.pathname.replace(/\/+$/, "");
  const apiPath =
    company === "ecotrack" && !path.endsWith("/api/v1")
      ? `${path}/api/v1`
      : path;
  return {
    companyName: company === "ecotrack" ? "EcoTrack" : "Nord Et Ouest",
    endpoint: `${url.origin}${apiPath}/create/order`,
  };
}

function errorMessageFrom(data: unknown, token: string) {
  if (!data || typeof data !== "object") return "";
  const record = data as Record<string, unknown>;
  const nested = record.data && typeof record.data === "object"
    ? (record.data as Record<string, unknown>)
    : undefined;
  const errors =
    record.errors && typeof record.errors === "object"
      ? (record.errors as Record<string, unknown>)
      : nested?.errors && typeof nested.errors === "object"
        ? (nested.errors as Record<string, unknown>)
        : undefined;
  const firstErrors = errors ? Object.values(errors)[0] : undefined;
  const validationMessage = Array.isArray(firstErrors)
    ? firstErrors.find((item): item is string => typeof item === "string")
    : undefined;
  const raw =
    record.error ??
    nested?.error ??
    record.message ??
    nested?.message ??
    validationMessage;
  if (typeof raw !== "string") return "";
  return raw.replaceAll(token, "[redacted]").slice(0, 300);
}

function hasProviderError(data: unknown) {
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : undefined;
  return (
    record.success === false ||
    nested?.success === false ||
    Boolean(record.error || nested?.error)
  );
}

function providerTrackingCode(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const record = data as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : undefined;
  const value =
    record.tracking_code ??
    record.trackingCode ??
    record.tracking_number ??
    record.tracking ??
    nested?.tracking_code ??
    nested?.trackingCode ??
    nested?.tracking_number ??
    nested?.tracking;
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function providerLabelUrl(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const record = data as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : undefined;
  const value = record.label_url ?? record.label ?? nested?.label_url ?? nested?.label;
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function validOrder(order: OrderPayload) {
  return (
    typeof order?.id === "string" &&
    Boolean(order.id.trim()) &&
    typeof order.reference === "string" &&
    Boolean(order.reference.trim()) &&
    typeof order.customerName === "string" &&
    Boolean(order.customerName.trim()) &&
    typeof order.phone === "string" &&
    Boolean(order.phone.trim()) &&
    typeof order.wilaya === "string" &&
    typeof order.commune === "string" &&
    typeof order.address === "string" &&
    Number.isFinite(order.total) &&
    Number.isFinite(order.shipping) &&
    Array.isArray(order.items) &&
    order.items.length > 0 &&
    order.items.every(
      (item) =>
        Boolean(item) &&
        typeof item.quantity === "number" &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0,
    )
  );
}

export async function POST(request: Request) {
  let body: DispatchRequest;
  try {
    body = (await request.json()) as DispatchRequest;
  } catch {
    return NextResponse.json(
      { success: false, error: "بيانات الطلب غير صالحة." },
      { status: 400 },
    );
  }

  const { company, token, baseUrl, orders } = body ?? {};
  const apiToken = typeof token === "string" ? token.trim() : "";
  if (company !== "ecotrack" && company !== "nord_ouest") {
    return NextResponse.json(
      { success: false, error: "شركة التوصيل المحددة غير مدعومة." },
      { status: 400 },
    );
  }
  if (
    !apiToken ||
    apiToken.startsWith("demo_") ||
    apiToken === "your_api_token" ||
    apiToken.length < 10
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "رمز API غير مضبوط. أدخل رمزًا حقيقيًا من لوحة شركة التوصيل واحفظ الإعدادات.",
      },
      { status: 400 },
    );
  }
  if (typeof baseUrl !== "string") {
    return NextResponse.json(
      { success: false, error: "رابط API الخاص بشركة التوصيل غير مضبوط." },
      { status: 400 },
    );
  }

  const provider = getProviderConfig(company, baseUrl.trim());
  if (!provider) {
    return NextResponse.json(
      {
        success: false,
        error: "رابط API غير صالح أو لا يطابق نطاق شركة التوصيل المحددة.",
      },
      { status: 400 },
    );
  }
  if (!Array.isArray(orders) || orders.length === 0 || orders.length > 50) {
    return NextResponse.json(
      { success: false, error: "اختر من طلب واحد إلى 50 طلبًا صالحًا للرفع." },
      { status: 400 },
    );
  }

  const results: DispatchResult[] = [];
  for (const order of orders) {
    if (!validOrder(order)) {
      results.push({
        orderId: typeof order?.id === "string" ? order.id : "",
        reference: typeof order?.reference === "string" ? order.reference : "",
        success: false,
        deliveryCompany: company,
        companyName: provider.companyName,
        error: "بيانات الطلب ناقصة أو غير صالحة.",
      });
      continue;
    }

    const cleanPhone = order.phone.replace(/\D/g, "");
    const wilayaCode = Number(order.wilaya.match(/^\s*(\d{1,2})\s*[-–]/)?.[1]);
    if (company === "ecotrack" && (!Number.isInteger(wilayaCode) || wilayaCode < 1 || wilayaCode > 58)) {
      results.push({
        orderId: order.id,
        reference: order.reference,
        success: false,
        deliveryCompany: company,
        companyName: provider.companyName,
        error: "تعذر تحديد رقم الولاية. حدّث بيانات الطلب لتتضمن رمز الولاية مثل 16 - الجزائر.",
      });
      continue;
    }
    const itemsList = order.items
      .map((item) => {
        const title =
          typeof item.name === "string"
            ? item.name
            : item.name?.ar || item.name?.fr || "منتج";
        return `${title} (x${item.quantity})`;
      })
      .join(", ");
    const wilayaClean = order.wilaya.replace(/^\d+\s*[-–]\s*/, "").trim();
    const payload =
      company === "nord_ouest"
        ? {
            tracking: order.reference,
            client: order.customerName,
            phone: cleanPhone,
            phone2: order.phone2 || "",
            wilaya: wilayaClean || order.wilaya,
            commune: order.commune || wilayaClean,
            adresse: order.address || order.commune,
            total: order.total,
            stopdesk: order.isStopdesk ? 1 : 0,
            produit: itemsList,
            remarque: order.notes || "طلب متجر Velora",
          }
        : {
            reference: order.reference,
            nom_client: order.customerName,
            telephone: cleanPhone,
            telephone_2: order.phone2?.replace(/\D/g, "") || "",
            adresse: order.address || order.commune,
            commune: order.commune || wilayaClean,
            code_wilaya: wilayaCode,
            montant: order.total,
            remarque: order.notes || "طلب متجر Velora",
            produit: itemsList,
            stock: 0,
            type: 1,
            stop_desk: order.isStopdesk ? 1 : 0,
          };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
      const endpoint = new URL(provider.endpoint);
      const headers: Record<string, string> = {
        Accept: "application/json",
        Authorization: `Bearer ${apiToken}`,
      };
      let requestBody: string | undefined;
      if (company === "ecotrack") {
        for (const [key, value] of Object.entries(payload)) {
          endpoint.searchParams.set(key, String(value));
        }
      } else {
        headers["Content-Type"] = "application/json";
        requestBody = JSON.stringify(payload);
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: requestBody,
        signal: controller.signal,
      });
      const data: unknown = await response.json().catch(() => null);
      const trackingCode = providerTrackingCode(data);
      const explicitFailure = hasProviderError(data);

      if (
        response.ok &&
        !explicitFailure &&
        data &&
        typeof data === "object" &&
        (data as Record<string, unknown>).success === true &&
        trackingCode
      ) {
        results.push({
          orderId: order.id,
          reference: order.reference,
          success: true,
          trackingCode,
          deliveryCompany: company,
          companyName: provider.companyName,
          dispatchedAt: new Date().toISOString(),
          labelUrl: providerLabelUrl(data),
        });
      } else {
        results.push({
          orderId: order.id,
          reference: order.reference,
          success: false,
          deliveryCompany: company,
          companyName: provider.companyName,
          error:
            (explicitFailure || !response.ok
              ? errorMessageFrom(data, apiToken)
              : "") ||
            (!response.ok
              ? `رفض خادم ${provider.companyName} الطلب (HTTP ${response.status}).`
              : "لم يؤكد مزود الخدمة إنشاء الشحنة أو لم يُرجع رقم تتبع."),
        });
      }
    } catch (error) {
      results.push({
        orderId: order.id,
        reference: order.reference,
        success: false,
        deliveryCompany: company,
        companyName: provider.companyName,
        error:
          error instanceof Error && error.name === "AbortError"
            ? `انتهت مهلة الاتصال بخادم ${provider.companyName}.`
            : `تعذر الاتصال بخادم ${provider.companyName}. تحقق من الشبكة وإعدادات API.`,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  const successCount = results.filter((result) => result.success).length;
  return NextResponse.json({
    success: successCount === orders.length,
    company,
    companyName: provider.companyName,
    total: orders.length,
    successCount,
    results,
  });
}
