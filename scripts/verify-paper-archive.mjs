/**
 * Verify the rendered Jekyll output, not just the source files.
 *
 * This prevents a successful deploy from silently omitting paper pages when
 * their YAML front matter is invalid. Run AFTER `bundle exec jekyll build`.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const slugs = [
  "smoothness-integrated-trend-distances",
  "dynamic-forecast-optimal-smoothness",
  "smoothness-indexed-pls-python",
  "posterior-integration-volatility-wti-asian-options",
  "componentwise-knn-isomap-lecture",
  "maxcut-sdp-eva-clustering-tutorial",
];
const pdfs = {
  "smoothness-integrated-trend-distances": "EspinoMontelongo-2026-Trend_Distances.pdf",
  "dynamic-forecast-optimal-smoothness": "EspinoMontelongo-2026-Forecast_Optimal_Smoothness.pdf",
  "smoothness-indexed-pls-python": "EspinoMontelongo-2026-PLS_Python.pdf",
  "posterior-integration-volatility-wti-asian-options": "when-does-posterior-integration-change-option-values.pdf",
  "componentwise-knn-isomap-lecture": "EspinoMontelongo-2026-Componentwise_Isomap.pdf",
  "maxcut-sdp-eva-clustering-tutorial": "EspinoMontelongo-2026-MaxCut_SDP_EVA.pdf",
};
const expectedSubmitted = 4;
const expectedDrafts = 12;

const site = path.resolve(process.argv[2] ?? "_site");
const archivePath = path.join(site, "papers", "index.html");
const read = (p) => fs.readFileSync(p, "utf8");
const errors = [];

if (!fs.existsSync(archivePath)) {
  throw new Error(`Rendered Papers archive not found: ${archivePath}`);
}
const html = read(archivePath);

function section(id) {
  // Nested portfolio cards are articles, not sections.
  const match = html.match(new RegExp(`<section\\b[^>]*\\bid=["']${id}["'][^>]*>([\\s\\S]*?)<\\/section>`, "i"));
  if (!match) {
    errors.push(`Missing rendered section #${id}`);
    return "";
  }
  return match[1];
}

function countCards(markup) {
  return (markup.match(/<article\b[^>]*class=["'][^"']*\bportfolio-card\b/g) || []).length;
}

const submitted = section("submitted-manuscripts");
const sectionIds = ["submitted-manuscripts", "published-technical-articles", "working-drafts"];
const sectionPositions = sectionIds.map((id) => html.indexOf('id="' + id + '"'));
if (sectionPositions.some((position) => position < 0) ||
    sectionPositions[0] >= sectionPositions[1] ||
    sectionPositions[1] >= sectionPositions[2]) {
  errors.push("Papers sections must be ordered Submitted → Published Articles → Working Drafts");
}
const drafts = section("working-drafts");
const actualSubmitted = countCards(submitted);
const actualDrafts = countCards(drafts);
const published = section("published-technical-articles");
const actualPublished = countCards(published);
const articlePagePath = path.join(site, "articles", "abaquant-finanzas-matematicas.html");
const articleImg = "assets/img/portfolio/abaquant-la-catarina-article.avif";
const articleLink = "/articles/abaquant-finanzas-matematicas.html";
const officialArticle = "https://lacatarina.udlap.mx/2026/10/abaquant-finanzas-matematicas-valuacion-y-gestion-del-riesgo/";
if (actualPublished !== 1 || !published.includes(articleLink)) {
  errors.push(`Expected 1 published technical article (AbaQuant), rendered ${actualPublished}`);
}
if (!published.includes("/" + articleImg)) {
  errors.push("Published AbaQuant card lacks user-uploaded article image");
}
for (const imgPath of [path.resolve(articleImg), path.join(site, articleImg)]) {
  if (!fs.existsSync(imgPath)) errors.push(`AbaQuant article image missing: ${imgPath}`);
}
if (!fs.existsSync(articlePagePath)) {
  errors.push(`AbaQuant detail page not rendered: ${articlePagePath}`);
} else {
  const detail = read(articlePagePath);
  if (!detail.includes(officialArticle) || !detail.includes("/" + articleImg) ||
      !detail.includes("Owen Paredes Conde")) {
    errors.push("AbaQuant detail page lost its original publication, coauthor or image preview");
  }
}

if (actualSubmitted !== expectedSubmitted) {
  errors.push(`Expected ${expectedSubmitted} submitted cards, rendered ${actualSubmitted}`);
}
if (actualDrafts !== expectedDrafts) {
  errors.push(`Expected ${expectedDrafts} working-draft cards after promoting JFM, rendered ${actualDrafts}`);
}
if (!drafts.includes(`(${expectedDrafts})`)) {
  errors.push(`Working-drafts heading does not report (${expectedDrafts})`);
}
if (html.includes('id="featured-working-draft"')) {
  errors.push("The six research materials must be in Working Drafts, not a featured section");
}

for (const slug of slugs) {
  const url = `/papers/${slug}.html`;
  const pagePath = path.join(site, "papers", `${slug}.html`);
  const sourcePath = path.resolve("_pages", "papers", `${slug}.md`);
  const isJfm = slug === "posterior-integration-volatility-wti-asian-options";
  const imagePrefix = isJfm
    ? "/assets/img/portfolio/jfm-posterior-integration"
    : `/assets/img/portfolio/pdf-page-shots/${slug}`;
  const cardImage = imagePrefix + (isJfm ? "-figure.webp" : "-figure.avif");
  const detailImage = imagePrefix + (isJfm ? "-first-page.webp" : "-first.avif");
  const archiveSection = isJfm ? submitted : drafts;
  const pdfUrl = `/papers/${pdfs[slug]}`;
  const pdfSource = path.resolve("papers", pdfs[slug]);
  const pdfOutput = path.join(site, "papers", pdfs[slug]);
  for (const pdfPath of [pdfSource, pdfOutput]) {
    if (!fs.existsSync(pdfPath)) {
      errors.push(`Missing source or built PDF: ${pdfPath}`);
      continue;
    }
    const fd = fs.openSync(pdfPath, "r");
    const magic = Buffer.alloc(5);
    fs.readSync(fd, magic, 0, magic.length, 0);
    fs.closeSync(fd);
    if (fs.statSync(pdfPath).size < 10_000 || magic.toString() !== "%PDF-") {
      errors.push(`Missing or invalid PDF header: ${pdfPath}`);
    }
  }

  if (!archiveSection.includes(url)) {
    errors.push(`Archive has not placed this entry in the correct submitted/draft section: ${url}`);
  }
  if (!fs.existsSync(pagePath)) {
    errors.push(`Jekyll did not generate ${pagePath} (check YAML front matter)`);
    continue;
  }
  const page = read(pagePath);
  if (!page.includes(pdfUrl)) errors.push(`Detail page lacks published PDF link: ${slug}`);
  if (!page.includes("portfolio-detail") ||
      !page.includes(detailImage)) {
    errors.push(`Rendered detail page lacks the first-page preview: ${slug}`);
  }
  if (!archiveSection.includes(cardImage)) {
    errors.push(`Paper card lacks its figure-page screenshot: ${slug}`);
  }
  if (isJfm) {
    const supplement = "when-does-posterior-integration-change-option-values-supplement.pdf";
    const supplementImage = "/assets/img/portfolio/jfm-posterior-integration-supplement-first-page.webp";
    const expectedHashes = {
      [pdfs[slug]]: "5f5063654bc62c0aab51f3620e90ab9292214dd72cdae421c4bca0ebe3986043",
      [supplement]: "edf24cf45fbc5678911608f12b19069473d29455985b5a5c2e3fc323d5ca4111",
    };
    for (const [name, expectedHash] of Object.entries(expectedHashes)) {
      for (const location of [path.resolve("papers", name), path.join(site, "papers", name)]) {
        if (!fs.existsSync(location)) {
          errors.push(`Missing JFM source or built PDF: ${location}`);
          continue;
        }
        const digest = createHash("sha256").update(fs.readFileSync(location)).digest("hex");
        if (digest !== expectedHash) errors.push(`JFM PDF content checksum changed: ${location}`);
      }
    }
    for (const imagePath of [
      "assets/img/portfolio/jfm-posterior-integration-figure.webp",
      "assets/img/portfolio/jfm-posterior-integration-first-page.webp",
      "assets/img/portfolio/jfm-posterior-integration-supplement-first-page.webp",
    ]) {
      if (!fs.existsSync(imagePath) || !fs.existsSync(path.join(site, imagePath))) {
        errors.push(`Missing source or built JFM preview: ${imagePath}`);
      }
    }
    if (!page.includes(supplement) || !page.includes(supplementImage)) {
      errors.push("JFM detail page must contain the supplementary PDF and its first-page screenshot");
    }
    if (!submitted.includes("Submitted to The Journal of Futures Markets")) {
      errors.push("JFM must be explicitly submitted, not an unverified draft");
    }
  }
  if (!fs.existsSync(sourcePath)) {
    errors.push(`Markdown source missing: ${sourcePath}`);
  } else {
    const frontMatter = read(sourcePath).split(/^---\s*$/m).slice(1, 2)[0] ?? "";
    if (!frontMatter.includes(`pdf: ${pdfUrl}`)) errors.push(`Source page PDF mapping missing: ${slug}`);
    if (!frontMatter.includes("portfolio_type: paper") ||
        !frontMatter.includes(`permalink: ${url}`) ||
        frontMatter.includes("\\ndetail_image:") ||
        frontMatter.includes("\\ndetail_image_alt:")) {
      errors.push(`Invalid paper front matter or literal escaped newlines: ${slug}`);
    }
  }
}

if (errors.length) {
  console.error("Rendered Papers archive contract failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Rendered Papers archive passed: ${actualSubmitted} submitted + ${actualDrafts} drafts, all six research PDFs and the exact Wiley JFM supplementary PDF present.`);
