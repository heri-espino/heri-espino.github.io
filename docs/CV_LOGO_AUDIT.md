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
Google Cloud, IBM, Microsoft, Interactive Brokers, Packt, DataCamp.

**Other companies, governments, and publishers still favicon-based:**
OpenAI, Elsevier, Springer Nature, Government of Mexico, Gobierno de Puebla,
CME Group, MAPFRE, Coppel.

**Third-party hosted image needing periodic verification:** IESE Business
School; its image is served from a third-party website rather than a
university-controlled asset. Its attribution and liveness should be checked
before replacing it.

Site-native quality improvements already present:
UDLAP (academic and orange versions), CIMAT, Paletas Loreto, MAA/Putnam,
FIRA, and Kaxa Nuk. NYU uses a direct Wikimedia-hosted stacked official vector; Pragmatic AI Labs uses its own site-hosted logo. See the registry for
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

## NYU and Pragmatic AI Labs official identity fixes (2026-11-02)

The prior `nyu` issuer image used a Wikimedia Commons `Special:FilePath` redirected link. It now references the direct high-quality [NYU stacked-color SVG](https://commons.wikimedia.org/wiki/File:Nyu_stacked_color.svg) from NYU's 2016 brand identity artwork: `https://upload.wikimedia.org/wikipedia/commons/6/66/Nyu_stacked_color.svg`. The stacked form is suitable for a square, narrow CV icon without cropping a wide wordmark. NYU's own branding guidance retains the complete torch-and-name lockup.

The `pragmatic-ai` issuer image no longer uses Google's generic favicon. It now uses the [Pragmatic AI Labs official logo image](https://paiml.com/assets/img/logo.png) served from its website. Both issuer keys drive the CV organization icon and the Credentials page; accessible initial/fallback text remains if a remote asset fails. Images are not represented as an institutional endorsement or as user-authored art. The source is an official publisher for Pragmatic AI Labs and a source-attributed Wikimedia vector of NYU branding. Remote availability should be periodically verified.

## 2026-11-15 — NYU and IESE compact-icon source correction

The previous NYU icon was a directly hotlinked stacked-color SVG; the IESE icon was an MBATube-hosted JPEG. Both were fragile for 16px CV marks and printed output (unavailable remote assets, SVG-to-canvas printing complications, or legibility at small sizes).

The current issuer mapping uses the **official institutions' domains** through Google's favicon proxy, requested at 128 pixels:
- `https://www.google.com/s2/favicons?domain=nyu.edu&sz=128`
- `https://www.google.com/s2/favicons?domain=iese.edu&sz=128`

These are institutional website favicons, **not** a claim that the full horizontal wordmarks have been embedded. Preserve the connected credential/CV issuer mappings and the visible fallback icon if network loading fails. A local, institution-authorized square logo can supersede a favicon later. Earlier source histories in this document describe superseded decisions.

## 2026-11-16 — User-provided compact Paletas Loreto, NYU and IESE image sources

The owner explicitly supplied three raster source images for CV logo replacement, superseding the former Paletas Loreto stored image and Google favicon proxy entries for NYU and IESE. The following local WebP assets are optimized from those supplied image pixels at 144×144 for compact rendering and reliable PDF export:

| Organization | User-image source | New local file | Editing |
|---|---|---|---|
| Paletas Loreto | `image(20261116-073609).png` | `paletas-loreto-owner.webp` | Complete square green background and lettering preserved |
| New York University | `image(20261116-073624).png` | `nyu-torch-owner.webp` | Crop the original purple torch square, removing outer checkerboard border and tiny text underneath |
| IESE Business School | `image(20261116-073659).png` | `iese-shield-owner.webp` | Preserve red shield, remove white background and excess margins |

All three live in `assets/img/cv-organizations/`. Do not generate institutional marks from text or unrelated logos; they are user-provided images and not endorsements. Old local assets remain intact. Paletas is connected via `_data/cv_organization_logos.yml`; NYU and IESE connect via `_data/credential_issuers.yml`, reused by CV and credentials. Local URL conversion with `relative_url` now serves both publishing base paths. Asset and browser checks validate WebP signatures, actual image load and source-matched site paths.
