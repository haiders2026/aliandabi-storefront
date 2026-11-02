// Line drawings of diamond shapes for the Shape swatches. Unknown shapes return null (the swatch shows the name).
const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinejoin: "round" as const };

const SHAPES: Record<string, React.ReactNode> = {
  round: (
    <>
      <circle cx="20" cy="20" r="15" {...S} />
      <polygon points="20,9 28,14 28,26 20,31 12,26 12,14" {...S} />
      <path d="M20 5v4M33 12l-5 2M33 28l-5-2M20 35v-4M7 28l5-2M7 12l5 2" {...S} />
    </>
  ),
  oval: (
    <>
      <ellipse cx="20" cy="20" rx="11" ry="16" {...S} />
      <polygon points="20,9 25,15 25,25 20,31 15,25 15,15" {...S} />
    </>
  ),
  princess: (
    <>
      <rect x="6" y="6" width="28" height="28" {...S} />
      <path d="M6 6l28 28M34 6L6 34" {...S} />
      <rect x="13" y="13" width="14" height="14" {...S} />
    </>
  ),
  cushion: (
    <>
      <rect x="6" y="6" width="28" height="28" rx="8" {...S} />
      <rect x="12" y="12" width="16" height="16" rx="4" {...S} />
    </>
  ),
  emerald: (
    <>
      <polygon points="14,4 26,4 31,9 31,31 26,36 14,36 9,31 9,9" {...S} />
      <polygon points="16,10 24,10 26,12 26,28 24,30 16,30 14,28 14,12" {...S} />
    </>
  ),
  asscher: (
    <>
      <polygon points="13,6 27,6 34,13 34,27 27,34 13,34 6,27 6,13" {...S} />
      <polygon points="16,12 24,12 28,16 28,24 24,28 16,28 12,24 12,16" {...S} />
    </>
  ),
  radiant: (
    <>
      <polygon points="13,5 27,5 32,10 32,30 27,35 13,35 8,30 8,10" {...S} />
      <path d="M13 5l7 15 7-15M13 35l7-15 7 15M8 10l12 10 12-10M8 30l12-10 12 10" {...S} />
    </>
  ),
  pear: (
    <>
      <path d="M20 4C14 12 9 19 9 25a11 11 0 0 0 22 0c0-6-5-13-11-21z" {...S} />
      <path d="M20 10v26M14 22h12" {...S} />
    </>
  ),
  marquise: (
    <>
      <path d="M20 3C10 12 10 28 20 37C30 28 30 12 20 3z" {...S} />
      <path d="M20 3v34M14 20h12" {...S} />
    </>
  ),
  heart: (
    <>
      <path d="M20 35C9 27 5 21 5 14.5A7.5 7.5 0 0 1 20 11a7.5 7.5 0 0 1 15 3.5C35 21 31 27 20 35z" {...S} />
      <path d="M20 11v24" {...S} />
    </>
  ),
};

export function ShapeIcon({ shape }: { shape: string }) {
  const key = shape.toLowerCase().replace(/[^a-z]/g, "");
  const match = Object.keys(SHAPES).find((k) => key.includes(k));
  if (!match) return null;
  return (
    <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">
      {SHAPES[match]}
    </svg>
  );
}
