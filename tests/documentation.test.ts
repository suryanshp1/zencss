import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { compile } from "../packages/core/index.ts";
const readme = await readFile(
  new URL("../packages/zencss/README.md", import.meta.url),
  "utf8",
);
const fences = [...readme.matchAll(/```([\w]*)\n([\s\S]*?)```/g)];
const config = fences
  .filter((f) => f[1] === "css")
  .map((f) => f[2])
  .join("\n");
for (const [index, fence] of fences.entries()) {
  if (["html", "jsx"].includes(fence[1]) && /class(?:Name)?=/.test(fence[2]))
    test(`npm documentation example ${index + 1} compiles without unknown classes`, () => {
      const result = compile(fence[2], { config });
      assert.deepEqual(result.diagnostics, []);
      assert.ok(result.rules.length > 0);
    });
}
