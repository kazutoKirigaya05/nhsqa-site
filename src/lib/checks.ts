import type { Check } from "@/content/lessons/types";
import type { RunResult } from "./runner";

function lastNumber(s: string): number | null {
  const m = s.match(/-?\d+(?:\.\d+)?(?:e-?\d+)?/gi);
  return m ? Number(m[m.length - 1]) : null;
}

/** Returns null when every check passes, otherwise the message of the first failing check. */
export function grade(checks: Check[], source: string, result: RunResult): string | null {
  if (result.error) return "Your code stopped with an error. Read the message in the output and fix that first.";
  for (const ck of checks) {
    if ("out" in ck) { if (!new RegExp(ck.out, "m").test(result.out)) return ck.msg; }
    else if ("code" in ck) { if (!new RegExp(ck.code, "m").test(source)) return ck.msg; }
    else if ("num" in ck) { const n = lastNumber(result.out); if (n === null || n < ck.num[0] || n > ck.num[1]) return ck.msg; }
    else if ("plot" in ck) { if (!result.images?.length) return ck.msg; }
  }
  return null;
}
