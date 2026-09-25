"use client";

import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/configured";
import { fetchProfile } from "@/lib/supabase/data";
import type { Profile } from "@/types";

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

interface AuthState {
  user: Profile | null;
  ready: boolean;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<string | null>;
  register: (data: RegisterData) => Promise<string | null>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
  updateEmail: (newEmail: string) => Promise<string | null>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<string | null>;
}

let started = false;

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  ready: false,
  init: async () => {
    if (started) return;
    started = true;
    if (!isSupabaseConfigured()) {
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem("velora-demo-user");
          if (saved) set({ user: JSON.parse(saved) as Profile });
        } catch {
          // ignore
        }
      }
      set({ ready: true });
      return;
    }
    const sb = createClient();
    if (!sb) {
      set({ ready: true });
      return;
    }
    const load = async () => {
      const {
        data: { user },
      } = await sb.auth.getUser();
      if (!user) {
        set({ user: null });
        return;
      }
      const profile = await fetchProfile(sb, user.id);
      set({
        user: profile ?? {
          id: user.id,
          email: user.email ?? "",
          fullName: (user.user_metadata?.full_name as string) ?? "",
          role: "customer",
          createdAt: user.created_at,
        },
      });
    };
    await load();
    sb.auth.onAuthStateChange(() => {
      void load();
    });
    set({ ready: true });
  },
  login: async (email, password) => {
    const sb = createClient();
    if (!sb) {
      // الوضع التجريبي (بدون Supabase): تسجيل دخول مباشر كمدير
      const demoUser: Profile = {
        id: "demo-admin",
        email,
        fullName: email.split("@")[0] || "Administrateur",
        role: "admin",
        createdAt: new Date().toISOString(),
      };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("velora-demo-user", JSON.stringify(demoUser));
        } catch {
          // ignore
        }
      }
      set({ user: demoUser });
      return null;
    }
    const { error } = await sb.auth.signInWithPassword({ email, password });
    return error ? "error" : null;
  },
  register: async ({ email, password, fullName, phone }) => {
    const sb = createClient();
    if (!sb) {
      // الوضع التجريبي (بدون Supabase): تسجيل حساب فوري كمدير
      const demoUser: Profile = {
        id: "demo-admin",
        email,
        fullName: fullName || email.split("@")[0] || "Administrateur",
        phone,
        role: "admin",
        createdAt: new Date().toISOString(),
      };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("velora-demo-user", JSON.stringify(demoUser));
        } catch {
          // ignore
        }
      }
      set({ user: demoUser });
      return null;
    }
    const { error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } },
    });
    if (error) {
      return error.message.toLowerCase().includes("already") ? "exists" : "error";
    }
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (user) {
      const profile = await fetchProfile(sb, user.id);
      if (profile) set({ user: profile });
    }
    return null;
  },
  logout: async () => {
    const sb = createClient();
    if (sb) {
      await sb.auth.signOut();
    }
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("velora-demo-user");
      } catch {
        // ignore
      }
    }
    set({ user: null });
  },
  updateProfile: async (patch) => {
    const user = get().user;
    if (!user) return;
    const sb = createClient();
    if (sb) {
      const { error } = await sb
        .from("profiles")
        .update({
          full_name: patch.fullName ?? user.fullName,
          phone: patch.phone ?? null,
          address: patch.address ?? null,
          wilaya: patch.wilaya ?? null,
        })
        .eq("id", user.id);
      if (!error) set({ user: { ...user, ...patch } });
      return;
    }
    const updated = { ...user, ...patch };
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("velora-demo-user", JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
    set({ user: updated });
  },
  updateEmail: async (newEmail) => {
    const sb = createClient();
    if (!sb) return "no-supabase";
    const { error } = await sb.auth.updateUser({ email: newEmail });
    if (error) return error.message;
    return null;
  },
  updatePassword: async (currentPassword, newPassword) => {
    const user = get().user;
    if (!user) return "not-logged-in";
    const sb = createClient();
    if (!sb) return "no-supabase";
    // تحقق من كلمة المرور الحالية أولاً
    const { error: signInError } = await sb.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (signInError) return "wrong-password";
    const { error } = await sb.auth.updateUser({ password: newPassword });
    if (error) return error.message;
    return null;
  },
}));
