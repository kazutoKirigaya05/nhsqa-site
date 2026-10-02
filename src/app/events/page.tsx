import Link from "next/link";

export const metadata = { title: "Events and news" };

export default function Page() {
  return (
    <>
      <section className="page-head">
        <div className="wrap stack">
          <h1 className="long">Events and news</h1>
          <p className="lede">Monthly seminars with working quants, plus updates from NHSQA.</p>
        </div>
      </section>
      <section className="section sheet">
        <div className="wrap cols-2">
          <div className="stack">
            <h2>Upcoming seminars</h2>
            <div className="empty">
              <h3>No dates posted yet</h3>
              <p>The first seminar will be listed here with its speaker, time and a button to save your seat. Members get an email when it is scheduled.</p>
              <Link href="/join" className="btn">Join free to be told</Link>
            </div>
          </div>
          <div className="stack">
            <h2>How a seminar works</h2>
            <ol className="steps">
              <li><p>A professional quant talks about their job and how they got there.</p></li>
              <li><p>They work through a real problem with the group.</p></li>
              <li><p>Students ask questions.</p></li>
              <li><p>You get an attendance code that completes stage 2 of your pipeline.</p></li>
            </ol>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap stack">
          <h2>News</h2>
          <div className="empty">
            <h3>Nothing posted yet</h3>
            <p>Announcements, new lesson tracks and kit updates will appear here.</p>
          </div>
        </div>
      </section>
    </>
  );
}
