# ZenCSS

**Less, but intentional.** A CSS-first utility framework for thoughtful interfaces.

[![npm version](https://img.shields.io/npm/v/%40suryanshp1%2Fzencss)](https://www.npmjs.com/package/@suryanshp1/zencss)
[![MIT license](https://img.shields.io/badge/license-MIT-657a62)](https://github.com/suryanshp1/zencss)

ZenCSS combines familiar utility classes with semantic colors, intentional spacing, four themes, and CSS component recipes. It generates native CSS at build time. Your production interface needs no ZenCSS styling JavaScript, external fonts, or CDN.

**Status: alpha.** Core utilities, the Vite integration, CLI, and installable distributions are available. ZenCSS is an independent engine; it does not implement every Tailwind class, configuration option, or plugin.

[Source code](https://github.com/suryanshp1/zencss) · [Issues and feature requests](https://github.com/suryanshp1/zencss/issues) · [npm package](https://www.npmjs.com/package/@suryanshp1/zencss)

## Contents

- [Installation](#installation)
- [Vite quick start](#vite-quick-start)
- [Framework examples](#framework-examples)
- [Vanilla HTML and CLI](#vanilla-html-and-cli)
- [Prebuilt CSS](#prebuilt-css)
- [Themes and tokens](#themes-and-tokens)
- [Utility reference](#utility-reference)
- [Responsive and state variants](#responsive-and-state-variants)
- [Component recipes](#component-recipes)
- [CSS-first configuration](#css-first-configuration)
- [Scanning and safelists](#scanning-and-safelists)
- [Compiler API and plugins](#compiler-api-and-plugins)
- [Cascade and accessibility](#cascade-and-accessibility)
- [Troubleshooting](#troubleshooting)
- [Compatibility and roadmap](#compatibility-and-roadmap)
- [Contributing and support](#contributing-and-support)

## Installation

After the registry release is published, install in your own application:

```sh
npm install -D @suryanshp1/zencss
```

For local evaluation before publication, build the archive from the framework repository and install it in another project:

```sh
# In the framework repository:
npm install
npm run pack:packages

# In your application; replace this path:
npm install -D /absolute/path/to/zencss/artifacts/suryanshp1-zencss-0.1.1.tgz
```

The compiled package requires **Node.js 20.19+**. TypeScript is optional. The Vite plugin supports **Vite 6 and 7**; Vite is an optional peer dependency, so the compiler and CLI can be used without it. If your framework has a stricter Node requirement, follow that requirement.

ESM, CommonJS, declaration files, JavaScript source maps, prebuilt CSS, and the `zen` executable are included. The all-in-one package has no dependencies on unpublished ZenCSS packages. Use a regular dependency instead of a dev dependency if your production server imports the compiler at runtime.

## Vite quick start

**1. Add the plugin.** Keep your existing framework plugins and add `zen()`:

```js
// vite.config.js or vite.config.ts
import { defineConfig } from "vite";
import zen from "@suryanshp1/zencss/vite";

export default defineConfig({
  plugins: [zen()],
});
```

**2. Import the generated stylesheet** once in your application entry:

```js
// src/main.js, src/main.ts, or src/main.tsx
import "virtual:zen.css";
```

For TypeScript, add this line to `src/vite-env.d.ts`, preserving any existing references:

```ts
/// <reference types="@suryanshp1/zencss/client" />
```

**3. Set a theme** on your root document:

```html
<html lang="en" data-zen-theme="washi"></html>
```

**4. Compose your interface:**

```html
<main class="bg-surface text-primary min-h-screen">
  <div class="layout-center space-section">
    <article class="recipe-card measure-prose mx-auto">
      <span class="recipe-badge">A thoughtful beginning</span>
      <h1 class="font-display text-4xl leading-tight">Hello, clarity.</h1>
      <p class="text-muted leading-relaxed">Make room for your next idea.</p>
      <button class="recipe-button mt-6 hover:opacity-80" type="button">
        Get started
      </button>
    </article>
  </div>
</main>
```

Run your app's normal development and production commands. ZenCSS scans complete class names, caches candidates per file during development, and emits only the requested utilities and recipes, together with its token and base layers.

## Framework examples

The generated CSS is framework-independent. Vite and vanilla HTML are verified by integration tests; Vue, Svelte and Astro source extraction is supported, but full framework compatibility certification remains an alpha milestone.

### React

Keep your React Vite plugin in the configuration, add `zen()`, and import `virtual:zen.css` in your entry file. Components use `className`:

```jsx
export default function Welcome() {
  return (
    <section className="recipe-card p-6 bg-panel text-primary">
      <h1 className="font-display text-3xl">A little more clarity.</h1>
      <p className="text-muted">Your next idea starts here.</p>
      <button className="recipe-button mt-4" type="button">
        Create
      </button>
    </section>
  );
}
```

### Vue

Keep your Vue Vite plugin, add `zen()`, and import the stylesheet in `src/main.ts`. Use static classes or explicit conditional class names:

```html
<template>
  <section class="recipe-card p-6 text-primary">
    <h1 class="font-display text-3xl">A thoughtful workspace.</h1>
    <p class="text-muted">Simple pieces. Coherent results.</p>
    <button class="recipe-button mt-4" type="button">Begin</button>
  </section>
</template>
```

### Svelte and SvelteKit

Keep your Svelte Vite plugin and add `zen()`. In a Svelte Vite app, import the stylesheet from the entry file. In SvelteKit, import it once from the root `src/routes/+layout.svelte` script:

```html
<script>
  import "virtual:zen.css";
</script>
```

Keep your existing layout markup and rendering logic. CSS recipes do not add interaction code or require a component wrapper.

### Astro

Register the plugin in Astro's Vite configuration:

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import zen from "@suryanshp1/zencss/vite";

export default defineConfig({
  vite: { plugins: [zen()] },
});
```

Import `virtual:zen.css` in the frontmatter of a shared layout or page, then use ordinary HTML classes. For non-Vite frameworks, use the CLI or the prebuilt stylesheet instead of the Vite plugin.

## Vanilla HTML and CLI

After installing the package, `npx zen` resolves its local CLI executable:

```sh
# Generate CSS from one file or a directory.
npx zen build ./src -o ./public/zen.css

# Rebuild when source changes.
npx zen watch ./src -o ./public/zen.css

# Read the declarations and conditions behind your classes.
npx zen explain "bg-surface p-6 md:hover:bg-accent"

# Run advisory design checks.
npx zen lint ./src

# Report migration compatibility without changing source files.
npx zen migrate ./src --from tailwind
```

Load the generated CSS from the path your web server serves:

```html
<link rel="stylesheet" href="/zen.css" />
```

For CSS-first configuration, pass `--config ./theme.css` to `build` or `watch`. The default source is the current directory and the default output is `dist/zen.css`. Prefer an explicit source directory to avoid scanning unrelated application files.

| Command   | Behavior                                                                    |
| --------- | --------------------------------------------------------------------------- |
| `build`   | Writes CSS; exits with code 1 if class diagnostics are present              |
| `watch`   | Writes initial CSS and watches changes; logs class diagnostics              |
| `explain` | Prints declarations and selectors; exits with code 1 for invalid candidates |
| `lint`    | Prints advisory diagnostics; findings do not fail the command               |
| `migrate` | Prints advisory diagnostics and leaves source files unchanged               |

Filesystem and configuration errors exit with code 1. Migration does not convert Tailwind plugins or rewrite configuration, and `--from tailwind` is an advisory label rather than a conversion engine. CLI linting currently uses default configuration; `--config` does not enable custom utility resolution for lint/migration reports.

## Prebuilt CSS

For a bundler application that does not need on-demand compilation:

```js
import "@suryanshp1/zencss/styles";
```

Or from a bundler-processed CSS file:

```css
@import "@suryanshp1/zencss/styles";
```

For plain HTML, copy `node_modules/@suryanshp1/zencss/dist/base.css` into your application's public assets and load it with a `<link>` element. Browsers cannot resolve npm package names in an unprocessed CSS `@import`.

The prebuilt stylesheet includes **212 curated classes**, all four themes, and the built-in recipes. It does not include every engine-supported candidate, every variant combination, custom recipes, or arbitrary values. Use the CLI or Vite plugin for those. Choose one stylesheet strategy to avoid loading duplicate framework layers.

## Themes and tokens

Set `data-zen-theme` on `<html>`:

| Theme    | Atmosphere                                              |
| -------- | ------------------------------------------------------- |
| `washi`  | Warm paper, neutral surfaces, a restrained green accent |
| `sumi`   | Deep ink surfaces and light text                        |
| `matcha` | Soft green surfaces and natural contrast                |
| `mono`   | Crisp neutral surfaces and monochrome accents           |

Theme selection changes CSS variables; the markup and utility names stay the same. A manual attribute takes precedence over system preferences. Without it, the default is Washi in light mode and Sumi when `prefers-color-scheme: dark` matches.

| Semantic utility | Token             |
| ---------------- | ----------------- |
| `bg-surface`     | `--zen-surface`   |
| `bg-panel`       | `--zen-panel`     |
| `bg-soft`        | `--zen-soft`      |
| `bg-accent`      | `--zen-accent`    |
| `text-primary`   | `--zen-text`      |
| `text-muted`     | `--zen-muted`     |
| `text-on-accent` | `--zen-on-accent` |
| `border-border`  | `--zen-border`    |
| `text-danger`    | `--zen-danger`    |

`text-ink` aliases primary text and `bg-matcha` aliases the accent role. Literal `white`, `black`, and `transparent` color utilities are also supported. Semantic roles are preferable for theme-aware interfaces.

Other customizable tokens include `--zen-space-unit` (default `0.25rem`), `--zen-radius-control`, `--zen-radius-card`, `--zen-space-section`, `--zen-font-sans`, `--zen-font-display`, `--zen-shadow-sm`, and `--zen-shadow-md`. Fonts use local system and Latin/CJK fallback stacks; the framework downloads no fonts.

## Utility reference

This table describes the **compiler**. The prebuilt stylesheet contains a curated subset.

| Category            | Supported examples                                                                                                                                             |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Display             | `block`, `inline`, `inline-block`, `flex`, `inline-flex`, `grid`, `hidden`                                                                                     |
| Flexbox             | `flex-col`, `flex-row`, `flex-wrap`, `flex-1`, `shrink-0`, `items-start`, `items-center`, `items-end`, `justify-center`, `justify-between`                     |
| Grid                | `grid-cols-1` through `grid-cols-12`                                                                                                                           |
| Spacing             | `p-6`, `px-4`, `py-2`, `mt-8`, `gap-3`, `gap-x-4`, `gap-y-6`                                                                                                   |
| Logical spacing     | `ps-4`, `pe-4`, `ms-4`, `me-4`                                                                                                                                 |
| Sizing              | `w-64`, `h-12`, `min-w-0`, `max-w-96`, `w-full`, `h-full`, `w-auto`, `min-h-screen`, `h-screen`, `w-1/2`                                                       |
| Position            | `relative`, `absolute`, `fixed`, `sticky`, `top-0`, `bottom-4`, `left-0`, `right-0`, `inset-0`, `z-10`                                                         |
| Type sizes          | `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl` through `text-6xl`                                                                         |
| Typography          | `font-sans`, `font-display`, `font-normal`, `font-medium`, `font-semibold`, `font-bold`, `leading-tight`, `leading-relaxed`, `tracking-tight`, `tracking-wide` |
| Text                | `text-left`, `text-center`, `text-right`, `uppercase`, `italic`, `underline`, `sr-only`                                                                        |
| Borders             | `border`, `border-0`, `border-b`, `border-border`                                                                                                              |
| Radius              | `rounded`, `rounded-none`, `rounded-lg`, `rounded-full`                                                                                                        |
| Effects             | `shadow-sm`, `shadow-md`, `shadow-none`, `opacity-0` through `opacity-100`, `transition-colors`                                                                |
| Overflow and cursor | `overflow-hidden`, `overflow-auto`, `cursor-pointer`                                                                                                           |
| Intent              | `layout-center`, `measure-prose`, `measure-heading`, `space-section`, `ring-focus`                                                                             |

Spacing and numeric sizing values use the theme unit: `p-6` emits `padding: calc(var(--zen-space-unit) * 6)`. Nonnegative integers and decimal values are supported. Negative margin classes such as `-mt-2` are supported; negative padding is rejected.

`px`/`mx` use logical inline properties and `py`/`my` use logical block properties. Physical left/right utilities are also available. `layout-center` constrains width to `min(100% - 2rem, 72rem)`, `measure-prose` to `65ch`, and `measure-heading` to `18ch`.

### Arbitrary values

Use square brackets for constrained custom values. Underscores become spaces:

```html
<div class="w-[320px] p-[1.25rem] rounded-[12px] bg-[#f7f5ef]">
  <p class="text-[#242824] leading-[1.6]">A precise detail.</p>
</div>
```

Examples also include `w-[calc(100%_-_2rem)]`, `opacity-[0.85]`, `tracking-[0.02em]`, and `z-[20]`. In this alpha, `text-[...]` sets **color**, not font size; use the named type scale for font sizes or define a custom utility.

The arbitrary-value parser rejects declaration delimiters, comments, URLs, backslashes, and executable expressions. This is a constrained syntax, not unrestricted CSS or arbitrary selector support. The parser protects the generated declaration boundary but does not validate every value against every browser property grammar.

## Responsive and state variants

Variants precede the utility and can be combined:

```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <button
    class="recipe-button hover:opacity-80 focus-visible:ring-focus"
    type="button"
  >
    Continue
  </button>
</div>
```

| Responsive variant | Minimum viewport width |
| ------------------ | ---------------------- |
| `sm:`              | `640px`                |
| `md:`              | `768px`                |
| `lg:`              | `1024px`               |
| `xl:`              | `1280px`               |
| `2xl:`             | `1536px`               |

State variants are `hover:`, `focus:`, `focus-visible:`, `active:`, `disabled:`, and `checked:`. `dark:` applies to explicit Sumi themes, and to system dark mode when no manual root theme is selected. `motion-reduce:` follows the reduced-motion media preference.

`container-sm:` uses a parent container query at `400px`. Establish an inline-size container with your own CSS or a custom utility:

```css
@zen-utility container-inline {
  container-type: inline-size;
}
```

```html
<div class="container-inline">
  <div class="grid container-sm:grid-cols-2 gap-4">Container-aware content</div>
</div>
```

## Component recipes

Recipes style ordinary HTML elements. They do not implement dialog focus management, menus, state machines, or other JavaScript interactions.

| Class                 | Use                                          |
| --------------------- | -------------------------------------------- |
| `recipe-button`       | Accent button                                |
| `recipe-button-quiet` | Quiet outlined alternative                   |
| `recipe-button-small` | Size modifier; combine with a button base    |
| `recipe-card`         | Theme-aware bordered panel                   |
| `recipe-card-compact` | Density modifier; combine with `recipe-card` |
| `recipe-input`        | Text input or textarea styling               |
| `recipe-badge`        | Small status label                           |

```html
<section class="recipe-card recipe-card-compact text-primary">
  <span class="recipe-badge">Draft</span>
  <h2 class="font-display text-2xl">Small steps. Clear direction.</h2>
  <label class="block text-sm mb-2" for="project-name">Project name</label>
  <input
    class="recipe-input"
    id="project-name"
    name="project"
    autocomplete="off"
  />
  <div class="flex gap-3 mt-4">
    <button class="recipe-button recipe-button-small" type="button">
      Save
    </button>
    <button class="recipe-button-quiet" type="button">Cancel</button>
  </div>
</section>
```

Use native `disabled`, `checked`, and form attributes as appropriate. Give buttons an explicit `type`, associate labels with inputs, and use meaningful link text. Built-in base styles include visible keyboard focus and disabled-button feedback.

## CSS-first configuration

Create a build-time configuration file:

```css
/* theme.css */
@zen-theme {
  --zen-accent: oklch(0.55 0.06 145);
  --zen-space-unit: 0.25rem;
  --zen-radius-card: 0.5rem;
}

@zen-utility content-auto {
  content-visibility: auto;
}

@zen-recipe note {
  base {
    padding: 1rem;
    border-radius: 0.5rem;
  }
  variant quiet {
    background: var(--zen-soft);
  }
}
```

Register it with the Vite plugin:

```js
zen({ configFile: "./theme.css" });
```

Or the CLI:

```sh
npx zen build ./src -o ./public/zen.css --config ./theme.css
```

`@zen-theme` defines global overrides applied across all four themes. It is not a per-theme selector authoring syntax. If you change an accent, also consider `--zen-on-accent` and test the resulting contrast.

`@zen-utility content-auto` defines a candidate named `content-auto`. `@zen-recipe note` defines `recipe-note` and `recipe-note-quiet`; the variant class includes the base declarations. Only requested custom classes are emitted. Custom directives are processed at build time and omitted from output. Do not import the unprocessed configuration file into a browser stylesheet.

The directive parser supports flat declaration blocks and the illustrated recipe structure. Nested CSS selectors and nested at-rules inside directives are not supported in the alpha.

## Scanning and safelists

The Vite plugin scans HTML, JSX, TSX, JavaScript, TypeScript, Vue, Svelte, and Astro files. Complete names are detected in `class`/`className` attributes and recognized quoted utility lists. Extraction is conservative; it is not an AST evaluation engine.

Configure explicit source roots and extra classes when needed:

```js
zen({
  include: ["./src", "./index.html"],
  safelist: ["bg-accent", "bg-soft", "text-on-accent"],
  configFile: "./theme.css",
});
```

`include` accepts existing files or directories, not glob expressions. During initial scanning the plugin skips `node_modules`, `.git`, `dist`, `coverage`, `output`, `packages`, `tests`, and `benchmarks`, plus files whose names contain `.config.`. Include paths select initial scan roots; they are not a strict development watcher exclusion policy. The CLI skips `node_modules`, `.git`, `dist`, and `output` while recursively scanning directories.

Write explicit alternatives instead of interpolated class names:

```js
const tones = {
  primary: "bg-accent text-on-accent",
  quiet: "bg-soft text-primary",
};
```

A string such as `bg-${color}` cannot reliably be discovered. Safelist its possible complete values with the Vite plugin or compiler API. The CLI currently has no safelist flag.

## Compiler API and plugins

Import the framework-independent compiler from the main package export:

```js
import {
  compile,
  explain,
  extractCandidates,
  lint,
  mergeClasses,
} from "@suryanshp1/zencss";

const result = compile('<div class="p-6 bg-surface"></div>', {
  theme: "washi",
  safelist: ["hover:bg-accent"],
});

console.log(result.css);
console.log(result.rules);
console.log(result.diagnostics);
```

CommonJS works too:

```js
const { compile } = require("@suryanshp1/zencss");
const result = compile(["bg-surface", "p-6"]);
```

| Export                                 | Purpose                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------ |
| `compile(sourceOrCandidates, options)` | Generate CSS, rules, diagnostics, and candidate names                          |
| `explain(classString, options)`        | Compile a space-separated list and return its declarations and conditions      |
| `extractCandidates(source)`            | Return unique, sorted static candidates                                        |
| `lint(source)`                         | Run the alpha's default advisory checks                                        |
| `mergeClasses(...strings)`             | Remove earlier repeated CSS property definitions within the same variant scope |
| `themes`, `themeNames`                 | Inspect the four built-in semantic palettes                                    |
| `recipes`                              | Inspect built-in recipe declarations                                           |
| `tokenCSS(theme, overrides)`           | Generate token CSS without compiling utility candidates                        |
| `processConfig(css)`                   | Parse custom theme, utility, and recipe directives                             |
| `escapeClass(candidate)`               | Escape a generated class selector                                              |

`CompileOptions` supports `theme`, `config` (CSS string), `safelist`, `plugins`, and `defaults`. `CompileResult` contains `css`, `rules`, `diagnostics`, and `candidates`. Each diagnostic has `code`, `candidate`, `message`, and `severity`. Each rule has `candidate`, `declarations`, `selector`, `conditions`, and `css`.

Set `defaults: false` to omit the reset, base layer, and built-in recipes. Tokens, utility rules, and the reduced-motion output remain. Custom configuration and plugins are still available.

Extend the registry with a plugin object:

```js
const projectPlugin = {
  utilities: {
    "content-auto": { "content-visibility": "auto" },
  },
  variants: {
    pressed: '&[aria-pressed="true"]',
  },
  tokens: {
    "radius-card": "0.5rem",
  },
};

const result = compile(["pressed:bg-accent", "content-auto"], {
  plugins: [projectPlugin],
});
```

Custom selector variants must include `&`, which is replaced with the utility selector. Later plugins override earlier utility, variant, and token definitions. CSS-first definitions override plugins. Plugin objects are trusted build-time configuration; keep untrusted source data out of them. Source markup is never executed by the compiler.

## Cascade and accessibility

Layer order is explicit:

```css
@layer zen-reset, zen-tokens, zen-base, zen-recipes, zen-utilities, zen-overrides;
```

Utilities override recipes. Rules are deterministic: base utilities come before conditional variants, with variant depth and stable class-name ordering resolving ties; explicit `leading-*` utilities follow type-size defaults. Breakpoint declarations with equal sort priority are not ordered by pixel width, so avoid competing declarations such as `sm:p-4 lg:p-8` for the same property in this alpha. Markup class order does not determine CSS precedence.

```js
mergeClasses("p-2 text-muted", "p-6");
// "text-muted p-6"
```

`mergeClasses` handles repeated resolved properties in matching variant scopes. It is not a full shorthand/longhand conflict solver, and it does not resolve custom plugin classes with project-specific options. Prefer noncontradictory classes or put application overrides in `zen-overrides`.

Default semantic text and button role contrast is covered by tests. Keyboard focus and reduced-motion base styles are included. These are foundations for accessible interfaces, not certification of your application. Custom colors, disabled controls, content, and interactions still need testing; complete WCAG and cross-browser audits remain release gates. With `defaults: false`, supply your own keyboard focus and control base styles.

## Troubleshooting

| Symptom                                                       | Check                                                                                                                                 |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| No styles appear                                              | Register `zen()` and import `virtual:zen.css` once; restart Vite after config changes                                                 |
| `virtual:zen.css` cannot be resolved                          | The ZenCSS Vite plugin must be present in that application's Vite configuration                                                       |
| TypeScript rejects the virtual import                         | Add the `@suryanshp1/zencss/client` type reference                                                                                    |
| An arbitrary or responsive class is missing from prebuilt CSS | Switch to the compiler/CLI/Vite plugin; prebuilt CSS is a subset                                                                      |
| Dynamic classes disappear in production                       | Use complete literal alternatives or a safelist                                                                                       |
| Theme changes do not work                                     | Set a supported `data-zen-theme` on the document root and use semantic colors                                                         |
| Custom directives appear in browser CSS                       | Pass the configuration file to `configFile` or `--config`; do not import it raw                                                       |
| A configuration path fails                                    | Vite `configFile` is relative to its project root; CLI paths are relative to the command's working directory                          |
| Unexpected padding or color wins                              | Check layer ordering and conflicting classes with `zen explain`                                                                       |
| Vite build has no class diagnostics                           | The Vite plugin emits CSS but does not currently surface all compiler diagnostics; run CLI lint or inspect `compile(...).diagnostics` |

Diagnostic codes:

- `ZC001`: unknown or malformed utility.
- `ZC002`: unsupported variant.
- `ZC102`: repeated arbitrary values; consider tokens.
- `ZC103`: interactive markup without detected recipe or focus-visible treatment.

ZenLint is advisory and heuristic. It currently checks class support, repeated arbitrary values, and basic focus-treatment presence. It does not perform complete color-contrast analysis, and finding a recipe somewhere in a file is not a per-control accessibility proof.

## Compatibility and roadmap

| Area                           | Current status                                               |
| ------------------------------ | ------------------------------------------------------------ |
| Package runtime                | Node.js 20.19+; ESM and CommonJS                             |
| Vite integration               | Vite 6/7 peer range; Vite 7 build and hot updates tested     |
| Source extraction              | HTML, JSX, TSX, JS, TS, Vue, Svelte, Astro                   |
| Styling runtime                | Native CSS; no framework styling JavaScript                  |
| Browser feature target         | Chrome 105+, Safari 16+, Firefox 110+                        |
| Browser certification          | Full supported-browser audit is pending                      |
| Stylesheet source maps         | Not implemented; JavaScript package source maps are included |
| Editor IntelliSense            | Planned                                                      |
| Complex interaction primitives | Planned; recipes are CSS only                                |
| Tailwind migration             | Advisory report only                                         |

The framework uses CSS variables, cascade layers, logical properties, and modern media/container queries. Defaults include Latin/CJK font fallbacks. Layout utilities favor logical properties where implemented; complete internationalization audits are pending.

There are no claims of outperforming Tailwind, UnoCSS, or Panda CSS. Repository benchmarks measure local compiler fixtures, not competitor comparisons. The public API is in alpha and may change before stable v1; pin a version when reproducible upgrades matter.

## Contributing and support

Report bugs and request features through [GitHub Issues](https://github.com/suryanshp1/zencss/issues). Include your installed version, Node/Vite versions, the class or configuration involved, expected CSS, actual CSS or diagnostic, and a minimal reproduction.

Development and verification commands are documented in the [repository README](https://github.com/suryanshp1/zencss#readme). The installed package also includes `docs/CONTRIBUTING.md`, `docs/SECURITY.md`, `docs/RELEASING.md`, and `CHANGELOG.md`.

Maintained by [suryanshp1](https://github.com/suryanshp1). Contributions are welcome; stability, clear semantics, and accessible defaults guide the alpha roadmap.

## License

MIT. See the included `LICENSE` file. The core compiler, themes, recipes, and essential developer integration are open source.
