import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Listing, parseListingParams } from "@/components/Listing";
import { categoryPath, decodeEntities, getCategories } from "@/lib/woo";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
};

async function resolve(slugParts: string[]) {
  const cats = await getCategories();
  const cat = cats.find((c) => c.slug === slugParts[slugParts.length - 1]);
  return { cats, cat };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { cat, cats } = await resolve(slug);
  if (!cat) return {};
  return {
    title: decodeEntities(cat.name),
    alternates: { canonical: categoryPath(cat, cats) },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page, sort } = parseListingParams(await searchParams);
  const { cats, cat } = await resolve(slug);
  if (!cat) notFound();

  const children = cats.filter((c) => c.parent === cat.id);
  const path = categoryPath(cat, cats);

  return (
    <div className="container section">
      <header className="section-head">
        <h1>{decodeEntities(cat.name)}</h1>
        {cat.description && <p dangerouslySetInnerHTML={{ __html: cat.description }} />}
      </header>
      {children.length > 0 && (
        <nav className="chips" aria-label="Subcategories">
          {children.map((c) => (
            <Link key={c.id} href={categoryPath(c, cats)}>
              {decodeEntities(c.name)}
            </Link>
          ))}
        </nav>
      )}
      <Listing basePath={path} page={page} sort={sort} category={cat.slug} />
    </div>
  );
}
