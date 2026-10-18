# ali&abi storefront (Next.js + headless WooCommerce)

Next.js 15 (App Router) storefront. WooCommerce stays the backend for products, orders, payments and the admin.

- **Catalog:** read from the public WooCommerce Store API (`/wp-json/wc/store/v1`), cached 5 minutes and refreshed instantly by webhook.
- **Cart:** kept in the browser (localStorage). Prices shown in the cart are a snapshot; WooCommerce recalculates everything at checkout.
- **Checkout:** the "Proceed to checkout" button sends the cart to WooCommerce through a small plugin and lands on the normal `/checkout` page, so every payment gateway keeps working.
- **URLs:** product and category URLs follow the existing WooCommerce structure to protect SEO.

## 1. WordPress side (one time)

1. Copy `wordpress/headless-checkout-bridge.php` to `wp-content/mu-plugins/` on aliandabi.com.
2. If you use a page cache or CDN, exclude any URL containing `aa_checkout` from caching.
3. Settings → Permalinks must be anything other than "Plain" (the Store API needs pretty permalinks; yours already works).
4. Optional, for instant catalog updates: WooCommerce → Settings → Advanced → Webhooks. Add webhooks for *Product created / updated / deleted* with delivery URL
   `https://YOUR-STOREFRONT/api/revalidate?secret=YOUR_REVALIDATE_SECRET`.

## 2. Run locally

```bash
cp .env.example .env.local   # then edit
npm install
npm run dev
```

## 3. Deploy to Vercel

1. Push this folder to a Git repo and import it in Vercel (framework: Next.js, no build settings to change).
2. Add the environment variables from `.env.example` (`WC_BASE_URL`, `NEXT_PUBLIC_WC_BASE_URL`, `NEXT_PUBLIC_SITE_URL`, `REVALIDATE_SECRET`).
3. Deploy, then test an add-to-cart → checkout on the preview URL before pointing your domain.

## Go-live notes

- **Domain:** WordPress and Next.js can't both answer on `www.aliandabi.com`. Either move WordPress to a subdomain (for example `shop-admin.aliandabi.com`) and point `www` at Vercel, or run the storefront on a new subdomain first. Checkout, My Account and the admin stay on the WordPress host either way. Update `WC_BASE_URL` to wherever WordPress ends up.
- **Design:** edit the tokens at the top of `app/globals.css` to match the live theme's colors and fonts exactly.
- **Plugins:** anything that injects UI through theme hooks (wishlist, reviews widget, newsletter popup, cookie banner) needs a Next.js equivalent.
- **Redirects:** keep an eye on Search Console for 404s after launch.

`variant-src/` holds a second, separate implementation; see `variant-src/NOTE.md`. It is excluded from this project's build.
