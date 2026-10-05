"use client";
import Link from "next/link";
import { useLeaderboard } from "@/lib/sim";
import { FinePrint, LeaderTable } from "./Parts";

export function LeaderboardView() {
  const board = useLeaderboard();
  return (
    <>
      <section className="page-head">
        <div className="wrap stack">
          <p><Link href="/trade">Trading floor</Link></p>
          <h1 className="long">Leaderboard</h1>
          <p className="lede">Everyone starts with $100,000 of pretend money. Ranked by what the account is worth right now, for members who have made at least one trade.</p>
        </div>
      </section>
      <section className="section sheet">
        <div className="wrap stack">
          {board.ready ? <LeaderTable rows={board.rows} /> : <p className="muted">Loading</p>}
          <p className="muted">Traders appear under a trading name, never their real name or school. A high place over a few weeks can be luck. The lessons on Sharpe ratio and overfitting explain why.</p>
          <FinePrint />
        </div>
      </section>
    </>
  );
}
