"use client";
import { useState } from "react";
import type { Matrix, Step } from "@/content/lessons/types";
import { Body } from "./Rich";

type Game = Extract<Step, { kind: "game" }>;
type Pick = Extract<Step, { kind: "pick" }>;
type Sim = Extract<Step, { kind: "sim" }>;

const fmt = (n: number) => (n < 0 ? `−${-n}` : String(n));

function Table({ m, mark, selected, onCell }: { m: Matrix; mark?: [number, number] | null; selected?: string[]; onCell?: (r: number, c: number) => void }) {
  return (
    <div className="payoff-wrap">
      <table className="payoff big">
        <thead><tr><td style={{ border: 0 }} /><th scope="col">Rival: {m.cols[0]}</th><th scope="col">Rival: {m.cols[1]}</th></tr></thead>
        <tbody>
          {[0, 1].map((r) => (
            <tr key={r}>
              <th scope="row">You: {m.rows[r]}</th>
              {[0, 1].map((c) => {
                const text = `${fmt(m.cells[r][c][0])}, ${fmt(m.cells[r][c][1])}`;
                const on = (mark && mark[0] === r && mark[1] === c) || selected?.includes(`${r},${c}`);
                return (
                  <td key={c} className={on ? "on" : undefined}>
                    {onCell ? <button type="button" aria-pressed={!!on} aria-label={`You ${m.rows[r]}, rival ${m.cols[c]}: ${text}`} onClick={() => onCell(r, c)}>{text}</button> : text}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Play a 2 × 2 game for several rounds against a simple rival. */
export function GameStep({ step, onPass }: { step: Game; onPass: () => void }) {
  const [history, setHistory] = useState<[number, number][]>([]);
  const round = history.length;
  const over = round >= step.rounds;
  const you = history.reduce((s, [r, c]) => s + step.matrix.cells[r][c][0], 0);
  const rival = history.reduce((s, [r, c]) => s + step.matrix.cells[r][c][1], 0);

  function play(r: number) {
    if (over) return;
    const c = step.bot === "second" ? 1 : round % 2 === 0 ? 1 : 0;
    const next = [...history, [r, c] as [number, number]];
    setHistory(next);
    if (next.length >= step.rounds) onPass();
  }

  return (
    <div className="question wide">
      <h2>{step.title}</h2>
      <Body body={step.body} />
      <Table m={step.matrix} mark={round ? history[round - 1] : null} />
      <div className="scorebar">
        <span>Round <b className="num">{Math.min(round + 1, step.rounds)}</b> of <span className="num">{step.rounds}</span></span>
        <span>You <b className="num">{fmt(you)}</b></span>
        <span>Rival <b className="num">{fmt(rival)}</b></span>
      </div>
      {!over && (
        <div className="btns">
          {[0, 1].map((r) => <button type="button" key={r} className="btn alt" onClick={() => play(r)}>{step.matrix.rows[r]}</button>)}
        </div>
      )}
      <div aria-live="polite" className="stack-sm">
        {round > 0 && (
          <p>Last round you chose <b>{step.matrix.rows[history[round - 1][0]]}</b> and your rival chose <b>{step.matrix.cols[history[round - 1][1]]}</b>.</p>
        )}
        {over && <p className="verdict ok">{step.debrief}</p>}
      </div>
      {over && <button type="button" className="linkbtn" onClick={() => setHistory([])}>Play again</button>}
    </div>
  );
}

/** Click the cell or cells that answer the question. */
export function PickStep({ step, onPass }: { step: Pick; onPass: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [state, setState] = useState<null | "right" | "wrong">(null);
  const want = step.answers.map(([r, c]) => `${r},${c}`).sort().join("|");

  function toggle(r: number, c: number) {
    if (state === "right") return;
    const k = `${r},${c}`;
    setState(null);
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : step.answers.length === 1 ? [k] : [...s, k]));
  }
  function check() {
    const ok = [...selected].sort().join("|") === want;
    setState(ok ? "right" : "wrong");
    if (ok) onPass();
  }

  return (
    <div className="question wide">
      <h2>{step.title}</h2>
      <p>{step.q}</p>
      <Table m={step.matrix} selected={selected} onCell={toggle} />
      <div className="btns"><button type="button" className="btn sm" disabled={!selected.length || state === "right"} onClick={check}>Check</button></div>
      <div aria-live="polite">
        {state === "right" && <p className="verdict ok">Correct. {step.explain}</p>}
        {state === "wrong" && <p className="verdict bad">Not quite. For each cell, ask: could either player do better by switching their own choice?</p>}
      </div>
    </div>
  );
}

/** Coin-bet simulator: the running average closes in on the expected value. */
export function SimStep({ step, onPass }: { step: Sim; onPass: () => void }) {
  const [avgs, setAvgs] = useState<number[]>([]);
  const [total, setTotal] = useState(0);
  const n = avgs.length;
  const ev = 0.5 * step.win - 0.5 * step.lose;

  function flip(k: number) {
    let t = total; const next = avgs.slice();
    for (let i = 0; i < k; i++) { t += Math.random() < 0.5 ? step.win : -step.lose; next.push(t / (next.length + 1)); }
    setTotal(t); setAvgs(next);
    if (next.length >= step.need) onPass();
  }

  const W = 520, H = 200, L = 40, R = 12, T = 12, B = 26;
  const lo = -step.lose, hi = step.win;
  const x = (i: number) => L + ((W - L - R) * i) / Math.max(n - 1, 20);
  const y = (v: number) => T + ((H - T - B) * (hi - v)) / (hi - lo);
  const stride = Math.max(1, Math.floor(n / 400));
  const idx: number[] = [];
  for (let i = 0; i < n; i += stride) idx.push(i);
  if (n && idx[idx.length - 1] !== n - 1) idx.push(n - 1);
  const pts = idx.map((i) => `${x(i).toFixed(1)},${y(avgs[i]).toFixed(1)}`).join(" ");

  return (
    <div className="question wide">
      <h2>{step.title}</h2>
      <Body body={step.body} />
      <div className="sim-chart">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Average winnings per flip after ${n} flips`}>
          {[hi, ev, 0, lo].map((v) => (
            <g key={v}>
              <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke={v === ev ? "var(--pencil)" : "var(--line)"} strokeWidth={v === ev ? 1.5 : 1} strokeDasharray={v === ev ? "6 5" : undefined} />
              <text x={L - 6} y={y(v) + 4} textAnchor="end" fontSize={12} fill="var(--muted)" style={{ fontFamily: "var(--mono)" }}>{v < 0 ? `−$${-v}` : `$${v}`}</text>
            </g>
          ))}
          <text x={W - R} y={H - 6} textAnchor="end" fontSize={12} fill="var(--muted)">{n} flips</text>
          {n > 1 && <polyline points={pts} fill="none" stroke="var(--ink)" strokeWidth={2.5} strokeLinejoin="round" />}
          {n > 0 && <circle cx={x(n - 1)} cy={y(avgs[n - 1])} r={4.5} fill="var(--hi)" stroke="var(--pencil)" strokeWidth={1.5} />}
        </svg>
      </div>
      <div className="scorebar" aria-live="polite">
        <span>Flips <b className="num">{n}</b></span>
        <span>Average per flip <b className="num">{n ? `$${(total / n).toFixed(2)}` : "none yet"}</b></span>
        <span>Expected value <b className="num">${ev.toFixed(2)}</b></span>
      </div>
      <div className="btns">
        <button type="button" className="btn alt sm" onClick={() => flip(1)}>Flip once</button>
        <button type="button" className="btn alt sm" onClick={() => flip(10)}>Flip 10</button>
        <button type="button" className="btn sm" onClick={() => flip(100)}>Flip 100</button>
        <button type="button" className="linkbtn" onClick={() => { setAvgs([]); setTotal(0); }}>Start over</button>
      </div>
    </div>
  );
}
