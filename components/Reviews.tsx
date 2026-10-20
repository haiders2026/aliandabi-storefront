import type { WooReview } from "@/lib/woo";
import { decodeEntities } from "@/lib/woo";

function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span className="stars" role="img" aria-label={`${value} out of 5 stars`}>
      {"★".repeat(full)}
      <span className="stars-off">{"★".repeat(5 - full)}</span>
    </span>
  );
}

export function Reviews({ reviews, writeUrl }: { reviews: WooReview[]; writeUrl: string }) {
  const count = reviews.length;
  const avg = count ? reviews.reduce((n, r) => n + r.rating, 0) / count : 0;

  return (
    <section id="reviews" className="product-reviews">
      <h2>Customer Reviews</h2>
      {count > 0 ? (
        <p className="review-summary">
          <Stars value={avg} /> <strong>{avg.toFixed(1)}</strong> out of 5 · {count} review{count === 1 ? "" : "s"}
        </p>
      ) : (
        <p className="muted">There are no reviews yet. Be the first to share your experience.</p>
      )}

      {count > 0 && (
        <ul className="review-list">
          {reviews.map((r) => (
            <li key={r.id}>
              <div className="review-head">
                <Stars value={r.rating} />
                <strong>{decodeEntities(r.reviewer)}</strong>
                {r.verified && <span className="verified">Verified buyer</span>}
                <time dateTime={r.date_created} className="muted">
                  {new Date(r.date_created).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </time>
              </div>
              <div className="prose" dangerouslySetInnerHTML={{ __html: r.review }} />
            </li>
          ))}
        </ul>
      )}

      <p>
        <a href={writeUrl} className="btn">
          Write a review
        </a>
      </p>
    </section>
  );
}
