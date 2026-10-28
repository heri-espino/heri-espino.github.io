---
layout: portfolio-item
permalink: /papers/smoothness-integrated-trend-distances.html
portfolio_type: paper
importance: 1
card_kind: Working draft
title: "Smoothness-Integrated Trend Distances with Nonzero Difference Drift"
card_title: "Smoothness-Integrated Trend Distances with Nonzero Difference Drift"
label: "Working Draft"
status: "Research note · Not submitted"
authors: "Heriberto Espino Montelongo"
display_date: "Oct 2026"
summary: 'This working research note compares complete smoothness-indexed families of penalized least-squares (PLS) trends in a Hilbert-space framework. It permits nonzero reference drift in finite-difference penalties, distinguishes that drift from the signed mean gap between fitted trends, and derives global, rolling-window, and smoothness–time distances with spectral representations for shared and unequal drifts.'
formula: '\mathcal{D}_{\mathrm{PLS}}(y_1,y_2)^2=\frac{1}{N}\int_0^1\|\boldsymbol{\tau}_{y_1}(S)-\boldsymbol{\tau}_{y_2}(S)\|_2^2\,dS'
framing: "The five-page October 2026 note is an unsubmitted research draft. It presents a mathematical formulation, a synthetic rolling-window example, and validation questions; it does not claim an empirically validated change-point detector or a confirmed agricultural causal relationship. In particular, retrospective PLS smoothing may use future observations, so online divergence detection requires a strictly causal protocol."
tags: [penalized least squares, Hilbert spaces, trend estimation, smoothness, rolling windows, agricultural monitoring]
image: /assets/img/portfolio/paper-draft-generic.svg
image_alt: "Generic research-draft graphic for Smoothness-Integrated Trend Distances with Nonzero Difference Drift"
github: https://github.com/heri-espino/Trend-Estimation
contributions:
  - 'Extends the PLS trend estimator to nonzero reference differences through the affine penalty \(\|y-u\|_2^2+\lambda\|D_d u-\mu\mathbf{1}\|_2^2\).'
  - 'Defines a global Hilbert-space distance over the normalized Guerrero smoothness coordinate \(S\in[0,1]\), with a signed-level and centered-shape decomposition.'
  - 'Derives spectral representations for shared and unequal drift specifications, making explicit when the simpler common-drift quadratic form applies.'
  - 'Introduces scale-specific rolling RMS differences, smoothness–time dissimilarity surfaces, and rolling level-versus-shape summaries.'
  - 'Uses a seven-time-point synthetic illustration and outlines agricultural NDMI monitoring, numerical quadrature, and causal-validation requirements.'
---

The uploaded manuscript is designated **Research Note / Working Draft** and has **not been submitted** to a journal.

The accompanying [Trend-Estimation research repository](https://github.com/heri-espino/Trend-Estimation) contains related PLS trend-estimation methods and experiments. The specific manuscript PDF is not yet hosted on this site; this record summarizes the uploaded five-page draft.

### Main research questions

- How should time series be compared across *all* smoothness levels instead of at one selected penalty?
- How do signed level shifts differ from changing temporal shape when the reference finite-difference drift is nonzero?
- Can rolling differences locate time-localized divergence without confusing retrospective smoothing with online detection?

### Current stage

Mathematical formulation and illustrative numerical example. Empirical comparisons, uncertainty calibration, and agricultural validation are proposed rather than reported as completed.
