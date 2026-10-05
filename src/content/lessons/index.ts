import type { Lesson } from "./types";
import { whatIsAQuant } from "./what-is-a-quant";
import { probability } from "./probability";
import { gameTheory } from "./game-theory";
import { python } from "./python";
import { r } from "./r";
import { c } from "./c";
import { markets } from "./markets";
import { options } from "./options";
import { strategies } from "./strategies";
import { risk } from "./risk";
import { interview } from "./interview";
import { moreC, moreGameTheory, moreProbability, morePython, moreR } from "./more";

/** Adds later lessons to a track, keeping its quiz as the final step. */
const extend = (base: Lesson[], extra: Lesson[]): Lesson[] => [...base.slice(0, -1), ...extra, base[base.length - 1]];

/** Lessons by track slug. Track titles and blurbs live in content/site.ts. */
export const LESSONS: Record<string, Lesson[]> = {
  "what-is-a-quant": whatIsAQuant,
  probability: extend(probability, moreProbability),
  "game-theory": extend(gameTheory, moreGameTheory),
  python: extend(python, morePython),
  r: extend(r, moreR),
  c: extend(c, moreC),
  markets,
  options,
  strategies,
  risk,
  interview,
};
