import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Category,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  Profile,
  Review,
} from "@/types";

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
  featured: boolean;
  is_new: boolean;
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
    images,
    variants,
    sizes: [...new Set(variants.map((v) => v.size))],
    colors: [...colorMap.values()],
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
export async function placeOrder(sb: SupabaseClient, order: Order): Promise<string> {
  const { data, error } = await sb.rpc("place_order", {
    payload: {
      user_id: order.userId ?? null,
      email: order.email,
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
    },
  });

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

// ---------- Products (admin) ----------
export async function upsertProduct(
  sb: SupabaseClient,
  p: Product,
  categoryIdOverride?: string,
): Promise<string> {
  let categoryId = categoryIdOverride ?? p.categoryId;
  if (!UUID_RE.test(categoryId)) {
    const { data: cats } = await sb.from("categories").select("id").limit(1);
    categoryId = cats?.[0]?.id ?? "";
    if (!categoryId) throw new Error("No categories in DB — run the seed first");
  }

  const row: Record<string, unknown> = {
    slug: p.slug,
    name_fr: p.name.fr,
    name_ar: p.name.ar,
    description_fr: p.description.fr,
    description_ar: p.description.ar,
    category_id: categoryId,
    price: p.price,
    compare_at_price: p.compareAtPrice ?? null,
    featured: p.featured,
    is_new: p.isNew,
  };
  if (UUID_RE.test(p.id)) row.id = p.id;

  const { data: prod, error } = await sb.from("products").upsert(row).select("id").single();
  if (error) throw error;
  const productId = prod.id as string;

  await sb.from("product_images").delete().eq("product_id", productId);
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

  await sb.from("product_variants").delete().eq("product_id", productId);
  if (p.variants.length) {
    const { error: e } = await sb.from("product_variants").insert(
      p.variants.map((v, i) => ({
        product_id: productId,
        sku: UUID_RE.test(v.id) ? v.sku : `${v.sku}-${i}-${Date.now().toString(36)}`.slice(0, 32),
        size: v.size,
        color_fr: v.color.fr,
        color_ar: v.color.ar,
        color_hex: v.colorHex,
        stock: v.stock,
        price: v.price ?? null,
      })),
    );
    if (e) throw e;
  }

  return productId;
}

export async function deleteProduct(sb: SupabaseClient, id: string) {
  const { error } = await sb.from("products").delete().eq("id", id);
  if (error) throw error;
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
