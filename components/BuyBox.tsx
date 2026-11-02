"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { ShapeIcon } from "./ShapeIcon";

type Attr = { name: string; terms: { name: string; slug: string }[] };
type Variation = { id: number; attributes: { name: string; value: string }[] };
type PriceBlock = { price: string; regular_price: string; sale_price: string; currency_symbol: string; currency_minor_unit: number };
type VariationImage = { id: number; src: string; thumbnail: string; alt: string };
type VariationData = { prices?: PriceBlock; image?: VariationImage | null; sku?: string };

// Fill colors for metal swatches, matched on the term name or slug.
const METAL_FILLS: [RegExp, string][] = [
  [/rose/i, "linear-gradient(135deg, #f6d3c4, #d99a83 55%, #b9735d)"],
  [/yellow|gold/i, "linear-gradient(135deg, #f8e7a8, #d8b25a 55%, #b58d35)"],
  [/two.?tone/i, "linear-gradient(135deg, #f1f1f1 50%, #d8b25a 50%)"],
  [/white|platinum|silver/i, "linear-gradient(135deg, #ffffff, #dcdcdc 55%, #b8b8b8)"],
  [/black/i, "linear-gradient(135deg, #555, #222)"],
];

function swatchKind(attrName: string): "color" | "shape" | "text" {
  if (/colou?r|metal/i.test(attrName)) return "color";
  if (/shape/i.test(attrName)) return "shape";
  return "text";
}

function same(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase();
}

// A variation fits the current choices if every chosen attribute matches (an empty value means "any").
function fits(v: Variation, chosen: Record<string, string>) {
  return Object.entries(chosen).every(([name, slug]) => {
    const va = v.attributes.find((a) => same(a.name, name));
    return !va || !va.value || same(va.value, slug);
  });
}

export type BuyBoxProps = {
  productId: number;
  name: string;
  sku?: string;
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
  const [variationSku, setVariationSku] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const isVariable = props.type === "variable" && props.variationAttributes.length > 0;
  const cache = useRef(new Map<number, Promise<VariationData | null>>());

  function loadVariation(id: number) {
    let p = cache.current.get(id);
    if (!p) {
      p = fetch(`/api/variation/${id}`)
        .then((r) => (r.ok ? (r.json() as Promise<VariationData>) : null))
        .catch(() => null);
      cache.current.set(id, p);
    }
    return p;
  }

  const allChosen = isVariable && props.variationAttributes.every((a) => selected[a.name]);

  const matched = useMemo(() => {
    if (!allChosen) return null;
    return props.variations.find((v) => fits(v, selected)) ?? null;
  }, [allChosen, props.variations, selected]);

  // For the picture, the first variation that fits what has been chosen so far
  // (so picking only a metal color already switches the image).
  const preview = useMemo(() => {
    if (!isVariable || !Object.keys(selected).length) return null;
    return matched ?? props.variations.find((v) => fits(v, selected)) ?? null;
  }, [isVariable, matched, props.variations, selected]);

  useEffect(() => {
    if (!preview) return;
    let cancelled = false;
    loadVariation(preview.id).then((data) => {
      if (!cancelled && data?.image?.src) {
        window.dispatchEvent(new CustomEvent("aa:variation-image", { detail: data.image }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [preview]);

  useEffect(() => {
    setVariationPrices(null);
    setVariationSku(null);
    if (!matched) return;
    let cancelled = false;
    loadVariation(matched.id).then((data) => {
      if (cancelled) return;
      if (data?.prices) setVariationPrices(data.prices);
      if (data?.sku) setVariationSku(data.sku);
    });
    return () => {
      cancelled = true;
    };
  }, [matched]);

  function choose(attr: string, slug: string) {
    setSelected((s) => {
      const next = { ...s, [attr]: slug };
      if (s[attr] === slug) delete next[attr]; // clicking the chosen swatch again clears it
      return next;
    });
  }

  // An option is available if some variation fits it together with the other choices.
  function available(attr: string, slug: string) {
    const others = { ...selected, [attr]: slug };
    return props.variations.some((v) => fits(v, others));
  }

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
      {(variationSku || props.sku) && <p className="muted sku">SKU {variationSku || props.sku}</p>}
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
        props.variationAttributes.map((attr) => {
          const kind = swatchKind(attr.name);
          const chosen = attr.terms.find((t) => t.slug === selected[attr.name]);
          return (
            <div key={attr.name} className="field" role="radiogroup" aria-label={attr.name}>
              <span>
                {attr.name}
                {chosen && <b className="field-value">: {chosen.name}</b>}
              </span>
              <div className={`swatches swatches-${kind}`}>
                {attr.terms.map((t) => {
                  const on = selected[attr.name] === t.slug;
                  const ok = available(attr.name, t.slug);
                  const fill = kind === "color" ? METAL_FILLS.find(([re]) => re.test(t.name) || re.test(t.slug))?.[1] : undefined;
                  const icon = kind === "shape" ? <ShapeIcon shape={t.slug || t.name} /> : null;
                  return (
                    <button
                      key={t.slug}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      aria-label={t.name}
                      title={t.name}
                      disabled={!ok}
                      className={`swatch${on ? " is-on" : ""}${fill ? " swatch-fill" : ""}`}
                      onClick={() => choose(attr.name, t.slug)}
                    >
                      {fill ? (
                        <i style={{ background: fill }} />
                      ) : icon ? (
                        <>
                          {icon}
                          <small>{t.name}</small>
                        </>
                      ) : (
                        t.name
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

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
