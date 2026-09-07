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
- Repositories: `/repositories/`
- Contact: `/contact/`

Additional archive routes linked from the homepage are:

- Academic Projects: `/academic-projects/`
- Posters & Presentations: `/presentations/`

Do not rename routes or navigation labels without an explicit request.

## CV State

The web CV is intentionally hidden but restorable:

- `_pages/cv.md` has `published: false` and `nav: false`.
- The homepage CV link is commented out in `_pages/about.md`.
- The header contains a comment showing where to restore `CV|/cv/`.
- CV data and rendering files remain in the repository, but no downloadable public CV PDF exists.

To restore it, remove `published: false`, set `nav: true`, restore the homepage link, and add `CV|/cv/` to `_includes/header.liquid`. Revalidate privacy before committing.

## Homepage Composition

The homepage is `_pages/about.md`. It is a curated overview with at most two visible cards per category and full archive links.

Current content sections are Papers, Projects, Academic Projects, Posters & Presentations, Notes, and Contact. The reusable selected-items pattern lives in `_includes/portfolio/section.liquid`; Contact is deliberately separate.

Only use “Selected” when more records exist than are shown. Sections with additional records show a blurred partial row of at most two more cards; each blurred card links directly to the section archive. Keep the top archive link, linked heading, teaser, and lower archive CTA consistent. Academic Projects also links to LinkedIn for certifications and awards.

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
