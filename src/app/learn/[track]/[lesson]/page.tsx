import { notFound } from "next/navigation";
import { TRACKS } from "@/content/site";
import { LESSONS } from "@/content/lessons";
import { LessonPlayer } from "@/components/learn/LessonPlayer";

type P = { track: string; lesson: string };

export function generateStaticParams(): P[] {
  return Object.entries(LESSONS).flatMap(([track, lessons]) => lessons.map((l) => ({ track, lesson: l.slug })));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<P> }) {
  const { track, lesson } = await params;
  const l = LESSONS[track]?.find((x) => x.slug === lesson);
  const t = TRACKS.find((x) => x.slug === track);
  return { title: l && t ? `${l.title}, ${t.title}` : "Lesson" };
}

export default async function Page({ params }: { params: Promise<P> }) {
  const { track, lesson } = await params;
  const t = TRACKS.find((x) => x.slug === track);
  const lessons = LESSONS[track] ?? [];
  const i = lessons.findIndex((x) => x.slug === lesson);
  if (!t || i < 0) notFound();
  const after = lessons[i + 1];
  const next = after
    ? { href: `/learn/${track}/${after.slug}`, label: after.quiz ? "Take the track quiz" : `Next lesson: ${after.title}` }
    : { href: `/learn/${track}`, label: `Back to ${t.title}` };
  return (
    <div className="wrap player-wrap">
      <LessonPlayer track={track} trackTitle={t.title} lesson={lessons[i]} next={next} />
    </div>
  );
}
