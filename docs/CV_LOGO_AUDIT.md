# CV organization logo audit

Audit performed: 2026-10-28. Sources: `_data/cv.yml`, `_data/cv_organization_logos.yml`, `_data/credential_issuers.yml` and the user's uploaded Colegio Loyola emblem.

## Result

The previous audit recorded **83 organization references** across **65 distinct display labels**.
Following the library-authorship update, the previously generic software
categories have been replaced by named project identities. The two remaining
unmatched generic placeholders are *Research draft* and *Data Scientist*;
neither should be assigned a fictitious institution.

| Display label | CV entries | Action |
| --- | ---: | --- |
| Open-source Python library | 0 | Resolved: Trend Estimation and AwesomeFigures now use named project identities and original SVG marks |
| Independent research software | 0 | Resolved: Docling Math now uses a named project identity and original SVG mark |
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
- **Actinver:** the owner provided the exact preferred square A-dot icon.
  It is now hosted locally at `/assets/img/cv-organizations/actinver.webp`
  (128 px optimized for the CV's 16 px appearance), replacing the prior
  wide Wikimedia wordmark and the earlier low-resolution favicon.

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

## Library branding update (2026-10-28, later revision)

Added original editable SVG icons for **AbaQuant**, **ProximityGraphs**,
**Trend Estimation**, **AwesomeFigures**, and **Docling Math**. These
project-logo rules match named library identities in `_data/cv.yml` and
remain subordinate to the `Show icons` setting. The role fields credit
authorship/coauthorship, rather than incorrectly labeling self-authored
packages as third-party contribution work. The uploaded Actinver A-dot
logo supersedes the earlier source and its wide-wordmark styling.
Run the audit script to get new counts; previous counts in this document
are historical snapshots, not current tallies.
