"use client";
import { useState } from "react";

export function BetWidget() {
  const [pick, setPick] = useState<null | "play" | "pass">(null);
  return (
    <div className="bet">
      <p className="q">A fair coin. Heads, you win $12. Tails, you lose $4. Do you play?</p>
      <div className="btns">
        <button type="button" className={pick === "play" ? "btn" : "btn alt"} aria-pressed={pick === "play"} onClick={() => setPick("play")}>I&apos;d play</button>
        <button type="button" className={pick === "pass" ? "btn" : "btn alt"} aria-pressed={pick === "pass"} onClick={() => setPick("pass")}>I&apos;d pass</button>
      </div>
      <div aria-live="polite" className="stack-sm">
        {pick && (
          <>
            <p>
              {pick === "play" ? "A quant would too. " : "Passing feels safe, but a quant would play. "}
              They work out the <span className="hl">expected value</span>, the average result if you flipped forever:
            </p>
            <p className="ev">0.5 × $12 − 0.5 × $4 = +$4 a flip</p>
            <p className="muted">Now the harder question. You only have $20, and the stakes can be raised. How much do you bet each flip? Working that out is the job.</p>
          </>
        )}
      </div>
    </div>
  );
}
