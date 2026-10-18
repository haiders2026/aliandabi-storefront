// Thin client for the WooCommerce Store API (public, no keys needed for catalog reads).
// Every call fails soft (returns an empty result) so builds and pages never crash if WooCommerce is unreachable.

export const WC_BASE = (process.env.WC_BASE_URL ?? "https://www.aliandabi.com").replace(/\/$/, "");
export const WC_PUBLIC_BASE = (process.env.NEXT_PUBLIC_WC_BASE_URL ?? WC_BASE).replace(/\/$/, "");
const STORE = `${WC_BASE}/wp-json/wc/store/v1`;
const WP = `${WC_BASE}/wp-json/wp/v2`;
const REVALIDATE_SECONDS = 300;

export type Money = {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
};

export type WooImage = { id: number; src: string; thumbnail: string; alt: string; name?: string };

export type WooAttribute = {
  id: number;
  name: string;
  taxonomy: string;
  has_variations: boolean;
  terms: { id: number; name: string; slug: string }[];
};

export type WooVariation = { id: number; attributes: { name: string; value: string }[] };

export type WooProduct = {
  id: number;
  name: string;
  slug: string;
  type: string;
  permalink: string;
  sku: string;
  short_description: string;
  description: string;
  on_sale: boolean;
  prices: Money;
  images: WooImage[];
  categories: { id: number; name: string; slug: string; link: string }[];
  attributes: WooAttribute[];
  variations: WooVariation[];
  is_purchasable: boolean;
  is_in_stock: boolean;
};

export type WooCategory = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
  description: string;
  image: { src: string; alt: string } | null;
  permalink: string;
};

export type WpPage = { id: number; slug: string; title: { rendered: string }; content: { rendered: string } };

async function getJson<T>(url: string, fallback: T): Promise<{ data: T; headers: Headers | null }> {
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return { data: fallback, headers: null };
    return { data: (await res.json()) as T, headers: res.headers };
  } catch {
    return { data: fallback, headers: null };
  }
}

export function decodeEntities(input: string): string {
  return input
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

export function formatMoney(
  value: string | number,
  m: Pick<Money, "currency_symbol" | "currency_minor_unit">,
): string {
  const n = Number(value) / 10 ** m.currency_minor_unit;
  const digits = m.currency_minor_unit;
  return `${decodeEntities(m.currency_symbol)}${n.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

export type ProductQuery = {
  category?: string; // category slug or id
  search?: string;
  page?: number;
  perPage?: number;
  orderby?: "date" | "price" | "title" | "popularity" | "rating";
  order?: "asc" | "desc";
  featured?: boolean;
  onSale?: boolean;
};

export async function getProducts(opts: ProductQuery = {}) {
  const q = new URLSearchParams();
  q.set("per_page", String(opts.perPage ?? 24));
  q.set("page", String(opts.page ?? 1));
  if (opts.category) q.set("category", opts.category);
  if (opts.search) q.set("search", opts.search);
  if (opts.orderby) q.set("orderby", opts.orderby);
  if (opts.order) q.set("order", opts.order);
  if (opts.featured) q.set("featured", "true");
  if (opts.onSale) q.set("on_sale", "true");
  const { data, headers } = await getJson<WooProduct[]>(`${STORE}/products?${q}`, []);
  const products = Array.isArray(data) ? data : [];
  return {
    products,
    totalPages: Number(headers?.get("x-wp-totalpages") ?? 1) || 1,
    total: Number(headers?.get("x-wp-total") ?? products.length) || 0,
  };
}

export async function getProductBySlug(slug: string): Promise<WooProduct | null> {
  const { data } = await getJson<WooProduct[]>(`${STORE}/products?slug=${encodeURIComponent(slug)}`, []);
  return Array.isArray(data) && data.length ? data[0] : null;
}

export async function getProductById(id: number): Promise<WooProduct | null> {
  const { data } = await getJson<WooProduct | null>(`${STORE}/products/${id}`, null);
  return data && typeof data === "object" && "id" in data ? data : null;
}

export async function getCategories(): Promise<WooCategory[]> {
  const { data } = await getJson<WooCategory[]>(`${STORE}/products/categories?per_page=100`, []);
  return Array.isArray(data) ? data : [];
}

/** Builds the same path WooCommerce uses, e.g. /product-category/all_jewelry/engagement_rings */
export function categoryPath(cat: WooCategory, all: WooCategory[]): string {
  const parts = [cat.slug];
  let cur = cat;
  while (cur.parent) {
    const parent = all.find((c) => c.id === cur.parent);
    if (!parent) break;
    parts.unshift(parent.slug);
    cur = parent;
  }
  return `/product-category/${parts.join("/")}`;
}

/** Keeps the existing WooCommerce product URL structure so SEO is preserved after the switch. */
export function productPath(p: Pick<WooProduct, "permalink" | "slug">): string {
  try {
    return new URL(p.permalink).pathname.replace(/\/$/, "") || `/shop/${p.slug}`;
  } catch {
    return `/shop/${p.slug}`;
  }
}

export async function getWpPage(slug: string): Promise<WpPage | null> {
  const { data } = await getJson<WpPage[]>(`${WP}/pages?slug=${encodeURIComponent(slug)}`, []);
  return Array.isArray(data) && data.length ? data[0] : null;
}
