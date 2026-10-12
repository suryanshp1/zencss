import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, rm, realpath } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { setTimeout } from "node:timers/promises";
import { build } from "vite";
import zen from "../packages/vite/index.ts";
const cli = resolve("packages/cli/index.ts");
test("fresh Vite app emits on-demand utilities and CSS-first configuration", async () => {
  const dir = await realpath(await mkdtemp(join(tmpdir(), "zen-vite-")));
  try {
    await writeFile(
      join(dir, "index.html"),
      '<div class="bg-surface p-6 md:flex recipe-card">Hello</div><script type="module" src="/main.js"></script>',
    );
    await writeFile(join(dir, "main.js"), "import 'virtual:zen.css';");
    await writeFile(
      join(dir, "theme.css"),
      "@zen-theme { --zen-accent: #123456; }",
    );
    const result = await build({
      root: dir,
      configFile: false,
      plugins: [zen({ configFile: "theme.css" })],
      logLevel: "silent",
      build: { write: false },
    });
    const output = Array.isArray(result)
      ? result[0].output
      : "output" in result
        ? result.output
        : [];
    const css = output
      .filter((item) => item.type === "asset" && item.fileName.endsWith(".css"))
      .map((item) => (item.type === "asset" ? String(item.source) : ""))
      .join("");
    assert.ok(css.includes(".p-6"));
    assert.ok(css.includes(".md\\:flex"));
    assert.ok(/--zen-accent:\s*#123456/.test(css));
    assert.ok(!css.includes(".p-99"));
    assert.ok(!css.includes("@zen-theme"));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("CLI generates a standalone stylesheet and diagnoses unsupported classes", async () => {
  const dir = await mkdtemp(join(tmpdir(), "zen-cli-"));
  try {
    const input = join(dir, "index.html"),
      output = join(dir, "zen.css");
    await writeFile(input, '<main class="bg-surface recipe-card p-6"></main>');
    const build = spawnSync(
      process.execPath,
      ["--experimental-strip-types", cli, "build", input, "-o", output],
      { encoding: "utf8" },
    );
    assert.equal(build.status, 0, build.stderr);
    assert.ok((await readFile(output, "utf8")).includes(".p-6"));
    await writeFile(input, '<main class="unsupported-utility"></main>');
    const invalid = spawnSync(
      process.execPath,
      ["--experimental-strip-types", cli, "build", input, "-o", output],
      { encoding: "utf8" },
    );
    assert.equal(invalid.status, 1);
    assert.ok(invalid.stderr.includes("ZC001"));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test(
  "CLI watch updates when output is alongside source",
  { timeout: 10000 },
  async () => {
    const dir = await mkdtemp(join(tmpdir(), "zen-watch-")),
      input = join(dir, "index.html"),
      output = join(dir, "zen.css");
    await writeFile(input, '<div class="p-4"></div>');
    const child = spawn(
      process.execPath,
      ["--experimental-strip-types", cli, "watch", dir, "-o", output],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    try {
      await new Promise<void>((resolve, reject) => {
        let logs = "";
        const timeout = globalThis.setTimeout(
          () => reject(new Error("watch did not start")),
          4000,
        );
        child.stdout.on("data", (data) => {
          logs += String(data);
          if (logs.includes("Watching for changes")) {
            clearTimeout(timeout);
            resolve();
          }
        });
        let errors = "";
        child.stderr.on("data", (d) => (errors += String(d)));
        child.on("error", reject);
        child.on("exit", (code, signal) => {
          clearTimeout(timeout);
          reject(new Error(`watch exited (${code}/${signal}): ${errors}`));
        });
      });
      assert.ok((await readFile(output, "utf8")).includes(".p-4"));
      await writeFile(input, '<div class="p-8"></div>');
      let updated = false;
      for (let i = 0; i < 30; i++) {
        await setTimeout(100);
        if ((await readFile(output, "utf8")).includes(".p-8")) {
          updated = true;
          break;
        }
      }
      assert.ok(updated, "watch should recompile changed source");
    } finally {
      if (child.exitCode === null && child.signalCode === null) {
        const exited = new Promise<void>((r) => child.once("exit", () => r()));
        child.kill();
        await exited;
      }
      await rm(dir, { recursive: true, force: true });
    }
  },
);

test(
  "Vite caches candidates per file and updates changed source",
  { timeout: 10000 },
  async () => {
    const { createServer } = await import("vite");
    const dir = await realpath(await mkdtemp(join(tmpdir(), "zen-hmr-")));
    await writeFile(join(dir, "index.html"), '<div class="p-4"></div>');
    const server = await createServer({
      root: dir,
      configFile: false,
      plugins: [zen()],
      logLevel: "silent",
      server: { host: "127.0.0.1", port: 0 },
    });
    try {
      await server.listen();
      const initial = await server.transformRequest("virtual:zen.css");
      assert.ok(initial?.code.includes(".p-4"));
      await writeFile(join(dir, "index.html"), '<div class="p-8"></div>');
      let updated = false;
      for (let i = 0; i < 30; i++) {
        await setTimeout(100);
        const compiled = await server.transformRequest("virtual:zen.css");
        if (
          compiled?.code.includes(".p-8") &&
          !compiled.code.includes(".p-4")
        ) {
          updated = true;
          break;
        }
      }
      assert.ok(
        updated,
        "changed file should invalidate the virtual stylesheet",
      );
    } finally {
      await server.close();
      await rm(dir, { recursive: true, force: true });
    }
  },
);
