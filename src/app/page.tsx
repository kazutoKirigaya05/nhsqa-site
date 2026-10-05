import Link from "next/link";
import { PipelineMap } from "@/components/PipelineMap";
import { BetWidget } from "@/components/BetWidget";
import { KitBox } from "@/components/KitBox";
import { KIT } from "@/content/site";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap stack-lg">
          <div className="stack">
            <h1>Start your quant journey here.</h1>
            <p className="lede">Most students have never heard the word quant. We teach you the skills, bring in people who do the job, and match you with a mentor. It is free.</p>
            <div className="btns">
              <Link href="/join" className="btn">Join free</Link>
              <Link href="/pipeline" className="btn alt">See the pipeline</Link>
            </div>
          </div>
          <PipelineMap base="/pipeline" />
        </div>
      </section>

      <section className="section sheet">
        <div className="wrap cols-2">
          <div className="stack">
            <h2>A quant uses math to make decisions about money.</h2>
            <div className="prose">
              <p>Banks, trading firms and investment funds hire quants to answer questions like: what is this worth, how risky is it, and what will the other side do next? The tools are probability, statistics, code and game theory.</p>
              <p>You already have what you need to start. Try the question on this page. It is the kind quants get asked in interviews.</p>
            </div>
            <div className="btns"><Link href="/what-is-a-quant" className="btn alt">What is a quant?</Link></div>
          </div>
          <BetWidget />
        </div>
      </section>

      <section className="section">
        <div className="wrap stack-lg">
          <div className="stack-sm">
            <h2>The Quant Pipeline takes you from zero to a mentor.</h2>
            <p className="lede">Three stages, in order. Your map fills in as you go.</p>
          </div>
          <ol className="stages">
            <li><h3>Learn the skills</h3><p>Start with probability, game theory, Python, R and C. Then use them on what quants do: markets, options, trading strategies and risk. You write real code in your browser the whole way.</p></li>
            <li><h3>Come to a seminar</h3><p>Once a month, someone who works as a quant talks about what they do and takes your questions.</p></li>
            <li><h3>Request a mentor</h3><p>When you have finished the first two stages, ask for a mentor. Our officers match you with a professional we have vetted.</p></li>
          </ol>
        </div>
      </section>

      <section className="section sheet">
        <div className="wrap split">
          <div className="kit-art"><KitBox /></div>
          <div className="stack">
            <h2>Quant kits put game theory on the table.</h2>
            <div className="prose">
              <p>{KIT.name} is a box of cards, chips and dice that turns ideas like <span className="hl">Nash equilibrium</span> into games you can play at lunch. Sponsors fund the kits so we can send them to younger students who have never heard of the field.</p>
            </div>
            <div className="btns"><Link href="/kits" className="btn alt">See what is in the kit</Link></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack-lg">
          <h2>Work in the field? Help the next group in.</h2>
          <div className="cols-2">
            <Link href="/sponsors" className="card link">
              <h3>Sponsor NHSQA</h3>
              <p>Your firm funds the pipeline and the kits, and gets a dashboard showing how many students it reached.</p>
            </Link>
            <Link href="/mentors" className="card link">
              <h3>Become a mentor</h3>
              <p>Apply once. We vet every mentor and do the matching, so you spend your time with students who have done the work.</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
