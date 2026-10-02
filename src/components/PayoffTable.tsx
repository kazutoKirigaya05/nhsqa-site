import type { Scenario } from "@/content/site";

export function PayoffTable({ table, name }: { table: NonNullable<Scenario["table"]>; name: string }) {
  return (
    <div className="payoff-wrap">
      <table className="payoff">
        <caption>Payoffs for {name}: your points, then your rival&apos;s.</caption>
        <thead>
          <tr><td style={{ border: 0 }} /><th scope="col">Rival: {table.cols[0]}</th><th scope="col">Rival: {table.cols[1]}</th></tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={r}><th scope="row">You: {r}</th><td>{table.cells[i][0]}</td><td>{table.cells[i][1]}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
