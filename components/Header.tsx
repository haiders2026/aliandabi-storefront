import Link from "next/link";
import { WC_PUBLIC_BASE } from "@/lib/woo";
import { CartLink } from "./CartLink";

const LOGO = "https://www.aliandabi.com/wp-content/uploads/thegem/logos/logo_bcec44bbb96912dec54d0f98ecadb25f_1x.png";

const P = "/product-category/all_jewelry";

// Same menu as the current WordPress site (hard-coded so empty categories still appear).
const NAV: { label: string; href: string; children?: [string, string][] }[] = [
  { label: "Home", href: "/" },
  {
    label: "Engagement Rings",
    href: `${P}/engagement_rings`,
    children: [
      ["Solitaire Engagement Rings", `${P}/engagement_rings/solitaire_engagement_rings`],
      ["Halo Engagement Rings", `${P}/engagement_rings/halo_engagement_rings`],
      ["Double Halo Engagement Rings", `${P}/engagement_rings/double_halo_engaement_rings`],
      ["Accented Engagement Rings", `${P}/engagement_rings/accented-engagement_rings`],
      ["Fashion Engagement Rings", `${P}/engagement_rings/fashion_engagement_rings`],
    ],
  },
  {
    label: "Wedding Bands",
    href: `${P}/wedding_bands`,
    children: [
      ["Plain Metal Bands", `${P}/wedding_bands/plain_metal_bands`],
      ["Bands with Stones", `${P}/wedding_bands/bands_with_stones`],
      ["Alternate Metal Bands", `${P}/wedding_bands/alternate_metal_bands`],
    ],
  },
  {
    label: "Earrings",
    href: `${P}/earrings`,
    children: [
      ["Stud Earrings", `${P}/earrings/stud_earrings`],
      ["Halo Earrings", `${P}/earrings/halo_earrings`],
      ["Double Halo Earrings", `${P}/earrings/double_halo_earrings`],
      ["Dangle Earrings", `${P}/earrings/dangle_earrings`],
      ["Fashion Earrings", `${P}/earrings/fashion_earrings`],
    ],
  },
  {
    label: "Pendants / Necklaces",
    href: `${P}/pendants_necklaces`,
    children: [
      ["Solitaire Pendants", `${P}/pendants_necklaces/solitaire_pendants`],
      ["Halo Pendants", `${P}/pendants_necklaces/halo_pendants`],
      ["Double Halo Pendants", `${P}/pendants_necklaces/double_halo_pendants`],
      ["Accented Pendants", `${P}/pendants_necklaces/accented_pendants`],
      ["Fashion Pendants", `${P}/pendants_necklaces/fashion_pendants`],
    ],
  },
  {
    label: "Bracelets",
    href: `${P}/bracelets`,
    children: [
      ["Tennis Bracelets", `${P}/bracelets/tennis_bracelets`],
      ["Fashion Bracelets", `${P}/bracelets/fashion-bracelets`],
    ],
  },
  { label: "Custom Design", href: "/custom-design" },
];

export function Header() {
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
          {NAV.map((item) => (
            <div className="nav-item" key={item.label}>
              <Link href={item.href}>{item.label}</Link>
              {item.children && (
                <div className="dropdown">
                  {item.children.map(([label, href]) => (
                    <Link key={href} href={href}>
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="nav-item">
            <a href={`${WC_PUBLIC_BASE}/my-account/`}>My Account</a>
          </div>
        </nav>
        <div className="header-actions">
          <form action="/search" className="search">
            <input type="search" name="q" placeholder="Search" aria-label="Search products" />
          </form>
          <CartLink />
        </div>
      </div>
    </header>
  );
}
