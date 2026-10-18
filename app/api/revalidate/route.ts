import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Point WooCommerce webhooks (product created/updated/deleted) at:
//   https://YOUR-SITE/api/revalidate?secret=REVALIDATE_SECRET
// so catalog edits show up immediately instead of waiting for the 5-minute cache.
export async function POST(req: Request) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, at: Date.now() });
}
