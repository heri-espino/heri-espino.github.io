---
layout: portfolio-item
permalink: /projects/sp500-trend-comparison.html
portfolio_type: paper
importance: 3
card_kind: Software project
title: A Reproducible Comparison of Trend Estimation Methods on S&P 500 Log Prices
card_title: Guerrero Penalized Trend Estimation
label: Software Project
status: Reproducible empirical comparison
authors: Heriberto Espino-Montelongo
display_date: Jun 2026
summary: Empirical comparison of train-validation smoothness selection for penalized trends against time-weighted validation and benchmark methods on S&P 500 log prices. The design uses a strict temporal train/validation/test protocol and separates Guerrero smoothness from realized roughness diagnostics.
formula: '\widehat{t}(\lambda)=\left(I_N+\lambda K^{\mathsf{T}}K\right)^{-1}z,\qquad S_d(\lambda;N)=1-\frac{\operatorname{tr}S(\lambda)}{N}'
framing: "Hyperparameters are chosen only on past validation windows and evaluated on a held-out temporal test segment."
tags: [time series, trend estimation, Guerrero smoothing, S&P 500]
image: /assets/img/portfolio/sp500-trend-preview-800.webp
image_alt: Preview of the S&P 500 trend-estimation comparison
pdf: /projects/sp500-trend-comparison.pdf
github: https://github.com/heri-espino/Trend-Estimation
contributions:
  - Compared train-validation and time-weighted selectors against HP, Whittaker, moving-average, exponential-smoothing, and polynomial baselines.
  - Used spectral linear algebra and cached eigendecompositions for efficient penalized trend fitting.
  - Mapped Guerrero smoothness to λ through the trace of the smoothing matrix.
  - Reported forecast errors, validation curves, local minima, test forecasts, and realized roughness diagnostics.
---
