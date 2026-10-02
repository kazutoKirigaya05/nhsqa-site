import Link from "next/link";
import { TRACKS, LATER_STOPS } from "@/content/site";

const STOPS = [...TRACKS.map((t) => ({ slug: t.slug, label: t.label })), ...LATER_STOPS];
const XS = STOPS.map((_, i) => 52 + i * 94);
const YS = STOPS.map((_, i) => Math.round(262 - 180 / (1 + Math.exp(-(i - 3.5) * 0.9))));
const PTS = XS.map((x, i) => [x, YS[i]] as const);

function smooth(p: readonly (readonly [number, number])[]) {
  let d = `M${p[0][0]},${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] ?? p[i], b = p[i], c = p[i + 1], e = p[i + 2] ?? c;
    d += ` C${(b[0] + (c[0] - a[0]) / 6).toFixed(1)},${(b[1] + (c[1] - a[1]) / 6).toFixed(1)} ${(c[0] - (e[0] - b[0]) / 6).toFixed(1)},${(c[1] - (e[1] - b[1]) / 6).toFixed(1)} ${c[0]},${c[1]}`;
  }
  return d;
}

const GROUPS: [string, number, number][] = [["Skills", 0, 5], ["Seminars", 6, 6], ["Mentorship", 7, 7]];

/** The pipeline plotted as a curve. `base` is the page the stops link to ("" for same-page anchors). */
export function PipelineMap({ base = "" }: { base?: string }) {
  return (
    <div className="plot">
      <div className="plot-scroll">
        <svg viewBox="0 0 764 318" role="img" aria-label="The Quant Pipeline: six skill tracks, then monthly seminars, then mentorship">
          {GROUPS.map(([t, a, b]) => {
            const x1 = XS[a] - 32, x2 = XS[b] + 32;
            return (
              <g key={t}>
                <line x1={x1} y1={30} x2={x2} y2={30} stroke="var(--bar)" strokeWidth={1.5} />
                <line x1={x1} y1={30} x2={x1} y2={37} stroke="var(--bar)" strokeWidth={1.5} />
                <line x1={x2} y1={30} x2={x2} y2={37} stroke="var(--bar)" strokeWidth={1.5} />
                <text x={(x1 + x2) / 2} y={20} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--muted)">{t}</text>
              </g>
            );
          })}
          <path className="curve" d={smooth(PTS)} pathLength={1} fill="none" stroke="var(--ink)" strokeWidth={3.5} strokeLinecap="round" />
          {STOPS.map((s, i) => (
            <Link key={s.slug} href={`${base}#${s.slug}`} className="stop" style={{ "--i": i } as React.CSSProperties} aria-label={s.label.join(" ")}>
              <circle cx={XS[i]} cy={YS[i]} r={13} fill="var(--paper)" stroke="var(--pencil)" strokeWidth={2.5} />
              <text x={XS[i]} y={YS[i] + 4.5} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--pencil)" style={{ fontFamily: "var(--mono)" }}>{i + 1}</text>
              <text x={XS[i]} y={YS[i] + 33} textAnchor="middle" fontSize={13.5} fontWeight={600} fill="var(--pencil)">
                {s.label.map((t, k) => <tspan key={k} x={XS[i]} dy={k ? 16 : 0}>{t}</tspan>)}
              </text>
            </Link>
          ))}
        </svg>
      </div>
      <p className="plot-hint">Swipe sideways to follow the whole path.</p>
    </div>
  );
}
