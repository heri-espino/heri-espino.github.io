# CV organization logo audit

Audit performed: 2026-10-28. Sources: `_data/cv.yml`, `_data/cv_organization_logos.yml`, `_data/credential_issuers.yml` and the user's uploaded Colegio Loyola emblem.

## Result

There are **83 organization references** across **65 distinct display labels**.
After mapping Colegio Loyola and BUAP, all named organizations/institutions
have a logo rule. Four generic placeholders are still unmatched:

| Display label | CV entries | Action |
| --- | ---: | --- |
| Open-source Python library | 2 | Replace with specific project identity only if authorized: Trend Estimation and AwesomeFigures |
| Independent research software | 1 | Docling Math: use project artwork only if its identity is verified |
| Research draft | 1 | No institution or publisher is asserted; leave neutral fallback |
| Data Scientist | 1 | This is a role, not an organization. Do not invent an employer |

An unmatched match rule does **not** necessarily mean a broken image. The CV's
JavaScript falls back to a generic institution symbol whenever a remote
image cannot load. Visual inspection is still needed to confirm whether an
image actually loads in a user's browser.

## Sources upgraded

- **Colegio Loyola:** owner-supplied original image
  `assets/img/cv-organizations/colegio-loyola.webp`; matched in
  `Model of United Nations Third Edition · WHO · Colegio Loyola`.
- **BUAP:** published SVG
  `https://upload.wikimedia.org/wikipedia/commons/a/a7/Logo_de_la_BUAP.svg`.
  Source: [Wikimedia Commons file page](https://commons.wikimedia.org/wiki/File:Logo_de_la_BUAP.svg),
  Aicanstome, CC BY-SA 4.0; no modifications or local redistribution.
  BUAP's own identity manual is at
  `https://comunicacion.buap.mx/sites/default/files/IdentidadGrafica/manual-identidad-buap.pdf`.
- **Actinver:** replaced the raster favicon with the sharp vector wordmark
  `https://upload.wikimedia.org/wikipedia/commons/9/95/Logo_de_Actinver.svg`,
  attributed to Actinver by [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Logo_de_Actinver.svg).
  Its display is wider than the normal square icon to preserve legibility.
  This is a trademark used only to identify the organization.

## Existing matches that still use favicons

These are **mapped**, not absent, but the source is a favicon and may look
small, generic, or pixelated. If the owner supplies official SVG/PNG brand
art, prefer that. Do not fabricate an institutional seal, distort a
wordmark, or download unrelated lookalikes.

**Priority universities and research institutions:**
UNAM, Oxford / Saïd Business School, Imperial College London, Duke
University, Yale University, Columbia University, University of
Pennsylvania, University of Illinois Urbana-Champaign, University of
California Santa Cruz, Santa Fe Institute.

**Other academic/professional organizations still favicon-based:**
Sociedad Matemática Mexicana, Stevens Institute of Technology,
International Society of Pharmacovigilance, New York Institute of Finance,
Google Cloud, IBM, Microsoft, Interactive Brokers, Packt, DataCamp,
Pragmatic AI Labs.

**Other companies, governments, and publishers still favicon-based:**
OpenAI, Elsevier, Springer Nature, Government of Mexico, Gobierno de Puebla,
CME Group, MAPFRE, Coppel.

**Third-party hosted image needing periodic verification:** IESE Business
School; its image is served from a third-party website rather than a
university-controlled asset. Its attribution and liveness should be checked
before replacing it.

Site-native quality improvements already present:
UDLAP (academic and orange versions), CIMAT, Paletas Loreto, MAA/Putnam,
FIRA, and Kaxa Nuk. NYU uses a Wikimedia vector link. See the registry for
individual paths and source URLs.

## Reproducible check

Run `node scripts/audit-cv-organization-logos.mjs` from the repository
root to re-audit new CV records. Store any newly sourced institutional logo
inside `assets/img/cv-organizations/` when permitted, use a reliable
vector where possible, and keep `docs/CV_HANDOFF.md` up to date.

## Scope and limitations

- Matching is textual and first-match-wins; it cannot detect whether remote
  images load or how they look on a particular browser.
- One display label may refer to a compound organization; the renderer uses
  the most specific matching named institution.
- Placeholder roles and generic software categories should not receive
  invented organizational marks.
