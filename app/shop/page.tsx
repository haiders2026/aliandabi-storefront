import type { Metadata } from "next";
import { Listing, parseListingParams } from "@/components/Listing";

export const metadata: Metadata = { title: "Shop all jewelry" };

export default async function Shop({ searchParams }: { searchParams: Promise<{ page?: string; sort?: string }> }) {
  const { page, sort } = parseListingParams(await searchParams);
  return (
    <div className="container section">
      <header className="section-head">
        <h1>All Jewelry</h1>
      </header>
      <Listing basePath="/shop" page={page} sort={sort} />
    </div>
  );
}
