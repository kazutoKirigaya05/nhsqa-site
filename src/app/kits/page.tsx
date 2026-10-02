import Link from "next/link";
import { KitBox } from "@/components/KitBox";
import { PayoffTable } from "@/components/PayoffTable";
import { KitCalculator } from "@/components/KitCalculator";
import { KIT, KIT_COST, SCENARIOS } from "@/content/site";

export const metadata = { title: "Quant kits" };

export default function Page() {
  return (
    <>
      <section className="page-head">
        <div className="wrap split" style={{ alignItems: "center" }}>
          <div className="stack">
            <h1 className="long">{KIT.name}</h1>
            <p className="lede">A game theory kit in a box. Cards, chips and dice that let two or more players run the same situations quants think about every day. No screens, nothing to charge.</p>
            <p className="muted">Sponsors fund the kits. We design them, have them made, and send them to younger students who do not know yet that this field exists.</p>
          </div>
          <div className="kit-art"><KitBox /></div>
        </div>
      </section>

      <section className="section sheet">
        <div className="wrap stack-lg">
          <h2>What is in the box</h2>
          <ul className="parts">
            {KIT.parts.map((p) => <li key={p.name}><h3>{p.name}</h3><p>{p.text}</p></li>)}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack-lg">
          <div className="stack-sm">
            <h2>Five games, five ideas</h2>
            <p className="lede">Each scenario card is a classic game with a trading story on top. Everyone chooses in secret, reveals together, and scores from the table on the card.</p>
          </div>
          <div className="gcards">
            {SCENARIOS.map((s) => (
              <article className="gcard" key={s.name}>
                <div><h3>{s.name}</h3><span className="kind">{s.kind}</span></div>
                <p>{s.how}</p>
                {s.table && <PayoffTable table={s.table} name={s.name} />}
                <p className="teaches">{s.teaches}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section sheet">
        <div className="wrap cols-2">
          <div className="stack">
            <h2>What a kit costs to make</h2>
            <div className="table-wrap">
              <table className="data">
                <thead><tr><th scope="col">Part</th><th scope="col" className="n">Cost per kit</th></tr></thead>
                <tbody>{KIT.costs.map((c) => <tr key={c.item}><td>{c.item}</td><td className="n">${c.cost.toFixed(2)}</td></tr>)}</tbody>
                <tfoot><tr><td>Total</td><td className="n">${KIT_COST.toFixed(2)}</td></tr></tfoot>
              </table>
            </div>
            <p className="muted">Estimated cost of parts at bulk prices. The box and shipping are extra.</p>
          </div>
          <div className="stack">
            <h2>What a sponsorship funds</h2>
            <KitCalculator costPerKit={KIT_COST} />
            <h3>The box</h3>
            <dl className="dims">
              <dt>Manufacture size</dt><dd>{KIT.box.manufacture}</dd>
              <dt>Inside</dt><dd>{KIT.box.inner}</dd>
              <dt>Outside</dt><dd>{KIT.box.outer}</dd>
              <dt>Board thickness</dt><dd>{KIT.box.thickness}</dd>
            </dl>
            <div className="btns"><Link href="/sponsors" className="btn">Sponsor a batch of kits</Link></div>
          </div>
        </div>
      </section>
    </>
  );
}
