"use client";
import { useState } from "react";
import type { Step } from "@/content/lessons/types";
import { Rich } from "./Rich";

type Mc = Extract<Step, { kind: "mc" }>;
type Num = Extract<Step, { kind: "num" }>;
type Props<T> = { step: T; quiz: boolean; onPass: () => void; onAnswer: (correct: boolean) => void };

/** Multiple choice. In a lesson you can try again; in a quiz the first answer counts. */
export function McStep({ step, quiz, onPass, onAnswer }: Props<Mc>) {
  const [wrong, setWrong] = useState<number[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);
  const solved = chosen === step.answer;
  const locked = solved || (quiz && chosen !== null);

  function pick(i: number) {
    if (locked) return;
    setChosen(i);
    if (i === step.answer) { onPass(); onAnswer(true); }
    else { setWrong((w) => [...w, i]); if (quiz) onAnswer(false); }
  }

  return (
    <div className="question">
      <h2><Rich text={step.q} /></h2>
      {step.code && <pre className="snippet">{step.code}</pre>}
      <div className="options" role="group" aria-label="Answers">
        {step.options.map((o, i) => {
          const state = locked && i === step.answer ? "right" : wrong.includes(i) ? "wrong" : "";
          return (
            <button type="button" key={i} className={`option ${state}`} disabled={locked || wrong.includes(i)} onClick={() => pick(i)}>
              <span className="letter">{"ABCD"[i]}</span><span><Rich text={o} /></span>
            </button>
          );
        })}
      </div>
      <div aria-live="polite">
        {locked && <p className={solved ? "verdict ok" : "verdict bad"}>{solved ? "Correct. " : "Not this time. "}{step.explain}</p>}
        {!locked && wrong.length > 0 && <p className="verdict bad">Not quite. Try another answer.</p>}
      </div>
    </div>
  );
}

function parse(text: string): number | null {
  const t = text.replace(/[$,\s]/g, "").replace("−", "-");
  const frac = t.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(t)) return null;
  return Number(t);
}

/** Numeric answer. Accepts decimals or a fraction like 1/6. */
export function NumStep({ step, quiz, onPass, onAnswer }: Props<Num>) {
  const [text, setText] = useState("");
  const [tries, setTries] = useState(0);
  const [state, setState] = useState<null | "right" | "wrong" | "invalid" | "shown">(null);
  const locked = state === "right" || state === "shown" || (quiz && state === "wrong");

  function check(e: React.FormEvent) {
    e.preventDefault();
    if (locked) return;
    const v = parse(text);
    if (v === null) { setState("invalid"); return; }
    const ok = Math.abs(v - step.answer) <= (step.tol ?? 0.005);
    setTries((n) => n + 1);
    setState(ok ? "right" : "wrong");
    if (ok) onPass();
    if (ok || quiz) onAnswer(ok);
  }

  return (
    <div className="question">
      <h2><Rich text={step.q} /></h2>
      <form className="num-form" onSubmit={check}>
        <label htmlFor="num-answer">Your answer</label>
        <div className="num-row">
          {step.prefix && <span className="num">{step.prefix}</span>}
          <input id="num-answer" inputMode="decimal" autoComplete="off" value={text} disabled={locked} onChange={(e) => { setText(e.target.value); if (state === "invalid") setState(null); }} />
          <button type="submit" className="btn sm" disabled={locked || !text.trim()}>Check</button>
        </div>
        <span className="hint-line">A decimal like 0.25 or a fraction like 1/4.</span>
      </form>
      <div aria-live="polite">
        {state === "invalid" && <p className="verdict bad">Enter a number, like 0.25 or 1/4.</p>}
        {state === "right" && <p className="verdict ok">Correct. {step.explain}</p>}
        {state === "wrong" && quiz && <p className="verdict bad">Not this time. {step.explain}</p>}
        {state === "wrong" && !quiz && <p className="verdict bad">Not quite. Check your working and try again.</p>}
        {state === "shown" && <p className="verdict">{step.explain}</p>}
      </div>
      {!quiz && state === "wrong" && tries >= 2 && (
        <button type="button" className="linkbtn" onClick={() => { setState("shown"); onPass(); }}>Show me how it is worked out</button>
      )}
    </div>
  );
}
