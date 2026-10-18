import Link from "next/link";
import { getProducts, type ProductQuery } from "@/lib/woo";
import { ProductGrid } from "./ProductCard";

const SORTS: Record<string, { label: string; orderby: ProductQuery["orderby"]; order: ProductQuery["order"] }> = {
  newest: { label: "Newest", orderby: "date", order: "desc" },
  "price-asc": { label: "Price: low to high", orderby: "price", order: "asc" },
  "price-desc": { label: "Price: high to low", orderby: "price", order: "desc" },
  name: { label: "Name", orderby: "title", order: "asc" },
};

export function parseListingParams(sp: { page?: string; sort?: string }) {
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const sort = sp.sort && SORTS[sp.sort] ? sp.sort : "newest";
  return { page, sort };
}

function href(basePath: string, params: Record<string, string | number | undefined>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") q.set(k, String(v));
  const s = q.toString();
  return s ? `${basePath}?${s}` : basePath;
}

export async function Listing({
  basePath,
  page,
  sort,
  category,
  search,
}: {
  basePath: string;
  page: number;
  sort: string;
  category?: string;
  search?: string;
}) {
  const s = SORTS[sort];
  const { products, totalPages, total } = await getProducts({
    category,
    search,
    page,
    perPage: 24,
    orderby: s.orderby,
    order: s.order,
  });
  const extra = search ? { q: search } : {};

  return (
    <section>
      <div className="listing-bar">
        <span className="muted">{total} {total === 1 ? "piece" : "pieces"}</span>
        <div className="sorts" aria-label="Sort">
          {Object.entries(SORTS).map(([key, v]) => (
            <Link key={key} href={href(basePath, { ...extra, sort: key === "newest" ? undefined : key })} className={key === sort ? "active" : ""}>
              {v.label}
            </Link>
          ))}
        </div>
      </div>
      <ProductGrid products={products} />
      {totalPages > 1 && (
        <nav className="pagination" aria-label="Pagination">
          {page > 1 && <Link href={href(basePath, { ...extra, sort: sort === "newest" ? undefined : sort, page: page - 1 })}>← Previous</Link>}
          <span>
            Page {page} of {totalPages}
          </span>
          {page < totalPages && <Link href={href(basePath, { ...extra, sort: sort === "newest" ? undefined : sort, page: page + 1 })}>Next →</Link>}
        </nav>
      )}
    </section>
  );
}
