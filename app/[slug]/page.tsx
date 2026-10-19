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

// These pages are built in WordPress to fill the whole width and carry their own heading.
const FULL_WIDTH = new Set(["custom-design", "contact-us"]);

export default async function WpPageRoute({ params }: Props) {
  const { slug } = await params;
  const page = await getWpPage(slug);
  if (!page) notFound();
  if (FULL_WIDTH.has(slug)) {
    return <div className="prose wp-full" dangerouslySetInnerHTML={{ __html: page.content.rendered }} />;
  }
  return (
    <div className="container section narrow">
      <h1>{decodeEntities(page.title.rendered)}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
    </div>
  );
}
