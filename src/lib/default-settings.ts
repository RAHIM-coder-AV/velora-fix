import { ALGERIA_WILAYAS } from "@/lib/algeria-data";
import type { StoreSettings, WilayaDeliveryPrice } from "@/types/settings";

// الإعدادات الافتراضية لأسعار التوصيل لـ 58 ولاية جزائرية
export function getDefaultWilayaPrices(): Record<string, WilayaDeliveryPrice> {
  const map: Record<string, WilayaDeliveryPrice> = {};

  ALGERIA_WILAYAS.forEach((w) => {
    const codeNum = parseInt(w.code, 10);
    let home = 600;
    let desk = 400;

    // تسعير منطقي افتراضي حسب جغرافية الجزائر
    if (codeNum === 16) {
      // الجزائر العاصمة
      home = 400;
      desk = 250;
    } else if ([9, 35, 42].includes(codeNum)) {
      // البليدة، بومرداس، تيبازة
      home = 500;
      desk = 350;
    } else if ([15, 10, 44, 26, 31, 25, 23, 19].includes(codeNum)) {
      // المدن الكبرى (وهران، قسنطينة، عنابة، سطيف...)
      home = 650;
      desk = 450;
    } else if (
      [11, 33, 37, 50, 53, 54, 56].includes(codeNum) // الجنوب الكبير (تمنراست، جانت، إليزي، تندوف...)
    ) {
      home = 1200;
      desk = 900;
    } else if (codeNum >= 30) {
      // ولايات الجنوب
      home = 950;
      desk = 700;
    }

    map[w.code] = {
      code: w.code,
      nameAr: w.nameAr,
      nameFr: w.nameFr,
      homePrice: home,
      deskPrice: desk,
      enabled: true,
      deskEnabled: true,
    };
  });

  return map;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  shippingType: "custom",
  defaultHomePrice: 600,
  defaultDeskPrice: 400,
  freeShippingThreshold: 25000,
  wilayaPrices: getDefaultWilayaPrices(),
  ecotrack: {
    enabled: true,
    token: "",
    baseUrl: "",
    shopId: "",
    autoSendConfirmed: false,
  },
  nordEtOuest: {
    enabled: true,
    token: "",
    baseUrl: "https://api.nordetouest.com/api/v1",
    shopId: "",
    autoSendConfirmed: false,
  },
  pixels: {
    metaPixelIds: Array(6).fill(""),
    metaPixelEnabled: Array(6).fill(false),
    tiktokPixelIds: Array(4).fill(""),
    tiktokPixelEnabled: Array(4).fill(false),
  },
  storefront: {
    storeName: "VELORA",
    storeTagline: "",
    logoUrl: "",
    checkout: {
      showEmail: false,
      showNotes: true,
      intro: {
        ar: "أدخل معلوماتك لتأكيد الطلب.",
        fr: "Renseignez vos informations pour confirmer la commande.",
      },
    },
    productForm: {
      intro: {
        ar: "املأ الاستمارة في الأسفل لتقديم طلبك.",
        fr: "Remplissez le formulaire ci-dessous pour commander.",
      },
      showAddress: true,
    },
    thankYou: {
      title: {
        ar: "شكراً لطلبك",
        fr: "Merci pour votre commande",
      },
      body: {
        ar: "تم استلام طلبك رقم {ref}. سنتصل بك قريباً لتأكيده.",
        fr: "Votre commande {ref} a bien été reçue. Nous vous contacterons bientôt pour la confirmer.",
      },
      buttonLabel: {
        ar: "العودة إلى المتجر",
        fr: "Retour à la boutique",
      },
    },
  },
};
