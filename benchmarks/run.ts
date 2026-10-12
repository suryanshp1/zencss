import { compile } from "../packages/core/index.ts";
import { gzipSync } from "node:zlib";
import { performance } from "node:perf_hooks";
const seeds = [
  "bg-surface",
  "text-primary",
  "text-muted",
  "recipe-card",
  "recipe-button",
  "flex",
  "grid",
  "md:grid-cols-3",
  "focus-visible:ring-focus",
  "hover:bg-accent",
];
console.log(
  `ZenCSS reproducible compiler benchmark | Node ${process.version} | ${process.platform}/${process.arch}`,
);
for (const count of [100, 1000, 10000]) {
  const candidates = Array.from({ length: count }, (_, i) => `p-${i}`);
  candidates.push(...seeds);
  const coldStart = performance.now();
  const result = compile(candidates);
  const cold = performance.now() - coldStart;
  const timings = [];
  for (let run = 0; run < 30; run++) {
    const start = performance.now();
    compile(candidates);
    timings.push(performance.now() - start);
  }
  timings.sort((a, b) => a - b);
  console.log(
    JSON.stringify({
      candidates: result.candidates.length,
      coldMs: +cold.toFixed(2),
      repeatP95Ms: +timings[Math.floor(timings.length * 0.95)].toFixed(2),
      cssBytes: Buffer.byteLength(result.css),
      gzipBytes: gzipSync(result.css).length,
      rssMB: +(process.memoryUsage().rss / 1024 / 1024).toFixed(1),
    }),
  );
}
console.log(
  "Repeated runs recompile a full candidate set. These are not incremental-cache or competitor benchmarks.",
);
