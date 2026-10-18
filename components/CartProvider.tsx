"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  key: string;
  productId: number;
  variationId: number;
  qty: number;
  name: string;
  unitMinor: number; // price in minor units (cents)
  minorUnit: number;
  symbol: string;
  image?: string;
  href: string;
  label?: string; // e.g. "Size: 7"
};

type CartCtx = {
  items: CartItem[];
  ready: boolean;
  count: number;
  subtotalMinor: number;
  add: (item: Omit<CartItem, "key">) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  checkoutUrl: string;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "aliandabi-cart-v1";
const WC_BASE = (process.env.NEXT_PUBLIC_WC_BASE_URL ?? "https://www.aliandabi.com").replace(/\/$/, "");

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable */
    }
  }, [items, ready]);

  const add = useCallback((item: Omit<CartItem, "key">) => {
    const key = `${item.productId}:${item.variationId}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(99, i.qty + item.qty) } : i));
      return [...prev, { ...item, key }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty: Math.min(99, qty) } : i)),
    );
  }, []);

  const remove = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotalMinor = items.reduce((n, i) => n + i.unitMinor * i.qty, 0);
    // Hand the cart to WooCommerce: the bridge plugin rebuilds it server-side and redirects to checkout.
    const param = items.map((i) => `${i.productId}:${i.qty}:${i.variationId}`).join(",");
    const checkoutUrl = `${WC_BASE}/?aa_checkout=1&items=${encodeURIComponent(param)}`;
    return { items, ready, count, subtotalMinor, add, setQty, remove, clear, checkoutUrl };
  }, [items, ready, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
