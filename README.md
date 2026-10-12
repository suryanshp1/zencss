# ZenCSS

Less, but intentional. A CSS-first utility framework for thoughtful interfaces.

[Consumer documentation](./packages/zencss/README.md) · [GitHub](https://github.com/suryanshp1/zencss) · [Issues](https://github.com/suryanshp1/zencss/issues) · [Changelog](./packages/zencss/CHANGELOG.md)

The recommended npm package is **@suryanshp1/zencss**. For the registry release, install it with `npm install -D @suryanshp1/zencss`; before publication, use the packed archive below. Consumer documentation includes Vite/React/Vue/Svelte/Astro examples, vanilla HTML, tokens, utilities, recipes, custom configuration, CLI/API usage, diagnostics, and compatibility limits.

## Install the framework in your own app

ZenCSS is now distributed as compiled packages, separate from the documentation/playground app. The recommended single package contains the compiler, CLI, Vite integration, themes, recipes, and a standalone stylesheet.

Build the installable archives from this repository:

```sh
npm install
npm run pack:packages
```

Then install the archive in any independent project:

```sh
npm install -D /absolute/path/to/zencss/artifacts/suryanshp1-zencss-0.1.1.tgz
```

Configure Vite:

```js
import { defineConfig } from "vite";
import zen from "@suryanshp1/zencss/vite";

export default defineConfig({ plugins: [zen()] });
```

Import `virtual:zen.css` in your application entry, then write classes such as `bg-surface p-6 md:flex recipe-card` in HTML or any framework's markup. Vite emits only the used utilities and updates styles as source files change. Set `<html data-zen-theme="washi">` (or `sumi`, `matcha`, `mono`). See the [package guide](./packages/zencss/README.md) for the complete consumer setup.

Without Vite:

```sh
npx zen build ./src -o ./public/zen.css
npx zen watch ./src -o ./public/zen.css
npx zen explain "bg-surface p-6 hover:bg-accent"
```

For a prebuilt stylesheet, import `@suryanshp1/zencss/styles` from your CSS or JS bundler entry. It contains 212 curated classes; use the CLI or Vite plugin for on-demand or arbitrary utilities. For TypeScript Vite apps, add `/// <reference types="@suryanshp1/zencss/client" />` to your environment declarations.

Consumers require Node.js 20.19+, but do not need a TypeScript runtime. Compiled ESM, CommonJS, declarations, source maps, CSS, executable CLI, and licenses are included. The single package has no dependency on unpublished workspace packages. Archives are written to `artifacts/`; scoped core, Vite and CLI archives are also provided.

The recommended package is @suryanshp1/zencss. The optional @zencss/* split packages are local working names; the all-in-one package is self-contained. See the [release guide](./packages/zencss/docs/RELEASING.md) for first publication and subsequent versions.

## Run the documentation and playground

Repository development uses Node.js 22.18+ (or 24+) for built-in TypeScript stripping.

```sh
npm install
npm run dev
```

Open http://localhost:5173. `npm run build` builds both the framework packages and the static docs/playground app. `npm run preview` serves the production app.

The workspace includes a sandboxed live HTML editor, four theme previews, generated CSS, CSS-first configuration, Explain CSS, advisory ZenLint, a recipe gallery, searchable documentation, utility reference, persistent drafts, URL-fragment sharing, and self-contained HTML export. Sharing embeds the project in the URL fragment and does not upload it to a server.

The React starter imports the package's compiled exports: `npm run build:packages` then `npm run dev:react` (port 5174), or `npm run build:react`. Generate standalone CSS with `npm run build:css`.

## Packages

- `@suryanshp1/zencss`: recommended all-in-one framework package.
- `@zencss/core`: framework-independent TypeScript compiler, scanner, tokens, recipes, plugin API, diagnostics, and class conflict helper.
- `@zencss/vite`: `virtual:zen.css` integration with per-file candidate caching and development updates.
- `@zencss/cli`: local build/watch/explain/lint/migration-report entry point.

All package exports point to compiled distribution files. `npm run pack:packages` verifies entry points and includes only distribution files, package documentation, license, and the packaging guard. No consumer imports sibling source directories.

```ts
import { compile, explain, mergeClasses } from "@suryanshp1/zencss";

const { css, diagnostics } = compile(
  '<div class="recipe-card p-6 bg-surface"></div>',
);
const result = explain("bg-surface p-6 md:hover:bg-accent");
const className = mergeClasses("p-2 text-muted", "p-6");
```

### Vite integration

```ts
import { defineConfig } from "vite";
import zen from "@suryanshp1/zencss/vite";

export default defineConfig({
  plugins: [zen({ configFile: "./theme.css" })],
});
```

Import `virtual:zen.css` from the app entry. Default scanning includes HTML, JSX, TSX, JS, TS, Vue, Svelte, and Astro. Dependencies, generated output, framework packages, test files, and benchmarks are excluded. Complete class names in attributes and utility lists are extracted; dynamically constructed class names must be enumerated or safelisted. This scanner is intentionally conservative, not a full language parser.

### CLI

```sh
npm run zen -- build examples/vanilla -o examples/vanilla/zen.css
npm run zen -- watch examples/vanilla -o examples/vanilla/zen.css
npm run zen -- explain "bg-surface p-6 hover:bg-accent"
npm run zen -- lint examples/vanilla
npm run zen -- migrate examples/vanilla --from tailwind
```

Migration is a read-only compatibility report, not a source rewrite.

### CSS-first configuration

```css
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
    border-radius: 0.5rem;
  }
  variant quiet {
    background: var(--zen-soft);
  }
}
```

Custom directives are processed at build time and are not emitted into production CSS. Recipe classes are `recipe-note` and `recipe-note-quiet`. Variants inherit base declarations. Built-in modifiers include `recipe-button-small`, `recipe-button-quiet`, and `recipe-card-compact`; combine size and density modifiers with the base class.

Set `<html data-zen-theme="washi">` (or `sumi`, `matcha`, `mono`). Without a manual selection, system dark preference uses Sumi. Configured tokens apply across all themes. Custom values must have appropriate contrast; use semantic defaults when unsure.

### Cascade and conflicts

Layers: `zen-reset`, `zen-tokens`, `zen-base`, `zen-recipes`, `zen-utilities`, `zen-overrides`. Recipes precede atomic utilities. Within utilities, base classes precede state variants and responsive variants. Explicit line-height utilities override type-size line heights. Ties are sorted lexically. Markup order does not change CSS precedence. Avoid contradictory utility classes; `mergeClasses()` removes earlier definitions of the same properties and variant scopes. It is not a complete shorthand/longhand conflict solver.

Plugins add `utilities`, selector `variants` (using `&`), and `tokens`. Later plugin definitions override earlier definitions. CSS-first definitions override plugins. Plugin configuration is trusted build-time code; extracted markup is never evaluated. Arbitrary values reject declaration delimiters, URLs, comments, and executable expressions.

Set `defaults: false` to disable reset, base rules, and built-in recipes while retaining foundational utilities and tokens.

## Verification

```sh
npm test
npm run build
npm run benchmark
npm run test:package
```

Package smoke tests install tarballs outside the repository and verify ESM/CommonJS imports, TypeScript declarations, CLI executables, on-demand Vite builds, and standalone CSS imports. Native watcher/server tests need an environment that permits filesystem events and local server sockets.

Compiler tests cover extraction, reproducibility, theme switching, variant composition, arbitrary-value security, configuration, plugin precedence, recipes, explanations, and advisory linting. The benchmark prints environment metadata, cold/full-repeat timings, CSS/gzip sizes, and RSS for three fixtures. It is a local compiler benchmark, not a comparison with Tailwind and not a warm incremental-cache claim.

## MVP boundary

This is a functional alpha, not the PRD's stable release. Implemented: core compiler, CSS-first configuration, four themes, foundational variants, four recipes, CLI, Vite integration, docs/playground, vanilla and runnable Vite React starters, regression tests, and reproducible local benchmarks. Planned: broad Tailwind compatibility, editor IntelliSense, source maps, PostCSS integration, complete headless primitives, production competitor benchmarks, and certified browser/accessibility audits. ZenLint currently detects unknown classes, repeated arbitrary values, and missing recipe/focus treatment; comprehensive resolved-color contrast analysis is not implemented.

Feature-based browser target: Chrome 105+, Safari 16+, Firefox 110+. Chromium workspace flows were manually verified; the full browser compatibility matrix remains a release gate.

## License

MIT. See LICENSE.

## Contributing, support, and security

See [CONTRIBUTING](./packages/zencss/docs/CONTRIBUTING.md) for development and validation, and [SECURITY](./packages/zencss/docs/SECURITY.md) for private disclosure guidance. Report ordinary bugs and feature requests through [GitHub Issues](https://github.com/suryanshp1/zencss/issues).

## CI and npm releases

[Verify ZenCSS](./.github/workflows/ci.yml) checks Linux/macOS on Node 22.18 and 24, formatting, builds, compiler/documentation/native watch tests, and installed npm archives. It saves package archives and benchmark results as GitHub Actions artifacts, then verifies compiled ESM/CommonJS imports and CLI execution on the minimum supported Node 20.19 consumer runtime.

[Publish ZenCSS to npm](./.github/workflows/npm-publish.yml) is manually triggered from the default branch. It runs verification before publishing the committed scoped package version through npm OIDC trusted publishing. Configure the npm trusted publisher and GitHub `npm` environment using the [release setup guide](./packages/zencss/docs/RELEASING.md#github-actions-ci-and-publishing). No npm token secret is required. Local checks do not dispatch a GitHub workflow or publish a package.
