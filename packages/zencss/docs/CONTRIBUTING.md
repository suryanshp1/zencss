# Contributing to ZenCSS

Source: https://github.com/suryanshp1/zencss
Issues: https://github.com/suryanshp1/zencss/issues

## Local setup

Repository development uses Node.js 22.18+ (or 24+) and npm; package consumers can use Node.js 20.19+.

```sh
git clone https://github.com/suryanshp1/zencss.git
cd zencss
npm install
npm run build:packages
npm run dev
```

The workspace app runs at http://localhost:5173. `npm run dev:react` starts the React starter on port 5174.

## Project areas

- `packages/core`: compiler, extraction, tokens, recipes, diagnostics.
- `packages/vite`: Vite virtual stylesheet and source cache.
- `packages/cli`: executable command source.
- `packages/zencss`: recommended all-in-one package manifest and consumer documentation.
- `src`: local documentation/playground app.
- `tooling`: build and packaging scripts.
- `tests`: compiler, integration, and independent installation checks.

## Before submitting a pull request

```sh
npm run format:check
npm test
npm run build
npm run build:react
npm run test:package
```

Native watcher/server tests require filesystem events and local server sockets. Package smoke tests install packed archives outside the repository, supplying the project's existing Vite peer for build verification. No npm account is needed for local packing or testing.

For changes to utility syntax or cascade behavior, add a regression test for observable output or diagnostics and update consumer examples. Keep source order deterministic. For theme changes, check semantic text/button contrast and all theme previews. Generated `dist/` files and archives are build outputs; edit their source instead.

Document what changed and the relevant validation. Use a minimal reproduction for bugs, and discuss major API additions in an issue before investing in a large implementation. Do not claim benchmark improvements without reproducible measurements.

Contributions are distributed under the repository's MIT license.
