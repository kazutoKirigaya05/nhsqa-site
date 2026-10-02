"use client";
import Link from "next/link";
import { useState } from "react";
import type { Lesson } from "@/content/lessons/types";
import { PASS_MARK } from "@/content/lessons/types";
import { markStep, saveQuiz, useProgress } from "@/lib/progress";
import { useHydrated } from "@/lib/useHydrated";
import { Body } from "./Rich";
import { CodeStep } from "./CodeStep";
import { McStep, NumStep } from "./QuestionSteps";
import { GameStep, PickStep, SimStep } from "./GameSteps";

type Props = { track: string; trackTitle: string; lesson: Lesson; next: { href: string; label: string } };

export function LessonPlayer(props: Props) {
  const hydrated = useHydrated();
  const progress = useProgress();
  const key = `${props.track}/${props.lesson.slug}`;
  if (!hydrated) return <div className="player"><div className="player-body"><p className="muted">Loading lesson</p></div></div>;
  const passed = progress.steps[key] ?? [];
  const firstOpen = props.lesson.steps.findIndex((_, i) => !passed[i]);
  return <Inner {...props} lessonKey={key} passed={passed} start={props.lesson.quiz || firstOpen < 0 ? 0 : firstOpen} />;
}

function Inner({ track, trackTitle, lesson, next, lessonKey, passed, start }: Props & { lessonKey: string; passed: boolean[]; start: number }) {
  const total = lesson.steps.length;
  const [index, setIndex] = useState(start);
  const [answers, setAnswers] = useState<(boolean | null)[]>(() => lesson.steps.map(() => null));
  const [attempt, setAttempt] = useState(0);
  const quiz = !!lesson.quiz;
  const finished = index >= total;
  const step = lesson.steps[index];

  const pass = (i: number) => { if (!quiz) markStep(lessonKey, i, total); };
  const answer = (i: number, ok: boolean) => { if (quiz) setAnswers((a) => a.map((v, j) => (j === i ? ok : v))); };
  const canNext = finished ? false : quiz ? answers[index] !== null : step.kind === "read" || !!passed[index];

  function goNext() {
    if (!quiz && step.kind === "read") pass(index);
    if (quiz && index === total - 1) saveQuiz(lessonKey, answers.filter(Boolean).length, total);
    setIndex(index + 1);
    window.scrollTo({ top: 0 });
  }
  function retake() { setAnswers(lesson.steps.map(() => null)); setAttempt((a) => a + 1); setIndex(0); }

  const score = answers.filter(Boolean).length;
  const quizPassed = score / total >= PASS_MARK;

  return (
    <div className="player">
      <div className="player-top">
        <nav aria-label="Breadcrumb" className="crumbs">
          <Link href="/learn">Lessons</Link><span aria-hidden="true">/</span>
          <Link href={`/learn/${track}`}>{trackTitle}</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{lesson.title}</span>
        </nav>
        <ol className="dots" aria-label="Steps">
          {lesson.steps.map((_, i) => {
            const done = quiz ? answers[i] !== null : !!passed[i];
            const cls = `${i === index ? "here" : ""} ${done ? "done" : ""}`;
            return (
              <li key={i}>
                {quiz ? <span className={cls} aria-label={`Question ${i + 1}`} /> : <button type="button" className={cls} aria-label={`Step ${i + 1}${done ? ", done" : ""}`} aria-current={i === index ? "step" : undefined} onClick={() => setIndex(i)} />}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="player-body" key={`${index}-${attempt}`}>
        {finished ? (
          <div className="question">
            {quiz ? (
              <>
                <h2>{quizPassed ? "Track quiz passed" : "Not there yet"}</h2>
                <p className="score"><span className="num">{score}</span> out of <span className="num">{total}</span></p>
                <p>{quizPassed ? "You have finished this track. Your pipeline map has been updated." : `You need ${Math.ceil(total * PASS_MARK)} right to pass. Look back over the lessons and try again.`}</p>
                <div className="btns">
                  {quizPassed ? <Link className="btn" href="/pipeline">See your pipeline</Link> : <button type="button" className="btn" onClick={retake}>Retake the quiz</button>}
                  <Link className="btn alt" href={`/learn/${track}`}>Back to {trackTitle}</Link>
                </div>
              </>
            ) : (
              <>
                <h2>Lesson complete</h2>
                <p>You finished {lesson.title}.</p>
                <div className="btns">
                  <Link className="btn" href={next.href}>{next.label}</Link>
                  <button type="button" className="btn alt" onClick={() => setIndex(0)}>Review this lesson</button>
                </div>
              </>
            )}
          </div>
        ) : step.kind === "read" ? (
          <div className="question">
            <h2>{step.title}</h2>
            <Body body={step.example ? step.body.slice(0, -1) : step.body} />
            {step.example && <pre className="snippet">{step.example}</pre>}
            {step.example && step.body.length > 1 && <Body body={step.body.slice(-1)} />}
          </div>
        ) : step.kind === "code" ? (
          <CodeStep step={step} id={`${lessonKey}/${index}`} passed={!!passed[index]} onPass={() => pass(index)} />
        ) : step.kind === "mc" ? (
          <McStep step={step} quiz={quiz} onPass={() => pass(index)} onAnswer={(ok) => answer(index, ok)} />
        ) : step.kind === "num" ? (
          <NumStep step={step} quiz={quiz} onPass={() => pass(index)} onAnswer={(ok) => answer(index, ok)} />
        ) : step.kind === "game" ? (
          <GameStep step={step} onPass={() => pass(index)} />
        ) : step.kind === "pick" ? (
          <PickStep step={step} onPass={() => pass(index)} />
        ) : (
          <SimStep step={step} onPass={() => pass(index)} />
        )}
      </div>

      {!finished && (
        <div className="player-nav">
          <button type="button" className="btn alt sm" disabled={index === 0 || quiz} onClick={() => setIndex(index - 1)}>Back</button>
          <span className="muted">{quiz ? "Question" : "Step"} <span className="num">{index + 1}</span> of <span className="num">{total}</span></span>
          <button type="button" className="btn sm" disabled={!canNext} onClick={goNext}>{index === total - 1 ? (quiz ? "See my score" : "Finish lesson") : "Next"}</button>
        </div>
      )}
    </div>
  );
}
