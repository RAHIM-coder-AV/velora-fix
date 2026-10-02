import type { ProductVariant } from "@/types";

export function reconcileProductVariants(
  variants: ProductVariant[],
  sizes: string[],
  colors: { name: { ar: string; fr: string }; hex: string }[],
): ProductVariant[] {
  if (!sizes.length || !colors.length) return [];

  const uniqueSizes = [...new Set(sizes.map((size) => size.trim()).filter(Boolean))];
  const uniqueColors = colors.filter(
    (color, index) =>
      color.name.ar.trim() &&
      color.hex.trim() &&
      colors.findIndex((candidate) => candidate.hex.toLowerCase() === color.hex.toLowerCase()) === index,
  );

  return uniqueSizes.flatMap((size) =>
    uniqueColors.map((color) => {
      const existing = variants.find(
        (variant) =>
          variant.size === size && variant.colorHex.toLowerCase() === color.hex.toLowerCase(),
      );
      if (existing) {
        return {
          ...existing,
          color: { ar: color.name.ar.trim(), fr: color.name.fr.trim() },
          colorHex: color.hex,
        };
      }

      const id = `var_${globalThis.crypto.randomUUID()}`;
      return {
        id,
        sku: `${size}-${color.hex.replace("#", "")}-${id.slice(-8)}`.slice(0, 32),
        size,
        color: { ar: color.name.ar.trim(), fr: color.name.fr.trim() },
        colorHex: color.hex,
        stock: 0,
      };
    }),
  );
}
