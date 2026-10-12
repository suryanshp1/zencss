/** ZenCSS compiler. Pure functions, deterministic output, no styling runtime. */
export const themeNames = ["washi", "sumi", "matcha", "mono"] as const;
export type ThemeName = (typeof themeNames)[number];
export type Declarations = Record<string, string>;
export interface Diagnostic {
  code: string;
  candidate: string;
  message: string;
  severity: "warning" | "error";
}
export interface Rule {
  candidate: string;
  declarations: Declarations;
  selector: string;
  conditions: string[];
  css: string;
}
export interface Plugin {
  utilities?: Record<string, Declarations>;
  variants?: Record<string, string>;
  tokens?: Record<string, string>;
}
export interface CompileOptions {
  defaults?: boolean;
  theme?: ThemeName;
  config?: string;
  plugins?: Plugin[];
  safelist?: string[];
}
export interface CompileResult {
  css: string;
  rules: Rule[];
  diagnostics: Diagnostic[];
  candidates: string[];
}
export const themes: Record<ThemeName, Record<string, string>> = {
  washi: {
    surface: "#f7f5ef",
    panel: "#fffefa",
    text: "#242824",
    muted: "#686b60",
    border: "#dddcd2",
    accent: "#4e684b",
    "on-accent": "#ffffff",
    soft: "#e9edde",
    danger: "#a33c32",
  },
  sumi: {
    surface: "#20251f",
    panel: "#2a3028",
    text: "#f2f3e9",
    muted: "#b0b8a8",
    border: "#46503f",
    accent: "#b4cba2",
    "on-accent": "#20251f",
    soft: "#35432e",
    danger: "#ffaaa0",
  },
  matcha: {
    surface: "#eef2e7",
    panel: "#fafcf6",
    text: "#29382a",
    muted: "#596b51",
    border: "#cfdac5",
    accent: "#48623d",
    "on-accent": "#ffffff",
    soft: "#dfe8d3",
    danger: "#a33c32",
  },
  mono: {
    surface: "#f3f3f3",
    panel: "#ffffff",
    text: "#242424",
    muted: "#666666",
    border: "#d9d9d9",
    accent: "#333333",
    "on-accent": "#ffffff",
    soft: "#e8e8e8",
    danger: "#a33c32",
  },
};
const primitiveTokens: Record<string, string> = {
  "space-unit": "0.25rem",
  "radius-control": "0.375rem",
  "radius-card": "0.75rem",
  "space-section": "clamp(3rem, 8vw, 6rem)",
  "font-sans":
    'Inter, ui-sans-serif, system-ui, -apple-system, "Noto Sans JP", sans-serif',
  "font-display": 'Georgia, "Noto Serif JP", serif',
  "shadow-sm": "0 2px 8px #24282408",
  "shadow-md": "0 8px 28px #24282412",
};
export const recipes: Record<string, Declarations> = {
  "recipe-card": {
    padding: "calc(var(--zen-space-unit) * 8)",
    background: "var(--zen-panel)",
    color: "var(--zen-text)",
    border: "1px solid var(--zen-border)",
    "border-radius": "var(--zen-radius-card)",
  },
  "recipe-button": {
    display: "inline-flex",
    "align-items": "center",
    "justify-content": "center",
    gap: "0.5rem",
    padding: "0.75rem 1.125rem",
    background: "var(--zen-accent)",
    color: "var(--zen-on-accent)",
    border: "1px solid transparent",
    "border-radius": "var(--zen-radius-control)",
    "font-size": "0.875rem",
    "font-weight": "500",
    cursor: "pointer",
    transition: "background-color 160ms ease, opacity 160ms ease",
  },
  "recipe-button-quiet": {
    display: "inline-flex",
    "align-items": "center",
    "justify-content": "center",
    padding: "0.75rem 1.125rem",
    background: "transparent",
    color: "var(--zen-text)",
    border: "1px solid var(--zen-border)",
    "border-radius": "var(--zen-radius-control)",
    cursor: "pointer",
  },
  "recipe-button-small": { padding: "0.5rem 0.875rem", "font-size": "0.75rem" },
  "recipe-card-compact": { padding: "1rem" },
  "recipe-input": {
    width: "100%",
    padding: "0.75rem 0.875rem",
    background: "var(--zen-panel)",
    color: "var(--zen-text)",
    border: "1px solid var(--zen-border)",
    "border-radius": "var(--zen-radius-control)",
    "font-size": "0.875rem",
  },
  "recipe-badge": {
    display: "inline-flex",
    "align-items": "center",
    padding: "0.25rem 0.625rem",
    background: "var(--zen-soft)",
    color: "var(--zen-accent)",
    "border-radius": "0.25rem",
    "font-size": "0.75rem",
    "font-weight": "500",
  },
};
const fixed: Record<string, Declarations> = {
  block: { display: "block" },
  inline: { display: "inline" },
  "inline-block": { display: "inline-block" },
  flex: { display: "flex" },
  "inline-flex": { display: "inline-flex" },
  grid: { display: "grid" },
  hidden: { display: "none" },
  "flex-col": { "flex-direction": "column" },
  "flex-row": { "flex-direction": "row" },
  "flex-wrap": { "flex-wrap": "wrap" },
  "flex-1": { flex: "1 1 0%" },
  "shrink-0": { "flex-shrink": "0" },
  "items-center": { "align-items": "center" },
  "items-start": { "align-items": "flex-start" },
  "items-end": { "align-items": "flex-end" },
  "justify-center": { "justify-content": "center" },
  "justify-between": { "justify-content": "space-between" },
  relative: { position: "relative" },
  absolute: { position: "absolute" },
  fixed: { position: "fixed" },
  sticky: { position: "sticky" },
  "min-h-screen": { "min-height": "100vh" },
  "h-screen": { height: "100vh" },
  "w-full": { width: "100%" },
  "h-full": { height: "100%" },
  "w-auto": { width: "auto" },
  "mx-auto": { "margin-inline": "auto" },
  "text-left": { "text-align": "start" },
  "text-center": { "text-align": "center" },
  "text-right": { "text-align": "end" },
  "font-normal": { "font-weight": "400" },
  "font-medium": { "font-weight": "500" },
  "font-semibold": { "font-weight": "600" },
  "font-bold": { "font-weight": "700" },
  "font-display": { "font-family": "var(--zen-font-display)" },
  "font-sans": { "font-family": "var(--zen-font-sans)" },
  "tracking-wide": { "letter-spacing": "0.08em" },
  "tracking-tight": { "letter-spacing": "-0.035em" },
  "leading-tight": { "line-height": "1.15" },
  "leading-relaxed": { "line-height": "1.7" },
  uppercase: { "text-transform": "uppercase" },
  italic: { "font-style": "italic" },
  underline: { "text-decoration": "underline" },
  border: {
    "border-width": "1px",
    "border-style": "solid",
    "border-color": "var(--zen-border)",
  },
  "border-0": { "border-width": "0" },
  "border-b": { "border-bottom": "1px solid var(--zen-border)" },
  "rounded-none": { "border-radius": "0" },
  rounded: { "border-radius": "var(--zen-radius-control)" },
  "rounded-lg": { "border-radius": "var(--zen-radius-card)" },
  "rounded-full": { "border-radius": "9999px" },
  "shadow-sm": { "box-shadow": "var(--zen-shadow-sm)" },
  "shadow-md": { "box-shadow": "var(--zen-shadow-md)" },
  "shadow-none": { "box-shadow": "none" },
  "overflow-hidden": { overflow: "hidden" },
  "overflow-auto": { overflow: "auto" },
  "cursor-pointer": { cursor: "pointer" },
  "transition-colors": {
    transition: "color 160ms ease, background-color 160ms ease",
  },
  "measure-prose": { "max-width": "65ch" },
  "measure-heading": { "max-width": "18ch" },
  "layout-center": {
    width: "min(100% - 2rem, 72rem)",
    "margin-inline": "auto",
  },
  "space-section": { "padding-block": "var(--zen-space-section)" },
  "ring-focus": {
    outline: "2px solid var(--zen-accent)",
    "outline-offset": "3px",
  },
  "sr-only": {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    "white-space": "nowrap",
    "border-width": "0",
  },
};
const sizes: Record<string, string> = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "clamp(2rem, 4vw, 2.5rem)",
  "5xl": "clamp(2.5rem, 5vw, 3.5rem)",
  "6xl": "clamp(3rem, 6vw, 4.5rem)",
};
const colors: Record<string, string> = {
  primary: "text",
  muted: "muted",
  surface: "surface",
  panel: "panel",
  accent: "accent",
  "on-accent": "on-accent",
  soft: "soft",
  border: "border",
  danger: "danger",
  ink: "text",
  matcha: "accent",
  white: "white",
  transparent: "transparent",
  black: "black",
};
function color(value: string) {
  return colors[value]
    ? ["white", "black", "transparent"].includes(value)
      ? value
      : `var(--zen-${colors[value]})`
    : undefined;
}
const spacingProps: Record<string, string[]> = {
  p: ["padding"],
  px: ["padding-inline"],
  py: ["padding-block"],
  pt: ["padding-top"],
  pb: ["padding-bottom"],
  ps: ["padding-inline-start"],
  pe: ["padding-inline-end"],
  pl: ["padding-left"],
  pr: ["padding-right"],
  m: ["margin"],
  mx: ["margin-inline"],
  my: ["margin-block"],
  mt: ["margin-top"],
  mb: ["margin-bottom"],
  ms: ["margin-inline-start"],
  me: ["margin-inline-end"],
  ml: ["margin-left"],
  mr: ["margin-right"],
  gap: ["gap"],
  "gap-x": ["column-gap"],
  "gap-y": ["row-gap"],
  w: ["width"],
  h: ["height"],
  "min-w": ["min-width"],
  "max-w": ["max-width"],
  "min-h": ["min-height"],
  "max-h": ["max-height"],
  top: ["top"],
  bottom: ["bottom"],
  left: ["left"],
  right: ["right"],
  inset: ["inset"],
};
function splitVariants(candidate: string): string[] {
  const parts: string[] = [];
  let level = 0,
    current = "";
  for (const c of candidate) {
    if (c === "[") level++;
    if (c === "]") level--;
    if (c === ":" && level === 0) {
      parts.push(current);
      current = "";
    } else current += c;
  }
  parts.push(current);
  return parts;
}
function safeValue(value: string): boolean {
  return (
    value.length > 0 &&
    value.length < 250 &&
    !/[;{}<>@\\\n\r]/.test(value) &&
    !/url\s*\(|expression\s*\(|\/\*/i.test(value) &&
    /^[\w\s#.,%+*/()\-:'"]+$/.test(value)
  );
}
export function escapeClass(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, (c) => `\\${c}`);
}
function utility(
  name: string,
  options: CompileOptions,
  custom: Record<string, Declarations>,
): Declarations | undefined {
  if (custom[name]) return custom[name];
  for (const plugin of [...(options.plugins ?? [])].reverse())
    if (plugin.utilities?.[name]) return plugin.utilities[name];
  if (fixed[name]) return fixed[name];
  if (recipes[name] && options.defaults !== false) return recipes[name];
  const textSize = name.match(/^text-(.+)$/);
  if (textSize && sizes[textSize[1]])
    return { "font-size": sizes[textSize[1]], "line-height": "1.4" };
  const col = name.match(/^(bg|text|border|ring)-(.+)$/);
  if (col) {
    const value = color(col[2]);
    if (value)
      return {
        [{
          bg: "background-color",
          text: "color",
          border: "border-color",
          ring: "outline-color",
        }[col[1]]!]: value,
      };
  }
  const space = name.match(
    /^(-?)(p[xytsbelr]?|m[xytsbelr]?|gap(?:-[xy])?|(?:min-|max-)?[wh]|top|bottom|left|right|inset)-(.+)$/,
  );
  if (space) {
    let value: string | undefined;
    const raw = space[3];
    if (raw === "auto") value = "auto";
    else if (/^\d+(?:\.\d+)?$/.test(raw))
      value = `calc(var(--zen-space-unit) * ${Number(raw)})`;
    else if (/^\[.*\]$/.test(raw)) {
      const v = raw.slice(1, -1).replace(/_/g, " ");
      if (safeValue(v)) value = v;
    } else if (/^\d+\/\d+$/.test(raw)) {
      const [a, b] = raw.split("/").map(Number);
      if (b) value = `${(a / b) * 100}%`;
    }
    if (value && (!space[1] || !space[2].startsWith("p"))) {
      if (space[1]) value = `calc(${value} * -1)`;
      return Object.fromEntries(spacingProps[space[2]].map((p) => [p, value!]));
    }
  }
  const arbitrary = name.match(
    /^(bg|text|border|rounded|opacity|z|leading|tracking)-\[(.+)\]$/,
  );
  if (arbitrary) {
    const v = arbitrary[2].replace(/_/g, " ");
    if (safeValue(v))
      return {
        [{
          bg: "background-color",
          text: "color",
          border: "border-color",
          rounded: "border-radius",
          opacity: "opacity",
          z: "z-index",
          leading: "line-height",
          tracking: "letter-spacing",
        }[arbitrary[1]]!]: v,
      };
  }
  const grid = name.match(/^grid-cols-([1-9]|1[0-2])$/);
  if (grid)
    return { "grid-template-columns": `repeat(${grid[1]}, minmax(0, 1fr))` };
  const opacity = name.match(/^opacity-(\d+)$/);
  if (opacity && +opacity[1] <= 100)
    return { opacity: String(+opacity[1] / 100) };
  const z = name.match(/^z-(\d+)$/);
  if (z) return { "z-index": z[1] };
  return undefined;
}
export function extractCandidates(source: string): string[] {
  const candidates = new Set<string>();
  const attributes = /(?:class|className)\s*=\s*(?:\{\s*)?["'`]([^"'`]+)["'`]/g;
  const add = (value: string, attribute = false) => {
    for (const token of value.split(/\s+/)) {
      if (
        token &&
        !token.includes("${") &&
        (attribute || /^[a-zA-Z0-9_:.[\]#%/(),+*'"=-]+$/.test(token))
      )
        candidates.add(token);
    }
  };
  for (const match of source.matchAll(attributes)) add(match[1], true);
  // Quoted lists in clsx/cva or static JavaScript maps. Ignore unrelated attributes and prose.
  for (const match of source.matchAll(/["'`]([^"'`\n]+)["'`]/g)) {
    const prefix = source
      .slice(Math.max(0, match.index! - 30), match.index)
      .trimEnd();
    if (/=\s*$/.test(prefix)) continue;
    const tokens = match[1].trim().split(/\s+/);
    if (
      tokens.every(
        (t) =>
          Boolean(fixed[t] || recipes[t]) ||
          /^(?:(?:[\w-]+):)*(?:bg|text|p[xytsbelr]?|m[xytsbelr]?|gap|w|h|min|max|grid|font|border|rounded|shadow|opacity|recipe|measure|layout|space|ring|tracking|leading|z|items|justify|flex|overflow)-/.test(
            t,
          ),
      )
    )
      add(match[1]);
  }
  return [...candidates].sort();
}
function declarationsCSS(declarations: Declarations) {
  return Object.entries(declarations)
    .map(([k, v]) => `${k}: ${v};`)
    .join(" ");
}
function readDeclarations(body: string): Declarations {
  const result: Declarations = {};
  for (const chunk of body.split(";")) {
    const i = chunk.indexOf(":");
    if (i > 0) {
      const key = chunk.slice(0, i).trim(),
        value = chunk.slice(i + 1).trim();
      if (/^--[\w-]+$|^[a-z-]+$/.test(key) && safeValue(value))
        result[key] = value;
    }
  }
  return result;
}
export function processConfig(config = "") {
  const tokens: Record<string, string> = {},
    utilities: Record<string, Declarations> = {},
    customRecipes: Record<string, Declarations> = {};
  for (const m of config.matchAll(/@zen-theme\s*\{([^{}]*)\}/g))
    Object.assign(tokens, readDeclarations(m[1]));
  for (const m of config.matchAll(/@zen-utility\s+([\w-]+)\s*\{([^{}]*)\}/g))
    utilities[m[1]] = readDeclarations(m[2]);
  for (const m of config.matchAll(
    /@zen-recipe\s+([\w-]+)\s*\{((?:[^{}]|\{[^{}]*\})*)\}/g,
  )) {
    const base = m[2].match(/base\s*\{([^{}]*)\}/);
    if (base) customRecipes[`recipe-${m[1]}`] = readDeclarations(base[1]);
    for (const variant of m[2].matchAll(/variant\s+([\w-]+)\s*\{([^{}]*)\}/g))
      customRecipes[`recipe-${m[1]}-${variant[1]}`] = {
        ...(base ? readDeclarations(base[1]) : {}),
        ...readDeclarations(variant[2]),
      };
  }
  return { tokens, utilities, customRecipes };
}
export function tokenCSS(
  theme: ThemeName = "washi",
  extra: Record<string, string> = {},
) {
  const declarations = (values: Record<string, string>) =>
    Object.entries(values)
      .map(([k, v]) => `${k.startsWith("--") ? k : `--zen-${k}`}: ${v};`)
      .join(" ");
  return `:root { ${declarations({ ...primitiveTokens, ...themes[theme], ...extra })} }\n${themeNames.map((t) => `[data-zen-theme="${t}"] { ${declarations({ ...themes[t], ...extra })} }`).join("\n")}\n@media (prefers-color-scheme: dark) { :root:not([data-zen-theme]) { ${declarations({ ...themes.sumi, ...extra })} } }`;
}
export function compile(
  input: string | string[],
  options: CompileOptions = {},
): CompileResult {
  const candidates = [
    ...new Set([
      ...(Array.isArray(input) ? input : extractCandidates(input)),
      ...(options.safelist ?? []),
    ]),
  ].sort();
  const config = processConfig(options.config);
  const rules: Rule[] = [],
    diagnostics: Diagnostic[] = [];
  for (const candidate of candidates) {
    const parts = splitVariants(candidate),
      name = parts.pop()!;
    const declarations = utility(name, options, {
      ...config.utilities,
      ...config.customRecipes,
    });
    if (!declarations) {
      diagnostics.push({
        code: "ZC001",
        candidate,
        message: `Unknown or malformed utility “${candidate}”. Check the utility reference.`,
        severity: "error",
      });
      continue;
    }
    let selector = `.${escapeClass(candidate)}`;
    const conditions: string[] = [];
    let valid = true;
    for (const variant of parts) {
      if (
        [
          "hover",
          "focus",
          "focus-visible",
          "active",
          "disabled",
          "checked",
        ].includes(variant)
      )
        selector += `:${variant}`;
      else if (["sm", "md", "lg", "xl", "2xl"].includes(variant))
        conditions.push(
          `@media (min-width: ${{ sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" }[variant]} )`,
        );
      else if (variant === "dark")
        selector = `[data-zen-theme="sumi"] ${selector}`;
      else if (variant === "motion-reduce")
        conditions.push("@media (prefers-reduced-motion: reduce)");
      else if (variant === "container-sm")
        conditions.push("@container (min-width: 400px)");
      else {
        const custom = (options.plugins ?? [])
          .map((p) => p.variants?.[variant])
          .filter(Boolean)
          .pop();
        if (custom && custom.includes("&"))
          selector = custom.replaceAll("&", selector);
        else {
          valid = false;
          diagnostics.push({
            code: "ZC002",
            candidate,
            message: `Unsupported variant “${variant}”.`,
            severity: "error",
          });
        }
      }
    }
    if (valid) {
      let css = `${selector} { ${declarationsCSS(declarations)} }`;
      for (const condition of [...conditions].reverse())
        css = `${condition} { ${css} }`;
      if (parts.includes("dark"))
        css += `\n@media (prefers-color-scheme: dark) { ${css.replaceAll('[data-zen-theme="sumi"]', ":root:not([data-zen-theme])")} }`;
      rules.push({ candidate, declarations, selector, conditions, css });
    }
  }
  // Base rules first, then state variants, then responsive variants, with stable lexical ties.
  rules.sort(
    (a, b) =>
      a.conditions.length - b.conditions.length ||
      splitVariants(a.candidate).length -
        1 -
        (splitVariants(b.candidate).length - 1) ||
      (splitVariants(a.candidate).at(-1)?.startsWith("leading-") ? 1 : 0) -
        (splitVariants(b.candidate).at(-1)?.startsWith("leading-") ? 1 : 0) ||
      (a.candidate < b.candidate ? -1 : a.candidate > b.candidate ? 1 : 0),
  );
  const extra = Object.assign(
    {},
    ...(options.plugins ?? []).map((p) => p.tokens ?? {}),
    config.tokens,
  );
  const base =
    options.defaults === false
      ? ""
      : `@layer zen-reset { *, *::before, *::after { box-sizing: border-box; } body { margin: 0; } button, input, textarea { font: inherit; } }\n@layer zen-base { body { font-family: var(--zen-font-sans); line-height: 1.5; } :focus-visible { outline: 2px solid var(--zen-accent); outline-offset: 3px; } button:disabled { opacity: .5; cursor: not-allowed; } }\n`;
  const recipeRules = rules.filter((r) =>
    splitVariants(r.candidate).at(-1)?.startsWith("recipe-"),
  );
  const utilityRules = rules.filter((r) => !recipeRules.includes(r));
  const css = `@layer zen-reset, zen-tokens, zen-base, zen-recipes, zen-utilities, zen-overrides;\n${base}@layer zen-tokens {\n${tokenCSS(options.theme, extra)}\n}\n@layer zen-recipes {\n${recipeRules.map((r) => r.css).join("\n")}\n}\n@layer zen-utilities {\n${utilityRules.map((r) => r.css).join("\n")}\n}\n@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; } }`;
  return { css, rules, diagnostics, candidates };
}
export function explain(
  classes: string,
  options: CompileOptions = {},
): CompileResult {
  return compile(classes.trim().split(/\s+/), options);
}
/** Later definitions win. Conflicts are identified by the same property and variant scope. */
export function mergeClasses(...inputs: string[]): string {
  const names = inputs.join(" ").trim().split(/\s+/).filter(Boolean);
  const seen = new Set<string>(),
    keep: string[] = [];
  for (const name of names.reverse()) {
    const parts = splitVariants(name),
      base = parts.pop()!;
    const decl = utility(base, {}, {});
    const keys = Object.keys(decl ?? { [base]: "" }).map(
      (p) => `${parts.join(":")}|${p}`,
    );
    if (!keys.every((k) => seen.has(k))) {
      keep.unshift(name);
      keys.forEach((k) => seen.add(k));
    }
  }
  return keep.join(" ");
}
export function lint(source: string): Diagnostic[] {
  const candidates = extractCandidates(source),
    result = compile(candidates);
  const diagnostics = [...result.diagnostics];
  const arbitrary = candidates.filter((c) => /\[/.test(c));
  if (arbitrary.length >= 3)
    diagnostics.push({
      code: "ZC102",
      candidate: arbitrary.join(", "),
      message:
        "Repeated hard-coded values. Consider shared spacing or semantic color tokens.",
      severity: "warning",
    });
  if (
    /<(button|input|textarea|a)\b/.test(source) &&
    !candidates.some(
      (c) => c.includes("focus-visible") || c.startsWith("recipe-"),
    )
  )
    diagnostics.push({
      code: "ZC103",
      candidate: "interactive elements",
      message: "Add focus-visible:ring-focus or an accessible recipe.",
      severity: "warning",
    });
  return diagnostics;
}
