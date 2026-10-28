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
  // Shortcuts are anchored next to the name, not fixed to the viewport.
  // Closing settings must free the entire CV width, with no reserved rail.
  const nameAnchored = cvStyles.split("/* CV controls belong to the name/header, NOT the viewport.")[1] || "";
  if (!nameAnchored.includes(".cv-page[data-cv-tools=\"closed\"] .cv-workspace") ||
      !nameAnchored.includes("display: block;") ||
      !nameAnchored.includes("grid-template-columns: none;") ||
      !nameAnchored.includes("position: relative;") ||
      !nameAnchored.includes(".cv-page[data-cv-preview=\"reading\"] .cv-intro") ||
      !nameAnchored.includes("padding-left: 3.45rem;") ||
      !nameAnchored.includes("position: absolute;") ||
      !nameAnchored.includes(".cv-page #cv-settings-panel:not([hidden])") ||
      !nameAnchored.includes("overflow-y: auto;") ||
      nameAnchored.includes("position: fixed;")) {
    failures.push("Name-anchored CV controls must not float with the viewport or reserve a left gutter.");
  }
  if (!cvRenderer.includes('id="cv-panel-toggle"') ||
      !cvRenderer.includes('id="cv-print"') ||
      !cvRenderer.includes('class="cv-controls-toolbar"') ||
      !cvStyles.includes("@media print")) {
    failures.push("Both accessible CV shortcuts must remain together and hidden from print.");
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
  if (!cvRenderer.includes('<option value="balanced" selected>') || !cvStyles.includes('data-cv-density="latex"')) {
    failures.push("The CV must default to balanced reading spacing while retaining LaTeX compact print styling.");
  }
  if (!cvRenderer.includes('data-cv-density="balanced" data-cv-preview="reading"')) {
    failures.push("The CV page must open in balanced full-width reading mode.");
  }
  if (!cvScript.includes('viewDensity = { reading: "balanced", paper: "latex" }') ||
      !cvScript.includes('viewDensity[previousMode] = controls.density.value') ||
      !cvScript.includes('viewDensity[root.dataset.cvPreview] = controls.density.value')) {
    failures.push("Reading and paper previews must remember their independent density choices.");
  }
  if (!cvScript.includes('root.dataset.cvDensity = viewDensity.paper;') ||
      !cvScript.includes('screenDensityBeforePrint ?? controls.density.value')) {
    failures.push("Printing must use paper density and restore the live wide view afterward.");
  }
  if (!cvRenderer.includes('<option value="dashes" selected>') ||
      !cvScript.includes('controls.markers.value = "dashes";')) {
    failures.push("Em dashes must remain the default in both reading and print views.");
  }
  if ((cvRenderer.match(/id="cv-density"/g) || []).length !== 1 ||
      (cvRenderer.match(/id="cv-markers"/g) || []).length !== 1) {
    failures.push("Reading and print previews must use one shared customization menu.");
  }
  if (!cvRenderer.includes('cv-entry-role') || !cvRenderer.includes('cv-entry-name')) {
    failures.push("CV entries must display role and activity separately.");
  }
  const sourceSections = read("_data/cv.yml");
  for (const section of ["Professional Experience", "Academic Experience", "Selected Academic Projects", "Selected Extracurricular Activities", "Credentials"]) {
    if (!sourceSections.includes("    " + section + ":")) {
      failures.push("The CV is missing LaTeX-defined section " + section);
    }
  }
  if (!cvRenderer.includes('data-cv-tools="closed"') || !cvRenderer.includes('id="cv-settings-panel" aria-label="Customize and print CV" hidden') ||
      !cvRenderer.includes('aria-label="Show CV settings"') || !cvRenderer.includes('fa-chevron-right') ||
      !cvRenderer.includes('aria-label="Print or save CV as PDF"') || !cvRenderer.includes('fa-print') ||
      !cvScript.includes('setPanelOpen(false)')) {
    failures.push("The CV must start with collapsed settings and accessible chevron/print-only controls.");
  }
  if (!read("_config.yml").includes("back_to_top: false")) {
    failures.push("The floating back-to-top button must be disabled in Jekyll configuration, not merely hidden by CV CSS.");
  }
  if (!cvStyles.includes('body:has(.cv-page) #back-to-top') ||
      !cvStyles.includes('body:has(.cv-page) .back-to-top')) {
    failures.push("CV-specific CSS must also hide legacy back-to-top controls.");
  }
  if (cvRenderer.includes("Academic Assistant in Matrix Theory Course") ||
      read("_data/cv.yml").includes("Academic Assistant in Matrix Theory Course")) {
    failures.push("The redundant Matrix Theory academic assistant entry must remain removed.");
  }
  const logoSource = read("_data/cv_organization_logos.yml");
  for (const file of [
    "udlap-academic.webp", "udlap-orange.webp", "paletas-loreto.webp",
    "maa-putnam.webp", "fira.webp", "kaxa-nuk.webp"
  ]) {
    const path = "assets/img/cv-organizations/" + file;
    if (!exists(path) || !logoSource.includes("/" + path)) {
      failures.push("Missing uploaded local CV organization logo: " + path);
    }
  }
  if (!logoSource.includes('academic_logo: "/assets/img/cv-organizations/udlap-academic.webp"') ||
      !cvRenderer.includes("cv_logo_rule.academic_logo") ||
      !cvRenderer.includes("cv_academic_context") ||
      !cvRenderer.includes("cv_org_logo | relative_url")) {
    failures.push("UDLAP academic versus nonacademic logo selection is missing.");
  }
  if (!exists("assets/img/cv-organizations/colegio-loyola.webp") ||
      !logoSource.includes('- match: "colegio loyola"') ||
      !logoSource.includes('logo: "/assets/img/cv-organizations/colegio-loyola.webp"')) {
    failures.push("The supplied Colegio Loyola emblem must be hosted locally and mapped.");
  }
  if (!logoSource.includes('- match: "benemérita universidad autónoma de puebla"') ||
      !logoSource.includes('Logo_de_la_BUAP.svg')) {
    failures.push("BUAP must have a recognizable vector logo, not an unmatched institution.");
  }
  if (!exists("assets/img/cv-organizations/actinver.webp") ||
      !logoSource.includes('logo: "/assets/img/cv-organizations/actinver.webp"') ||
      logoSource.includes('Logo_de_Actinver.svg') ||
      cvStyles.includes('Logo_de_Actinver.svg')) {
    failures.push("Actinver must use the user's local square logo, not the old SVG wordmark.");
  }
  const libraryAssets = {
    "abaquant": "abaquant.svg",
    "proximitygraphs": "proximitygraphs.svg",
    "trend estimation": "trendestimation.svg",
    "awesomefigures": "awesomefigures.svg",
    "docling math": "doclingmath.svg"
  };
  for (const [name, file] of Object.entries(libraryAssets)) {
    const path = "assets/img/cv-organizations/" + file;
    if (!exists(path) ||
        !logoSource.includes('- match: "' + name + '"') ||
        !logoSource.includes('logo: "/' + path + '"')) {
      failures.push("Missing authored-library logo or mapping: " + name);
    }
  }
  const libraryCv = read("_data/cv.yml").split("    Programming Experience:")[1]?.split("    Academic Experience:")[0] || "";
  const libraryRoles = [
    ['organization: AbaQuant', 'role: "Author & Lead Developer"'],
    ['organization: ProximityGraphs', 'role: "Co-author & Maintainer"'],
    ['organization: Trend Estimation', 'role: "Author & Maintainer"'],
    ['organization: AwesomeFigures', 'role: "Author & Maintainer"'],
    ['organization: Docling Math', 'role: "Author & Maintainer"']
  ];
  for (const [organization, role] of libraryRoles) {
    const origin = libraryCv.indexOf(organization);
    const segment = libraryCv.slice(Math.max(0, origin - 250), origin + 250);
    if (origin < 0 || !segment.includes(role)) {
      failures.push("Missing library authorship credit on the organization line: " + organization);
    }
  }
  if (!libraryCv.includes('organization: OpenAI') ||
      !libraryCv.includes('role: "Contributor"')) {
    failures.push("The external OpenAI SDK must remain credited as a contribution, not authorship.");
  }
  if (!exists("scripts/audit-cv-organization-logos.mjs") ||
      !exists("docs/CV_LOGO_AUDIT.md")) {
    failures.push("The organization-logo audit and reproducible checker must remain available.");
  }
  if (!cvRenderer.includes('class="cv-org-symbol"') ||
      !cvRenderer.includes('cv-org-icon"') ||
      !cvRenderer.includes('class="cv-org-logo"') ||
      !cvStyles.includes('data-cv-show-icons="false"] .cv-org-symbol')) {
    failures.push("Organization and institution labels must retain their logo and fallback icon.");
  }
  if (['cv-entry-symbol', 'cv-skills-icon', 'cv-language-icon', 'fa-arrow-up-right-from-square'].some((token) => cvRenderer.includes(token))) {
    failures.push("CV headings, positions, skills, and languages must remain free of decorative icons.");
  }
  const cvSources = read("_data/cv.yml");

  // Four core facts on event-based CV entries: canonical title,
  // role/category, date and institution OR explicitly labeled research context.
  // Skills/languages are taxonomies, not dated career events.
  const metadataEntries = [];
  let metadataSection = "";
  let currentEntry = null;
  for (const line of cvSources.split("\n")) {
    const sectionMatch = line.match(/^    ([A-Za-z][^:]+):\s*$/);
    if (sectionMatch) {
      metadataSection = sectionMatch[1];
      currentEntry = null;
      continue;
    }
    const entryMatch = line.match(/^      - (name|degree):\s*(.+)$/);
    if (entryMatch) {
      if (metadataSection === "Technical Skills" || metadataSection === "Languages") {
        currentEntry = null;
        continue;
      }
      currentEntry = {
        section: metadataSection,
        name: entryMatch[2],
        role: false,
        date: false,
        affiliationOrContext: false,
      };
      metadataEntries.push(currentEntry);
      continue;
    }
    if (!currentEntry) continue;
    if (/^        role:/.test(line)) currentEntry.role = true;
    if (/^        date:/.test(line)) currentEntry.date = true;
    if (/^        (organization|institution|context):/.test(line)) {
      currentEntry.affiliationOrContext = true;
    }
  }
  if (metadataEntries.length < 80) {
    failures.push("Too few event-based CV entries were checked for four-field metadata.");
  }
  for (const entry of metadataEntries) {
    if (!entry.name || !entry.role || !entry.date || !entry.affiliationOrContext) {
      failures.push("CV core metadata missing: " + entry.section + " / " + entry.name);
    }
  }
  if (!cvRenderer.includes("entry.context") ||
      !cvRenderer.includes('class="cv-context"') ||
      !cvRenderer.includes("{{ entry.name | escape }}")) {
    failures.push("CV must visibly render research context and full Python library titles.");
  }
  const metadataExceptions = [
    "date: \"Date not recorded\"",
    "start date unrecorded",
  ];
  if (!metadataExceptions.every((phrase) => cvSources.includes(phrase))) {
    failures.push("Unknown credential/library dates must remain explicitly distinguished from verified dates.");
  }

  const credentialSource = read("_data/credentials.yml");
  const creds = cvSources.split("    Credentials:")[1]?.split("    Languages:")[0] || "";
  const featuredCredentials = credentialSource.split("  - id: specializations")[1]?.split("  - id: academic-schools")[0] || "";
  const independentCredentials = credentialSource.split("  - id: independent-courses")[1]?.split("  - id: specialization-courses")[0] || "";
  const expectedCredentialCount = [...featuredCredentials.matchAll(/^      - title: /gm)].length +
    [...independentCredentials.matchAll(/^      - title: /gm)].length;
  const cvCredentialCount = [...creds.matchAll(/^      - name: /gm)].length;
  if (!creds || cvSources.includes("    Online Courses:") || cvCredentialCount !== expectedCredentialCount) {
    failures.push("Credentials must mirror the website's curated specialization and independent-course lists.");
  }
  if (!cvSources.includes('Elsevier · Discrete Applied Mathematics · Under Review') ||
      !cvSources.includes('Elsevier · Computational Geometry · Under Review') ||
      cvSources.includes("Manuscript under revision for Computational Geometry")) {
    failures.push("Both listed Elsevier journals must explicitly show Under Review.");
  }
  if (cvSources.includes("Applied valuation, capital budgeting and cost-of-capital methods.") ||
      cvSources.includes("Studied structured storytelling for diverse audiences.")) {
    failures.push("The Penn finance and IESE storytelling descriptions must remain removed.");
  }
  const trendDraft = read("_pages/papers/smoothness-integrated-trend-distances.md");
  const papersArchive = read("_pages/papers.md");
  const researchGroup = cvSources.split("    Research:")[1]?.split("    Selected Academic Projects:")[0] || "";
  const trendTitle = "Smoothness-Integrated Trend Distances with Nonzero Difference Drift";
  if (!trendDraft.includes('label: "Working Draft"') ||
      !trendDraft.includes('status: "Research note · Not submitted"') ||
      !trendDraft.includes("importance: 1") ||
      !trendDraft.includes("permalink: /papers/smoothness-integrated-trend-distances.html") ||
      trendDraft.includes("Under Review") || trendDraft.includes("Submitted Manuscript")) {
    failures.push("Smoothness-integrated trend manuscript must be a prominent unsubmitted working draft.");
  }
  if (papersArchive.includes('id="featured-working-draft"') ||
      papersArchive.includes("featured_items =") ||
      papersArchive.includes("item.featured != true") ||
      !papersArchive.includes('id="working-drafts"') ||
      !papersArchive.includes("include portfolio/card.liquid item=item") ||
      papersArchive.indexOf('id="submitted-manuscripts"') > papersArchive.indexOf('id="working-drafts"')) {
    failures.push("Submitted manuscripts must precede the unified Working Drafts section, without a featured section or exclusion.");
  }
  const newResearchPages = [
    ["dynamic-forecast-optimal-smoothness", "Dynamic Forecast-Optimal Smoothness for Penalized Trend Estimation", "Working Draft"],
    ["smoothness-indexed-pls-python", "Smoothness-Indexed Penalized Trend Estimation in Python", "Working Draft"],
    ["posterior-integration-volatility-wti-asian-options", "Posterior Integration and Volatility Inputs in WTI Asian Options", "Working Draft"],
    ["componentwise-knn-isomap-lecture", "Componentwise kNN-Isomap", "Research Lecture"],
    ["maxcut-sdp-eva-clustering-tutorial", "From Max-Cut to Semidefinite Programming", "Research Tutorial"],
  ];
  const allScreenshotSlugs = ["smoothness-integrated-trend-distances", ...newResearchPages.map(([slug]) => slug)];
  const pdfFilenameBySlug = {
    "smoothness-integrated-trend-distances": "EspinoMontelongo-2026-Trend_Distances.pdf",
    "dynamic-forecast-optimal-smoothness": "EspinoMontelongo-2026-Forecast_Optimal_Smoothness.pdf",
    "smoothness-indexed-pls-python": "EspinoMontelongo-2026-PLS_Python.pdf",
    "posterior-integration-volatility-wti-asian-options": "EspinoMontelongo-2026-WTI_Asian_Options.pdf",
    "componentwise-knn-isomap-lecture": "EspinoMontelongo-2026-Componentwise_Isomap.pdf",
    "maxcut-sdp-eva-clustering-tutorial": "EspinoMontelongo-2026-MaxCut_SDP_EVA.pdf",
  };
  const figureSourcePages = {
    "smoothness-integrated-trend-distances": 4,
    "dynamic-forecast-optimal-smoothness": 10,
    "smoothness-indexed-pls-python": 15,
    "posterior-integration-volatility-wti-asian-options": 9,
    "componentwise-knn-isomap-lecture": 29,
    "maxcut-sdp-eva-clustering-tutorial": 1,
  };
  for (const slug of allScreenshotSlugs) {
    const pagePath = "_pages/papers/" + slug + ".md";
    const pageSource = read(pagePath);
    const frontMatterMatch = pageSource.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
    if (!frontMatterMatch || frontMatterMatch[1].includes("\\ndetail_image:") ||
        frontMatterMatch[1].includes("\\ndetail_image_alt:")) {
      failures.push("Paper metadata must have valid front-matter line breaks, not literal backslash-n text: " + slug);
    }
    const file = pdfFilenameBySlug[slug];
    const pdfPath = "papers/" + file;
    if (!exists(pdfPath)) {
      failures.push("Named PDF source missing: " + pdfPath);
    } else {
      const pdf = fs.readFileSync(path.join(root, pdfPath));
      if (pdf.length < 10000 || pdf.toString("ascii", 0, 5) !== "%PDF-") {
        failures.push("Invalid named PDF: " + pdfPath);
      }
    }
    if (!pageSource.includes("pdf: /papers/" + file) ||
        !researchGroup.includes("https://heri-espino.github.io/papers/" + file)) {
      failures.push("Paper and CV must both link the standardized PDF: " + slug);
    }
    const imagePrefix = "/assets/img/portfolio/pdf-page-shots/" + slug;
    if (pageSource.includes("featured: true") ||
        !pageSource.includes("image: " + imagePrefix + "-figure.avif") ||
        !pageSource.includes("detail_image: " + imagePrefix + "-first.avif") ||
        !pageSource.includes("Page " + figureSourcePages[slug] + ":") && slug !== "componentwise-knn-isomap-lecture") {
      failures.push("Draft must be unfeatured and use the correct two PDF screenshots: " + slug);
    }
    for (const suffix of ["figure", "first"]) {
      const imageFile = "assets/img/portfolio/pdf-page-shots/" + slug + "-" + suffix + ".avif";
      if (!exists(imageFile)) {
        failures.push("PDF screenshot file missing: " + imageFile);
        continue;
      }
      const bytes = fs.readFileSync(path.join(root, imageFile));
      if (bytes.length < 1000 || bytes.toString("ascii", 4, 12) !== "ftypavif") {
        failures.push("Invalid or empty AVIF PDF screenshot: " + imageFile);
      }
    }
  }
  for (const [slug, title, stage] of newResearchPages) {
    const relPath = "_pages/papers/" + slug + ".md";
    if (!exists(relPath)) {
      failures.push("Missing linked research material: " + relPath);
      continue;
    }
    const source = read(relPath);
    if (!source.includes("title: ") || !source.includes(title) ||
        !source.includes('label: "' + stage + '"') ||
        source.includes("featured: true") ||
        !source.includes("permalink: /papers/" + slug + ".html") ||
        source.includes("\\npdf: ") ||
        !researchGroup.includes("papers/" + slug + ".html")) {
      failures.push("Research page or CV link/status not synchronized for: " + slug);
    }
  }
  if (researchGroup.includes("Under Review") && !cvSources.includes("Elsevier · Discrete Applied Mathematics · Under Review")) {
    failures.push("Existing journal review classifications must be retained.");
  }
  if (!read("_pages/papers/componentwise-knn-isomap-lecture.md").includes("not a submitted research article") ||
      !read("_pages/papers/maxcut-sdp-eva-clustering-tutorial.md").includes("not represented as a submitted")) {
    failures.push("Lecture/tutorial materials must not be mislabeled as submitted manuscripts.");
  }
  if (!researchGroup.trimStart().startsWith('- name: "' + trendTitle + '"') ||
      !researchGroup.includes("Working Draft (Not Submitted)") ||
      !researchGroup.includes("papers/smoothness-integrated-trend-distances.html")) {
    failures.push("The working draft must be the first research CV entry and never appear as submitted.");
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
  // Harvard's two-column *header* is not a two-column CV: organization and
  // role remain left while city and date sit right, including print preview.
  const harvardHeaderSelectors = [
    '.cv-page[data-cv-template="harvard"] .cv-entry-heading > div',
    '.cv-page[data-cv-template="harvard"] .cv-entry-heading .cv-organization',
    '.cv-page[data-cv-template="harvard"] .cv-entry-heading h3',
    '.cv-page[data-cv-template="harvard"] .cv-entry-heading .cv-meta',
    '.cv-page[data-cv-template="harvard"] .cv-entry-heading .cv-meta .cv-location',
    '.cv-page[data-cv-template="harvard"] .cv-entry-heading .cv-meta .cv-date'
  ];
  if (!harvardHeaderSelectors.every((selector) => cvStyles.includes(selector)) ||
      !cvStyles.includes('order: -2;') ||
      !cvStyles.includes('order: -1;') ||
      !cvStyles.includes('align-items: flex-end;') ||
      !cvStyles.includes('grid-template-columns: minmax(0, 1fr) minmax(0, max-content);') ||
      !cvScript.includes('root.dataset.cvTemplate = controls.template.value')) {
    failures.push("Harvard must place icon-bearing organization and role on the left, city then date on the right.");
  }
  if (!cvRenderer.includes('class="cv-org-symbol"') ||
      !cvRenderer.includes('class="cv-location"') ||
      !cvRenderer.includes('class="cv-date"') ||
      !cvStyles.includes('data-cv-markers="dashes"')) {
    failures.push("Harvard CV must retain organization icons, city and date fields, and em-dash descriptions.");
  }
}

if (failures.length > 0) {
  console.error("Starter style contract check failed:");
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log("Starter style contract check passed.");
