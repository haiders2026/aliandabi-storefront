import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container section center">
      <h1>Page not found</h1>
      <p>We couldn&apos;t find what you were looking for.</p>
      <p>
        <Link href="/product-category/all_jewelry" className="btn btn-primary">
          Browse all jewelry
        </Link>
      </p>
    </div>
  );
}
