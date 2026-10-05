import type { Check, Lang, Lesson, Matrix, Step } from "./types";

// Short builders so lesson files read as content, not boilerplate.
export const read = (title: string, body: string[], example?: string): Step => ({ kind: "read", title, body, example });
export const mc = (q: string, options: string[], answer: number, explain: string, code?: string): Step => ({ kind: "mc", q, options, answer, explain, code });
export const num = (q: string, answer: number, explain: string, o: { tol?: number; prefix?: string } = {}): Step => ({ kind: "num", q, answer, explain, ...o });
export const game = (title: string, body: string[], matrix: Matrix, rounds: number, bot: "second" | "alternate" | "random" | "copycat", debrief: string): Step => ({ kind: "game", title, body, matrix, rounds, bot, debrief });

const coder = (lang: Lang) => (title: string, body: string[], task: string[], starter: string, solution: string, checks: Check[], hint: string): Step =>
  ({ kind: "code", lang, title, body, task, starter: tidy(starter), solution: tidy(solution), checks, hint });
/** An exercise with a task and a check. */
export const py = coder("python");
export const rlang = coder("r");
export const clang = coder("c");
/** A sandbox: working code to run and change. It completes the first time it runs without an error. */
export const tryPy = (title: string, body: string[], task: string[], code: string): Step =>
  ({ kind: "code", lang: "python", title, body, task, starter: tidy(code), solution: tidy(code), checks: [], hint: "", free: true });

export const out = (re: string, msg: string): Check => ({ out: re, msg });
export const src = (re: string, msg: string): Check => ({ code: re, msg });
export const between = (lo: number, hi: number, msg: string): Check => ({ num: [lo, hi], msg });

export const lesson = (slug: string, title: string, summary: string, steps: Step[]): Lesson => ({ slug, title, summary, steps });
export const quiz = (steps: Step[]): Lesson => ({ slug: "quiz", title: "Track quiz", summary: "Five questions. Get four right to finish the track.", quiz: true, steps });

/** Strips the leading blank line of a template string and guarantees one trailing newline. */
function tidy(code: string) { return code.replace(/^\n/, "").replace(/\s*$/, "") + "\n"; }
