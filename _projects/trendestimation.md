---
layout: portfolio-item
permalink: /projects/trendestimation.html
portfolio_type: project
portfolio_section: projects
importance: 8
card_kind: Python library
title: trendestimation
label: In Development
status: Penalized trend smoothing · Documentation in preparation
display_date: ""
summary: "A developing Python package for finite-difference penalized least-squares trend estimation, supporting flexible difference orders, spectral computation, and classical smoothing-parameter selection criteria."
framing: "The library implements established trend-smoothing formulations and numerical selection techniques. Its initial scope covers published penalized least-squares methods rather than experimental forecast-optimal algorithms. Documentation and distribution are still being prepared."
tags: [time series, trend estimation, penalized least squares, numerical methods]
image: /assets/img/portfolio/trendestimation-preview.svg
image_alt: "Trendestimation preview showing a noisy time series and a smooth fitted trend"
github: https://github.com/trendestimation/trendestimation
contributions:
  - "Supports admissible finite-difference orders and fixed or observed-difference plug-in means."
  - "Uses reusable spectral computations for trend fitting, smoothness, and effective degrees of freedom."
  - "Implements classical in-sample CV, GCV, AICc, and BIC criteria under their documented fixed-mean assumptions."
  - "Includes reproducible synthetic examples and optional plotting utilities."
---

The documentation website is **in preparation**. The project is available from its [GitHub repository](https://github.com/trendestimation/trendestimation); a live documentation link will be added after its deployment is verified.
