"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BlockedTarget, OrdersFraudSettings, SharedStoreSettings, StoreSettings, WilayaDeliveryPrice } from "@/types/settings";
import type { ProductShippingConfig } from "@/types";
import { DEFAULT_STORE_SETTINGS } from "@/lib/default-settings";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/configured";
import * as db from "@/lib/supabase/data";
import { normalizePixelSettings } from "@/lib/analytics/pixels";
import { mergeStorefrontConfiguration } from "@/lib/settings/storefront";

interface SettingsState {
  settings: StoreSettings;
  updateSettings: (partial: Partial<StoreSettings>) => void;
  updateWilayaPrice: (code: string, updates: Partial<WilayaDeliveryPrice>) => void;
  bulkUpdateWilayas: (updates: { homePrice?: number; deskPrice?: number; enabled?: boolean }) => void;
  updateEcoTrack: (ecotrack: Partial<StoreSettings["ecotrack"]>) => void;
  updateNordEtOuest: (nordEtOuest: Partial<StoreSettings["nordEtOuest"]>) => void;
  updatePixels: (pixels: StoreSettings["pixels"]) => Promise<void>;
  updateFraudProtection: (partial: Partial<OrdersFraudSettings>) => void;
  blockTarget: (target: { type: "ip" | "phone"; value: string; reason?: string }) => void;
  unblockTarget: (id: string) => void;
  refreshPixels: () => Promise<void>;
  refreshSharedSettings: () => Promise<void>;
  saveSharedSettings: () => Promise<void>;
  getShippingFee: (
    wilayaValue: string,
    deliveryType: "home" | "desk",
    productShipping?: ProductShippingConfig | null
  ) => number;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_STORE_SETTINGS,

      updateSettings: (partial) => {
        set((state) => ({
          settings: { ...state.settings, ...partial },
        }));
      },

      updateWilayaPrice: (code, updates) => {
        set((state) => {
          const current = state.settings.wilayaPrices[code];
          if (!current) return state;
          return {
            settings: {
              ...state.settings,
              wilayaPrices: {
                ...state.settings.wilayaPrices,
                [code]: { ...current, ...updates },
              },
            },
          };
        });
      },

      bulkUpdateWilayas: (updates) => {
        set((state) => {
          const newMap = { ...state.settings.wilayaPrices };
          Object.keys(newMap).forEach((code) => {
            newMap[code] = {
              ...newMap[code],
              ...(updates.homePrice !== undefined && { homePrice: updates.homePrice }),
              ...(updates.deskPrice !== undefined && { deskPrice: updates.deskPrice }),
              ...(updates.enabled !== undefined && { enabled: updates.enabled }),
            };
          });
          return {
            settings: {
              ...state.settings,
              wilayaPrices: newMap,
            },
          };
        });
      },

      updateEcoTrack: (ecotrackUpdates) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ecotrack: { ...state.settings.ecotrack, ...ecotrackUpdates },
          },
        }));
      },

      updateNordEtOuest: (nordUpdates) => {
        set((state) => ({
          settings: {
            ...state.settings,
            nordEtOuest: { ...(state.settings.nordEtOuest || DEFAULT_STORE_SETTINGS.nordEtOuest), ...nordUpdates },
          },
        }));
      },

      updatePixels: async (pixelSettings) => {
        const pixels = normalizePixelSettings(pixelSettings);
        const client = isSupabaseConfigured() ? createClient() : null;
        if (client) await db.savePixelSettings(client, pixels);
        set((state) => ({
          settings: { ...state.settings, pixels },
        }));
      },

      refreshPixels: async () => {
        const client = isSupabaseConfigured() ? createClient() : null;
        if (!client) return;
        const pixels = normalizePixelSettings(await db.fetchPixelSettings(client));
        set((state) => ({
          settings: { ...state.settings, pixels },
        }));
      },

      updateFraudProtection: (partial) => {
        set((state) => ({
          settings: {
            ...state.settings,
            fraudProtection: {
              ...(state.settings.fraudProtection || DEFAULT_STORE_SETTINGS.fraudProtection!),
              ...partial,
            },
          },
        }));
      },

      blockTarget: ({ type, value, reason }) => {
        set((state) => {
          const current = state.settings.fraudProtection || DEFAULT_STORE_SETTINGS.fraudProtection!;
          const cleanedVal = value.trim();
          if (!cleanedVal) return state;
          if (current.blockedTargets.some((t) => t.value === cleanedVal && t.type === type)) {
            return state;
          }
          const newTarget: BlockedTarget = {
            id: `blk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            type,
            value: cleanedVal,
            reason: reason || "حظر يدوي بواسطة المسؤول",
            blockedAt: new Date().toISOString(),
          };
          return {
            settings: {
              ...state.settings,
              fraudProtection: {
                ...current,
                blockedTargets: [newTarget, ...current.blockedTargets],
              },
            },
          };
        });
      },

      unblockTarget: (id) => {
        set((state) => {
          const current = state.settings.fraudProtection || DEFAULT_STORE_SETTINGS.fraudProtection!;
          return {
            settings: {
              ...state.settings,
              fraudProtection: {
                ...current,
                blockedTargets: current.blockedTargets.filter((t) => t.id !== id),
              },
            },
          };
        });
      },

      refreshSharedSettings: async () => {
        const client = isSupabaseConfigured() ? createClient() : null;
        if (!client) return;
        const shared = await db.fetchSharedStoreSettings(client);
        if (!shared) return;
        set((state) => ({
          settings: {
            ...state.settings,
            ...shared,
            ecotrack: state.settings.ecotrack,
            nordEtOuest: state.settings.nordEtOuest,
            pixels: state.settings.pixels,
            storefront: mergeStorefrontConfiguration(shared.storefront),
            fraudProtection: shared.fraudProtection || state.settings.fraudProtection || DEFAULT_STORE_SETTINGS.fraudProtection,
          },
        }));
      },

      saveSharedSettings: async () => {
        const client = isSupabaseConfigured() ? createClient() : null;
        if (!client) return;
        const current = get().settings;
        const shared: SharedStoreSettings = {
          shippingType: current.shippingType,
          defaultHomePrice: current.defaultHomePrice,
          defaultDeskPrice: current.defaultDeskPrice,
          freeShippingThreshold: current.freeShippingThreshold,
          wilayaPrices: current.wilayaPrices,
          storefront: current.storefront,
          fraudProtection: current.fraudProtection,
        };
        await db.saveSharedStoreSettings(client, shared);
      },

      getShippingFee: (
        wilayaValue: string,
        deliveryType: "home" | "desk",
        productShipping?: ProductShippingConfig | null
      ) => {
        const { settings } = get();

        // 1. Product-level shipping configuration
        if (productShipping) {
          if (productShipping.type === "free") return 0;
          if (productShipping.type === "fixed") {
            const fixedHome = productShipping.fixedHomePrice ?? settings.defaultHomePrice;
            const fixedDesk = productShipping.fixedDeskPrice ?? settings.defaultDeskPrice;
            return deliveryType === "home" ? fixedHome : fixedDesk;
          }
          if (productShipping.type === "custom" && productShipping.wilayaPrices) {
            const matchedKey = Object.keys(settings.wilayaPrices).find((code) => {
              const w = settings.wilayaPrices[code];
              return (
                wilayaValue.includes(w.code) ||
                wilayaValue.includes(w.nameAr) ||
                wilayaValue.toLowerCase().includes(w.nameFr.toLowerCase())
              );
            });
            if (matchedKey && productShipping.wilayaPrices[matchedKey]) {
              const customW = productShipping.wilayaPrices[matchedKey];
              const price = deliveryType === "home" ? customW.home : customW.desk;
              if (price !== undefined) return price;
            }
          }
        }

        // 2. Store-wide shipping configuration
        if (settings.shippingType === "free") return 0;
        if (settings.shippingType === "fixed") {
          return deliveryType === "home" ? settings.defaultHomePrice : settings.defaultDeskPrice;
        }

        // البحث عن الولاية بالكود أو الاسم
        const prices = settings.wilayaPrices;
        const matched = Object.values(prices).find(
          (w) =>
            wilayaValue.includes(w.code) ||
            wilayaValue.includes(w.nameAr) ||
            wilayaValue.toLowerCase().includes(w.nameFr.toLowerCase())
        );

        if (!matched) {
          return deliveryType === "home" ? settings.defaultHomePrice : settings.defaultDeskPrice;
        }

        return deliveryType === "home" ? matched.homePrice : matched.deskPrice;
      },
    }),
    {
      name: "velora_store_settings_v1",
      version: 4,
      migrate: (persistedState) => {
        const persisted = persistedState as Partial<SettingsState> | undefined;
        const persistedSettings = persisted?.settings;
        const ecotrack = {
          ...DEFAULT_STORE_SETTINGS.ecotrack,
          ...persistedSettings?.ecotrack,
        };
        if (ecotrack.baseUrl === "https://api.ecotrack.dz/api/v1") {
          ecotrack.baseUrl = "";
        }
        return {
          ...persisted,
          settings: {
            ...DEFAULT_STORE_SETTINGS,
            ...persistedSettings,
            ecotrack,
            pixels: persistedSettings?.pixels ?? DEFAULT_STORE_SETTINGS.pixels,
            storefront: mergeStorefrontConfiguration(persistedSettings?.storefront),
          },
        } as SettingsState;
      },
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<SettingsState> | undefined;
        return {
          ...currentState,
          ...persisted,
          settings: {
            ...DEFAULT_STORE_SETTINGS,
            ...persisted?.settings,
            storefront: mergeStorefrontConfiguration(persisted?.settings?.storefront),
            pixels: persisted?.settings?.pixels ?? DEFAULT_STORE_SETTINGS.pixels,
          },
        };
      },
    }
  )
);
