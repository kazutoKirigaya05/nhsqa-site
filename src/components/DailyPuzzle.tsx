"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/session";
import { useHydrated } from "@/lib/useHydrated";
import { dayNumber, isCorrect, parseAnswer, puzzleFor } from "@/content/puzzles";

const MAX_TRIES = 3;
const KEY = "nhsqa-daily-v1";
type Entry = { guesses: string[]; solved: boolean; done: boolean };
type Log = Record<number, Entry>;

function readLog(): Log {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Log; } catch { return {}; }
}
function writeLog(log: Log) {
  try { localStorage.setItem(KEY, JSON.stringify(log)); } catch {}
}

/** Days in a row solved, ending today, or yesterday if today is not finished yet. */
function streaks(log: Log, today: number) {
  let current = 0;
  let d = log[today]?.done ? today : today - 1;
  if (log[today]?.done && !log[today].solved) d = -1;
  while (d > 0 && log[d]?.solved) { current++; d--; }
  let best = 0, run = 0;
  const days = Object.keys(log).map(Number).sort((a, b) => a - b);
  let prev = -10;
  for (const day of days) {
    if (!log[day].solved) { run = 0; prev = day; continue; }
    run = day === prev + 1 ? run + 1 : 1;
    best = Math.max(best, run); prev = day;
  }
  const solved = days.filter((x) => log[x].solved).length;
  return { current, best: Math.max(best, current), solved };
}

function untilMidnight(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Indiana/Indianapolis", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(now);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const left = 24 * 60 - (h * 60 + m);
  return `${Math.floor(left / 60)}h ${left % 60}m`;
}

export function DailyPuzzle() {
  const hydrated = useHydrated();
  if (!hydrated) return <div className="wrap section"><p className="muted">Loading today&apos;s puzzle</p></div>;
  return <Inner />;
}

function Inner() {
  const today = useMemo(() => dayNumber(), []);
  const puzzle = puzzleFor(today);
  const session = useSession();
  const [log, setLog] = useState<Log>(() => readLog());
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ played: number; solved: number } | null>(null);
  const [clock, setClock] = useState(() => untilMidnight(new Date()));
  const entry: Entry = log[today] ?? { guesses: [], solved: false, done: false };
  const userId = session.status === "in" ? session.profile?.id ?? null : null;

  useEffect(() => { const t = setInterval(() => setClock(untilMidnight(new Date())), 30000); return () => clearInterval(t); }, []);

  // Logged in: merge the account's history with this browser's, and upload anything the account is missing.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    void (async () => {
      const { data } = await supabase().from("daily_puzzle_results").select("day, solved, tries");
      if (cancelled || !data) return;
      const local = readLog();
      const merged: Log = { ...local };
      const remoteDays = new Set<number>();
      for (const r of data as { day: number; solved: boolean; tries: number }[]) {
        remoteDays.add(r.day);
        if (!merged[r.day]?.done) merged[r.day] = { guesses: Array(r.tries).fill(""), solved: r.solved, done: true };
      }
      const upload = Object.entries(merged).filter(([d, e]) => e.done && !remoteDays.has(Number(d)))
        .map(([d, e]) => ({ user_id: userId, day: Number(d), solved: e.solved, tries: Math.min(MAX_TRIES, Math.max(1, e.guesses.length)) }));
      if (upload.length) await supabase().from("daily_puzzle_results").upsert(upload, { onConflict: "user_id,day" });
      writeLog(merged); setLog(merged);
    })();
    return () => { cancelled = true; };
  }, [userId]);

  useEffect(() => {
    if (!entry.done) return;
    void supabase().rpc("daily_puzzle_stats", { p_day: today }).then(({ data }) => {
      const row = Array.isArray(data) ? data[0] : null;
      if (row) setStats({ played: Number(row.played), solved: Number(row.solved) });
    });
  }, [entry.done, today]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (entry.done) return;
    const v = parseAnswer(value, puzzle.percent);
    if (v === null) { setMsg("Type a number. Fractions like 1/6 and decimals like 0.167 both work."); return; }
    const right = isCorrect(puzzle, v);
    const guesses = [...entry.guesses, value.trim()];
    const done = right || guesses.length >= MAX_TRIES;
    const next: Entry = { guesses, solved: right, done };
    const nextLog = { ...log, [today]: next };
    writeLog(nextLog); setLog(nextLog); setValue("");
    setMsg(right ? null : done ? null : `Not quite. ${MAX_TRIES - guesses.length} ${MAX_TRIES - guesses.length === 1 ? "try" : "tries"} left.`);
    if (done && userId) {
      void supabase().from("daily_puzzle_results").upsert({ user_id: userId, day: today, solved: right, tries: guesses.length }, { onConflict: "user_id,day" });
    }
  }

  const s = streaks(log, today);
  const squares = entry.guesses.map((_, i) => (entry.solved && i === entry.guesses.length - 1 ? "🟩" : "🟥")).join("");
  const shareText = `NHSQA Daily Puzzle #${today} ${squares}\n${entry.solved ? `Solved in ${entry.guesses.length}/${MAX_TRIES}` : `Stumped (X/${MAX_TRIES})`}${s.current > 1 ? ` · 🔥 ${s.current}-day streak` : ""}\nnhsqa.org/daily`;

  async function share() {
    try {
      if (navigator.share && /Mobi|Android|iPhone/i.test(navigator.userAgent)) await navigator.share({ text: shareText });
      else { await navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2500); }
    } catch {}
  }

  const yesterday = puzzleFor(today - 1);

  return (
    <>
      <section className="page-head">
        <div className="wrap stack">
          <p className="eyebrow num">Daily puzzle #{today} · {new Intl.DateTimeFormat("en-US", { timeZone: "America/Indiana/Indianapolis", weekday: "long", month: "long", day: "numeric" }).format(new Date())}</p>
          <h1 className="long">{puzzle.title}</h1>
          <div className="daily-tags">
            <span className="tag">{puzzle.topic}</span>
            <span className="tag" aria-label={`Difficulty ${puzzle.level} of 3`}>{"●".repeat(puzzle.level)}{"○".repeat(3 - puzzle.level)} {["", "Warm-up", "Interview", "Tough"][puzzle.level]}</span>
          </div>
        </div>
      </section>

      <section className="section sheet">
        <div className="wrap daily-grid">
          <div className="stack">
            <div className="card daily-card">
              <p className="daily-prompt">{puzzle.prompt}</p>
              {!entry.done ? (
                <form className="num-form" onSubmit={submit}>
                  <label htmlFor="daily-answer">Your answer</label>
                  <div className="num-row">
                    <input id="daily-answer" value={value} onChange={(e) => setValue(e.target.value)} inputMode="decimal" autoComplete="off" placeholder="e.g. 1/6" />
                    <button type="submit" className="btn">Check</button>
                  </div>
                  <div className="tries" aria-label={`${MAX_TRIES - entry.guesses.length} of ${MAX_TRIES} tries left`}>
                    {Array.from({ length: MAX_TRIES }, (_, i) => <span key={i} className={i < entry.guesses.length ? "try used" : "try"} />)}
                  </div>
                  <p className="hint-line">Fractions like 1/6, decimals like 0.167 and percents like 16.7% all work. You get {MAX_TRIES} tries.</p>
                  <div role="status">{msg && <p className="verdict bad">{msg}</p>}</div>
                  {entry.guesses.length > 0 && <p className="notice"><strong>Hint:</strong> {puzzle.hint}</p>}
                  {entry.guesses.length > 0 && <p className="hint-line">Your guesses: {entry.guesses.join(", ")}</p>}
                </form>
              ) : (
                <div className="stack-sm">
                  <p className={entry.solved ? "verdict ok" : "verdict bad"} role="status">
                    {entry.solved ? `Solved in ${entry.guesses.length} ${entry.guesses.length === 1 ? "try" : "tries"}.` : "Out of tries. Here's how it works."}
                  </p>
                  <p><strong>Answer: <span className="num">{puzzle.shown}</span></strong></p>
                  <p>{puzzle.why}</p>
                  <div className="btns">
                    <button type="button" className="btn" onClick={() => { void share(); }}>{copied ? "Copied!" : "Share your result"}</button>
                    <Link className="btn alt" href="/learn">Practice more</Link>
                  </div>
                  <pre className="share-preview" aria-label="Share text">{shareText}</pre>
                </div>
              )}
            </div>
            {today > 1 && <details className="card">
              <summary><strong>Yesterday: {yesterday.title}</strong></summary>
              <p>{yesterday.prompt}</p>
              <p><strong>Answer: <span className="num">{yesterday.shown}</span></strong></p>
              <p>{yesterday.why}</p>
            </details>}
          </div>

          <aside className="stack">
            <div className="card">
              <h2 className="h3">Your streak</h2>
              <div className="daily-stats">
                <div><span className="big num">{s.current}</span><span>{s.current === 1 ? "day" : "days"} in a row</span></div>
                <div><span className="big num">{s.best}</span><span>best streak</span></div>
                <div><span className="big num">{s.solved}</span><span>solved</span></div>
              </div>
              {session.status !== "in" && <p className="hint-line"><Link href="/join">Join free</Link> or <Link href="/login">log in</Link> to save your streak to your account. Right now it is only saved in this browser.</p>}
            </div>
            {entry.done && stats && stats.played > 0 && (
              <div className="card">
                <h2 className="h3">Today on NHSQA</h2>
                <p><span className="num">{stats.solved}</span> of <span className="num">{stats.played}</span> members solved it ({Math.round((100 * stats.solved) / stats.played)}%).</p>
              </div>
            )}
            <div className="card">
              <h2 className="h3">Next puzzle</h2>
              <p>A new puzzle drops at midnight Eastern, in <span className="num">{clock}</span>.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
