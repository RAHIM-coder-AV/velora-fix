import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { HomepageContent } from "@/lib/homepage/content";
import { isHomepageContent } from "@/lib/homepage/content";

let client: SupabaseClient | null | undefined;

export function getHomepageSupabaseClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  client = url && key ? createBrowserClient(url, key) : null;
  return client;
}

export async function fetchHomepageContent(): Promise<HomepageContent | null> {
  const supabase = getHomepageSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("store_homepage_content")
    .select("content")
    .eq("id", "default")
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  if (!isHomepageContent(data.content)) {
    throw new Error("La configuration de la page d'accueil est invalide.");
  }
  return data.content;
}

export async function persistHomepageContent(content: HomepageContent): Promise<void> {
  const supabase = getHomepageSupabaseClient();
  if (!supabase) throw new Error("La base de données Supabase n'est pas configurée.");
  const { error } = await supabase.from("store_homepage_content").upsert(
    { id: "default", content, updated_at: new Date().toISOString() },
    { onConflict: "id" },
  );
  if (error) throw error;
}
