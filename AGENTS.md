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
