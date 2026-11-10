import Link from "next/link";
import { PipelineMap } from "@/components/PipelineMap";
import { BetWidget } from "@/components/BetWidget";
import { KitBox } from "@/components/KitBox";
import { GaltonBoard } from "@/components/GaltonBoard";
import { KIT, TRACKS } from "@/content/site";
import { LESSONS } from "@/content/lessons";

const LESSON_COUNT = Object.values(LESSONS).reduce((n, list) => n + list.filter((l) => !l.quiz).length, 0);

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="stack">
            <h1>Start your quant journey here.</h1>
            <p className="lede">Most students have never heard the word quant. We teach you the skills, bring in people who do the job, and match you with a mentor. It is free.</p>
            <div className="btns">
              <Link href="/join" className="btn">Join free</Link>
              <Link href="/what-is-a-quant" className="btn alt">What is a quant?</Link>
            </div>
          </div>
          <GaltonBoard />
        </div>
      </section>

      <section className="board" aria-label="NHSQA in numbers">
        <div className="wrap">
          <ul>
            <li><b>{LESSON_COUNT}</b><span>lessons you do in your browser</span></li>
            <li><b>{TRACKS.length}</b><span>skill tracks, from probability to options</span></li>
            <li><b>$100,000</b><span>of pretend money to trade real prices</span></li>
            <li><b>$0</b><span>to join, now and later</span></li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap cols-2">
          <div className="stack">
            <h2>A quant uses math to make decisions about money.</h2>
            <div className="prose">
              <p>Banks, trading firms and investment funds hire quants to answer questions like: what is this worth, how risky is it, and what will the other side do next? The tools are probability, statistics, code and game theory.</p>
              <p>You already have what you need to start. Try the question on this page. It is the kind quants get asked in interviews.</p>
            </div>
          </div>
          <BetWidget />
        </div>
      </section>

      <section className="section sheet">
        <div className="wrap stack-lg">
          <div className="stack-sm">
            <h2>Pick where to start.</h2>
            <p className="lede">Three things you can do today. None of them needs anything installed.</p>
          </div>
          <div className="ways">
            <Link href="/learn" className="way">
              <div className="way-art" aria-hidden="true">
                <span><span className="d">flips</span> = [coin() <span className="d">for</span> _ <span className="d">in</span> range(<span className="y">10000</span>)]</span>
                <span>print(mean(flips))</span>
                <span className="y">0.5013</span>
              </div>
              <div className="way-body">
                <h3>Lessons</h3>
                <p>Short lessons with real Python, R and C that runs in your browser. Start from zero.</p>
                <span className="way-go">Open the lessons</span>
              </div>
            </Link>
            <Link href="/trade" className="way">
              <div className="way-art" aria-hidden="true">
                <svg viewBox="0 0 300 110" preserveAspectRatio="none">
                  <polyline points="0,84 22,78 44,88 66,70 88,74 110,56 132,62 154,44 176,52 198,34 220,40 242,22 264,30 300,12" fill="none" stroke="#ffc629" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  <line x1="0" y1="84" x2="300" y2="84" stroke="#6a73ad" strokeWidth="1" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
              <div className="way-body">
                <h3>Trading floor</h3>
                <p>Buy and sell real stocks at real prices with pretend money, and see where you rank.</p>
                <span className="way-go">Visit the trading floor</span>
              </div>
            </Link>
            <Link href="/daily" className="way">
              <div className="way-art" aria-hidden="true">
                <span>Two dice. What is the chance the total is 7?</span>
                <span className="tryrow"><i className="x" /><i className="ok" /><i /></span>
              </div>
              <div className="way-body">
                <h3>Daily puzzle</h3>
                <p>One quant puzzle a day, three tries. Keep a streak and share your result.</p>
                <span className="way-go">Solve today&apos;s puzzle</span>
              </div>
            </Link>
          </div>
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
          <PipelineMap base="/pipeline" />
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

      <section className="section night">
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
