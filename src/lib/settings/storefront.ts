import { DEFAULT_STORE_SETTINGS } from "@/lib/default-settings";
import type { StorefrontConfiguration } from "@/types/settings";

type DeepPartial<T> = {
  [Key in keyof T]?: T[Key] extends object ? DeepPartial<T[Key]> : T[Key];
};

export function mergeStorefrontConfiguration(
  incoming?: DeepPartial<StorefrontConfiguration>,
): StorefrontConfiguration {
  const defaults = DEFAULT_STORE_SETTINGS.storefront;
  return {
    ...defaults,
    ...incoming,
    checkout: {
      ...defaults.checkout,
      ...incoming?.checkout,
      intro: { ...defaults.checkout.intro, ...incoming?.checkout?.intro },
    },
    productForm: {
      ...defaults.productForm,
      ...incoming?.productForm,
      intro: { ...defaults.productForm.intro, ...incoming?.productForm?.intro },
    },
    thankYou: {
      ...defaults.thankYou,
      ...incoming?.thankYou,
      title: { ...defaults.thankYou.title, ...incoming?.thankYou?.title },
      body: { ...defaults.thankYou.body, ...incoming?.thankYou?.body },
      buttonLabel: { ...defaults.thankYou.buttonLabel, ...incoming?.thankYou?.buttonLabel },
    },
  };
}
