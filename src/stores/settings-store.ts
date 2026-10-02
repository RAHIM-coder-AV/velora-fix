"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StoreSettings, WilayaDeliveryPrice } from "@/types/settings";
import { DEFAULT_STORE_SETTINGS } from "@/lib/default-settings";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/configured";
import * as db from "@/lib/supabase/data";
import { normalizePixelSettings } from "@/lib/analytics/pixels";

interface SettingsState {
  settings: StoreSettings;
  updateSettings: (partial: Partial<StoreSettings>) => void;
  updateWilayaPrice: (code: string, updates: Partial<WilayaDeliveryPrice>) => void;
  bulkUpdateWilayas: (updates: { homePrice?: number; deskPrice?: number; enabled?: boolean }) => void;
  updateEcoTrack: (ecotrack: Partial<StoreSettings["ecotrack"]>) => void;
  updateNordEtOuest: (nordEtOuest: Partial<StoreSettings["nordEtOuest"]>) => void;
  updatePixels: (pixels: StoreSettings["pixels"]) => Promise<void>;
  refreshPixels: () => Promise<void>;
  getShippingFee: (wilayaValue: string, deliveryType: "home" | "desk") => number;
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

      getShippingFee: (wilayaValue: string, deliveryType: "home" | "desk") => {
        const { settings } = get();
        if (settings.shippingType === "free") return 0;
        if (settings.shippingType === "fixed") {
          return deliveryType === "home" ? settings.defaultHomePrice : settings.defaultDeskPrice;
        }

        // البحث عن الولاية بالكود أو الاسم
        const prices = settings.wilayaPrices;
        let matched = Object.values(prices).find(
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
      version: 2,
      migrate: (persistedState) => {
        const persisted = persistedState as Partial<SettingsState> | undefined;
        return {
          ...persisted,
          settings: {
            ...DEFAULT_STORE_SETTINGS,
            ...persisted?.settings,
            pixels: DEFAULT_STORE_SETTINGS.pixels,
          },
        } as SettingsState;
      },
    }
  )
);
