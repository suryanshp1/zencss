import { readFile, appendFile } from "node:fs/promises";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const pkg = JSON.parse(
  await readFile(resolve(root, "packages/zencss/package.json"), "utf8"),
);
const starter = JSON.parse(
  await readFile(resolve(root, "examples/vite-react/package.json"), "utf8"),
);
const requested = process.env.REQUESTED_VERSION;
if (pkg.name !== "@suryanshp1/zencss")
  throw new Error("Only @suryanshp1/zencss may be published by this workflow.");
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(pkg.version))
  throw new Error("Invalid release version.");
if (requested !== pkg.version)
  throw new Error(
    `Requested ${requested ?? "no version"}; package manifest is ${pkg.version}. Commit the intended version before releasing.`,
  );
if (starter.dependencies[pkg.name] !== pkg.version)
  throw new Error("React starter dependency must match the release version.");
const changelog = await readFile(
  resolve(root, "packages/zencss/CHANGELOG.md"),
  "utf8",
);
if (
  !changelog.split("\n").some((line) => line.startsWith(`## ${pkg.version} `))
)
  throw new Error("Add a changelog entry for this version before releasing.");
const outputs = {
  version: pkg.version,
  archive: `artifacts/suryanshp1-zencss-${pkg.version}.tgz`,
  tag: pkg.version.includes("-") ? "alpha" : "latest",
};
if (process.env.GITHUB_OUTPUT)
  await appendFile(
    process.env.GITHUB_OUTPUT,
    Object.entries(outputs)
      .map(([key, value]) => `${key}=${value}\n`)
      .join(""),
  );
console.log(JSON.stringify(outputs, null, 2));
