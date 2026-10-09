"use client";

import { create } from "zustand";
import {
  categories as seedCategories,
  products as seedProducts,
  reviews as seedReviews,
} from "@/lib/catalog/seed";
import { applyFilters } from "@/lib/catalog/queries";
import {
  getLocalProductsToImport,
  isPersistedProductId,
  mergeCatalogProducts,
  removeSeedProducts,
} from "@/lib/catalog/catalog-sync";
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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

export function getStoredLandingImagesMap(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem("velora_product_landing_images");
    if (saved) return JSON.parse(saved) as Record<string, string[]>;
  } catch {
    // ignore
  }
  return {};
}

export function saveLandingImagesMap(productId: string, slug: string, landingImages: string[]) {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredLandingImagesMap();
    if (productId) current[productId] = landingImages;
    if (slug) current[slug] = landingImages;
    localStorage.setItem("velora_product_landing_images", JSON.stringify(current));
  } catch (e) {
    console.warn("Storage warning for landing images map:", e);
  }
}

export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") return seedProducts;
  try {
    const landingMap = getStoredLandingImagesMap();
    const saved = localStorage.getItem("velora_products");
    if (saved) {
      const parsed = JSON.parse(saved) as Product[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => ({
          ...p,
          landingImages:
            p.landingImages && p.landingImages.length > 0
              ? p.landingImages
              : landingMap[p.id] || landingMap[p.slug] || [],
        }));
      }
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
      const landingMap = getStoredLandingImagesMap();
      for (const p of products) {
        if (p.landingImages && p.landingImages.length > 0) {
          if (p.id) landingMap[p.id] = p.landingImages;
          if (p.slug) landingMap[p.slug] = p.landingImages;
        }
      }
      try {
        localStorage.setItem("velora_product_landing_images", JSON.stringify(landingMap));
      } catch {}

      localStorage.setItem("velora_products", JSON.stringify(products));
    } catch (e) {
      console.warn("Could not write products to localStorage:", e);
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
  localDataReady: boolean;
  hydrateLocalData: () => void;
  refresh: () => Promise<void>;
  refreshOrders: (all?: boolean) => Promise<void>;
  refreshAbandonedCheckouts: () => Promise<void>;
  saveAbandonedCheckout: (draft: AbandonedCheckout) => Promise<void>;
  completeAbandonedCheckout: (sessionId: string, orderReference: string) => Promise<void>;
  convertAbandonedCheckout: (draft: AbandonedCheckout, order: Order) => Promise<string>;
  upsertCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  upsertProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<"deleted" | "removed-local">;
  deleteAllProducts: () => Promise<{ deletedFromDatabase: number; removedLocally: number }>;
  toggleProductActive: (id: string) => Promise<void>;
  importLocalProducts: () => Promise<ImportLocalProductsResult>;
  updateProductOffers: (productId: string, offers: ProductOffer[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => Promise<void>;
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
  ) => Promise<void>;
  setVariantStock: (productId: string, variantId: string, stock: number) => Promise<void>;
  recordProductView: (productId: string) => Promise<void>;
  listProducts: (filters?: Filters) => Product[];
  getProduct: (slug: string) => Product | undefined;
}

export interface ImportLocalProductsResult {
  imported: number;
  skipped: number;
  failed: Array<{ slug: string; message: string }>;
}

const sb = () => (isSupabaseConfigured() ? createClient() : null);

export const useCatalogStore = create<CatalogState>()((set, get) => ({
  // Seed products available instantly so client & server render immediately with 0 delay
  products: seedProducts,
  categories: seedCategories,
  catalogLoadState: "ready",
  orders: initialOrders,
  abandonedCheckouts: [],
  reviews: seedReviews,
  localDataReady: true,
  hydrateLocalData: () => {
    if (typeof window === "undefined") return;
    const stored = getStoredProducts();
    set((state) => ({
      products: stored.length ? stored : (state.products.length ? state.products : seedProducts),
      orders: state.orders.length ? state.orders : getStoredOrders(),
      abandonedCheckouts: state.abandonedCheckouts.length
        ? state.abandonedCheckouts
        : getStoredAbandonedCheckouts(),
      localDataReady: true,
    }));
  },
  refresh: async () => {
    const client = sb();
    if (!client) {
      set({ catalogLoadState: "ready" });
      return;
    }
    set({ catalogLoadState: "loading" });
    try {
      const { categories, products, reviews } = await db.fetchCatalog(client);
      const finalProducts = mergeCatalogProducts(products, get().products);
      set((state) => ({
        categories: categories.length ? categories : state.categories,
        products: finalProducts,
        reviews: reviews.length ? reviews : state.reviews,
        catalogLoadState: "ready",
      }));
      saveProducts(finalProducts);
    } catch (error) {
      console.warn("Could not sync catalog with database, continuing with local store:", error);
      set((state) => ({
        catalogLoadState: "ready",
        products: state.products.length ? state.products : getStoredProducts(),
      }));
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
    if (client) {
      await db.completeAbandonedCheckout(client, sessionId, orderReference);
    } else {
      saveAbandonedCheckouts(updated);
    }
  },
  convertAbandonedCheckout: async (draft, order) => {
    const client = sb();
    if (client) {
      const reference = await db.placeOrder(client, order, draft.sessionId);
      await Promise.all([get().refreshOrders(true), get().refreshAbandonedCheckouts()]);
      return reference;
    }
    const reservation = new Map<string, { productId: string; quantity: number; stock: number }>();
    for (const item of order.items) {
      const product = get().products.find((candidate) => candidate.id === item.productId);
      const variant = product?.variants.find((candidate) => candidate.id === item.variantId);
      if (!variant) {
        throw new Error("VARIANT_NOT_FOUND_OR_OUT_OF_STOCK");
      }
      const current = reservation.get(item.variantId) ?? {
        productId: item.productId,
        quantity: 0,
        stock: variant.stock,
      };
      current.quantity += item.quantity;
      reservation.set(item.variantId, current);
    }
    for (const [variantId, item] of reservation) {
      if (item.stock < item.quantity) {
        throw new Error("VARIANT_NOT_FOUND_OR_OUT_OF_STOCK");
      }
      await get().setVariantStock(item.productId, variantId, item.stock - item.quantity);
    }
    const completedOrder = { ...order };
    get().addOrder(completedOrder);
    await get().completeAbandonedCheckout(draft.sessionId, completedOrder.reference);
    return completedOrder.reference;
  },
  upsertCategory: async (category) => {
    const client = sb();
    if (client) {
      await db.upsertCategory(client, category);
      await get().refresh();
      return;
    }
    const current = get().categories;
    const exists = current.some((item) => item.id === category.id);
    set({
      categories: exists
        ? current.map((item) => item.id === category.id ? category : item)
        : [...current, category],
    });
  },
  deleteCategory: async (id) => {
    if (get().products.some((product) => product.categoryId === id)) {
      throw new Error("CATEGORY_IN_USE");
    }
    const client = sb();
    if (client) {
      await db.deleteCategory(client, id);
      await get().refresh();
      return;
    }
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
    }));
  },
  upsertProduct: async (product) => {
    const landingMap = getStoredLandingImagesMap();
    const landingImages =
      product.landingImages && product.landingImages.length > 0
        ? product.landingImages
        : landingMap[product.id] || landingMap[product.slug] || [];

    if (landingImages.length > 0) {
      saveLandingImagesMap(product.id, product.slug, landingImages);
    }

    const fullProduct: Product = {
      ...product,
      landingImages,
    };

    // 2. Always save locally immediately so user edits are never lost
    const current = get().products;
    const exists = current.some((p) => p.id === fullProduct.id || p.slug === fullProduct.slug);
    const updated = exists
      ? current.map((p) => (p.id === fullProduct.id || p.slug === fullProduct.slug ? fullProduct : p))
      : [fullProduct, ...current];
    set({ products: updated });
    saveProducts(updated);

    // 3. Sync to Supabase if connected
    const client = sb();
    if (client) {
      try {
        if (isPersistedProductId(fullProduct.id)) {
          await db.upsertProduct(client, fullProduct);
        } else {
          const inserted = await db.insertProductIfMissing(client, fullProduct);
          if (!inserted) {
            console.warn("Product exists on remote, keeping local edits.");
          }
        }
        await get().refresh().catch(() => {});
        // Re-ensure local landing images and edits remain active in state after refresh
        set((state) => ({
          products: state.products.map((p) =>
            p.id === fullProduct.id || p.slug === fullProduct.slug
              ? {
                  ...p,
                  landingImages:
                    fullProduct.landingImages && fullProduct.landingImages.length > 0
                      ? fullProduct.landingImages
                      : (landingMap[fullProduct.id] || landingMap[fullProduct.slug] || p.landingImages),
                  images:
                    fullProduct.images && fullProduct.images.length > 0
                      ? fullProduct.images
                      : p.images,
                  shippingConfig: fullProduct.shippingConfig || p.shippingConfig,
                  trackStock: fullProduct.trackStock !== undefined ? fullProduct.trackStock : p.trackStock,
                }
              : p
          ),
        }));
      } catch (err: unknown) {
        console.warn("Supabase upsert warning:", err);
      }
    }
  },
  importLocalProducts: async () => {
    const client = sb();
    if (!client) {
      throw new Error("Supabase is not configured; local products cannot be shared with customers.");
    }

    const candidates = getLocalProductsToImport(get().products, seedProducts);
    let imported = 0;
    let skipped = 0;
    const failed: Array<{ slug: string; message: string }> = [];

    for (const product of candidates) {
      try {
        const inserted = await db.insertProductIfMissing(client, product);
        if (inserted) imported += 1;
        else skipped += 1;
      } catch (error) {
        failed.push({
          slug: product.slug,
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    if (imported > 0) {
      try {
        await get().refresh();
      } catch (error) {
        failed.push({
          slug: "catalog-refresh",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return { imported, skipped, failed };
  },
  deleteProduct: async (id) => {
    const client = sb();
    if (client && isPersistedProductId(id)) {
      await db.deleteProduct(client, id);
      await get().refresh();
      return "deleted";
    }
    const updated = get().products.filter((p) => p.id !== id);
    set({ products: updated });
    saveProducts(updated);
    return "removed-local";
  },
  deleteAllProducts: async () => {
    const products = get().products;
    const client = sb();
    if (client && get().catalogLoadState !== "ready") {
      throw new Error("The database catalog must finish loading successfully before deleting all products.");
    }
    const persistedIds = [...new Set(products.filter((product) => isPersistedProductId(product.id)).map((product) => product.id))];
    const removedLocally = products.length - persistedIds.length;
    let deletedFromDatabase = 0;

    if (client && persistedIds.length > 0) {
      deletedFromDatabase = await db.deleteProducts(client, persistedIds);
    }

    set({ products: [] });
    saveProducts([]);
    if (client) {
      await get().refresh();
      if (get().products.length > 0) {
        throw new Error(
          "Some products remain in the database catalog. Verify admin permissions and reload before retrying.",
        );
      }
    }

    return { deletedFromDatabase, removedLocally };
  },
  toggleProductActive: async (id) => {
    const product = get().products.find((item) => item.id === id);
    if (!product) return;
    const active = product.active === false;
    const client = sb();
    if (client && isPersistedProductId(id)) {
      await db.updateProductActive(client, id, active);
      await get().refresh();
      return;
    }
    const updated = get().products.map((p) => (p.id === id ? { ...p, active } : p));
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
  updateOrder: async (order) => {
    const client = sb();
    if (client && UUID_RE.test(order.id)) {
      await db.updateOrderDetails(client, order);
    }
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
  updateOrderDelivery: async (id, deliveryData) => {
    const dispatchedAt = new Date().toISOString();
    const status = deliveryData.status || "shipped";
    const updated = get().orders.map((o) =>
      o.id === id
        ? {
            ...o,
            deliveryCompany: deliveryData.deliveryCompany,
            trackingCode: deliveryData.trackingCode,
            status,
            deliveryDispatchedAt: dispatchedAt,
            labelUrl: deliveryData.labelUrl || o.labelUrl,
          }
        : o
    );
    set({ orders: updated });
    saveOrders(updated);
    const client = sb();
    if (client && UUID_RE.test(id)) {
      await db.updateOrderDelivery(client, id, {
        deliveryCompany: deliveryData.deliveryCompany,
        trackingCode: deliveryData.trackingCode,
        status,
        dispatchedAt,
        labelUrl: deliveryData.labelUrl,
      });
    }
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
  recordProductView: async (productId: string) => {
    const products = get().products;
    const updated = products.map((p) =>
      p.id === productId ? { ...p, views: (p.views ?? 0) + 1 } : p
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
