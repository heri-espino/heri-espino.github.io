---
layout: portfolio-item
permalink: /papers/maxcut-sdp-eva-clustering-tutorial.html
portfolio_type: paper
pdf: /papers/EspinoMontelongo-2026-MaxCut_SDP_EVA.pdf
importance: 6
card_kind: "Mathematical tutorial"
title: "From Max-Cut to Semidefinite Programming, EVA, and Clustering-Based Rounding"
card_title: "From Max-Cut to Semidefinite Programming, EVA, and Clustering-Based Rounding"
label: "Research Tutorial"
status: "7-page tutorial · Not a journal submission"
display_date: "Oct 2026"
summary: "A step-by-step mathematical tutorial on weighted Max-Cut, sign and Laplacian formulations, semidefinite relaxation, low-rank unit-vector factorization and Efficient Vector Ascent (EVA). It compares Goemans–Williamson random-hyperplane rounding with two spherical clustering choices, K-Means2N and K-MeansNM, and explains saved-factor reuse, independent rounding restarts, and G-set evaluation."
framing: "The supplied document is titled MATHEMATICAL TUTORIAL / MAXKCUT RESEARCH PROJECT; it explains known mathematics and an evolving computational workflow rather than reporting a new submitted theorem or a completed benchmark superiority result. Its detailed formulas primarily address Max-Cut (k = 2); Max-k-Cut is discussed separately. Approximation guarantees for nonnegative-weight SDP rounding must not be applied to signed-weight G-set instances or arbitrary nonconvex EVA output."
tags: ["Max-Cut", "semidefinite programming", "EVA", "clustering", "approximation algorithms"]
image: /assets/img/portfolio/pdf-page-shots/maxcut-sdp-eva-clustering-tutorial-figure.avif
image_alt: "Page 1: weighted four-cycle and example Max-Cut partition from the uploaded document"
detail_image: /assets/img/portfolio/pdf-page-shots/maxcut-sdp-eva-clustering-tutorial-first.avif
detail_image_alt: "Screenshot of page 1 of maxcut sdp eva clustering tutorial"
contributions:
  - "Derives weighted Max-Cut as a quadratic sign problem and the corresponding convex semidefinite relaxation."
  - "Explains a sequential low-rank Efficient Vector Ascent update and its local monotonic-improvement property."
  - "Contrasts random-hyperplane rounding, independently initialized spherical 2-means, and antipodal K-MeansNM."
  - "Establishes the implementation-specific paired-cut retention property for K-MeansNM initialized from the same hyperplane."
  - "Documents G-set graph identity, continuous-factor reuse, restart variability, and the limits of current optimality guarantees."
---

**Document type:** Seven-page introductory mathematical tutorial. This is not represented as a submitted or peer-reviewed manuscript.

**Scope:** The derivations and method-specific retention guarantee concern Max-Cut with two groups; the final section distinguishes the general Max-k-Cut relaxation.
