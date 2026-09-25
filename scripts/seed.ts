// scripts/seed.ts — يُشغَّل بصلاحيات المشروع (service role)
import { createClient } from "@supabase/supabase-js";
import { categories, products } from "../src/lib/catalog/seed";
import { seedCatalog } from "../src/lib/supabase/data";

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error("Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY");
}

const sb = createClient(url, key);
await seedCatalog(sb, categories, products);
console.log(`Seeded ${categories.length} categories, ${products.length} products`);
