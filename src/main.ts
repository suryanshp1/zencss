import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/dm-mono/400.css";
import "./style.css";
import {
  compile,
  explain,
  lint,
  themes,
  themeNames,
  type ThemeName,
} from "../packages/core/index.ts";
const icons: Record<string, string> = {
  leaf: '<path d="M19 3C9 3 3 8 5 15c1 4 7 5 10 2 4-4 4-9 4-14Z"/><path d="M4 21 15 10"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  book: '<path d="M12 5v16M12 5C8 2 4 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-3-1-6-2-10 1Z"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/>',
  palette: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/>',
  layers:
    '<path d="m12 3 10 6-10 6L2 9l10-6Zm-10 12 10 6 10-6M2 12l10 6 10-6"/>',
  sliders:
    '<path d="M4 21v-8m0-4V3m8 18V9m0-4V3m8 18v-4m0-4V3M1 9h6m2-4h6m2 12h6"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  search: '<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
  github:
    '<path d="M9 19c-4 1-4-2-6-2m12 5v-3.5c0-1-.1-1.4-.5-2 4-.5 7-2 7-6.5 0-2-1-3-2-4 .2-1 .2-2-.2-3-2-.4-3 1-4 1-2-.4-4-.4-6 0-1 0-2-1.4-4-1-.4 1-.4 2-.2 3-1 1-2 2-2 4 0 4.5 3 6 7 6.5-.4.6-.5 1-.5 2V22"/>',
  external: '<path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7"/>',
  copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  reset: '<path d="M3 10a9 9 0 1 1 2 8M3 3v7h7"/>',
  monitor:
    '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>',
  mobile:
    '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M3 16v5h18v-5"/>',
  spark: '<path d="m12 3 3 6 6 3-6 3-3 6-3-6-6-3 6-3Z"/>',
  terminal: '<path d="m4 7 5 5-5 5m8 0h8"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
  folder: '<path d="M3 7V4h7l2 3h9v13H3V7Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  heart: '<path d="M12 21 3 12C-2 5 7-1 12 6c5-7 14-1 9 6l-9 9Z"/>',
};
const icon = (name: string, cls = "") =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] ?? icons.grid}</svg>`;
const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const samples: Record<string, string> = {
  Starter: `<section class="p-6 bg-surface text-primary">
  <div class="recipe-card p-6 shadow-sm">
    <span class="recipe-badge">A little space to create</span>
    <h1 class="font-display text-4xl tracking-tight leading-tight">
      Make room for<br>\n      what matters.
    </h1>
    <p class="text-muted measure-prose leading-relaxed">
      Your next great idea starts with a little clarity.
      A thoughtful workspace, made for you.
    </p>
    <div class="flex items-center gap-3 mt-6">
      <button class="recipe-button hover:opacity-80">
        Start creating <span>↗</span>
      </button>
      <button class="recipe-button-quiet">
        Explore the space
      </button>
    </div>
    <div class="border-b mt-8 mb-6"></div>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="recipe-badge">YK</span>
        <span class="text-sm text-muted">Designed to feel natural.</span>
      </div>
      <span class="text-sm text-accent">禅</span>
    </div>
  </div>
</section>`,
  Card: `<section class="p-8 bg-surface text-primary">
  <article class="recipe-card shadow-sm">
    <span class="recipe-badge">In progress</span>
    <h2 class="font-display text-3xl">Small steps. Big ideas.</h2>
    <p class="text-muted leading-relaxed">A calm place to bring your next project to life.</p>
    <div class="flex justify-between items-center mt-8">
      <span class="text-sm text-muted">Updated just now</span>
      <button class="recipe-button recipe-button-small">Open project ↗</button>
    </div>
  </article>
</section>`,
  Button: `<section class="p-8 bg-surface text-primary">
  <div class="recipe-card">
    <span class="recipe-badge">Button recipes</span>
    <h2 class="font-display text-3xl">Thoughtful interactions.</h2>
    <p class="text-muted">One recipe. Just enough possibilities.</p>
    <div class="flex flex-wrap gap-3 mt-6">
      <button class="recipe-button hover:opacity-80">Get started ↗</button>
      <button class="recipe-button-quiet">Learn more</button>
      <button class="recipe-button" disabled>Disabled</button>
    </div>
    <div class="mt-6">
      <button class="recipe-button recipe-button-small">A smaller step</button>
    </div>
  </div>
</section>`,
  Form: `<section class="p-8 bg-surface text-primary">
  <form class="recipe-card">
    <span class="recipe-badge">Join the community</span>
    <h2 class="font-display text-3xl">Good things take root.</h2>
    <p class="text-muted">A little inspiration, delivered thoughtfully.</p>
    <label class="block text-sm font-medium mt-6 mb-2" for="name">Your name</label>
    <input class="recipe-input" id="name" placeholder="Yuki Tanaka" autocomplete="name">
    <label class="block text-sm font-medium mt-4 mb-2" for="email">Email address</label>
    <input class="recipe-input" id="email" type="email" placeholder="you@example.com" autocomplete="email">
    <button class="recipe-button w-full mt-6" type="button">Make yourself at home ↗</button>
  </form>
</section>`,
};
type Page =
  | "Playground"
  | "Overview"
  | "Getting started"
  | "Design philosophy"
  | "Themes"
  | "Components"
  | "Utilities"
  | "Documentation"
  | "Changelog";
let page: Page = "Playground",
  theme: ThemeName = "washi",
  sample = "Starter",
  code = samples.Starter,
  config =
    "@zen-theme {\n  --zen-radius-card: 0.75rem;\n  --zen-space-unit: 0.25rem;\n}",
  editorTab = "HTML",
  viewport = "desktop",
  outputTab = "Explain CSS";
try {
  const saved = JSON.parse(localStorage.getItem("zencss-workspace") ?? "null");
  if (saved) {
    if (themeNames.includes(saved.theme)) theme = saved.theme;
    if (typeof saved.code === "string") code = saved.code;
    if (typeof saved.config === "string") config = saved.config;
  }
  if (location.hash.startsWith("#share=")) {
    const shared = JSON.parse(
      decodeURIComponent(escapeUnicodeDecode(location.hash.slice(7))),
    );
    if (typeof shared.code === "string") code = shared.code;
    if (themeNames.includes(shared.theme)) theme = shared.theme;
    if (typeof shared.config === "string") config = shared.config;
  }
} catch {}
function escapeUnicodeDecode(s: string) {
  return atob(s);
}
function persist() {
  try {
    localStorage.setItem(
      "zencss-workspace",
      JSON.stringify({ theme, code, config }),
    );
  } catch {}
}
function clearShare() {
  if (location.hash.startsWith("#share="))
    history.replaceState(null, "", location.pathname + location.search);
}
function result() {
  return compile(code, { theme, config });
}
const navSections = [
  {
    title: "GETTING STARTED",
    items: [
      ["Overview", "grid"],
      ["Getting started", "terminal"],
      ["Design philosophy", "leaf"],
    ],
  },
  {
    title: "BUILD WITH ZEN",
    items: [
      ["Playground", "code"],
      ["Themes", "palette"],
      ["Components", "layers"],
      ["Utilities", "sliders"],
    ],
  },
  {
    title: "RESOURCES",
    items: [
      ["Documentation", "book"],
      ["Changelog", "clock"],
    ],
  },
];
function render() {
  document.querySelector("#app")!.innerHTML = `
<aside class="sidebar"><a class="brand" href="#" data-page="Overview"><span class="brand-mark">禅</span><span>zen<span class="brand-light">css</span><span class="version">v0.1</span></span></a>
<button class="search-trigger" data-action="search">${icon("search")}<span>Search anything...</span><kbd>⌘ K</kbd></button>
<nav aria-label="Main navigation">${navSections.map((section) => `<div class="nav-group"><p>${section.title}</p>${section.items.map(([label, ico]) => `<button class="nav-item ${page === label ? "active" : ""}" data-page="${label}" ${page === label ? 'aria-current="page"' : ""}>${icon(ico)}<span>${label}</span>${label === "Playground" ? '<span class="nav-dot"></span>' : ""}</button>`).join("")}</div>`).join("")}</nav>
<div class="sidebar-bottom"><div class="philosophy-mark"><span>間</span><div>A little less.<br>A little more intention.</div></div><div class="sidebar-foot"><span><i class="status-dot"></i> Open source. Always.</span><button data-action="about" aria-label="About the project">${icon("github")}</button></div></div></aside>
<div class="shell"><header class="topbar"><div class="breadcrumb"><button class="mobile-menu" data-action="menu" aria-label="Toggle navigation" aria-expanded="false">${icon("menu")}</button><span>Workspace</span>${icon("chevron")}<strong>${page}</strong></div><div class="top-actions"><span class="beta-label"><i></i> PUBLIC ALPHA</span><button class="top-link" data-page="Documentation">Documentation ${icon("external")}</button><button class="icon-button" data-action="about" aria-label="Project information">${icon("github")}</button></div></header>
<main>${page === "Playground" ? playground() : page === "Themes" ? themePage() : page === "Components" ? componentPage() : page === "Utilities" ? utilitiesPage() : articlePage()}</main><footer class="main-footer"><span>Made with intention. Built for the web.</span><span>簡素 <i>·</i> Simplicity is a practice.</span></footer></div><div class="toast" role="status" aria-live="polite"></div><dialog id="search-dialog"></dialog><dialog id="info-dialog"></dialog>`;
  bind();
  if (page === "Playground") updatePreview();
  if (page === "Themes" || page === "Components") updateGallery();
}
function pageHeader(
  eyebrow: string,
  title: string,
  description: string,
  aside = "",
) {
  return `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${description}</p></div>${aside}</div>`;
}
function playground() {
  const res = result();
  return `${pageHeader("DESIGN WITH INTENTION", 'The playground<span class="title-dot">.</span>', "A quiet space to experiment. Write a little code. Make something beautiful.", `<div class="heading-note">${icon("leaf")}<div>Less, but intentional.<span>Zero runtime. Endless possibility.</span></div></div>`)}
<div class="theme-toolbar"><div class="theme-label">${icon("palette")}<span>Find your atmosphere</span></div><div class="theme-options" role="group" aria-label="Preview theme">${themeNames.map((t) => `<button class="theme-option ${theme === t ? "selected" : ""}" data-theme="${t}" aria-pressed="${theme === t}"><i style="background:${themes[t].surface};border-color:${themes[t].border}"><b style="background:${themes[t].accent}"></b></i>${capitalize(t)}${theme === t ? icon("check") : ""}</button>`).join("")}</div><span class="theme-caption">Same code. A different feeling.</span></div>
<section class="playground" aria-label="Interactive playground"><div class="playground-toolbar"><div class="sample-tabs" role="group" aria-label="Example">${Object.keys(
    samples,
  )
    .map(
      (s) =>
        `<button data-sample="${s}" class="${sample === s ? "selected" : ""}">${s === "Starter" ? icon("spark") : ""}${s}</button>`,
    )
    .join(
      "",
    )}</div><div class="playground-actions"><button data-action="reset" title="Reset example" aria-label="Reset example">${icon("reset")}</button><div class="toolbar-divider"></div><button class="share-button" data-action="share">${icon("external")} Share</button></div></div>
<div class="editor-grid"><div class="preview-pane"><div class="pane-bar"><span><i class="status-dot"></i> LIVE PREVIEW</span><div class="viewport-buttons"><button data-viewport="desktop" class="${viewport === "desktop" ? "selected" : ""}" aria-label="Desktop preview" aria-pressed="${viewport === "desktop"}">${icon("monitor")}</button><button data-viewport="mobile" class="${viewport === "mobile" ? "selected" : ""}" aria-label="Mobile preview" aria-pressed="${viewport === "mobile"}">${icon("mobile")}</button></div></div><div class="preview-area" style="background:${themes[theme].surface}"><div class="preview-browser ${viewport === "mobile" ? "mobile" : ""}"><div class="browser-bar"><span class="browser-dots"><i></i><i></i><i></i></span><span>your-idea.zen</span>${icon("leaf")}</div><iframe title="Live ZenCSS preview" id="preview" sandbox="" referrerpolicy="no-referrer"></iframe></div><div class="preview-caption"><span class="caption-line"></span><span>Considered by default.</span><span class="caption-line"></span></div></div></div>
<div class="code-pane"><div class="code-bar"><div class="code-tabs">${["HTML", "CSS", "Config"].map((tab) => `<button data-editor="${tab}" class="${tab === editorTab ? "selected" : ""}">${tab}${tab === "HTML" ? "<i></i>" : ""}</button>`).join("")}</div><button data-action="copy-code" aria-label="Copy code">${icon("copy")}</button></div><div class="editor-body"><div class="line-numbers" aria-hidden="true"></div><div class="code-scroll"><pre id="highlight" aria-hidden="true"></pre><textarea id="code-editor" aria-label="${editorTab} editor" spellcheck="false" autocapitalize="off" ${editorTab === "CSS" ? "readonly" : ""}></textarea></div></div><div class="code-status"><span><i></i> ${editorTab === "CSS" ? "Generated at build time" : editorTab === "Config" ? "CSS-first configuration" : "HTML · ZenCSS"}</span><span id="editor-lines"></span></div></div></div>
<div class="compile-bar"><div><span class="compile-status"><i class="status-dot"></i><span id="compile-state">Compiled successfully</span></span><span class="compile-stat" id="rule-count">${res.rules.length} utilities</span><span class="compile-stat" id="css-size"></span></div><button data-action="export">${icon("download")} Export project ${icon("arrow")}</button></div></section>
<section class="below-grid"><div class="explain-panel"><div class="panel-heading"><div class="output-tabs">${["Explain CSS", "ZenLint"].map((t) => `<button data-output="${t}" class="${t === outputTab ? "selected" : ""}">${icon(t === "Explain CSS" ? "code" : "spark")}${t}${t === "ZenLint" ? '<span class="small-tag">ADVISORY</span>' : ""}</button>`).join("")}</div><span class="small-label">UNDERSTAND YOUR STYLES</span></div><div id="output-content"></div></div><div class="intent-card"><span class="intent-kanji">間</span><div class="eyebrow">THE ZEN WAY</div><h3>Good design starts<br>with a little space.</h3><p>Semantic tokens, harmonious defaults, and fewer decisions between you and your idea.</p><button data-page="Design philosophy">Explore the philosophy ${icon("arrow")}</button></div></section>`;
}
function highlight(text: string) {
  return text
    .split(
      /(<\/?[\w-]+|\bclass(?:Name)?=|"[^"]*"|<!--.*?-->|@[\w-]+|--zen-[\w-]+)/g,
    )
    .map((part) => {
      const cls = part.startsWith("<")
        ? "syntax-tag"
        : part.startsWith('"')
          ? "syntax-string"
          : part.startsWith("class")
            ? "syntax-attr"
            : part.startsWith("@") || part.startsWith("--")
              ? "syntax-attr"
              : "";
      return cls ? `<span class="${cls}">${escape(part)}</span>` : escape(part);
    })
    .join("");
}
function editorValue() {
  return editorTab === "HTML"
    ? code
    : editorTab === "Config"
      ? config
      : result().css;
}
function updateEditor() {
  const value = editorValue(),
    editor = document.querySelector<HTMLTextAreaElement>("#code-editor");
  if (!editor) return;
  editor.value = value;
  document.querySelector("#highlight")!.innerHTML = highlight(value);
  document.querySelector(".line-numbers")!.innerHTML = value
    .split("\n")
    .map((_, i) => `<span>${i + 1}</span>`)
    .join("");
  document.querySelector("#editor-lines")!.textContent =
    `${value.split("\n").length} lines`;
}
function previewDocument(markup: string, selected: ThemeName) {
  const compiled = compile(markup, { theme: selected, config });
  return `<!doctype html><html lang="en" data-zen-theme="${selected}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; form-action 'none'; base-uri 'none'"><style>${compiled.css.replace(/<\/style/gi, "")} html{background:var(--zen-surface)}body{color:var(--zen-text);font-family:system-ui,sans-serif;font-size:14px}h1,h2{margin:22px 0 16px;font-weight:400}p{margin:0}button{white-space:nowrap}section{min-height:100%;} @media(max-width:420px){section{padding:20px!important}.recipe-card{padding:24px}h1{font-size:32px!important}.flex{flex-wrap:wrap}}</style></head><body>${markup}</body></html>`;
}
function updatePreview() {
  const res = result();
  const frame = document.querySelector<HTMLIFrameElement>("#preview");
  if (frame) frame.srcdoc = previewDocument(code, theme);
  updateEditor();
  document.querySelector("#compile-state")!.textContent = res.diagnostics.length
    ? `${res.diagnostics.length} ${res.diagnostics.length === 1 ? "diagnostic" : "diagnostics"}`
    : "Compiled successfully";
  document.querySelector("#rule-count")!.textContent =
    `${res.rules.length} utilities`;
  document.querySelector("#css-size")!.textContent =
    `${(new Blob([res.css]).size / 1024).toFixed(1)} KB CSS`;
  updateOutput();
  persist();
}
function updateOutput() {
  const el = document.querySelector("#output-content");
  if (!el) return;
  if (outputTab === "ZenLint") {
    const diagnostics = lint(code);
    el.innerHTML = diagnostics.length
      ? `<div class="lint-list">${diagnostics.map((d) => `<div class="lint-item"><span class="diagnostic-code">${d.code}</span><div><strong>${escape(d.candidate)}</strong><p>${escape(d.message)}</p></div></div>`).join("")}</div>`
      : `<div class="lint-clean">${icon("check")}<div><strong>A little harmony, verified.</strong><p>No advisory issues found in this example.</p></div></div>`;
  } else {
    el.innerHTML = `<div class="explain-input"><span>${icon("terminal")}</span><input id="explain-input" aria-label="Classes to explain" value="bg-surface p-8 hover:opacity-80"><button data-action="explain" aria-label="Explain classes">${icon("arrow")}</button></div><div id="explanation"></div>`;
    showExplanation();
    el.querySelector('[data-action="explain"]')?.addEventListener(
      "click",
      showExplanation,
    );
    el.querySelector("input")?.addEventListener("input", showExplanation);
  }
}
function showExplanation() {
  const value =
    document.querySelector<HTMLInputElement>("#explain-input")?.value ?? "";
  const res = explain(value, { theme, config });
  document.querySelector("#explanation")!.innerHTML =
    res.rules
      .map(
        (r) =>
          `<div class="explain-row"><code>${escape(r.candidate)}</code><span>${escape(
            Object.entries(r.declarations)
              .map(([k, v]) => `${k}: ${v}`)
              .join("; "),
          )}${r.conditions.length ? ` <small>${escape(r.conditions.join(" "))}</small>` : ""}${r.selector.includes(":hover") ? " <small>:hover</small>" : ""}</span></div>`,
      )
      .join("") +
    res.diagnostics
      .map((d) => `<div class="explain-error">${escape(d.message)}</div>`)
      .join("");
}
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
function themePage() {
  return `${pageHeader("FOUR ATMOSPHERES. ONE LANGUAGE.", "Find your quiet.", "Same utilities. Same intention. Choose the atmosphere that feels like you.")}<div class="gallery theme-gallery">${themeNames
    .map(
      (t) =>
        `<article class="theme-card"><div class="theme-card-info"><div><h2>${capitalize(t)}</h2><p>${{ washi: "Warm paper. Thoughtful beginnings.", sumi: "Deep ink. A little more focus.", matcha: "Natural balance. Room to grow.", mono: "Pure function. Nothing extra." }[t]}</p></div><span class="theme-number">0${themeNames.indexOf(t) + 1}</span></div><iframe data-gallery-theme="${t}" title="${capitalize(t)} theme preview" sandbox=""></iframe><div class="theme-card-bottom"><div class="swatches">${Object.values(
          themes[t],
        )
          .slice(0, 6)
          .map((c) => `<i style="background:${c}" title="${c}"></i>`)
          .join(
            "",
          )}</div><button data-use-theme="${t}">Try ${capitalize(t)} ${icon("arrow")}</button></div></article>`,
    )
    .join(
      "",
    )}</div><div class="wide-note">${icon("info")}<p>Theme switching uses CSS variables. Your component markup stays exactly the same.</p><code>&lt;html data-zen-theme="${theme}"&gt;</code></div>`;
}
function componentPage() {
  return `${pageHeader("COMPOSE, DON’T COMPLICATE.", "Small pieces. Whole ideas.", "Accessible recipes that work in any framework. A considered starting point, yours to make your own.")}<div class="component-nav">${["All recipes", "Buttons", "Cards", "Forms", "Badges"].map((n, i) => `<button class="${i === 0 ? "selected" : ""}" data-filter="${n}">${n}</button>`).join("")}</div><div class="gallery component-gallery">${["Button", "Card", "Form", "Badge"].map((name) => `<article class="component-card" data-component="${name}"><div class="component-card-title"><h2>${name}</h2><span class="small-tag">CSS ONLY</span></div><iframe data-component-frame="${name}" title="${name} recipe preview" sandbox=""></iframe><div class="component-card-bottom"><code>recipe-${name === "Form" ? "input" : name.toLowerCase()}</code><button data-open-sample="${name === "Badge" ? "Card" : name}">Open in playground ${icon("arrow")}</button></div></article>`).join("")}</div>`;
}
function updateGallery() {
  document
    .querySelectorAll<HTMLIFrameElement>("[data-gallery-theme]")
    .forEach(
      (f) =>
        (f.srcdoc = previewDocument(
          samples.Card,
          f.dataset.galleryTheme as ThemeName,
        )),
    );
  document
    .querySelectorAll<HTMLIFrameElement>("[data-component-frame]")
    .forEach((f) => {
      const name = f.dataset.componentFrame!;
      f.srcdoc = previewDocument(
        name === "Badge"
          ? '<section class="p-8 bg-surface"><div class="recipe-card"><h2 class="font-display text-2xl text-primary">Small signals. Clear meaning.</h2><div class="flex gap-3 mt-6"><span class="recipe-badge">In progress</span><span class="recipe-badge">New idea</span><span class="recipe-badge">Published</span></div></div></section>'
          : samples[name],
        theme,
      );
    });
}
const utilityDocs = [
  ["Layout", "flex", "Flexible layout"],
  ["Layout", "grid", "CSS grid layout"],
  ["Layout", "grid-cols-3", "Three equal columns"],
  ["Layout", "layout-center", "Centered responsive container"],
  ["Layout", "measure-prose", "Comfortable 65ch reading width"],
  ["Spacing", "p-6", "Padding from the spacing scale"],
  ["Spacing", "px-8", "Logical horizontal padding"],
  ["Spacing", "gap-4", "Space between grid or flex items"],
  ["Spacing", "space-section", "Fluid editorial section spacing"],
  ["Color", "bg-surface", "Semantic page background"],
  ["Color", "bg-panel", "Elevated panel background"],
  ["Color", "text-primary", "Primary text color"],
  ["Color", "text-muted", "Subdued, theme-aware text"],
  ["Color", "bg-accent", "The theme accent color"],
  ["Typography", "font-display", "Expressive serif font stack"],
  ["Typography", "text-4xl", "Fluid headline type size"],
  ["Typography", "tracking-tight", "Tighter letter spacing"],
  ["Effects", "shadow-sm", "Subtle elevation"],
  ["Effects", "rounded-lg", "Theme card radius"],
  ["Effects", "focus-visible:ring-focus", "Accessible keyboard focus"],
  ["Variants", "md:grid-cols-3", "Responsive grid at 768px"],
  ["Variants", "hover:opacity-80", "Hover feedback"],
  ["Variants", "dark:bg-panel", "Sumi theme background"],
  ["Arbitrary", "w-[320px]", "Safely parsed custom width"],
];
function utilitiesPage() {
  return `${pageHeader("A FAMILIAR LANGUAGE. A THOUGHTFUL FOUNDATION.", "Utility, with meaning.", "Start with design intent. Reach for precise values when you need them.")}<div class="reference-toolbar"><div class="reference-search">${icon("search")}<input id="utility-search" placeholder="Find a utility…" aria-label="Search utilities"></div><span>${utilityDocs.length} foundational examples</span></div><div class="utility-table"><div class="utility-table-head"><span>UTILITY</span><span>INTENTION</span><span>GENERATED CSS</span></div>${utilityDocs
    .map(
      ([group, candidate, description]) =>
        `<div class="utility-row" data-utility="${candidate} ${description} ${group}"><div><code>${candidate}</code><span>${group}</span></div><p>${description}</p><code>${escape(
          Object.entries(explain(candidate).rules[0]?.declarations ?? {})
            .map(([k, v]) => `${k}: ${v};`)
            .join(" "),
        )}</code></div>`,
    )
    .join(
      "",
    )}<div id="utility-empty" hidden>No matching utilities. Try “spacing” or “text”.</div></div>`;
}
const docs: Record<
  string,
  { eyebrow: string; title: string; description: string; body: string }
> = {
  Overview: {
    eyebrow: "LESS, BUT INTENTIONAL.",
    title: "Less interface.<br>More meaning.",
    description:
      "A CSS-first framework for thoughtful digital products. Familiar utilities. A naturally coherent design language.",
    body: `<div class="overview-hero"><div class="enso"><span>禅</span></div><div class="overview-copy"><span class="eyebrow">A CALMER WAY TO BUILD</span><h2>Make something<br>that feels like you.</h2><p>Spend less time choosing spacing, colors, and shadows. Spend more time bringing your ideas to life.</p><button class="primary-button" data-page="Getting started">Start building ${icon("arrow")}</button><button class="quiet-button" data-page="Playground">Explore the playground</button></div></div><div class="feature-grid">${[
      [
        "leaf",
        "Coherent by default",
        "Four considered themes, semantic colors, and intentional typography.",
      ],
      [
        "code",
        "Familiar from the start",
        "Utility classes you already know, with a little more meaning.",
      ],
      [
        "spark",
        "Nothing at runtime",
        "Generated CSS, native variables, and no styling JavaScript.",
      ],
    ]
      .map(
        ([i, t, d]) => `<article>${icon(i)}<h3>${t}</h3><p>${d}</p></article>`,
      )
      .join("")}</div>`,
  },
  "Getting started": {
    eyebrow: "YOUR FIRST THOUGHTFUL INTERFACE",
    title: "A small beginning.",
    description:
      "From a blank page to a harmonious interface. One step at a time.",
    body: `<div class="article-layout"><article class="article"><div class="release-note">${icon("info")}Installable alpha · Use the packed archive below. Registry publication is a separate release step.</div><h2 id="install">01 / Install the framework</h2><p>Install the ZenCSS archive into your own project. It includes compiled JavaScript, type declarations, CSS themes, a Vite plugin, and a standalone CLI.</p>${codeBlock("# From the framework repository:\nnpm run pack:packages\n\n# From your own application:\nnpm install -D /path/to/zencss/artifacts/suryanshp1-zencss-0.1.1.tgz")}<h2 id="integrate">02 / Add the Vite integration</h2><p>Register the ZenCSS plugin, then import the virtual stylesheet from your app’s entry point. The plugin scans source files and updates your styles as you work.</p>${codeBlock("import { defineConfig } from 'vite';\nimport zen from '@suryanshp1/zencss/vite';\n\nexport default defineConfig({ plugins: [zen()] });\n\n// In your application entry:\nimport 'virtual:zen.css';")}<h2 id="create">03 / Write with intention</h2><p>Semantic utilities describe what your design needs. Recipes bring the small pieces together.</p>${codeBlock('<section class="bg-surface text-primary p-8">\n  <div class="recipe-card">\n    <h1 class="font-display text-4xl">Hello, clarity.</h1>\n    <p class="text-muted">Make room for your next idea.</p>\n    <button class="recipe-button">Get started</button>\n  </div>\n</section>')}<h2 id="theme">04 / Set the atmosphere</h2><p>Add a theme attribute to your document. Washi, Sumi, Matcha and Mono share the same semantic roles and utility syntax.</p>${codeBlock('<html data-zen-theme="washi">\n  <!-- Try sumi, matcha, or mono. -->\n</html>')}<button class="primary-button" data-page="Playground">Try it in the playground ${icon("arrow")}</button></article><aside class="toc"><p>ON THIS PAGE</p><a href="#install">Set up your workspace</a><a href="#integrate">Vite integration</a><a href="#create">Write with intention</a><a href="#theme">Set the atmosphere</a><div class="toc-note">${icon("leaf")} A little code.<br>A thoughtful result.</div></aside></div>`,
  },
  "Design philosophy": {
    eyebrow: "ROOTED IN RESTRAINT",
    title: "Less, but intentional.",
    description:
      "A design language inspired by Japanese principles. Contemporary, practical, and quietly expressive.",
    body: `<div class="principle-grid">${[
      [
        "間",
        "Ma",
        "Intentional space",
        "Space isn’t what remains after design. It is part of the design. Comfortable reading widths, clear groups, and deliberate rhythm make an interface easier to understand.",
      ],
      [
        "簡素",
        "Kanso",
        "Simplicity",
        "Remove what doesn’t serve a purpose. Let typography, hierarchy, and a small set of meaningful choices do the work.",
      ],
      [
        "渋い",
        "Shibui",
        "Understated beauty",
        "Choose subtle surfaces, restrained accents, and details that reward attention. Consistency is a kindness to the people using your product.",
      ],
    ]
      .map(
        ([k, t, s, p]) =>
          `<article class="principle"><span>${k}</span><div class="eyebrow">${t}</div><h2>${s}</h2><p>${p}</p></article>`,
      )
      .join(
        "",
      )}</div><div class="article philosophy-article"><h2>Calm doesn’t mean empty.</h2><p>ZenCSS is made for real products: dashboards, busy workspaces, forms, and tables. Use compact recipes when density matters. Accessible contrast and clear focus states come before aesthetic restraint.</p><h2>Meaning before measurements.</h2><p>Classes like <code>bg-surface</code>, <code>text-muted</code>, and <code>measure-prose</code> express intent. The theme handles the measurements, so your interface can adapt without rewriting its markup.</p><button class="primary-button" data-page="Themes">Explore the four themes ${icon("arrow")}</button></div>`,
  },
  Documentation: {
    eyebrow: "A LITTLE GUIDANCE GOES A LONG WAY",
    title: "The field guide.",
    description:
      "Everything you need to create, understand, and refine your interface.",
    body: `<div class="doc-grid">${[
      [
        "Getting started",
        "terminal",
        "Your first page, from installation to theme switching.",
      ],
      [
        "Utilities",
        "sliders",
        "Spacing, layout, type, colors, variants, and arbitrary values.",
      ],
      [
        "Themes",
        "palette",
        "Four atmospheres built on the same semantic tokens.",
      ],
      [
        "Components",
        "layers",
        "Framework-independent recipes for everyday interfaces.",
      ],
      ["Playground", "code", "Edit, preview, and understand generated styles."],
      ["Design philosophy", "leaf", "The principles behind every default."],
    ]
      .map(
        ([p, i, d]) =>
          `<button class="doc-card" data-page="${p}">${icon(i)}<h2>${p}</h2><p>${d}</p><span>Explore ${icon("arrow")}</span></button>`,
      )
      .join(
        "",
      )}</div><div class="article"><h2>Compiler grammar</h2><p>A candidate is a utility preceded by zero or more colon-separated variants, such as <code>md:hover:bg-accent</code>. Arbitrary values use brackets; underscores become spaces. Unsafe declarations, URLs, and injected CSS are rejected.</p><h2>CSS-first configuration</h2>${codeBlock("@zen-theme {\n  --zen-accent: oklch(0.55 0.06 145);\n}\n@zen-utility content-auto {\n  content-visibility: auto;\n}\n@zen-recipe note {\n  base { padding: 1rem; border-radius: 0.5rem; }\n  variant quiet { background: var(--zen-soft); }\n}")}<p>Recipes compile to <code>recipe-note</code> and <code>recipe-note-quiet</code>. Later plugins override earlier definitions. Utilities take precedence over recipes through CSS layers.</p><h2>Browser support</h2><p>The alpha targets modern browsers with cascade layers, logical properties, CSS variables, and container queries: Chrome 105+, Safari 16+, and Firefox 110+. This is the feature-based target; cross-browser release certification remains a beta gate.</p><h2>Static extraction</h2><p>Write complete class names in source. Dynamic expressions such as <code>bg-\$&#123;color&#125;</code> cannot be discovered reliably. Enumerate possible values or use the compiler safelist.</p><h2>Escape hatch</h2><p>Set <code>defaults: false</code> to remove reset, base styles, and built-in recipes. Foundational utilities and configurable tokens remain available.</p></div>`,
  },
  Changelog: {
    eyebrow: "SMALL STEPS FORWARD",
    title: "Growing with intention.",
    description:
      "A transparent record of what’s new, what’s changed, and what comes next.",
    body: `<div class="changelog"><div class="changelog-date"><span class="recipe-label">v0.1.0</span><p>12 October 2026</p><span class="small-tag">LOCAL ALPHA</span></div><article class="article"><h2>A thoughtful foundation.</h2><p>The first working ZenCSS workspace, from compiler to live playground.</p><ul><li>Deterministic, on-demand utility compilation.</li><li>Four semantic themes: Washi, Sumi, Matcha, and Mono.</li><li>Button, Card, Input, and Badge recipes.</li><li>CSS-first theme, utility, and recipe directives.</li><li>Responsive, state, dark theme, and container variants.</li><li>Live playground, generated CSS, and Explain CSS.</li><li>CLI build, watch, explain, lint, and migration reports.</li><li>Vite integration with incremental development updates.</li></ul><h3>Next, with care.</h3><p>Broader utility coverage, editor IntelliSense, full source maps, cross-browser certification, and interaction primitives are planned after core stability.</p></article></div>`,
  },
};
function codeBlock(s: string) {
  return `<div class="article-code"><pre><code>${highlight(s)}</code></pre><button data-copy="${escape(s)}" aria-label="Copy snippet">${icon("copy")}</button></div>`;
}
function articlePage() {
  const content = docs[page] ?? docs.Overview;
  return `${pageHeader(content.eyebrow, content.title, content.description)}${content.body}`;
}
function bind() {
  document.querySelectorAll<HTMLElement>("[data-page]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      page = el.dataset.page as Page;
      render();
      window.scrollTo(0, 0);
    }),
  );
  document.querySelectorAll<HTMLElement>("[data-theme]").forEach((el) =>
    el.addEventListener("click", () => {
      clearShare();
      theme = el.dataset.theme as ThemeName;
      persist();
      render();
    }),
  );
  document.querySelectorAll<HTMLElement>("[data-use-theme]").forEach((el) =>
    el.addEventListener("click", () => {
      theme = el.dataset.useTheme as ThemeName;
      page = "Playground";
      render();
    }),
  );
  document
    .querySelectorAll<HTMLElement>("[data-sample],[data-open-sample]")
    .forEach((el) =>
      el.addEventListener("click", () => {
        clearShare();
        sample = el.dataset.sample ?? el.dataset.openSample!;
        code = samples[sample];
        editorTab = "HTML";
        page = "Playground";
        render();
      }),
    );
  document.querySelectorAll<HTMLElement>("[data-editor]").forEach((el) =>
    el.addEventListener("click", () => {
      editorTab = el.dataset.editor!;
      render();
    }),
  );
  document.querySelectorAll<HTMLElement>("[data-output]").forEach((el) =>
    el.addEventListener("click", () => {
      outputTab = el.dataset.output!;
      render();
    }),
  );
  document.querySelectorAll<HTMLElement>("[data-viewport]").forEach((el) =>
    el.addEventListener("click", () => {
      viewport = el.dataset.viewport!;
      render();
    }),
  );
  document
    .querySelectorAll<HTMLElement>("[data-action]")
    .forEach((el) =>
      el.addEventListener("click", () => action(el.dataset.action!)),
    );
  document
    .querySelectorAll<HTMLElement>("[data-copy]")
    .forEach((el) =>
      el.addEventListener("click", () => copy(el.dataset.copy!)),
    );
  let timer: ReturnType<typeof setTimeout>;
  const editor = document.querySelector<HTMLTextAreaElement>("#code-editor");
  editor?.addEventListener("input", () => {
    clearShare();
    if (editorTab === "HTML") code = editor.value;
    else if (editorTab === "Config") config = editor.value;
    document.querySelector("#highlight")!.innerHTML = highlight(editor.value);
    document.querySelector(".line-numbers")!.innerHTML = editor.value
      .split("\n")
      .map((_, i) => `<span>${i + 1}</span>`)
      .join("");
    clearTimeout(timer);
    timer = setTimeout(() => {
      const pos = editor.selectionStart;
      updatePreview();
      editor.setSelectionRange(pos, pos);
    }, 200);
  });
  editor?.addEventListener("scroll", () => {
    const pre = document.querySelector<HTMLPreElement>("#highlight")!;
    pre.scrollTop = editor.scrollTop;
    pre.scrollLeft = editor.scrollLeft;
    document.querySelector(".line-numbers")!.scrollTop = editor.scrollTop;
  });
  editor?.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = editor.selectionStart,
        end = editor.selectionEnd;
      editor.setRangeText("  ", start, end, "end");
      editor.dispatchEvent(new Event("input"));
    }
  });
  document
    .querySelector<HTMLInputElement>("#utility-search")
    ?.addEventListener("input", (e) => {
      const value = (e.target as HTMLInputElement).value.toLowerCase();
      let count = 0;
      document
        .querySelectorAll<HTMLElement>("[data-utility]")
        .forEach((row) => {
          row.hidden = !row.dataset.utility!.toLowerCase().includes(value);
          if (!row.hidden) count++;
        });
      document.querySelector<HTMLElement>("#utility-empty")!.hidden = !!count;
    });
  document.querySelectorAll<HTMLElement>("[data-filter]").forEach((el) =>
    el.addEventListener("click", () => {
      document
        .querySelectorAll("[data-filter]")
        .forEach((b) => b.classList.remove("selected"));
      el.classList.add("selected");
      const filter = el.dataset.filter!;
      document
        .querySelectorAll<HTMLElement>("[data-component]")
        .forEach(
          (card) =>
            (card.hidden =
              filter !== "All recipes" &&
              !filter
                .toLowerCase()
                .startsWith(card.dataset.component!.toLowerCase())),
        );
    }),
  );
}
async function copy(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast("Copied to clipboard.");
  } catch {
    toast("Clipboard unavailable. Use Export to save your code.");
  }
}
let toastTimer: ReturnType<typeof setTimeout>;
function toast(message: string) {
  const el = document.querySelector(".toast")!;
  el.textContent = message;
  el.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("visible"), 3000);
}
function download(filename: string, data: string, type = "text/html") {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function action(name: string) {
  if (name === "reset") {
    clearShare();
    code = samples[sample];
    config =
      "@zen-theme {\n  --zen-radius-card: 0.75rem;\n  --zen-space-unit: 0.25rem;\n}";
    render();
    toast("A fresh beginning. Example reset.");
  }
  if (name === "copy-code") void copy(editorValue());
  if (name === "export") {
    download("zen-project.html", previewDocument(code, theme));
    toast("Your self-contained project has been exported.");
  }
  if (name === "share") {
    const payload = btoa(
      encodeURIComponent(JSON.stringify({ code, theme, config })),
    );
    const url = new URL(location.href);
    url.hash = `share=${payload}`;
    history.replaceState(null, "", url);
    void copy(url.toString());
  }
  if (name === "search") openSearch();
  if (name === "menu") {
    const open = document
      .querySelector(".sidebar")
      ?.classList.toggle("mobile-open");
    document
      .querySelector('[data-action="menu"]')
      ?.setAttribute("aria-expanded", String(open));
  }
  if (name === "about") {
    const dialog = document.querySelector<HTMLDialogElement>("#info-dialog")!;
    dialog.innerHTML = `<div class="modal-heading"><span class="brand-mark">禅</span><button class="icon-button" data-close aria-label="Close">${icon("close")}</button></div><h2>Open source. With intention.</h2><p>ZenCSS is a local alpha framework and playground based on the product requirements in this repository.</p><p>The working name and npm scope are not reserved. This workspace is ready to explore and build locally.</p><button class="primary-button" data-about-docs>Read the field guide ${icon("arrow")}</button>`;
    dialog.showModal();
    dialog
      .querySelector("[data-close]")!
      .addEventListener("click", () => dialog.close());
    dialog.querySelector("[data-about-docs]")!.addEventListener("click", () => {
      dialog.close();
      page = "Documentation";
      render();
    });
  }
}
function openSearch() {
  const dialog = document.querySelector<HTMLDialogElement>("#search-dialog")!;
  dialog.innerHTML = `<div class="search-modal-input">${icon("search")}<input placeholder="What would you like to explore?" aria-label="Search documentation" autofocus><button class="icon-button" data-close aria-label="Close search">${icon("close")}</button></div><div id="search-results"></div><div class="search-modal-footer">Find your next step.<kbd>ESC to close</kbd></div>`;
  dialog.showModal();
  dialog
    .querySelector("[data-close]")!
    .addEventListener("click", () => dialog.close());
  const input = dialog.querySelector("input")!;
  const search = () => {
    const q = input.value.toLowerCase();
    const entries = [
      ...Object.keys(docs),
      "Themes",
      "Components",
      "Utilities",
      "Playground",
    ]
      .filter((v, i, a) => a.indexOf(v) === i)
      .filter((p) =>
        `${p} ${docs[p]?.description ?? ""}`.toLowerCase().includes(q),
      );
    dialog.querySelector("#search-results")!.innerHTML = entries.length
      ? entries
          .map(
            (p) =>
              `<button class="search-result" data-result="${p}">${icon("book")}<div><strong>${p}</strong><span>${docs[p]?.description ?? { Themes: "Choose Washi, Sumi, Matcha, or Mono.", Components: "Explore accessible CSS recipes.", Utilities: "Find foundational utility classes.", Playground: "Experiment in the live editor." }[p]}</span></div>${icon("arrow")}</button>`,
          )
          .join("")
      : `<div class="search-empty">No results for “${escape(input.value)}”. Try “theme” or “utility”.</div>`;
    dialog.querySelectorAll<HTMLElement>("[data-result]").forEach((el) =>
      el.addEventListener("click", () => {
        dialog.close();
        page = el.dataset.result as Page;
        render();
      }),
    );
  };
  input.addEventListener("input", search);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter")
      dialog.querySelector<HTMLButtonElement>("[data-result]")?.click();
  });
  search();
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelector(".sidebar")?.classList.remove("mobile-open");
    document
      .querySelector('[data-action="menu"]')
      ?.setAttribute("aria-expanded", "false");
  }
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    openSearch();
  }
});
render();
