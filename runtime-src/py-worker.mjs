// Runs Python in a worker so a runaway loop can be stopped by terminating the worker.
import { loadPyodide } from "./pyodide/pyodide.mjs";

const ready = loadPyodide({ indexURL: new URL("./pyodide/", import.meta.url).href });
const LIMIT = 20000;

function tidy(err) {
  const text = String(err && err.message ? err.message : err);
  const lines = text.split("\n");
  const at = lines.findIndex((l) => l.includes('File "<exec>"'));
  return (at >= 0 ? lines.slice(at) : lines).join("\n").replace(/File "<exec>", /g, "").trim();
}

self.onmessage = async (e) => {
  const { id, code } = e.data;
  let out = "";
  const push = (s) => { if (out.length < LIMIT) out += s + "\n"; };
  try {
    const py = await ready;
    py.setStdout({ batched: push });
    py.setStderr({ batched: push });
    const globals = py.globals.get("dict")();
    try {
      await py.runPythonAsync(code, { globals });
      self.postMessage({ id, out });
    } catch (err) {
      self.postMessage({ id, out, error: tidy(err) });
    } finally {
      globals.destroy();
    }
  } catch (err) {
    self.postMessage({ id, out, error: "Python could not start: " + String(err) });
  }
};
self.postMessage({ boot: true });
