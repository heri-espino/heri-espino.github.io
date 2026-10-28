#!/usr/bin/env node
// Deterministic audit of current CV logo mappings; no packages/network needed.
import fs from "node:fs";
const read = (p) => fs.readFileSync(p, "utf8");
const cv = read("_data/cv.yml"), logoYaml = read("_data/cv_organization_logos.yml");
const issuerYaml = read("_data/credential_issuers.yml");
const issuers = {};
let key = "";
for (const line of issuerYaml.split("\n")) {
  const h = line.match(/^([a-z0-9-]+):\s*$/);
  if (h) key = h[1];
  const u = line.match(/^\s+logo:\s*"([^"]+)"/);
  if (key && u) issuers[key] = u[1];
}
const rules = logoYaml.split(/(?=^- match: )/m).filter((part) => part.startsWith("- match: ")).map((part) => ({
  name: part.match(/^- match: "([^"]+)"/)?.[1],
  logo: part.match(/^  logo: "([^"]+)"/m)?.[1],
  issuer: part.match(/^  issuer_key: ([^\n]+)/m)?.[1],
}));
const records = [...cv.matchAll(/^        (?:organization|institution):\s*(.+)$/gm)].map((m) =>
  m[1].trim().replace(/^['"]|['"]$/g, ""));
const names = [...new Set(records)];
const grouped = { local: [], vector: [], favicon: [], remote: [], unmatched: [] };
for (const name of names) {
  const rule = rules.find((r) => name.toLowerCase().includes(r.name));
  const url = rule?.logo || issuers[rule?.issuer] || "";
  const kind = !rule ? "unmatched" : url.includes("/assets/") ? "local" :
    url.includes("google.com/s2/") ? "favicon" :
    /\.svg(\?|$)/i.test(url) ? "vector" : "remote";
  grouped[kind].push({ name, rule: rule?.name ?? null, url });
}
console.log(JSON.stringify({
  references: records.length,
  distinctLabels: names.length,
  matchingRules: rules.length,
  counts: Object.fromEntries(Object.entries(grouped).map(([k, items]) => [k, items.length])),
  unmatched: grouped.unmatched.map((x) => x.name),
  faviconOnly: grouped.favicon.map((x) => x.name),
}, null, 2));
