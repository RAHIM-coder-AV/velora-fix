"use client";

import { create } from "zustand";
import {
  createDefaultHomepageContent,
  isHomepageContent,
  type HomepageContent,
} from "@/lib/homepage/content";
import {
  fetchHomepageContent,
  getHomepageSupabaseClient,
  persistHomepageContent,
} from "@/lib/homepage/persistence";

const STORAGE_KEY = "velora-homepage-content";

type HomepageSource = "default" | "local" | "database";

interface HomepageState {
  content: HomepageContent;
  source: HomepageSource;
  loading: boolean;
  saving: boolean;
  error: string | null;
  load: () => Promise<void>;
  save: (content: HomepageContent) => Promise<void>;
}

function readLocalContent(): HomepageContent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isHomepageContent(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function cacheContent(content: HomepageContent): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }
}

export const useHomepageStore = create<HomepageState>((set) => ({
  content: createDefaultHomepageContent(),
  source: "default",
  loading: false,
  saving: false,
  error: null,
  load: async () => {
    set({ loading: true, error: null });
    try {
      const hasRemote = !!getHomepageSupabaseClient();
      if (hasRemote) {
        const remote = await fetchHomepageContent();
        if (remote) {
          cacheContent(remote);
          set({ content: remote, source: "database", loading: false, error: null });
          return;
        }
        set({
          content: createDefaultHomepageContent(),
          source: "default",
          loading: false,
          error: null,
        });
        return;
      }
      const local = readLocalContent();
      set({
        content: local ?? createDefaultHomepageContent(),
        source: local ? "local" : "default",
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Impossible de charger le contenu.",
      });
      throw error;
    }
  },
  save: async (content) => {
    if (!isHomepageContent(content)) throw new Error("Le contenu de la page d'accueil est invalide.");
    set({ saving: true, error: null });
    try {
      if (getHomepageSupabaseClient()) {
        await persistHomepageContent(content);
        cacheContent(content);
        set({ content, source: "database", saving: false, error: null });
      } else {
        cacheContent(content);
        set({ content, source: "local", saving: false, error: null });
      }
    } catch (error) {
      set({
        saving: false,
        error: error instanceof Error ? error.message : "Impossible d'enregistrer le contenu.",
      });
      throw error;
    }
  },
}));
