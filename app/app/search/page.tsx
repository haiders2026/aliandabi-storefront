import type { Metadata } from "next";
import { Listing, parseListingParams } from "@/components/Listing";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string; page?: string; sort?: string }> }) {
  const sp = await searchParams;
  const { page, sort } = parseListingParams(sp);
  const q = (sp.q ?? "").trim();
  return (
    <div className="container section">
      <header className="section-head">
        <h1>{q ? `Results for “${q}”` : "Search"}</h1>
      </header>
      {q ? <Listing basePath="/search" page={page} sort={sort} search={q} /> : <p className="empty">Type something in the search box above.</p>}
    </div>
  );
}
