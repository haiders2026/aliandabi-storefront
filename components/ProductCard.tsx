import Image from "next/image";
import Link from "next/link";
import { decodeEntities, formatMoney, productPath, type WooProduct } from "@/lib/woo";

export function Price({ prices, onSale }: { prices: WooProduct["prices"]; onSale: boolean }) {
  const sale = onSale && prices.sale_price && prices.sale_price !== prices.regular_price;
  return (
    <span className="price">
      {sale ? (
        <>
          <del>{formatMoney(prices.regular_price, prices)}</del> <ins>{formatMoney(prices.price, prices)}</ins>
        </>
      ) : (
        formatMoney(prices.price, prices)
      )}
    </span>
  );
}

export function ProductCard({ product, priority = false }: { product: WooProduct; priority?: boolean }) {
  const img = product.images[0];
  return (
    <article className="card">
      <Link href={productPath(product)} className="card-media">
        {img ? (
          <Image
            src={img.src}
            alt={img.alt || decodeEntities(product.name)}
            width={600}
            height={600}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
          />
        ) : (
          <div className="card-placeholder" />
        )}
        {product.on_sale && <span className="badge">Sale</span>}
      </Link>
      <h3 className="card-title">
        <Link href={productPath(product)}>{decodeEntities(product.name)}</Link>
      </h3>
      <Price prices={product.prices} onSale={product.on_sale} />
    </article>
  );
}

export function ProductGrid({ products }: { products: WooProduct[] }) {
  if (!products.length) return <p className="empty">No products found.</p>;
  return (
    <div className="grid">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  );
}
