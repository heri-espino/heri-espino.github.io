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

// Every named CV organization should have a logo unless it lacks a reliably
// attributable public mark. Reuse the pre-existing certificate issuer source.
if (exists("_data/cv_organization_logos.yml")) {
  const logos = read("_data/cv_organization_logos.yml");
  const existingIssuers = read("_data/credential_issuers.yml");
  const cvSource = read("_data/cv.yml");
  const logoRules = [...logos.matchAll(/^- match: "([^"]+)"\s*$/gm)].map((result) => result[1]);
  if (new Set(logoRules).size !== logoRules.length) {
    failures.push("CV organization logo registry has duplicate match rules.");
  }
  const issuerKeys = new Set([...existingIssuers.matchAll(/^([a-z0-9-]+):\s*$/gm)].map((result) => result[1]));
  for (const result of logos.matchAll(/^  issuer_key: ([a-z0-9-]+)\s*$/gm)) {
    if (!issuerKeys.has(result[1])) {
      failures.push("CV organization logo registry references missing issuer key " + result[1]);
    }
  }
  const unbranded = new Set([
    "Data Scientist", "Independent research software", "Kaxa Nuk",
    "Open-source Python library", "Paletas Loreto", "Research draft",
    "Model of United Nations Third Edition · WHO · Colegio Loyola",
    "Un Acercamiento al Análisis Topológico de Datos · Benemérita Universidad Autónoma de Puebla",
    "Fideicomisos Instituidos en Relación con la Agricultura"
  ]);
  const sourceNames = [...cvSource.matchAll(/\b(?:organization|institution):\s*(?:"([^"\n]+)"|([^,\n}]+))/gm)]
    .map((match) => (match[1] || match[2]).trim());
  for (const name of new Set(sourceNames)) {
    if (!unbranded.has(name) && !logoRules.some((part) => name.toLowerCase().includes(part))) {
      failures.push("Missing CV organization logo mapping for " + name);
    }
  }
  if (!read("_includes/cv/render.liquid").includes("site.data.cv_organization_logos")) {
    failures.push("CV must resolve its organization logo registry.");
  }
  if (!read("assets/js/cv-customize.js").includes('image.addEventListener("load"')) {
    failures.push("CV must retain failed-image fallback logic.");
  }
  if (!read("_sass/_cv.scss").includes('data-cv-show-icons="false"] .cv-org-symbol')) {
    failures.push("CV print icon toggle must hide organization logos.");
  }
} else {
  failures.push("The public CV must include the organization logo registry.");
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
  if (!cvRenderer.includes('<option value="europass">') || !cvScript.includes('europass: "#2176ac"') || !cvStyles.includes('data-cv-template="europass"')) {
    failures.push("The Europass-inspired CV style must be selectable and styled.");
  }
  if (!cvScript.includes("europassLabels") || !cvScript.includes("updateSectionTitles")) {
    failures.push("Europass headings must adapt when switching templates.");
  }
  if (!cvRenderer.includes('id="cv-paged-preview"') || !cvScript.includes("renderPagedPreview") || !cvStyles.includes("cv-preview-sheet")) {
    failures.push("The CV preview must present separate numbered paper sheets.");
  }
  if (!cvStyles.includes('[data-cv-paginated="true"][data-cv-preview="paper"]') || !cvScript.includes('root.dataset.cvPaginated = "true"')) {
    failures.push("The CV must remain readable without JavaScript.");
  }
  if (!cvRenderer.includes('id="cv-panel-toggle"') || !cvRenderer.includes('id="cv-settings-panel"') || !cvScript.includes("setPanelOpen") || !cvStyles.includes(".cv-controls-column")) {
    failures.push("The CV must offer a collapsible left settings panel and a persistent print button.");
  }
  if (!read("_data/cv.yml").includes("https://github.com/trendestimation/trendestimation")) {
    failures.push("Programming experience should link the canonical trendestimation library.");
  }
  if (!cvRenderer.includes('data-cv-preview="reading"') || !cvScript.includes('setPreview("reading")')) {
    failures.push("The CV must start in full-width reading mode.");
  }
  if (!cvRenderer.includes('id="cv-markers"') || !cvScript.includes("cvMarkers") || !cvStyles.includes('data-cv-markers="dashes"')) {
    failures.push("Description markers must support dashes, bullets, and no markers.");
  }
  if (!cvRenderer.includes('<option value="latex" selected>') || !cvStyles.includes('data-cv-density="latex"')) {
    failures.push("The LaTeX-inspired extra-compact density must be available.");
  }
  if (!cvRenderer.includes('cv-entry-role') || !cvRenderer.includes('cv-entry-name')) {
    failures.push("CV entries must display role and activity separately.");
  }
  const sourceSections = read("_data/cv.yml");
  for (const section of ["Professional Experience", "Academic Experience", "Selected Academic Projects", "Selected Extracurricular Activities", "Online Courses"]) {
    if (!sourceSections.includes("    " + section + ":")) {
      failures.push("The CV is missing LaTeX-defined section " + section);
    }
  }
  if (!cvRenderer.includes('id="cv-document"') || !cvRenderer.includes('class="cv-primary-link"')) {
    failures.push("CV live preview or linked entry titles are missing.");
  }
  if (!cvScript.includes("templateDefaults") || !cvScript.includes('setPreview("reading")')) {
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
