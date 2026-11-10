---
layout: portfolio-item
permalink: /papers/posterior-integration-volatility-wti-asian-options.html
portfolio_type: paper
pdf: /papers/when-does-posterior-integration-change-option-values.pdf
secondary_pdf: /papers/when-does-posterior-integration-change-option-values-supplement.pdf
secondary_pdf_label: Supporting Information PDF
importance: 35
card_kind: "Submitted manuscript"
title: "When Does Posterior Integration Change Option Values? Evidence from WTI Average Price Options"
card_title: "When Does Posterior Integration Change Option Values? Evidence from WTI Average Price Options"
label: "Submitted"
status: "Submitted to The Journal of Futures Markets · Wiley"
display_date: "2026"
summary: "Investigates when integrating option values over a posterior volatility distribution changes WTI Average Price Option prices. Ten million simulated return histories identify the role of volatility-posterior dispersion and option-price curvature; date-ordered WTI observations compare historical volatility with earlier option-implied inputs."
framing: "Posterior-integrated (PI) and posterior-mean plug-in (PM) prices differ according to price curvature and posterior volatility variance. In the October 2026 sample their mean absolute difference is 0.000745 USD/bbl, despite a 0.2733 USD/bbl mean 95% posterior model-price interval width. The 2,381-observation conditional comparison uses settlement-price proxies and same-day futures inputs, not executable trading outcomes or a fully prospective forecast. Submission does not imply peer-review acceptance."
tags: ["Bayesian inference", "Asian options", "WTI crude oil", "posterior integration", "implied volatility"]
image: /assets/img/portfolio/jfm-posterior-integration-figure.webp
image_alt: "Figure 1 from the submitted manuscript: posterior dispersion, WTI option-state pricing differences, fixing fractions and the second-order approximation"
detail_image: /assets/img/portfolio/jfm-posterior-integration-first-page.webp
detail_image_alt: "Complete first page of the anonymous ten-page manuscript, When Does Posterior Integration Change Option Values?"
contributions:
  - "Compares posterior-integrated option prices with posterior-mean volatility plug-in prices and explicitly distinguishes price differences from posterior model-price uncertainty."
  - "Analyzes 10 million simulated return histories and 5,880 option-state cells; the second-order curvature–variance approximation has cell-level correlation 0.9995."
  - "Finds a mean absolute PI–PM difference of 0.000745 USD/bbl across 310 October-2026 contract-date observations, against a mean 95% model-price interval width of 0.2733 USD/bbl."
  - "Across 2,381 date-ordered option observations, reports conditional pricing MAE of 2.6187 USD/bbl for historical PI versus 0.1075 USD/bbl with earlier APO-implied volatility under the stated model."
  - "Includes sensitivity, numerical-agreement, alternative-volatility and futures-correlation checks in a separate Supporting Information PDF."
---

**Submission:** *The Journal of Futures Markets* (Wiley). This is a submitted manuscript, **not** a published or accepted article. The main PDF is anonymous for journal review.

**Files:** [Read the main manuscript (PDF, 10 pages)]({{ '/papers/when-does-posterior-integration-change-option-values.pdf' | relative_url }}) · [Read Supporting Information (PDF, 3 pages)]({{ '/papers/when-does-posterior-integration-change-option-values-supplement.pdf' | relative_url }}).

The preview beside this article is the **complete first page of the main manuscript**. The companion document has its own first-page preview below.

### Supporting Information — first page

<figure class="portfolio-supplement-first-page">
  <a href="{{ '/papers/when-does-posterior-integration-change-option-values-supplement.pdf' | relative_url }}" target="_blank" rel="noopener noreferrer" aria-label="Open the full Supporting Information PDF">
    <img src="{{ '/assets/img/portfolio/jfm-posterior-integration-supplement-first-page.webp' | relative_url }}" alt="Complete first page of Supporting Information: When Does Posterior Integration Change Option Values? Evidence from WTI Average Price Options" loading="lazy" width="1150">
  </a>
  <figcaption>Supporting Information, page 1 of 3. Select the preview to open the full supplementary PDF.</figcaption>
</figure>

**Interpretation:** The paper distinguishes a small posterior-integration correction from uncertainty in theoretical model prices. Conditional market-price comparisons use the observed valuation-date futures curve and settlement-price proxies. Sparse recorded trading, unverified vendor timestamps and the one-factor futures-correlation assumption limit the economic interpretation. Commercially licensed Barchart/Databento datasets are not distributed with these documents.
