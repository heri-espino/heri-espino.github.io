# Research discoverability, indexing, and agent handoff

## Purpose

Provide an auditable, public set of research sources to search engines, retrieval-augmented AI tools, and software agents without exaggerating manuscript status or disclosing unverified/private research material.

## Public entry points

- Human-readable generated index: https://heri-espino.github.io/research-index/
- Machine-readable Jekyll-generated JSON catalog: https://heri-espino.github.io/research-catalog.json
- Experimental AI-reading convention: https://heri-espino.github.io/llms.txt
- Papers: https://heri-espino.github.io/papers/
- CV: https://heri-espino.github.io/cv/
- Sitemap: https://heri-espino.github.io/sitemap.xml
- robots.txt: https://heri-espino.github.io/robots.txt

The index and JSON catalog derive from site.pages, site.projects, site.pages (including separately published authored articles), site.data.cv, site.data.press, and site.data.credentials. Do not duplicate a manual publication count: the source records and status values must be kept current. The existing custom sitemap iterates over site.pages and site.projects; the research-index page is included automatically. The structured JSON file and llms.txt are intentionally not separately indexed as HTML pages.

## Status provenance and precedence

1. Individual research-page front matter: _pages/papers/*.md (title, authors, label, status, links).
2. _data/cv.yml for the CV's public record; synchronize status wording when independently verified.
3. _bibliography/papers.bib for public citations. Use @unpublished / a note describing review rather than an @article with fake volume/issue/DOI.
4. docs/CV_HANDOFF.md and AGENTS.md for rationale and fact checks.
5. External editorial systems and actual acceptance/submission correspondence, when explicitly supplied by the owner (not published without consent).

**As audited 2026-10-28:** the Computational Geometry stepping-stone page says "Under Revision" while the CV, BibTeX, and a later AGENTS.md note use "Under Review". The difference may reflect stages of the same editorial process. **Do not silently normalize it**; request direct owner evidence before changing either status. Other distinct records on the site refer to TMLR and SN Computer Science; never assume there are exactly two current submissions just because an older summary mentioned two Elsevier manuscripts.

An "Under Review" label does not imply acceptance, publication, a DOI, or that a public preprint exists. Blinded material must preserve its anonymity. Working drafts, tutorials, lectures, and unverified submissions must remain clearly distinct.

## Structured data

- The homepage exposes a public Person JSON-LD record with public identity links.
- Each research-detail page exposes ScholarlyArticle JSON-LD for manuscript-like works and LearningResource for lectures/tutorials, including the current explicit label and summary.
- Do not set datePublished, publisher, journal issue, DOI or acceptance metadata for an unaccepted item.
- Structured data and llms.txt **do not guarantee** indexing, rich results, citation by AI tools, or future model memory. They simply make publicly visible claims easier to parse.

## Search Console and external profiles

The repository already contains the Google verification HTML file. That is **not proof of current Search Console ownership or indexing**. The owner should:

1. Open https://search.google.com/search-console and confirm the verified property for the canonical site.
2. Submit https://heri-espino.github.io/sitemap.xml, then inspect /research-index/ and each submitted manuscript URL using URL Inspection.
3. Check which pages are indexed and why others are excluded. Request indexing only where appropriate.
4. Maintain verified ORCID, Google Scholar, SSRN and ResearchGate identity links. Add preprints or DOIs only **after** an actual public release and after confirming journal preprint/anonymity policies.

Use Google Search Central's URL Inspection and structured-data documentation to assess crawlability. Google has no obligation to index pages promptly, and JSON-LD is not a ranking guarantee.

## Reproducible checks

From the repository root:

    node scripts/validate-research-index.mjs
    docker compose run --rm --no-deps --entrypoint bundle jekyll exec jekyll build --destination /tmp/_site --quiet

After building, inspect /tmp/_site/research-catalog.json with a JSON parser, and /tmp/_site/research-index/index.html plus /tmp/_site/llms.txt for correct links and statuses. Also run Prettier and test/style_contract.js as required by AGENTS.md. In remote agent contexts without Docker, do not claim a local Jekyll build took place; let PR CI validate the site.

## Update checklist

1. Update manuscript's front matter on verified status changes.
2. Synchronize _data/cv.yml, _bibliography/papers.bib, and any handoff notes as appropriate.
3. Validate that linked PDF/preprint/DOI URLs actually exist and are public.
4. Build the site, check machine-readable JSON, generated HTML JSON-LD, and the sitemap.
5. Commit code, evidence-based metadata and tests to a branch; push and review the PR. Never merge without approval.

## Current archive stage grouping

The current site deliberately keeps its submitted-manuscript and working-draft groupings in `_pages/papers.md`; the new public index and JSON catalog always use each individual record's own status field, including any known disagreements with the CV or archive. Do not silently move a contested item between categories merely because its source front matter says `Under Review`. Keep the separate `Published Articles & Technical Writing` archive section for independently published technical articles, which must not be represented as peer-reviewed journal publications.
