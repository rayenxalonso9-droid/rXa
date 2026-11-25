import { createClient } from "./supabase/server";
import type { Product, Category, Collection, Review, Order } from "./types";
import { sampleProducts, sampleCategories, sampleCollections } from "./sample-data";

function hasSupabase() {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

export async function getProducts(opts?: { featured?: boolean; bestseller?: boolean; category?: string; collection?: string; search?: string; sort?: string; limit?: number }) {
  if (!hasSupabase()) {
    let list = [...sampleProducts];
    if (opts?.featured) list = list.filter((p) => p.featured);
    if (opts?.bestseller) list = list.filter((p) => p.bestseller);
    if (opts?.category) list = list.filter((p) => p.category_id === opts.category);
    if (opts?.collection) list = list.filter((p) => p.collection_id === opts.collection);
    if (opts?.search) {
      const q = opts.search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (opts?.sort === "price-asc") list.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
    if (opts?.sort === "price-desc") list.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
    if (opts?.sort === "newest") list.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    if (opts?.limit) list = list.slice(0, opts.limit);
    return list;
  }
  const supabase = await createClient();
  let q = supabase.from("products").select("*, categories(*), collections(*)").eq("status", "active");
  if (opts?.featured) q = q.eq("featured", true);
  if (opts?.bestseller) q = q.eq("bestseller", true);
  if (opts?.category) q = q.eq("category_id", opts.category);
  if (opts?.collection) q = q.eq("collection_id", opts.collection);
  if (opts?.search) q = q.ilike("name", `%${opts.search}%`);
  if (opts?.sort === "price-asc") q = q.order("price", { ascending: true });
  else if (opts?.sort === "price-desc") q = q.order("price", { ascending: false });
  else q = q.order("created_at", { ascending: false });
  if (opts?.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) {
    console.error(error);
    return sampleProducts;
  }
  return (data ?? []).map(mapProduct);
}

function mapProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    price: Number(row.price),
    sale_price: row.sale_price != null ? Number(row.sale_price) : null,
    category_id: row.category_id,
    collection_id: row.collection_id,
    images: row.images ?? [],
    available_sizes: row.available_sizes ?? [],
    available_colors: row.available_colors ?? [],
    stock_quantity: row.stock_quantity ?? 0,
    featured: !!row.featured,
    bestseller: !!row.bestseller,
    status: row.status ?? "active",
    created_at: row.created_at,
    category: row.categories ? { id: row.categories.id, name: row.categories.name, slug: row.categories.slug, description: row.categories.description, image_url: row.categories.image_url } : null,
    collection: row.collections ? { id: row.collections.id, name: row.collections.name, slug: row.collections.slug, description: row.collections.description, banner_url: row.collections.banner_url, status: row.collections.status } : null,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!hasSupabase()) {
    return sampleProducts.find((p) => p.slug === slug) ?? null;
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*, categories(*), collections(*)").eq("slug", slug).single();
  if (error || !data) return null;
  return mapProduct(data);
}

export async function getCategories(): Promise<Category[]> {
  if (!hasSupabase()) return sampleCategories;
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  return (data ?? []).map((r: any) => ({ id: r.id, name: r.name, slug: r.slug, description: r.description, image_url: r.image_url }));
}

export async function getCollections(): Promise<Collection[]> {
  if (!hasSupabase()) return sampleCollections;
  const supabase = await createClient();
  const { data } = await supabase.from("collections").select("*").eq("status", "active");
  return (data ?? []).map((r: any) => ({ id: r.id, name: r.name, slug: r.slug, description: r.description, banner_url: r.banner_url, status: r.status }));
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const cols = await getCollections();
  return cols.find((c) => c.slug === slug) ?? null;
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  if (!hasSupabase()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("reviews").select("*, customers(full_name)").eq("product_id", productId).order("created_at", { ascending: false });
  return (data ?? []).map((r: any) => ({ id: r.id, customer_id: r.customer_id, product_id: r.product_id, rating: r.rating, comment: r.comment, created_at: r.created_at, author: r.customers?.full_name ?? "Anonymous" }));
}

export async function getOrdersForUser(userId: string): Promise<Order[]> {
  if (!hasSupabase()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("orders").select("*, order_items(*)").eq("customer_id", userId).order("created_at", { ascending: false });
  return (data ?? []).map((r: any) => ({
    id: r.id,
    customer_id: r.customer_id,
    total_amount: Number(r.total_amount),
    shipping_address: r.shipping_address,
    payment_method: r.payment_method,
    payment_status: r.payment_status,
    order_status: r.order_status,
    created_at: r.created_at,
    items: (r.order_items ?? []).map((i: any) => ({ id: i.id, order_id: i.order_id, product_id: i.product_id, product_name: i.product_name, size: i.size, color: i.color, quantity: i.quantity, unit_price: Number(i.unit_price) })),
  }));
}
