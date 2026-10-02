export type Lang = "python" | "r" | "c";

/** A check on a code exercise. The first one that fails supplies the message shown to the student. */
export type Check =
  | { out: string; msg: string }          // regex the printed output must match
  | { code: string; msg: string }         // regex the source must match
  | { num: [number, number]; msg: string } // last number printed must fall in this range
  | { plot: true; msg: string };          // R only: the code must draw a plot

export type Matrix = { rows: [string, string]; cols: [string, string]; cells: [[[number, number], [number, number]], [[number, number], [number, number]]] };

export type Step =
  | { kind: "read"; title: string; body: string[]; example?: string }
  | { kind: "code"; title: string; body: string[]; task: string[]; lang: Lang; starter: string; solution: string; checks: Check[]; hint: string }
  | { kind: "mc"; title?: string; q: string; code?: string; options: string[]; answer: number; explain: string }
  | { kind: "num"; title?: string; q: string; answer: number; tol?: number; prefix?: string; explain: string }
  | { kind: "game"; title: string; body: string[]; matrix: Matrix; rounds: number; bot: "second" | "alternate"; debrief: string }
  | { kind: "pick"; title: string; q: string; matrix: Matrix; answers: [number, number][]; explain: string }
  | { kind: "sim"; title: string; body: string[]; win: number; lose: number; need: number };

export type Lesson = { slug: string; title: string; summary: string; quiz?: boolean; steps: Step[] };
export type TrackLessons = { track: string; lessons: Lesson[] };

export const PASS_MARK = 0.8;
