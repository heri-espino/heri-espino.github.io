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

console.log("Verified profile HTML/JSON-LD, biography, identity aliases, llms.txt, catalog, and sitemap.");
