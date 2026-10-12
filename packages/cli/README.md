# @zencss/cli

Compiled, standalone ZenCSS command-line tool. No TypeScript runtime is required.

```sh
npx zen build ./src -o ./public/zen.css
npx zen watch ./src -o ./public/zen.css
npx zen explain "bg-surface p-6 hover:bg-accent"
npx zen lint ./src
npx zen migrate ./src --from tailwind
```

Use `--config theme.css` for CSS-first configuration. Migration reports compatibility without rewriting files. The same `zen` executable is included in the single `@suryanshp1/zencss` package. Working package names are not published or reserved. MIT.
