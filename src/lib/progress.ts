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
}

export function saveQuiz(key: string, score: number, total: number) {
  const p = read();
  const best = p.quiz[key];
  if (best && best.score >= score) return;
  write({ ...p, quiz: { ...p.quiz, [key]: { score, total } } });
}

export function resetProgress() { write(EMPTY); }

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
