"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

function fmt(minor: number, minorUnit: number, symbol: string) {
  return `${symbol}${(minor / 10 ** minorUnit).toLocaleString("en-US", {
    minimumFractionDigits: minorUnit,
    maximumFractionDigits: minorUnit,
  })}`;
}

export default function CartPage() {
  const { items, ready, subtotalMinor, setQty, remove, checkoutUrl } = useCart();
  const sample = items[0];

  if (!ready) return <div className="container section"><p className="muted">Loading your cart…</p></div>;

  if (!items.length) {
    return (
      <div className="container section center">
        <h1>Your cart is empty</h1>
        <p>
          <Link href="/product-category/all_jewelry" className="btn btn-primary">
            Continue shopping
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1>Cart</h1>
      <div className="cart">
        <ul className="cart-lines">
          {items.map((i) => (
            <li key={i.key}>
              {i.image ? <Image src={i.image} alt="" width={96} height={96} /> : <div className="card-placeholder" style={{ width: 96, height: 96 }} />}
              <div>
                <Link href={i.href}>{i.name}</Link>
                {i.label && <p className="muted">{i.label}</p>}
                <p>{fmt(i.unitMinor, i.minorUnit, i.symbol)}</p>
                <div className="qty">
                  <button type="button" onClick={() => setQty(i.key, i.qty - 1)} aria-label="Decrease quantity">−</button>
                  <span>{i.qty}</span>
                  <button type="button" onClick={() => setQty(i.key, i.qty + 1)} aria-label="Increase quantity">+</button>
                </div>
              </div>
              <div className="line-total">
                <strong>{fmt(i.unitMinor * i.qty, i.minorUnit, i.symbol)}</strong>
                <button type="button" className="link-btn" onClick={() => remove(i.key)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <aside className="summary">
          <h2>Order summary</h2>
          <p className="summary-row">
            <span>Subtotal</span>
            <strong>{fmt(subtotalMinor, sample.minorUnit, sample.symbol)}</strong>
          </p>
          <p className="muted">Shipping, taxes and any discounts are calculated at checkout.</p>
          <a href={checkoutUrl} className="btn btn-primary btn-block">
            Proceed to checkout
          </a>
        </aside>
      </div>
    </div>
  );
}
