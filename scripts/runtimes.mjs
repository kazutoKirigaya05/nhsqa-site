// Copies the in-browser language runtimes into public/runtimes so the site serves them itself.
import { cpSync, mkdirSync, rmSync, copyFileSync } from "node:fs";
import { build } from "esbuild";

const out = "public/runtimes";
rmSync(out, { recursive: true, force: true });
mkdirSync(`${out}/pyodide`, { recursive: true });
for (const f of ["pyodide.mjs", "pyodide.asm.mjs", "pyodide.asm.wasm", "python_stdlib.zip", "pyodide-lock.json"])
  copyFileSync(`node_modules/pyodide/${f}`, `${out}/pyodide/${f}`);

mkdirSync(`${out}/webr`, { recursive: true });
for (const f of ["R.js", "R.wasm", "libRblas.so", "libRlapack.so", "webr-worker.js"])
  copyFileSync(`node_modules/webr/dist/${f}`, `${out}/webr/${f}`);
cpSync("node_modules/webr/dist/vfs", `${out}/webr/vfs`, { recursive: true });

await build({
  stdin: { contents: 'import J from "JSCPP"; self.JSCPP = J;', resolveDir: process.cwd() },
  bundle: true, format: "iife", minify: true, platform: "browser", outfile: `${out}/jscpp.js`, logLevel: "error",
  alias: { util: "./runtime-src/shim/util.js", stream: "./runtime-src/shim/stream.js" },
  define: { "process.env.NODE_ENV": '"production"' },
});
copyFileSync("node_modules/webr/dist/webr.js", `${out}/webr/webr.mjs`);
copyFileSync("runtime-src/py-worker.mjs", `${out}/py-worker.mjs`);
copyFileSync("runtime-src/c-worker.js", `${out}/c-worker.js`);
console.log("runtimes ready");
