# @zencss/core

The ZenCSS utility compiler, scanner, tokens, themes, recipes and diagnostics. Compiled ESM/CommonJS JavaScript and TypeScript declarations are included. No TypeScript runtime is required.

```js
import { compile, explain, mergeClasses } from "@zencss/core";
const { css, diagnostics } = compile('<div class="p-6 bg-surface"></div>');
```

Import `@zencss/core/styles` for the prebuilt curated stylesheet. For the simplest install including CLI and Vite integration, use the single `@suryanshp1/zencss` package. Build local archives with `npm run pack:packages` from the repository root. These working package names are not published or reserved.

MIT.
