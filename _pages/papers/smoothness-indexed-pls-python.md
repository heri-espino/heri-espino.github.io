---
layout: portfolio-item
permalink: /papers/smoothness-indexed-pls-python.html
portfolio_type: paper
importance: 3
card_kind: "Research manuscript draft"
title: "Smoothness-Indexed Penalized Trend Estimation in Python: Parameter-Search Coordinates, Numerical Backends, and Reproducible Comparisons"
card_title: "Smoothness-Indexed Penalized Trend Estimation in Python: Parameter-Search Coordinates, Numerical Backends, and Reproducible Comparisons"
label: "Working Draft"
status: "Methods/software manuscript · Submission not verified"
display_date: "Oct 2026"
authors: "Heriberto Espino-Montelongo and Daniela Cortés-Toto"
summary: "Presents a reproducible Python implementation of Guerrero-style penalized least-squares smoothing with an order-normalized smoothness coordinate. Distinguishes parameter-search coordinate from statistical criterion and compares seven numerical backends in an archived 80,640-record factorial study. Independent paired timing experiments and four root-finding methods examine accuracy and performance, with CO₂ and federal funds examples."
framing: "The uploaded 19-page draft makes a software and numerical reproducibility contribution; it explicitly does not claim discovery of PLS smoothing, the underlying Guerrero index, or the classical selectors. Results are hardware- and workload-dependent, and no numerical backend is universally fastest. The supplied file does not independently confirm that this specific manuscript has been submitted."
tags: ["penalized least squares", "numerical methods", "Python", "reproducibility", "Guerrero smoothness"]
image: /assets/img/portfolio/pdf-page-shots/smoothness-indexed-pls-python-figure.avif
image_alt: "Page 15: CO2 and interest-rate fitted-trend visualization from the uploaded document"
detail_image: /assets/img/portfolio/pdf-page-shots/smoothness-indexed-pls-python-first.avif
detail_image_alt: "Screenshot of page 1 of smoothness indexed pls python"
github: https://github.com/heri-espino/Trend-Estimation
contributions:
  - "Implements an order-normalized smoothness coordinate S in [0,1], including nonzero fixed difference-reference means."
  - "Separates identical-candidate S-to-penalty search from genuinely different finite search grids."
  - "Benchmarks seven linear-algebra backends across 80,640 archived search records with numerical-validity screening."
  - "Uses independent paired seeds and Holm-adjusted comparisons for full-fit solver benchmarks, plus float64 inversion checks."
  - "Documents reproducible APIs, saved numeric outputs, and real-world CO₂ and federal funds illustrations."
---

**Document stage:** Coauthored methods/software manuscript draft. Submission status is not established by the uploaded file.

**Evaluation caution:** The 80,640 records are not 80,640 independent time series, and the performance rankings depend on the computational workload and hardware.
