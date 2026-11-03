// Validate *rendered* discoverability artifacts after the Jekyll build.
// Run: node scripts/verify-public-profile.mjs [build-directory]
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const outputDir = process.argv[2] || "_site";
const read = (p) => fs.readFileSync(path.join(outputDir, p), "utf8");

const homepage = read("index.html");
const about = read("about-me/index.html");
const llms = read("llms.txt");
const catalog = JSON.parse(read("research-catalog.json"));
const index = read("research-index/index.html");
const sitemap = read("sitemap.xml");

const jsonLdById = (html, id) => {
  const match = html.match(new RegExp(
    '<script\\b(?=[^>]*\\bid=["\\\']' + id + '["\\\'])[^>]*>([\\s\\S]*?)<\\/script>',
    "i"
  ));
  assert(match, "Missing JSON-LD script: " + id);
  return JSON.parse(match[1]);
};

const person = jsonLdById(homepage, "academic-person-jsonld");
const profile = jsonLdById(about, "academic-profile-jsonld");
const expectedId = "https://heri-espino.github.io/#person";
assert.equal(person["@id"], expectedId, "Homepage canonical Person ID changed");
assert.equal(profile["@type"], "ProfilePage", "About page must identify itself as a ProfilePage");
assert.equal(profile.mainEntity["@id"], expectedId, "Profile must link to the canonical Person");
assert.equal(profile.mainEntity.name, "Heriberto Espino Montelongo");
assert(profile.mainEntity.alternateName.includes("Heriberto Espino-Montelongo"));
assert(profile.mainEntity.sameAs.some((url) => url.startsWith("https://orcid.org/")));
assert(profile.mainEntity.knowsAbout.length >= 5);

assert.equal(catalog.person.name, profile.mainEntity.name);
assert.equal(catalog.person["@id"], expectedId);
assert(catalog.person.alternate_names.includes("Heriberto Espino-Montelongo"));
assert.equal(catalog.person.public_profile, "https://heri-espino.github.io/about-me/");
assert(catalog.person.education.length === 2, "Degree programs must come from public CV");
assert(catalog.person.education.every((e) => e.date_display.includes("expected")));
assert(catalog.person.research_interests.length >= 5);

for (const token of [
  "Heriberto Espino Montelongo",
  "Heriberto Espino-Montelongo",
  "IMEF Universitario",
  "ProximityGraphs",
  "Under Review",
  "about-me/"
]) {
  assert(llms.includes(token), "Rendered llms.txt missing: " + token);
}
assert(!llms.includes("{{") && !llms.includes("{%"), "llms.txt contains unresolved Liquid markup");
assert(about.includes("IMEF Universitario"), "Public biography omits organization affiliation");
assert(index.includes("about-me/"), "Research index must link to expanded profile");
assert(sitemap.includes("/about-me/"), "Sitemap must advertise the profile");

const cvHtml = read("cv/index.html");
const talkHtml = read("academic-projects/proximity-graphs-asymptotics-presentation.html");
const smmUrl = "https://www.smm.org.mx/congreso/areas/platicas#:~:text=Heriberto%20Espino%20Montelongo";
assert(cvHtml.includes(smmUrl), "CV talk title must link to SMM listing with a speaker text fragment");
assert(cvHtml.includes("Official SMM listing · Talk 8744"), "CV talk must provide an official-programme link");
assert(cvHtml.includes("https://youtu.be/KjQFeBLJybw"), "CV talk must provide the verified recording");
assert(cvHtml.includes("Slides and presentation details"), "CV must preserve local presentation details");
assert(talkHtml.includes(smmUrl), "Talk detail must link to the SMM programme");
assert(talkHtml.includes("youtube-nocookie.com/embed/KjQFeBLJybw"), "Talk detail must embed official video");
assert(talkHtml.includes("espino_2026_proximity-graphs-asymptotics-presentation.pdf"), "Talk detail must retain PDF action");

const cvRecord = read("cv/index.html");
const riskRecord = read("projects/latent-risk-us-market.html");
for (const removed of [
  "studied tutoring–grade associations in 6,627 students",
  "clustered grade distributions using KS-derived features",
  "authored LaTeX lectures for linear algebra students",
  "normalized 100 news items per ticker",
]) {
  assert(!cvRecord.includes(removed), "Outdated owner-corrected CV claim remains: " + removed);
}
for (const required of [
  "Dockerized Airflow ETL into PostgreSQL for arbitrary tickers",
  "translated existing LaTeX slides from English into Spanish",
  "Jan 2026 — Mar 2026",
  "one of 10 UDLAP representatives in both 2024 and 2025",
  "https://maa.org/news/results-of-the-85th-william-lowell-putnam-mathematical-competition/",
]) {
  assert(cvRecord.includes(required), "Owner-corrected CV record missing: " + required);
}
assert(
  cvRecord.includes("created the business's websites") || cvRecord.includes("created the business&#39;s websites"),
  "Paletas Loreto website-development work missing"
);
const cvSection = (name) => {
  const start = cvRecord.indexOf('data-cv-section="' + name + '"');
  assert(start >= 0, "CV section not found: " + name);
  const end = cvRecord.indexOf("</section>", start);
  assert(end > start, "CV section markup not closed: " + name);
  return cvRecord.slice(start, end);
};
assert(cvSection("leadership").includes("IMEF Universitario Membership"), "IMEF must appear under Leadership");
assert(!cvSection("selected-extracurricular-activities").includes("IMEF Universitario Membership"), "IMEF must not remain extracurricular");
assert(cvRecord.includes('fa-brands fa-github cv-org-icon'), "Stepping-Stone context must show GitHub icon");
assert(cvRecord.includes('GitHub repository for Stepping-Stone Volume Validation'), "Stepping-Stone icon must link to GitHub");
assert(riskRecord.includes("Jan–Mar 2026"), "Latent-risk project date not synchronized");

console.log("Verified profile HTML/JSON-LD, biography, identity aliases, llms.txt, catalog, and sitemap.");
