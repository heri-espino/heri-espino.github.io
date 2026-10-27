# CV handoff — customizable public page

## Intent and current implementation

The public, Jekyll-generated CV is published at \`/cv/\` and linked from the
top navigation and home profile. Source: \`_data/cv.yml\`. Rendering stays
in the existing \`_includes/cv/render.liquid\` local override, with
\`assets/js/cv-customize.js\` and \`_sass/_cv.scss\`.

User-selected options (client-side and independent of Jekyll):

- Grouped by existing YAML section order (default).
- Global chronological order, newest/oldest first, with source section labels.
- Show/hide any CV section for both preview and print.
- Personal navy two-column print design or Harvard-inspired classic one-column design.
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
2. Edit \`_data/cv.yml\`, not generated HTML. Prefer links to existing site
   detail pages or directly verified documents.
3. If print controls change, keep matching IDs in Liquid and JS and update
   the contract checks in \`test/style_contract.js\`.
4. For CSS, preserve the local override allowlist and reduce-motion,
   light/dark, mobile, accessible focus, and print behaviors.
5. Compile the standalone LaTeX source with
   \`latexmk -xelatex -interaction=nonstopmode -halt-on-error Heriberto_Espino_Montelongo.tex\`
   on the machine where that source is stored. Verify page count and inspect
   rendered pages.
6. For the website, run existing site validation commands in AGENTS.md,
   including \`node test/style_contract.js\`, a Jekyll build, and a Chromium
   print-preview check (both templates, both page sizes, grouped/timeline
   sorting, and closed expandable sections).

## Remaining editorial verification

The existing web YAML predates the user-supplied LaTeX and has entries that
may need further reconciliation, especially professional highlights,
scholarships, projects, medals, and certification descriptions. Avoid silently
substituting one version for another where contradictory claims lack
verification. Keep the website's public privacy boundary intact.

Do not merge or deploy a draft PR without the user's authorization.
