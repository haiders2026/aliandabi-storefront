"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { WooImage } from "@/lib/woo";

// Groups the views of one variation by file name: "KJ00075N.RD-0.5-22.jpg", "KJ00075N.RD-0.5-22_2.jpg",
// "KJ00075N.RD-0.5-22_5.jpg" all share the key "kj00075n.rd-0.5-22".
function viewKey(src: string) {
  const file = src.split("?")[0].split("/").pop() ?? "";
  return file
    .toLowerCase()
    .replace(/\.\w+$/, "")
    .replace(/-\d+x\d+$/, "")
    .replace(/-(scaled|rotated)$/, "")
    .replace(/_\d{1,2}$/, ""); // drop the "_2" view suffix
}

function sameFile(a: string, b: string) {
  const clean = (u: string) => u.split("?")[0].replace(/-\d+x\d+(?=\.\w+$)/, "").replace(/-scaled(?=\.\w+$)/, "");
  return clean(a) === clean(b);
}

export function Gallery({ images, name }: { images: WooImage[]; name: string }) {
  // The chosen variation's image; null shows the full gallery.
  const [variant, setVariant] = useState<WooImage | null>(null);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // BuyBox announces the selected variation's image.
  useEffect(() => {
    function onVariationImage(e: Event) {
      const img = (e as CustomEvent<WooImage | null>).detail;
      if (!img?.src) return;
      setVariant(img);
      setActive(0);
    }
    window.addEventListener("aa:variation-image", onVariationImage);
    return () => window.removeEventListener("aa:variation-image", onVariationImage);
  }, []);

  // The images to show: the variation's own views (its image first), or every image.
  const shown = useMemo(() => {
    if (!variant) return images;
    const key = viewKey(variant.src);
    const inGallery = images.find((g) => g.id === variant.id || sameFile(g.src, variant.src));
    const lead = inGallery ?? variant;
    const views = images.filter((g) => g !== lead && viewKey(g.src) === key);
    if (views.length) return [lead, ...views];
    // No matching views: keep the whole gallery, starting from the variation image.
    return inGallery ? [inGallery, ...images.filter((g) => g !== inGallery)] : [variant, ...images];
  }, [images, variant]);

  // Keep the active thumbnail visible inside the thumbnail strip (without scrolling the page).
  useEffect(() => {
    const list = listRef.current;
    const btn = list?.children[active] as HTMLElement | undefined;
    if (!list || !btn) return;
    if (list.scrollHeight > list.clientHeight) list.scrollTo({ top: btn.offsetTop - list.clientHeight / 2 + btn.clientHeight / 2, behavior: "smooth" });
    if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: btn.offsetLeft - list.clientWidth / 2 + btn.clientWidth / 2, behavior: "smooth" });
  }, [active, shown]);

  if (!shown.length) return <div className="gallery-empty" />;
  const index = Math.min(active, shown.length - 1);
  const current = shown[index];
  const step = (d: number) => setActive((i) => (Math.min(i, shown.length - 1) + d + shown.length) % shown.length);

  return (
    <div className="gallery">
      <div
        className="gallery-main"
        tabIndex={shown.length > 1 ? 0 : undefined}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-1);
          if (e.key === "ArrowRight") step(1);
        }}
      >
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt || name}
          width={1000}
          height={1000}
          sizes="(max-width: 900px) 100vw, 50vw"
          priority
        />
        {shown.length > 1 && (
          <>
            <button type="button" className="gallery-arrow gallery-prev" onClick={() => step(-1)} aria-label="Previous image">
              ‹
            </button>
            <button type="button" className="gallery-arrow gallery-next" onClick={() => step(1)} aria-label="Next image">
              ›
            </button>
            <span className="gallery-count">
              {index + 1} / {shown.length}
            </span>
          </>
        )}
      </div>
      {shown.length > 1 && (
        <div className="gallery-thumbs">
          <div className="gallery-thumbs-list" ref={listRef}>
            {shown.map((img, i) => (
              <button
                key={`${img.id}-${img.src}`}
                type="button"
                className={i === index ? "active" : ""}
                onClick={() => setActive(i)}
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
