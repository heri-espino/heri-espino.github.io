// Dependency-free static source checks; run 'node scripts/validate-research-index.mjs'.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const read = (p) => fs.readFileSync(p, "utf8");
const filenames = fs.readdirSync("_pages/papers")
  .filter((f) => f.endsWith(".md"));

assert(filenames.length > 0, "No paper detail pages found");
const data = filenames.map((f) => ({
  file: f,
  text: read(path.join("_pages/papers", f))
}));
for (const {file, text} of data) {
  assert.match(text, /^---\n[\s\S]+?\n---\n/, file + ": missing YAML front matter");
  for (const required of ["title:", "label:", "status:", "permalink:"]) {
    assert(text.includes("\n" + required), file + ": missing " + required);
  }
  assert(!/\\ndetail_image(?:_alt)?:/.test(text.split("\n---\n")[0]), file + ": escaped newline in front matter");
}
const ids = new Set(data.map(({text}) => text.match(/^permalink:\s*(.+)$/m)?.[1]).filter(Boolean));
assert.equal(ids.size, filenames.length, "Duplicate paper permalinks");
const listing = read("_pages/papers.md");
assert(listing.includes('site.pages | where: "portfolio_type", "paper"'), "Paper archive must use the source records");
const discovery = read("_pages/research-index.md");
assert(discovery.includes('site.pages | where: "portfolio_type", "paper"'), "Research index must use the source records");
const catalog = read("research-catalog.json");
assert(catalog.includes('site.pages | where: "portfolio_type", "paper"'), "JSON must derive from paper source records");
for (const route of ["/research-index/", "/research-catalog.json", "/llms.txt"]) {
  const asset = route.includes("research-index") ? discovery
    : route.includes(".json") ? catalog : read("llms.txt");
  assert(asset.includes("permalink: " + route), "Missing public route " + route);
}
const profileData = read("_data/profile.yml");
assert(profileData.includes('full_name: "Heriberto Espino Montelongo"'), "Public biography must keep canonical identity");
assert(profileData.includes('"Heriberto Espino-Montelongo"'), "Public biography must preserve scholarly byline variant");
const profilePage = read("_pages/profile.md");
assert(profilePage.includes("permalink: /about-me/"), "Missing public /about-me/ route");
assert(profilePage.includes('"@type": "ProfilePage"'), "About page must use ProfilePage JSON-LD");
assert(profilePage.includes("site.data.cv.cv"), "About page must derive dated roles and degrees from CV data");
assert(profilePage.includes('site.pages | where: "portfolio_type", "paper"'), "About page must derive manuscript statuses from paper records");
assert(read("_pages/about.md").includes("site.data.profile.short_bio"), "Homepage biography must use public profile data");
assert(read("llms.txt").includes("site.data.profile.short_bio"), "AI-reading guide must include biography");
assert(read("llms.txt").includes("site.data.cv.cv.sections.Education"), "AI-reading guide must derive education from CV data");
assert(catalog.includes("site.data.profile.research_interests"), "JSON catalog must expose sourced research interests");
assert(discovery.includes("'/about-me/'"), "Research index must link to expanded biography");
const layout = read("_layouts/portfolio-item.liquid");
assert(layout.includes('application/ld+json') && layout.includes("creativeWorkStatus"),
  "Paper JSON-LD must expose its actual record status");
const sitemap = read("sitemap.xml");
assert(sitemap.includes("for item in site.pages"), "Sitemap must include new HTML pages");
const statuses = data.filter(({text}) => /^label:\s*["']?Under (Review|Revision)/m.test(text));
console.log("Validated " + data.length + " paper sources and " + statuses.length + " review/revision-stage records.");
console.log("This checks sources only; a Jekyll build and rendered JSON parser are still required.");
