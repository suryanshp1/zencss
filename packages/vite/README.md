# @zencss/vite

On-demand ZenCSS utility compilation and hot updates for Vite 6 and 7.

```js
import { defineConfig } from "vite";
import zen from "@zencss/vite";
export default defineConfig({ plugins: [zen()] });
```

Import `virtual:zen.css` from your app entry. Add `/// <reference types="@zencss/vite/client" />` for TypeScript. `zen({ configFile: './theme.css' })` enables CSS-first theme, utility and recipe directives.

For a single install including the compiler and CLI, use `@suryanshp1/zencss` and import `zen` from `@suryanshp1/zencss/vite`. These packages are installable local alpha archives, not published registry releases.

MIT.
