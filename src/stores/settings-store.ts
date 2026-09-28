"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StoreSettings, WilayaDeliveryPrice } from "@/types/settings";
import { DEFAULT_STORE_SETTINGS } from "@/lib/default-settings";

interface SettingsState {
  settings: StoreSettings;
  updateSettings: (partial: Partial<StoreSettings>) => void;
  updateWilayaPrice: (code: string, updates: Partial<WilayaDeliveryPrice>) => void;
  bulkUpdateWilayas: (updates: { homePrice?: number; deskPrice?: number; enabled?: boolean }) => void;
  updateEcoTrack: (ecotrack: Partial<StoreSettings["ecotrack"]>) => void;
  updatePixels: (pixels: Partial<StoreSettings["pixels"]>) => void;
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

      updatePixels: (pixelUpdates) => {
        set((state) => ({
          settings: {
            ...state.settings,
            pixels: { ...state.settings.pixels, ...pixelUpdates },
          },
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
    }
  )
);
