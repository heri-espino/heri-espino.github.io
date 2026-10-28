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
