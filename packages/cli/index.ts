#!/usr/bin/env node
import { readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises";
import { watch } from "node:fs";
import { resolve, dirname, extname } from "node:path";
import { compile, explain, lint, type CompileOptions } from "../core/index.ts";
const [command, ...args] = process.argv.slice(2);
async function sources(path: string): Promise<string[]> {
  if ((await stat(path)).isFile()) return [await readFile(path, "utf8")];
  const result: string[] = [];
  for (const e of await readdir(path, { withFileTypes: true })) {
    if (["node_modules", ".git", "dist", "output"].includes(e.name)) continue;
    const p = resolve(path, e.name);
    if (e.isDirectory()) result.push(...(await sources(p)));
    else if (/\.(html|jsx|tsx|js|ts|vue|svelte|astro)$/.test(extname(p)))
      result.push(await readFile(p, "utf8"));
  }
  return result;
}
async function run() {
  if (command === "explain") {
    const result = explain(args.join(" "));
    for (const r of result.rules) {
      console.log(r.candidate);
      for (const [k, v] of Object.entries(r.declarations))
        console.log(`  ${k}: ${v}`);
      if (r.conditions.length)
        console.log(`  condition: ${r.conditions.join(" ")}`);
      if (r.selector.includes(":")) console.log(`  selector: ${r.selector}`);
    }
    for (const d of result.diagnostics)
      console.error(`${d.code}: ${d.message}`);
    if (result.diagnostics.length) process.exitCode = 1;
    return;
  }
  if (["build", "watch", "lint", "migrate"].includes(command)) {
    const input = resolve(args[0] ?? ".");
    const configIndex = args.indexOf("--config"),
      options: CompileOptions =
        configIndex >= 0
          ? { config: await readFile(resolve(args[configIndex + 1]), "utf8") }
          : {};
    const build = async () => {
      const content = (await sources(input)).join("\n");
      if (command === "lint" || command === "migrate") {
        const issues = lint(content);
        for (const d of issues)
          console.log(`${d.code} [${d.severity}] ${d.candidate}: ${d.message}`);
        console.log(
          command === "migrate"
            ? "Migration is advisory. Supported utilities are preserved; no source files changed."
            : `${issues.length} diagnostic(s).`,
        );
        return;
      }
      const result = compile(content, options);
      const outIndex = args.indexOf("-o"),
        out = resolve(outIndex >= 0 ? args[outIndex + 1] : "dist/zen.css");
      await mkdir(dirname(out), { recursive: true });
      await writeFile(out, result.css);
      console.log(
        `ZenCSS: ${result.rules.length} rules → ${out} (${Buffer.byteLength(result.css)} bytes)`,
      );
      if (result.diagnostics.length) {
        for (const d of result.diagnostics)
          console.error(`${d.code}: ${d.message}`);
        if (command === "build") process.exitCode = 1;
      }
    };
    await build();
    if (command === "watch") {
      let timer: ReturnType<typeof setTimeout>;
      const output = resolve(
        args.includes("-o") ? args[args.indexOf("-o") + 1] : "dist/zen.css",
      );
      const inputIsDir = (await stat(input)).isDirectory();
      watch(input, { recursive: inputIsDir }, (_event, file) => {
        if (
          file &&
          resolve(inputIsDir ? input : dirname(input), file) !== output
        ) {
          clearTimeout(timer);
          timer = setTimeout(
            () => void build().catch((e) => console.error(e.message)),
            100,
          );
        }
      });
      console.log("Watching for changes…");
    }
    return;
  }
  console.log(
    'ZenCSS v0.1.0\n\nCommands:\n  npx zen build <source-directory> -o <output.css> [--config theme.css]\n  npx zen watch <source-directory> -o <output.css>\n  npx zen explain "bg-surface p-6 hover:bg-accent"\n  npx zen lint <source-directory>\n  npx zen migrate <source-directory> --from tailwind\n\nMigration reports compatibility without rewriting files.',
  );
}
run().catch((error) => {
  console.error(`ZenCSS: ${error.message}`);
  process.exitCode = 1;
});
