import Link from "next/link";
import { LivePipelineMap } from "@/components/learn/TrackViews";
import { GROUPS, TRACKS } from "@/content/site";

export const metadata = { title: "The Quant Pipeline" };

export default function Page() {
  return (
    <>
      <section className="page-head">
        <div className="wrap stack-lg">
          <div className="stack">
            <h1 className="long">The Quant Pipeline</h1>
            <p className="lede">Everything you need to go from never having heard of a quant to working with a mentor. Follow the curve from left to right.</p>
          </div>
          <LivePipelineMap />
          <div className="btns">
            <Link href="/learn" className="btn">Start learning</Link>
            <span className="muted">Click any stop to open it. The map fills in as you finish tracks.</span>
          </div>
        </div>
      </section>

      <section className="section sheet">
        <div className="wrap stack-lg">
          <div className="stack-sm">
            <h2>Stage 1: learn the skills</h2>
            <p className="lede">{TRACKS.length} tracks in three groups. Each one is a set of short lessons where you read a little, then do something: run code, play a game, answer a question. A quiz ends each track.</p>
          </div>
          {GROUPS.map(({ name: group, blurb }) => (
            <div key={group}>
              <h3 className="group-head">{group}: {blurb.toLowerCase()}</h3>
              <div className="rows">
                {TRACKS.map((t, i) => t.group !== group ? null : (
                  <div className="row" id={t.slug} key={t.slug}>
                    <h4 className="h3"><span className="num muted">{i + 1}&nbsp;&nbsp;</span>{t.title}</h4>
                    <div>
                      <p>{t.blurb}</p>
                      <ul className="topics">{t.topics.map((x) => <li key={x}>{x}</li>)}</ul>
                      <p style={{ marginTop: 12 }}><Link href={`/learn/${t.slug}`}>Open {t.title}</Link></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="seminars">
        <div className="wrap cols-2">
          <div className="stack">
            <h2>Stage 2: come to a seminar</h2>
            <div className="prose">
              <p>Once a month we hold a live online seminar with someone who works as a quant. They explain what their job is really like, walk through a problem, and answer questions from students.</p>
              <p>You get a code during the seminar. Enter it afterwards and this stop on your map is marked as done.</p>
            </div>
            <div className="btns"><Link href="/events" className="btn alt">See upcoming events</Link></div>
          </div>
          <div className="stack" id="mentorship">
            <h2>Stage 3: request a mentor</h2>
            <div className="prose">
              <p>The last stop unlocks once you have finished skill tracks and attended a seminar. You tell us what you are interested in and what you want help with.</p>
              <p>Our officers read every request and match you with a professional we have vetted. A parent or guardian is included on the introduction.</p>
            </div>
            <div className="btns"><Link href="/join" className="btn">Join free</Link></div>
          </div>
        </div>
      </section>
    </>
  );
}
