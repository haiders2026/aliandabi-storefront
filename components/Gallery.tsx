"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { WooImage } from "@/lib/woo";

export function Gallery({ images, name }: { images: WooImage[]; name: string }) {
  const [active, setActive] = useState(0);
  // Image of the chosen variation when it is not already one of the gallery images.
  const [extra, setExtra] = useState<WooImage | null>(null);

  // BuyBox announces the selected variation's image; show it as the main image.
  useEffect(() => {
    function onVariationImage(e: Event) {
      const img = (e as CustomEvent<WooImage | null>).detail;
      if (!img?.src) return;
      const file = (u: string) => u.split("?")[0].replace(/-\d+x\d+(?=\.\w+$)/, "");
      const i = images.findIndex((g) => g.id === img.id || file(g.src) === file(img.src));
      if (i >= 0) {
        setExtra(null);
        setActive(i);
      } else {
        setExtra(img);
      }
    }
    window.addEventListener("aa:variation-image", onVariationImage);
    return () => window.removeEventListener("aa:variation-image", onVariationImage);
  }, [images]);

  if (!images.length && !extra) return <div className="gallery-empty" />;
  const current = extra ?? images[active] ?? images[0];
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
          <div className="gallery-thumbs-list">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                className={!extra && i === active ? "active" : ""}
                onClick={() => {
                  setExtra(null);
                  setActive(i);
                }}
                aria-label={`Show image ${i + 1}`}
              >
                <Image src={img.thumbnail || img.src} alt="" width={120} height={120} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
