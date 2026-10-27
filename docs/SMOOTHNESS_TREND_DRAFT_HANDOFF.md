# Smoothness-integrated trend distances: website handoff

## Added entry

- Record: `_pages/papers/smoothness-integrated-trend-distances.md`
- Published route after merge: `/papers/smoothness-integrated-trend-distances.html`
- Illustration: `assets/img/portfolio/smoothness-integrated-trend-distances.svg`
- Classification: `Research Draft`; it belongs to **Working Drafts & Ongoing Research**, not **Submitted Manuscripts**. The existing `_pages/papers.md` filters place it automatically.
- Companion repository: `https://github.com/heri-espino/Trend-Estimation`.

## Source and limitations

The primary source supplied in the conversation is the five-page PDF `trend_comparison_two_column.pdf`, titled *Smoothness-Integrated Trend Distances with Nonzero Difference Drift: Mathematical Formulation and Numerical Implications*.

The new website entry captures the central definitions, scope, and synthetic example. Its SVG is an original diagram of the numerical vectors and rolling statistics described in the note, **not** a PDF first-page preview or an empirical plot. The note's example vectors are illustrations, not calculated PLS outputs. The agricultural NDMI monitoring discussion is an application proposal, not a validated detector.

The PDF bytes were provided as a conversation attachment but could not be transferred to the GitHub repository through the text-only file-write connector. **No broken PDF link was added.** To publish the original full manuscript, add the actual file at `papers/espino_2026_smoothness-integrated-trend-distances.pdf` on this feature branch and add the following front-matter field to the Markdown record:

```yaml
pdf: /papers/espino_2026_smoothness-integrated-trend-distances.pdf
```

Replace the synthetic `detail_image` with a separately generated preview of the PDF's **entire first page** if publishing the PDF, consistent with `AGENTS.md`.

## Validation checklist

1. The Jekyll `site.pages` collection includes the new `portfolio_type: paper` page.
2. The paper appears under Working Drafts on `/papers/`, without changing the Submitted Manuscripts filter.
3. The home page continues to feature only its existing top two papers, since `importance: 65` is after the submitted entries.
4. The SVG is accessible, visible and not confused with a genuine PDF image.
5. Run the repository's Docker/Jekyll build, Prettier check, and `test/style_contract.js` before merge (connector environment does not provide local repository dependencies).

No claim of journal submission, accepted publication, confirmed change-point detection, or online validation is made.
