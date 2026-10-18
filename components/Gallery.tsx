"use client";

import Image from "next/image";
import { useState } from "react";
import type { WooImage } from "@/lib/woo";

export function Gallery({ images, name }: { images: WooImage[]; name: string }) {
  const [active, setActive] = useState(0);
  if (!images.length) return <div className="gallery-empty" />;
  const current = images[active] ?? images[0];
  return (
    <div className="gallery">
      <div className="gallery-main">
        <Image
          src={current.src}
          alt={current.alt || name}
          width={1000}
          height={1000}
          sizes="(max-width: 900px) 100vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              className={i === active ? "active" : ""}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
            >
              <Image src={img.thumbnail || img.src} alt="" width={120} height={120} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
