"use client";
import { useState } from "react";
import type { Step } from "@/content/lessons/types";
import { runCode, FILE_NAME, LANG_NAME, type RunResult } from "@/lib/runner";
import { grade } from "@/lib/checks";
import { loadCode, saveCode } from "@/lib/progress";
import { Editor } from "./Editor";
import { Body, Rich } from "./Rich";

type CodeStepT = Extract<Step, { kind: "code" }>;

export function CodeStep({ step, id, passed, onPass }: { step: CodeStepT; id: string; passed: boolean; onPass: () => void }) {
  const [code, setCode] = useState(() => loadCode(id) ?? step.starter);
  const [editorKey, setEditorKey] = useState(0);
  const [busy, setBusy] = useState<null | "run" | "check">(null);
  const [result, setResult] = useState<RunResult | null>(null);
  const [verdict, setVerdict] = useState<null | { ok: boolean; msg: string }>(null);

  const change = (c: string) => { setCode(c); saveCode(id, c); };
  const load = (c: string) => { setCode(c); saveCode(id, c === step.starter ? null : c); setEditorKey((k) => k + 1); setVerdict(null); setResult(null); };

  async function go(mode: "run" | "check") {
    setBusy(mode); setVerdict(null);
    const res = await runCode(step.lang, code);
    setResult(res);
    if (step.free) {
      if (!res.error) onPass();
    } else if (mode === "check") {
      const fail = grade(step.checks, code, res);
      setVerdict(fail ? { ok: false, msg: fail } : { ok: true, msg: "Correct. On to the next step." });
      if (!fail) onPass();
    }
    setBusy(null);
  }

  return (
    <div className="code-step">
      <div className="inst">
        <h2>{step.title}</h2>
        <Body body={step.body} />
        {step.free ? (
          <div className="task"><h3>Try it</h3><ul>{step.task.map((t, i) => <li key={i} className="free"><Rich text={t} /></li>)}</ul></div>
        ) : (
          <>
            <div className="task">
              <h3>{passed ? "Done" : "Your task"}</h3>
              <ul>{step.task.map((t, i) => <li key={i} className={passed ? "ok" : undefined}><Rich text={t} /></li>)}</ul>
            </div>
            <details className="hint"><summary>Stuck? Show a hint</summary><pre>{step.hint}</pre></details>
          </>
        )}
        <div aria-live="polite">{verdict && <p className={verdict.ok ? "verdict ok" : "verdict bad"}>{verdict.msg}</p>}</div>
      </div>
      <div className="workspace">
        <div className="ws-bar"><span className="file">{FILE_NAME[step.lang]}</span><span className="lang">{LANG_NAME[step.lang]}</span></div>
        <Editor key={editorKey} lang={step.lang} initial={code} onChange={change} label={`${LANG_NAME[step.lang]} code editor`} />
        <div className="ws-actions">
          <button type="button" className={step.free ? "btn sm" : "btn alt sm"} disabled={!!busy} onClick={() => go("run")}>{busy === "run" ? "Running" : "Run"}</button>
          {!step.free && <button type="button" className="btn sm" disabled={!!busy} onClick={() => go("check")}>{busy === "check" ? "Checking" : "Check"}</button>}
          <span className="spacer" />
          <button type="button" className="linkbtn" disabled={!!busy} onClick={() => load(step.starter)}>{step.free ? "Reset the code" : "Start over"}</button>
          {!step.free && <button type="button" className="linkbtn" disabled={!!busy} onClick={() => load(step.solution)}>Show solution</button>}
        </div>
        <div className="console" role="log" aria-label="Output">
          {busy && !result && <p className="dim">Starting {LANG_NAME[step.lang]}. The first run takes a few seconds.</p>}
          {!busy && !result && <p className="dim">Output appears here when you press Run.</p>}
          {result && (
            <>
              {result.out && <pre>{result.out}</pre>}
              {result.error && <pre className="err">{result.error}</pre>}
              {!result.out && !result.error && !result.images?.length && <p className="dim">Your code ran and printed nothing.</p>}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {result.images?.map((src, i) => <img key={i} src={src} alt="Chart drawn by your code" />)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
