// The mailer box cutout, redrawn from the manufacturer's sheet. Coordinates are inches.
const S = 30, MX = 30, MY = 48;
const X = (v: number) => MX + v * S, Y = (v: number) => MY + v * S;
const poly = (pts: [number, number][]) => "M" + pts.map(([x, y]) => `${X(x)},${Y(y)}`).join(" L") + " Z";
const rect = (x: number, y: number, w: number, h: number) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);

const tabs = (y: number, dir: 1 | -1): [number, number][] => [[10.6, y], [10.7, y + 0.25 * dir], [11.2, y + 0.25 * dir], [11.3, y], [12.9, y], [13, y + 0.25 * dir], [13.5, y + 0.25 * dir], [13.6, y]];
const SHAPES = [
  `M${X(2.1)},${Y(5)} L${X(0.6)},${Y(5)} Q${X(0)},${Y(5)} ${X(0)},${Y(5.6)} L${X(0)},${Y(11.4)} Q${X(0)},${Y(12)} ${X(0.6)},${Y(12)} L${X(2.1)},${Y(12)} Z`,
  rect(2.1, 5, 5, 7), rect(7.1, 5, 2.5, 7), rect(9.6, 5, 5, 7), rect(14.6, 5, 2.5, 7),
  rect(9.6, 2.5, 5, 2.5), rect(9.6, 12, 5, 2.5),
  poly([[9.6, 2.5], [9.6, 0], ...tabs(0, -1), [14.6, 0], [14.6, 2.5]]),
  poly([[9.6, 14.5], [9.6, 17], ...tabs(17, 1), [14.6, 17], [14.6, 14.5]]),
  poly([[2.5, 5], [2.9, 3.6], [6.3, 3.6], [6.7, 5]]), poly([[2.5, 12], [2.9, 13.4], [6.3, 13.4], [6.7, 12]]),
  poly([[7.2, 5], [7.3, 2.9], [9.4, 2.9], [9.5, 5]]), poly([[7.2, 12], [7.3, 14.1], [9.4, 14.1], [9.5, 12]]),
  poly([[14.7, 5], [14.8, 2.9], [16.95, 2.9], [17.05, 5]]), poly([[14.7, 12], [14.8, 14.1], [16.95, 14.1], [17.05, 12]]),
].join(" ");

const CREASES: [number, number, number, number][] = [
  [2.1, 5, 2.1, 12], [7.1, 5, 7.1, 12], [9.6, 5, 9.6, 12], [14.6, 5, 14.6, 12],
  [9.6, 5, 14.6, 5], [9.6, 12, 14.6, 12], [9.6, 2.5, 14.6, 2.5], [9.6, 14.5, 14.6, 14.5],
  [2.5, 5, 6.7, 5], [2.5, 12, 6.7, 12], [7.2, 5, 9.5, 5], [7.2, 12, 9.5, 12], [14.7, 5, 17.05, 5], [14.7, 12, 17.05, 12],
];
const SLOTS: [number, number][] = [[10.7, 5.12], [13, 5.12], [10.7, 11.76], [13, 11.76]];
const LABELS: [string, number, number][] = [["Tuck flap", 1.05, 8.6], ["Lid", 4.6, 8.6], ["Back", 8.35, 8.6], ["Base", 12.1, 8.6], ["Front", 15.85, 8.6], ["Side", 12.1, 3.85], ["Side", 12.1, 13.35], ["Roll-over", 12.1, 1.35], ["Roll-over", 12.1, 15.85]];

function Dim({ x1, y1, x2, y2, text }: { x1: number; y1: number; x2: number; y2: number; text: string }) {
  const vertical = x1 === x2;
  const mx = (X(x1) + X(x2)) / 2, my = (Y(y1) + Y(y2)) / 2;
  return (
    <g stroke="var(--pencil)" strokeWidth={1.2} fill="none">
      <line x1={X(x1)} y1={Y(y1)} x2={X(x2)} y2={Y(y2)} />
      {vertical
        ? <><line x1={X(x1) - 5} y1={Y(y1)} x2={X(x1) + 5} y2={Y(y1)} /><line x1={X(x2) - 5} y1={Y(y2)} x2={X(x2) + 5} y2={Y(y2)} /></>
        : <><line x1={X(x1)} y1={Y(y1) - 5} x2={X(x1)} y2={Y(y1) + 5} /><line x1={X(x2)} y1={Y(y2) - 5} x2={X(x2)} y2={Y(y2) + 5} /></>}
      <text x={vertical ? mx + 9 : mx} y={vertical ? my + 4 : my - 8} textAnchor={vertical ? "start" : "middle"} fontSize={13} fontWeight={500} fill="var(--pencil)" stroke="none">{text}</text>
    </g>
  );
}

export function Blueprint() {
  return (
    <div className="blueprint">
      <svg viewBox={`0 0 ${X(17.1) + 84} ${Y(17.25) + 26}`} role="img" aria-label="Blueprint of the kit box laid flat: tuck flap, lid, back, base and front in a row, with side walls above and below the base. The base is 7 by 5 inches and the walls are 2.5 inches high.">
        <path d={SHAPES} fill="none" stroke="#2e9e4f" strokeWidth={9} strokeLinejoin="round" />
        <path d={SHAPES} fill="none" stroke="var(--paper)" strokeWidth={6} strokeLinejoin="round" />
        <path d={SHAPES} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.6} strokeLinejoin="round" />
        {CREASES.map(([a, b, c, d], i) => <line key={i} x1={X(a)} y1={Y(b)} x2={X(c)} y2={Y(d)} stroke="#d1332e" strokeWidth={1.6} />)}
        {SLOTS.map(([x, y], i) => <rect key={i} x={X(x)} y={Y(y)} width={0.6 * S} height={0.12 * S} rx={1.8} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.4} />)}
        {LABELS.map(([t, x, y], i) => <text key={i} x={X(x)} y={Y(y)} textAnchor="middle" fontSize={12} fill="var(--muted)" style={{ fontFamily: "var(--text)" }}>{t}</text>)}
        <Dim x1={9.6} y1={-0.9} x2={14.6} y2={-0.9} text="5 in" />
        <Dim x1={17.75} y1={5} x2={17.75} y2={12} text="7 in" />
        <Dim x1={14.6} y1={15.3} x2={17.1} y2={15.3} text="2.5 in" />
      </svg>
    </div>
  );
}
