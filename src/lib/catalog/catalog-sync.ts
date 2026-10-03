import type { Product } from "@/types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isPersistedProductId(id: string): boolean {
  return UUID_RE.test(id);
}

export function mergeCatalogProducts(
  persistedProducts: Product[],
  cachedProducts: Product[],
): Product[] {
  const persistedSlugs = new Set(persistedProducts.map((product) => product.slug));
  const cachedOnlyProducts = cachedProducts.filter(
    (product) => !isPersistedProductId(product.id) && !persistedSlugs.has(product.slug),
  );
  return [...persistedProducts, ...cachedOnlyProducts];
}
