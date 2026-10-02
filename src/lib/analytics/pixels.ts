import type { PixelSettings } from "@/types/settings";

const META_PIXEL_ID = /^\d{5,20}$/;
const TIKTOK_PIXEL_ID = /^[A-Za-z0-9_-]{10,64}$/;

export function isValidMetaPixelId(value: string): boolean {
  return value.trim() === "" || META_PIXEL_ID.test(value.trim());
}

export function isValidTikTokPixelId(value: string): boolean {
  return value.trim() === "" || TIKTOK_PIXEL_ID.test(value.trim());
}

function normalizeIds(value: unknown, count: number, pattern: RegExp): string[] {
  const values = Array.isArray(value) ? value : [];
  return Array.from({ length: count }, (_, index) => {
    const id = typeof values[index] === "string" ? values[index].trim() : "";
    return pattern.test(id) ? id : "";
  });
}

function normalizeEnabled(value: unknown, count: number): boolean[] {
  const values = Array.isArray(value) ? value : [];
  return Array.from({ length: count }, (_, index) => values[index] === true);
}

export function normalizePixelSettings(value: unknown): PixelSettings {
  const settings = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    metaPixelIds: normalizeIds(settings.metaPixelIds, 6, META_PIXEL_ID),
    metaPixelEnabled: normalizeEnabled(settings.metaPixelEnabled, 6),
    tiktokPixelIds: normalizeIds(settings.tiktokPixelIds, 4, TIKTOK_PIXEL_ID),
    tiktokPixelEnabled: normalizeEnabled(settings.tiktokPixelEnabled, 4),
  };
}

export function enabledMetaPixelIds(settings: PixelSettings): string[] {
  const normalized = normalizePixelSettings(settings);
  return normalized.metaPixelIds.filter((id, index) => id && normalized.metaPixelEnabled[index]);
}

export function enabledTikTokPixelIds(settings: PixelSettings): string[] {
  const normalized = normalizePixelSettings(settings);
  return normalized.tiktokPixelIds.filter((id, index) => id && normalized.tiktokPixelEnabled[index]);
}
