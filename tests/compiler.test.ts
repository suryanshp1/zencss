import test from "node:test";
import assert from "node:assert/strict";
import {
  compile,
  explain,
  extractCandidates,
  mergeClasses,
  processConfig,
  lint,
  themes,
  themeNames,
} from "../packages/core/index.ts";
test("static extraction works in HTML, JSX, Vue and helper lists without non-class attributes", () => {
  assert.deepEqual(
    extractCandidates(
      '<input id="email" type="email" placeholder="Your email" class="p-4 text-muted"/>',
    ),
    ["p-4", "text-muted"],
  );
  assert.deepEqual(
    extractCandidates(
      `<div className={'grid md:grid-cols-3'} />; clsx('p-4 bg-surface', enabled && 'text-muted')`,
    ),
    ["bg-surface", "grid", "md:grid-cols-3", "p-4", "text-muted"],
  );
});
test("only requested utilities are emitted and output is deterministic", () => {
  const a = compile(["p-6", "bg-surface", "p-6", "hover:bg-accent", "md:flex"]);
  const b = compile(["md:flex", "hover:bg-accent", "bg-surface", "p-6"]);
  assert.equal(a.css, b.css);
  assert.equal(a.rules.length, 4);
  assert.ok(!a.css.includes(".p-8 "));
  assert.equal(a.diagnostics.length, 0);
});
test("semantic utilities preserve markup across all themes", () => {
  for (const theme of themeNames) {
    const result = compile(["bg-surface", "text-muted"], { theme });
    assert.equal(
      result.rules[0].declarations["background-color"],
      "var(--zen-surface)",
    );
    assert.ok(result.css.includes(themes[theme].surface));
  }
});
test("stacked variants and colon-bearing arbitrary values are safely parsed", () => {
  const res = compile([
    "md:hover:bg-accent",
    "w-[calc(100%_-_2rem)]",
    "focus-visible:ring-focus",
    "container-sm:grid-cols-2",
  ]);
  assert.equal(res.diagnostics.length, 0);
  assert.ok(
    res.rules
      .find((r) => r.candidate === "md:hover:bg-accent")!
      .css.includes(":hover"),
  );
  assert.equal(
    res.rules.find((r) => r.candidate.startsWith("w-"))!.declarations.width,
    "calc(100% - 2rem)",
  );
});
test("rejects declaration injection, URLs, malformed utilities and unknown variants", () => {
  for (const c of [
    "w-[10px;display:none]",
    "bg-[url(https://example.com)]",
    "bg-[red}body{display:none]",
    "p-nope",
    "evil:p-4",
    "p-[10px",
  ]) {
    const res = compile([c]);
    assert.equal(res.rules.length, 0, c);
    assert.equal(res.diagnostics.length, 1, c);
  }
});
test("CSS-first tokens, utilities and nested recipe variants compile", () => {
  const config =
    "@zen-theme { --zen-accent: oklch(0.55 0.06 145); } @zen-utility content-auto { content-visibility: auto; } @zen-recipe note { base { padding: 1rem; } variant quiet { background: var(--zen-soft); } }";
  const parsed = processConfig(config);
  assert.equal(parsed.tokens["--zen-accent"], "oklch(0.55 0.06 145)");
  const res = compile(["content-auto", "recipe-note-quiet"], { config });
  assert.equal(res.diagnostics.length, 0);
  assert.equal(
    res.rules.find((r) => r.candidate === "recipe-note-quiet")!.declarations
      .padding,
    "1rem",
  );
  assert.ok(res.css.includes("--zen-accent: oklch(0.55 0.06 145)"));
});
test("built-in recipes precede utilities and defaults can be disabled", () => {
  const res = compile(["recipe-card", "p-2"]);
  assert.ok(res.css.indexOf(".recipe-card") < res.css.indexOf(".p-2"));
  const bare = compile(["flex", "recipe-card"], { defaults: false });
  assert.ok(!bare.css.includes("@layer zen-reset {"));
  assert.equal(bare.diagnostics.length, 1);
});
test("plugin ordering and variants are explicit", () => {
  const res = compile(["pressed:custom"], {
    plugins: [
      { utilities: { custom: { color: "red" } } },
      {
        utilities: { custom: { color: "blue" } },
        variants: { pressed: '&[aria-pressed="true"]' },
      },
    ],
  });
  assert.equal(res.rules[0].declarations.color, "blue");
  assert.ok(res.rules[0].selector.includes('[aria-pressed="true"]'));
});
test("explain reports actual declarations and conditions", () => {
  const res = explain("bg-surface p-6 md:hover:bg-accent");
  assert.equal(
    res.rules.find((r) => r.candidate === "p-6")!.declarations.padding,
    "calc(var(--zen-space-unit) * 6)",
  );
  assert.ok(res.rules.at(-1)!.conditions[0].includes("768px"));
});
test("class merge keeps variant scopes independent", () => {
  assert.equal(
    mergeClasses("p-2 text-muted", "p-6 hover:text-accent"),
    "text-muted p-6 hover:text-accent",
  );
  assert.equal(mergeClasses("p-4 md:p-6", "p-8"), "md:p-6 p-8");
});
test("lint gives advisory diagnostics and recognizes accessible recipes", () => {
  assert.ok(
    lint('<button class="p-4">Save</button>').some((d) => d.code === "ZC103"),
  );
  assert.ok(
    !lint('<button class="recipe-button">Save</button>').some(
      (d) => d.code === "ZC103",
    ),
  );
  assert.ok(
    lint('<div class="p-[23px] m-[25px] gap-[24px]"></div>').some(
      (d) => d.code === "ZC102",
    ),
  );
});
test("explicit theme attributes retain custom token overrides", () => {
  const css = compile(["bg-accent"], {
    config: "@zen-theme { --zen-accent: #123456; }",
  }).css;
  for (const theme of themeNames) {
    const start = css.indexOf(`[data-zen-theme="${theme}"]`),
      end = css.indexOf("}", start);
    assert.ok(css.slice(start, end).includes("--zen-accent: #123456;"));
  }
});
test("dark variant has a system preference fallback with manual theme precedence", () => {
  const css = compile(["dark:bg-panel"]).css;
  assert.ok(css.includes('[data-zen-theme="sumi"] .dark\\:bg-panel'));
  assert.ok(css.includes(":root:not([data-zen-theme]) .dark\\:bg-panel"));
});
test("explicit line-height utilities override type scale line-height", () => {
  const css = compile(["leading-tight", "text-4xl"]).css;
  assert.ok(css.indexOf(".text-4xl") < css.indexOf(".leading-tight"));
});
test("default theme text and button roles meet AA contrast", () => {
  const luminance = (hex: string) => {
    const c = hex
      .slice(1)
      .match(/../g)!
      .map((s) => parseInt(s, 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const contrast = (a: string, b: string) => {
    const x = luminance(a),
      y = luminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };
  for (const name of themeNames) {
    const t = themes[name];
    for (const [fg, bg] of [
      ["text", "surface"],
      ["muted", "surface"],
      ["text", "panel"],
      ["muted", "panel"],
      ["on-accent", "accent"],
      ["accent", "soft"],
    ])
      assert.ok(contrast(t[fg], t[bg]) >= 4.5, `${name}: ${fg}/${bg}`);
  }
});

test("malformed classes in actual source produce diagnostics", () => {
  const result = compile('<div class="bg-[red;display:none] p-invalid"></div>');
  assert.equal(result.diagnostics.length, 2);
  assert.equal(result.rules.length, 0);
});
