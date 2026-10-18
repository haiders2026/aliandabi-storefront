import Link from "next/link";
import { WC_PUBLIC_BASE } from "@/lib/woo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3 className="footer-brand">ali&amp;abi</h3>
          <p>Fine jewelry, thoughtfully made — for the moments worth keeping.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            <li><Link href="/product-category/all_jewelry/engagement_rings">Engagement Rings</Link></li>
            <li><Link href="/product-category/all_jewelry/wedding_bands">Wedding Bands</Link></li>
            <li><Link href="/product-category/all_jewelry/earrings">Earrings</Link></li>
            <li><Link href="/product-category/all_jewelry/pendants_necklaces">Pendants &amp; Necklaces</Link></li>
            <li><Link href="/product-category/all_jewelry/bracelets">Bracelets</Link></li>
          </ul>
        </div>
        <div>
          <h4>Customer care</h4>
          <ul>
            <li><Link href="/contact-us">Contact us</Link></li>
            <li><Link href="/custom-design">Custom design</Link></li>
            <li><a href={`${WC_PUBLIC_BASE}/my-account/`}>My account</a></li>
            <li><Link href="/terms-and-conditions">Terms &amp; conditions</Link></li>
            <li><Link href="/privacy-policy">Privacy policy</Link></li>
          </ul>
        </div>
        <div>
          <h4>Get in touch</h4>
          <p>
            <a href="tel:+17184409510">+1 718 440 9510</a>
            <br />
            Mon–Fri, 9am–5pm ET
          </p>
        </div>
      </div>
      <div className="container footer-legal">© {new Date().getFullYear()} ali&amp;abi. All rights reserved.</div>
    </footer>
  );
}
