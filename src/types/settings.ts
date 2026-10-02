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

export interface StoreSettings {
  shippingType: "custom" | "fixed" | "free";
  defaultHomePrice: number;
  defaultDeskPrice: number;
  freeShippingThreshold: number;
  wilayaPrices: Record<string, WilayaDeliveryPrice>;
  ecotrack: EcoTrackSettings;
  nordEtOuest: NordEtOuestSettings;
  pixels: PixelSettings;
}
