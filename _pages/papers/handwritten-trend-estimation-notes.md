---
layout: portfolio-item
permalink: /papers/handwritten-trend-estimation-notes.html
portfolio_type: paper
importance: 65
card_kind: "Research notes"
title: "Handwritten Notes on Penalized Trend Estimation and Smoothness Optimization"
card_title: "Notes on Trend Estimation: Penalized Least Squares and Smoothness Optimization"
label: "Research Notes"
status: "Handwritten working notes · Not submitted"
display_date: "Oct 2026"
authors: "Heriberto Espino Montelongo"
summary: "A 31-page handwritten research notebook on penalized least-squares trend smoothing: finite-difference penalties, Guerrero's smoothness coordinate, linear smoothing operators, bias–variance and uncertainty, derivatives of regularized estimators, and optimization of cross-validation criteria."
framing: "Exploratory derivations rather than a completed or independently verified manuscript. The notebook develops first- and second-derivative calculations, local-minimum searches, stationary-point checks and candidate-selection ideas for smoothness tuning. It does not establish a universal or empirically validated optimization procedure."
tags: ["penalized least squares", "trend estimation", "Guerrero smoothness", "numerical optimization", "cross-validation", "handwritten notes"]
image: /assets/img/portfolio/trendestimation-preview.svg
image_alt: "Abstract mathematical trend-estimation illustration; not a scan of the uploaded notebook"
detail_image: /assets/img/portfolio/trendestimation-preview.svg
detail_image_alt: "Conceptual trend-estimation illustration; original handwritten PDF is separate"
github: https://github.com/heri-espino/Trend-Estimation
contributions:
  - "Writes the penalized least-squares trend estimate as a linear smoother and studies finite-difference penalty orders."
  - "Relates the smoothing matrix trace to Guerrero's normalized smoothness coordinate and its limiting behavior."
  - "Separates observational variance, model-parameter uncertainty, estimation bias and smoothing variance in working derivations."
  - "Explores first and second derivatives of inverse-penalty matrices, including quadratic prediction-error objectives."
  - "Sketches stationary-point searches, local minima, bisection and Newton-type approaches to selecting smoothness."
---

**Stage:** Working research notes, not a submitted manuscript. The source is an uploaded **31-page handwritten Spanish-language PDF**, with substantive writing concentrated in the earlier pages and several blank closing pages. This page is an overview of the notebook, not a transcription, editorially verified proof, or substitute for the scanned original.

**Original PDF:** The supplied handwritten scan is not yet hosted at a stable public URL on this website. It has deliberately **not** been linked to an unrelated PDF. The original is retained as the user's conversation upload pending repository asset transfer.

### Main topics in the notebook

1. **Penalized trend estimation and finite differences (pages 1–3, 9–10, 17–18).** The notes introduce penalized least squares, first and higher finite-difference operators, the associated regularization matrix, and linear-smoother representations. The difference operator changes what counts as a smooth baseline.
2. **Estimator interpretation and uncertainty (pages 3–8).** Exploratory derivations contrast estimation under a signal-plus-noise model, observational uncertainty, bias and variance; the notes distinguish the model estimate from an estimate of the observations.
3. **Derivatives and numerical optimization (pages 11–16, 19–24).** The notebook differentiates inverse regularization matrices and cross-validation or mean-squared-error-like objectives with respect to the penalty/smoothness parameter. It examines critical points, second-derivative signs and the possibility of multiple local minima.
4. **Cross-validation across smoothness values (pages 14–16, 23–26).** The final substantive pages sketch grid search, Newton-like root finding, bisection, per-fold smoothness selection and forecast-oriented tuning. These are research directions or exploratory calculations, not demonstrated performance guarantees.

### Mathematical organizing notation

Given an observed vector \(z\in\mathbb R^N\), difference operator \(D\), and penalty \(\lambda\ge 0\), a representative regularized estimator studied in the notes is

\[
\widehat{\tau}_\lambda =
(I+\lambda D^\mathsf{T}D)^{-1}z
=H_\lambda z,
\qquad H_\lambda=(I+\lambda D^\mathsf{T}D)^{-1}.
\]

The notes connect the trace of \(H_\lambda\) to normalized smoothness, informally write out derivatives of \(H_\lambda\), and investigate numerical searches across smoothness values. Boundary conditions, difference order, reference drift, and the precise validation loss matter for interpreting these formulas.

**Related work:** [Trend-Estimation on GitHub](https://github.com/heri-espino/Trend-Estimation) contains the related computational work. The notebook has been catalogued as **research notes**, not recast as an accepted or submitted scientific paper.
