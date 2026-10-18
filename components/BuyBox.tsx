"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "./CartProvider";

type Attr = { name: string; terms: { name: string; slug: string }[] };
type Variation = { id: number; attributes: { name: string; value: string }[] };
type PriceBlock = { price: string; regular_price: string; sale_price: string; currency_symbol: string; currency_minor_unit: number };

export type BuyBoxProps = {
  productId: number;
  name: string;
  href: string;
  image?: string;
  type: string;
  prices: PriceBlock;
  onSale: boolean;
  inStock: boolean;
  purchasable: boolean;
  variationAttributes: Attr[]; // only attributes that drive variations
  variations: Variation[];
};

function money(value: string, p: PriceBlock) {
  const n = Number(value) / 10 ** p.currency_minor_unit;
  return `${p.currency_symbol}${n.toLocaleString("en-US", {
    minimumFractionDigits: p.currency_minor_unit,
    maximumFractionDigits: p.currency_minor_unit,
  })}`;
}

export function BuyBox(props: BuyBoxProps) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [variationPrices, setVariationPrices] = useState<PriceBlock | null>(null);
  const [added, setAdded] = useState(false);

  const isVariable = props.type === "variable" && props.variationAttributes.length > 0;

  const matched = useMemo(() => {
    if (!isVariable) return null;
    if (props.variationAttributes.some((a) => !selected[a.name])) return null;
    return (
      props.variations.find((v) =>
        v.attributes.every((va) => {
          const chosen = selected[va.name];
          return !va.value || (chosen && chosen.toLowerCase() === va.value.toLowerCase());
        }),
      ) ?? null
    );
  }, [isVariable, props.variationAttributes, props.variations, selected]);

  useEffect(() => {
    setVariationPrices(null);
    if (!matched) return;
    let cancelled = false;
    fetch(`/api/variation/${matched.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { prices?: PriceBlock } | null) => {
        if (!cancelled && data?.prices) setVariationPrices(data.prices);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [matched]);

  const activePrices = variationPrices ?? props.prices;
  const sale = activePrices.sale_price && activePrices.sale_price !== activePrices.regular_price;
  const canAdd = props.inStock && props.purchasable && (!isVariable || Boolean(matched));

  function handleAdd() {
    if (!canAdd) return;
    const label = isVariable
      ? props.variationAttributes.map((a) => `${a.name}: ${a.terms.find((t) => t.slug === selected[a.name])?.name ?? selected[a.name]}`).join(", ")
      : undefined;
    add({
      productId: props.productId,
      variationId: matched?.id ?? 0,
      qty,
      name: props.name,
      unitMinor: Number(activePrices.price),
      minorUnit: activePrices.currency_minor_unit,
      symbol: activePrices.currency_symbol,
      image: props.image,
      href: props.href,
      label,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="buybox">
      <p className="price price-large">
        {isVariable && !matched && !variationPrices ? (
          <span className="muted">Choose options to see price</span>
        ) : sale ? (
          <>
            <del>{money(activePrices.regular_price, activePrices)}</del> <ins>{money(activePrices.price, activePrices)}</ins>
          </>
        ) : (
          money(activePrices.price, activePrices)
        )}
      </p>

      {isVariable &&
        props.variationAttributes.map((attr) => (
          <label key={attr.name} className="field">
            <span>{attr.name}</span>
            <select value={selected[attr.name] ?? ""} onChange={(e) => setSelected((s) => ({ ...s, [attr.name]: e.target.value }))}>
              <option value="">Choose an option</option>
              {attr.terms.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
        ))}

      <div className="buy-row">
        <div className="qty">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
          <span aria-live="polite">{qty}</span>
          <button type="button" onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase quantity">+</button>
        </div>
        <button type="button" className="btn btn-primary" disabled={!canAdd} onClick={handleAdd}>
          {!props.inStock ? "Out of stock" : "Add to cart"}
        </button>
      </div>

      {added && (
        <p className="added" role="status">
          Added to cart. <Link href="/cart">View cart</Link>
        </p>
      )}
    </div>
  );
}
