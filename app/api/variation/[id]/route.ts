import { NextResponse } from "next/server";
import { getProductById } from "@/lib/woo";

// Small proxy so the browser never talks to WooCommerce directly (no CORS setup needed).
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = Number.parseInt(id, 10);
  if (!Number.isFinite(n) || n <= 0) return NextResponse.json({ error: "bad id" }, { status: 400 });
  const product = await getProductById(n);
  if (!product) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ id: product.id, prices: product.prices, inStock: product.is_in_stock });
}
