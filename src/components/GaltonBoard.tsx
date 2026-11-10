"use client";
import { useEffect, useRef, useState } from "react";

const ROWS = 9;            // nine left-or-right bounces, so ten bins: the ten bars of the NHSQA mark
const BINS = ROWS + 1;
const FIRST = 300;         // balls dropped when the page opens
const MORE = 200;          // balls dropped per button press
const NAVY = "#141b4d", PEG = "#6a73ad", GREY = "#8e96a8", YELLOW = "#ffc629";

type Ball = { path: number[]; t: number };

/** A Galton board: every ball bounces left or right at random, and the pile becomes a bell curve. */
export function GaltonBoard() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const sim = useRef({ counts: new Array<number>(BINS).fill(0), balls: [] as Ball[], queue: 0, tick: 0, raf: 0, still: false });
  const [dropped, setDropped] = useState(0);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const g = c.getContext("2d");
    if (!g) return;
    const s = sim.current;
    s.still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const walk = () => Array.from({ length: ROWS }, () => (Math.random() < 0.5 ? 0 : 1));
    const land = (path: number[]) => { s.counts[path.reduce((a, b) => a + b, 0)]++; };

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = c.clientWidth, h = c.clientHeight;
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      const gap = w / (BINS + 0.6), cx = w / 2;
      const top = gap * 0.7, rowH = (h * 0.5 - top) / ROWS, pegEnd = top + ROWS * rowH;
      const floor = h - 4, barMax = floor - pegEnd - gap * 0.5;
      const pegX = (r: number, i: number) => cx + (i - r / 2) * gap;

      g.fillStyle = PEG;
      for (let r = 0; r < ROWS; r++) for (let i = 0; i <= r; i++) { g.beginPath(); g.arc(pegX(r, i), top + r * rowH, Math.max(2.2, gap * 0.07), 0, 7); g.fill(); }

      const peak = Math.max(12, ...s.counts);
      const bw = gap * 0.72;
      for (let b = 0; b < BINS; b++) {
        const x = cx + (b - (BINS - 1) / 2) * gap, bh = (s.counts[b] / peak) * barMax;
        g.fillStyle = b === 4 || b === 5 ? YELLOW : GREY;
        g.fillRect(x - bw / 2, floor - bh, bw, bh);
      }
      g.fillStyle = PEG; g.fillRect(cx - (BINS / 2) * gap, floor, BINS * gap, 2);

      g.fillStyle = YELLOW;
      for (const ball of s.balls) {
        // t runs 0..ROWS+1: one unit per row, then a drop into the bin
        const r = Math.min(Math.floor(ball.t), ROWS), f = ball.t - r;
        const k = ball.path.slice(0, r).reduce((a, b) => a + b, 0);
        let x: number, y: number;
        if (r < ROWS) {
          const x0 = pegX(r, k), x1 = pegX(r + 1, k + ball.path[r]);
          x = x0 + (x1 - x0) * f;
          y = top + r * rowH - gap * 0.2 + rowH * f - Math.sin(f * Math.PI) * rowH * 0.35;
        } else {
          x = cx + (k - (BINS - 1) / 2) * gap;
          const y0 = pegEnd - gap * 0.2, y1 = floor - (s.counts[k] / peak) * barMax;
          y = y0 + (y1 - y0) * Math.min(1, f * f);
        }
        g.beginPath(); g.arc(x, y, Math.max(3, gap * 0.13), 0, 7); g.fill();
      }
    };

    const step = () => {
      s.tick++;
      if (s.queue > 0 && s.tick % 3 === 0) { s.balls.push({ path: walk(), t: 0 }); s.queue--; }
      let landed = 0;
      for (const ball of s.balls) ball.t += 0.11;
      s.balls = s.balls.filter((ball) => { if (ball.t >= ROWS + 1) { land(ball.path); landed++; return false; } return true; });
      if (landed) setDropped((n) => n + landed);
      draw();
      if (s.queue > 0 || s.balls.length) s.raf = requestAnimationFrame(step); else s.raf = 0;
    };
    const add = (n: number) => {
      if (s.still) { for (let i = 0; i < n; i++) land(walk()); setDropped((d) => d + n); draw(); return; }
      s.queue += n;
      if (!s.raf) s.raf = requestAnimationFrame(step);
    };
    const reset = () => { s.counts.fill(0); s.balls = []; s.queue = 0; setDropped(0); draw(); };
    (c as HTMLCanvasElement & { add?: (n: number) => void; reset?: () => void }).add = add;
    (c as HTMLCanvasElement & { add?: (n: number) => void; reset?: () => void }).reset = reset;

    const ro = new ResizeObserver(draw);
    ro.observe(c);
    add(FIRST);
    return () => { ro.disconnect(); cancelAnimationFrame(s.raf); s.raf = 0; };
  }, []);

  const call = (name: "add" | "reset", n = 0) => {
    const c = canvas.current as (HTMLCanvasElement & { add?: (n: number) => void; reset?: () => void }) | null;
    if (name === "add") c?.add?.(n); else c?.reset?.();
  };

  return (
    <div className="galton">
      <canvas ref={canvas} role="img" aria-label="A Galton board. Balls bounce left or right at random through nine rows of pegs and pile up into a bell curve." style={{ background: NAVY }} />
      <div className="galton-foot">
        <p className="galton-count" aria-live="off"><b>{dropped.toLocaleString("en-US")}</b> random drops, one shape</p>
        <div className="chips">
          <button type="button" className="chip" onClick={() => call("add", MORE)}>Drop {MORE} more</button>
          <button type="button" className="chip" onClick={() => call("reset")}>Clear</button>
        </div>
      </div>
      <p>Each ball bounces left or right nine times, like nine coin flips. Nobody can call where one ball lands. Anyone can call the pile. That is the idea quants build on.</p>
    </div>
  );
}
