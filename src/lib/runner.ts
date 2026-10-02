"use client";
import type { Lang } from "@/content/lessons/types";

export type RunResult = { out: string; error?: string; timedOut?: boolean; images?: string[] };

const BASE = "/runtimes";
const LIMIT_MS = 10000;
const TIMEOUT_MSG = "Stopped after 10 seconds. Check for a loop that never ends.";

type Reply = { id?: number; boot?: boolean; out?: string; error?: string };

/** One long-lived worker per language. If code runs too long the worker is thrown away and rebuilt next time. */
class WorkerRunner {
  private worker: Worker | null = null;
  private booted: Promise<void> | null = null;
  private n = 0;
  constructor(private url: string, private module: boolean) {}

  private start() {
    const w = new Worker(this.url, this.module ? { type: "module" } : undefined);
    this.worker = w;
    this.booted = new Promise<void>((resolve, reject) => {
      const onMsg = (e: MessageEvent<Reply>) => { if (e.data.boot) { w.removeEventListener("message", onMsg); resolve(); } };
      w.addEventListener("message", onMsg);
      w.addEventListener("error", () => reject(new Error("The code runner could not load. Check your connection and try again.")), { once: true });
    });
    return this.booted;
  }

  private stop() { this.worker?.terminate(); this.worker = null; this.booted = null; }

  async run(code: string): Promise<RunResult> {
    try { await (this.booted ?? this.start()); }
    catch (e) { this.stop(); return { out: "", error: (e as Error).message }; }
    const w = this.worker!;
    const id = ++this.n;
    return new Promise<RunResult>((resolve) => {
      const timer = setTimeout(() => { w.removeEventListener("message", onMsg); this.stop(); resolve({ out: "", timedOut: true, error: TIMEOUT_MSG }); }, LIMIT_MS);
      const onMsg = (e: MessageEvent<Reply>) => {
        if (e.data.id !== id) return;
        clearTimeout(timer); w.removeEventListener("message", onMsg);
        const error = e.data.error === "Time limit exceeded." ? TIMEOUT_MSG : e.data.error;
        resolve({ out: e.data.out ?? "", error, timedOut: error === TIMEOUT_MSG });
      };
      w.addEventListener("message", onMsg);
      w.postMessage({ id, code });
    });
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
let webR: any = null;
let webRReady: Promise<any> | null = null;

function loadWebR() {
  if (!webRReady) {
    webRReady = (async () => {
      const load = new Function("u", "return import(u)") as (u: string) => Promise<any>;
      const mod = await load(`${location.origin}${BASE}/webr/webr.mjs`);
      webR = new mod.WebR({ baseUrl: `${location.origin}${BASE}/webr/`, channelType: mod.ChannelType.PostMessage });
      await webR.init();
      return webR;
    })().catch((e) => { webRReady = null; webR = null; throw e; });
  }
  return webRReady;
}

function bitmapToUrl(img: ImageBitmap) {
  const c = document.createElement("canvas");
  c.width = img.width; c.height = img.height;
  c.getContext("2d")!.drawImage(img, 0, 0);
  return c.toDataURL("image/png");
}

async function runR(code: string): Promise<RunResult> {
  let r: any;
  try { r = await loadWebR(); }
  catch { return { out: "", error: "R could not load. Check your connection and try again." }; }
  const work = (async (): Promise<RunResult> => {
    const shelter = await new r.Shelter();
    try {
      await r.evalRVoid("rm(list = ls(all.names = TRUE))");
      const res = await shelter.captureR(code, { withAutoprint: true, captureStreams: true, captureConditions: false });
      let out = ""; let error = "";
      for (const o of res.output as { type: string; data: string }[]) {
        if (o.type === "stderr" && (error || /^Error/.test(o.data))) error += o.data + "\n";
        else out += o.data + "\n";
      }
      const images = ((res.images ?? []) as ImageBitmap[]).map(bitmapToUrl);
      return { out, error: error.trim() || undefined, images };
    } catch (e) {
      return { out: "", error: String((e as Error).message ?? e) };
    } finally { shelter.purge(); }
  })();
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<RunResult>((resolve) => {
    timer = setTimeout(() => { try { webR?.close(); } catch {} webR = null; webRReady = null; resolve({ out: "", timedOut: true, error: TIMEOUT_MSG }); }, LIMIT_MS);
  });
  const result = await Promise.race([work, timeout]);
  clearTimeout(timer!);
  return result;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

let py: WorkerRunner | null = null;
let c: WorkerRunner | null = null;

export function runCode(lang: Lang, code: string): Promise<RunResult> {
  if (lang === "python") return (py ??= new WorkerRunner(`${BASE}/py-worker.mjs`, true)).run(code);
  if (lang === "c") return (c ??= new WorkerRunner(`${BASE}/c-worker.js`, false)).run(code);
  return runR(code);
}

export const LANG_NAME: Record<Lang, string> = { python: "Python", r: "R", c: "C" };
export const FILE_NAME: Record<Lang, string> = { python: "script.py", r: "script.R", c: "main.c" };
