import Link from "next/link";

const HEIGHTS = [4, 8, 13, 17, 24, 24, 17, 13, 8, 4];

export function Bars({ grey = "var(--bar)", yellow = "var(--hi)" }: { grey?: string; yellow?: string }) {
  return (
    <svg viewBox="0 0 54 30" aria-hidden="true">
      {HEIGHTS.map((h, i) => (
        <rect key={i} x={i * 5.5} y={28 - h} width={4} height={h} fill={i === 4 || i === 5 ? yellow : grey} />
      ))}
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="NHSQA home">
      <Bars />
      <span>NHSQA</span>
    </Link>
  );
}
