"use client";
import { useState } from "react";

export function KitCalculator({ costPerKit }: { costPerKit: number }) {
  const [amount, setAmount] = useState("1000");
  const n = Number(amount);
  const kits = Number.isFinite(n) && n > 0 ? Math.floor(n / costPerKit + 1e-9) : 0;
  return (
    <div className="calc">
      <div className="field">
        <label htmlFor="calc-amount">Sponsorship amount, in dollars</label>
        <input id="calc-amount" type="number" inputMode="numeric" min={0} step={100} value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div>
        <output htmlFor="calc-amount" aria-live="polite">{kits.toLocaleString("en-US")} kits</output>
        <p className="muted">at ${costPerKit.toFixed(2)} of parts per kit, before shipping</p>
      </div>
    </div>
  );
}
