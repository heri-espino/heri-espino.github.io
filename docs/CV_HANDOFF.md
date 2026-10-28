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
- Personal navy single-column print design or Harvard-inspired classic single-column design.
- Template-default, Arial, Georgia, Times New Roman or Garamond-family typography.
- A4 or US Letter and balanced/compact spacing.
- Browser Print / Save as PDF; Reset returns the original layout.

**Harvard-inspired** means an independent conservative academic style. It
is neither official nor endorsed by Harvard University.

Chronology uses the *start* date of a range (e.g., an Aug 2023--Dec 2027
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

Education was reconciled to the uploaded source: Data Science expected
Dec 2027, GPA 9.6/10; Actuarial Science expected Dec 2026. The Mathematics
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
icons remain generic category pictograms, not official brands. Settings are
ephemeral to the current page and are reset by Reset options. Print settings
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

Two first-author research records explicitly say **Under Review**:
Elsevier / *Discrete Applied Mathematics* (LAGOS special issue) and Elsevier /
*Computational Geometry*. Neither is marked as accepted or published.
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
