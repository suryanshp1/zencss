import { writeFile } from "node:fs/promises";
import { compile, recipes } from "../packages/core/index.ts";
const candidates = [
  "block",
  "inline",
  "inline-block",
  "flex",
  "inline-flex",
  "grid",
  "hidden",
  "flex-col",
  "flex-wrap",
  "flex-1",
  "items-center",
  "justify-center",
  "justify-between",
  "relative",
  "absolute",
  "sticky",
  "w-full",
  "h-full",
  "min-h-screen",
  "mx-auto",
  "bg-surface",
  "bg-panel",
  "bg-accent",
  "bg-soft",
  "text-primary",
  "text-muted",
  "text-accent",
  "text-on-accent",
  "font-display",
  "font-sans",
  "font-medium",
  "font-bold",
  "tracking-tight",
  "tracking-wide",
  "leading-tight",
  "leading-relaxed",
  "border",
  "border-b",
  "rounded",
  "rounded-lg",
  "shadow-sm",
  "shadow-md",
  "overflow-hidden",
  "layout-center",
  "measure-prose",
  "measure-heading",
  "space-section",
  "ring-focus",
  "focus-visible:ring-focus",
  "hover:opacity-80",
  ...Object.keys(recipes),
];
for (const prefix of [
  "p",
  "px",
  "py",
  "pt",
  "pb",
  "m",
  "mx",
  "my",
  "mt",
  "mb",
  "gap",
])
  for (const n of [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16])
    candidates.push(`${prefix}-${n}`);
for (const size of [
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
])
  candidates.push(`text-${size}`);
for (const n of [1, 2, 3, 4, 6, 12]) {
  candidates.push(`grid-cols-${n}`);
  for (const bp of ["sm", "md", "lg"]) candidates.push(`${bp}:grid-cols-${n}`);
}
await writeFile(
  new URL("../packages/core/base.css", import.meta.url),
  compile(candidates).css,
);
console.log(
  `Standalone ZenCSS: ${candidates.length} foundational classes → packages/core/base.css`,
);
