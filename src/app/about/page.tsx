import Link from "next/link";
import { ORG } from "@/content/site";

export const metadata = { title: "About" };

export default function Page() {
  return (
    <>
      <section className="page-head">
        <div className="wrap stack">
          <h1 className="long">Most students never find out this career exists. We are changing that.</h1>
          <p className="lede">The {ORG} gives high schoolers a way to learn what a quant does and to be mentored by people who do it for a living.</p>
        </div>
      </section>
      <section className="section sheet">
        <div className="wrap cols-2">
          <div className="stack">
            <h2>Why we exist</h2>
            <div className="prose">
              <p>Quantitative finance hires people who are good at math, code and thinking under pressure. Plenty of high school students are exactly that, and have never heard the word quant.</p>
              <p>The students who do find the field usually have a parent or a teacher who works near it. We want NHSQA to be that connection for everyone else: the first place you go, with a clear path to follow.</p>
            </div>
          </div>
          <div className="stack">
            <h2>What we do</h2>
            <div className="prose">
              <p><span className="hl">The Quant Pipeline</span> is a free, step-by-step path: interactive lessons, monthly seminars with professionals, then mentorship.</p>
              <p><span className="hl">Quant kits</span> are game theory kits we design and send to younger students, so they meet these ideas early.</p>
              <p>Both are paid for by sponsoring firms. Students never pay.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap stack">
          <h2>How we look after students</h2>
          <div className="cols-3">
            <div className="card"><h3>We ask for very little</h3><p>Your name, email, school, state and graduation year. No address, phone number or birthday.</p></div>
            <div className="card"><h3>Mentors are vetted</h3><p>Every mentor applies and is approved by our officers. Officers make each match, and a parent or guardian is included.</p></div>
            <div className="card"><h3>Sponsors see totals only</h3><p>Sponsors can see how many students we reached. They cannot see who those students are.</p></div>
          </div>
          <div className="btns"><Link href="/join" className="btn">Join free</Link><Link href="/contact" className="btn alt">Contact us</Link></div>
        </div>
      </section>
    </>
  );
}
