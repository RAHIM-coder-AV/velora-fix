import { NextResponse } from "next/server";

interface TestConnectionRequest {
  company?: string;
  token?: string;
  baseUrl?: string;
}

function getEcoTrackValidationUrl(baseUrl: string) {
  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    return null;
  }

  if (
    url.protocol !== "https:" ||
    !url.hostname.endsWith(".ecotrack.dz") ||
    url.hostname === "api.ecotrack.dz" ||
    url.username ||
    url.password ||
    url.port ||
    url.search ||
    url.hash
  ) {
    return null;
  }

  const path = url.pathname.replace(/\/+$/, "");
  const apiPath = path.endsWith("/api/v1") ? path : `${path}/api/v1`;
  return `${url.origin}${apiPath}/validate/token`;
}

export async function POST(request: Request) {
  let body: TestConnectionRequest;
  try {
    body = (await request.json()) as TestConnectionRequest;
  } catch {
    return NextResponse.json(
      { success: false, error: "بيانات الاختبار غير صالحة." },
      { status: 400 },
    );
  }

  if (body.company !== "ecotrack") {
    return NextResponse.json(
      { success: false, error: "هذا الفحص مخصص لربط EcoTrack." },
      { status: 400 },
    );
  }

  const token = typeof body.token === "string" ? body.token.trim() : "";
  if (!token || token.startsWith("demo_") || token.length < 10) {
    return NextResponse.json(
      { success: false, error: "أدخل رمز API حقيقيًا من حساب شركة التوصيل." },
      { status: 400 },
    );
  }

  const validationUrl = getEcoTrackValidationUrl(
    typeof body.baseUrl === "string" ? body.baseUrl.trim() : "",
  );
  if (!validationUrl) {
    return NextResponse.json(
      {
        success: false,
        error:
          "أدخل رابط نطاق شركة التوصيل المرتبطة بمنصة EcoTrack، مثل https://dhd.ecotrack.dz/api/v1؛ الرابط api.ecotrack.dz ليس نطاق الشركة.",
      },
      { status: 400 },
    );
  }

  const url = new URL(validationUrl);
  url.searchParams.set("api_token", token);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    const data: unknown = await response.json().catch(() => null);
    const result =
      data && typeof data === "object"
        ? (data as Record<string, unknown>)
        : {};
    const message =
      typeof result.message === "string" ? result.message : "";

    if (response.ok && result.success === true && message === "VALID_TOKEN") {
      return NextResponse.json({
        success: true,
        message: "تم التحقق من الاتصال وصلاحية رمز EcoTrack.",
      });
    }
    if (message === "INVALID_TOKEN") {
      return NextResponse.json(
        { success: false, error: "رفض EcoTrack الرمز: رمز API غير صالح." },
        { status: 401 },
      );
    }
    if (message === "TOKEN_NOT_ALLOWED") {
      return NextResponse.json(
        {
          success: false,
          error: "الرمز صحيح الصيغة لكن صلاحية API العامة غير مفعّلة لهذا الحساب.",
        },
        { status: 403 },
      );
    }
    if (response.status === 404) {
      return NextResponse.json(
        {
          success: false,
          error:
            "لم يعثر EcoTrack على مسار فحص الرمز لهذا النطاق. تأكد أن الرابط يخص شركة التوصيل نفسها، وليس api.ecotrack.dz.",
        },
        { status: 400 },
      );
    }
    if (response.status === 429) {
      return NextResponse.json(
        { success: false, error: "تم تجاوز حد طلبات EcoTrack؛ انتظر قليلًا ثم أعد الفحص." },
        { status: 429 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: `تعذر التحقق من رمز EcoTrack (HTTP ${response.status}). راجع نطاق الشركة وإعداد API.`,
      },
      { status: 502 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error && error.name === "AbortError"
            ? "انتهت مهلة الاتصال بـ EcoTrack."
            : "تعذر الوصول إلى خادم EcoTrack. تحقق من اتصال الشبكة ونطاق شركة التوصيل.",
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
