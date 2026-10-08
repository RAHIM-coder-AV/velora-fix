import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  let ip = "154.121.96.148"; // Default fallback Algerian IP for local/dev

  if (cfConnectingIp) {
    ip = cfConnectingIp;
  } else if (forwardedFor) {
    ip = forwardedFor.split(",")[0].trim();
  } else if (realIp) {
    ip = realIp;
  }

  return NextResponse.json({ ip });
}
