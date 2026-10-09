import type { Product } from "@/types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isPersistedProductId(id: string): boolean {
  return UUID_RE.test(id);
}

export function mergeCatalogProducts(
  persistedProducts: Product[],
  cachedProducts: Product[],
): Product[] {
  let landingMap: Record<string, string[]> = {};
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("velora_product_landing_images");
      if (saved) landingMap = JSON.parse(saved);
    } catch {}
  }

  const cachedMap = new Map(cachedProducts.map((p) => [p.id, p]));
  const cachedSlugMap = new Map(cachedProducts.map((p) => [p.slug, p]));

  const mergedPersisted = persistedProducts.map((persisted) => {
    const cached = cachedMap.get(persisted.id) || cachedSlugMap.get(persisted.slug);
    const localLanding = landingMap[persisted.id] || landingMap[persisted.slug] || [];

    if (!cached) {
      return {
        ...persisted,
        landingImages:
          persisted.landingImages && persisted.landingImages.length > 0
            ? persisted.landingImages
            : (localLanding.length > 0 ? localLanding : undefined),
      };
    }
    return {
      ...persisted,
      // CRITICAL: Always preserve landing images, custom gallery images, and shipping config from local cache!
      landingImages:
        cached.landingImages && cached.landingImages.length > 0
          ? cached.landingImages
          : (localLanding.length > 0 ? localLanding : persisted.landingImages),
      shippingConfig: cached.shippingConfig || persisted.shippingConfig,
      trackStock: cached.trackStock !== undefined ? cached.trackStock : persisted.trackStock,
      images:
        cached.images && cached.images.length > 0
          ? cached.images
          : persisted.images,
      offers: (cached.offers && cached.offers.length > 0) ? cached.offers : persisted.offers,
      views: Math.max(persisted.views ?? 0, cached.views ?? 0),
    };
  });

  const persistedSlugs = new Set(persistedProducts.map((product) => product.slug));
  const cachedOnlyProducts = cachedProducts.filter(
    (product) => !isPersistedProductId(product.id) && !persistedSlugs.has(product.slug),
  );
  return [...mergedPersisted, ...cachedOnlyProducts];
}

export function removeSeedProducts(products: Product[], seedProducts: Product[]): Product[] {
  const seedIds = new Set(seedProducts.map((product) => product.id));
  const seedSlugs = new Set(seedProducts.map((product) => product.slug));
  return products.filter(
    (product) => !seedIds.has(product.id) && !seedSlugs.has(product.slug),
  );
}

export function getLocalProductsToImport(
  products: Product[],
  seedProducts: Product[],
): Product[] {
  const seedIds = new Set(seedProducts.map((product) => product.id));
  const seedSlugs = new Set(seedProducts.map((product) => product.slug));
  const seenSlugs = new Set<string>();

  return products.filter((product) => {
    if (isPersistedProductId(product.id) || seedIds.has(product.id) || seedSlugs.has(product.slug)) {
      return false;
    }
    const slug = product.slug.trim();
    if (!slug || seenSlugs.has(slug)) return false;
    seenSlugs.add(slug);
    return true;
  });
}
