"use client";
import { useSyncExternalStore } from "react";
import { LESSONS } from "@/content/lessons";
import { PASS_MARK } from "@/content/lessons/types";

/** Progress lives in this browser until accounts exist. The shape is what the database will store later. */
export type Progress = {
  steps: Record<string, boolean[]>;                       // "track/lesson" -> passed flag per step
  quiz: Record<string, { score: number; total: number }>; // "track/lesson" -> best attempt
};

const KEY = "nhsqa-progress-v1";
const EMPTY: Progress = { steps: {}, quiz: {} };
let cache: Progress = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function read(): Progress {
  if (!loaded) {
    loaded = true;
    try { const raw = localStorage.getItem(KEY); if (raw) cache = { ...EMPTY, ...JSON.parse(raw) }; } catch {}
  }
  return cache;
}
function write(next: Progress) {
  cache = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  listeners.forEach((l) => l());
}

export function useProgress(): Progress {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, read, () => EMPTY);
}

export function markStep(key: string, index: number, total: number) {
  const p = read();
  const arr = [...(p.steps[key] ?? [])];
  while (arr.length < total) arr.push(false);
  if (arr[index]) return;
  arr[index] = true;
  write({ ...p, steps: { ...p.steps, [key]: arr } });
  remoteSave?.(key);
}

export function saveQuiz(key: string, score: number, total: number) {
  const p = read();
  const best = p.quiz[key];
  if (best && best.score >= score) return;
  write({ ...p, quiz: { ...p.quiz, [key]: { score, total } } });
  remoteSave?.(key);
}

export function resetProgress() {
  const keys = new Set([...Object.keys(cache.steps), ...Object.keys(cache.quiz)]);
  write(EMPTY);
  keys.forEach((k) => remoteSave?.(k));
}

/* ---- account sync: session.ts plugs a saver in when someone is logged in ---- */
let remoteSave: ((key: string) => void) | null = null;
export function setRemoteSaver(fn: ((key: string) => void) | null) { remoteSave = fn; }

export function exportLesson(key: string) {
  const p = read();
  return { steps: p.steps[key] ?? [], quiz: p.quiz[key] ?? null };
}

type RemoteRow = { lesson_key: string; steps: unknown; quiz_score: number | null; quiz_total: number | null };
/** Merges the account's saved progress with this browser's. Returns the lessons the account is missing. */
export function mergeRemote(rows: RemoteRow[]): string[] {
  const local = read();
  const steps = { ...local.steps }; const quiz = { ...local.quiz };
  const upload = new Set<string>();
  const seen = new Set<string>();
  for (const row of rows) {
    const key = row.lesson_key; seen.add(key);
    const remote = Array.isArray(row.steps) ? row.steps.map(Boolean) : [];
    const mine = local.steps[key] ?? [];
    const merged = Array.from({ length: Math.max(remote.length, mine.length) }, (_, i) => !!remote[i] || !!mine[i]);
    if (merged.length) steps[key] = merged;
    if (merged.some((v, i) => v && !remote[i])) upload.add(key);
    const lq = local.quiz[key];
    if (row.quiz_score !== null && row.quiz_total !== null && (!lq || row.quiz_score >= lq.score)) quiz[key] = { score: row.quiz_score, total: row.quiz_total };
    else if (lq) upload.add(key);
  }
  for (const key of new Set([...Object.keys(local.steps), ...Object.keys(local.quiz)])) if (!seen.has(key)) upload.add(key);
  write({ steps, quiz });
  return [...upload];
}

export function clearLocalProgress() {
  write(EMPTY);
  try { localStorage.removeItem(CODE_KEY); } catch {}
}

export function lessonDone(p: Progress, track: string, slug: string): boolean {
  const lesson = LESSONS[track]?.find((l) => l.slug === slug);
  if (!lesson) return false;
  const key = `${track}/${slug}`;
  if (lesson.quiz) { const q = p.quiz[key]; return !!q && q.score / q.total >= PASS_MARK; }
  const arr = p.steps[key] ?? [];
  return lesson.steps.every((_, i) => arr[i]);
}
export function lessonStarted(p: Progress, track: string, slug: string): boolean {
  const key = `${track}/${slug}`;
  return (p.steps[key] ?? []).some(Boolean) || !!p.quiz[key];
}
export function trackStatus(p: Progress, track: string): { done: number; total: number; state: "new" | "now" | "done" } {
  const lessons = LESSONS[track] ?? [];
  const done = lessons.filter((l) => lessonDone(p, track, l.slug)).length;
  const started = lessons.some((l) => lessonStarted(p, track, l.slug));
  return { done, total: lessons.length, state: lessons.length > 0 && done === lessons.length ? "done" : started ? "now" : "new" };
}

const CODE_KEY = "nhsqa-code-v1";
export function loadCode(id: string): string | null {
  try { return (JSON.parse(localStorage.getItem(CODE_KEY) ?? "{}") as Record<string, string>)[id] ?? null; } catch { return null; }
}
export function saveCode(id: string, code: string | null) {
  try {
    const all = JSON.parse(localStorage.getItem(CODE_KEY) ?? "{}") as Record<string, string>;
    if (code === null) delete all[id]; else all[id] = code;
    localStorage.setItem(CODE_KEY, JSON.stringify(all));
  } catch {}
}
