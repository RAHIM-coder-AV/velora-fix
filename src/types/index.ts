import type { Locale } from "@/i18n/config";

export type Localized = Record<Locale, string>;

export type UserRole = "customer" | "admin";

export type OrderStatus =
  | "pending"
  | "pending_confirmation"
  | "confirmed"
  | "customer_confirmed"
  | "processing"
  | "no_answer"
  | "postponed"
  | "busy"
  | "waiting_customer"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "customer_cancelled"
  | "fake"
  | "duplicate"
  | "returned";

export type PaymentMethod = "cod";

export interface Category {
  id: string;
  slug: string;
  name: Localized;
  description: Localized;
  image: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: Localized;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: Localized;
  colorHex: string;
  stock: number;
  price?: number;
}

export interface ProductOffer {
  id: string;
  title: Localized;
  quantity: number;
  price: number;
  originalPrice?: number;
  badge?: Localized;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: Localized;
  createdAt: string;
}

export type ProductShippingType = "store" | "fixed" | "custom" | "free";

export interface ProductShippingConfig {
  type: ProductShippingType;
  fixedHomePrice?: number;
  fixedDeskPrice?: number;
  wilayaPrices?: Record<string, { home?: number; desk?: number }>;
}

export interface Product {
  id: string;
  slug: string;
  sku?: string;
  name: Localized;
  description: Localized;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  sizes: string[];
  colors: { name: Localized; hex: string }[];
  offers?: ProductOffer[];
  shippingConfig?: ProductShippingConfig;
  active?: boolean;
  views?: number;
  featured: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
}

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  wilaya?: string;
  role: UserRole;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  name: Localized;
  size: string;
  color: Localized;
  image: string;
  unitPrice: number;
  quantity: number;
  sku?: string;
}

export type TrafficSource = "meta" | "tiktok" | "snapchat" | "google" | "direct" | string;

export interface Order {
  id: string;
  reference: string;
  userId?: string;
  email?: string;
  customerName: string;
  phone: string;
  phone2?: string;
  wilaya: string;
  commune: string;
  address: string;
  notes?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  total: number;
  items: OrderItem[];
  offerTitle?: string;
  isStopdesk?: boolean;
  trackingCode?: string;
  deliveryCompany?: "ecotrack" | "nord_ouest" | string;
  deliveryDispatchedAt?: string;
  labelUrl?: string;
  trafficSource?: TrafficSource;
  utmSource?: string;
  utmCampaign?: string;
  clientIp?: string;
  createdAt: string;
}

export interface AbandonedCheckout {
  sessionId: string;
  productId: string;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  value: number;
  contactConsent: boolean;
  customerName?: string;
  phone?: string;
  wilaya?: string;
  commune?: string;
  items?: AbandonedCheckoutItem[];
  createdAt: string;
  expiresAt: string;
}

export interface AbandonedCheckoutItem {
  productId: string;
  variantId: string;
  name: Localized;
  size: string;
  color: Localized;
  image: string;
  unitPrice: number;
  quantity: number;
  sku?: string;
}

export interface Filters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "rating";
}
