import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import {
  readFile,
  writeFile,
  mkdir,
  copyFile,
  rm,
  chmod,
} from "node:fs/promises";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const typesDir = resolve(root, "output/package-types");
execFileSync(
  resolve(root, "node_modules/.bin/tsc"),
  [
    "packages/core/index.ts",
    "packages/vite/index.ts",
    "--declaration",
    "--emitDeclarationOnly",
    "--allowImportingTsExtensions",
    "--target",
    "ES2022",
    "--module",
    "ESNext",
    "--moduleResolution",
    "bundler",
    "--strict",
    "--skipLibCheck",
    "--rootDir",
    "packages",
    "--outDir",
    typesDir,
  ],
  { cwd: root, stdio: "inherit" },
);
const coreTypes = await readFile(resolve(typesDir, "core/index.d.ts"), "utf8");
const viteTypes = await readFile(resolve(typesDir, "vite/index.d.ts"), "utf8");
const coreCSS = await readFile(resolve(root, "packages/core/base.css"), "utf8");
const packages = ["core", "vite", "cli", "zencss"];
for (const name of packages) {
  const dir = resolve(root, "packages", name);
  await rm(resolve(dir, "dist"), { recursive: true, force: true });
  await mkdir(resolve(dir, "dist"), { recursive: true });
  await copyFile(resolve(root, "LICENSE"), resolve(dir, "LICENSE"));
  await copyFile(
    resolve(root, "tooling/check-package.mjs"),
    resolve(dir, "check-package.mjs"),
  );
}
async function bundle(
  source: string,
  destination: string,
  format: "esm" | "cjs",
  platform: "node" | "neutral" = "node",
) {
  await build({
    entryPoints: [resolve(root, source)],
    outfile: resolve(root, destination),
    bundle: true,
    format,
    platform,
    target: "es2022",
    sourcemap: true,
    external: ["vite", "node:*"],
    legalComments: "none",
  });
}
for (const format of ["esm", "cjs"] as const) {
  const ext = format === "esm" ? "js" : "cjs";
  await bundle(
    "packages/core/index.ts",
    `packages/core/dist/index.${ext}`,
    format,
    "neutral",
  );
  await bundle(
    "packages/vite/index.ts",
    `packages/vite/dist/index.${ext}`,
    format,
  );
  await bundle(
    "packages/core/index.ts",
    `packages/zencss/dist/index.${ext}`,
    format,
    "neutral",
  );
  await bundle(
    "packages/vite/index.ts",
    `packages/zencss/dist/vite.${ext}`,
    format,
  );
  const typeExt = format === "esm" ? "d.ts" : "d.cts";
  await writeFile(
    resolve(root, `packages/core/dist/index.${typeExt}`),
    coreTypes,
  );
  await writeFile(
    resolve(root, `packages/zencss/dist/index.${typeExt}`),
    coreTypes,
  );
  await writeFile(
    resolve(root, `packages/vite/dist/index.${typeExt}`),
    viteTypes.replace("../core/index.ts", "@zencss/core"),
  );
  await writeFile(
    resolve(root, `packages/zencss/dist/vite.${typeExt}`),
    viteTypes.replace("../core/index.ts", `./index.${ext}`),
  );
}
for (const name of ["cli", "zencss"]) {
  await bundle("packages/cli/index.ts", `packages/${name}/dist/cli.js`, "esm");
  await chmod(resolve(root, `packages/${name}/dist/cli.js`), 0o755);
}
for (const name of ["core", "zencss"])
  await writeFile(resolve(root, `packages/${name}/dist/base.css`), coreCSS);
for (const name of ["vite", "zencss"])
  await writeFile(
    resolve(root, `packages/${name}/dist/client.d.ts`),
    'declare module "virtual:zen.css" {}\n',
  );
await rm(typesDir, { recursive: true, force: true });
console.log(
  "Built installable ZenCSS packages: ESM, CommonJS, declarations, CSS, Vite plugin, and CLI.",
);
