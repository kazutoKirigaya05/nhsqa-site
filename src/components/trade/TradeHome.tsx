"use client";
import Link from "next/link";
import { useState } from "react";
import { START_CASH } from "@/content/sim-symbols";
import { cancelOrder, pct, usd, useBook, useLeaderboard, useMarket } from "@/lib/sim";
import { FinePrint, LeaderTable, MarketNote, Move, StockTable } from "./Parts";

export function TradeHome() {
  const market = useMarket();
  const book = useBook();
  const board = useLeaderboard();
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const price = new Map(market.stocks.map((s) => [s.symbol, s.quote?.price ?? null]));
  const names = new Map(market.stocks.map((s) => [s.symbol, s.name]));
  const holdings = book.positions.map((p) => {
    const px = price.get(p.symbol) ?? null;
    const value = px === null ? null : px * p.shares;
    return { ...p, px, value, gain: value === null ? null : value - p.cost };
  });
  const invested = holdings.reduce((s, h) => s + (h.value ?? h.cost), 0);
  const total = (book.account?.cash ?? 0) + invested;
  const pending = book.orders.filter((o) => o.status === "pending");
  const recent = book.orders.filter((o) => o.status !== "pending").slice(0, 8);
  const me = board.rows.find((r) => r.me);

  async function act(fn: () => Promise<string | null>) { setBusy(true); setProblem(await fn()); setBusy(false); }

  return (
    <>
      <section className="page-head">
        <div className="wrap stack">
          <h1 className="long">Trading floor</h1>
          <p className="lede">Trade real stocks at real prices with {usd(START_CASH, 0)} of pretend money. Test what you learn in the lessons, and see where you rank.</p>
          <MarketNote market={market} />
        </div>
      </section>

      <section className="section sheet">
        <div className="wrap stack-lg">
          {book.status === "loading" && <p className="muted">Loading your account</p>}

          {book.status === "out" && (
            <div className="card">
              <h2 className="h3">Log in to trade</h2>
              <p>Members get a practice account with {usd(START_CASH, 0)}. Anyone can browse the prices and the leaderboard.</p>
              <div className="btns"><Link className="btn" href="/join">Join free</Link><Link className="btn alt" href="/login">Log in</Link></div>
            </div>
          )}

          {book.status === "none" && (
            <div className="card">
              <h2 className="h3">Open your practice account</h2>
              <p>You start with {usd(START_CASH, 0)} of pretend money and a trading name that appears on the leaderboard in place of your real name.</p>
              <div className="btns"><button type="button" className="btn" disabled={busy} onClick={() => act(book.open)}>{busy ? "Opening" : "Open my account"}</button></div>
              <div role="alert">{problem && <p className="verdict bad">{problem}</p>}</div>
            </div>
          )}

          {book.status === "ready" && book.account && (
            <>
              <div className="tiles">
                <div className="tile"><span className="tile-label">Account value</span><span className="tile-num">{usd(total)}</span><Move value={(total / START_CASH - 1) * 100} /></div>
                <div className="tile"><span className="tile-label">Cash</span><span className="tile-num">{usd(book.account.cash)}</span><span className="muted">{pct((book.account.cash / total) * 100).replace("+", "")} of account</span></div>
                <div className="tile"><span className="tile-label">In stocks</span><span className="tile-num">{usd(invested)}</span><span className="muted">{holdings.length} {holdings.length === 1 ? "position" : "positions"}</span></div>
                <div className="tile"><span className="tile-label">Trading name</span><span className="tile-name">{book.account.handle}</span>
                  <span>{me ? <>Place <b className="num">{me.place}</b>. </> : null}<button type="button" className="linkbtn" disabled={busy} onClick={() => act(book.rename)}>Get a new name</button></span></div>
              </div>
              <div role="alert">{problem && <p className="verdict bad">{problem}</p>}</div>

              <div className="stack">
                <h2>Your positions</h2>
                {holdings.length === 0 ? (
                  <div className="empty"><h3>No positions yet</h3><p>Pick a stock from the list below to make your first trade.</p></div>
                ) : (
                  <div className="table-wrap">
                    <table className="data">
                      <thead><tr><th scope="col">Stock</th><th scope="col" className="n">Shares</th><th scope="col" className="n">Average cost</th><th scope="col" className="n">Price</th><th scope="col" className="n">Value</th><th scope="col" className="n">Gain or loss</th></tr></thead>
                      <tbody>
                        {holdings.map((h) => (
                          <tr key={h.symbol}>
                            <th scope="row"><Link href={`/trade/${h.symbol}`}>{h.symbol}</Link> <span className="muted">{names.get(h.symbol)}</span></th>
                            <td className="n">{h.shares.toLocaleString("en-US")}</td>
                            <td className="n">{usd(h.cost / h.shares)}</td>
                            <td className="n">{h.px === null ? "n/a" : usd(h.px)}</td>
                            <td className="n">{h.value === null ? "n/a" : usd(h.value)}</td>
                            <td className="n">{h.gain === null ? "n/a" : <>{usd(h.gain)} <Move value={(h.gain / h.cost) * 100} /></>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {pending.length > 0 && (
                <div className="stack">
                  <h2>Waiting orders</h2>
                  <div className="table-wrap">
                    <table className="data">
                      <thead><tr><th scope="col">Order</th><th scope="col">Placed</th><th scope="col"><span className="sr">Cancel</span></th></tr></thead>
                      <tbody>
                        {pending.map((o) => (
                          <tr key={o.id}>
                            <th scope="row">{o.side === "buy" ? "Buy" : "Sell"} {o.shares.toLocaleString("en-US")} <Link href={`/trade/${o.symbol}`}>{o.symbol}</Link></th>
                            <td>{new Date(o.created_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</td>
                            <td className="n"><button type="button" className="linkbtn" onClick={async () => { await cancelOrder(o.id); await book.reload(); }}>Cancel order</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {recent.length > 0 && (
                <div className="stack">
                  <h2>Recent orders</h2>
                  <div className="table-wrap">
                    <table className="data">
                      <thead><tr><th scope="col">Order</th><th scope="col">Result</th><th scope="col" className="n">Price</th><th scope="col">When</th></tr></thead>
                      <tbody>
                        {recent.map((o) => (
                          <tr key={o.id}>
                            <th scope="row">{o.side === "buy" ? "Buy" : "Sell"} {o.shares.toLocaleString("en-US")} <Link href={`/trade/${o.symbol}`}>{o.symbol}</Link></th>
                            <td>{o.status === "filled" ? "Filled" : o.status === "cancelled" ? "Cancelled" : `Rejected: ${o.note ?? "could not be filled"}`}</td>
                            <td className="n">{o.status === "filled" && o.price !== null ? usd(o.price) : ""}</td>
                            <td>{new Date(o.filled_at ?? o.created_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="section">
        <div className="wrap stack">
          <h2>Leaderboard</h2>
          <p className="muted">Ranked by account value. Trading names only.</p>
          {board.ready ? <LeaderTable rows={board.rows} limit={5} /> : <p className="muted">Loading</p>}
          <div className="btns"><Link className="btn alt sm" href="/trade/leaderboard">See the full leaderboard</Link></div>
        </div>
      </section>

      <section className="section sheet">
        <div className="wrap stack">
          <h2>Stocks and funds</h2>
          <p className="muted">Choose one to see its chart and place an order.</p>
          <StockTable stocks={market.stocks} held={new Set(book.positions.map((p) => p.symbol))} />
          <FinePrint />
        </div>
      </section>
    </>
  );
}
