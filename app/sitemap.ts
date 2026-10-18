import type { MetadataRoute } from "next";
import { categoryPath, getCategories, getProducts, productPath } from "@/lib/woo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const cats = await getCategories();
  const entries: MetadataRoute.Sitemap = [
    { url: `${site}/`, changeFrequency: "daily", priority: 1 },
    ...cats.map((c) => ({ url: `${site}${categoryPath(c, cats)}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];

  for (let page = 1; page <= 20; page++) {
    const { products, totalPages } = await getProducts({ page, perPage: 100 });
    for (const p of products) entries.push({ url: `${site}${productPath(p)}`, changeFrequency: "weekly", priority: 0.6 });
    if (page >= totalPages) break;
  }
  return entries;
}
