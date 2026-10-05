import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_STORE_SETTINGS } from "@/lib/default-settings";
import { mergeStorefrontConfiguration } from "@/lib/settings/storefront";

test("fills missing storefront configuration from defaults", () => {
  assert.deepEqual(mergeStorefrontConfiguration(), DEFAULT_STORE_SETTINGS.storefront);
});

test("preserves saved nested values and fills absent locales from defaults", () => {
  const storefront = mergeStorefrontConfiguration({
    checkout: { intro: { ar: "رسالة مخصصة" } },
    thankYou: { title: { fr: "Merci" } },
  });

  assert.equal(storefront.checkout.intro.ar, "رسالة مخصصة");
  assert.equal(storefront.checkout.intro.fr, DEFAULT_STORE_SETTINGS.storefront.checkout.intro.fr);
  assert.equal(storefront.thankYou.title.fr, "Merci");
  assert.equal(storefront.thankYou.title.ar, DEFAULT_STORE_SETTINGS.storefront.thankYou.title.ar);
  assert.equal(storefront.productForm.showAddress, DEFAULT_STORE_SETTINGS.storefront.productForm.showAddress);
});
