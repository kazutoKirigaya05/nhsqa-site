"use client";
import { useState } from "react";
import type { Point } from "@/lib/sim";
import { usd } from "@/lib/sim";

const W = 720, H = 260, L = 64, R = 16, T = 16, B = 30;

/** Single-series price line with a hover crosshair. `base` draws a dashed reference line (yesterday's close). */
export function PriceChart({ points, base, label, formatT }: { points: Point[]; base?: number | null; label: string; formatT: (t: string) => string }) {
  const [hover, setHover] = useState<number | null>(null);
  if (points.length < 2) {
    return <div className="empty"><h3>Not enough data yet</h3><p>This chart fills in as the market trades. Check back during market hours.</p></div>;
  }
  const values = points.map((p) => p.price).concat(base ? [base] : []);
  let lo = Math.min(...values), hi = Math.max(...values);
  const pad = (hi - lo || hi * 0.01) * 0.12; lo -= pad; hi += pad;
  const x = (i: number) => L + ((W - L - R) * i) / (points.length - 1);
  const y = (v: number) => T + ((H - T - B) * (hi - v)) / (hi - lo);
  const d = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.price).toFixed(1)}`).join(" ");
  const ticks = [0, 1, 2, 3].map((k) => lo + ((hi - lo) * k) / 3);
  const last = points.length - 1;
  const h = hover ?? last;

  function move(e: React.PointerEvent<SVGSVGElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * W;
    setHover(Math.max(0, Math.min(last, Math.round(((px - L) / (W - L - R)) * last))));
  }

  return (
    <figure className="chart">
      <figcaption>
        <span className="chart-title">{label}</span>
        <span className="chart-read"><b className="num">{usd(points[h].price)}</b> <span className="muted">{formatT(points[h].t)}</span></span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${label}: from ${usd(points[0].price)} to ${usd(points[last].price)}`}
        onPointerMove={move} onPointerLeave={() => setHover(null)} style={{ touchAction: "pan-y" }}>
        {ticks.map((v, i) => (
          <g key={i}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeWidth={1} />
            <text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize={12} fill="var(--muted)" style={{ fontFamily: "var(--mono)" }}>{usd(v, v >= 1000 ? 0 : 2)}</text>
          </g>
        ))}
        {base ? (
          <g>
            <line x1={L} x2={W - R} y1={y(base)} y2={y(base)} stroke="var(--pencil)" strokeWidth={1.2} strokeDasharray="5 5" />
            <text x={W - R} y={y(base) - 6} textAnchor="end" fontSize={11.5} fill="var(--muted)">yesterday&apos;s close</text>
          </g>
        ) : null}
        <text x={L} y={H - 8} fontSize={12} fill="var(--muted)">{formatT(points[0].t)}</text>
        <text x={W - R} y={H - 8} textAnchor="end" fontSize={12} fill="var(--muted)">{formatT(points[last].t)}</text>
        <path d={d} fill="none" stroke="var(--ink)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {hover !== null && <line x1={x(h)} x2={x(h)} y1={T} y2={H - B} stroke="var(--pencil)" strokeWidth={1} />}
        <circle cx={x(h)} cy={y(points[h].price)} r={5} fill="var(--hi)" stroke="var(--pencil)" strokeWidth={1.5} />
      </svg>
    </figure>
  );
}
