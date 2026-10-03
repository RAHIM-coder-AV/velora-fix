import { categories as seedCategories, products as seedProducts, reviews as seedReviews } from "@/lib/catalog/seed";
import type { Category, Filters, Product, Review } from "@/types";

export function applyFilters(list: Product[], filters: Filters = {}) {
  let next = list.filter((product) => product.active !== false);

  if (filters.category) {
    next = next.filter((p) => p.categoryId === filters.category || p.categoryId === categoryIdFromSlug(filters.category!));
  }
  if (filters.minPrice != null) {
    next = next.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    next = next.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    next = next.filter(
      (p) =>
        p.name.fr.toLowerCase().includes(q) ||
        p.name.ar.includes(q) ||
        p.description.fr.toLowerCase().includes(q) ||
        p.description.ar.includes(q) ||
        p.slug.includes(q),
    );
  }

  switch (filters.sort) {
    case "price-asc":
      next.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      next.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      next.sort((a, b) => b.rating - a.rating);
      break;
    default:
      next.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }

  return next;
}

function categoryIdFromSlug(slugOrId: string) {
  const found = seedCategories.find((c) => c.slug === slugOrId || c.id === slugOrId);
  return found?.id ?? slugOrId;
}

export function getSeedCategories(): Category[] {
  return seedCategories;
}

export function getSeedProducts(): Product[] {
  return seedProducts;
}

export function getSeedProduct(slug: string) {
  return seedProducts.find((p) => p.slug === slug || p.id === slug);
}

export function getSeedReviews(productId: string): Review[] {
  return seedReviews.filter((r) => r.productId === productId);
}

export function relatedProducts(product: Product, all: Product[], limit = 4) {
  return all
    .filter((p) => p.active !== false && p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, limit);
}

export function totalStock(product: Product) {
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
}

export function findVariant(product: Product, size: string, colorHex: string) {
  return product.variants.find((v) => v.size === size && v.colorHex === colorHex);
}
