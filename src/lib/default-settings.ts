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
    faviconUrl: "",
    primaryColor: "#ababab",
    secondaryColor: "#02d6f2",
    announcements: {
      announcement1: {
        ar: "توصيل سريع ومضمون إلى 58 ولاية",
        fr: "Livraison rapide et sécurisée dans 58 wilayas",
      },
      announcement2: {
        ar: "الدفع عند الاستلام بعد معاينة طلبك",
        fr: "Paiement à la livraison après inspection de votre colis",
      },
      announcement3: {
        ar: "خدمة زبائن ومتابعة مخصصة طيلة أيام الأسبوع",
        fr: "Service client et suivi personnalisé 7j/7",
      },
    },
    policies: {
      payment: {
        ar: "الدفع نقداً عند استلام طلبيتك بعد التحقق من المنتجات.",
        fr: "Paiement en espèces à la réception de votre commande après vérification.",
      },
      exchange: {
        ar: "إمكانية الاستبدال أو الإرجاع خلال 48 ساعة في حال وجود أي عيب مصنعي.",
        fr: "Possibilité d'échange ou de retour sous 48h en cas de défaut de fabrication.",
      },
    },
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
        ar: "شُكراً جزيلاً على ثقتكم",
        fr: "Merci beaucoup pour votre confiance",
      },
      highlightBanner: {
        ar: "تم استلام الطلب بنجاح! سيصل طلبك بعد 24 أو 48 ساعة على الأكثر",
        fr: "Commande reçue avec succès ! Livraison sous 24 à 48h maximum",
      },
      body: {
        ar: "نحن نقدر تفضيلك لمنتجاتنا ونحن سعداء لإعلامك أن طلبك رقم {ref} قد تم استلامه بنجاح. الآن هناك خطوة أخيرة لضمان تأكيد طلبك بشكل كامل.",
        fr: "Nous apprécions votre commande {ref} reçue avec succès. Notre équipe vous contactera sous peu pour confirmation.",
      },
      importantNote: {
        ar: "ملاحظة مهمة: يرجى الاطلاع على الإشعار في الأسفل لتأكيد طلبك (لن يتم إرسال الطلب بدون تأكيده)",
        fr: "Note importante : Veuillez répondre à notre appel ou SMS pour valider l'envoi de votre colis.",
      },
      buttonLabel: {
        ar: "العودة إلى المتجر",
        fr: "Retour à la boutique",
      },
    },
  },
};
