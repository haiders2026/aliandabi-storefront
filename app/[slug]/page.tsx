import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { decodeEntities, getWpPage } from "@/lib/woo";

// Generic renderer for simple WordPress pages (terms, privacy, contact text, etc.).
// Elementor-built pages (like the home page or the custom design form) are better rebuilt natively.
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getWpPage(slug);
  return page ? { title: decodeEntities(page.title.rendered) } : {};
}

export default async function WpPageRoute({ params }: Props) {
  const { slug } = await params;
  const page = await getWpPage(slug);
  if (!page) notFound();
  return (
    <div className="container section narrow">
      <h1>{decodeEntities(page.title.rendered)}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
    </div>
  );
}
