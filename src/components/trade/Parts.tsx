"use client";
import Link from "next/link";
import type { Leader, Market, Stock } from "@/lib/sim";
import { dayMove, pct, usd } from "@/lib/sim";

/** A day's move shown with an arrow, a sign and a color, so it never depends on color alone. */
export function Move({ value }: { value: number | null }) {
  if (value === null) return <span className="muted">n/a</span>;
  const dir = value > 0 ? "up" : value < 0 ? "down" : "flat";
  return <span className={`move ${dir}`}><span aria-hidden="true">{dir === "up" ? "▲" : dir === "down" ? "▼" : "•"}</span> {pct(value)}</span>;
}

export function MarketNote({ market }: { market: Market }) {
  if (!market.ready) return <p className="muted">Loading prices</p>;
  if (market.error) return <p className="verdict bad">{market.error}</p>;
  if (!market.connected) return <p className="notice">Waiting for market data. Prices will appear once the data connection is switched on.</p>;
  return (
    <p className={market.open ? "status-pill open" : "status-pill"}>
      <span className="dot" aria-hidden="true" />
      {market.open ? "Market open. Orders fill at the current price." : "Market closed. Orders you place now wait and fill when it opens: weekdays, 9:30 am to 4:00 pm New York time."}
    </p>
  );
}

export function StockTable({ stocks, held }: { stocks: Stock[]; held?: Set<string> }) {
  return (
    <div className="table-wrap">
      <table className="data stocks">
        <thead><tr><th scope="col">Symbol</th><th scope="col">Name</th><th scope="col" className="n">Price</th><th scope="col" className="n">Today</th></tr></thead>
        <tbody>
          {stocks.map((s) => (
            <tr key={s.symbol}>
              <th scope="row"><Link href={`/trade/${s.symbol}`}>{s.symbol}</Link>{held?.has(s.symbol) ? <span className="tag">held</span> : null}</th>
              <td>{s.name}</td>
              <td className="n">{s.quote ? usd(s.quote.price) : "n/a"}</td>
              <td className="n"><Move value={dayMove(s.quote)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LeaderTable({ rows, limit }: { rows: Leader[]; limit?: number }) {
  const shown = limit ? rows.filter((r) => r.place <= limit || r.me) : rows;
  if (shown.length === 0) {
    return <div className="empty"><h3>No traders yet</h3><p>The leaderboard lists everyone who has made at least one trade. Be the first.</p></div>;
  }
  return (
    <div className="table-wrap">
      <table className="data">
        <thead><tr><th scope="col" className="n">Place</th><th scope="col">Trader</th><th scope="col" className="n">Account value</th><th scope="col" className="n">Gain</th><th scope="col" className="n">Trades</th></tr></thead>
        <tbody>
          {shown.map((r) => (
            <tr key={r.handle} className={r.me ? "me" : undefined}>
              <td className="n">{r.place}</td>
              <th scope="row">{r.handle}{r.me ? <span className="tag">you</span> : null}</th>
              <td className="n">{usd(r.value)}</td>
              <td className="n"><Move value={r.gain} /></td>
              <td className="n">{r.trades}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FinePrint() {
  return <p className="muted fine">Pretend money only. Prices are real, come from Finnhub, and can lag the market slightly. This is for learning and is not financial advice.</p>;
}
