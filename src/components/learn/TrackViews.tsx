"use client";
import Link from "next/link";
import { TRACKS } from "@/content/site";
import { LESSONS } from "@/content/lessons";
import { lessonDone, lessonStarted, resetProgress, trackStatus, useProgress } from "@/lib/progress";
import { PipelineMap } from "@/components/PipelineMap";
import { useState } from "react";

const LABEL = { new: "Not started", now: "In progress", done: "Finished" } as const;

export function LivePipelineMap() {
  const p = useProgress();
  const status = Object.fromEntries(TRACKS.map((t) => [t.slug, trackStatus(p, t.slug).state]));
  return <PipelineMap learn status={status} />;
}

export function TrackGrid() {
  const p = useProgress();
  return (
    <div className="rows">
      {TRACKS.map((t, i) => {
        const s = trackStatus(p, t.slug);
        return (
          <div className="row track-row" key={t.slug}>
            <div>
              <h2 className="h3"><span className="num muted">{i + 1}&nbsp;&nbsp;</span>{t.title}</h2>
              <span className={`state ${s.state}`}>{LABEL[s.state]}</span>
            </div>
            <div className="stack-sm">
              <p>{t.blurb}</p>
              <div className="meter" role="img" aria-label={`${s.done} of ${s.total} lessons finished`}><span style={{ width: `${(100 * s.done) / s.total}%` }} /></div>
              <div className="btns">
                <Link className={s.state === "done" ? "btn alt sm" : "btn sm"} href={`/learn/${t.slug}`}>{s.state === "new" ? "Start track" : s.state === "now" ? "Continue" : "Review"}</Link>
                <span className="muted"><span className="num">{s.done}</span> of <span className="num">{s.total}</span> lessons</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function LessonList({ track }: { track: string }) {
  const p = useProgress();
  const lessons = LESSONS[track] ?? [];
  const firstOpen = lessons.find((l) => !lessonDone(p, track, l.slug));
  return (
    <ol className="lesson-list">
      {lessons.map((l, i) => {
        const done = lessonDone(p, track, l.slug);
        const state = done ? "done" : lessonStarted(p, track, l.slug) ? "now" : "new";
        const q = p.quiz[`${track}/${l.slug}`];
        return (
          <li key={l.slug}>
            <Link href={`/learn/${track}/${l.slug}`} className="lesson-link">
              <span className={`badge ${state}`} aria-hidden="true">{done ? "✓" : l.quiz ? "?" : i + 1}</span>
              <span className="lesson-text">
                <b>{l.title}</b>
                <span className="muted">{l.summary}</span>
              </span>
              <span className="lesson-meta">
                {l.quiz && q ? <span className="num">{q.score}/{q.total}</span> : null}
                <span className={`state ${state}`}>{LABEL[state]}</span>
                {firstOpen?.slug === l.slug && <span className="go">{state === "new" && i === 0 ? "Start" : "Continue"}</span>}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export function ResetProgress() {
  const [ask, setAsk] = useState(false);
  if (!ask) return <button type="button" className="linkbtn" onClick={() => setAsk(true)}>Clear my progress</button>;
  return (
    <span className="btns">
      <span>Clear all lesson progress in this browser?</span>
      <button type="button" className="btn alt sm" onClick={() => { resetProgress(); setAsk(false); }}>Clear progress</button>
      <button type="button" className="linkbtn" onClick={() => setAsk(false)}>Keep it</button>
    </span>
  );
}
