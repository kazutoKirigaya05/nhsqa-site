import type { Lesson } from "./types";
import { whatIsAQuant } from "./what-is-a-quant";
import { probability } from "./probability";
import { gameTheory } from "./game-theory";
import { python } from "./python";
import { r } from "./r";
import { c } from "./c";

/** Lessons by track slug. Track titles and blurbs live in content/site.ts. */
export const LESSONS: Record<string, Lesson[]> = {
  "what-is-a-quant": whatIsAQuant,
  probability,
  "game-theory": gameTheory,
  python,
  r,
  c,
};
