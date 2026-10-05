"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "./supabase";
import { friendly, useSession } from "./session";

export type Quote = { price: number; prev_close: number | null; day_open: number | null; day_high: number | null; day_low: number | null; as_of: string; fetched_at: string };
export type Stock = { symbol: string; name: string; kind: "stock" | "fund"; sort: number; quote: Quote | null };
export type Account = { user_id: string; handle: string; cash: number; created_at: string };
export type Position = { symbol: string; shares: number; cost: number };
export type Order = { id: number; symbol: string; side: "buy" | "sell"; shares: number; status: "pending" | "filled" | "cancelled" | "rejected"; price: number | null; note: string | null; created_at: string; filled_at: string | null };
export type Leader = { place: number; handle: string; value: number; gain: number; trades: number; me: boolean };
export type Market = { stocks: Stock[]; open: boolean; ready: boolean; error: string | null; connected: boolean };

const n = (v: unknown) => (v === null || v === undefined ? null : Number(v));
const toQuote = (q: Record<string, unknown>): Quote => ({
  price: Number(q.price), prev_close: n(q.prev_close), day_open: n(q.day_open), day_high: n(q.day_high), day_low: n(q.day_low), as_of: String(q.as_of), fetched_at: String(q.fetched_at),
});

/** Asks the server to refresh stale prices. The server decides what to fetch; the browser never supplies a price. */
export async function refreshQuotes(symbols: string[] = []): Promise<string | null> {
  const { data, error } = await supabase().functions.invoke("quotes", { body: { symbols } });
  if (error) return "unreachable";
  return data && data.ok === false ? String(data.reason) : null;
}

/** Live list of stocks with their latest prices. Re-reads every 30 seconds and nudges a refresh every minute. */
export function useMarket(priority: string[] = []): Market & { reload: () => Promise<void> } {
  const [m, setM] = useState<Market>({ stocks: [], open: false, ready: false, error: null, connected: true });
  const key = priority.join(",");
  const pri = useRef(priority);
  useEffect(() => { pri.current = priority; });

  const load = useCallback(async () => {
    const db = supabase();
    const [s, q, st] = await Promise.all([
      db.from("sim_symbols").select("symbol, name, kind, sort").order("sort"),
      db.from("sim_quotes").select("symbol, price, prev_close, day_open, day_high, day_low, as_of, fetched_at"),
      db.rpc("sim_status"),
    ]);
    if (s.error || q.error) { setM((old) => ({ ...old, ready: true, error: friendly(s.error ?? q.error) })); return; }
    const quotes = new Map((q.data ?? []).map((r) => [r.symbol as string, toQuote(r)]));
    setM((old) => ({
      ...old, ready: true, error: null, open: !!(st.data as { open?: boolean } | null)?.open,
      stocks: (s.data ?? []).map((r) => ({ symbol: r.symbol, name: r.name, kind: r.kind, sort: r.sort, quote: quotes.get(r.symbol) ?? null })),
    }));
  }, []);

  useEffect(() => {
    let alive = true;
    const tick = async (refresh: boolean) => {
      if (document.hidden) return;
      if (refresh) {
        const problem = await refreshQuotes(pri.current);
        if (alive) setM((old) => ({ ...old, connected: problem !== "no_key" }));
      }
      if (alive) await load();
    };
    void tick(true);
    const fast = setInterval(() => void tick(false), 30000);
    const slow = setInterval(() => void tick(true), 60000);
    return () => { alive = false; clearInterval(fast); clearInterval(slow); };
  }, [load, key]);

  return { ...m, reload: load };
}

export type Book = { status: "loading" | "out" | "none" | "ready"; account: Account | null; positions: Position[]; orders: Order[] };

/** The logged-in member's practice account, holdings and orders. */
export function useBook(): Book & { reload: () => Promise<void>; open: () => Promise<string | null>; rename: () => Promise<string | null> } {
  const session = useSession();
  const [book, setBook] = useState<Book>({ status: "loading", account: null, positions: [], orders: [] });

  const load = useCallback(async () => {
    const db = supabase();
    const a = await db.from("sim_accounts").select("user_id, handle, cash, created_at").maybeSingle();
    if (!a.data) { setBook({ status: "none", account: null, positions: [], orders: [] }); return; }
    const [p, o] = await Promise.all([
      db.from("sim_positions").select("symbol, shares, cost").gt("shares", 0).order("symbol"),
      db.from("sim_orders").select("id, symbol, side, shares, status, price, note, created_at, filled_at").order("id", { ascending: false }).limit(40),
    ]);
    setBook({
      status: "ready",
      account: { ...a.data, cash: Number(a.data.cash) } as Account,
      positions: (p.data ?? []).map((r) => ({ symbol: r.symbol, shares: r.shares, cost: Number(r.cost) })),
      orders: (o.data ?? []).map((r) => ({ ...r, price: n(r.price) })) as Order[],
    });
  }, []);

  useEffect(() => {
    if (session.status !== "in") return;
    let alive = true;
    const run = () => { if (alive && !document.hidden) void load(); };
    run();
    const t = setInterval(run, 30000);
    return () => { alive = false; clearInterval(t); };
  }, [session.status, load]);

  const open = useCallback(async () => {
    const { error } = await supabase().rpc("sim_open_account");
    if (error) return friendly(error);
    await load(); return null;
  }, [load]);
  const rename = useCallback(async () => {
    const { error } = await supabase().rpc("sim_new_name");
    if (error) return friendly(error);
    await load(); return null;
  }, [load]);

  const status = session.status === "loading" ? "loading" : session.status === "out" ? "out" : book.status;
  return { ...book, status, reload: load, open, rename };
}

export async function placeOrder(symbol: string, side: "buy" | "sell", shares: number): Promise<{ order?: Order; error?: string }> {
  await refreshQuotes([symbol]);
  const { data, error } = await supabase().rpc("sim_place_order", { p_symbol: symbol, p_side: side, p_shares: shares });
  if (error) return { error: friendly(error) };
  return { order: { ...(data as Order), price: n((data as Order).price) } };
}

export async function cancelOrder(id: number) { await supabase().rpc("sim_cancel_order", { p_id: id }); }

export function useLeaderboard(): { rows: Leader[]; ready: boolean } {
  const session = useSession();
  const [state, setState] = useState<{ rows: Leader[]; ready: boolean }>({ rows: [], ready: false });
  useEffect(() => {
    if (session.status === "loading") return;
    let alive = true;
    const load = async () => {
      const { data } = await supabase().rpc("sim_leaderboard");
      if (alive) setState({ ready: true, rows: ((data ?? []) as Leader[]).map((r) => ({ ...r, place: Number(r.place), value: Number(r.value), gain: Number(r.gain), trades: Number(r.trades) })) });
    };
    void load();
    const t = setInterval(() => { if (!document.hidden) void load(); }, 60000);
    return () => { alive = false; clearInterval(t); };
  }, [session.status]);
  return state;
}

export type Point = { t: string; price: number };
/** Today's five-minute prices and the daily closes collected so far, for one stock. */
export function useChart(symbol: string, stamp: string | undefined): { today: Point[]; days: Point[] } {
  const [data, setData] = useState<{ today: Point[]; days: Point[] }>({ today: [], days: [] });
  useEffect(() => {
    let alive = true;
    (async () => {
      const db = supabase();
      const [i, h] = await Promise.all([
        db.from("sim_intraday").select("slot, at, price").eq("symbol", symbol).order("slot"),
        db.from("sim_history").select("day, close").eq("symbol", symbol).order("day"),
      ]);
      if (!alive) return;
      const rows = i.data ?? [];
      // Slots are reused each day, so keep only the ones written on the most recent trading day.
      const latest = rows.reduce((mx, r) => (r.at > mx ? r.at : mx), "");
      const day = latest.slice(0, 10);
      setData({
        today: rows.filter((r) => String(r.at).slice(0, 10) === day).map((r) => ({ t: r.at, price: Number(r.price) })),
        days: (h.data ?? []).map((r) => ({ t: r.day, price: Number(r.close) })),
      });
    })();
    return () => { alive = false; };
  }, [symbol, stamp]);
  return data;
}

export const usd = (v: number, digits = 2) => (v < 0 ? "−$" : "$") + Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
export const pct = (v: number) => (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v).toFixed(2) + "%";
export const dayMove = (q: Quote | null) => (q && q.prev_close ? ((q.price - q.prev_close) / q.prev_close) * 100 : null);
