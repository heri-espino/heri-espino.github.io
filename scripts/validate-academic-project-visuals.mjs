#!/usr/bin/env node
// Ensure every targeted academic course project has a unique, local, source-grounded
// card image and a separate portrait A4-style project overview image.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const slugs = [
  "sp500-supply-chain-network",
  "star-wars-link-prediction",
  "xgboost-credit-approval",
  "crypto-causality-network",
  "kessler-multiclass-classification",
  "synthetic-cdo-tranche-valuation",
  "margrabe-option-derivation",
  "multi-leg-derivative-strategies",
  "actuarial-risk-analysis-portfolio",
];
const old = new Set([
  "academic-network-preview.svg",
  "academic-ml-preview.svg",
  "academic-risk-preview.svg",
  "academic-derivatives-preview.svg",
]);
let errors = [];
for (const slug of slugs) {
  const page = fs.readFileSync(path.join(root, "_projects", slug + ".md"), "utf8");
  const expected = [
    ["image", `/assets/img/portfolio/academic-${slug}-card.svg`],
    ["detail_image", `/assets/img/portfolio/academic-${slug}-first-page.svg`],
  ];
  for (const [name, rel] of expected) {
    if (!page.includes(`${name}: ${rel}`)) errors.push(`${slug}: missing ${name}`);
    const full = path.join(root, rel.slice(1));
    if (!fs.existsSync(full)) { errors.push(`missing ${rel}`); continue; }
    const svg = fs.readFileSync(full, "utf8");
    if (!svg.startsWith("<svg ") || !svg.trimEnd().endsWith("</svg>") || !svg.includes('role="img"')) {
      errors.push(`invalid basic SVG document in ${rel}`);
    }
    const shape = name === "image" ? 'viewBox="0 0 1200 675"' : 'viewBox="0 0 794 1123"';
    if (!svg.includes(shape)) errors.push(`wrong viewBox in ${rel}`);
    if (name === "detail_image" && !svg.includes("not an original page scan")) {
      errors.push(`missing source-label disclosure in ${rel}`);
    }
  }
  if (!page.includes("image_alt:") || !page.includes("detail_image_alt:")) errors.push(`missing alt text: ${slug}`);
  if ([...old].some(t => page.includes(`image: /assets/img/portfolio/${t}`))) {
    errors.push(`generic preview remains: ${slug}`);
  }
}
if (errors.length) {
  for (const error of errors) console.error(error);
  process.exitCode = 1;
} else {
  console.log("Academic project visuals validated: 9 unique cards + 9 A4 overviews.");
}
