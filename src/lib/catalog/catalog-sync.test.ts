import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getLocalProductsToImport,
  isPersistedProductId,
  mergeCatalogProducts,
  removeSeedProducts,
} from "@/lib/catalog/catalog-sync";
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

test("only offers distinct custom local products for explicit import", () => {
  const seed = product("seed-product", "seed");
  const custom = product("local-product", "custom");
  const persisted = product("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", "remote");
  const duplicateSlug = product("another-local-id", "custom");
  const blankSlug = product("blank-local-id", " ");

  assert.deepEqual(
    getLocalProductsToImport(
      [seed, custom, persisted, duplicateSlug, blankSlug],
      [seed],
    ),
    [custom],
  );
});

test("does not offer seed catalog products for import by ID or slug", () => {
  const seedById = product("seed-product", "renamed");
  const seedBySlug = product("local-id", "seed");
  const custom = product("custom-id", "custom");
  assert.deepEqual(
    getLocalProductsToImport([seedById, seedBySlug, custom], [
      product("seed-product", "seed"),
    ]),
    [custom],
  );
});

test("removes bundled demo products while preserving custom local products", () => {
  const demo = product("seed-product", "sample");
  const custom = product("local-product", "custom");
  assert.deepEqual(removeSeedProducts([demo, custom], [demo]), [custom]);
  assert.deepEqual(
    removeSeedProducts([product("duplicate-id", "sample")], [demo]),
    [],
  );
});
