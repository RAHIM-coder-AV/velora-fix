export interface WilayaDeliveryPrice {
  code: string;
  nameAr: string;
  nameFr: string;
  homePrice: number;      // سعر التوصيل للمنزل
  deskPrice: number;      // سعر التوصيل للمكتب / Stopdesk
  enabled: boolean;        // متاح للتوصيل أم لا
  deskEnabled: boolean;    // متوفر استلام من المكتب أم لا
}

export interface EcoTrackSettings {
  enabled: boolean;
  token: string;
  baseUrl: string;
  shopId?: string;
  autoSendConfirmed: boolean; // إرسال الطلب تلقائياً عند تأكيده
}

export interface NordEtOuestSettings {
  enabled: boolean;
  token: string;
  baseUrl: string;
  shopId?: string;
  autoSendConfirmed: boolean;
}

export interface PixelSettings {
  metaPixelIds: string[];
  metaPixelEnabled: boolean[];
  tiktokPixelIds: string[];
  tiktokPixelEnabled: boolean[];
}

export interface StorefrontConfiguration {
  storeName: string;
  storeTagline: string;
  logoUrl: string;
  checkout: {
    showEmail: boolean;
    showNotes: boolean;
    intro: { ar: string; fr: string };
  };
  productForm: {
    intro: { ar: string; fr: string };
    showAddress: boolean;
  };
  thankYou: {
    title: { ar: string; fr: string };
    body: { ar: string; fr: string };
    buttonLabel: { ar: string; fr: string };
  };
}

export interface StoreSettings {
  shippingType: "custom" | "fixed" | "free";
  defaultHomePrice: number;
  defaultDeskPrice: number;
  freeShippingThreshold: number;
  wilayaPrices: Record<string, WilayaDeliveryPrice>;
  ecotrack: EcoTrackSettings;
  nordEtOuest: NordEtOuestSettings;
  pixels: PixelSettings;
  storefront: StorefrontConfiguration;
}

export type SharedStoreSettings = Pick<
  StoreSettings,
  | "shippingType"
  | "defaultHomePrice"
  | "defaultDeskPrice"
  | "freeShippingThreshold"
  | "wilayaPrices"
  | "storefront"
>;
