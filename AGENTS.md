# Agent Guide: Heriberto Espino Montelongo Portfolio

This repository is a personalized academic portfolio built on the pluginized al-folio v1 starter. It is not a stock al-folio demo. Preserve the portfolio's content, visual language, privacy boundaries, and local overrides.

## Read First

- Read this file before changing the site.
- Read `.github/copilot-instructions.md` and `docs/BOUNDARIES.md` before changing theme/runtime architecture.
- On this workstation, also read `.codex-local/MACHINE_RUNBOOK.md` if it exists. That file is intentionally untracked.
- Use `.agents/skills/al-folio-v1-migration/SKILL.md` for future upstream migrations.

## Safety and Git

- The canonical working branch is currently `main`. Confirm with `git branch --show-current` before editing.
- Do not modify another branch, push, deploy, rewrite history, or discard user changes unless explicitly requested.
- Inspect `git status --short` before and after work. Existing changes belong to the user.
- Never stage or publish `.codex-reference/`, `.codex-preview/`, `.codex-local/`, `Neue-Haas-Grotesk-Font/`, `node_modules/`, or Windows `Zone.Identifier` files.
- `.codex-reference/` contains private source material, including the real CV. It may be read only when the user requests factual extraction. Never expose its files, contents wholesale, or local paths.
- Before a commit involving private reference work, run:

```bash
git check-ignore -v .codex-reference/cv/Heriberto_Espino_Montelongo.pdf
git status --short --ignored .codex-reference
git diff --cached --name-only
```

## Public Identity and Content Rules

- Name: Heriberto Espino Montelongo.
- Canonical GitHub identity: `https://github.com/heri-espino`.
- Canonical portfolio URL: `https://heri-espino.github.io`.
- Canonical LinkedIn identity: `https://www.linkedin.com/in/heri-espino/`.
- `_data/socials.yml` is the source of truth for public email and social usernames. Prefer its Liquid values over duplicated strings.
- Do not invent or reinterpret accomplishments, collaborators, institutions, dates, titles, awards, metrics, links, or project claims.
- Preserve public PDF paths and factual wording unless the user explicitly supplies a correction.
- Do not reintroduce al-folio demo people, publications, awards, jobs, social links, or placeholder content.

## Current Navigation and Routes

The persistent navigation is defined explicitly in `_includes/header.liquid`:

- Home: `/`
- Papers: `/papers/`
- Projects: `/projects/`
- Notes: `/notes/`
- Contact: `/contact/`

Additional archive routes linked from the homepage are:

- Academic Projects: `/academic-projects/`
- Posters & Presentations: `/presentations/`

Do not rename routes or navigation labels without an explicit request.

## CV State and Print Workflow

- The public CV is enabled at `/cv/`, linked from the homepage and top navigation.
- The structured, public source of truth is `_data/cv.yml`. Keep claims, dates, institutions, and links backed by evidence; edit the data before editing output markup.
- `_includes/cv/render.liquid` renders the page, `assets/js/cv-customize.js` handles chronological sorting, section selection, and print controls, and `_sass/_cv.scss` contains page-scoped styles.
- Available printable designs are **Personal · navy**, **Harvard-inspired · classic** (not official), **Europass-inspired · European CV** (independent, not EU-issued), **Modern minimal**, **Research editorial**, and **Compact professional**, all one column. The latter is not an official university template. Changing fonts, accent colors, paper size, spacing, margins, content visibility, print entry inclusion, live preview mode, and included sections must not alter the underlying CV data. Titles should link to sourced resource URLs, and institution/employer links require verified YAML values.
- Institution/organization marks on the CV are defined in `_data/cv_organization_logos.yml`; reuse `_data/credential_issuers.yml` where possible. Load logos only from documented organization sources and retain the generic accessible-name-preserving pictogram fallback when an asset is missing or blocked. The **Show icons** toggle hides both. Never invent a third-party logo.
- The on-screen preview assembles numbered A4/Letter sheets from visible records; the original `#cv-document` remains the only printable source. The browser Print / Save as PDF dialog controls final pagination. A collapsible left settings panel retains a persistent print/export button, even when the panel is hidden. Keep all records readable without JavaScript.
- The LaTeX source and original PDF may contain private contact details and remain outside this public repository. Do not check in the uploaded source or private PDF merely to provide a downloadable CV.
- The uploaded XeLaTeX variant uses Helvetica Neue when available and a portable font fallback otherwise; inspect every compiled page and logs after changes.
- See `docs/CV_HANDOFF.md` for usage, validation, and the remaining fact-check checklist.

## Homepage Composition

The homepage is `_pages/about.md`. It is a curated overview with at most two visible cards per category and full archive links.

Current content sections are Papers, Projects, Academic Projects, Posters & Presentations, Notes, and Contact. The reusable selected-items pattern lives in `_includes/portfolio/section.liquid`; Contact is deliberately separate.

Only use “Selected” when more records exist than are shown. Sections with additional records show a blurred partial row of at most two more cards; each blurred card links directly to the section archive. Keep the top archive link, linked heading, teaser, and lower archive CTA consistent. Academic Projects also links to LinkedIn for certifications and awards.

Project placement is explicit through `portfolio_section`: use `projects` for the three primary research/software projects, `academic-projects` for course projects, and `presentations` for posters or presentations. Archive and homepage ordering comes from `importance` within each section.

## Content Model

- Papers are Markdown pages under `_pages/papers/` with `portfolio_type: paper`.
- Notes are Markdown pages under `_pages/notes/` with `portfolio_type: note`.
- Software, applied, course, and presentation records are in `_projects/`.
- Ordering is controlled by numeric `importance`.
- `label`, `status`, `card_kind`, and optional `presentation_type` control classification.
- `image` is the curated card thumbnail.
- `detail_image` is the detail-page preview and should show the PDF's complete first page in its natural orientation when a PDF exists.
- `pdf`, `secondary_pdf`, `github`, and `external_url` control detail-page actions.
- Public PDFs live under `papers/`, `projects/`, `notes/`, or `academic-projects/`. Never substitute a private source PDF.

The card and detail previews are intentionally independent. Do not replace a curated card image when changing a detail-page first-page preview. Detail previews must fit narrow screens without side framing or page-level horizontal overflow.

## Visual System

- The active site font is the locally served Helvetica Neue face at `assets/fonts/helvetica-neue-regular.woff2`, configured in `_sass/_academic-theme.scss`.
- The eight editable palette values are `--portfolio-color-1` through `--portfolio-color-8` in `_sass/_academic-theme.scss`.
- Primary light-mode accent: `#123b63`; darker interaction state: `#0a2742`.
- Mathematics uses `#34495e` in light mode and `#d2dce5` in dark mode.
- Do not reintroduce violet, magenta, pink, or purple into custom portfolio components.
- Light mode is the first-visit default. The user's explicit theme choice may persist in `localStorage`.
- Clickable elements use subtle scale/colour motion. Scroll reveals use the slower shared duration and respect `prefers-reduced-motion`.
- Maintain visible keyboard focus, accessible contrast, and no page-level horizontal overflow.
- Cards do not have action-link rows or the divider that used to precede them. Card images and titles remain links; actions belong on detail pages.

Main custom presentation files:

- `_sass/_academic-theme.scss`: palette, font, semantic theme variables, motion tokens.
- `_sass/_portfolio.scss`: portfolio layouts, cards, detail pages, interactions, responsive behavior.
- `assets/js/theme.js`: light-first theme behavior, page-entry motion, and scroll reveals.
- `_includes/portfolio/card.liquid`: card markup.
- `_includes/portfolio/section.liquid`: homepage selected/archive pattern.
- `_layouts/portfolio-item.liquid`: paper, note, and project detail pages.

## Mathematics

- Math is enabled through al-folio's native `al_math`/MathJax integration (`enable_math: true`).
- Inline math uses `\( ... \)`.
- Display math uses `$$ ... $$`.
- Preserve mathematical meaning exactly; do not convert equations to images.
- Display containers must scroll internally when unavoidable and must not create page-level mobile overflow.
- Regression pages include:
  - `/papers/unit-region-factorization.html`
  - `/papers/stepping-stone.html`
  - `/notes/random-variables-as-vectors.html`

## al-folio v1 Ownership

The starter normally owns wiring, content, documentation, and integration tests; shared runtime behavior belongs to the owning `al-*` gem. This personalized site intentionally keeps a narrow set of local overrides. `test/style_contract.js` contains the reviewed allowlist.

Do not add new files under `_includes`, `_layouts`, or `_sass` without reviewing the ownership boundary and updating the allowlist deliberately. Run the style contract after any override change.

## Required Validation

Run from the repository root:

```bash
docker compose run --rm --no-deps --entrypoint bundle jekyll exec jekyll build --destination /tmp/_site --quiet
docker compose run --rm --no-deps --entrypoint node jekyll node_modules/prettier/bin/prettier.cjs . --check
docker compose run --rm --no-deps --entrypoint node jekyll test/style_contract.js
git diff --check
```

The Prettier command assumes the ignored local `node_modules/` directory exists. See the private machine runbook for setup and alternatives.

For visual work, start the Docker site and verify desktop/mobile, light/dark mode, keyboard focus, navigation, mathematical rendering, image aspect ratios, and horizontal overflow. Do not claim visual verification unless it was actually performed.

- The latest CV reference is a user-supplied private XeLaTeX source (2026-10-28). **Never publish the private TeX sources, phone number or personal details** as website artifacts.
- Default CV mode is **full-width reading / Balanced spacing**; the optional paper preview and actual browser printing default to **LaTeX · extra compact**. Keep one shared customization menu with separately remembered reading/paper densities. Printing temporarily applies the current paper density and restores the reading view afterward. A selectable description-marker control defaults to em dashes, with bullets or no markers also available. The structured YAML follows the LaTeX's intended section order while preserving additional verified records. Do not reintroduce copied mismatched library descriptions or out-of-date research statuses.
- Optional `role` and `subtitle` entry fields support role/activity typography without discarding canonical titles or URLs. Source notes and detailed reconciliation are maintained in `docs/CV_HANDOFF.md`.

- The CV starts full-width with **collapsed settings**: icon-only chevron at upper left and a print icon below. Do not restore a wide button toolbar by default. Keyboard and screen-reader labels must remain functional. The theme back-to-top control is disabled site-wide in `_config.yml` (`back_to_top: false`), with CV CSS retained as defensive fallback.
- CV icons appear **only beside institutions/organizations**, using verified logos or fallback pictograms; do not insert icons before position titles, awards, credentials, skills or languages. Preserve the `Show icons` toggle in both screen and PDF layouts.
- The CV **Credentials** section is a curated snapshot of `_data/credentials.yml`: completed specializations first, then independent courses in exactly their source order. Do not invent statuses or copy constituent courses as new distinct specializations. When editing credentials, update both sources together or use a verified synchronization workflow.
- Both first-author Elsevier manuscripts in the CV are **Under Review**, respectively at *Discrete Applied Mathematics* and *Computational Geometry*; do not revert the second to 'under revision' without new user-provided evidence.

- The owner's UDLAP crest applies to academic-section CV entries; the orange UDLAP wordmark applies to professional/nonacademic entries. Both and the owner-supplied Paletas Loreto, MAA/Putnam, FIRA and Kaxa Nuk logos are stored locally as optimized WebP assets under `assets/img/cv-organizations/`; keep fallback icons for loading failures. The redundant second "Academic Assistant in Matrix Theory Course" entry is intentionally removed.

- The `/papers/` archive puts all unsubmitted manuscripts, lectures and tutorials in the **Working Drafts & Ongoing Research** section below actual submitted manuscripts; it has **no separate Featured section**. The first item in the working-draft grid is *Smoothness-Integrated Trend Distances with Nonzero Difference Drift*. Its detail page is `_pages/papers/smoothness-integrated-trend-distances.md`.
- The same trend-distance manuscript appears first in the CV Research section. Do not conflate its mathematical definitions and synthetic example with empirical change-point validation or a completed agricultural application. The PDF upload remains a chat attachment and is not a website asset: do not add a `pdf` link until a real public PDF is published.

- Five uploaded manuscripts/learning documents (Oct 2026) and the earlier smoothness-distance draft are in the same **Working Drafts** grid, sorted by `importance`, never marked `featured: true`; the Submitted Manuscripts section remains above them. The two research-manuscript drafts and the blinded WTI draft have **unverified submission** and must never be silently reported as accepted/under review. The 53-slide Componentwise Isomap item is a **lecture** and the seven-page Max-Cut/EVA item is a **tutorial**, not submitted papers.
- Their corresponding five entries appear just after the smoothness-distance first entry in the CV Research section. Keep the coauthor Daniela Cortés-Toto on the PLS Python manuscript; preserve anonymity of `remef_blinded_draft.pdf` in its public portfolio page. These five PDF binaries are not yet hosted; do not generate links to nonexistent PDF assets. Follow `docs/CV_HANDOFF.md`.

- The CV organization-logo coverage audit is `docs/CV_LOGO_AUDIT.md` and its reproducible, dependency-free checker is `scripts/audit-cv-organization-logos.mjs` (`node scripts/audit-cv-organization-logos.mjs`). Colegio Loyola's owner-provided mark is stored locally as `assets/img/cv-organizations/colegio-loyola.webp`. BUAP uses sourced vector artwork; Actinver now uses the owner's uploaded square A-dot logo (`assets/img/cv-organizations/actinver.webp`), not the earlier Wikimedia wordmark. All source code for the five CV-only Python-library icons is local SVG. Remaining unmatched labels are generic noninstitutional placeholders, not schools or employers. For recognized institutions still on Google favicons, prefer properly sourced institutional identity assets before replacing them; never invent brand graphics.

- The six newly documented PDFs are represented by **twelve real, owner-provided PDF-page screenshot assets** stored at `assets/img/portfolio/pdf-page-shots/`. Each card `image` is a cropped figure-page AVIF; each portfolio detail `detail_image` is the PDF's first-page AVIF. Keep them separate and keep source-page provenance in `docs/CV_HANDOFF.md`. Original PDFs are not hosted by this image-only update.

- Regression guard for the Papers archive: six October 2026 research uploads
  previously failed to publish due to literal `\\n` text between YAML
  front-matter keys. Jekyll can emit YAML warnings while returning a
  successful overall build. The rendered archive must contain **3 Submitted**
  plus **13 Working Drafts** (the original seven plus six uploads), and all
  six `/papers/<slug>.html` pages must exist. The deploy workflow now runs
  `node scripts/verify-paper-archive.mjs` after Jekyll; do not remove or
  bypass this check. Preserve the user's figure card / first-page preview
  distinction.

- In the CV's Programming Experience section, **AbaQuant**, **ProximityGraphs**, **Trend Estimation**, **AwesomeFigures**, and **Docling Math** carry distinct CV-only SVG project marks under `assets/img/cv-organizations/` and corresponding named `organization:` identities. The individual's role includes author credit: **Author & Lead Developer** for AbaQuant, **Co-author & Maintainer** for the collaborative ProximityGraphs, and **Author & Maintainer** for Trend Estimation, AwesomeFigures and Docling Math. Do not change the separate OpenAI Python SDK role from **Contributor** to author. Project marks belong only beside the project/organization line, not titles or skills.

- Four-field CV event metadata contract: every event-based record has its canonical title, role/category, date, and real institution/organization **or** a non-institutional `context`. The CV template renders context without an organization logo. Static `Technical Skills` and `Languages` have different structures and should not receive fabricated dates. Descriptive bullets are optional and intentionally absent from some credentials; preserve previously requested omissions. Do not invent dates or journal affiliations. The affected unknowns are three active Python-library start dates and the issue date of the DataCamp introductory PyTorch credential. Four-field consistency is tested in `test/style_contract.js`; see `docs/CV_HANDOFF.md`.

- The six 2026 working-draft/lecture/tutorial PDFs have now been uploaded to the public site and use the exact `papers/EspinoMontelongo-2026-Short_title.pdf` scheme (see `docs/CV_HANDOFF.md`). Preserve their PDF binary data, canonical links in both `_pages/papers/` and `_data/cv.yml`, figure-card thumbnails, and first-page detail previews. `scripts/verify-paper-archive.mjs` verifies built PDFs as well as the existing 3-submitted/13-draft count. Do not silently revert to old upload names or the earlier "PDF not hosted" assumption.
- Caution: the public `EspinoMontelongo-2026-WTI_Asian_Options.pdf` identifies an author while the WTI document is a blinded draft. Publicity does not establish journal submission. Warn before reusing it in an anonymity-required review workflow.

- Harvard CV template: preserve the owner-requested four-corner **header only**: **organization + logo** left/top, **role/title** left/below; **city/state** right/top, **date** right/below. This style is scoped to `data-cv-template="harvard"` and applies to wide, paper preview and print. It must not turn the CV into two content columns, hide source links, add icons to job titles, or override the em-dash description setting. Unaffiliated research can show its factual `context` above the role, not a fabricated institution. Regression guard is in `test/style_contract.js`.

- The CV settings-chevron is **name-anchored**, not viewport-fixed: positioned absolutely beside the CV header. The separate print button was removed at the owner's request; browser Ctrl+P / Cmd+P still works. They scroll away with the header and must **not reserve a left rail/gutter** for the remainder of the document. Expanding the customization menu overlays a scrollable panel without shifting the icons or CV body. The header alone gets a compact inset. Keep them excluded from print. See `test/style_contract.js`.

- CV research is separated into **Research** (11 records: 3 submitted manuscripts, 4 internal research reports and 4 additional research projects) and **Research Drafts** (8 records: unsubmitted manuscripts, tutorial/lecture, mathematical notes). Source order is in `_data/cv.yml`; both sections must be available in settings and chronological/print views. Do not relabel a lecture or tutorial as a journal submission.
- The three first-author submitted papers have user-confirmed CV and paper-page display dates: **Unit-Region Factorization — Jun 2026**, **Stepping–Stone — Aug 2026**, **When Do Activation-Patching Effects Add Up? — Oct 2026**. Do not attach `— Present` to submission-month dates. Preserve original review statuses pending direct evidence of changes. The SN Computer Science organizational line is **not** a hyperlink; remove only its `organization_url`, leaving portfolio/PDF/reproducibility links untouched.

- **AbaQuant published writing:** The La Catarina 26 Oct 2026 `AbaQuant. Finanzas matemáticas, valuación y gestión del riesgo` article is coauthored by Heriberto Espino Montelongo and Owen Paredes Conde. It belongs in the Papers page's separate **Published Articles & Technical Writing** category (and matching CV section), not in Press & Media, Submitted Manuscripts or Working Drafts. Its page uses `portfolio_type: article` and the owner-supplied local AVIF screenshot. Keep the 3 submitted / 13 drafts counts and 1 published-article count in rendered-page checks. See `docs/CV_HANDOFF.md`.

- Europass mode must follow the European Commission CV information architecture: **Work Experience → Education and Training → Personal Skills (mother tongue, other languages, digital skills) → Additional Information**. Preserve all user-selected CV sections, reorder only the Europass presentation, and show the date in a left column with qualification/role/employer to the right. Never fabricate missing CEFR subskill scores or claim the output is an official EU-issued Europass PDF. All sections must appear in the A4/Letter paper preview and browser print, and source YAML stays intact.
- Harvard paper preview and the real print version must match the requested two-sided heading (organization/name left, city/date right) at *physical page width*, including on narrow browser windows. No excessive viewport-dependent word wrapping. The only left-header control is the settings chevron; do not reintroduce the printer icon. Browser interaction checks are in `test/visual/interactions.spec.js` and static checks in `test/style_contract.js`.
