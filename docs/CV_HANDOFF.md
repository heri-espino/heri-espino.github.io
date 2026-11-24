# CV handoff — customizable public page

## Intent and current implementation

The public, Jekyll-generated CV is published at `/cv/` and linked from the
top navigation and home profile. Source: `_data/cv.yml`. Rendering stays
in the existing `_includes/cv/render.liquid` local override, with
`assets/js/cv-customize.js` and `_sass/_cv.scss`.

User-selected options (client-side and independent of Jekyll):

- Grouped by existing YAML section order (default).
- Global chronological order, newest/oldest first, with source section labels.
- Show/hide any CV section for both preview and print.
- Expand/collapse every section's reading view with native `details`/`summary` headings (all open without JavaScript).
- Arrange grouped sections by dragging or keyboard-accessible Up/Down buttons; save this order locally in the browser. The print/paper preview reflects the order but always includes entries from collapsed sections.
- Personal navy single-column print design or Harvard-inspired classic single-column design.
- Template-default, Arial, Georgia, Times New Roman or Garamond-family typography.
- A4 or US Letter and balanced/compact spacing.
- Browser Print / Save as PDF; Reset returns the original layout.

**Harvard-inspired** means an independent conservative academic style. It
is neither official nor endorsed by Harvard University.

Chronology uses the *start* date of a range (e.g., an Aug 2023--Dec 2026
expected degree sorts as Aug 2023). Month/year values have month precision;
unknown dates are last. Undated Technical Skills and Languages remain at
the end of the chronological view. No JavaScript means the YAML grouped view
remains visible.

The browser controls printing; its own page header/footer settings and
installed fonts can affect pagination. The standalone, carefully typeset
XeLaTeX PDF is **not** identical to a browser-generated PDF.

## Provenance and privacy

This change was initiated from a user-supplied XeLaTeX source, color file,
template, and AI_HANDOFF, on 2026-10-27. The LaTeX build required a fallback
for Helvetica Neue Light and Google Sans Code. A copy built successfully
with XeLaTeX in the agent runtime, yielding two A4 pages after tightening
vertical page margins. Those source files are deliberately **not** copied
to this public repository: the original CV includes a phone number and
contains private-source formatting material. The web CV continues to use
public contact links only.

Education was originally reconciled to the uploaded source: Data Science expected
Dec 2027, GPA 9.6/10; Actuarial Science expected Dec 2026.
On 2026-11-09, the owner explicitly corrected **both** expected degree
completion dates to December 2026; `_data/cv.yml` is authoritative. The Mathematics
Learning Center role title was updated, and the AbaQuant entry was added
using URLs already stated in the uploaded CV. Legacy URLs for verified
migrated public GitHub repositories point to the heri-espino account.

## How to maintain

1. Verify any date, title, award, or claim against the CV or public project record.
2. Edit `_data/cv.yml`, not generated HTML. Prefer links to existing site
   detail pages or directly verified documents.
3. If print controls change, keep matching IDs in Liquid and JS and update
   the contract checks in `test/style_contract.js`.
4. For CSS, preserve the local override allowlist and reduce-motion,
   light/dark, mobile, accessible focus, and print behaviors.
5. Compile the standalone LaTeX source with
   `latexmk -xelatex -interaction=nonstopmode -halt-on-error Heriberto_Espino_Montelongo.tex`
   on the machine where that source is stored. Verify page count and inspect
   rendered pages.
6. For the website, run existing site validation commands in AGENTS.md,
   including `node test/style_contract.js`, a Jekyll build, and a Chromium
   print-preview check (both templates, both page sizes, grouped/timeline
   sorting, and closed expandable sections).

## Remaining editorial verification

The existing web YAML predates the user-supplied LaTeX and has entries that
may need further reconciliation, especially professional highlights,
scholarships, projects, medals, and certification descriptions. Avoid silently
substituting one version for another where contradictory claims lack
verification. Keep the website's public privacy boundary intact.

Do not merge or deploy a draft PR without the user's authorization.

## Update — programming experience and Springer review (2026-10-27)

The CV now distinguishes **Programming Experience** from **Research**. The former
includes AbaQuant, ProximityGraphs, OpenAI Python SDK, Docling Math and
AwesomeFigures. Their URLs and descriptions are grounded in existing project
pages. Docling Math and AwesomeFigures have no invented start dates.

Research includes the Springer Nature *SN Computer Science* manuscript
**When Do Activation-Patching Effects Add Up? Evidence from Controlled CNNs**
(currently under review), and separately lists relevant UDLAP internal reports
and the WTI Bayesian uncertainty draft from the supplied LaTeX source.
The Stepping-Stone manuscript is marked **under revision** in accordance with
its current public paper record. Paper detail pages remain the authoritative
source for status updates. Review changes to publication status before deploying.

Only PR #13 was open when this update was made; this PR contains the cumulative
customizable-CV work. Source changes are committed on the feature branch.

## Single-column typography update

Both browser-print templates and the on-screen section grids now use one
content column. Entries retain dates right-aligned where space permits. Bold
role/title headings improve scanning; `cv-keyword` spans apply semantic
semibold emphasis to selected technical phrases in bullets without modifying
the YAML text. Academic and company-type pictograms appear before organization
names, but are not official brand logos and are hidden from assistive tech.

The owner also received a separate single-column XeLaTeX PDF and zipped
LaTeX sources in the conversation; the underlying personal LaTeX sources
remain outside the public website repository. The PDF has seven A4 pages
because source entries were preserved rather than abridged.

Regression: inspect on-screen section cards, print to A4/Letter with both
templates, verify zero multi-column flows, keyword weights, and meaningful
institution icon fallbacks. Manual approval is required before merging this
follow-up PR.

## Live preview, expanded templates, and linked items

The CV customizer now offers five single-column variants: Personal navy,
Harvard-inspired classic (unofficial), Modern minimal, Research editorial,
and Compact professional. Color choices are template default, velvet blue,
sapphire, teal, forest, burgundy, graphite, or a user-picked hex color.
All controls feed one CSS-scoped preview and browser-print layout.

The default view is a scrollable paper-width **live preview** (A4 or Letter);
the full-width view toggle is for easier screen reading. The simulated page
width cannot predict exact browser pagination; **Print / Save as PDF** opens
the browser's accurate paginated preview before output.

CV title links resolve to `entry.url` or, if absent, `entry.links[0].url`.
Original resource buttons remain. Institution and employer names are linked
only when public, sourced `institution_url` or `organization_url` values
are present in `_data/cv.yml`. No invented certificates or event proof.
Printed PDF text retains clickable links; optional "Show full resource URLs"
prints the raw URLs for records with explicit resource links. Unverified
records remain plain text until a verified link is supplied.

Check contrast for custom user-selected colors and mobile behavior. Institutional
icons remain generic category pictograms, not official brands. Template, inclusion and print settings are
ephemeral to the current page and are reset by Reset options. The custom
section order alone is stored in `localStorage` (`cv-section-order-v1`)
and is also cleared by Reset options. Print settings
never modify the content YAML or private uploaded XeLaTeX sources.

## Granular PDF / print customization

The CV print toolbar has an expandable **Print content and layout** panel:
toggle organization/link pictograms, dates, locations, credential IDs,
organization names, highlight bullets, visible resource link labels, and
header contact links. All are enabled by default; these selections affect
the live paper preview and the PDF output and never modify CV YAML.

The print panel also selects **small / standard / large** base text size
and **8 / 13 / 19 mm** page margins. The `@page` rule receives only the
whitelisted page size and margin values. The paper-width preview reflects
the selected margins and approximate body font size; the actual browser
print dialog is authoritative for pagination.

**Choose individual entries** is a searchable, section-grouped checklist
populated by the original HTML CV entries. Every research item, employment
role, academic activity, award, competition and certification can be
excluded separately. Include-all and exclude-all controls work across
the whole CV (not just search results); a higher-level section checkbox
takes precedence. Grouped layouts hide empty sections; chronological
layouts omit excluded entries, including copied entries. A section's
skill list or language list remains controllable as a whole from the
Sections picker, not as individually selectable entries.

All customizations are ephemeral and can be restored with **Reset options**.
The full dataset, active hyperlink destinations, source PDF files, and
original records are not deleted. The generated PDF reflects the current
selection; it is not a permanent or shared profile change.

## Organization and institution logos (2026-10-27)

The CV now resolves recognized institution/organization names through
`_data/cv_organization_logos.yml`. Most course/certificate issuers reuse
`_data/credential_issuers.yml` rather than defining another asset URL.
Additional organizations use the recognizable favicon from the institution's
official web domain (via Google's favicon endpoint). The register is ordered:
specific names precede broad aliases. No organizational affiliation is inferred
from a paper title or an unaffiliated software project.

Rendering is managed in `_includes/cv/render.liquid`, image-load fallback in
`assets/js/cv-customize.js`, and image sizing/print behavior in
`_sass/_cv.scss`. A Font Awesome pictogram remains visible if a remote
image is unavailable, blocked, or JavaScript is disabled. The existing
**Show icons** toggle hides both real logos and fallback pictograms. Logo images
are decorative and empty-alt; institution names remain available as text.

**Not branded:** Paletas Loreto has no confirmed official logo URL, and Kaxa
Nuk has no confidently identifiable public-domain logo source. Generic
pictograms are deliberately retained rather than assigning another business's
trademark. Descriptive labels (e.g., Independent research software,
Open-source Python library, Research draft, Data Scientist) are also not
represented as company brands.

**Follow-up checks:** Run the site build, style contract, and browser visual
tests, then verify logo loading and the print icon-toggle in Chrome on both
screen and A4/Letter previews. Remote favicon availability may change;
consider vendoring individually verified logo files if the site needs
offline-deterministic printing.


## Paginated on-screen CV preview and Trend Estimation library (2026-10-27)

The paper preview is now rendered as individually numbered A4 or US Letter
sheets, with the chosen font, template, accent, text size, margins and
visibility controls. The screen-only pages are assembled from clones of
the original, user-filtered records, and a section heading is repeated as
"(continued)" when its entries move to another preview sheet. The original
Jekyll-rendered `#cv-document` remains the **only printed document**;
the browser print engine, not the approximate JavaScript page stack, decides
real PDF page breaks. Preview sheets never print.

Single-entry overflow is intentionally not truncated; inspect the browser
Print dialog for the final result. The preview is recalculated on selection,
layout, font-loading and viewport changes. Mobile scaling may differ from
desktop pagination. No new PDF library, third-party service, or private CV
source file is introduced.

The public CV's **Programming Experience** now includes
[trendestimation](https://github.com/trendestimation/trendestimation), a
developing research package separate from the forecasting experiments in the
older Trend-Estimation repository. Its claims reflect the repository README:
difference-order PLS smoothing, spectral computation, classical in-sample
criteria for **fixed numeric means**, and optional plotting. Do not list it
as PyPI-published or invent a start date. The existing project detail page
already links the same canonical repository and needs no duplicate project.

Validation: syntax-check `assets/js/cv-customize.js`, run
`node test/style_contract.js` and the Jekyll build; visually inspect both
paper sizes, all five templates, chronological/grouped layout, entries hidden,
text-size/margin switches and the print-only source document. Confirm that
the browser printout does not duplicate the generated preview sheets.


## Europass-inspired option (2026-10-28)

Added `Europass-inspired · European CV` to the existing template selector,
bringing the set to **six** independently customizable single-column designs.
The style uses a restrained EU-like blue, uppercase section labels, blue
rules, position/date hierarchy, and section names such as `Work experience`
and `Education and training`. It retains custom accent/font choices,
existing English-language CV records, links, A4/Letter, margins, visibility
toggles, chronological ordering, the numbered-page approximation and the
browser's actual PDF output.

The user's previous single-column preference takes priority over classic
two-column Europass form layouts. This is an **independent
Europass-inspired web/print theme**, not a document generated or certified by
the European Union. The UI points to the official
[Europass CV builder](https://europass.europa.eu/en/create-europass-cv)
for an authentic Europass export. Do not copy EU logos, certify compliance,
or invent CEFR listening/reading/speaking subgrades, nationality, date of
birth or photographs not in the verified public CV.

Manual regression: select Europass, confirm section labels switch back
when changing templates, check page stack and print PDF in A4 and Letter,
compare chronological and grouped views, verify per-entry filtering,
and exercise custom accent and font overrides. The site's existing
Jekyll/style-contract tests should remain unchanged except for added
template assertions.


## Collapsible CV sidebar (2026-10-28)

Print / Save as PDF stays available on a compact left-hand toolbar, even
while the **Hide settings / Customize CV** panel is closed. Toggling
`#cv-settings-panel` updates `aria-expanded`, preserves current filters,
and recalculates paper preview width. The sticky desktop sidebar scrolls
independently, while mobile controls appear above the CV preview.
The panel and paper preview clones are excluded from the printed PDF.
The existing source CV remains readable when JavaScript is disabled.

## LaTeX-aligned CV hierarchy, compactness, and default view (2026-10-28)

The user's newly uploaded private XeLaTeX source (`Heriberto_Espino_Montelongo(1).tex`,
`template(1).tex`, and `colors(1).tex`) was compared against the
public CV. **Do not commit these uploaded source files or the phone number
contained in them.**

The public source `_data/cv.yml` now follows the LaTeX section order:
Education, Professional Experience, Programming Experience, Academic Experience,
Awards, Research, Selected Academic Projects, Leadership, Schools, Selected
Extracurricular Activities, Technical Skills, Online Courses, then the website's
additional Languages and Volunteering. The individual programming and research
records were also reordered to mirror the LaTeX's intended presentation.

Structured records can now supply optional `role` and `subtitle` fields. The
CV displays role followed by an activity/subject title, without overwriting the
canonical `name`/publication title used for search, source links, or source data.
Fields introduced from the user-provided document include poster subjects,
award subjects/descriptions, the third summer school, selected course projects,
the Model UN activity and two previously missing certificates. Existing verified
CV research, website links and additional activities have not been deleted.

Known LaTeX inconsistencies were intentionally not copied: the
`trendestimation`, AwesomeFigures, and Docling Math entries contain duplicated
OpenAI SDK descriptions, the Max k-Cut activity contains copied trend-estimation
text and unrelated links, and some older statuses conflict with updated public
research. The corrected website research wording and actual library links take
precedence. Dates that remain uncertain should be reviewed against issued
certificates rather than inferred.

The default mode is **Full-width reading** (not simulated paper pages).
The initial density is **Balanced** in the full-width view and **LaTeX · extra
compact** in the paper preview and actual browser printing. All three
density options remain visible in the **same customization menu** for
both views; each view remembers its own density if changed. Other
customizations (template, font, paper size, colors, selected entries,
marker style, print visibility and layout options) remain shared.
Print continues to use the canonical Jekyll CV source and the
browser's actual pagination, temporarily using the paper density
without mutating the reading-view controls. The private source's visual colors are
`#00104c` ink, `#4c5781` secondary labels, `#666666` descriptions and
`#505050` keyword text; compact print sizes aim for 7.3pt body and 6.5pt
descriptions. All print spacing/font controls, six templates and the left-hand
settings sidebar remain available.

The `Description markers` menu chooses **em dashes**, **bullets**, or **no
markers** in reading, paper approximation, and browser print. The original
descriptions are preserved unchanged when switching marker modes. Compact
styles keep one content column, as previously requested, even though the
reference's visual output used `paracol` for two columns.

Validation: inspect each section's contents against the current source,
including entry-picker labels and Chronological order. Exercise default
full-width view, Paper preview, all three list-marker styles, all densities,
the five nonpersonal templates, the Europass variant, print A4/Letter, reset,
and sidebar expand/collapse. Confirm that private phone/birth/date information
is absent from `_data/cv.yml`.

## Distinct full-width and print defaults (2026-10-28)

- Initial browser layout: full-width reading, Balanced spacing, em dashes.
- Paper preview: same sidebar/menu and em dashes, LaTeX compact spacing by default.
- Browser Print / Save as PDF: uses the current paper-view density even
  when initiated from the wide view. The `beforeprint` handler temporarily
  applies print density; `afterprint` restores wide view styling.
- The dropdown always contains Balanced, Compact and LaTeX options; users
  can customize spacing for each view independently. Switching views
  preserves other selections and does not close the sidebar.
- Reset restores reading/Balanced and paper/LaTeX, as well as em dashes.

Verification: switch wide → paper → wide, customize spacing separately
in both modes, then print from wide and from paper. Check that paper
styles are applied during printing and the wide view is unchanged
after printing or cancelling. The configuration options must be
identical between views.

## Collapsed icon controls and credentials sync (2026-10-28)

The CV defaults to full-width reading mode, Balanced density, and **collapsed**
settings. A 36-pixel chevron-only button at the upper left expands/collapses
the sidebar (accessible label and `aria-expanded` are updated); a separate
print icon sits directly below it when closed. Export remains accessible when
the panel is hidden. The floating site's back-to-top button is suppressed
**only on the CV route**, not globally. On narrow screens the closed control
rail stays to the left of the full-width content.

The public CV shows icons **only beside organization and institution names**,
using a verified issuer logo when available and a neutral Font Awesome icon
otherwise. No icon appears in position titles, credential names, academic
roles, technical skills or languages. The print 'Show icons' switch hides
organization logos and their fallback icons.

`_data/cv.yml` renames Online Courses to **Credentials** and mirrors the
**featured** order of `_data/credentials.yml`: first the ten completed
specializations, then the thirteen independently completed courses. It does
not duplicate the granular constituent course certificates already covered by
their specializations. All 23 entries retain credential IDs and their website
certificate links. Descriptive bullets have been removed for the University of
Pennsylvania corporate-finance and IESE storytelling credentials, as requested.

Two first-author journal manuscripts have distinct current statuses:
Elsevier / *Discrete Applied Mathematics* (LAGOS special issue) and Elsevier /
*Computational Geometry* (**Under Revision**). Neither is marked as accepted or published.
Organization logo matching includes Elsevier and new credential issuers.
The manuscript names (rather than shortened subtitles) remain visible in the
CV, alongside their existing portfolio and PDF links.

Validation: check initial collapsed desktop and mobile layouts, mouse/keyboard
chevron toggle, tiny print icon, single-column full-width CV, the site-wide disablement of
the floating back-to-top control, organization-only logo/fallback icons and their show/hide
toggle, credential order/URLs/count, both research statuses, and HTML/PDF
rendering. Browser visual comparison remains separate from CI when the site's
historical visual baseline is unavailable.

## Organization icons only (2026-10-28)

The owner clarified that icons belong solely to organization and institution
labels. Remove the previously introduced category pictograms before position
titles, course names, technical-skill fields and languages, as well as the
small external-link icon in entry titles. Preserve actual links, the verified
organization logo registry, fallback icons, and the user-selectable Show icons
switch. UI control icons (chevron and print) are distinct interface affordances
and remain.

## Supplied CV logos and removal (2026-10-28)

- Removed the duplicate "Academic Assistant in Matrix Theory Course" in
  Academic Experience. The existing "Academic Assistant — Linear Algebra
  Course" record in Professional Experience is left unchanged.
- Added six small, locally committed WebP logos, derived from images supplied
  directly by the portfolio owner: UDLAP academic crest, orange UDLAP mark,
  Paletas Loreto, MAA/Putnam, FIRA, and Kaxa Nuk.
- `_data/cv_organization_logos.yml` uses `academic_logo` for UDLAP; the
  renderer picks the crest for Education, Academic Experience, Awards,
  Research, Selected Academic Projects, Schools, Selected Extracurricular
  Activities, and Leadership. Professional Experience uses the orange UDLAP
  mark. The other supplied logos match their organization names.
- CV logos render only next to the institution or employer, not titles.
  Every local logo is passed through `relative_url` for subpath deployments.
  Remote issuer logos and broken-logo fallback icons are preserved.
- The large floating bottom-right back-to-top widget was still enabled by
  the Jekyll config even though CV CSS attempted to hide it. The site now
  sets `back_to_top: false` globally; CSS remains a defensive fallback.

Validation includes verifying that all six image assets exist, logo names
resolve to the correct branch asset paths, UDLAP logo variants work in both
reading and print, and the deleted Matrix Theory record is not displayed.

## Featured PLS trend-distance working draft (2026-10-28)

- Source supplied in this chat: five-page October 2026 PDF, *Smoothness-Integrated
  Trend Distances with Nonzero Difference Drift*. Its first-page header states
  **RESEARCH NOTE / WORKING DRAFT**; it contains no journal-submission claim.
- The note belongs to **Working Drafts & Ongoing Research** below Submitted
  Manuscripts. Its `importance: 1` puts it first among working-draft items.
  There is no separately featured section.
- New detail page: `/papers/smoothness-integrated-trend-distances.html`.
  It reflects only the manuscript's actual results: affine nonzero-drift
  penalized trend estimator, normalized Guerrero smoothness, Hilbert-space
  integrated distances, equal/unequal-drift spectral formulas, level-versus-shape
  decomposition, and rolling/smoothness–time discrepancies.
- The synthetic example is illustrative, not agricultural validation or a
  calibrated statistical change-point test. Retrospective PLS can leak
  future data when describing online changes.
- `_data/cv.yml` lists this title **first** in Research, explicitly as
  **Working Draft (Not Submitted)**, linking to its new portfolio page and
  the related research code.
- The uploaded original PDF is not yet hosted in the website repo. Do not
  expose a fake `pdf:` field or broken `Open PDF` link until the original
  binary is committed through an authorized binary-upload mechanism.
  The portfolio page notes this limitation and does not mislabel the related
  source-code repository as the manuscript PDF.

## Five additional research and teaching PDFs (2026-10-28)

The user supplied five distinct PDFs; each now has its own public portfolio
page and a CV Research record. **None has been newly marked as submitted,
accepted, or under review merely because it uses a journal template.**

| Uploaded source | Portfolio slug | Verified document type / scope |
|---|---|---|
| `EspinoMontelongo-2026-Forecast_Optimal_Smoothness.pdf` (13 pages) | `dynamic-forecast-optimal-smoothness` | Manuscript draft by Heriberto; forecast-loss minima tracking, branch decisions; mixed results; template journal metadata are placeholders |
| `sncs_main.pdf` (19 pages) | `smoothness-indexed-pls-python` | Coauthored manuscript draft (Heriberto Espino-Montelongo and Daniela Cortés-Toto); Python PLS smoothness and 80,640-record numerical benchmark; submission not verified |
| `remef_blinded_draft.pdf` (17 pages) | `posterior-integration-volatility-wti-asian-options` | Blinded bilingual manuscript draft; posterior-integrated vs historical/lagged implied volatility WTI APO pricing; no public byline inferred or PDF hosted |
| `componentwise_knn_isomap_lecture.pdf` (53 slides) | `componentwise-knn-isomap-lecture` | Mathematical lecture of EXP-010/011 and proposed EXP-013; not a research article and not an implemented optimized placement method |
| `maxcut_sdp_eva_rounding_tutorial (1).pdf` (7 pages) | `maxcut-sdp-eva-clustering-tutorial` | Research tutorial on Max-Cut SDP, EVA, and rounding, with Max-k-Cut distinguished; no new peer-reviewed claim |

`_pages/papers.md` now has just two stages: **Submitted Manuscripts** first,
then **Working Drafts & Ongoing Research**. The existing smoothness-integrated
drift paper stays first among working drafts (importance 1), followed by these
five entries (importance 2–6). All six belong to the same working-drafts grid;
none is marked featured. Submitted manuscripts retain their verified states.

`_data/cv.yml` includes five new entries in Research immediately following
the already-first smoothness-distance draft. Each links its public portfolio
page, and public source-code links are shown only for verified public
repositories. The existing Bayesian WTI option page and already-under-review
CNN manuscript are separate works and remain untouched.

**PDF policy:** The five uploaded binaries are not yet website assets. The
GitHub connector in this workflow cannot directly read a chat attachment into
its blob-upload interface; do not invent a `pdf:` field, downloadable URL,
or site-relative path. The public pages deliberately provide authored
descriptions but **no fabricated Open PDF button**. If the PDFs are added later,
commit exact PDF bytes to the repository and update the portfolio pages and
CV together. The blinded WTI source warrants special care before public
PDF distribution because exposing it could compromise blind review.

## Organization logo audit and upgrades (2026-10-28)

Audited every `organization` and `institution` in `_data/cv.yml`
against `_data/cv_organization_logos.yml` and the credential issuer data.
The detailed reproducible audit is in `docs/CV_LOGO_AUDIT.md`;
run `node scripts/audit-cv-organization-logos.mjs` for updated counts.

- Added the owner's uploaded Colegio Loyola emblem as a local WebP.
- Added published BUAP vector artwork for the named BUAP course/school.
  Source and CC BY-SA attribution are recorded in the audit.
- Replaced the low-resolution Actinver Google favicon with an original
  vector wordmark attributed to Actinver by Wikimedia Commons. It renders
  at its natural wide aspect ratio instead of being squeezed to a square.
- All named institutions/employers in the current CV now match some
  logo rule. Generic labels for software, independent research, research
  draft and a volunteer role deliberately retain neutral fallback icons.
- Many existing recognizable universities still use `google.com/s2`
  favicons. These are *mapped* but not verified high-resolution logo art;
  see the audit for the list and future source-quality improvement priorities.
- Preserve organization-only icons; do not put logos ahead of positions,
  languages, skills or manuscript titles. Verify screen and print views.

## PDF-page screenshots and unified Working Drafts section (2026-10-28)

The user requested the six previously highlighted research resources to be
moved into **Working Drafts & Ongoing Research** (below Submitted Manuscripts),
removing the separately featured section entirely. The user's CV research
entries and publication status claims are unchanged.

For **each of these six documents**, two images were actually rendered from
the uploaded PDF and committed as optimized AVIF assets under
`assets/img/portfolio/pdf-page-shots/`:

| Portfolio slug | Uploaded PDF | Card figure screenshot | Detail page screenshot |
| --- | --- | --- | --- |
| `smoothness-integrated-trend-distances` | `trend_comparison_two_column(3).pdf` | Page 4: rolling-window distance figure | Page 1 |
| `dynamic-forecast-optimal-smoothness` | `EspinoMontelongo-2026-Forecast_Optimal_Smoothness.pdf` | Page 10: tracked forecast-loss analyses | Page 1 |
| `smoothness-indexed-pls-python` | `sncs_main.pdf` | Page 15: real-series trend figures | Page 1 |
| `posterior-integration-volatility-wti-asian-options` | `remef_blinded_draft.pdf` | Page 9: posterior integration panels | Page 1 |
| `componentwise-knn-isomap-lecture` | `componentwise_knn_isomap_lecture.pdf` | Slide 29: five-rings method gallery | Slide 1 |
| `maxcut-sdp-eva-clustering-tutorial` | `maxcut_sdp_eva_rounding_tutorial (1).pdf` | Page 1: graph cut example | Page 1 |

The card uses `image: ...-figure.avif`; the opened portfolio detail
uses `detail_image: ...-first.avif`. These are actual screenshots from
the PDF pages, not stock images or mathematically invented graphics.
Their Git blob hashes were verified against the generated local files.

The source PDFs are still **not** public website downloads. This is a
page-preview-only update; it deliberately does not expose the original
blinded REMEF manuscript PDF as a downloadable file.

## Papers archive missing six drafts: YAML diagnosis and regression protection (2026-10-28)

**Incident:** Six October 2026 paper records were correctly committed under
`_pages/papers/*.md` but absent from the deployed `/papers/` archive.
The live archive showed only seven working-draft records. Their expected
`/papers/<slug>.html` URLs were also missing.

**Root cause:** During screenshot metadata updates, the files received
literal backslash-n sequences between YAML front-matter properties:
`image_alt: "..."\ndetail_image: ...\ndetail_image_alt: "..." `.
Jekyll logged `YAML Exception ... did not find expected key` for all six
files, but the build still reported success. It emitted orphaned fallback
pages under `/_pages/papers/<slug>/index.html` instead of the intended
permalinks. Thus, static source assertions alone had incorrectly passed.

**Fix:** Rewrite those metadata attributes onto three real YAML lines in
all six sources while preserving each selected figure and first-page AVIF.
The correct archive output is **3 Submitted Manuscripts** and **13 Working
Drafts & Ongoing Research** (the original seven plus the six new resources).
Neither submission classifications nor the existing CV contents change.

**Guard:** `scripts/verify-paper-archive.mjs` checks the **built `_site`**,
counting exactly 3 submitted and 13 draft cards; verifying every new
draft link and generated `/papers/<slug>.html` page; and checking both
card figure images and first-page detail images. The GitHub Pages deploy
workflow runs it directly after `bundle exec jekyll build`, blocking
production deployment if the expected pages disappear. Source-level tests
in `test/style_contract.js` additionally detect escaped-newline metadata.

## Actinver image and Python-library author credits (2026-10-28)

The owner uploaded a navy square Actinver icon with a white A and gold dot.
It replaces the Actinver Wikimedia wordmark entirely. The original
512 × 512 PNG was resized without creative changes to a 128 × 128 WebP
(`assets/img/cv-organizations/actinver.webp`) for crisp 16 px CV display.
The 4.3-em wide-wordmark CSS override was removed.

Five open-source libraries in **Programming Experience** are now visibly
credited to their author/coauthor and given named organization/project lines:
- **AbaQuant:** Author & Lead Developer; original SVG stylizes A and Q
  as a mathematical-finance identity.
- **ProximityGraphs:** Co-author & Maintainer; SVG proximity/empty-region
  graph mark, keeping collaborative attribution explicit.
- **Trend Estimation:** Author & Maintainer; SVG overlapping smoothness
  curves.
- **AwesomeFigures:** Author & Maintainer; SVG scientific plotting curves.
- **Docling Math:** Author & Maintainer; SVG math-document extraction symbol.

All five SVG logo sources are editable and committed under
`assets/img/cv-organizations/`. These are new **CV-only project graphics**,
not an assertion that the upstream Python package has adopted official
branding. They derive stylistically from a generated graphical concept
created for this task, with the SVGs hand-defined for small-scale crispness.
The old labels 'Contributor' or generic 'Developer' for the user's own
libraries were corrected. The external OpenAI Python SDK remains
'Contributor'. No original research claim or Git repository attribution
has been altered.

Validation: inspect each project identity and role in wide and print
layouts; test locally served SVG/WebP URLs, fallback icons, and
'Show icons'. Verify remote and paper layouts remain single-column.

## Four core fields on event-based CV entries (2026-10-28)

All **94 event-based records** now expose the same four core facts:
1. **Name** (canonical degree/project/manuscript/credential title, visible for
   authored Python libraries instead of obscured by their subtitles).
2. **Role or category** (position, activity, award category, etc.).
3. **Organization/institution** when a real affiliation exists, or a neutral
   **context** (such as "Mathematical research tutorial") when there is none.
   A context is *not* presented as an institution and gets no logo.
4. **Date** (issue date, attendance range, or explicitly marked missing).
   
The document's descriptive highlights are **optional additional information**
and remain unchanged. Notably, no course-description bullets were recreated
for "Introduction to Corporate Finance" or "The Art of Storytelling", which
the owner previously asked to omit. Skills and Languages are static taxonomies,
not dated events, and retain their appropriate two-field presentations.

Corrections: added transparent work-date labels for Trend Estimation,
AwesomeFigures and Docling Math ("Active as of Oct 2026 · start date
unrecorded"); the DataCamp Introduction to Deep Learning with PyTorch issue
date was absent from the authoritative credentials data and is explicitly
"Date not recorded". Bayesian Uncertainty in WTI Options uses the documented
year 2026. Unaffiliated research notes and lectures use truthful context
rather than inventing a host university or journal. In the volunteering entry,
"Data Scientist" was a **role**, not an organization; it is now role metadata,
with "Community water-quality project · Xalmimilulco" as context.

The output is source-driven in `_data/cv.yml` and rendered in
`_includes/cv/render.liquid`. The style contract audits four-field
completeness for all event-based entries. Keep unknown dates explicit until
an actual repository commit, dated credential, or user-provided timeline
verifies them; don't invent historical start dates.

## Public 2026 PDF filenames and links (2026-10-28)

The owner uploaded the original PDFs directly under `papers/` and explicitly
requested the naming scheme `EspinoMontelongo-2026-Short_title.pdf`.

The six canonical public PDF paths are:
- `papers/EspinoMontelongo-2026-Trend_Distances.pdf`
- `papers/EspinoMontelongo-2026-Forecast_Optimal_Smoothness.pdf`
- `papers/EspinoMontelongo-2026-PLS_Python.pdf`
- `papers/EspinoMontelongo-2026-WTI_Asian_Options.pdf`
- `papers/EspinoMontelongo-2026-Componentwise_Isomap.pdf`
- `papers/EspinoMontelongo-2026-MaxCut_SDP_EVA.pdf`

All five necessary renames reuse the exact Git blob SHA, preserving PDF
bytes and avoiding re-encoding; the forecast PDF already followed the naming
convention and was left in place. The old upload filenames are removed.

Each of the six `_pages/papers/*.md` records now has its actual
`pdf: /papers/<canonical-filename>` metadata, enabling the existing
**Open PDF** action. The six corresponding entries in `_data/cv.yml`
each have a **PDF** link. Figure-page card thumbnails and first-page
portfolio detail previews remain untouched. Submission status and the
13-entry Working Drafts section are unchanged.

`scripts/verify-paper-archive.mjs` is a production build guard that checks
all six PDFs appear in the generated site, have a real `%PDF-` header and
are linked by the rendered detail page. The style contract checks
source PDF bytes plus CV and portfolio references.

**Blinded manuscript warning:** The WTI document remains classified as a
blinded manuscript draft; the owner explicitly requested the public
surname-based filename and PDF link. That identifies the portfolio owner
and could compromise anonymity for any double-blind review. Do not
use the public copy as an anonymous journal submission or mistake
public availability for submission, acceptance, or peer review.
This section supersedes earlier notes saying the PDFs were not hosted.

## Harvard experience heading visual hierarchy (2026-10-28)

The Harvard-inspired CV template now follows the owner's uploaded example
without changing structured CV records or other templates. For each
event-based entry, `_sass/_cv.scss` orders the heading visually as:

```text
Organization (and its existing logo)         City, State
Role · Entry title                           Month Year — Month Year
Optional research context / source links
— Description or achievement
```

The organization and role/title are left aligned; the optional location and
date are right aligned. The date is displayed **below** the location even
though their existing Liquid DOM order is date-first. This visual ordering
is limited to `data-cv-template="harvard"`, including the browser print and
paginated paper previews. Where an organization is not applicable, an honest
research context occupies the top-left line; no fictitious institution or
logo is introduced. A genuinely absent city is left blank (never invented).

The display preserves named organization logos, link destinations, title
information, the separate font settings, and the original optional
description lists. Em dashes remain the default marker, with bullets/no
markers available through the shared settings menu. All entries remain
single-column; the two-column structure applies **only to their heading**.
Narrow mobile screens use constrained right-column widths rather than hiding
city or dates. All other templates retain their original heading order.
Test checks are in `test/style_contract.js`.

## Name-anchored settings and print controls (2026-10-28, revised)

The owner clarified that the two compact buttons should remain **next to the
name in the CV heading**, not float in the viewport's upper-left corner or
reserve an empty gutter down the full document.

The CV workspace now uses a full-width block layout whether the customization
menu is open or closed. The existing chevron and print buttons form a single
absolutely positioned column at the top-left of the workspace, aligned beside
the name/header. They scroll away naturally with the header, remaining
stationary relative to the name when the menu opens. The compact left inset
is applied **only to the CV intro**, not to every CV section.

The expanded settings menu overlays the document below the two controls.
It has an independent maximum height and scrolling, so it does not shift
the name or move the buttons. Mobile widths use a smaller header inset and
unchanged touch targets. The shortcuts are omitted from browser print/PDF.

Validation: check first-load desktop and narrow mobile view; confirm the name
is next to the two icons and all CV sections extend to full available width;
open/close the settings panel without moving the icons; scroll down and
confirm the icons move with the name rather than remaining stuck to the
screen; verify printing excludes the icon controls. The source contract is
in `test/style_contract.js`.

## CNN activation-patching paper preview image (2026-10-28)

For `When Do Activation-Patching Effects Add Up? Evidence from Controlled CNNs`
(`_pages/papers/activation-patching-effects-add-up.md`), the paper's
portfolio **card** now displays the author's uploaded manuscript screenshot,
cropped to Figure 1 (rendered synthetic inputs, template bank, and first-layer
patching diagram). The optimized **700 × 316 AVIF** is committed to
`assets/img/portfolio/activation-patching-figure1.avif`; its Git blob SHA
`5b03cfecde34e09753c454ca0096d05346fc4d15` was checked against the
local image produced from the upload.

The **detail view still shows the PDF's first page** through
`activation-patching-first-page.webp`. The existing manuscript PDF,
Supplementary Information PDF, under-review status, and scientific text are
unchanged. Do not replace the specific figure preview with the former generic
`activation-patching-additivity-preview.svg`.

## Research and Research Drafts: sections and dates (2026-10-28)

The CV's former mixed Research section (19 entries) is divided into two
separately selectable and printable sections:

- **Research (11)**: three manuscripts submitted for peer review
  (Unit-Region Factorization, Stepping–Stone, and Activation-Patching),
  four institutional research reports, and four other research projects.
- **Research Drafts (8)**: six previously featured unsubmitted working
  documents (four draft notes/manuscripts plus one lecture and one tutorial),
  the Bayesian-Uncertainty-in-WTI draft, and the mathematical L² notes.
  Existing entry-specific labels are retained to avoid representing
  lectures/tutorials as manuscript submissions.

The split preserves all 19 records, their links, scientific descriptions,
institutional logos, and optional CV section toggles. Both sections use the
full-width research-entry layout rather than a condensed credential grid.

The owner specified submission/reference months:
  Unit-Region Factorization: **Jun 2026**
  Stepping–Stone: **Aug 2026**
  When Do Activation-Patching Effects Add Up?: **Oct 2026**

These are synchronized in `_data/cv.yml` and the matching
`display_date` front matter of the three `_pages/papers/*.md`
records. We do not change journal under-review or under-revision labels
based solely on date confirmation.

The Springer Nature · SN Computer Science · Under Review **organization
label is plain text**, not a link to the external journal website:
only that entry's `organization_url` was removed. Its manuscript page,
PDF, and Zenodo reproducibility links remain accessible. No other journal
links or institutional organization links were touched.

`assets/js/cv-customize.js` includes a separate Europass-facing section
label. `test/style_contract.js` guards the 11+8 split, the three dates
on both pages, and the missing Springer organization hyperlink.

## AbaQuant coauthored technical article (2026-10-28)
- Publication: *AbaQuant. Finanzas matemáticas, valuación y gestión del riesgo*, **26 October 2026**, `La Catarina`, UDLAP / IMEF Universitario; verified authors **Heriberto Espino Montelongo and Owen Paredes Conde**. Original: https://lacatarina.udlap.mx/2026/10/abaquant-finanzas-matematicas-valuacion-y-gestion-del-riesgo/
- Unlike institutional coverage *about* the author, this is an article **written by** the author. Remove its old `_data/press.yml` entry, add a separate `Published Articles & Technical Writing` category **below** Working Drafts on `/papers/`. Do not classify it as a peer-reviewed manuscript.
- Public detail page: `_pages/articles/abaquant-finanzas-matematicas.md` → `/articles/abaquant-finanzas-matematicas.html`. Links to the authoritative published article and official AbaQuant repository.
- CV: separate `Published Articles & Technical Writing` group after Research, coauthor role and publication links. No change to manuscript publication statuses or 3-submitted/13-working-draft counts.
- Preview: user's directly uploaded 1659×747 publisher image resized to 900×405 and encoded AVIF. Committed at `assets/img/portfolio/abaquant-la-catarina-article.avif`, Git SHA `9c5b3594077bbbea9f0ec73f0d0eb5cd275ab3ca` checked against the local transformed upload. Used for both card preview and article detail view, not the old generic AbaQuant documentation graphic.
- `scripts/verify-paper-archive.mjs` also requires one authored technical article, the generated detail page, the uploaded image and verified external publication URL.

## Archive ordering and hidden display settings (2026-10-28)

The owner requests the Papers page order **Submitted Manuscripts → Published
Articles & Technical Writing → Working Drafts & Ongoing Research**, preserving
the original 3 + 1 + 13 contents and the authored-publication classification.

The portfolio archive controls in `assets/js/portfolio-views.js` are created
inside a native `<details>`, **closed by default**, with a tiny left-aligned
`>` summary trigger. The trigger has a hidden accessible name, keyboard
support, and a visible focus state. Search, sort, layout and Reset all remain
available once expanded. Default presentation is **List**, not Grid; choices
are **List / Compact list / Grid**. Compact list uses narrow thumbnails,
reduced row spacing, condensed summary and hides topic chips; all cards keep
their original links. Reset returns to List.

This applies to `/papers/`, `/projects/`, `/notes/`, and `/press/`, with
`data-view="list"` in the original Jekyll markup for sensible no-JS loading.
The `/credentials/` filter menu uses the same closed native details control,
and its list/grid selector now also offers compact list, retaining the
existing list default. The CV customization interface is distinct and is
not altered by this portfolio change.

The source contract checks for the default markup, controls, and CSS; the
built-page contract verifies the new Papers section ordering. Keep this
consistent when introducing new portfolio archives.

## Print control, Harvard paper preview, and Europass structural revision (2026-10-28)

The owner explicitly removed the small floating **Print** button. The
customization chevron stays anchored beside the name, with full-width reading
as the default. Browser Ctrl+P/Cmd+P provides printing and PDF saving; the
`beforeprint`/`afterprint` handlers still apply paper density and restore
the reader's settings. The existing **Paper preview** toggle in the settings
menu remains.

### Harvard page preview

The former preview could shrink its CSS paper width to the browser's viewport
and wrap the Harvard two-column entry heading inconsistently. A4/US Letter
preview sheets now maintain their actual CSS paper dimensions, with horizontal
scrolling on unusually narrow screens rather than corrupting the layout.
The organization/logo and role/title stay left; city/state and date remain
right, with a bounded 31% right column. This applies to live reading,
the approximate page-by-page preview, and browser print. Long link labels
may break across lines rather than overflowing into the date column.

### Europass reference and section sequence

The Europass template now models the actual EU CV information architecture:

1. **Work experience**: Professional Experience, Programming Experience,
   Academic Experience, Volunteering.
2. **Education and training**: Education, Credentials, Schools.
3. **Personal skills**: Languages and Technical Skills.
4. **Additional information**: Research, Research Drafts, Published Articles,
   Selected Academic Projects, Leadership, Awards, Extracurricular Activities.

The same order is used in live reading, printed source, and paginated preview;
the underlying `_data/cv.yml` ordering is untouched for other templates.
Switching to Europass selects grouped sections by default, but users may
still choose chronological sorting explicitly.

Records use the EU-style **date-left / position-and-employer-right** layout.
Language skills display native Spanish and other languages' *reported
overall CEFR level*; no listening/reading/speaking/writing subskill levels
are invented. The presentation does not claim to be an EU-issued Europass CV:
for certified Europass output, the official builder remains linked.

Official references:
- https://europass.europa.eu/en/create-europass-cv
- https://www.eeas.europa.eu/sites/default/files/documents/2025/Europass-cv-en%20template_0.pdf

Regression: `test/style_contract.js` checks source contracts, while
`test/visual/interactions.spec.js` uses Playwright to verify the removed
button, physical paper dimensions, Harvard header position, Europass order,
language display, and paper-mode grid alignment. Print must keep all record
links/selection controls without an extra on-page Print button.

## Connected wide-mode CV entries (2026-10-28)

The screenshot review identified an uneven typographic rhythm: the institution line was smaller than the description and close to the link row, while the description was detached by an excessive top margin. The reading-view-only fix uses an explicit visual hierarchy: **title** (existing dominant size), **organization** (0.96rem, semibold), **links** (0.85rem), then **description** (0.91rem, lighter, 1.42 line-height). A 0.17rem internal line gap and 0.32rem description gap connect each record; link rows get another 0.13rem to distinguish them from the institution. Adjacent description lines have 0.15rem separation. The noninstitutional context label remains muted at 0.84rem.

Scope: `@media screen`, `data-cv-preview="reading"`, any density except `latex`, excluding the special Harvard organization-first and Europass two-column templates. Both grouped CV entries and the chronological view are covered. No edits to LaTeX compact print rules, Jekyll data, print/PDF pagination, print margins, default wide view, or entry ordering. For a manual check, open the La Catarina published technical article in the default wide view, verify title–organization–links–highlights spacing; switch to chronological view and repeat; then compare a Paper preview and browser Print to ensure the compact LaTeX rules remain unchanged.

## Uniform wide CV type and spacing (2026-10-28)

The owner requested equal gaps and the same font across the title, organization, links and description following the previous spacing pass. Wide reading (Balanced and Compact) now applies the template-selected `--cv-font-stack`, a consistent `0.96rem` size, and `1.36` line-height to the entire entry. Title, organization, links, description and date remain distinguishable by weight/color, not font size. An identical `0.24rem` row gap connects title→organization→links→description and adjacent highlight lines; longer link rows also follow the same vertical rhythm.

This is a CSS-only change scoped to `@media screen` and `data-cv-preview="reading"` (non-LaTeX), and excludes special Harvard and Europass. LaTeX extra-compact paper preview and actual print styles, data, ordering and controls remain unchanged. Verify against the La Catarina CV article in grouped and chronological wide views, then test browser print for unchanged compact settings.

## Skill-oriented highlights and single-line printing (2026-10-28)

- The latest factual comparison source is `heri-espino/heri-latex`, especially
  `Curriculum Vitae/Legacy/260826-activities-names/Heriberto_Espino_Montelongo.tex`
  and `Curriculum Vitae/290913-skills/Heriberto_Espino_Montelongo.tex`.
  The *site* YAML remains canonical; older CVs are supporting evidence, not an
  instruction to overwrite contemporary research classifications or public links.
- Each description should demonstrate **one specific method or skill plus evidence
  of its application** (for example, "Data engineering: built Dockerized Airflow
  ETL into PostgreSQL for 500 tickers."). Prefer measured results or technical
  outputs over generic accomplishment claims. Do not claim causal identification
  from observational association or invent review decisions, dates or metrics.
- `_data/cv.yml` highlights are now concise (at most 94 characters per source
  list item) so they fit on one print line, including narrow Europass entries.
  GPA/scholarship facts remain in Education as verified factual metadata.
- Paper preview and browser printing use `white-space: nowrap` with **visible**
  overflow, never ellipses or clipping. Therefore every new bullet must be
  short enough to fit the paper at the configured type size; do not rely solely
  on CSS to hide excess text. Full-width reading mode can wrap normally.
- Re-run `node test/style_contract.js` and the Playwright CV print-bullet
  geometry check. Inspect A4 and Letter, Harvard, Europass and personal
  variants; printing at unusually large user-configured font sizes may require
  shorter source copy rather than scaling to illegibility.
- Maintain this one-skill-per-bullet editorial policy in subsequent changes.

## Requested CV curation and Coursera specializations (2026-10-29)

The owner requested removal **from the website CV only** of four individual research entries:

- `Optimal Smoothness Index and Regularization in Guerrero's Penalized Trends` (displayed as “Trend Estimation Methods”)
- `Privileged Template Priors for Mechanistic Interpretability in CNNs`
- `Systemic Liquidity-Crisis Agent-Based Model`
- `Bayesian Uncertainty in WTI Options`

Do not remove the underlying portfolio pages, publications, PDFs, or GitHub projects; these are CV-selection decisions, not retractions. The CV now contains 9 Research entries (including numerical-validation software) and 7 Research Drafts entries; the published technical article remains in its own category. Maintain the three actual submitted manuscripts and their individual status metadata.

The 10 Coursera **Specializations**, not individual standalone Courses, each received a single concise technical-skill description in `_data/cv.yml`. The archive/source provenance was checked newest-to-oldest:

1. `heri-espino/heri-latex/Curriculum Vitae/290913-skills/Heriberto_Espino_Montelongo.tex` — most recent concise descriptions.
2. `heri-espino/heri-latex/Curriculum Vitae/290911-two-columns/Heriberto_Espino_Montelongo.tex` — expanded descriptions.
3. `heri-espino/heri-latex/Curriculum Vitae/Legacy/260826-activities-names/Heriberto_Espino_Montelongo.tex` — commented technical notes (used for specificity and cross-checking).

No Coursera account was connected or required. The specialization titles, providers, recorded dates, IDs, and official certificate URLs are unchanged. The descriptions characterize the skills covered and documented in the legacy LaTeX sources, without independently asserting production deployments or external course assessment. Each skill statement respects the existing one-line (≤94-character) source contract. Check `node test/style_contract.js`, Jekyll, and CV browser-print tests when changing these records.

## Final pre-merge CV evidence and contact enrichment (2026-10-29)

The owner supplied concise subject descriptions and asked for previously documented omissions to be restored. Updates on PR #47:

- **Math Learning Center:** two separate competency bullets: interactive Streamlit dashboards over student/tutoring records and risk-screening algorithms, based on the newest `heri-latex/Curriculum Vitae/290913-skills/Heriberto_Espino_Montelongo.tex`.
- **Stepping–Stone:** add a dedicated Research software record for July 2026, `Stepping-Stone Volume Validation`, citing DOI `10.5281/zenodo.21291269` and the already public validation project and GitHub repository. The manuscript itself also links to this validation DOI. The full manuscript title and **Under Revision** status now agree with the current `_pages/papers/stepping-stone.md` record, which takes precedence over the earlier abbreviated LaTeX CV. Other manuscript statuses remain unchanged.
- **Competitions:** add three user-confirmed technical descriptions: Kaxa Nuk quantitative cryptocurrency ML; MAPFRE BugaMap actuarial insurance; Coppel in-store sales methodology. No invented awards or numeric performance outcomes.
- **Dates:** correct the Mexican University Mathematics Olympiad participation to `Jun 2025, May 2026` and Stevens HFT to `Mar–Apr 2026` following the newest LaTeX CV. The 2025 UDLAP Mathematics Olympiad edition conflicted between the website's 5th and newest TeX's 4th (also assigned to 2024): omit the ambiguous ordinal without changing the 4th-place ranking.
- **Contacts:** retain public email, portfolio, LinkedIn and GitHub; add ORCID, Google Scholar, ResearchGate and SSRN links using the verified `_data/socials.yml` values. Do not invent a telephone number or claim English proficiency certification without evidence. Contact links wrap naturally in the screen/print header.
- **Scope and checks:** 9 Research records, 7 Research Drafts, all three submitted/under-revision manuscript records, 10 Coursera Specializations and 13 standalone Courses. Source highlights remain within 94 characters. Tests in `test/style_contract.js` cover the restored evidence and link consistency. Print/browser tests must also pass before merging.

## Automatically balanced top/bottom spacing in CV print (2026-10-29)

The print page keeps user-selected **symmetric physical margins** (LaTeX 10 mm, narrow 8 mm, standard 13 mm, wide 19 mm). A single-page CV selection is measured against a physical A4/Letter screen sheet at the current text size, template, paper density, and included entries. If content fits with spare height, half of the unused height is added above the CV content, leaving approximately the same unused height below. Both the on-screen paper preview and actual browser print/PDF use that offset. Text sizes and entry order are never altered, and content is not hidden, shrunk, clipped, or stretched.

For a **multi-page** selection, the dynamic offset is zero; native print pagination retains the fixed equal top and bottom margins. The final partially filled sheet cannot be centered independently by native print fragmentation. The page preview remains approximate, with the print engine as final authority.

Implementation: `assets/js/cv-customize.js` computes `--cv-print-top-balance` and `data-cv-single-page` using measured page-preview content. In wide reading mode it measures paper density offscreen and restores the reading layout. `_sass/_cv.scss` applies the offset only when one sheet fits. Re-evaluation occurs on font/size/paper/selection changes, font readiness, and resize. Browser and source regression checks are in `test/visual/interactions.spec.js` and `test/style_contract.js`.

To inspect: open /cv/, choose one record and Paper preview, compare whitespace above and below, print to PDF, and repeat for A4 and Letter. Then include all records and confirm ordinary fixed symmetric page margins.

## Scholarship-impact evidence pass (2026-10-29)

The public CV received **10 concise revisions** to existing highlights, without adding activities,
changing titles/dates, removing entries, or altering the page renderer and print presets.
The revised highlights emphasize documented scale, teaching, and community relevance:

- Mathematics Learning Center and reports: observational cohorts of 6,627 and 3,241 students,
  plus 26,140 student-classroom observations across 769 mathematics classrooms.
  These are **analysis populations**, not counts of students assisted or causal beneficiaries.
  Evidence: `_pages/papers/student-engagement-adaptation.md`,
  `_pages/papers/mathematics-support-classroom-performance.md`,
  `_pages/papers/academic-support-persistence-incentive.md` and
  `_pages/papers/course-grades-comparability.md`.
- Agrocebada: 59 model-generated yield estimates and an interactive publication;
  **not** 59 known ground-truth validation outcomes or verified farmer adoption.
  Evidence: `heri-espino/GeoC` and `heri-espino/todoseboso` README files.
- Xalmimilulco: a community-focused water-risk dashboard, **not** a documented
  reduction in contamination or deployment by health authorities.
- Quantum-computing and C++ instruction: curriculum/teaching contributions only;
  no invented audience sizes, teaching hours or measured learning gains.

Each replacement is at most 81 characters (the CV contract remains at most 94
characters per highlight). Follow-up evidence to request before stronger impact
claims: student attendance, verified dashboard use, institutional decisions,
community adoption, documented outcomes, and third-party confirmation.

Recheck after any wording change: `node test/style_contract.js`, Jekyll build,
Playwright print-overflow checks across A4/Letter and CV templates. This content
pass changes only structured descriptions and does not alter print styling.

## Mathematics Learning Center: independent inquiry and stakeholder reporting (2026-10-29)

User-confirmed account: independently proposed institutional research questions,
designed and ran statistical studies, then presented technical and accessible
explanations to university stakeholders with varied statistical expertise.
Presentations also proposed future institutional improvements.

Three concise highlights were added to the existing Mathematics Learning Center
record: research leadership, stakeholder communication, and decision support.
The five pre-existing technical highlights remain, and all eight new/current
bullets comply with the 94-character printable-line limit (maximum 87).

Do **not** claim that analyses caused policy adoption, established instructor
or student misconduct, or experimentally proved an incentive's causal effect.
The longitudinal tutoring studies are observational, and statements about
instructor-grade heterogeneity should remain measurement-focused.
Use observed impacts only when independently documented.

Verification: inspect the CV's Mathematics Learning Center record in
reading mode and print preview (A4/Letter) and run the source contract.

## UDLAP student organization, Zenodo, CIMAT and software dates (2026-10-30)

- **UDLAP official directory:** The Spring 2026 student organization is published as
  **Preety Good Quantum OE** (official spelling) with Heriberto's public UDLAP
  contact. The existing Leadership record keeps its President role and
  Jan–Jun 2026 dates. Its title and organization now link to
  `https://www.udlap.mx/vidaestudiantil/organizaciones-estudiantiles/#:~:text=Preety%20Good%20Quantum%20OE`.
  A Chrome text fragment may scroll to matching text, but the university controls
  its collapsible directory and may not open the accordion programmatically.
- **User-provided mark:** `assets/img/cv-organizations/preety-good-quantum.webp`
  is a 96×96 WebP optimization of the 400×400 uploaded navy Q emblem;
  it is *not* an AbaQuant mark. Its organization-logo match precedes the
  generic UDLAP rule, preserving the correct logo on the Leadership entry.
- **AbaQuant:** A canonical icon from `AbaQuant/AbaQuant/docs/_static/q_dark.png`
  replaces the generic CV-only `abaquant.svg` logo mapping. The old SVG is retained
  as a historical repository artifact and is not deleted. Check remote image
  load/fallback in desktop and PDF modes.
- **Zenodo:** The Stepping–Stone validation DOI remains
  `10.5281/zenodo.21291269`; the SN Computer Science CNN research already linked
  `10.5281/zenodo.23432463`, now surfaced with an explicit Zenodo record link.
  `_includes/cv/render.liquid` adds an official Zenodo icon beside links
  resolving to Zenodo, including `doi.org` Zenodo DOI routes; icons have empty
  alt text because the links retain visible accessible labels.
- **CIMAT:** The independent latent-risk research was presented at the XXIV
  School of Probability and Statistics; the Research record now has a
  *Presented at ... CIMAT* organization line so the existing CIMAT logo
  appears without misrepresenting CIMAT as the site where research began.
- **Programming dates:** Trend Estimation's original repository creation
  `2026-05-25` supports `May 2026 — Present`. User supplied
  `Oct 2026 — Present` for AwesomeFigures and `Sep 2026 — Present`
  for Docling Math, and requested `Sep 2026 — Present` for OpenAI SDK
  contributions. Existing AbaQuant and ProximityGraphs dates stay unchanged.
  `Marp` is added to Visualization & Documents.

Keep the distinction between an ongoing contribution label and independently
verified continued code commits. Verify no unwanted layout shifts in paper
preview, one-line print bullets and official brand imagery. All changes are
limited to the CV source, its existing renderer/styles, matching logos,
tests and handoff; no research classifications were changed.

## SSRN preprint and Elsevier submission tracking (2026-10-30)

- The owner supplied an SSRN preprint URL for Stepping–Stone:
  `https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7634746`.
  The canonical paper detail page already contained this exact `external_url`.
  Its CV Research entry now also includes a labeled `SSRN` link.
- The owner also supplied an Elsevier Author Hub manuscript tracking URL
  for Unit-Region Factorization (UUID-bearing link). It appears as a
  `Track submission` CV link and a *secondary* `resource_url` on the
  canonical paper detail page, preserving the local PDF as primary.
- These are distinct functions: SSRN hosts a preprint; the Elsevier
  tracker displays submission progress. Neither changes the original
  manuscript's status or establishes journal acceptance/publication.
- **Privacy caution:** The tracking URL contains a unique UUID and is
  now publicly linked at the owner's explicit request. If it exposes
  nonpublic editorial data or an access capability without login, the
  owner should revoke that URL and remove the site links.
- Source-only checks assert consistency across CV/paper pages; do not
  assert the tracker is publicly accessible or that the SSRN page
  was fetched from a restricted network environment.

## Specific methods in four Mathematics Learning Center study highlights (2026-11-02)

At the owner's request, replace generic sample-size/longitudinal/measurement labels in `_data/cv.yml` with specific statistical operations. Preserve the study identities, dates, URLs, cohorts and observational/noncausal framing in their individual paper pages.

| Study | CV method and interpretation |
| --- | --- |
| Student Engagement and Adaptation | Five-state classification; nine pre-specified sensitivity definitions of performance/context (already detailed in the paper page) |
| Instructor Grade Heterogeneity | Kolmogorov–Smirnov distances to cluster instructors by observed grade distributions; the owner explicitly supplied this method, replacing the former *planned* distributional-distance statement in the paper metadata |
| Support Persistence After Incentives | Conditional continuation/transition rates: later Calculus-I support use stratified by earlier support visits; prior observed sample size of 3,241 students remains on the paper page |
| Mathematics Support and Classroom-Relative Performance | Wald tests for mathematics-support terms in a partially linear model (PLM) of grade outcomes; owner-supplied method, supplementary to documented Welch/Games–Howell and classroom fixed-effects analyses |

These are descriptions of techniques, **not estimates of treatment effects**, causal identification, statistical significance, or guaranteed effects of tutoring. Avoid saying instructors were ranked objectively or that clustering reveals latent instructional quality. The exact four one-line CV highlights remain ≤94 characters for paper/PDF printing. Keep source data, experimental outputs and technical manuscript pages intact. Source regression tests cross-check the CV and respective paper pages in `test/style_contract.js`.

## NYU / Pragmatic AI Labs logos and ProximityGraphs links (2026-11-02)

- NYU's `nyu` credential issuer uses the source-attributed NYU stacked-color logo directly from Wikimedia's stable original SVG endpoint (`https://upload.wikimedia.org/wikipedia/commons/6/66/Nyu_stacked_color.svg`) in place of `Special:FilePath/Nyu_short_color.svg`. At CV icon sizes the square-ish stacked identity is clearer than the full horizontal wordmark.
- The `pragmatic-ai` issuer references `https://paiml.com/assets/img/logo.png`, the official Pragmatic AI Labs image rather than Google's generic favicon. These issuer keys serve both the credentials collection and organization-logo matches in the CV. Maintain accessible initials/fallback and the opt-out Show icons control. See `docs/CV_LOGO_AUDIT.md`.
- The collaborative `ProximityGraphs — Computational Geometry Python Library` CV entry keeps PyPI and now also links the [documentation](https://proximitygraphs.github.io/ProximityGraphs/), the [current development GitHub repository](https://github.com/ProximityGraphs/ProximityGraphs), and the version-specific [Zenodo DOI 10.5281/zenodo.21088183](https://doi.org/10.5281/zenodo.21088183). The project detail `_projects/proximity-graphs.md` now provides the Zenodo action and the exact user-supplied software BibTeX for **v0.1.0a2**, **MIT**, **June 2026**, by **Héctor Maravillo, Diego Villarreal De La Cerda and Heriberto Espino-Montelongo**. The user-supplied BibTeX retains the historical `HectorMaravillo/ProximityGraphs` URL; the live project also links the maintained `ProximityGraphs/ProximityGraphs` organization without treating them as mutually exclusive.
- The `test/style_contract.js` contract verifies source URLs, issuer routing, both CV/project DOI links, citation authors and version. Keep chronological source data, CV role and other research records unchanged.

## Individual-course descriptions on CV and credentials archive (2026-11-02)

Following the owner's explicit request, all **13 standalone Courses** now each receive exactly one concise, method/skill-focused description in `_data/cv.yml` (`highlights:`) and a matching `description:` in the `independent-courses` group of `_data/credentials.yml`. The descriptions render in normal list/grid view on `/credentials/`; its compact view intentionally hides them to remain dense. **All 10 Specializations** remain unchanged, as do existing course names, issuer institutions, completion dates (including the explicit unknown date for introductory PyTorch), certificate IDs, source order and verification links.

Provenance, latest first:

1. `heri-espino/heri-latex/Curriculum Vitae/290913-skills/Heriberto_Espino_Montelongo.tex`: concise verified skill descriptions for 11 of 13 courses; NYU's shorter title “ML and RL in Finance” corresponds to the same verified course ID as “Guided Tour of Machine Learning in Finance.”
2. `heri-espino/heri-latex/Curriculum Vitae/290911-two-columns/Heriberto_Espino_Montelongo.tex` and `Legacy/260826-activities-names/Heriberto_Espino_Montelongo.tex`: corroborating academic-method notes (including PyTorch CNN/RNN training, scaling laws and speech processing).
3. Two courses without an equivalent latest-LaTeX item use official current program descriptions: `https://www.datacamp.com/courses/introduction-to-deep-learning-with-pytorch` (tensors, losses, training loops) and `https://www.coursera.org/learn/github-zero` (Git workflows, pull requests, code review and CI).

These are educational competencies **covered by completed courses**, not evidence of independently verified deployment or empirical research outcomes. Each description is ≤94 characters to respect LaTeX-like CV printing. The obsolete earlier request to omit some individual-course descriptions was superseded by the current instruction. New `test/style_contract.js` assertions require all 13 course descriptions and matching CV/source text; run the standard Jekyll build and browser checks after any changes. No new credential categories or duplicate entries were created.

## Name-first CV, Display-panel Print button, raster-only SVG artwork (2026-11-02)

The owner requested: (1) remove the redundant `Curriculum vitae` label above the name, (2) render the name noticeably larger and heavier in normal reading mode, paper preview and actual browser print, and (3) put a **Print / Save PDF** button inside the existing expandable customization (Display) menu. No separate viewport-fixed/left floating Print button was added; the menu stays collapsed by default. The button invokes the system print dialog, which can print to paper or save as PDF; Ctrl+P/Cmd+P remains supported. Control elements and status text do not print.

The owner also requested compact, rasterized **figures only**, not a flat image of the entire CV. Since the structured CV primarily contains tiny institutional SVG marks and linked pages (not embedded full research charts), `assets/js/cv-customize.js` converts only visible, decoded SVG `img` nodes inside `#cv-document` into short-lived bitmap canvases in the `beforeprint` event (and immediately before the menu button's `window.print()` call). Their pixel size is bounded by 2× displayed dimensions and a maximum side length of 960 px. The conversion is synchronous, so printing does not race async data-URL loads; `afterprint` restores the original SVG elements exactly. Already compressed native PNG/WebP/JPEG images remain unchanged; HTML text, hyperlinks, accessibility semantics and print margins stay vector/searchable.

Printing a collection of tiny SVG icons as canvases does **not** automatically guarantee a smaller PDF; browser print engines handle fonts, vectors and raster compression differently. This deliberately avoids rasterizing the whole document, which could be larger and would destroy text searchability. To verify, print the same CV from the Display button and Ctrl+P and compare byte sizes and text selection; test graphic restoration afterward. Browser and source-contract regression checks cover the menu, name heading and reversible canvas rasterization. Do not upload image or PDF files unnecessarily or expose private LaTeX contacts.

## CV deployed-page audit and visible Print menu (2026-11-02)

A user screenshot displayed the old `CURRICULUM VITAE` eyebrow, an open Display panel without the Print button visible, and reported missing course descriptions. A read-only audit of the **deployed `gh-pages` branch** (commit `1a648c1`, generated from `main` commit `687b710` on 2026-11-02) verified that `cv/index.html` already **omitted the eyebrow**, **included `id="cv-print"`**, and **contained all 13 individual-course highlights**; `credentials/index.html` also already contained each description. Thus the screenshot represents an out-of-date HTML document (or cache) rather than loss of CV data. The 13 individual-course descriptions are below the fold in the `Credentials` section, not on A4 preview page 1. The sections are expanded for paper preview and the printed view.

A separate usability issue was genuine: the Print / Save PDF button appeared **after** the entry selection and URL checkboxes, below the long, internally scrollable Display menu. Move its one unique instance to a sticky action bar immediately beneath the Display heading and before the first Order/Template selector. Do not add a second floating/viewport-level Print icon. The panel itself remains scrollable and closed by default. Version the CV script URL with a Jekyll build-time timestamp `?v={{ site.time | date: '%s' }}` to prevent updated JavaScript being served from a stale asset cache on the next navigation. It does not and cannot instantly refresh a previously opened HTML tab: **Ctrl+Shift+R** is the appropriate manual recovery.

Regression: source checks verify button position, uniqueness, sticky CSS and versioned script URL; Playwright asserts the print action stays within the settings panel even after scrolling down to the 92-entry selector. A browser test also checks all 23 (10 specialization + 13 course) CV highlight bullets and checks the individual-course copy in A4 paper preview, with the old eyebrow absent. The owner's selected density, paper size, A4 pagination, searchable PDF text, and figure-only print rasterization remain unchanged. Do not claim a new credential or course completion date.

## Native Print matches the page-by-page paper preview (2026-11-02)

**Bug fixed:** Prior CSS explicitly hid the paginated `#cv-paged-preview` and printed the unpaginated, full-width source `#cv-document` instead. The user's on-screen A4/Letter preview was therefore **not** the content submitted to the browser's Print/Save PDF dialog. The prior print tests only checked density and source bullets, so they missed the document-selection mistake.

**Implementation:** For both the Display-menu Print action and native Ctrl+P/Cmd+P, `preparePaperPrint()` in `assets/js/cv-customize.js` temporarily selects the remembered **paper** density, expands printable sections, and invokes `renderPagedPreview(true)` to populate **every** cloned A4/Letter preview page even when the screen stays in reading mode. The switch `data-cv-printing=true` tells `@media print` to hide `#cv-document` and print `#cv-paged-preview`. Printed page-number labels, shadows, frames and duplicate preview padding are suppressed; each nonfinal preview page has a forced CSS page break. Physical page size and symmetric margins remain in the existing dynamic `@page` rule. This yields the same chronological/grouped order, filtered sections and records, template and paper margins as the visible preview, with actual searchable text and interactive links.

**Late native beforeprint:** Some browsers already activate print media before firing `beforeprint`. A short-lived `data-cv-print-measuring=true` state recreates true screen-sized page-preview dimensions for the synchronous pagination pass, then drops into clean physical print content. The routine is idempotent if the user clicks Print (which also causes the browser to fire `beforeprint`). SVGs are rasterized only within the actual printable preview, not the now-hidden source. `afterprint` restores canvas-replaced SVGs, the original reading/paper density, disclosure state, screen preview and full-width source (with no duplicated hidden CV content).

**Validation:** `test/visual/interactions.spec.js` now asserts `#cv-document` is hidden and the full `#cv-paged-preview` is visible under print media, with one or more forced page breaks for the full CV. It checks the selected A4/Letter size, small/large print settings, hidden page labels, single-page vertical balance and PDF byte generation; the exact same technical descriptions must be present in the document. `test/style_contract.js` prevents reintroducing source-only printing. Do not claim browser-generated PDFs are byte-identical across systems; print margins, font engines and SVG fallback behavior vary. The first objective is fidelity to the on-screen paper preview, not just a small file.

## IMEF Universitario membership (2026-11-03)

- Owner-confirmed membership in **IMEF Universitario** begins **Aug 2026** and is scheduled to end **Jun 2027**. The CV date uses `Aug 2026 — Jun 2027 (expected)` to avoid presenting a future end as completed.
- The owner provided no committee or elected title. Use **Member**, not president, board member or leadership claims.
- Keep the entry in **Selected Extracurricular Activities**, not Leadership; it contains only a membership description, not invented accomplishments.
- Official organization URL: https://www.imef-universitario.com/ . Its own domain provides a CV organization favicon via the existing logo registry; retain the existing icon fallback.
- Recheck the entry in both the wide CV and paper/print modes; the date and official institution link should remain visible under all templates when the section is enabled.

## SMM presentation official evidence and video (2026-11-03)

- The user identified SMM talk **8744**, *Características Asintóticas de las Gráficas de Proximidad*, presented by **Heriberto Espino Montelongo** in the 59th SMM National Congress prerecorded Discrete Mathematics section. The SMM public programme at https://www.smm.org.mx/congreso/areas/platicas independently confirms the number, title, speaker and recording.
- The SMM-hosted video link is https://youtu.be/KjQFeBLJybw. The video link was cross-checked against the corresponding programme row; it is not a guessed video ID.
- In `_data/cv.yml` the *Academic Experience* talk title opens the official SMM listing with a text fragment `#:~:text=Heriberto%20Espino%20Montelongo`, which generally scrolls to and highlights the speaker name in supporting browsers (e.g. Chromium); the URL safely falls back to the programme without highlighting elsewhere. The CV also provides distinct **Official SMM listing · Talk 8744**, **Recorded talk · YouTube**, and **Slides and presentation details** links. Keep the existing slides portfolio URL.
- In `_projects/proximity-graphs-asymptotics-presentation.md` the same official programme is available as a resource button and the verified YouTube recording is embedded, while retaining the locally hosted presentation PDF and GitHub source.
- Do not claim the text fragment is a native server-side search result, or that it works in every browser. Fallback: `Ctrl+F` / `Cmd+F` for `Heriberto Espino Montelongo` or `8744`.
- Production regression: `scripts/verify-public-profile.mjs` checks the generated CV and presentation HTML for the authoritative official link and embedded video, including retained slides PDF. The SMM source may change; recheck links if the conference moves its programme.

## Owner-supplied CV accuracy corrections (2026-11-03)

- In the Mathematics Learning Center role, removed the 6,627-student tutoring-grade association statement and the KS-feature clustering highlight by explicit owner request. Do not restore them from old CV exports; independently sourced research pages are unchanged.
- In Actinver, kept Dockerized Airflow-to-PostgreSQL ETL and per-ticker news retrieval, but replaced unsupported fixed sample counts with variable ticker coverage and unquantified news items.
- In the Linear Algebra Academic Assistant role, the owner **only translated existing LaTeX presentations from English to Spanish**. Do not describe the role as authoring lectures, developing original teaching materials, or standardizing diagrams.
- In Paletas Loreto, included owner-reported creation of the business's websites. No specific domains, launch dates, or frontend technologies were supplied; do not invent them.
- Moved **IMEF Universitario Membership** from Selected Extracurricular Activities to **Leadership** at the user's request, retaining **Member** (not an elected/managerial position) and the original Aug 2026–Jun 2027 (expected) period.
- The Putnam CV entry now describes university selection among **10 UDLAP representatives in both 2024 and 2025**, as reported by the owner. The [MAA announcement](https://maa.org/news/results-of-the-85th-william-lowell-putnam-mathematical-competition/) independently establishes that **2024 was the first pilot year including Mexican universities**. The individual UDLAP selection count comes from the owner, not from the MAA article. Do not misrepresent participation as a top-10 global Putnam finish or a competitive medal.
- Changed the latent-risk research-project period from the erroneous Jan–May 2023 to **Jan–Mar 2026**; synchronized the related portfolio project's display_date to Jan–Mar 2026 without changing its paper/poster or coauthor claims.
- The Stepping-Stone Volume Validation research-software CV record retains its verified GitHub link and now has a dedicated linked **GitHub brand icon**, instead of inventing an institutional employer or incorrectly claiming Python-only implementation. The generic `entry.icon: github` / `entry.icon_url` rendering is opt-in and respects the CV's Show icons toggle; the existing DOI and portfolio links remain.
- Regenerate site HTML from `_data/cv.yml` and check `scripts/verify-public-profile.mjs`, not edited output. Maintain compact print highlights within 94 characters and separate editing from pre-existing global baseline CI failures.

## La Catarina first-author correction and semantic CV highlighting (2026-11-04)

- The owner confirmed first authorship of the La Catarina AbaQuant technical article. The publisher's byline at https://lacatarina.udlap.mx/2026/10/abaquant-finanzas-matematicas-valuacion-y-gestion-del-riesgo/ lists Heriberto Espino Montelongo **first**, then Owen Paredes Conde. Use **First Author · Published Technical Article** in the CV to convey byline order, not sole authorship or peer-reviewed journal status.
- Remove the redundant CV bullet `Technical writing: coauthored an AbaQuant article with Owen Paredes Conde.`. Preserve both names on the article detail page and the original publication link.
- The CV's semibold `cv-keyword` treatment is no longer a global term highlighter. Emphasize only the **complete initial label before the colon** in the `cv-highlights` descriptions; emphasize each case-folded label **once across the source CV** and leave all technical-skills values in normal weight. Thus `Stochastic geometry:` remains intact and `PyTorch:` receives at most one bold label, even when it appears in several course descriptions.
- The script processes the original source CV, and timeline/paper/print preview clone that DOM. Do not duplicate highlighting or change original prose. No-JS reading remains plain text. Playwright and style-contract tests guard this behavior.


## Section disclosures and reordering (2026-11-09)

All YAML sections render inside an open `<details class="cv-details">`
wrapper; no-JavaScript visitors see the entire CV. The heading is a
keyboard-activatable `<summary>`. Collapsing a section affects only the
reading view. Switching to Paper preview temporarily opens every section
and restores reading disclosure state when returning; native printing
includes all included entries regardless of open/closed state.

The **Sections: include and reorder** panel contains the existing include
checkbox plus drag-and-drop and Up/Down buttons for every section.
`assets/js/cv-customize.js` changes DOM presentation order only,
without mutating `_data/cv.yml`. A validated browser-local key stores the
section IDs across reloads. Reset clears the key. On the Europass style,
the built-in European sequence remains the default until a custom order is
chosen. Global chronological mode remains an independent record-level
sort, not a section-level sort.

Regression coverage: `test/visual/interactions.spec.js` verifies that
every section has a disclosure, both degree dates, that hidden reading
content remains in the paper preview, reorder persistence and Reset.
`test/style_contract.js` guards the corresponding source/JS/CSS contracts.


## New Wiley submission: two PDFs under one paper page (2026-11-09)

The owner supplied the anonymous main reviewer PDF (10 pages), its separately
anonymized Supporting Information (3 pages), and the page-6 Figure 1 screenshot
as the preferred Papers card preview. The submission is confirmed by the owner
for **The Journal of Futures Markets** (Wiley). Mark it **Submitted** only:
there is no evidence of editor acceptance, DOI or peer-review start.

The existing WTI portfolio URL was updated in place:
`/papers/posterior-integration-volatility-wti-asian-options.html`.
It appears under **Submitted Manuscripts**, not Working Drafts. The new
canonical manuscript title is *When Does Posterior Integration Change Option
Values? Evidence from WTI Average Price Options*. This is a later manuscript
than the earlier REMEF-oriented PDF that was previously linked at the same
page; that earlier binary is preserved in Git as historical work.

The website hosts the exact user-supplied files with these names:

| Function | Public path | Pages / SHA-256 |
| --- | --- | --- |
| Main manuscript | `papers/when-does-posterior-integration-change-option-values.pdf` | 10; `5f5063654bc62c0aab51f3620e90ab9292214dd72cdae421c4bca0ebe3986043` |
| Supporting Information | `papers/when-does-posterior-integration-change-option-values-supplement.pdf` | 3; `edf24cf45fbc5678911608f12b19069473d29455985b5a5c2e3fc323d5ca4111` |

The exact PDFs were recovered from private GitHub Actions packaging run
`41738924069` (artifact `13280636487`, source commit
`66fe260a1bff6386354d02ef39a7c3683f850ed4`) and compared byte by
byte to the two user uploads. No numerical experiments or paper compilation
were rerun. A lightweight, scoped export workflow was used on the private
research branch `chore/jfm-portfolio-export` to preserve just the anonymous
PDFs and derive portable first-page WebP screenshots. Only these five binary
assets were transferred to the public portfolio; identifying title-page
and private LaTeX source material were **not** transferred.

The card image, `assets/img/portfolio/jfm-posterior-integration-figure.webp`,
shows **Figure 1 on page 6**, cropped from the exact manuscript PDF in the
same composition as the supplied screenshot (not a stock illustration).
The detail's `detail_image` is the **full first page of the main PDF**, at
`assets/img/portfolio/jfm-posterior-integration-first-page.webp`.
A second first-page image,
`assets/img/portfolio/jfm-posterior-integration-supplement-first-page.webp`,
is embedded inside the same paper page, linked to the full supplement.
It has responsive CSS in `_sass/_portfolio.scss`.

The CV `Research` entry now uses the exact manuscript title, links to one
portfolio page and both PDFs, and displays the institution
`Wiley · The Journal of Futures Markets · Submitted` with Wiley's official
website favicon. The prior WTI draft CV entry was removed rather than
duplicated. The resulting CV counts are **10 Research** and **6 Research Drafts**.
The Papers counts are **4 Submitted** and **12 Working Drafts** (plus the
separate published technical article).

Run `node scripts/verify-paper-archive.mjs` after Jekyll to check that
the two exact PDFs and three independent images made it to the final site,
and verify browser rendering including desktop/mobile preview and PDF actions.
Publicly linking anonymous reviewer files from an author's CV can affect
double-blind anonymity; do not modify the reviewer PDFs or add identifying
manuscript/title-page material to the downloadable pair.


## Papers listing-only exclusions (2026-11-09)

The owner requested removing six specific cards from the website's
`/papers/` archive **without deleting the actual paper records, PDF files,
images, or standalone page URLs**. The omitted cards are:
Template Priors in Small CNNs (TMLR); Bayesian Parameter Uncertainty in
WTI Average Price Option Valuation; Guerrero Penalized Trend Estimation
(S&P 500 comparison); Smoothness-Integrated Trend Distances; Dynamic
Forecast-Optimal Smoothness; and Smoothness-Indexed Penalized Trend
Estimation in Python.

Each underlying Markdown page remains under `_pages/papers/` with the
same `portfolio_type: paper`, permalink, content, status and binaries.
A new `hide_from_papers: true` front matter field controls visibility in
`_pages/papers.md` and the homepage Papers previews (via `_pages/about.md`).
Do not replace this with `published: false`, as that would destroy
the public detail URL and break provenance, existing internal links and
research-index queries. Search/sort results on the Papers page are
populated only from the visible cards.

Visible Papers counts after this change: **4 Submitted Manuscripts,
1 Published Article, and 6 Working Drafts**. Preserve the Wiley
Journal of Futures Markets submission and its two verified PDFs.
`scripts/verify-paper-archive.mjs` checks that all six excluded links
are absent from the archive/homepage but their individual generated pages
remain accessible, while still validating original PDF and preview assets.
No CV records were changed by this listing-only request. The separate
research index and machine-readable catalog deliberately retain full
research provenance.


## 2026-11-10: move Notes into Research Drafts

The owner uploaded a **31-page handwritten PDF** (`notes on trend
estimation.pdf`) and asked to include it in **Research Drafts**,
removing the Notes section from the public website.

Implementation:
- Add `_pages/papers/handwritten-trend-estimation-notes.md`
  as an unsubmitted **Research Notes** record in Papers →
  Working Drafts & Ongoing Research. The notebook discusses
  penalized least squares, difference operators, the Guerrero
  smoothness index, smoothing matrix derivatives, bias–variance,
  cross-validation and local-minimum/root searches.
- Add an entry under `_data/cv.yml` Research Drafts; do not
  misclassify the handwritten pages as peer-reviewed results.
- Reclassify the existing Random Variables as Vectors note as
  `portfolio_type: paper`, keeping its original `/notes/...`
  permalink and PDF. Both mathematical-note entries now appear
  among research drafts; avoid losing the older page in the move.
- Remove Notes from `_includes/header.liquid` and the homepage
  `_pages/about.md` sections. Retain `/notes/` as a migration
  notice, marked `nav: false`, not a second archive.
- Keep six previously hidden paper records hidden. The target public
  archive counts are **4 Submitted + 1 Published + 8 Draft/Notes**,
  and the CV contains **10 Research + 7 Research Drafts**.

**PDF attachment status:** The handwritten original is a ChatGPT
conversation upload; it has not yet been transferred to GitHub.
Because the upload is 31 scanned image pages, it cannot be replaced by
an automatic text extraction. The detail page explicitly labels its
coverage as a thematic overview and does **not** provide a fabricated
PDF URL. Once the original PDF is added to the public repo, add its
verified `pdf:` metadata and CV download link, and preserve
the exact 31-page source independently of the overview.


## 2026-11-10: Modern Minimal default and two manuscript sections

**Latest owner-confirmed CV preference.** Do not follow superseded 2026-10-28
and 2026-11-09 Research / Research Drafts layouts when editing this version.

- Default template for initial HTML (including no JS) and `Reset options` is
  `Modern minimal` (`data-cv-template="minimal"` and the selected `#cv-template`
  option); the original Personal/Harvard/Europass/editorial/professional
  templates remain available, and paper view retains compact print density.
- Section order is **Education → Professional Experience → Submitted
  Manuscripts (4) → Manuscripts (13) → Programming Experience**, followed by
  the preserved other categories. The 4 true submissions are Unit-Region
  Factorization, Stepping–Stone, Activation-Patching CNNs, and Wiley's
  posterior-integration paper. Their exact author credits, journal names,
  submitted/revision status, PDF links and source dates remain unchanged.
- `Manuscripts` retains **all** 7 former Research Drafts records
  (including the October 2026 handwritten trend-estimation notebook, the
  mathematical L² notes, and the lecture/tutorial), followed by the 6
  non-submitted records formerly mixed into Research (4 internal reports,
  1 latent-risk project, 1 volume-validation software record). That name
  is a section grouping, **not a claim that every item is an academic
  manuscript**: retain each item's actual research/lecture/report/software
  label. Never inflate the count of submitted journal manuscripts.
- **Volunteering** was removed from `_data/cv.yml` and therefore from the
  rendered view, print and customization controls. Its Xalmimilulco record
  was archived unmodified in `_data/cv_archived.yml`; it is not surfaced
  anywhere on the public CV and is not used by Jekyll templates.
- The settings chevron is now **right-aligned with the owner's name**.
  CSS scopes the header-only inset to the right, without a left or right
  permanent rail; the customization flyout is right-anchored and overlays
  rather than shifting content. The original print button is still sticky
  inside the settings menu. CSS print styles continue hiding all controls.
- Native details are open by default for no-JS access. Explicit summary
  clicks in the normal reading view use the Web Animations API to animate
  the height over 280 ms, with a short fade/translation inside the body.
  `prefers-reduced-motion: reduce` bypasses JavaScript animation; print
  and the paper preview always render full included records. Keyboard
  (Enter/Space) activation still works.
- The reordered set has a new browser key,
  `localStorage['cv-section-order-v2']`. The old `v1` key is deliberately
  ignored because the Research/Research Drafts and Volunteering IDs changed.
  `Reset options` clears `v2` and restores the YAML order and Modern
  Minimal template. Europass's original work-before-education default
  continues to apply when users select that template.
- Regression tests in `test/style_contract.js` and
  `test/visual/interactions.spec.js` check section membership, display
  order, button geometry, browser persistence, keyboard disclosure
  animation, reduced-motion preference and print preview.


## 2026-11-10: Springer/Wiley/SMM corrections and Quantum paper links

New explicit owner corrections supersede any older CV screenshot or notes:
Springer Nature · *SN Computer Science* activation-patching manuscript remains
**Under Review, Oct 2026**, with **Puebla, Mexico** as its author location.
Wiley · *The Journal of Futures Markets* posterior-integration paper remains
**Submitted**, now dated **Nov 2026** (Puebla, Mexico).
The 59th SMM talk *Asymptotic Characteristics of Proximity Graphs*, talk 8744,
was at **Tlaxcala, Mexico**, not a location named "Pre-recorded"; its
Oct 2026 date and recorded-talk URL stay intact. This is a CV metadata edit,
not a new submission or revision claim.

The Preety Good Quantum OE leadership entry had the same long
`#:~:text=Preety%20Good%20Quantum%20OE` UDLAP link on its title, linked
organization, and an additional resources line. That text-fragment form
adds no permanent path and gives awkward PDF-preview wrapping and visual
duplication. Both `organization_url` and the labeled resource link now use
the stable directory root:
`https://www.udlap.mx/vidaestudiantil/organizaciones-estudiantiles/`.

The organization and title stay clickable. The resource link still appears
in full-width interactive CV mode. A narrowly scoped YAML flag
`paper_hide_redundant_links: true` causes the Liquid renderer to mark the
single duplicate resource link; CSS hides it only in the generated
`.cv-preview-paper-body` content used for the paper preview and real browser
printing. The printed organization URL is not visually underlined, but the
link remains active. All other organization, Zenodo and paper links retain
their previous behavior. A browser test checks metadata, link targets,
paper geometry, CSS visibility and the native print preparation sequence.



## 2026-11-11 — Papers archive taxonomy and original trend-notebook PDF

**User request:** split the previously combined eight visible Papers
archive records. The archive has these four default list groups, each with
individual `data-portfolio-section` filters:

1. Submitted Manuscripts (**4**, unchanged).
2. Published Articles & Technical Writing (**1**, unchanged).
3. Research Notes, Lectures & Tutorials (**4**): handwritten trend-estimation
   notes; Random Variables as Vectors in L²; componentwise kNN-Isomap lecture;
   Max-Cut / SDP / EVA tutorial. Group key `archive_group: research_notes`.
4. Internal Research Papers (**4**): four UDLAP mathematics education studies
   about the incentive-linked support threshold, support use versus academic
   performance, instructor grade comparability, and first-year adaptation.
   Group key `archive_group: internal_research`.

The `#working-drafts` anchor is preserved for the third section and the new
`#internal-research-papers` anchor identifies the fourth. Keep their
per-record stage labels (notes, lecture, tutorial, working paper, research
draft) and canonical detail URLs unchanged; neither group is journal
submission or peer-review evidence. All six previously unlisted records
remain accessible at their existing URLs but are not in the index. The
`scripts/verify-paper-archive.mjs` rendered-output check asserts section
ordering, counts 4/1/4/4 and the exact group memberships. The associated
browser test checks both desktop and mobile list views.

The user reattached **the original, 31-page scanned PDF**
`notes on trend estimation(2).pdf` (exact SHA-256
`b099f7819c23ab1c5c682bd0e9669332a8fdc1b23c6fe622211d14fadf6f674e`).
A bit-for-bit duplicate for GitHub upload was staged as
`espino_2026_handwritten-trend-estimation-notes.pdf`. The final five pages
are blank. No OCR text was generated or claimed. **Outstanding blocker:** the
GitHub connector has a binary-blob API but cannot consume this local file
directly and the shell runtime cannot authenticate to GitHub; the separate
Drive-upload route requires user connection. The original PDF has therefore
NOT been pushed, and no public `pdf:` action was added to the existing
notes page. The user's copy remains accessible in the conversation for a
manual GitHub upload to `papers/`.

Once the exact PDF arrives in Git, update
`_pages/papers/handwritten-trend-estimation-notes.md` to include
`pdf: /papers/espino_2026_handwritten-trend-estimation-notes.pdf`,
replace the obsolete "Original PDF not yet hosted" paragraph with a direct
document link, and add a PDF resource link to the corresponding
`_data/cv.yml` Manuscripts record. Keep the original 31 pages and SHA-256
unchanged. Extend source + `_site` PDF integrity validation and the
Playwright detail-page download test; only then describe the PDF as
published. Do not replace it with the abstract SVG image or a reconstructed
lower-quality file.


## 2026-11-12 — CV research-group split (authoritative)

A recent correction supersedes the 2026-11-10 `Manuscripts (13)`
section. The owner distinguishes **finished projects and reports** from
**ongoing working drafts and mathematical notes**. The site now renders
the following grouped, reorderable and printable sequence:

- `Submitted Manuscripts (4)` — original journal submissions, unchanged.
- `Completed Research (6)` — the four completed Mathematics Learning Center
  study-lead internal reports (Student Engagement and Adaptation; Instructor
  Grade Heterogeneity; Support Persistence After Incentives; Mathematics
  Support and Classroom-Relative Performance), plus Stepping-Stone Volume
  Validation (finished software, Zenodo DOI) and the latent U.S. market-risk
  research project (presented at the CIMAT probability/statistics school).
- `Working Drafts & Notes (7)` — Smoothness-Integrated Trend Distances,
  Dynamic Forecast-Optimal Smoothness, Smoothness-Indexed PLS Python,
  componentwise kNN-Isomap lecture, Max-Cut/EVA tutorial, handwritten trend
  notes and Random Variables as Vectors in L².

All 13 previous `Manuscripts` source records are retained without changing
their item-level facts or status. These are **not** necessarily manuscripts
in the journal-submission sense; lectures, tutorials, internal reports and
software remain correctly named in their individual role/context fields.

The section-order customization persists under a new key,
`cv-section-order-v3`, instead of v2 to prevent a stale saved order from
referring to the removed `manuscripts` ID. Reset returns Modern Minimal
and the new source order. Browser and source tests check the 4+6+7 counts,
all completed/draft membership, select/reorder controls, and rendering in
print preview. Previous CV print WYSIWYG PR #56 was not modified.

## 2026-11-14 — Printed CV: top-aligned name and matching links

**User-reported regression:** a short selected CV in print/paper preview left a large blank area above the name. Some institution/resource hyperlinks acquired underlines or unexpectedly large type compared with surrounding text.

**Cause:** `renderPagedPreview` added half the unused height to `.cv-preview-paper-body` as an inline `padding-top` for single-page selections. Separately, screen-only link rules did not guarantee the same inherited type size/decoration when the cloned paper body was printed.

**Resolution:**
- Deleted the single-page vertical-balancing calculation and old `--cv-print-top-balance` print override. The name starts directly after the selected paper padding (A4 and Letter); short selections leave remaining white space **below** the content.
- Scoped a uniform anchor rule to `.cv-preview-paper-body`, covering paper preview and actual PDF print. Links inherit the typography of their parent text without underlines, while preserving semantic colored spans, link URLs and full-width reading appearance.
- Replaced the old balance-positive browser test with assertions for no artificial top gap and for matching parent/anchor typography in both screen paper preview and print media. Updated `test/style_contract.js`.

**Validation:** run `node test/style_contract.js` and the CV Playwright suite (`npm run test:visual -- --grep "CV paper preview and print start at the top"`). Check Chrome Print / Save PDF for one- and multipage selections using both A4 and US Letter, including clickable links. Avoid introducing top balance or an extra `@page` margin on top of physical sheet padding.

## 2026-11-15 — CV institutional icons, DOI labels, typographic consistency

**User request**: repair the NYU and IESE icons, show a DOI whenever a Zenodo resource appears, stop rendering faded research-context rows such as "Mathematical research lecture", and remove the repetitive "Not Submitted" wording from CV entries.

**Implementation**:
- The two CV/credential icon sources now use square favicons from `nyu.edu` and `iese.edu` through the existing Google S2 favicon proxy. This removes the cross-origin SVG and stale MBATube JPEG risks, while preserving issuer matching and the existing accessible fallback symbol.
- Five Zenodo resource links in `_data/cv.yml` carry `doi: "10.5281/zenodo.<record>"`. The Liquid renderer shows `<original label> · DOI: <identifier>` within the same anchor, with no new, potentially broken destination. Both reading mode and cloned paper/print pages inherit that text.
- `_data/cv.yml` no longer displays "Not Submitted" in CV roles or the research-working-draft context. Research categories remain "Working Draft", "Research Lecture", "Research Tutorial", and "Research Notes"; the original `_pages/papers/` stage wording is not changed and no acceptance is implied.
- CSS `.cv-context` now uses indigo `#4c5781` (matching secondary organization metadata) instead of `#70798b`/`#737373`; paper/print uses readable 8pt text, rather than 6.8pt faded gray.
- `test/style_contract.js` asserts issuer mapping, five DOI/source-ID matches, the renderer's DOI binding, absence of "Not Submitted" in CV data, and context styles. The CV Playwright suite checks both issuer images/fallbacks, DOI display, labels, and paper/print colors.

**Citation caution**: Zenodo records `21291269`, `21347375`, and `21088183` have previously documented DOI references; record `23432463` could not be independently opened during this change. The string `10.5281/zenodo.23432463` is derived from Zenodo's published standard record-ID DOI convention. Confirm it against the public record before formal scholarly citation; the site remains a record link rather than a claim of journal publication.

**Regression commands:** `node scripts/audit-cv-organization-logos.mjs`, `node test/style_contract.js`, and `npx playwright test --config test/visual/playwright.config.js test/visual/interactions.spec.js --grep "CV NYU and IESE"`. Run a Jekyll build and review Chrome's printed PDF. Note that unrelated existing credential-date/description contract failures should be handled independently rather than by altering verified user data.

## 2026-11-15 — Interactive ProximityGraphs technical feature added to CV and Papers

**User request:** List the publicly accessible article `https://heri-espino.github.io/proximitygraphs-siam-figures/article.html` as technical writing in the CV and next to La Catarina's AbaQuant article on `/papers/`.

**Verified source:** The authoritative project `heri-espino/proximitygraphs-siam-figures` has `article/main.tex` as the canonical current manuscript and `site/article.html` as the interactive author-hosted version. Its exact feature title is **The Empty Space That Makes a Network**, with Heriberto Espino-Montelongo first and Héctor Maravillo second. The main exposition covers Snow's road-distance catchment boundary versus a distinct modern Euclidean Voronoi reconstruction; alpha-shapes/alpha-hulls; Gabriel/RNG/β-skeleton neighborhood rules; the same 25-site controlled graph comparison; and Poisson empty-region/expected-degree examples. There are four online interactive demonstrations (the print draft uses three figures). The source labels it a **proposed SIAM News Software and Programming feature, not submitted, accepted or published by SIAM**, with no journal peer review. No external submission was made.

**Integration:**
- New Jekyll portfolio page `_pages/articles/the-empty-space-that-makes-a-network.md` at `/articles/the-empty-space-that-makes-a-network.html` uses `portfolio_type: article`, `importance: 2`, and an explicit **Interactive Article Draft** label with an author-hosted status. It belongs alongside `_pages/articles/abaquant-finanzas-matematicas.md`, which remains the **only externally published** technical article in this category.
- New CV `Published Articles & Technical Writing` entry is placed before AbaQuant in `_data/cv.yml`, dated **Nov 2026** as a draft, first-authored and coauthored with Héctor Maravillo. It links to the original live article, the site's article detail page, the LaTeX author-proof PDF on GitHub and source code. Its concise highlights describe implemented mathematical exposition and controlled figures; no fabricated publication affiliation.
- Cards use a local copy of the source's **original SVG** `site/assets/figure04-compare.svg` as `assets/img/portfolio/proximitygraphs-empty-space-compare.svg` (source blob SHA `0565c4352ad970c72c5a283bf42fbe1e7ad44c5e`). This is the 25-site Gabriel/RNG comparison; figure provenance is cited on the detail page. Rebuilding/maintaining the source visualization remains in its dedicated repository.
- `_pages/papers.md` preserves the four archive sections and `#published-technical-articles` anchor, but clarifies that **published** writing and **author-hosted editorial drafts** coexist in that section with individual stage labels. Expected rendered counts: **4 submitted, 2 technical writing, 4 research notes/lecture/tutorial, 4 internal research**. Hidden research records and all prior article URLs remain intact.
- Static assertions (`test/style_contract.js`), generated-site verification (`scripts/verify-paper-archive.mjs`) and Playwright checks (`test/visual/interactions.spec.js`) now cover card presence, author credits, content stage, figure integrity, source links and paper preview.

**Reproduction:** Run `npm run lint:style-contract`, `bundle exec jekyll build`, `node scripts/verify-paper-archive.mjs`, and `npx playwright test --config=test/visual/playwright.config.js test/visual/interactions.spec.js --grep "Papers and CV list the ProximityGraphs"` (requires the repository's Ruby/Jekyll and Playwright dependencies). If existing unrelated code-style or credential-data checks fail, investigate separately without removing scholarly records or reclassifying the proposed SIAM feature as published.

## 2026-11-15 — Remove redundant explanatory research lines in CV and PDF

**Problem:** The printable CV showed the helper line `Independent research software · numerical validation` larger and grayer than the other rows, plus equally redundant rows `Latent financial-risk modeling`, `Research working draft`, `Mathematical research lecture/tutorial`, `Handwritten mathematical research notebook`, `Expository probability and Hilbert-space analysis`. A new ProximityGraphs article introduced a similar `Coauthored with Héctor Maravillo · proposed SIAM News feature` context line.

**Correction:** Remove all eight standalone `context:` rows from `_data/cv.yml` and the unused GitHub-only icon fields for Stepping-Stone validation. Remove the shared `entry.context` template and the dead `.cv-context` rules (normal reading, Harvard, LaTeX, A4/Letter paper previews and physical print). Existing names, roles, dates, highlights, working-draft categories, links and external record pages remain intact. The separate ProximityGraphs article detail still lists Héctor Maravillo as coauthor and correctly identifies its unsubmitted editorial stage.

**Invariant:** Do not invent an employer/institution for independent work. The factual CV metadata contract now accepts three core fields (title, role, date) plus either a real institution or an explicit source link for independent research. Browser tests assert the explanatory rows are absent in reading, paper preview and print, while the source repository link and DOI resources survive. Earlier historical handoff instructions requiring `cv-context` rendering or styling are superseded.

## 2026-11-15 — Independent research and complete scientific-software portfolio under Experience

**User instruction:** Add independent-research experience to the CV, including four journal submissions, five software projects (AbaQuant, ProximityGraphs, TrendEstimation, AwesomeFigures, Docling Math) and technical writing. The prior recommendation was to **synthesize** these in Professional Experience while **retaining full individual software entries** in Programming Experience.

**Data:** Inserted `Independent Researcher & Scientific Software Developer` as the **first** `Professional Experience` record in `_data/cv.yml`. The visible title uses `role: "Independent Researcher"` and `subtitle: "Scientific Software Developer"` (the renderer joins them without repeating the full YAML name). The **Aug 2024 — Present** date uses the already-documented AbaQuant August 2024 start as the earliest supported scientific-software activity, not an unverified date of university employment. No organization/institution/context is added to independent work; links lead to the real Papers archive and GitHub account.

**Five bullets:**
1. Four genuinely submitted, not necessarily accepted, journal manuscripts across stochastic/computational geometry, CNN interpretability and quantitative finance.
2. TrendEstimation numerical PLS smoothing and AbaQuant financial mathematics.
3. Co-maintained ProximityGraphs with only selected PyPI releases and Zenodo validation archives.
4. Docling Math mathematical PDF extraction and AwesomeFigures scientific visualization and LaTeX-ready graphics.
5. Technical writing: published La Catarina AbaQuant article versus an author-hosted interactive ProximityGraphs feature, plus reproducible Python/Git/LaTeX workflows.

**Duplication boundary:** Experience summarizes responsibilities; Programming Experience retains separate releases, coauthor roles, source links and package statuses; Submitted Manuscripts and Technical Writing retain detailed records and verified editorial stages. Do not falsely claim Docling Math, AwesomeFigures or TrendEstimation are all already on PyPI/Zenodo. No fake affiliation or new decorative standalone explanation line.

**Regression:** `node test/style_contract.js`; `bundle exec jekyll build` and `node scripts/verify-public-profile.mjs`; Playwright `test/visual/interactions.spec.js --grep "CV lists independent researcher first"` (desktop/mobile). Browser validation also checks paper preview and native print.

## 2026-11-15 — Graduation-date text editor for Data Science and Actuarial Science

**Owner request:** When the expected graduation month/year varies (e.g., June 2027 versus December 2027), allow freely typed date wording directly in the public CV editor, instead of hardcoded date choices. Both degrees can have different completion dates.

**Implementation:** Under `Customize CV`, the new `Edit expected graduation dates` disclosure uses two labeled single-line text inputs generated from `cv.sections.Education`. Their initial values are the substrings after the en dash-separated start-date range in `_data/cv.yml`. For each degree, `assets/js/cv-customize.js` updates only the `.cv-date` **textContent** of the source education record, preserving its trusted `data-cv-date` and first-year/semester for sorting. The chronological view and printed pages clone those updated records. Example: `Aug 2023 — Jun 2027 (expected)` and `Aug 2021 — Dec 2027`. Any user-provided text is displayed literally, never evaluated as HTML.

**Scope and persistence:** Custom graduation texts are stored only in the current browser's `cv-graduation-text-v1` key. They survive reload, do not change public site YAML or the CV for other visitors, and are included in paper preview and browser Print / Save PDF. If local storage is disabled, edits still work for the session. Empty completion text leaves the enrollment date alone. `Reset options` removes overrides and restores source defaults. Edit `_data/cv.yml` explicitly only when the author wants to change globally published default values.

**Regression:** New Playwright test checks independently edited completions, no source-start-date mutation, paper/PDF/chronological propagation, reload, HTML escaping via textContent, and Reset. `test/style_contract.js` guards the two data-driven fields, browser persistence, and unchanged canonical YAML dates. No changes to printing CSS, actual degree status, academic records, manuscripts, or other CV entries.

## 2026-11-15 — Journal submission labels, ongoing statistical PLS and Max-k-Cut SDP

**Owner clarification:** The independent-research experience should communicate ongoing work on **TrendEstimation**, statistical **penalized least squares (PLS)**, and **Max-Cut/Max-k-Cut semidefinite programming (SDP)** as **in development**, separately from submitted manuscripts and DOI-archived software outputs. The earlier shorthand "Numerical software: built TrendEstimation (PLS)" was ambiguous about completion and about the meaning of PLS; this has been replaced with the full term **penalized least squares**.

**Current five-bullet Professional Experience synopsis in `_data/cv.yml`:** four genuine journal submissions to Elsevier (two), Springer Nature (one), Wiley (one); current TrendEstimation statistical smoothing and Max-Cut/Max-k-Cut SDP research in development; AbaQuant and jointly maintained ProximityGraphs scientific software with PyPI releases and Zenodo DOIs; Docling Math and AwesomeFigures tools; published La Catarina writing and author-hosted interactive ProximityGraphs technical feature. The source links and detailed entries remain the authoritative records.

**Editorial safeguard:** Preserve distinct Submitted Manuscripts states (Elsevier Discrete Applied Mathematics — Under Review; Elsevier Computational Geometry — Under Revision; Springer Nature SN Computer Science — Under Review; Wiley Journal of Futures Markets — Submitted). Neither Zenodo archival DOI nor PyPI distribution implies peer review. No manuscript is submitted by this CV change. Max-Cut tutorial and TrendEstimation papers stay in their existing working-draft/lecture/tutorial categories. Preserve the separate graduation-date text editor work in PR #74.

**Tests:** `test/style_contract.js` checks journal names and in-development wording; `test/visual/interactions.spec.js` checks the actual CV and print pages. All professional-experience highlights stay at or under the repository's 94-character paper limit.

## 2026-11-15 — Brief first-person research profile at top of CV

**Instruction:** Add a short, technically grounded paragraph near the beginning describing the author's interest in deep mathematics, research-question formation, development of statistical and optimization models, implementing and validating algorithms, decision-making, scientific ideas, written/presentation communication and visualization.

**Text** in `_data/cv.yml` under `cv.profile`: “I enjoy formulating research questions and pursuing them from mathematical theory to computational implementation: deriving results, developing statistical and optimization models, and validating them through reproducible experiments. I value translating technical ideas into informed decisions and communicating them clearly through scientific writing, visualization, and presentations.”

**Implementation:** `_includes/cv/render.liquid` prints escaped `cv.profile` in `.cv-research-profile` **after the contact block and before Education**. It is not the site `page.description`, whose `.post-description` is intentionally omitted by the paper clone in `assets/js/cv-customize.js`. Unlike the original generic description, the new paragraph survives paper preview and browser PDF. CSS in `_sass/_cv.scss` uses ordinary inherited text color (not faded gray), a comfortable screen size and compact 7.7pt paper/print size.

**Regression:** Browser test `CV research profile connects mathematics, models and communication in print` checks exact thematic fragments in reading/preview/print and shared body color. Static style contract requires source text, safe Liquid escaping and scoped print styles. The standalone Independent Researcher entry and original four submitted manuscripts remain separate; the profile does not imply acceptance or publication.

## 2026-11-16 — Six detailed research experience categories and research coordination

**Owner revision:** Restore the **richer version** of the first Professional Experience entry, explicitly naming stochastic geometry and explaining work across mathematical research, scientific computing, research software engineering, technical writing, reproducibility, and research coordination. The sixth category is grounded in the owner's statement that they convened meetings, prepared reports and presentations, explained advances, and incorporated feedback.

**Structured data:** `_data/cv.yml` now has six entries under the first professional role's `highlights`, each with:
- `label:` one of the six professional categories;
- `detail: >-` the full longer narrative, shown in the reading CV;
- `paper:` a copyedited one-line summary of no more than `94 - len(label + ': ')` characters, shown in paper preview and PDF.

The new Liquid logic accepts structured highlights **only when all three fields are present** and retains the old path for every existing string highlight in other CV entries. The two escaped spans preserve the full text as real document text without CSS-generated content or ellipsis. In `_sass/_cv.scss`, show `.cv-highlight-detailed` in the reading view and `.cv-highlight-condensed` in paper-preview clones and print. Existing print layouts suppress wrapping of short CV bullets, so do not surface the longer detail in physical-sheet mode.

**Scientific/editorial accuracy:** Four submitted manuscripts are two Elsevier, one Springer Nature, one Wiley and span stochastic/computational geometry, ML interpretability, and quant finance. Statistical PLS/TrendEstimation and Max-Cut/Max-k-Cut SDP methods are **active research**, not additional journal submissions. The user built research workflows *using* SDP optimization solvers; do not imply a newly developed production-grade general solver. AbaQuant and ProximityGraphs have selected PyPI and Zenodo archives; Docling Math and AwesomeFigures are research software projects. La Catarina is published; the interactive ProximityGraphs article is an author-hosted proposal, not accepted by SIAM. Coordinating meetings/reports/presentations and incorporating feedback is a separate explicit competency, not a fictitious institutional appointment.

**Regression:** `test/style_contract.js` requires six labeled items, research terms and each `label + ': ' + paper` <=94 characters. `test/visual/interactions.spec.js` checks six visible detailed rows in reading and six compact rows on screen paper/print. The site's global CV print tests must continue to have zero overflow. These changes do not touch degree start dates, browser-local graduation-date editor, separate programming records, paper statuses, or detailed software metadata.

## 2026-11-16 — Owner-uploaded Paletas, NYU and IESE logos; one shared short CV bullet set

**Requested corrections:** The user supplied three image files: square pale-green `Paletas Loreto` wordmark, a purple NYU torch with its letters on a checkerboard graphic, and an IESE red shield. Use them in place of the prior logos. Remove NYU's border/padding. Use **the same concise Independent Researcher bullets on the website as in the printable CV**, splitting out research fields, journal submissions, and ongoing statistical PLS / SDP work as the first three bullets.

**Assets and provenance:** Source uploads `image(20261116-073609).png` (Paletas), `image(20261116-073624).png` (NYU), `image(20261116-073659).png` (IESE). Optimized true WebP 144×144 local assets:
- `assets/img/cv-organizations/paletas-loreto-owner.webp`: user-supplied full square green wordmark (~1092 bytes).
- `assets/img/cv-organizations/nyu-torch-owner.webp`: exact crop from user-uploaded purple torch square at original pixel bounds [109,68,291,250], scaled down for compact CV icons (~1924 bytes); excludes the checkerboard exterior and undersized NYU letters below the square.
- `assets/img/cv-organizations/iese-shield-owner.webp`: original user-supplied red mark on transparent background with cropped whitespace, preserving antialiased edges (~4002 bytes).
All original source images remain the conversation uploads and previous repository logo assets have not been removed.

**Mapping/compatibility:** Paletas mapping changed in `_data/cv_organization_logos.yml`; NYU and IESE now point to the local image paths in `_data/credential_issuers.yml` so both CV/credentials views use the same assets. `_pages/credentials.md` now applies `relative_url` to local paths to support both the production custom domain and the `/al-folio/` Playwright base URL. The existing Jekyll CV template already applies `relative_url`. Print rasterization receives real local WebP files, not cross-origin SVG or favicon URLs.

**Research CV:** The first Professional Experience entry in `_data/cv.yml` now has 8 ordinary escaped single-line highlight strings (each ≤80 chars) *identically* shown in reading, A4/Letter preview and Print/PDF. First bullet names **stochastic and computational geometry, ML interpretability and quantitative finance**; second says **four journal submissions** to Elsevier (2), Springer Nature and Wiley; third says **TrendEstimation's penalized least-squares statistics and Max-Cut/Max-k-Cut SDP are ongoing**. Remaining bullets retain truthful software, tools, writing, PyPI/Zenodo and research-coordination evidence. Earlier six dual `{label,detail,paper}` bullets are superseded; removed their conditionals/CSS, leaving all unrelated CV records unchanged. No submitted output is implied accepted or peer-reviewed, and archived DOI ≠ journal publication.

**Verification:** `node test/style_contract.js`, `node scripts/audit-cv-organization-logos.mjs`, Jekyll build, `node scripts/verify-public-profile.mjs`, and Playwright `test/visual/interactions.spec.js` (especially independent-research and logo cases). Existing course-credential source check inconsistencies unrelated to this edit may remain.

## 2026-11-16 — Free-text research description editor under Customize CV

**User request:** Allow editing the introductory research description that begins “I enjoy formulating research questions and pursuing them from mathematical theory to computational implementation …” in the same interface used to edit individual graduation dates. The input should support arbitrary prose, multiple lines, live preview, and print/PDF, without changing the public default for visitors.

**Files:** `_includes/cv/render.liquid` adds a labeled `#cv-profile-text` multiline textarea inside a `#cv-profile-editor` disclosure immediately following the graduation-date editor. The initial textarea value comes from the **existing escaped** `cv.profile` YAML field. `assets/js/cv-customize.js` loads an optional browser-local `cv-profile-text-v1` override (accepts empty text; max 20,000 stored characters), writes only `.cv-research-profile.textContent`, calls `render()` on input, and removes the saved override in Reset options. `_sass/_cv.scss` styles the editor and uses `white-space: pre-wrap; overflow-wrap: anywhere;` for safe multiline display and pagination.

**Semantics:** The source YAML profile remains unchanged and is shown for fresh browsers and for no-JavaScript rendering. Overrides live solely in the editor's current browser, persist after reload where localStorage works, and propagate into cloned paper preview and Ctrl+P/Save PDF. Neither the text nor the storage key is sent to GitHub or used in HTML attributes. Markup remains literal text; an empty editor intentionally leaves a blank description until Reset. This complements, but does not replace, the independent per-degree graduation-date editor.

**Regression:** `test/visual/interactions.spec.js` includes `CV introductory description supports multiline edits, reload, print and reset`, checking default, live preview, newline preservation, paper/native print, reload, HTML safety, empty value and Reset. `test/style_contract.js` checks the Liquid input, textContent-only path and storage/print contract. Existing research experience, publications, CV section order, logos and PDF margins are unaffected.

## 2026-11-16 — User-corrected Linear Algebra Academic Assistant contribution

**Current owner instruction supersedes the 2026-11-12 historical note at line ~1133** asserting the user “only translated existing LaTeX presentations from English into Spanish.” The owner now specifies that they authored original **complete-course LaTeX Beamer presentations**, including systems of linear equations, vector spaces, linear transformations, eigenvalues and complex numbers; delivered the presentations, received feedback and incorporated revisions.

**Exact CV bullets** in the existing `Academic Assistant — Linear Algebra` item in `_data/cv.yml`:

- `Slides: authored full-course LaTeX Beamer decks on systems of linear equations.` (79 characters)
- `Topics: vector spaces, linear transformations, eigenvalues, and complex numbers.` (80 characters)
- `Teaching: presented the slides, incorporated feedback, and revised materials.` (77 characters)

The user requested exactly **three** polished bullet points. Keep the affiliation `Universidad de las Américas Puebla`, location, and Jan–May 2023 dates unchanged. This is an Academic Assistant role and does not imply an appointment as course instructor. Bullets are short enough for the existing Europass A4/Letter PDF limits. The `test/style_contract.js` source guard and Playwright `CV Linear Algebra assistant lists Beamer course decks, topics and feedback in paper and print` enforce the three bullets in reading, paper preview and browser print. This update accompanies the independent browser-local editable research-profile editor in PR #77.

## 2026-11-16 — Handwritten trend notebook: PDF action and two independent previews

The 31-page public PDF now exists at `notes/notes on trend estimation.pdf`
(4,312,328-byte repository object). The original notes page
`_pages/papers/handwritten-trend-estimation-notes.md` links directly
to this file with `pdf:` and `pdf_new_tab: true`, rather than presenting
the earlier upload-blocker notice. The same public PDF URL is listed in
the CV research-notes record. The original file is not moved or modified.

The *research archive card* has a first-page thumbnail at
`assets/img/portfolio/handwritten-trend-first-page.webp`, reproducibly
rendered from the public PDF by
`python scripts/generate_handwritten_trend_preview.py`
(requires PyMuPDF and Pillow). The *detail page*, independently, has
`assets/img/portfolio/handwritten-trend-spectral-preview.webp`, a
downscaled WebP of the owner's uploaded spectral-eigendecomposition
screenshot. The two roles should never be reversed or conflated.
The site continues to describe this as unsubmitted handwritten notes.

The older 2026-11-10 / 2026-11-11 PDF-transfer blockers in this historical
handoff are superseded by the actual file and links above.

## CV leadership logo update — 2026-11-19

At the owner's request, the Preety Good Quantum OE entry now uses an original,
Cheshire/Schrödinger-inspired quantum-cat illustration (superposed cat, state
ket, and atom-like orbit), approved in chat. Its transparent WebP is stored at
`assets/img/cv-organizations/preety-good-quantum-cat.webp`, optimized to
96 × 96 for the small organization icon. The logo mapping is
`_data/cv_organization_logos.yml`; the older navy-Q logo is retained for
provenance. The official UDLAP spelling `Preety Good Quantum OE` is kept in
`_data/cv.yml`. Related direct UDLAP text-fragment links and the Bitwise
logo remain in PR #80. The new logo is a custom mark, not an institutional
endorsement. Validate in the browser and browser-generated PDF after build.


## CV physical print margins and page packing — 2026-11-19

**User report:** the browser-generated six-page A4 CV left excessive top and
bottom whitespace. The supplied PDF was inspected without uploading it to the
public repository. On page 1 the top of visible text was roughly 38.5 mm from
the physical edge; on later pages it was about 13.4 mm. Pages 4 and 5 left
roughly 75 and 71 mm below their last text, respectively. The final page is
naturally short and cannot be filled unless the preceding page breaks change.

**Fix:** `assets/js/cv-customize.js` now offers 7 mm default (LaTeX), 5 mm
narrow, 10 mm standard and 15 mm wide physical margins (both A4 and Letter).
`_sass/_cv.scss` resets top offsets on the site's print-only main/CV wrappers
and aligns the `data-cv-density="latex"` paper preview typography, line
heights, entry gaps, and section spacing to the compact **printed** metrics.
Previously the browser screen preview was measured at approximately 9 pt with
9 pt entry gaps, while the PDF used 6.5 pt highlights and substantially
smaller gaps. `renderPagedPreview` thus broke pages prematurely. Keeping
measurement and print consistent should allow more entries per page without
splitting records. The saved PDF remains real, selectable text with hyperlinks.

**Controls:** Users can still select all four margin presets, either paper
size, the text-size presets, and their preferred template. The reading-mode CV
retains its existing typography. Native print and the Print menu both use the
same paginated source. The short last sheet may still contain blank space, as
nothing is vertically centered or stretched.

**Regression:** `test/style_contract.js` checks the new margin map and
shared compact measurements; `test/visual/interactions.spec.js` compares
the paper preview's computed font/gap geometry with the print-media clone,
asserts no double sheet padding, and checks that print-only outer wrappers
have zero top offset. Run the CV Playwright suite and inspect a real saved A4
and Letter PDF, checking page one and page counts.


## CV sparse-pages regression and native continuous print — 2026-11-19

**Owner-provided A4 PDF after the tighter-margin change:** six pages with
**physical pages 2 and 5 nearly empty** (page 2 contains only the final Wiley
manuscript entry; page 5 contains only the Google Cloud specialization).
PyMuPDF bounding-box inspection of the actual uploaded PDF found page-2 text
extents at 19–65 pt and page-5 extents at 19–48 pt of 842 pt paper height.

**Root cause:** `renderPagedPreview(true)` created multiple fixed-height
*estimated* screen sheets while print CSS forced
`break-after: page` between the clones. Differences between preview and
Chromium's printed line metrics caused one record to spill onto a second
*physical* sheet, followed by a forced break to the next estimated sheet.
This is **double pagination**, not a margin problem.

**Fix:** keep the numbered paper-preview sheets in screen mode, but in native
print emit **one continuous, cloned, fully selected paper-style document**.
The browser alone decides physical A4/Letter breaks; remove explicit print
page-break rules on cloned preview containers while keeping
`break-inside: avoid` for individual entries. Content/ordering/links/images
and the selected paper typography/margins are unchanged. Paper preview
remains an approximation: do **not** promise identical on-screen page
boundaries. `data-cv-single-page` still reflects actual content height.

**Regression:** the CV Playwright suite checks that printing uses exactly
one cloned flow, that its computed `break-after` is `auto`, and that a
default A4 PDF uses fewer than six physical pages (rather than leaving two
mostly blank sheets). The tests still verify PDF text and all selected
records are present in the printable DOM. Never restore the old forced
page break after screen-estimated sheets; verify browser-generated PDF
page density whenever print CSS or sizing changes.


## Editable start and graduation dates in the same CV panel — 2026-11-20

**Request:** Extend the existing `Edit expected graduation dates` disclosure,
rather than create another button, to allow independently changing the
*beginning* and *end* of the education dates for Data Science and Actuarial
Science.

**Interface:** `_includes/cv/render.liquid` now labels the disclosure
`Edit degree start and graduation dates`. For each `Education` record,
it renders a `fieldset` with the degree name, a free-text **Start date**
populated from the first half of its source date, and the existing free-text
**Expected graduation** populated from the last half. The original end-field
IDs and `data-cv-graduation-input` attributes remain stable. The paired fields
are grouped by `_sass/_cv.scss` solely inside the settings panel, not on
printed pages. This supersedes the earlier instruction to leave starts fixed.

**State and compatibility:** The existing browser-local
`cv-graduation-text-v1` map is read/written unchanged for completion dates.
Start-date changes use a **separate** `cv-graduation-start-text-v1` map keyed
by `degree.subtitle | slugify`. Therefore previously stored graduation
wording is preserved even when no start-date preferences exist. Neither key
is uploaded to GitHub or changes the publicly displayed defaults for other
visitors. Empty values are permitted; display strings join only nonempty
parts with an em dash. Both Reset options and per-field restoration use
the original Jekyll-rendered `defaultValue`.

**Render/security contract:** `assets/js/cv-customize.js` updates only
`.cv-date.textContent` inside the original two education records. Untrusted
text stays literal even when it contains markup. `data-cv-date` retains the
canonical source for chronological sorting; edited text is cloned for
chronological display, paper preview and browser Print/Save PDF. The
no-JavaScript CV continues to show canonical YAML dates, which remain
`Aug 2023 — Dec 2026 (expected)` and
`Aug 2021 — Dec 2026 (expected)` until explicitly changed globally.

**Tests:** `test/style_contract.js` guards start/end inputs, browser keys,
legacy completion restoration, print-safe text rendering, and reset behavior.
`test/visual/interactions.spec.js` checks independent editing of all four
fields, print/timeline propagation, persistence after reload, legacy key
compatibility, XSS-safe literal text, empty sides, and reset. These tests
do not change actual education facts or PDF pagination.


## Elsevier Stepping-Stone journal publication and DOI — 2026-11-24

**New authoritative owner evidence:** The Stepping-Stone journal paper is **published**, not "Under Revision". The supplied final publisher record is
`https://www.sciencedirect.com/science/article/pii/S0925772126000453`,
DOI `10.1016/j.comgeo.2026.102287`, in Elsevier's *Computational Geometry*.
The first author is Heriberto Espino-Montelongo and the coauthor is Héctor
Maravillo. The DOI suffix identifies the published article as 102287. At
the time of this change, the official Elsevier page could not be fetched
in the browsing environment, so **do not invent volume, issue or a precise
publication day**. The CV's `Nov 2026` is the month when the owner reported
the published online article; the original August 2026 manuscript
submission date remains historical provenance in earlier handoff entries.

**CV:** `_data/cv.yml` now lists the original journal record under
`Published Articles & Technical Writing`, ahead of the author-hosted draft
and La Catarina technical article. The entry is first-authored,
`Elsevier · Computational Geometry · Published`, has a direct ScienceDirect
publisher link, and shows a distinct **DOI: 10.1016/j.comgeo.2026.102287**
link in the browser and printed PDF. Preserve the author-manuscript PDF,
SSRN preprint, portfolio detail page, Zenodo validation DOI, and the two
existing technical highlights. Its previous record is not duplicated
under `Submitted Manuscripts`. The independent-research summary notes
one peer-reviewed Elsevier publication and **three other submissions**;
the remaining journal submission statuses are unchanged.

**Paper page and archive:** `_pages/papers/stepping-stone.md` retains its
existing permalink and `portfolio_type: paper` while adding
`publication_stage: published`, journal/DOI metadata and links to the
authoritative final publisher version. In `_pages/papers.md` the submitted
filter excludes the now-published paper; the published section combines
published journal papers with the two preexisting
`portfolio_type: article` records. Do not change the author-hosted SIAM
feature's explicitly unpublished editorial stage. The published paper has
its own card label and DOI metadata in the scholarly JSON-LD layout.

**Tests:** `scripts/verify-paper-archive.mjs` asserts **3 submitted + 3
published/writing cards**, presence of the Elsevier journal card and DOI,
no duplicate submission entry, and intact internal study/notes archives.
`test/style_contract.js` and `test/visual/interactions.spec.js` check
correct source grouping, DOI URLs, stage, author credit, and the CV's
printable/paper-preview output. Existing unrelated CI failure baselines
must be distinguished from regressions introduced by this change.


## Return published Stepping-Stone to combined CV Manuscripts section — 2026-11-24

**Correction requested by owner after the publication update:** The journal
paper was correctly marked **Published**, but moving it from its original
CV section into technical writing disrupted the desired CV layout. Keep the
article grouped with the other journal manuscripts and rename the
`Submitted Manuscripts` CV heading to **`Manuscripts`** instead.

**Implementation:** In `_data/cv.yml`, the four CV Manuscripts entries are
(1) Unit-Region Factorization (Elsevier, Under Review), (2) Geometry and
Volume of Stepping-Stone Diversion Neighborhoods in Euclidean Spaces of
Arbitrary Dimension (Elsevier, **Published**), (3) Activation-Patching CNNs
(Springer Nature, Under Review), (4) Posterior Integration WTI Average Price
Options (Wiley, Submitted). The published record retains its November 2026
display month, first-author role, exact ScienceDirect link, DOI
`10.1016/j.comgeo.2026.102287`, site portfolio, author PDF, SSRN and
numerical-validation Zenodo DOI `10.5281/zenodo.21291269`, and both
existing research highlights. `Published Articles & Technical Writing`
still contains precisely its two original unrelated technical entries;
the journal paper is not duplicated there.

**Display and personalization:** The Liquid CV renderer still uses
full-detail `cv-entry` layout for journal manuscripts and now keys that
format to `Manuscripts`. JS changes its Europass label and positioning
rules accordingly. Old browser `cv-section-order-v3` arrays stored with
`submitted-manuscripts` are normalized to `manuscripts` at load; all
other saved section-order choices and CV/PDF controls are preserved. The
published DOI and Zenodo link remain clickable in reading, timeline, paper
preview and native print. No date, author, or link metadata was invented.

**Important boundary:** The **Papers archive** retains its separate
Published Journal/Technical Writing section with the Elsevier paper (three
archive cards) and three submitted manuscripts. Its article detail page,
DOI, JSON-LD metadata, SSRN and validation reproducibility materials remain
unchanged. A shared `Manuscripts` section is a **CV layout preference**,
not a reversal of the Elsevier publication decision.

**Regression checks:** `test/style_contract.js` ensures four distinct CV
manuscripts including the published paper and exact journal/Zenodo DOI
links. `test/visual/interactions.spec.js` verifies four CV entries, two
technical-writing entries, published status, links, presence in paper preview
and print, and migration of the old stored section order. Do not conflate
CV record counts with Papers archive counts. This note supersedes the CV
relocation prescribed in the previous November 24 publication handoff.
