import { mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, ".."),
  out = resolve(root, "artifacts");
await mkdir(out, { recursive: true });
for (const name of ["zencss", "core", "vite", "cli"]) {
  execFileSync(
    "npm",
    [
      "pack",
      "--pack-destination",
      out,
      "--cache",
      resolve(root, "output/npm-cache"),
    ],
    { cwd: resolve(root, "packages", name), stdio: "inherit" },
  );
}
console.log(`Installable package archives: ${out}`);
