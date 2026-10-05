import { TrackGrid, ResetProgress } from "@/components/learn/TrackViews";
import { TRACKS } from "@/content/site";
import { LESSONS } from "@/content/lessons";

export const metadata = { title: "Lessons" };

export default function Page() {
  return (
    <>
      <section className="page-head">
        <div className="wrap stack">
          <h1 className="long">Lessons</h1>
          <p className="lede">{TRACKS.length} tracks and {Object.values(LESSONS).reduce((n, l) => n + l.filter((x) => !x.quiz).length, 0)} lessons. Each one has you read a little, then do something: run code, play a game, or answer a question. A quiz ends each track.</p>
        </div>
      </section>
      <section className="section sheet">
        <div className="wrap stack">
          <TrackGrid />
          <p className="muted">Progress is saved to your account when you are logged in, and in this browser when you are not. <ResetProgress /></p>
        </div>
      </section>
    </>
  );
}
