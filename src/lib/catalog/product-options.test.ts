import assert from "node:assert/strict";
import { test } from "node:test";
import { reconcileProductVariants } from "@/lib/catalog/product-options";
import type { ProductVariant } from "@/types";

const black: ProductVariant = {
  id: "variant-black-m",
  sku: "BLACK-M",
  size: "M",
  color: { ar: "أسود", fr: "Noir" },
  colorHex: "#111111",
  stock: 12,
  price: 2400,
};

test("retains existing variant inventory and price while reconciling product options", () => {
  const variants = reconcileProductVariants(
    [black],
    ["M", "L"],
    [
      { name: { ar: "أسود", fr: "Noir" }, hex: "#111111" },
      { name: { ar: "أحمر", fr: "Rouge" }, hex: "#FF0000" },
    ],
  );

  assert.equal(variants.length, 4);
  assert.equal(variants[0].id, black.id);
  assert.equal(variants[0].stock, black.stock);
  assert.equal(variants[0].price, black.price);
  assert.equal(variants[1].color.ar, "أحمر");
  assert.equal(variants[1].stock, 0);
  assert.ok(variants[1].id);
});

test("removes variants for removed sizes and colors", () => {
  const variants = reconcileProductVariants(
    [
      black,
      {
        ...black,
        id: "variant-black-l",
        size: "L",
      },
    ],
    ["M"],
    [{ name: { ar: "أسود", fr: "Noir" }, hex: "#111111" }],
  );

  assert.deepEqual(variants.map((variant) => variant.id), [black.id]);
});

test("returns no combinations when either option list is empty", () => {
  assert.deepEqual(
    reconcileProductVariants(
      [black],
      [],
      [{ name: black.color, hex: black.colorHex }],
    ),
    [],
  );
});
