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
import { c2, gameTheory2, interview2, markets2, options2, probability2, python2, r2, risk2, strategies2, whatIsAQuant2 } from "./more2";
import { math } from "./math";
import { statistics } from "./statistics";
import { bonds } from "./bonds";
import { portfolio } from "./portfolio";
import { timeseries } from "./timeseries";
import { algorithms } from "./algorithms";
import { ml } from "./ml";
import { psychology } from "./psychology";
import { careers } from "./careers";

/** Adds later lessons to a track, keeping its quiz as the final step. */
const extend = (base: Lesson[], extra: Lesson[]): Lesson[] => [...base.slice(0, -1), ...extra, base[base.length - 1]];

/** Lessons by track slug. Track titles and blurbs live in content/site.ts. */
export const LESSONS: Record<string, Lesson[]> = {
  "what-is-a-quant": extend(whatIsAQuant, whatIsAQuant2),
  math,
  probability: extend(extend(probability, moreProbability), probability2),
  statistics,
  "game-theory": extend(extend(gameTheory, moreGameTheory), gameTheory2),
  python: extend(extend(python, morePython), python2),
  r: extend(extend(r, moreR), r2),
  c: extend(extend(c, moreC), c2),
  markets: extend(markets, markets2),
  bonds,
  options: extend(options, options2),
  portfolio,
  risk: extend(risk, risk2),
  strategies: extend(strategies, strategies2),
  timeseries,
  algorithms,
  ml,
  psychology,
  interview: extend(interview, interview2),
  careers,
};
