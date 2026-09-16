---
layout: portfolio-item
permalink: /academic-projects/ibd-right-censored-regression.html
portfolio_type: project
importance: 21
portfolio_section: academic-projects
academic_project: true
card_kind: Course project
title: Right-Censored Regression for IBD with CatBoost and XGBoost Stacking
label: Academic Project
status: Statistical learning
authors: Heriberto Espino Montelongo
display_date: "2025"
summary: 'A censor-aware stacking pipeline for an IBD target right-censored at \(c=20\). CatBoost is trained on uncensored cases using \(K=9\)-fold out-of-fold predictions, a robust residual scale is estimated, and Tobit-style tail corrections are applied before XGBoost meta-learning.'
framing: 'The report models the observed label as \(Y_i=\min(Y_i^*,c)\) and keeps NaN-labelled rows as a scoring set rather than using them for fitting.'
tags: [right censoring, CatBoost, XGBoost, Tobit model]
image: /assets/img/portfolio/ibd-right-censored-regression-preview-1200.webp
image_alt: "First-page preview of Right-Censored Regression for IBD with CatBoost and XGBoost Stacking"
detail_image: /assets/img/portfolio/ibd-right-censored-regression-first-page.webp
detail_image_alt: "First page of Right-Censored Regression for IBD with CatBoost and XGBoost Stacking"
pdf: /academic-projects/espino_2025_ibd-right-censored-regression.pdf
github: https://github.com/heri-espino/Empilement-Tobit-CatBoost-et-interpolation-laplacienne-spatio-temporelle-pour-l-IBD-EQR
contributions:
  - Restricts CatBoost fitting to uncensored observations and generates (K=9)-fold out-of-fold predictions.
  - Applies a Tobit-style tail-expectation correction to base and meta predictions.
  - Fits an XGBoost meta-learner on the corrected out-of-fold signal and preserves a pure scoring set for NaN-labelled rows.
---
