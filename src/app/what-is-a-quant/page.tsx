import Link from "next/link";
import { BetWidget } from "@/components/BetWidget";

export const metadata = { title: "What is a quant?" };

export default function Page() {
  return (
    <>
      <section className="page-head">
        <div className="wrap stack">
          <h1 className="long">What is a quant?</h1>
          <p className="lede">Quant is short for quantitative analyst. It is someone who uses math, statistics and code to make decisions about money.</p>
        </div>
      </section>

      <section className="section sheet">
        <div className="wrap cols-2">
          <div className="stack">
            <h2>The job, in one example</h2>
            <div className="prose">
              <p>A shop sells umbrellas. Should it order 50 or 500 for next month? Guess too low and it runs out on the first rainy day. Guess too high and it is stuck with boxes of umbrellas.</p>
              <p>A quant would look at years of weather data, work out how likely each kind of month is, and choose the order that does best on average while making sure one bad month cannot sink the shop.</p>
              <p>Now swap umbrellas for stocks, oil or currencies, and make the decision thousands of times a second. That is quantitative finance.</p>
            </div>
          </div>
          <div className="stack">
            <h3>Try a quant question</h3>
            <BetWidget />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack-lg">
          <h2>Three kinds of quant</h2>
          <div className="cols-3">
            <div className="card"><h3>Quant researcher</h3><p>Looks for patterns in data and tests whether they are real. Closest to being a scientist. Uses a lot of statistics, Python and R.</p></div>
            <div className="card"><h3>Quant trader</h3><p>Makes decisions with money on the line, often in seconds. Leans on probability, game theory and staying calm.</p></div>
            <div className="card"><h3>Quant developer</h3><p>Builds the systems that run the strategies. Writes fast, careful code in languages like C++ and Python.</p></div>
          </div>
        </div>
      </section>

      <section className="section sheet">
        <div className="wrap cols-2">
          <div className="stack">
            <h2>What quants need to know</h2>
            <div className="prose">
              <p><span className="hl">Probability and statistics</span> to measure what is likely and what it is worth.</p>
              <p><span className="hl">Programming</span> to test ideas on data instead of guessing.</p>
              <p><span className="hl">Game theory</span> to think about what other people will do, because in a market your result depends on everyone else.</p>
              <p>The Quant Pipeline teaches all three, starting from nothing.</p>
            </div>
            <div className="btns"><Link href="/pipeline" className="btn">See the pipeline</Link></div>
          </div>
          <div className="faq">
            <details open><summary>Do I need to be a math genius?</summary><p>No. You need to like puzzles and be willing to practice. Most of the math quants use every day starts with ideas you can learn in high school.</p></details>
            <details><summary>Do I need to know how to code already?</summary><p>No. The Python track starts with your first line of code.</p></details>
            <details><summary>Is this only for people who want to work in finance?</summary><p>No. Probability, statistics and programming are the same skills used in data science, engineering and research.</p></details>
            <details><summary>What does it cost?</summary><p>Nothing. Sponsors pay for the lessons, the seminars and the kits.</p></details>
          </div>
        </div>
      </section>
    </>
  );
}
