import Link from "next/link";
import { categoryPath, getCategories, WC_PUBLIC_BASE, decodeEntities } from "@/lib/woo";
import { CartLink } from "./CartLink";

const LOGO = "https://www.aliandabi.com/wp-content/uploads/thegem/logos/logo_bcec44bbb96912dec54d0f98ecadb25f_1x.png";

// Menu order used on the current site; categories not listed here are skipped from the top nav.
const NAV_ORDER = ["engagement_rings", "wedding_bands", "earrings", "pendants_necklaces", "bracelets"];

export async function Header() {
  const cats = await getCategories();
  const root = cats.find((c) => c.slug === "all_jewelry");
  const top = NAV_ORDER.map((slug) => cats.find((c) => c.slug === slug)).filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <header className="site-header">
      <div className="topbar">
        <span>Free Shipping – Orders Over $100 USD</span>
        <a href="tel:+17184409510">Customer Service: +1 718 440 9510</a>
      </div>
      <div className="header-main container">
        <Link href="/" className="logo" aria-label="ali&abi home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} alt="ali&abi" height={44} />
        </Link>
        <nav className="nav" aria-label="Main">
          {top.map((cat) => {
            const children = cats.filter((c) => c.parent === cat.id);
            return (
              <div className="nav-item" key={cat.id}>
                <Link href={categoryPath(cat, cats)}>{decodeEntities(cat.name)}</Link>
                {children.length > 0 && (
                  <div className="dropdown">
                    {children.map((child) => (
                      <Link key={child.id} href={categoryPath(child, cats)}>
                        {decodeEntities(child.name)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="nav-item">
            <Link href="/custom-design">Custom Design</Link>
          </div>
        </nav>
        <div className="header-actions">
          <form action="/search" className="search">
            <input type="search" name="q" placeholder="Search" aria-label="Search products" />
          </form>
          <a href={`${WC_PUBLIC_BASE}/my-account/`} aria-label="My account">
            Account
          </a>
          <CartLink />
        </div>
      </div>
      {root && null}
    </header>
  );
}
