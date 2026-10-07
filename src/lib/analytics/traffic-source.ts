import type { TrafficSource } from "@/types";

const SOURCE_STORAGE_KEY = "velora_traffic_source";
const CAMPAIGN_STORAGE_KEY = "velora_utm_campaign";

/**
 * Normalizes any referrer or URL query parameter into a standard platform identifier:
 * "meta" | "tiktok" | "snapchat" | "google" | "direct"
 */
export function normalizeTrafficSource(raw?: string | null): TrafficSource {
  if (!raw) return "direct";
  const s = raw.toLowerCase().trim();

  if (s.includes("tiktok") || s.includes("tt") || s === "bytedance") {
    return "tiktok";
  }
  if (
    s.includes("facebook") ||
    s.includes("instagram") ||
    s.includes("meta") ||
    s.includes("fb") ||
    s.includes("ig") ||
    s.includes("threads")
  ) {
    return "meta";
  }
  if (s.includes("snap") || s.includes("snapchat") || s.includes("sc")) {
    return "snapchat";
  }
  if (s.includes("google") || s.includes("gads") || s.includes("adwords") || s.includes("youtube")) {
    return "google";
  }
  return s || "direct";
}

/**
 * Detects traffic source from window.location and document.referrer
 */
export function detectTrafficSource(): { source: TrafficSource; campaign?: string } {
  if (typeof window === "undefined") {
    return { source: "direct" };
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get("utm_source");
    const utmCampaign = urlParams.get("utm_campaign") || undefined;
    const fbclid = urlParams.get("fbclid");
    const ttclid = urlParams.get("ttclid");
    const sclid = urlParams.get("sclid") || urlParams.get("sc_clickid");
    const gclid = urlParams.get("gclid") || urlParams.get("wbraid") || urlParams.get("gbraid");

    // 1. Explicit Click IDs
    if (fbclid) return { source: "meta", campaign: utmCampaign };
    if (ttclid) return { source: "tiktok", campaign: utmCampaign };
    if (sclid) return { source: "snapchat", campaign: utmCampaign };
    if (gclid) return { source: "google", campaign: utmCampaign };

    // 2. UTM Source Parameter
    if (utmSource) {
      return { source: normalizeTrafficSource(utmSource), campaign: utmCampaign };
    }

    // 3. Document Referrer
    const referrer = document.referrer ? document.referrer.toLowerCase() : "";
    if (referrer) {
      if (referrer.includes("facebook.com") || referrer.includes("instagram.com") || referrer.includes("meta.com") || referrer.includes("l.facebook.com")) {
        return { source: "meta", campaign: utmCampaign };
      }
      if (referrer.includes("tiktok.com") || referrer.includes("musical.ly")) {
        return { source: "tiktok", campaign: utmCampaign };
      }
      if (referrer.includes("snapchat.com")) {
        return { source: "snapchat", campaign: utmCampaign };
      }
      if (referrer.includes("google.")) {
        return { source: "google", campaign: utmCampaign };
      }
    }
  } catch (e) {
    console.warn("Traffic source detection error:", e);
  }

  return { source: "direct" };
}

/**
 * Saves detected traffic source in sessionStorage on landing
 */
export function captureTrafficSource(): TrafficSource {
  if (typeof window === "undefined") return "direct";
  try {
    const detected = detectTrafficSource();
    const existing = sessionStorage.getItem(SOURCE_STORAGE_KEY);

    // If new specific ad source detected, update it
    if (detected.source !== "direct") {
      sessionStorage.setItem(SOURCE_STORAGE_KEY, detected.source);
      if (detected.campaign) {
        sessionStorage.setItem(CAMPAIGN_STORAGE_KEY, detected.campaign);
      }
      return detected.source;
    }

    // Otherwise use existing attribution
    if (existing) {
      return normalizeTrafficSource(existing);
    }
  } catch {
    // Ignore storage issues
  }
  return "direct";
}

/**
 * Gets currently attributed traffic source for order creation
 */
export function getAttributedTrafficSource(): { source: TrafficSource; campaign?: string } {
  if (typeof window === "undefined") return { source: "direct" };
  try {
    const live = detectTrafficSource();
    if (live.source !== "direct") return live;

    const stored = sessionStorage.getItem(SOURCE_STORAGE_KEY);
    const storedCampaign = sessionStorage.getItem(CAMPAIGN_STORAGE_KEY) || undefined;
    if (stored) {
      return { source: normalizeTrafficSource(stored), campaign: storedCampaign };
    }
  } catch {
    // Ignore
  }
  return { source: "direct" };
}
