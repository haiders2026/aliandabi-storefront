import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/BuyBox";
import { Gallery } from "@/components/Gallery";
import { ProductGrid } from "@/components/ProductCard";
import { categoryPath, decodeEntities, getCategories, getProductBySlug, getProducts, getReviews, productPath } from "@/lib/woo";
import { Reviews } from "@/components/Reviews";

type Props = { params: Promise<{ path: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;
  const product = await getProductBySlug(path[path.length - 1]);
  if (!product) return {};
  const text = decodeEntities(product.short_description.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  return {
    title: decodeEntities(product.name),
    description: text.slice(0, 160),
    alternates: { canonical: productPath(product) },
    openGraph: { images: product.images[0] ? [product.images[0].src] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const { path } = await params;
  const product = await getProductBySlug(path[path.length - 1]);
  if (!product) notFound();

  const [cats, related, reviews] = await Promise.all([
    getCategories(),
    product.categories[0] ? getProducts({ category: product.categories[0].slug, perPage: 5 }) : Promise.resolve({ products: [] }),
    getReviews(product.id),
  ]);

  const name = decodeEntities(product.name);
  const crumbCat = product.categories.map((c) => cats.find((x) => x.id === c.id)).find(Boolean);
  const variationAttributes = product.attributes
    .filter((a) => a.has_variations)
    .map((a) => ({ name: a.name, terms: a.terms.map((t) => ({ name: decodeEntities(t.name), slug: t.slug })) }));
  const specs = product.attributes.filter((a) => !a.has_variations && a.terms.length);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    sku: product.sku || undefined,
    image: product.images.map((i) => i.src),
    description: decodeEntities(product.short_description.replace(/<[^>]+>/g, " ")).trim(),
    ...(reviews.length
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (reviews.reduce((n, r) => n + r.rating, 0) / reviews.length).toFixed(1),
            reviewCount: reviews.length,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: product.prices.currency_code,
      price: (Number(product.prices.price) / 10 ** product.prices.currency_minor_unit).toFixed(product.prices.currency_minor_unit),
      availability: product.is_in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        {crumbCat && (
          <>
            {" / "}
            <Link href={categoryPath(crumbCat, cats)}>{decodeEntities(crumbCat.name)}</Link>
          </>
        )}
      </nav>

      <div className="product">
        <Gallery images={product.images} name={name} />
        <div className="product-info">
          <h1>{name}</h1>
          {product.sku && <p className="muted">SKU {product.sku}</p>}
          <BuyBox
            productId={product.id}
            name={name}
            href={productPath(product)}
            image={product.images[0]?.thumbnail ?? product.images[0]?.src}
            type={product.type}
            prices={product.prices}
            onSale={product.on_sale}
            inStock={product.is_in_stock}
            purchasable={product.is_purchasable}
            variationAttributes={variationAttributes}
            variations={product.variations}
          />
          <ul className="perks">
            <li>Free insured shipping on orders over $100</li>
            <li>30-day returns, no questions asked</li>
            <li>Lifetime warranty</li>
          </ul>
        </div>
      </div>

      <section className="product-details">
        <h2>Description</h2>
        <div className="prose" dangerouslySetInnerHTML={{ __html: product.description || product.short_description }} />
        {specs.length > 0 && (
          <>
            <h2>Details</h2>
            <table className="specs">
              <tbody>
                {specs.map((a) => (
                  <tr key={a.id}>
                    <th>{decodeEntities(a.name)}</th>
                    <td>{a.terms.map((t) => decodeEntities(t.name)).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>

      <Reviews reviews={reviews} writeUrl={`${product.permalink}#reviews`} />

      {related.products.filter((p) => p.id !== product.id).length > 0 && (
        <section>
          <h2>You may also like</h2>
          <ProductGrid products={related.products.filter((p) => p.id !== product.id).slice(0, 4)} />
        </section>
      )}
    </div>
  );
}
