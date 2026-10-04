import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Category,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  ProductOffer,
  Profile,
  Review,
  AbandonedCheckout,
} from "@/types";
import type { PixelSettings } from "@/types/settings";
import { categories as seedCategories } from "@/lib/catalog/seed";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ---------- Rows ----------
interface CategoryRow {
  id: string;
  slug: string;
  name_fr: string;
  name_ar: string;
  description_fr: string;
  description_ar: string;
  image: string;
}

interface ProductRow {
  id: string;
  slug: string;
  name_fr: string;
  name_ar: string;
  description_fr: string;
  description_ar: string;
  category_id: string;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  active: boolean;
  featured: boolean;
  is_new: boolean;
  offers: ProductOffer[] | null;
  created_at: string;
}

interface ImageRow {
  id: string;
  product_id: string;
  url: string;
  alt_fr: string;
  alt_ar: string;
  position: number;
}

interface VariantRow {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  color_fr: string;
  color_ar: string;
  color_hex: string;
  stock: number;
  price: number | null;
}

interface ReviewRow {
  id: string;
  product_id: string;
  author: string;
  rating: number;
  comment_fr: string;
  comment_ar: string;
  created_at: string;
}

interface ProfileRow {
  id: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  wilaya: string | null;
  role: "customer" | "admin";
  created_at: string;
}

interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  name_fr: string;
  name_ar: string;
  size: string;
  color_fr: string;
  color_ar: string;
  image: string;
  unit_price: number;
  quantity: number;
}

interface OrderRow {
  id: string;
  reference: string;
  user_id: string | null;
  email: string;
  customer_name: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  notes: string | null;
  status: OrderStatus;
  payment_method: string;
  subtotal: number;
  shipping: number;
  total: number;
  delivery_company: string | null;
  tracking_code: string | null;
  delivery_dispatched_at: string | null;
  label_url: string | null;
  created_at: string;
  order_items?: OrderItemRow[];
}

// ---------- Mappers ----------
const mapCategory = (r: CategoryRow): Category => ({
  id: r.id,
  slug: r.slug,
  name: { fr: r.name_fr, ar: r.name_ar },
  description: { fr: r.description_fr, ar: r.description_ar },
  image: r.image,
});

function mapProduct(r: ProductRow, imgs: ImageRow[], vars: VariantRow[]): Product {
  const images = [...imgs]
    .sort((a, b) => a.position - b.position)
    .map((i) => ({ id: i.id, url: i.url, alt: { fr: i.alt_fr, ar: i.alt_ar } }));

  const variants = vars.map((v) => ({
    id: v.id,
    sku: v.sku,
    size: v.size,
    color: { fr: v.color_fr, ar: v.color_ar },
    colorHex: v.color_hex,
    stock: v.stock,
    price: v.price ?? undefined,
  }));

  const colorMap = new Map<string, { name: { fr: string; ar: string }; hex: string }>();
  for (const v of variants) {
    if (!colorMap.has(v.colorHex)) colorMap.set(v.colorHex, { name: v.color, hex: v.colorHex });
  }

  return {
    id: r.id,
    slug: r.slug,
    name: { fr: r.name_fr, ar: r.name_ar },
    description: { fr: r.description_fr, ar: r.description_ar },
    categoryId: r.category_id,
    price: r.price,
    compareAtPrice: r.compare_at_price ?? undefined,
    sku: r.sku ?? undefined,
    images,
    variants,
    sizes: [...new Set(variants.map((v) => v.size))],
    colors: [...colorMap.values()],
    offers: r.offers ?? [],
    active: r.active !== false,
    featured: r.featured,
    isNew: r.is_new,
    rating: 0,
    reviewCount: 0,
    createdAt: r.created_at,
  };
}

const mapReview = (r: ReviewRow): Review => ({
  id: r.id,
  productId: r.product_id,
  author: r.author,
  rating: r.rating,
  comment: { fr: r.comment_fr, ar: r.comment_ar },
  createdAt: r.created_at,
});

const mapProfile = (r: ProfileRow, email = ""): Profile => ({
  id: r.id,
  email,
  fullName: r.full_name,
  phone: r.phone ?? undefined,
  address: r.address ?? undefined,
  wilaya: r.wilaya ?? undefined,
  role: r.role,
  createdAt: r.created_at,
});

const mapOrderItem = (r: OrderItemRow): OrderItem => ({
  id: r.id,
  productId: r.product_id ?? "",
  variantId: r.variant_id ?? "",
  name: { fr: r.name_fr, ar: r.name_ar },
  size: r.size,
  color: { fr: r.color_fr, ar: r.color_ar },
  image: r.image,
  unitPrice: r.unit_price,
  quantity: r.quantity,
});

const mapOrder = (r: OrderRow): Order => ({
  id: r.id,
  reference: r.reference,
  userId: r.user_id ?? undefined,
  email: r.email,
  customerName: r.customer_name,
  phone: r.phone,
  wilaya: r.wilaya,
  commune: r.commune,
  address: r.address,
  notes: r.notes ?? undefined,
  status: r.status,
  paymentMethod: "cod",
  subtotal: r.subtotal,
  shipping: r.shipping,
  total: r.total,
  deliveryCompany: r.delivery_company ?? undefined,
  trackingCode: r.tracking_code ?? undefined,
  deliveryDispatchedAt: r.delivery_dispatched_at ?? undefined,
  labelUrl: r.label_url ?? undefined,
  createdAt: r.created_at,
  items: (r.order_items ?? []).map(mapOrderItem),
});

// ---------- Catalog ----------
export async function fetchCatalog(sb: SupabaseClient) {
  const [cats, prods, imgs, vars, revs] = await Promise.all([
    sb.from("categories").select("*").order("created_at"),
    sb.from("products").select("*").order("created_at", { ascending: false }),
    sb.from("product_images").select("*").order("position"),
    sb.from("product_variants").select("*"),
    sb.from("reviews").select("*"),
  ]);

  if (cats.error) throw cats.error;
  if (prods.error) throw prods.error;
  if (imgs.error) throw imgs.error;
  if (vars.error) throw vars.error;
  if (revs.error) throw revs.error;

  const imagesByProduct = new Map<string, ImageRow[]>();
  for (const i of (imgs.data ?? []) as ImageRow[]) {
    imagesByProduct.set(i.product_id, [...(imagesByProduct.get(i.product_id) ?? []), i]);
  }

  const variantsByProduct = new Map<string, VariantRow[]>();
  for (const v of (vars.data ?? []) as VariantRow[]) {
    variantsByProduct.set(v.product_id, [...(variantsByProduct.get(v.product_id) ?? []), v]);
  }

  const products = ((prods.data ?? []) as ProductRow[]).map((p) => {
    const product = mapProduct(p, imagesByProduct.get(p.id) ?? [], variantsByProduct.get(p.id) ?? []);
    const productReviews = ((revs.data ?? []) as ReviewRow[]).filter((r) => r.product_id === p.id);
    product.reviewCount = productReviews.length;
    product.rating = productReviews.length
      ? productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length
      : 0;
    return product;
  });

  const reviews = ((revs.data ?? []) as ReviewRow[]).map(mapReview);

  return {
    categories: ((cats.data ?? []) as CategoryRow[]).map(mapCategory),
    products,
    reviews,
  };
}

// ---------- Orders ----------
export async function placeOrder(
  sb: SupabaseClient,
  order: Order,
  checkoutSessionId?: string,
): Promise<string> {
  const payload = {
    checkout_session_id: checkoutSessionId ?? null,
    user_id: order.userId ?? null,
    email: order.email ?? "",
    customer_name: order.customerName,
    phone: order.phone,
    wilaya: order.wilaya,
    commune: order.commune,
    address: order.address,
    notes: order.notes ?? "",
    payment_method: order.paymentMethod,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    items: order.items.map((i) => ({
      product_id: i.productId,
      variant_id: i.variantId,
      name_fr: i.name.fr,
      name_ar: i.name.ar,
      size: i.size,
      color_fr: i.color.fr,
      color_ar: i.color.ar,
      image: i.image,
      unit_price: i.unitPrice,
      quantity: i.quantity,
    })),
  };
  let { data, error } = await sb.rpc("place_order_with_checkout", { payload });

  if (error?.code === "PGRST202") {
    ({ data, error } = await sb.rpc("place_order", { payload }));
    if (!error && checkoutSessionId) {
      const completion = await sb.rpc("complete_abandoned_checkout", {
        p_session_id: checkoutSessionId,
        p_order_reference: (data as { reference: string }).reference,
      });
      if (completion.error && completion.error.code !== "PGRST202") throw completion.error;
    }
  }

  if (error) throw error;
  return (data as { reference: string }).reference;
}

export async function fetchOrders(sb: SupabaseClient, opts: { all?: boolean } = {}) {
  let query = sb
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (!opts.all) {
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return [];
    query = query.eq("user_id", user.id); // RLS يضاعف الحماية
  }

  const { data, error } = await query;
  if (error) throw error;
  return ((data ?? []) as OrderRow[]).map(mapOrder);
}

export async function updateOrderStatus(sb: SupabaseClient, id: string, status: OrderStatus) {
  const { error } = await sb.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function updateOrderDelivery(
  sb: SupabaseClient,
  id: string,
  delivery: {
    deliveryCompany: string;
    trackingCode: string;
    status: OrderStatus;
    dispatchedAt: string;
    labelUrl?: string;
  },
) {
  const { error } = await sb
    .from("orders")
    .update({
      delivery_company: delivery.deliveryCompany,
      tracking_code: delivery.trackingCode,
      status: delivery.status,
      delivery_dispatched_at: delivery.dispatchedAt,
      label_url: delivery.labelUrl ?? null,
    })
    .eq("id", id);
  if (error) throw error;
}

// ---------- Products (admin) ----------
async function resolveProductCategoryId(
  sb: SupabaseClient,
  categoryId: string,
  categoryIdOverride?: string,
): Promise<string> {
  let resolvedCategoryId = categoryIdOverride ?? categoryId;
  if (!UUID_RE.test(resolvedCategoryId)) {
    const seedCategory = seedCategories.find((category) => category.id === resolvedCategoryId);
    if (seedCategory) {
      const { data: existingCategory, error: lookupError } = await sb
        .from("categories")
        .select("id")
        .eq("slug", seedCategory.slug)
        .maybeSingle();
      if (lookupError) throw lookupError;
      if (existingCategory) {
        resolvedCategoryId = existingCategory.id as string;
      } else {
        const { data: insertedCategory, error: insertError } = await sb
          .from("categories")
          .insert({
            slug: seedCategory.slug,
            name_fr: seedCategory.name.fr,
            name_ar: seedCategory.name.ar,
            description_fr: seedCategory.description.fr,
            description_ar: seedCategory.description.ar,
            image: seedCategory.image,
          })
          .select("id")
          .single();
        if (insertError) throw insertError;
        resolvedCategoryId = insertedCategory.id as string;
      }
    } else {
      const { data: cats, error } = await sb.from("categories").select("id").limit(1);
      if (error) throw error;
      resolvedCategoryId = cats?.[0]?.id ?? "";
      if (!resolvedCategoryId) throw new Error("No categories in DB — run the seed first");
    }
  }
  return resolvedCategoryId;
}

function productDatabaseRow(p: Product, categoryId: string): Record<string, unknown> {
  const row: Record<string, unknown> = {
    slug: p.slug,
    name_fr: p.name.fr,
    name_ar: p.name.ar,
    description_fr: p.description.fr,
    description_ar: p.description.ar,
    category_id: categoryId,
    price: p.price,
    compare_at_price: p.compareAtPrice ?? null,
    sku: p.sku ?? null,
    active: p.active !== false,
    featured: p.featured,
    is_new: p.isNew,
    offers: p.offers ?? [],
  };
  const persistedProduct = UUID_RE.test(p.id);
  if (persistedProduct) row.id = p.id;
  return row;
}

async function saveProductRelations(
  sb: SupabaseClient,
  productId: string,
  p: Product,
): Promise<void> {
  const { data: currentVariants, error: variantsError } = await sb
    .from("product_variants")
    .select("id")
    .eq("product_id", productId);
  if (variantsError) throw variantsError;

  const { error: imageDeleteError } = await sb
    .from("product_images")
    .delete()
    .eq("product_id", productId);
  if (imageDeleteError) throw imageDeleteError;
  if (p.images.length) {
    const { error: e } = await sb.from("product_images").insert(
      p.images.map((img, i) => ({
        product_id: productId,
        url: img.url,
        alt_fr: img.alt.fr,
        alt_ar: img.alt.ar,
        position: i,
      })),
    );
    if (e) throw e;
  }

  const currentVariantIds = new Set(
    ((currentVariants ?? []) as Array<{ id: string }>).map((variant) => variant.id),
  );
  const retainedVariantIds = new Set(
    p.variants
      .filter((variant) => currentVariantIds.has(variant.id))
      .map((variant) => variant.id),
  );
  const removedVariantIds = [...currentVariantIds].filter((id) => !retainedVariantIds.has(id));
  if (removedVariantIds.length) {
    const { error } = await sb.from("product_variants").delete().in("id", removedVariantIds);
    if (error) throw error;
  }

  const variantRows = p.variants.map((variant, index) => ({
    ...(retainedVariantIds.has(variant.id) ? { id: variant.id } : {}),
    product_id: productId,
    sku: retainedVariantIds.has(variant.id)
      ? variant.sku
      : `${variant.sku}-${index}-${Date.now().toString(36)}`.slice(0, 32),
    size: variant.size,
    color_fr: variant.color.fr,
    color_ar: variant.color.ar,
    color_hex: variant.colorHex,
    stock: variant.stock,
    price: variant.price ?? null,
  }));
  const existingRows = variantRows.filter((row) => "id" in row);
  const newRows = variantRows.filter((row) => !("id" in row));
  if (existingRows.length) {
    const { error } = await sb.from("product_variants").upsert(existingRows, { onConflict: "id" });
    if (error) throw error;
  }
  if (newRows.length) {
    const { error } = await sb.from("product_variants").insert(newRows);
    if (error) throw error;
  }
}

async function assertProductManagementSchema(sb: SupabaseClient): Promise<void> {
  const { error } = await sb
    .from("products")
    .select("id, sku, active, offers")
    .limit(0);
  if (!error) return;
  if (error.code === "42703") {
    throw new Error(
      "Product management schema is not installed. Apply supabase/migrations/0003_product_admin_fields.sql before saving or importing products.",
    );
  }
  throw error;
}

export async function upsertProduct(
  sb: SupabaseClient,
  p: Product,
  categoryIdOverride?: string,
): Promise<string> {
  await assertProductManagementSchema(sb);
  const categoryId = await resolveProductCategoryId(sb, p.categoryId, categoryIdOverride);
  const row = productDatabaseRow(p, categoryId);
  const persistedProduct = UUID_RE.test(p.id);
  const { data: prod, error } = await sb
    .from("products")
    .upsert(row, { onConflict: persistedProduct ? "id" : "slug" })
    .select("id")
    .single();
  if (error) throw error;
  const productId = prod.id as string;
  await saveProductRelations(sb, productId, p);
  return productId;
}

export async function insertProductIfMissing(
  sb: SupabaseClient,
  p: Product,
): Promise<boolean> {
  await assertProductManagementSchema(sb);
  const { data: existing, error: lookupError } = await sb
    .from("products")
    .select("id")
    .eq("slug", p.slug)
    .maybeSingle();
  if (lookupError) throw lookupError;
  if (existing) return false;

  const categoryId = await resolveProductCategoryId(sb, p.categoryId);
  const row = productDatabaseRow(p, categoryId);
  delete row.id;

  const { data: inserted, error: insertError } = await sb
    .from("products")
    .insert(row)
    .select("id")
    .single();
  if (insertError) {
    if (insertError.code === "23505") {
      const { data: duplicate, error } = await sb
        .from("products")
        .select("id")
        .eq("slug", p.slug)
        .maybeSingle();
      if (error) throw error;
      if (duplicate) return false;
    }
    throw insertError;
  }

  const productId = inserted.id as string;
  try {
    await saveProductRelations(sb, productId, p);
  } catch (error) {
    try {
      const { data: removedProduct, error: cleanupError } = await sb
        .from("products")
        .delete()
        .eq("id", productId)
        .select("id")
        .maybeSingle();
      if (cleanupError) {
        throw new Error(`Related product data failed and the product row could not be cleaned up: ${cleanupError.message}`);
      }
      if (!removedProduct) {
        throw new Error("The inserted product row remains because database permissions prevented cleanup.");
      }
    } catch (cleanupError) {
      throw new Error(
        `Related product data failed; cleanup also failed (${cleanupError instanceof Error ? cleanupError.message : "unknown cleanup error"}). Original error: ${error instanceof Error ? error.message : "unknown error"}`,
      );
    }
    throw error;
  }
  return true;
}

export async function deleteProduct(sb: SupabaseClient, id: string) {
  const { data, error } = await sb
    .from("products")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    throw new Error("Product was not deleted: it may not exist or the current account lacks admin permission.");
  }
}

export async function deleteProducts(sb: SupabaseClient, ids: string[]): Promise<number> {
  if (ids.length === 0) return 0;
  const invalidId = ids.find((id) => !UUID_RE.test(id));
  if (invalidId) throw new Error("Bulk product deletion received an invalid product ID.");
  const uniqueIds = [...new Set(ids)];
  const { data, error } = await sb
    .from("products")
    .delete()
    .in("id", uniqueIds)
    .select("id");
  if (error) throw error;
  const deleted = data?.length ?? 0;
  if (deleted !== uniqueIds.length) {
    throw new Error(
      `Only ${deleted} of ${uniqueIds.length} database products were deleted. Check admin permissions and refresh the catalog.`,
    );
  }
  return deleted;
}

export async function updateProductActive(sb: SupabaseClient, id: string, active: boolean) {
  await assertProductManagementSchema(sb);
  const { data, error } = await sb
    .from("products")
    .update({ active })
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    throw new Error("Product status was not updated: it may not exist or the current account lacks admin permission.");
  }
}

export async function setVariantStock(sb: SupabaseClient, variantId: string, stock: number) {
  const { data: current } = await sb
    .from("product_variants")
    .select("stock")
    .eq("id", variantId)
    .single();
  const { error } = await sb
    .from("product_variants")
    .update({ stock: Math.max(0, stock) })
    .eq("id", variantId);
  if (error) throw error;

  const delta = stock - (current?.stock ?? 0);
  if (delta !== 0) {
    await sb.from("inventory_movements").insert({
      variant_id: variantId,
      delta,
      reason: "admin update",
    });
  }
}

// ---------- Profiles ----------
export async function fetchProfile(sb: SupabaseClient, userId: string): Promise<Profile | null> {
  const { data } = await sb.from("profiles").select("*").eq("id", userId).single();
  if (!data) return null;
  const {
    data: { user },
  } = await sb.auth.getUser();
  return mapProfile(data as ProfileRow, user?.email ?? "");
}

export async function fetchPixelSettings(sb: SupabaseClient): Promise<PixelSettings> {
  const { data, error } = await sb
    .from("store_pixel_settings")
    .select("meta_pixel_ids, meta_pixel_enabled, tiktok_pixel_ids, tiktok_pixel_enabled")
    .eq("id", "default")
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    return {
      metaPixelIds: Array(6).fill(""),
      metaPixelEnabled: Array(6).fill(false),
      tiktokPixelIds: Array(4).fill(""),
      tiktokPixelEnabled: Array(4).fill(false),
    };
  }
  return {
    metaPixelIds: data.meta_pixel_ids as string[],
    metaPixelEnabled: data.meta_pixel_enabled as boolean[],
    tiktokPixelIds: data.tiktok_pixel_ids as string[],
    tiktokPixelEnabled: data.tiktok_pixel_enabled as boolean[],
  };
}

export async function savePixelSettings(sb: SupabaseClient, pixels: PixelSettings) {
  const { error } = await sb.from("store_pixel_settings").upsert(
    {
      id: "default",
      meta_pixel_ids: pixels.metaPixelIds,
      meta_pixel_enabled: pixels.metaPixelEnabled,
      tiktok_pixel_ids: pixels.tiktokPixelIds,
      tiktok_pixel_enabled: pixels.tiktokPixelEnabled,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  if (error) throw error;
}

export async function saveAbandonedCheckout(
  sb: SupabaseClient,
  draft: AbandonedCheckout,
) {
  const { error } = await sb.rpc("save_abandoned_checkout", {
    p_session_id: draft.sessionId,
    p_product_id: draft.productId,
    p_product_name: draft.productName,
    p_size: draft.size,
    p_color: draft.color,
    p_quantity: draft.quantity,
    p_value: draft.value,
    p_contact_consent: draft.contactConsent,
    p_customer_name: draft.customerName ?? null,
    p_phone: draft.phone ?? null,
    p_wilaya: draft.wilaya ?? null,
    p_commune: draft.commune ?? null,
  });
  if (error) throw error;
}

export async function completeAbandonedCheckout(
  sb: SupabaseClient,
  sessionId: string,
  orderReference: string,
) {
  const { error } = await sb.rpc("complete_abandoned_checkout", {
    p_session_id: sessionId,
    p_order_reference: orderReference,
  });
  if (error) throw error;
}

interface AbandonedCheckoutRow {
  session_id: string;
  product_id: string;
  product_name: string;
  size: string;
  color: string;
  quantity: number;
  value: number;
  contact_consent: boolean;
  customer_name: string | null;
  phone: string | null;
  wilaya: string | null;
  commune: string | null;
  created_at: string;
  expires_at: string;
}

export async function fetchAbandonedCheckouts(sb: SupabaseClient): Promise<AbandonedCheckout[]> {
  const { data, error } = await sb
    .from("abandoned_checkouts")
    .select("session_id, product_id, product_name, size, color, quantity, value, contact_consent, customer_name, phone, wilaya, commune, created_at, expires_at")
    .eq("status", "open")
    .gt("expires_at", new Date().toISOString())
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as AbandonedCheckoutRow[]).map((row) => ({
    sessionId: row.session_id,
    productId: row.product_id,
    productName: row.product_name,
    size: row.size,
    color: row.color,
    quantity: row.quantity,
    value: row.value,
    contactConsent: row.contact_consent,
    customerName: row.customer_name ?? undefined,
    phone: row.phone ?? undefined,
    wilaya: row.wilaya ?? undefined,
    commune: row.commune ?? undefined,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
  }));
}

// ---------- One-time seed from src/lib/catalog/seed.ts ----------
export async function seedCatalog(
  sb: SupabaseClient,
  categories: Category[],
  products: Product[],
) {
  const idBySlug = new Map<string, string>();
  for (const c of categories) {
    const row: Record<string, unknown> = {
      slug: c.slug,
      name_fr: c.name.fr,
      name_ar: c.name.ar,
      description_fr: c.description.fr,
      description_ar: c.description.ar,
      image: c.image,
    };
    if (UUID_RE.test(c.id)) row.id = c.id;
    const { data, error } = await sb
      .from("categories")
      .upsert(row, { onConflict: "slug" })
      .select("id")
      .single();
    if (error) throw error;
    idBySlug.set(c.slug, data.id as string);
  }

  for (const p of products) {
    const cat = categories.find((c) => c.id === p.categoryId);
    await upsertProduct(sb, p, cat ? idBySlug.get(cat.slug) : undefined);
  }
}
