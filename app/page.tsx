import Link from "next/link";
import { ProductGrid } from "@/components/ProductCard";
import { categoryPath, decodeEntities, getCategories, getProducts, WC_PUBLIC_BASE } from "@/lib/woo";

export const revalidate = 300;

const COLLECTIONS = ["rings", "pendants_necklaces", "earrings", "bracelets"];

// Same tile photos the current homepage uses (falls back to the category image from WooCommerce).
const UP = "https://www.aliandabi.com/wp-content/uploads";
const TILE_IMAGES: Record<string, string> = {
  rings: `${UP}/Rings_Category.jpg`,
  pendants_necklaces: `${UP}/Necklace_Cat.jpg`,
  earrings: `${UP}/Earrings_Cat.png`,
  bracelets: `${UP}/Bracelets_Cat-1.jpg`,
};

const JOURNEY = [
  ["Initial Sketch", "We map out your inspirations by hand to establish the structural proportions."],
  ["3D CAD Modeling", "A highly precise digital blueprint is built to preview the diamond settings."],
  ["Lost-Wax Casting", "A physical 1:1 mold is grown to hold the molten precious metal."],
  ["Master Stone Setting", "Gems are microscopically aligned and hand-secured into the metal prongs."],
  ["Final Mirror Polish", "The piece undergoes a multi-stage lapidary polish for maximum light reflection."],
];

const SPOTLIGHT_FEATURES = [
  "Handcrafted Custom Designs",
  "Complimentary Insured Shipping",
  "IGI or GIA Certified Conflict-Free Diamonds",
  "Aliandabi Lifetime Warranty",
  "Ethically Sourced Precious Metals",
  "Personalized 1-on-1 Consultations",
];

// Customer quotes: only the opening sentence of each is included here; paste the full text from WordPress to extend.
const REVIEWS = [
  ["Sarah & Mark", "Custom Engagement Ring", "Aliandabi helped me design a custom engagement ring that completely blew us away."],
  ["Eleanor R.", "Family Heirloom Redesign", "I inherited an heirloom gemstone that was in a very dated setting."],
  ["James T.", "Bespoke Men's Band", "The level of precision in their work is unmatched."],
];

const WHY = [
  ["Bespoke Master Craftsmanship", "Unlike mass-produced jewelry, every custom piece at Aliandabi is hand-forged by master bench jewelers."],
  ["IGI and/or GIA Certified & Ethically Sourced", "We deal exclusively in 100% conflict-free diamonds and traceably mined diamonds."],
  ["Comprehensive Lifetime Warranty", "Our pieces are designed to become family heirlooms."],
  ["Fully Insured Overnight Shipping", "All fine jewelry shipments require an adult signature upon delivery."],
];

const BRANDS: [string, string][] = [
  ["Ali&Abi Fine", "/collections/aliandabi-fine"],
  ["Fara Diamonds", "/collections/FaraDIamonds"],
  ["Luv Eclipse", "/collections/luveclipseclipse"],
  ["Nau-T Girl Jewelry", "/collections/Naut-Girl_Jewelry"],
  ["Fireborn", "/collections/fireborn"],
];

const TRUST = [
  ["Master Bench Artisans", "Every piece is uniquely hand-forged in our studio."],
  ["IGI and/or GIA Certified Diamonds", "Conflict-free, traceable natural and lab diamonds."],
  ["Fully Insured Transit", "Free, signature-required delivery on all orders."],
  ["Worry-free Returns", "30 days returns – no questions asked."],
];

const MARQUEE = [...WHY, ...TRUST];

export default async function Home() {
  const [cats, featured] = await Promise.all([getCategories(), getProducts({ perPage: 8, featured: true })]);
  const latest = featured.products.length >= 4 ? featured : await getProducts({ perPage: 8, orderby: "date", order: "desc" });

  return (
    <>
      <section className="hero">
        <picture className="hero-bg">
          <source media="(max-width: 700px)" srcSet={`${UP}/AnA-BannerMobile2.png`} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${UP}/AnA-Banner1.png`} alt="ali&abi | Lab Grown Diamond Fine Jewelry" fetchPriority="high" />
        </picture>
        <div className="container hero-inner">
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
                {TILE_IMAGES[slug] || cat.image?.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={TILE_IMAGES[slug] || cat.image!.src} alt={cat.image?.alt || cat.name} loading="lazy" />
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

      <section className="band">
        <div className="container split">
          <div className="spotlight-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${UP}/E3401R_1.jpg`} alt="Black and White Diamond Earrings" loading="lazy" />
          </div>
          <div>
            <p className="eyebrow">Limited Time Special</p>
            <h2>The Weekly Spotlight</h2>
            <p>Every week, we feature a masterfully crafted piece at an exclusive tier.</p>
            <h3>Black and White Diamond Halo Dangle Earrings</h3>
            <p>
              A 1.25 ct cushion-cut black diamond within a 0.50 ct halo of round accents, 3.00 ctw total, in 14K rose gold.
            </p>
            <p className="price price-large">
              <ins>$549.00</ins> <del>$2,100.00</del>
            </p>
            <Link
              href="/shop/all_jewelry/earrings/3-cttw-black-and-white-diamond-halo-dangle-earrings-for-women-in-14k-rose-gold"
              className="btn btn-primary"
            >
              View Now
            </Link>
            <ul className="ticks">
              {SPOTLIGHT_FEATURES.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container section">
        <header className="section-head">
          <p className="eyebrow">What our customers say</p>
          <h2>Love From Our Aliandabi Family</h2>
        </header>
        <div className="reviews">
          {REVIEWS.map(([name, what, quote]) => (
            <figure key={name} className="review">
              <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
              <blockquote>&ldquo;{quote}&rdquo;</blockquote>
              <figcaption>
                <strong>{name}</strong>
                <span>{what}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="center">
          <a href={`${WC_PUBLIC_BASE}/reviews`} className="btn">
            Read More Stories
          </a>
        </p>
      </section>

      <section className="band why-band">
        <div className="container why-head">
          <header className="section-head">
            <p className="eyebrow">The Aliandabi Standard</p>
            <h2>Why ALIANDABI?</h2>
            <p>For over 25 years, we believe buying fine jewelry should be a transparent, secure, and deeply personal experience.</p>
          </header>
        </div>
        <div className="marquee" aria-label="Why choose ali&abi">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div className="marquee-group" key={copy} aria-hidden={copy === 1}>
                {MARQUEE.map(([title, text]) => (
                  <div key={`${copy}-${title}`} className="why-card">
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container section center">
        <p className="eyebrow">Our Brands</p>
        <h2>Available at Aliandabi</h2>
        <ul className="brands">
          {BRANDS.map(([name, path]) => (
            <li key={name}>
              <a href={`${WC_PUBLIC_BASE}${path}`}>{name}</a>
            </li>
          ))}
        </ul>
      </section>

      <section className="band">
        <div className="container section center narrow">
          <p className="eyebrow">Join Aliandabi</p>
          <h2>Unlock Private Access</h2>
          <p>Be the first to view our limited custom drops, gain access to private consultations, and receive exclusive styling insights.</p>
          <Link href="/newsletter" className="btn btn-primary">
            Subscribe
          </Link>
          <p></p>
          <p className="muted">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </section>
    </>
  );
}
