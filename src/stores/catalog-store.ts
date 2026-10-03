"use client";

import { create } from "zustand";
import {
  categories as seedCategories,
  products as seedProducts,
  reviews as seedReviews,
} from "@/lib/catalog/seed";
import { applyFilters } from "@/lib/catalog/queries";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/configured";
import * as db from "@/lib/supabase/data";
import type {
  AbandonedCheckout,
  Category,
  Filters,
  Order,
  OrderStatus,
  Product,
  ProductOffer,
  Review,
} from "@/types";
import { uid } from "@/lib/utils";

const initialOrders: Order[] = [
  {
    id: "ord_01",
    reference: "VL-849201",
    customerName: "Benrmas samah",
    phone: "0798355584",
    wilaya: "31 - وهران",
    commune: "وهران",
    address: "وسط المدينة",
    status: "confirmed",
    paymentMethod: "cod",
    subtotal: 3800,
    shipping: 600,
    total: 4400,
    offerTitle: "فستان + توصيل",
    createdAt: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
    items: [
      {
        id: "oi_1",
        productId: "p_robe_rope",
        variantId: "p_robe_rope_Standard_FFB6C1",
        name: { fr: "Rope", ar: "فستان روب عصري" },
        size: "Standard",
        color: { fr: "Rose", ar: "وردي" },
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
        unitPrice: 3800,
        quantity: 1,
      },
    ],
  },
  {
    id: "ord_02",
    reference: "VL-739102",
    customerName: "محاني",
    phone: "0775396053",
    wilaya: "23 - عنابة",
    commune: "عنابة",
    address: "سيدي إبراهيم",
    status: "processing",
    paymentMethod: "cod",
    subtotal: 3800,
    shipping: 650,
    total: 4450,
    offerTitle: "فستان صيفي",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: "oi_2",
        productId: "p_robe_rope",
        variantId: "p_robe_rope_XL_FFB6C1",
        name: { fr: "Rope", ar: "فستان روب عصري" },
        size: "XL",
        color: { fr: "Rose", ar: "وردي" },
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
        unitPrice: 3800,
        quantity: 1,
      },
    ],
  },
  {
    id: "ord_03",
    reference: "VL-619283",
    customerName: "تواتي",
    phone: "0554951345",
    wilaya: "09 - البليدة",
    commune: "البليدة",
    address: "باب الخويخة",
    status: "processing",
    paymentMethod: "cod",
    subtotal: 3800,
    shipping: 500,
    total: 4300,
    offerTitle: "فستان روب",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: "oi_3",
        productId: "p_robe_rope",
        variantId: "p_robe_rope_Standard_FFB6C1",
        name: { fr: "Rope", ar: "فستان روب عصري" },
        size: "Standard",
        color: { fr: "Rose", ar: "وردي" },
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
        unitPrice: 3800,
        quantity: 1,
      },
    ],
  },
  {
    id: "ord_04",
    reference: "VL-502847",
    customerName: "بشوشي إلياس",
    phone: "0542372877",
    wilaya: "16 - الجزائر",
    commune: "الجزائر الوسطى",
    address: "حيدرة شارع ديدوش",
    status: "pending",
    paymentMethod: "cod",
    subtotal: 1750,
    shipping: 500,
    total: 2250,
    offerTitle: "تيشرت 1750 دج",
    createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: "oi_4",
        productId: "p_old_money",
        variantId: "p_old_money_L_111111",
        name: { fr: "Old money", ar: "Old money" },
        size: "L",
        color: { fr: "Noir", ar: "أسود" },
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=80",
        unitPrice: 1750,
        quantity: 1,
      },
    ],
  },
  {
    id: "ord_05",
    reference: "VL-491028",
    customerName: "طاهر براهيمي",
    phone: "0667454335",
    wilaya: "03 - الأغواط",
    commune: "الأغواط",
    address: "حي المحطة",
    status: "cancelled",
    paymentMethod: "cod",
    subtotal: 1750,
    shipping: 500,
    total: 2250,
    offerTitle: "Old money تيشرت",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: "oi_5",
        productId: "p_old_money",
        variantId: "p_old_money_XL_FFFFFF",
        name: { fr: "Old money", ar: "Old money" },
        size: "XL",
        color: { fr: "Blanc", ar: "أبيض" },
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=80",
        unitPrice: 1750,
        quantity: 1,
      },
    ],
  },
  {
    id: "ord_06",
    reference: "VL-381920",
    customerName: "بن منصور أمير",
    phone: "0792627815",
    wilaya: "05 - باتنة",
    commune: "باتنة",
    address: "حي كشيدة",
    status: "delivered",
    paymentMethod: "cod",
    subtotal: 3700,
    shipping: 500,
    total: 4200,
    offerTitle: "بنطلون 2 قطع",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: "oi_6",
        productId: "p_pantalon_lin",
        variantId: "p_pantalon_lin_M_E8DCB8",
        name: { fr: "Pontalon lin", ar: "بنطلون كتان صيفي" },
        size: "M",
        color: { fr: "Beige", ar: "بيج" },
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=80",
        unitPrice: 3700,
        quantity: 1,
      },
    ],
  },
  {
    id: "ord_07",
    reference: "VL-274819",
    customerName: "بشرى",
    phone: "0781337683",
    wilaya: "38 - تسمسيلت",
    commune: "تسمسيلت",
    address: "حي النور",
    status: "delivered",
    paymentMethod: "cod",
    subtotal: 3700,
    shipping: 500,
    total: 4200,
    offerTitle: "عقد صيفي",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: "oi_7",
        productId: "p_robe_rope",
        variantId: "p_robe_rope_Standard_FFB6C1",
        name: { fr: "Rope", ar: "فستان روب عصري" },
        size: "Standard",
        color: { fr: "Rose", ar: "وردي" },
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
        unitPrice: 3700,
        quantity: 1,
      },
    ],
  },
  {
    id: "ord_08",
    reference: "VL-164728",
    customerName: "abir",
    phone: "0673276509",
    wilaya: "30 - ورقلة",
    commune: "ورقلة",
    address: "حي سيدي عابد",
    status: "delivered",
    paymentMethod: "cod",
    subtotal: 3600,
    shipping: 600,
    total: 4200,
    offerTitle: "عرض خاص",
    createdAt: new Date(Date.now() - 6.5 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: "oi_8",
        productId: "p_robe_rope",
        variantId: "p_robe_rope_Standard_FFB6C1",
        name: { fr: "Rope", ar: "فستان روب عصري" },
        size: "Standard",
        color: { fr: "Rose", ar: "وردي" },
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
        unitPrice: 3600,
        quantity: 1,
      },
    ],
  },
  {
    id: "ord_09",
    reference: "VL-053629",
    customerName: "ميمي",
    phone: "0564877791",
    wilaya: "16 - الجزائر",
    commune: "باب الزوار",
    address: "حي 5 جويلية",
    status: "delivered",
    paymentMethod: "cod",
    subtotal: 3800,
    shipping: 500,
    total: 4300,
    offerTitle: "روب صيفي",
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: "oi_9",
        productId: "p_robe_rope",
        variantId: "p_robe_rope_Standard_FFB6C1",
        name: { fr: "Rope", ar: "فستان روب عصري" },
        size: "Standard",
        color: { fr: "Rose", ar: "وردي" },
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
        unitPrice: 3800,
        quantity: 1,
      },
    ],
  },
];

function getStoredProducts(): Product[] {
  if (typeof window === "undefined") return seedProducts;
  try {
    const saved = localStorage.getItem("velora_products");
    if (saved) {
      const parsed = JSON.parse(saved) as Product[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return seedProducts;
}

function getStoredOrders(): Order[] {
  if (typeof window === "undefined") return initialOrders;
  try {
    const saved = localStorage.getItem("velora_orders");
    if (saved) {
      const parsed = JSON.parse(saved) as Order[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return initialOrders;
}

function saveProducts(products: Product[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("velora_products", JSON.stringify(products));
    } catch {
      // ignore
    }
  }
}

function saveOrders(orders: Order[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("velora_orders", JSON.stringify(orders));
    } catch {
      // ignore
    }
  }
}

function getStoredAbandonedCheckouts(): AbandonedCheckout[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("velora_abandoned_checkouts");
    if (!saved) return [];
    const drafts = JSON.parse(saved) as AbandonedCheckout[];
    if (!Array.isArray(drafts)) return [];
    return drafts.filter((draft) => Date.parse(draft.expiresAt) > Date.now());
  } catch {
    return [];
  }
}

function saveAbandonedCheckouts(drafts: AbandonedCheckout[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("velora_abandoned_checkouts", JSON.stringify(drafts));
}

interface CatalogState {
  products: Product[];
  categories: Category[];
  catalogLoadState: "loading" | "ready" | "error";
  orders: Order[];
  abandonedCheckouts: AbandonedCheckout[];
  reviews: Review[];
  refresh: () => Promise<void>;
  refreshOrders: (all?: boolean) => Promise<void>;
  refreshAbandonedCheckouts: () => Promise<void>;
  saveAbandonedCheckout: (draft: AbandonedCheckout) => Promise<void>;
  completeAbandonedCheckout: (sessionId: string, orderReference: string) => Promise<void>;
  upsertProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductActive: (id: string) => void;
  updateProductOffers: (productId: string, offers: ProductOffer[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (id: string) => void;
  setOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  bulkSetOrderStatus: (ids: string[], status: OrderStatus) => void;
  updateOrderDelivery: (
    id: string,
    deliveryData: {
      deliveryCompany: string;
      trackingCode: string;
      status?: OrderStatus;
      labelUrl?: string;
    }
  ) => void;
  setVariantStock: (productId: string, variantId: string, stock: number) => Promise<void>;
  listProducts: (filters?: Filters) => Product[];
  getProduct: (slug: string) => Product | undefined;
}

const sb = () => (isSupabaseConfigured() ? createClient() : null);

export const useCatalogStore = create<CatalogState>()((set, get) => ({
  products: getStoredProducts(),
  categories: seedCategories,
  catalogLoadState: isSupabaseConfigured() ? "loading" : "ready",
  orders: getStoredOrders(),
  abandonedCheckouts: getStoredAbandonedCheckouts(),
  reviews: seedReviews,
  refresh: async () => {
    const client = sb();
    if (!client) {
      set({ catalogLoadState: "ready" });
      return;
    }
    set({ catalogLoadState: "loading" });
    try {
      const { categories, products, reviews } = await db.fetchCatalog(client);
      // إذا كانت قاعدة البيانات فارغة، نعود إلى بيانات seed لضمان ظهور المنتجات دائماً
      const finalProducts = products.length > 0 ? products : seedProducts;
      const finalCategories = categories.length > 0 ? categories : seedCategories;
      const finalReviews = reviews.length > 0 ? reviews : seedReviews;
      set({ categories: finalCategories, products: finalProducts, reviews: finalReviews, catalogLoadState: "ready" });
      if (products.length > 0) saveProducts(finalProducts);
    } catch (error) {
      // في حالة خطأ الاتصال، نعود إلى البيانات المحلية أو seed
      const fallback = getStoredProducts();
      set({ products: fallback, categories: seedCategories, reviews: seedReviews, catalogLoadState: "ready" });
    }
  },
  refreshOrders: async (all = false) => {
    const client = sb();
    if (!client) return;
    const orders = await db.fetchOrders(client, { all });
    set({ orders });
    saveOrders(orders);
  },
  refreshAbandonedCheckouts: async () => {
    const client = sb();
    const drafts = client
      ? await db.fetchAbandonedCheckouts(client)
      : getStoredAbandonedCheckouts();
    set({ abandonedCheckouts: drafts });
  },
  saveAbandonedCheckout: async (draft) => {
    const client = sb();
    if (client) {
      await db.saveAbandonedCheckout(client, draft);
      set((state) => ({
        abandonedCheckouts: [
          draft,
          ...state.abandonedCheckouts.filter((item) => item.sessionId !== draft.sessionId),
        ],
      }));
      return;
    }
    const updated = [
      draft,
      ...get().abandonedCheckouts.filter((item) => item.sessionId !== draft.sessionId),
    ];
    set({ abandonedCheckouts: updated });
    saveAbandonedCheckouts(updated);
  },
  completeAbandonedCheckout: async (sessionId, orderReference) => {
    const client = sb();
    const updated = get().abandonedCheckouts.filter((item) => item.sessionId !== sessionId);
    set({ abandonedCheckouts: updated });
    if (!client) saveAbandonedCheckouts(updated);
  },
  upsertProduct: async (product) => {
    const client = sb();
    if (client) {
      await db.upsertProduct(client, product);
      await get().refresh();
      return;
    }
    const current = get().products;
    const exists = current.some((p) => p.id === product.id);
    const updated = exists
      ? current.map((p) => (p.id === product.id ? product : p))
      : [product, ...current];
    set({ products: updated });
    saveProducts(updated);
  },
  deleteProduct: async (id) => {
    const client = sb();
    if (client) {
      await db.deleteProduct(client, id);
      await get().refresh();
      return;
    }
    const updated = get().products.filter((p) => p.id !== id);
    set({ products: updated });
    saveProducts(updated);
  },
  toggleProductActive: (id) => {
    const updated = get().products.map((p) =>
      p.id === id ? { ...p, active: p.active === false ? true : false } : p
    );
    set({ products: updated });
    saveProducts(updated);
  },
  updateProductOffers: (productId, offers) => {
    const updated = get().products.map((p) =>
      p.id === productId ? { ...p, offers } : p
    );
    set({ products: updated });
    saveProducts(updated);
  },
  addOrder: (order) => {
    const updated = [order, ...get().orders];
    set({ orders: updated });
    saveOrders(updated);
  },
  updateOrder: (order) => {
    const updated = get().orders.map((o) => (o.id === order.id ? order : o));
    set({ orders: updated });
    saveOrders(updated);
  },
  deleteOrder: (id) => {
    const updated = get().orders.filter((o) => o.id !== id);
    set({ orders: updated });
    saveOrders(updated);
  },
  setOrderStatus: async (id, status) => {
    const client = sb();
    if (client) {
      await db.updateOrderStatus(client, id, status);
    }
    const updated = get().orders.map((o) => (o.id === id ? { ...o, status } : o));
    set({ orders: updated });
    saveOrders(updated);
  },
  bulkSetOrderStatus: (ids, status) => {
    const updated = get().orders.map((o) => (ids.includes(o.id) ? { ...o, status } : o));
    set({ orders: updated });
    saveOrders(updated);
  },
  updateOrderDelivery: (id, deliveryData) => {
    const updated = get().orders.map((o) =>
      o.id === id
        ? {
            ...o,
            deliveryCompany: deliveryData.deliveryCompany,
            trackingCode: deliveryData.trackingCode,
            status: deliveryData.status || "shipped",
            deliveryDispatchedAt: new Date().toISOString(),
            labelUrl: deliveryData.labelUrl || o.labelUrl,
          }
        : o
    );
    set({ orders: updated });
    saveOrders(updated);
  },
  setVariantStock: async (productId, variantId, stock) => {
    const client = sb();
    if (client) {
      await db.setVariantStock(client, variantId, stock);
      await get().refresh();
      return;
    }
    const updated = get().products.map((p) =>
      p.id !== productId
        ? p
        : {
            ...p,
            variants: p.variants.map((v) =>
              v.id === variantId ? { ...v, stock: Math.max(0, stock) } : v
            ),
          }
    );
    set({ products: updated });
    saveProducts(updated);
  },
  listProducts: (filters) => applyFilters(get().products, filters),
  getProduct: (slug) => get().products.find((p) => p.slug === slug || p.id === slug),
}));

export function newProductDraft(): Product {
  return {
    id: uid("p"),
    slug: `piece-${Date.now().toString(36)}`,
    sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
    name: { fr: "", ar: "" },
    description: { fr: "", ar: "" },
    categoryId: seedCategories[0].id,
    price: 1500,
    compareAtPrice: 2200,
    images: [
      {
        id: uid("img"),
        url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
        alt: { fr: "", ar: "" },
      },
    ],
    variants: [
      {
        id: uid("var"),
        sku: uid("SKU").toUpperCase(),
        size: "M",
        color: { fr: "Noir", ar: "أسود" },
        colorHex: "#1A1A1A",
        stock: 25,
      },
    ],
    sizes: ["M", "L", "XL"],
    colors: [{ name: { fr: "Noir", ar: "أسود" }, hex: "#1A1A1A" }],
    offers: [
      {
        id: uid("off"),
        quantity: 1,
        title: { ar: "قطعة واحدة", fr: "1 Pièce" },
        price: 1500,
        originalPrice: 2200,
      },
      {
        id: uid("off"),
        quantity: 2,
        title: { ar: "2 قطع", fr: "2 Pièces" },
        price: 2800,
        originalPrice: 4400,
        badge: { ar: "الأكثر طلباً", fr: "Populaire" },
      },
    ],
    active: true,
    views: 0,
    featured: false,
    isNew: true,
    rating: 5,
    reviewCount: 1,
    createdAt: new Date().toISOString(),
  };
}
