const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();

const read = (relPath) => fs.readFileSync(path.join(root, relPath), "utf8");
const exists = (relPath) => fs.existsSync(path.join(root, relPath));
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const listFiles = (relPath) => {
  if (!exists(relPath)) return [];

  return fs.readdirSync(path.join(root, relPath), { withFileTypes: true }).flatMap((entry) => {
    const childPath = path.posix.join(relPath, entry.name);
    return entry.isDirectory() ? listFiles(childPath) : [childPath];
  });
};

const failures = [];

const packageJson = JSON.parse(read("package.json"));
const scripts = packageJson.scripts || {};
for (const forbiddenScript of ["build:css", "build:tailwind", "build:tailwind:watch"]) {
  if (Object.prototype.hasOwnProperty.call(scripts, forbiddenScript)) {
    failures.push(`Starter package.json must not define \`${forbiddenScript}\`; build ownership belongs to gem repos.`);
  }
}

const config = read("_config.yml");
if (!/^\s*theme:\s*al_folio_core\s*$/m.test(config)) {
  failures.push("`_config.yml` must keep `theme: al_folio_core` for thin-starter wiring.");
}
if (!/^\s*-\s*al_folio_core\s*$/m.test(config)) {
  failures.push("`_config.yml` plugins must include `al_folio_core`.");
}
if (!/^\s*-\s*al_folio_distill\s*$/m.test(config)) {
  failures.push("`_config.yml` plugins must include `al_folio_distill` (distill is plugin-owned).");
}
if (!/^\s*-\s*al_cookie\s*$/m.test(config)) {
  failures.push("`_config.yml` plugins must include `al_cookie` (cookie consent is plugin-owned).");
}
if (!/^\s*-\s*al_icons\s*$/m.test(config)) {
  failures.push("`_config.yml` plugins must include `al_icons` (icon runtime is plugin-owned).");
}
if (!/^\s*-\s*al_math\s*$/m.test(config)) {
  failures.push("`_config.yml` plugins must include `al_math` when math features are enabled.");
}

for (const libraryKey of ["fontawesome", "academicons", "scholar-icons"]) {
  if (!new RegExp(`^\\s{2}${escapeRegExp(libraryKey)}:\\s*$`, "m").test(config)) {
    failures.push(`\`_config.yml\` must define \`third_party_libraries.${libraryKey}\` for al_icons runtime wiring.`);
    continue;
  }
  if (!new RegExp(`^\\s{2}${escapeRegExp(libraryKey)}:[\\s\\S]*?^\\s{4}integrity:\\s*$[\\s\\S]*?^\\s{6}css:\\s*\"sha`, "m").test(config)) {
    failures.push(`\`_config.yml\` should define an SRI hash for \`third_party_libraries.${libraryKey}.integrity.css\`.`);
  }
}

for (const libraryKey of ["tikzjax", "tocbot"]) {
  if (!new RegExp(`^\\s{2}${escapeRegExp(libraryKey)}:\\s*$`, "m").test(config)) {
    failures.push(`\`_config.yml\` must define \`third_party_libraries.${libraryKey}\` for v1 runtime contracts.`);
  }
}

const gemfile = read("Gemfile");
if (!/gem 'al_math', '= 1\.0\.1'/.test(gemfile)) {
  failures.push("`Gemfile` should pin `al_math` to released version `1.0.1`.");
}
if (/gem 'al_math',\s*:git =>/.test(gemfile)) {
  failures.push("`Gemfile` must not use git-branch pin for `al_math`; use released gem version.");
}

// This personalized site intentionally owns a small, explicit set of local theme
// overrides. Keep the allowlist narrow so copied core runtime files still fail CI.
const allowedLocalOverrides = new Set([
  "_includes/cv/render.liquid",
  "_includes/header.liquid",
  "_includes/portfolio/card.liquid",
  "_includes/portfolio/section.liquid",
  "_layouts/portfolio-item.liquid",
  "_layouts/redirect.liquid",
  "_sass/_academic-theme.scss",
  "_sass/_cv.scss",
  "_sass/_portfolio.scss",
]);

for (const overrideRoot of ["_includes", "_layouts", "_sass"]) {
  for (const localFile of listFiles(overrideRoot)) {
    if (!allowedLocalOverrides.has(localFile)) {
      failures.push(
        `Unreviewed local theme override \`${localFile}\`; add it to the site override allowlist after review or move shared runtime work to its owning gem.`
      );
    }
  }
}

for (const forbiddenPath of ["_scripts", "assets/tailwind", "tailwind.config.js", "assets/webfonts"]) {
  if (exists(forbiddenPath)) {
    failures.push(`Starter must not own core component path \`${forbiddenPath}\`; move ownership to the corresponding gem.`);
  }
}

for (const forbiddenGlobPath of [
  "assets/fonts/academicons.woff",
  "assets/fonts/academicons.ttf",
  "assets/fonts/scholar-icons.woff",
  "assets/fonts/scholar-icons.ttf",
]) {
  if (exists(forbiddenGlobPath)) {
    failures.push(`Starter must not own icon runtime artifact \`${forbiddenGlobPath}\`; icon ownership belongs to al_icons.`);
  }
}

for (const requiredPath of ["test/visual", "test/integration_plugin_toggles.sh", "test/integration_distill.sh"]) {
  if (!exists(requiredPath)) {
    failures.push(`Starter integration/visual contract missing required path: \`${requiredPath}\`.`);
  }
}

// Preserve runtime-selected CV themes after PurgeCSS builds the public site.
if (!read("purgecss.config.js").includes("greedy: [/cv-/]")) {
  failures.push("PurgeCSS must retain dynamic CV template and preview selectors.");
}

// CV must remain present, keyboard-accessible and printable, without a new
// plugin-owned theme override or a server-side PDF compilation dependency.
if (exists("_pages/cv.md")) {
  const cvPage = read("_pages/cv.md");
  const cvRenderer = read("_includes/cv/render.liquid");
  const cvScript = read("assets/js/cv-customize.js");
  const cvStyles = read("_sass/_cv.scss");
  if (/^published:\s*false\s*$/m.test(cvPage)) failures.push("The CV page should remain public.");
  for (const id of ["cv-order", "cv-template", "cv-font", "cv-paper", "cv-density", "cv-palette", "cv-custom-accent", "cv-preview", "cv-print-urls", "cv-print-options", "cv-entry-picker", "cv-entry-search", "cv-entry-options", "cv-entries-all", "cv-entries-none", "cv-text-size", "cv-page-margin", "cv-print", "cv-reset", "cv-timeline"]) {
    if (!cvRenderer.includes('id="' + id + '"')) failures.push("CV is missing print/sort control: " + id);
  }
  if (!cvRenderer.includes("data-cv-date=") || !cvRenderer.includes("data-cv-section-toggle=")) {
    failures.push("CV renderer must expose dates and selectable sections.");
  }
  if (!cvScript.includes("beforeprint") || !cvScript.includes("window.print()") || !cvScript.includes("parseStartDate")) {
    failures.push("CV print and chronology handlers are missing.");
  }
  if (!cvRenderer.includes('data-cv-print-toggle="icons"') || !cvRenderer.includes('data-cv-print-toggle="highlights"')) {
    failures.push("CV print display options must include icons and highlights.");
  }
  if (!cvScript.includes("entryControls") || !cvScript.includes("item.included") || !cvScript.includes("pageMargins")) {
    failures.push("CV per-entry selection and margin handling are missing.");
  }
  if (!cvStyles.includes('data-cv-included="false"') || !cvStyles.includes('data-cv-show-icons="false"')) {
    failures.push("CV hidden item and icon selectors are missing.");
  }
  if (!cvRenderer.includes('id="cv-paged-preview"') || !cvScript.includes("renderPagedPreview") || !cvStyles.includes("cv-preview-sheet")) {
    failures.push("CV must provide screen-only numbered paper-sheet previews.");
  }
  if (!read("_data/cv.yml").includes("https://github.com/trendestimation/trendestimation")) {
    failures.push("Programming CV must link the canonical trendestimation library.");
  }
  if (!cvRenderer.includes('id="cv-document"') || !cvRenderer.includes('class="cv-primary-link"')) {
    failures.push("CV live preview or linked entry titles are missing.");
  }
  if (!cvScript.includes("templateDefaults") || !cvScript.includes('setPreview("paper")')) {
    failures.push("CV custom template color or preview handlers are missing.");
  }
  if (/column-count:\\s*2\\b/.test(cvStyles)) {
    failures.push("CV must remain single-column in every print template.");
  }
  if (!cvStyles.includes("@media print") || !cvStyles.includes("data-cv-template=\"harvard\"")) {
    failures.push("CV print style or classic template is missing.");
  }
}

if (failures.length > 0) {
  console.error("Starter style contract check failed:");
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log("Starter style contract check passed.");
