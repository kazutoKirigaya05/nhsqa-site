// Runs C in a worker using the JSCPP interpreter.
importScripts("./jscpp.js");
// JSCPP drops some spaces inside string literals passed straight to a function (so "Hello, quant" prints
// as "Hello,quant"). Writing each space as an escape avoids that without changing what the program means.
const keepSpaces = (src) => src.replace(/"(?:[^"\\\n]|\\.)*"/g, (m) => m.replace(/ /g, "\\u0020"));

self.onmessage = (e) => {
  const { id, code } = e.data;
  let out = "";
  try {
    const exit = JSCPP.run(keepSpaces(code), "", {
      stdio: { write: (s) => { if (out.length < 20000) out += s; } },
      unsigned_overflow: "warn",
      maxTimeout: 6000,
    });
    self.postMessage({ id, out, exit });
  } catch (err) {
    self.postMessage({ id, out, error: String(err && err.message ? err.message : err) });
  }
};
self.postMessage({ boot: true });
