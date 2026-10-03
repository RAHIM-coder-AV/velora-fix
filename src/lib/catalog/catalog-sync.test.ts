import assert from "node:assert/strict";
import { test } from "node:test";
import { isPersistedProductId, mergeCatalogProducts } from "@/lib/catalog/catalog-sync";
import type { Product } from "@/types";

function product(id: string, slug: string): Product {
  return {
    id,
    slug,
    name: { ar: slug, fr: slug },
    description: { ar: "", fr: "" },
    categoryId: "category",
    price: 1000,
    images: [],
    variants: [],
    sizes: [],
    colors: [],
    featured: false,
    isNew: false,
    rating: 0,
    reviewCount: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
  };
}

test("preserves cached products when the database catalog is empty", () => {
  const cached = [product("seed-product", "seed"), product("local-product", "local")];
  assert.deepEqual(mergeCatalogProducts([], cached), cached);
});

test("database products replace cached records with the same slug", () => {
  const persisted = product("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", "shared");
  const cached = [product("seed-product", "shared"), product("local-product", "local")];
  assert.deepEqual(mergeCatalogProducts([persisted], cached), [
    persisted,
    cached[1],
  ]);
});

test("does not resurrect cached database products that were deleted remotely", () => {
  const deletedRemoteProduct = product("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", "deleted");
  const localProduct = product("local-product", "local");
  assert.deepEqual(
    mergeCatalogProducts([], [deletedRemoteProduct, localProduct]),
    [localProduct],
  );
});

test("recognizes only UUID product IDs as database records", () => {
  assert.equal(isPersistedProductId("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"), true);
  assert.equal(isPersistedProductId("product-mulr6to4"), false);
});
