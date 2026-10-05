"use client";
import Link from "next/link";
import { useState } from "react";
import { dayMove, placeOrder, usd, useBook, useChart, useMarket, type Order } from "@/lib/sim";
import { FinePrint, MarketNote, Move } from "./Parts";
import { PriceChart } from "./PriceChart";

const time = (t: string) => new Date(t).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const day = (t: string) => new Date(t + "T12:00:00").toLocaleDateString([], { month: "short", day: "numeric" });

export function StockView({ symbol }: { symbol: string }) {
  const market = useMarket([symbol]);
  const book = useBook();
  const stock = market.stocks.find((s) => s.symbol === symbol);
  const q = stock?.quote ?? null;
  const chart = useChart(symbol, q?.fetched_at);
  const [range, setRange] = useState<"today" | "days">("today");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [text, setText] = useState("10");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const shares = /^\d+$/.test(text.trim()) ? Number(text) : 0;
  const owned = book.positions.find((p) => p.symbol === symbol);
  const cash = book.account?.cash ?? 0;
  const estimate = q ? shares * q.price : 0;
  const tooMuch = side === "buy" ? estimate > cash : shares > (owned?.shares ?? 0);
  const maxBuy = q ? Math.floor(cash / q.price) : 0;

  function describe(o: Order): { ok: boolean; msg: string } {
    const what = `${o.side === "buy" ? "Bought" : "Sold"} ${o.shares.toLocaleString("en-US")} ${symbol}`;
    if (o.status === "filled") return { ok: true, msg: `${what} at ${usd(o.price ?? 0)} a share.` };
    if (o.status === "pending") return { ok: true, msg: market.open ? "Order placed. It will fill within a minute or two, when the next price arrives." : "Order placed. It will fill when the market opens." };
    return { ok: false, msg: `Order rejected: ${o.note ?? "it could not be filled"}.` };
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!shares) { setResult({ ok: false, msg: "Enter a whole number of shares." }); return; }
    setBusy(true); setResult(null);
    const res = await placeOrder(symbol, side, shares);
    setResult(res.order ? describe(res.order) : { ok: false, msg: res.error ?? "Something went wrong. Try again." });
    await Promise.all([book.reload(), market.reload()]);
    setBusy(false);
  }

  return (
    <>
      <section className="page-head">
        <div className="wrap stack">
          <p><Link href="/trade">Trading floor</Link></p>
          <div className="quote-head">
            <div>
              <h1 className="long">{stock?.name ?? symbol}</h1>
              <p className="muted"><span className="num">{symbol}</span> · {stock?.kind === "fund" ? "Fund" : "Stock"}</p>
            </div>
            <div className="quote-price">
              <span className="big num">{q ? usd(q.price) : "n/a"}</span>
              <Move value={dayMove(q)} />
            </div>
          </div>
          <MarketNote market={market} />
        </div>
      </section>

      <section className="section sheet">
        <div className="wrap trade-grid">
          <div className="stack">
            <div className="seg" role="group" aria-label="Chart range">
              <button type="button" aria-pressed={range === "today"} className={range === "today" ? "on" : ""} onClick={() => setRange("today")}>Latest day</button>
              <button type="button" aria-pressed={range === "days"} className={range === "days" ? "on" : ""} onClick={() => setRange("days")}>Day by day</button>
            </div>
            {range === "today"
              ? <PriceChart points={chart.today} base={q?.prev_close} label="Price through the day" formatT={time} />
              : <PriceChart points={chart.days} label="Closing price each day" formatT={day} />}
            {q && (
              <dl className="dims">
                <dt>Yesterday&apos;s close</dt><dd>{q.prev_close ? usd(q.prev_close) : "n/a"}</dd>
                <dt>Today&apos;s open</dt><dd>{q.day_open ? usd(q.day_open) : "n/a"}</dd>
                <dt>Today&apos;s range</dt><dd>{q.day_low && q.day_high ? `${usd(q.day_low)} to ${usd(q.day_high)}` : "n/a"}</dd>
                <dt>Last traded</dt><dd>{new Date(q.as_of).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</dd>
              </dl>
            )}
            {range === "days" && <p className="muted">Daily history starts from the day the simulator went live and grows from there.</p>}
          </div>

          <div className="stack">
            {book.status === "ready" ? (
              <form className="ticket" onSubmit={submit}>
                <h2 className="h3">Place an order</h2>
                <div className="seg wide" role="group" aria-label="Buy or sell">
                  <button type="button" aria-pressed={side === "buy"} className={side === "buy" ? "on" : ""} onClick={() => { setSide("buy"); setResult(null); }}>Buy</button>
                  <button type="button" aria-pressed={side === "sell"} className={side === "sell" ? "on" : ""} onClick={() => { setSide("sell"); setResult(null); }}>Sell</button>
                </div>
                <div className="field">
                  <label htmlFor="ticket-shares">Shares</label>
                  <input id="ticket-shares" inputMode="numeric" autoComplete="off" value={text} onChange={(e) => { setText(e.target.value); setResult(null); }} />
                  <span className="hint">{side === "buy" ? `You can afford up to ${maxBuy.toLocaleString("en-US")}.` : `You own ${(owned?.shares ?? 0).toLocaleString("en-US")}.`}</span>
                </div>
                <dl className="dims">
                  <dt>{side === "buy" ? "Estimated cost" : "Estimated proceeds"}</dt><dd>{usd(estimate)}</dd>
                  <dt>Cash available</dt><dd>{usd(cash)}</dd>
                </dl>
                {tooMuch && shares > 0 && <p className="verdict bad">{side === "buy" ? "That costs more than your cash." : "You do not own that many shares."}</p>}
                <button type="submit" className="btn" disabled={busy || !q || tooMuch || !shares}>{busy ? "Placing order" : `${side === "buy" ? "Buy" : "Sell"} ${shares ? shares.toLocaleString("en-US") : ""} ${symbol}`}</button>
                <div role="status">{result && <p className={result.ok ? "verdict ok" : "verdict bad"}>{result.msg}</p>}</div>
                <p className="muted fine">Orders fill at the market price when they go through, which can differ a little from the estimate.</p>
              </form>
            ) : book.status === "none" ? (
              <div className="card"><h2 className="h3">Open your practice account</h2><p>You need an account before you can trade.</p><div className="btns"><Link className="btn" href="/trade">Open my account</Link></div></div>
            ) : book.status === "out" ? (
              <div className="card"><h2 className="h3">Log in to trade</h2><p>Members get a practice account with pretend money.</p><div className="btns"><Link className="btn" href="/join">Join free</Link><Link className="btn alt" href="/login">Log in</Link></div></div>
            ) : <p className="muted">Loading your account</p>}

            {owned && q && (
              <div className="card">
                <h2 className="h3">Your position</h2>
                <dl className="dims">
                  <dt>Shares</dt><dd>{owned.shares.toLocaleString("en-US")}</dd>
                  <dt>Average cost</dt><dd>{usd(owned.cost / owned.shares)}</dd>
                  <dt>Value now</dt><dd>{usd(owned.shares * q.price)}</dd>
                  <dt>Gain or loss</dt><dd>{usd(owned.shares * q.price - owned.cost)} <Move value={((owned.shares * q.price - owned.cost) / owned.cost) * 100} /></dd>
                </dl>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="section"><div className="wrap"><FinePrint /></div></section>
    </>
  );
}
