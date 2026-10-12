import { access, readFile } from "node:fs/promises";
const pkg = JSON.parse(await readFile("package.json", "utf8"));
const paths = new Set(
  [
    pkg.main,
    pkg.module,
    pkg.types,
    pkg.style,
    ...Object.values(pkg.bin ?? {}),
  ].filter(Boolean),
);
function visit(value) {
  if (typeof value === "string" && value.startsWith("./")) paths.add(value);
  else if (value && typeof value === "object")
    Object.values(value).forEach(visit);
}
visit(pkg.exports);
for (const path of paths)
  try {
    await access(path);
  } catch {
    throw new Error(
      `${pkg.name}: missing ${path}. Run npm run build:packages from the repository root before packing.`,
    );
  }
console.log(`${pkg.name}: package entry points verified.`);
