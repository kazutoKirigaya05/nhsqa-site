import Link from "next/link";
import { GROUPS, TRACKS, LATER_STOPS } from "@/content/site";

type State = "new" | "now" | "done";
type Stop = { slug: string; label: string[]; n: number; x: number; y: number };

// The pipeline is one line that runs left to right, turns, and comes back: a row for each group of tracks.
const STEP = 92, LEFT = 60, ROW = 140, TOP = 96, SLOTS = 8;
const rows = GROUPS.map((g) => TRACKS.filter((t) => t.group === g.name).map((t) => ({ slug: t.slug, label: t.label })));
rows[rows.length - 1].push(...LATER_STOPS);

let count = 0;
const STOPS: Stop[] = rows.flatMap((row, r) =>
  row.map((s, i) => {
    const slot = r % 2 === 0 ? i : SLOTS - 1 - i;
    return { ...s, n: ++count, x: LEFT + slot * STEP, y: TOP + r * ROW };
  }));
const WIDTH = LEFT * 2 + (SLOTS - 1) * STEP;
const HEIGHT = TOP + (rows.length - 1) * ROW + 70;

/** Smooth line through every stop, with a rounded turn where one row hands over to the next. */
function path() {
  const pts: [number, number][] = [];
  let i = 0;
  rows.forEach((row, r) => {
    row.forEach(() => { const s = STOPS[i++]; pts.push([s.x, s.y]); });
    if (r < rows.length - 1) {
      const last = STOPS[i - 1], next = STOPS[i];
      const out = r % 2 === 0 ? 1 : -1;
      pts.push([Math.max(last.x, next.x) * (out > 0 ? 1 : 0) + Math.min(last.x, next.x) * (out > 0 ? 0 : 1) + out * 34, (last.y + next.y) / 2]);
    }
  });
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let k = 0; k < pts.length - 1; k++) {
    const a = pts[k - 1] ?? pts[k], b = pts[k], c = pts[k + 1], e = pts[k + 2] ?? c;
    d += ` C${(b[0] + (c[0] - a[0]) / 6).toFixed(1)},${(b[1] + (c[1] - a[1]) / 6).toFixed(1)} ${(c[0] - (e[0] - b[0]) / 6).toFixed(1)},${(c[1] - (e[1] - b[1]) / 6).toFixed(1)} ${c[0]},${c[1]}`;
  }
  return d;
}
const PATH = path();
const isTrack = (slug: string) => TRACKS.some((t) => t.slug === slug);

/**
 * The pipeline plotted as a line. `base` is the page the stops link to ("" for same-page anchors).
 * With `learn`, skill stops open their lessons and `status` colors each stop by progress.
 */
export function PipelineMap({ base = "", learn = false, status = {} }: { base?: string; learn?: boolean; status?: Record<string, State> }) {
  return (
    <div className="plot">
      <div className="plot-scroll">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`The Quant Pipeline: ${TRACKS.length} skill tracks in ${GROUPS.length} groups, then monthly seminars, then mentorship`}>
          {GROUPS.map((g, r) => (
            <text key={g.name} x={r % 2 === 0 ? LEFT - 14 : WIDTH - LEFT + 14} y={TOP + r * ROW - 46} textAnchor={r % 2 === 0 ? "start" : "end"} fontSize={13.5} fontWeight={700} fill="var(--ink)">
              {g.name}<tspan fontWeight={500} fill="var(--muted)">{"  " + g.blurb}</tspan>
            </text>
          ))}
          <path className="curve" d={PATH} pathLength={1} fill="none" stroke="var(--ink)" strokeWidth={3.5} strokeLinecap="round" />
          {STOPS.map((s) => {
            const st = status[s.slug] ?? "new";
            const href = learn && isTrack(s.slug) ? `/learn/${s.slug}` : `${base}#${s.slug}`;
            const word = st === "done" ? ", finished" : st === "now" ? ", in progress" : "";
            return (
              <Link key={s.slug} href={href} className="stop" style={{ "--i": s.n * 0.4 } as React.CSSProperties} aria-label={s.label.join(" ") + word}>
                <circle cx={s.x} cy={s.y} r={13} fill={st === "done" ? "var(--hi)" : "var(--paper)"} stroke="var(--pencil)" strokeWidth={st === "now" ? 4 : 2.5} />
                {st === "done" ? (
                  <path d={`M${s.x - 5.5},${s.y} l4,4 l7,-8`} fill="none" stroke="var(--pencil)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                ) : st === "now" ? (
                  <circle cx={s.x} cy={s.y} r={5} fill="var(--hi)" stroke="var(--pencil)" strokeWidth={1.5} />
                ) : (
                  <text x={s.x} y={s.y + 4.5} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="var(--pencil)" style={{ fontFamily: "var(--mono)" }}>{s.n}</text>
                )}
                <text x={s.x} y={s.y + 32} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--pencil)">
                  {s.label.map((t, k) => <tspan key={k} x={s.x} dy={k ? 15 : 0}>{t}</tspan>)}
                </text>
              </Link>
            );
          })}
        </svg>
      </div>
      <p className="plot-hint">Swipe sideways to follow the whole path.</p>
    </div>
  );
}
