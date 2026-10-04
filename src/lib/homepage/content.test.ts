import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createDefaultHomepageContent,
  isHomepageContent,
  moveHomepageSection,
  productsForHomepageSection,
  updateHomepageProductSelection,
  type HomepageProductSection,
} from "@/lib/homepage/content";
import type { Product } from "@/types";

const product = (slug: string, options: Partial<Product> = {}): Product => ({
  id: slug,
  slug,
  name: { fr: slug, ar: slug },
  description: { fr: "", ar: "" },
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
  ...options,
});

test("default homepage contains editable ordered sections and a template", () => {
  const content = createDefaultHomepageContent();
  assert.equal(content.theme, "atelier");
  assert.deepEqual(content.sections.map((section) => section.order), [0, 1, 2, 3, 4]);
  assert.ok(isHomepageContent(content));
});

test("curated product section follows chosen order and omits inactive or missing products", () => {
  const section: HomepageProductSection = {
    id: "featured",
    visible: true,
    order: 0,
    title: { ar: "مختارات", fr: "Choix" },
    selectionMode: "curated" as const,
    productSlugs: ["second", "inactive", "missing", "first"],
  };
  assert.deepEqual(
    productsForHomepageSection(
      section,
      [product("first"), product("second"), product("inactive", { active: false })],
    ).map((item) => item.slug),
    ["second", "first"],
  );
});

test("automatic sections use current product flags", () => {
  const section: HomepageProductSection = {
    id: "featured",
    visible: true,
    order: 0,
    title: { ar: "مختارات", fr: "Choix" },
    selectionMode: "automatic" as const,
    productSlugs: [],
  };
  assert.deepEqual(
    productsForHomepageSection(section, [
      product("featured", { featured: true }),
      product("not-featured"),
    ]).map((item) => item.slug),
    ["featured"],
  );
});

test("section reordering is bounded and normalizes order values", () => {
  const initial = createDefaultHomepageContent();
  const moved = moveHomepageSection(initial, "featured", -1);
  assert.deepEqual(
    [...moved.sections].sort((a, b) => a.order - b.order).map((section) => section.id),
    ["hero", "featured", "categories", "editorial", "new-arrivals"],
  );
  assert.equal(moveHomepageSection(moved, "hero", -1), moved);
});

test("curating and deselecting products preserves a deliberate empty selection", () => {
  const section = createDefaultHomepageContent().sections.find((item) => item.id === "featured");
  assert.ok(section && (section.id === "featured" || section.id === "new-arrivals"));
  const selected = updateHomepageProductSelection(section, "item", true);
  const deselected = updateHomepageProductSelection(selected, "item", false);
  assert.equal(deselected.selectionMode, "curated");
  assert.deepEqual(deselected.productSlugs, []);
  assert.deepEqual(productsForHomepageSection(deselected, [product("automatic", { featured: true })]), []);
});
