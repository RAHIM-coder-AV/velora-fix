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

export interface ProductFormConfiguration {
  intro: { ar: string; fr: string };
  buttonText?: { ar: string; fr: string };
  buttonDisableMode?: "never" | "out_of_stock" | "invalid_fields"; // تحديد متى يتعطل زر الشراء
  
  // Customer info
  showName?: boolean;
  namePlaceholder?: { ar: string; fr: string };
  nameRequired?: boolean;

  showPhone?: boolean;
  phonePlaceholder?: { ar: string; fr: string };
  phoneRequired?: boolean;
  minPhoneDigits?: number;
  maxPhoneDigits?: number;

  // Address info
  showWilaya?: boolean;
  wilayaPlaceholder?: { ar: string; fr: string };
  wilayaRequired?: boolean;
  allowManualWilaya?: boolean;

  showCommune?: boolean;
  communePlaceholder?: { ar: string; fr: string };
  communeRequired?: boolean;
  allowManualCommune?: boolean;

  showAddress: boolean;
  addressPlaceholder?: { ar: string; fr: string };
  addressRequired?: boolean;

  // Notes
  showNotes?: boolean;
  notesPlaceholder?: { ar: string; fr: string };
  notesRequired?: boolean;

  // Other options
  keepSummaryOpen?: boolean;
  hidePhoneNotice?: boolean;
  hideShippingPrice?: boolean;
  showFreeShippingBadge?: boolean;
  hideOrderSummary?: boolean;

  // Fake orders protection
  enableSpamProtection?: boolean;
  blockDuplicateOrdersMinutes?: number;
}

export interface StorefrontConfiguration {
  storeName: string;
  storeTagline: string;
  logoUrl: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  announcements?: {
    announcement1: { ar: string; fr: string };
    announcement2: { ar: string; fr: string };
    announcement3: { ar: string; fr: string };
  };
  policies?: {
    payment: { ar: string; fr: string };
    exchange: { ar: string; fr: string };
  };
  checkout: {
    showEmail: boolean;
    showNotes: boolean;
    intro: { ar: string; fr: string };
  };
  productForm: ProductFormConfiguration;
  thankYou: {
    title: { ar: string; fr: string };
    highlightBanner?: { ar: string; fr: string };
    body: { ar: string; fr: string };
    importantNote?: { ar: string; fr: string };
    buttonLabel: { ar: string; fr: string };
  };
}

export interface TelegramNotificationSettings {
  enabled: boolean;
  botToken: string;
  chatId: string;
}

export interface WhatsAppNotificationSettings {
  enabled: boolean;
  storePhone?: string;
  autoOpenChat?: boolean;
  orderTemplate?: string;
  shippedTemplate?: string;
}

export interface BlockedTarget {
  id: string;
  type: "ip" | "phone";
  value: string;
  reason?: string;
  blockedAt: string;
}

export interface OrdersFraudSettings {
  maxAllowedOrders: number; // عدد الطلبات المسموح بها
  reorderCooldownHours: number; // الوقت بالساعات لإعادة الطلب من جديد
  enableIpBlock: boolean;
  enablePhoneBlock: boolean;
  enableCooldown: boolean;
  autoDeleteSpam: boolean;
  blockedTargets: BlockedTarget[];
  deletedOrdersCount?: number;
  autoDeletedOrdersCount?: number;
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
  telegram?: TelegramNotificationSettings;
  whatsapp?: WhatsAppNotificationSettings;
  storefront: StorefrontConfiguration;
  fraudProtection?: OrdersFraudSettings;
}

export type SharedStoreSettings = Pick<
  StoreSettings,
  | "shippingType"
  | "defaultHomePrice"
  | "defaultDeskPrice"
  | "freeShippingThreshold"
  | "wilayaPrices"
  | "storefront"
  | "fraudProtection"
>;

