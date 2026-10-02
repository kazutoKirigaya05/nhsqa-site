import Link from "next/link";
import { notFound } from "next/navigation";
import { TRACKS } from "@/content/site";
import { LessonList } from "@/components/learn/TrackViews";

export function generateStaticParams() { return TRACKS.map((t) => ({ track: t.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  return { title: TRACKS.find((t) => t.slug === track)?.title ?? "Lessons" };
}

export default async function Page({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  const t = TRACKS.find((x) => x.slug === track);
  if (!t) notFound();
  return (
    <>
      <section className="page-head">
        <div className="wrap stack">
          <p><Link href="/learn">All lessons</Link></p>
          <h1 className="long">{t.title}</h1>
          <p className="lede">{t.blurb}</p>
        </div>
      </section>
      <section className="section sheet">
        <div className="wrap"><LessonList track={t.slug} /></div>
      </section>
    </>
  );
}
