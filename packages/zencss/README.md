# ZenCSS

A CSS-first utility framework. Familiar classes, semantic design tokens, four coherent themes, and accessible CSS recipes. Styling is compiled to native CSS with no client-side styling runtime.

This package is an installable alpha. The npm package name is `@suryanshp1/zencss`. Use the local archive until its registry release is published.

## Install the alpha

From the framework repository:

```sh
npm install
npm run pack:packages
```

From your existing application:

```sh
npm install -D /absolute/path/to/zencss/artifacts/suryanshp1-zencss-0.1.0.tgz
```

Node.js 20.19+ is supported by the compiled package. TypeScript is optional. React, Vue, Svelte, Astro, and vanilla HTML can all use the generated CSS.

## Vite: generate only the classes you use

```js
// vite.config.js
import { defineConfig } from "vite";
import zen from "@suryanshp1/zencss/vite";

export default defineConfig({
  plugins: [zen()],
});
```

Import the virtual stylesheet from your application entry:

```js
import "virtual:zen.css";
```

For TypeScript, add `/// <reference types="@suryanshp1/zencss/client" />` to `src/vite-env.d.ts`.

Write complete utility names in your source:

```html
<html data-zen-theme="washi">
  <body class="bg-surface text-primary">
    <main class="layout-center space-section">
      <section class="recipe-card p-6">
        <h1 class="font-display text-4xl leading-tight">Hello, clarity.</h1>
        <p class="text-muted">Make room for your next idea.</p>
        <button class="recipe-button mt-6 hover:opacity-80">Get started</button>
      </section>
    </main>
  </body>
</html>
```

Change `data-zen-theme` to `sumi`, `matcha`, or `mono` without changing classes. System dark preference applies when there is no manual theme selection.

## CSS-first configuration

```css
/* theme.css */
@zen-theme {
  --zen-accent: oklch(0.55 0.06 145);
  --zen-space-unit: 0.25rem;
}
@zen-utility content-auto {
  content-visibility: auto;
}
@zen-recipe note {
  base {
    padding: 1rem;
  }
  variant quiet {
    background: var(--zen-soft);
  }
}
```

Pass `zen({ configFile: './theme.css' })` in Vite. The CLI accepts `--config theme.css`. Custom directives are compiled at build time; do not import an unprocessed configuration stylesheet directly into your browser. Classes for the custom recipe are `recipe-note` and `recipe-note-quiet`.

Use `zen({ include: ['./src', './index.html'], safelist: ['bg-accent'] })` to select scan roots and explicit additional classes. Enumerate dynamic class names instead of constructing strings such as `bg-${color}`.

## Use without Vite

```sh
npx zen build ./src -o ./public/zen.css --config theme.css
npx zen watch ./src -o ./public/zen.css
npx zen explain "bg-surface p-6 hover:bg-accent"
npx zen lint ./src
```

Load the generated file with `<link rel="stylesheet" href="/zen.css">`.

For a prebuilt stylesheet without a build plugin:

```css
@import "@suryanshp1/zencss/styles";
```

Or import `@suryanshp1/zencss/styles` from a bundler's JavaScript entry. This contains 212 curated classes, themes and recipes; arbitrary utilities need the compiler, CLI or Vite plugin. The distributed file is `node_modules/@suryanshp1/zencss/dist/base.css` and can also be copied into a plain HTML project.

## Compiler API

ESM and CommonJS both work, with TypeScript declarations included:

```js
import { compile, explain, mergeClasses } from "@suryanshp1/zencss";
const { css, diagnostics } = compile('<div class="p-6 bg-surface"></div>');
```

```js
const { compile } = require("@suryanshp1/zencss");
```

Responsive variants: `sm`, `md`, `lg`, `xl`, `2xl`. State variants: `hover`, `focus`, `focus-visible`, `active`, `disabled`, `checked`. Other variants: `dark`, `motion-reduce`, `container-sm`. Arbitrary values use brackets, e.g. `w-[320px]`; underscores represent spaces. Unsafe arbitrary CSS values are rejected.

Built-in recipes: `recipe-button`, `recipe-button-quiet`, `recipe-button-small`, `recipe-card`, `recipe-card-compact`, `recipe-input`, `recipe-badge`. Combine size and density modifiers with the base recipe.

Layers: reset → tokens → base → recipes → utilities → overrides. Utilities override recipes. Avoid conflicting utilities; source order does not determine CSS precedence. `mergeClasses()` resolves repeated CSS properties within the same variant scope; it is not a complete shorthand conflict solver.

`compile(source, { defaults: false })` removes built-in reset, base styles, and recipes. Plugins may add utilities, selector variants and tokens. Later plugin definitions win; CSS-first definitions override plugins. Configuration plugins are trusted local build code. Scanned markup is never executed.

## Alpha boundary

This is an independent utility engine with familiar syntax, not a drop-in replacement for all Tailwind utilities or plugins. Editor IntelliSense, comprehensive migration, full compiler source maps, and production browser/accessibility certification remain future work. Feature target: Chrome 105+, Safari 16+, Firefox 110+.

MIT license.
