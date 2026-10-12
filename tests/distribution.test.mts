import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtemp,
  writeFile,
  readFile,
  rm,
  mkdir,
  symlink,
  realpath,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { build } from "vite";
const root = resolve(import.meta.dirname, "..");
const cache = resolve(root, "output/npm-cache");
const manifests = Object.fromEntries(
  await Promise.all(
    ["zencss", "core", "vite", "cli"].map(async (directory) => [
      directory,
      JSON.parse(
        await readFile(
          resolve(root, "packages", directory, "package.json"),
          "utf8",
        ),
      ),
    ]),
  ),
);
function archive(directory: string) {
  const pkg = manifests[directory];
  return `${pkg.name.replace("@", "").replace("/", "-")}-${pkg.version}.tgz`;
}
async function install(names: string[], skipPeerResolution = false) {
  const dir = await realpath(await mkdtemp(join(tmpdir(), "zen-consumer-")));
  await writeFile(
    join(dir, "package.json"),
    JSON.stringify({
      name: "independent-zen-consumer",
      private: true,
      type: "module",
    }),
  );
  execFileSync(
    "npm",
    [
      "install",
      "--offline",
      ...(skipPeerResolution ? ["--legacy-peer-deps"] : []),
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      "--cache",
      cache,
      ...names.map((n) => resolve(root, "artifacts", n)),
    ],
    { cwd: dir, stdio: "pipe" },
  );
  return dir;
}
function node(dir: string, source: string, cjs = false) {
  return execFileSync(
    process.execPath,
    cjs ? ["-e", source] : ["--input-type=module", "-e", source],
    { cwd: dir, encoding: "utf8" },
  );
}
test("single package installs outside the repository and works without a TypeScript runtime", async () => {
  const dir = await install([archive("zencss")]);
  try {
    const esm = node(
      dir,
      `import {compile} from '@suryanshp1/zencss'; import zen from '@suryanshp1/zencss/vite'; const r=compile('<div class="p-6 bg-surface"></div>'); if(r.rules.length!==2||typeof zen!=='function')process.exit(1); console.log(r.css);`,
    );
    assert.ok(esm.includes(".p-6"));
    const cjs = node(
      dir,
      `const {compile}=require('@suryanshp1/zencss'); const zen=require('@suryanshp1/zencss/vite').default; if(typeof zen!=='function')process.exit(1); console.log(compile(['text-muted']).rules.length)`,
      true,
    );
    assert.equal(cjs.trim(), "1");
    const cli = execFileSync(
      join(dir, "node_modules/.bin/zen"),
      ["explain", "bg-surface p-6"],
      { cwd: dir, encoding: "utf8" },
    );
    assert.ok(cli.includes("padding: calc(var(--zen-space-unit) * 6)"));
    await mkdir(join(dir, "src"));
    await writeFile(
      join(dir, "src/index.html"),
      '<div class="bg-surface recipe-card p-6"></div>',
    );
    execFileSync(
      join(dir, "node_modules/.bin/zen"),
      ["build", "src", "-o", "public/zen.css"],
      { cwd: dir, stdio: "pipe" },
    );
    assert.ok(
      (await readFile(join(dir, "public/zen.css"), "utf8")).includes(
        ".recipe-card",
      ),
    );
    const metadata = JSON.parse(
      await readFile(
        join(dir, "node_modules/@suryanshp1/zencss/package.json"),
        "utf8",
      ),
    );
    assert.equal(
      metadata.repository.url,
      "git+https://github.com/suryanshp1/zencss.git",
    );
    assert.equal(
      metadata.bugs.url,
      "https://github.com/suryanshp1/zencss/issues",
    );
    for (const file of [
      "README.md",
      "CHANGELOG.md",
      "docs/CONTRIBUTING.md",
      "docs/SECURITY.md",
      "docs/RELEASING.md",
      "LICENSE",
    ])
      assert.ok(
        (
          await readFile(
            join(dir, "node_modules/@suryanshp1/zencss", file),
            "utf8",
          )
        ).length > 100,
        `missing consumer documentation: ${file}`,
      );
    assert.ok(
      !metadata.dependencies,
      "single package should not depend on unpublished workspace packages",
    );
    assert.ok(
      (
        await readFile(
          join(dir, "node_modules/@suryanshp1/zencss/dist/base.css"),
          "utf8",
        )
      ).includes(".md\\:grid-cols-3"),
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("packed package drives a fresh Vite production build and exports ESM/CJS types", async () => {
  const dir = await install([archive("zencss")]);
  try {
    // Supply the independently installed Vite peer and compiler tools, never ZenCSS source/workspace links.
    await symlink(
      resolve(root, "node_modules/vite"),
      join(dir, "node_modules/vite"),
      "junction",
    );
    await mkdir(join(dir, "node_modules/@types"), { recursive: true });
    await symlink(
      resolve(root, "node_modules/@types/node"),
      join(dir, "node_modules/@types/node"),
      "junction",
    );
    await writeFile(
      join(dir, "vite.config.js"),
      `import {defineConfig} from 'vite'; import zen from '@suryanshp1/zencss/vite'; export default defineConfig({plugins:[zen({configFile:'theme.css'})]});`,
    );
    await writeFile(
      join(dir, "theme.css"),
      "@zen-theme { --zen-accent: #123456; }",
    );
    await writeFile(
      join(dir, "index.html"),
      '<html data-zen-theme="washi"><body><div class="recipe-card p-6 md:flex bg-surface">Independent app</div><script type="module" src="/main.js"></script></body></html>',
    );
    await writeFile(join(dir, "main.js"), "import 'virtual:zen.css';");
    const output = await build({
      root: dir,
      logLevel: "silent",
      build: { write: false },
    });
    const assets = Array.isArray(output)
      ? output[0].output
      : "output" in output
        ? output.output
        : [];
    const css = assets
      .filter((a) => a.type === "asset" && a.fileName.endsWith(".css"))
      .map((a) => (a.type === "asset" ? String(a.source) : ""))
      .join("");
    assert.ok(css.includes(".p-6") && css.includes(".md\\:flex"));
    assert.ok(/--zen-accent:\s*#123456/.test(css));
    assert.ok(
      !css.includes(".p-16"),
      "on-demand output should omit unrequested utilities",
    );
    await writeFile(
      join(dir, "consumer.mts"),
      `/// <reference types="@suryanshp1/zencss/client" />\nimport {compile, type CompileOptions} from '@suryanshp1/zencss'; import zen from '@suryanshp1/zencss/vite'; import 'virtual:zen.css'; const options:CompileOptions={theme:'sumi'}; compile(['p-6'],options); zen(options);`,
    );
    await writeFile(
      join(dir, "consumer.cts"),
      `import zen=require('@suryanshp1/zencss'); import plugin=require('@suryanshp1/zencss/vite'); zen.compile(['p-6']); plugin.default({theme:'washi'});`,
    );
    execFileSync(
      resolve(root, "node_modules/.bin/tsc"),
      [
        "--noEmit",
        "--strict",
        "--skipLibCheck",
        "--module",
        "NodeNext",
        "--moduleResolution",
        "NodeNext",
        "--target",
        "ES2022",
        "consumer.mts",
        "consumer.cts",
      ],
      { cwd: dir, stdio: "pipe" },
    );
    await writeFile(
      join(dir, "main.js"),
      "import '@suryanshp1/zencss/styles';",
    );
    const staticBuild = await build({
      root: dir,
      configFile: false,
      logLevel: "silent",
      build: { write: false },
    });
    const staticAssets = Array.isArray(staticBuild)
      ? staticBuild[0].output
      : "output" in staticBuild
        ? staticBuild.output
        : [];
    assert.ok(
      staticAssets.some(
        (a) =>
          a.type === "asset" &&
          a.fileName.endsWith(".css") &&
          String(a.source).includes(".p-16"),
      ),
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("scoped archives contain usable compiled entry points", async () => {
  const dir = await install(
    [archive("core"), archive("vite"), archive("cli")],
    true,
  );
  try {
    const output = node(
      dir,
      `import {compile} from '@zencss/core'; import zen from '@zencss/vite'; if(typeof zen!=='function')process.exit(1);console.log(compile(['p-6']).rules.length);`,
    );
    assert.equal(output.trim(), "1");
    assert.ok(
      execFileSync(
        join(dir, "node_modules/.bin/zen"),
        ["explain", "text-muted"],
        { cwd: dir, encoding: "utf8" },
      ).includes("var(--zen-muted)"),
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
