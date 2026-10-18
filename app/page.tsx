import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/ProductCard";
import { categoryPath, decodeEntities, getCategories, getProducts } from "@/lib/woo";

export const revalidate = 300;

const COLLECTIONS = ["rings", "pendants_necklaces", "earrings", "bracelets"];

const JOURNEY = [
  ["Initial Sketch", "We map out your inspirations by hand to establish the structural proportions."],
  ["3D CAD Modeling", "A highly precise digital blueprint is built to preview the diamond settings."],
  ["Lost-Wax Casting", "A physical 1:1 mold is grown to hold the molten precious metal."],
  ["Master Stone Setting", "Gems are microscopically aligned and hand-secured into the metal prongs."],
  ["Final Mirror Polish", "The piece undergoes a multi-stage lapidary polish for maximum light reflection."],
];

const TRUST = [
  ["Master Bench Artisans", "Every piece is uniquely hand-forged in our studio."],
  ["IGI and/or GIA Certified Diamonds", "Conflict-free, traceable natural and lab diamonds."],
  ["Fully Insured Transit", "Free, signature-required delivery on all orders."],
  ["Worry-free Returns", "30 days returns – no questions asked."],
];

export default async function Home() {
  const [cats, featured] = await Promise.all([getCategories(), getProducts({ perPage: 8, featured: true })]);
  const latest = featured.products.length >= 4 ? featured : await getProducts({ perPage: 8, orderby: "date", order: "desc" });

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <p className="eyebrow">ali&amp;abi</p>
          <h1>Lab Grown Diamond</h1>
          <p className="hero-sub">Fine jewelry at exceptional value</p>
          <Link href="/product-category/all_jewelry" className="btn btn-primary">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="container section">
        <header className="section-head">
          <h2>Explore Our Collections</h2>
          <p>Timeless pieces crafted for every occasion</p>
        </header>
        <div className="collections">
          {COLLECTIONS.map((slug) => {
            const cat = cats.find((c) => c.slug === slug);
            if (!cat) return null;
            return (
              <Link key={cat.id} href={categoryPath(cat, cats)} className="collection">
                {cat.image?.src ? (
                  <Image src={cat.image.src} alt={cat.image.alt || cat.name} width={600} height={600} sizes="(max-width: 700px) 50vw, 25vw" />
                ) : (
                  <div className="card-placeholder" />
                )}
                <span>{decodeEntities(cat.name)}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container section">
        <header className="section-head">
          <p className="eyebrow">Curated just for you</p>
          <h2>{featured.products.length >= 4 ? "Featured Pieces" : "New Arrivals"}</h2>
        </header>
        <ProductGrid products={latest.products} />
        <p className="center">
          <Link href="/product-category/all_jewelry" className="btn">
            Explore Collection
          </Link>
        </p>
      </section>

      <section className="band">
        <div className="container split">
          <div>
            <p className="eyebrow">The Aliandabi Atelier</p>
            <h2>From Concept to Creation</h2>
            <p>
              Let us transform your raw ideas into stunning, one-of-a-kind masterpieces. Rings, earrings, or bracelets — whatever you
              imagine, we&apos;ll craft with precision and care.
            </p>
            <Link href="/custom-design" className="btn btn-primary">
              Get Started
            </Link>
          </div>
          <ol className="journey">
            {JOURNEY.map(([title, text], i) => (
              <li key={title}>
                <span className="step">Step 0{i + 1}</span>
                <strong>{title}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container section">
        <div className="trust">
          {TRUST.map(([title, text]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
