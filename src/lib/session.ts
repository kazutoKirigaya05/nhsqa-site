"use client";
import { useSyncExternalStore } from "react";
import { supabase } from "./supabase";
import { clearLocalProgress, exportLesson, mergeRemote, setRemoteSaver } from "./progress";

export type Profile = { id: string; first_name: string; last_name: string; school: string; state: string; grad_year: number | null; role: "student" | "mentor" | "sponsor" | "admin" };
export type Session = { status: "loading" | "out" | "in"; email: string | null; profile: Profile | null };

const LOADING: Session = { status: "loading", email: null, profile: null };
let state: Session = LOADING;
let started = false;
let currentUser: string | null = null;
const listeners = new Set<() => void>();
const set = (s: Session) => { state = s; listeners.forEach((l) => l()); };

async function saveLesson(key: string) {
  if (!currentUser) return;
  const l = exportLesson(key);
  await supabase().from("lesson_progress").upsert(
    { user_id: currentUser, lesson_key: key, steps: l.steps, quiz_score: l.quiz?.score ?? null, quiz_total: l.quiz?.total ?? null, updated_at: new Date().toISOString() },
    { onConflict: "user_id,lesson_key" });
}

async function signedIn(userId: string, email: string | null) {
  if (currentUser === userId && state.status === "in") return;
  currentUser = userId;
  const db = supabase();
  const [{ data: profile }, { data: rows }] = await Promise.all([
    db.from("profiles").select("id, first_name, last_name, school, state, grad_year, role").eq("id", userId).maybeSingle(),
    db.from("lesson_progress").select("lesson_key, steps, quiz_score, quiz_total"),
  ]);
  if (currentUser !== userId) return;
  // Anything done before logging in on this browser is merged into the account, then kept in sync.
  const toUpload = mergeRemote(rows ?? []);
  setRemoteSaver((key) => { void saveLesson(key); });
  for (const key of toUpload) void saveLesson(key);
  set({ status: "in", email, profile: (profile as Profile | null) ?? null });
}

function start() {
  if (started) return;
  started = true;
  const db = supabase();
  db.auth.onAuthStateChange((event, session) => {
    // Supabase must not be called from inside this callback, so hand off to the next tick.
    setTimeout(() => {
      if (session?.user) void signedIn(session.user.id, session.user.email ?? null);
      else {
        if (event === "SIGNED_OUT" && currentUser) clearLocalProgress();
        currentUser = null; setRemoteSaver(null);
        set({ status: "out", email: null, profile: null });
      }
    }, 0);
  });
}

export function useSession(): Session {
  return useSyncExternalStore((l) => { listeners.add(l); start(); return () => listeners.delete(l); }, () => state, () => LOADING);
}

export async function refreshProfile() {
  if (!currentUser) return;
  const { data } = await supabase().from("profiles").select("id, first_name, last_name, school, state, grad_year, role").eq("id", currentUser).maybeSingle();
  if (data) set({ ...state, profile: data as Profile });
}

export async function signOut() { await supabase().auth.signOut(); }

/** Turns Supabase and network errors into something a student can act on. */
export function friendly(error: { message?: string; status?: number } | null | undefined): string {
  const m = error?.message ?? "";
  if (/failed to fetch|network|load failed/i.test(m)) return "Could not reach the server. Check your connection and try again.";
  if (/rate limit|too many|429/i.test(m) || error?.status === 429) return "Too many emails have been sent in the last hour. Wait a while and try again.";
  if (/signups? not allowed|user not found/i.test(m)) return "There is no account with that email yet. Join first.";
  if (/invalid.*email|unable to validate email/i.test(m)) return "That email address does not look right.";
  return m || "Something went wrong. Try again.";
}
