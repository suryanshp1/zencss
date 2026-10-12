import type { Plugin, ViteDevServer } from "vite";
import { readFile, readdir } from "node:fs/promises";
import { resolve, relative, extname } from "node:path";
import {
  compile,
  extractCandidates,
  type CompileOptions,
} from "../core/index.ts";
export interface ZenViteOptions extends CompileOptions {
  configFile?: string;
  include?: string[];
}
const virtualId = "virtual:zen.css",
  resolvedId = "\0" + virtualId;
const extensions = new Set([
  ".html",
  ".jsx",
  ".tsx",
  ".js",
  ".ts",
  ".vue",
  ".svelte",
  ".astro",
]);
export default function zen(options: ZenViteOptions = {}): Plugin {
  let root = process.cwd(),
    server: ViteDevServer | undefined,
    config = options.config ?? "";
  const sources = new Map<string, string[]>();
  const skipped = new Set([
    "node_modules",
    ".git",
    "dist",
    "coverage",
    "output",
    "packages",
    "tests",
    "benchmarks",
  ]);
  async function scan(dir: string): Promise<void> {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = resolve(dir, entry.name);
      if (entry.isDirectory() && !skipped.has(entry.name)) await scan(path);
      else if (
        entry.isFile() &&
        extensions.has(extname(path)) &&
        !entry.name.includes(".config.")
      )
        sources.set(path, extractCandidates(await readFile(path, "utf8")));
    }
  }
  async function loadConfig() {
    if (options.configFile)
      config = await readFile(resolve(root, options.configFile), "utf8");
  }
  function generate() {
    return compile([...new Set([...sources.values()].flat())], {
      ...options,
      config,
    }).css;
  }
  return {
    name: "zencss",
    enforce: "pre",
    async configResolved(c) {
      root = c.root;
      for (const source of options.include ?? ["."]) {
        const path = resolve(root, source);
        if (extensions.has(extname(path)))
          sources.set(path, extractCandidates(await readFile(path, "utf8")));
        else await scan(path);
      }
      await loadConfig();
    },
    resolveId(id) {
      if (id === virtualId) return resolvedId;
    },
    load(id) {
      if (id === resolvedId) return generate();
    },
    configureServer(s) {
      server = s;
      if (options.configFile) s.watcher.add(resolve(root, options.configFile));
      s.watcher.on("add", async (path) => {
        if (
          extensions.has(extname(path)) &&
          !relative(root, path).startsWith("..") &&
          !relative(root, path)
            .split("/")
            .some((part) => skipped.has(part))
        ) {
          sources.set(path, extractCandidates(await readFile(path, "utf8")));
          const mod = s.moduleGraph.getModuleById(resolvedId);
          if (mod) {
            s.moduleGraph.invalidateModule(mod);
            s.ws.send({ type: "full-reload" });
          }
        }
      });
      s.watcher.on("unlink", (path) => {
        if (sources.delete(path)) {
          const mod = s.moduleGraph.getModuleById(resolvedId);
          if (mod) s.moduleGraph.invalidateModule(mod);
          s.ws.send({ type: "full-reload" });
        }
      });
    },
    async handleHotUpdate(ctx) {
      const path = ctx.file;
      if (options.configFile && path === resolve(root, options.configFile))
        await loadConfig();
      else if (
        extensions.has(extname(path)) &&
        !relative(root, path).startsWith("..")
      )
        sources.set(path, extractCandidates(await ctx.read()));
      else return;
      const mod = server?.moduleGraph.getModuleById(resolvedId);
      if (mod) {
        server!.moduleGraph.invalidateModule(mod);
        return [mod];
      }
    },
  };
}
