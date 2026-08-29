---
layout: portfolio-item
permalink: /projects/latent-risk-us-market.html
portfolio_type: project
importance: 3
card_kind: Course project
title: Latent Risk Estimation in the U.S. Market Using Representative Variables
card_title: Latent U.S. Market Risk
label: Course Project
presentation_type: Poster
status: Latent risk index
authors: Heriberto Espino Montelongo, Owen Paredes Conde, and Pedro José García Guevara
display_date: "2026"
summary: Poster project proposing a latent financial-risk index from representative global signals such as implied volatility, oil, gold, and the dollar index. The workflow combines dynamic factor modeling with penalized least-squares smoothing and Guerrero-style smoothness selection through validation.
formula: 'X_t=\Lambda f_t+e_t,\qquad \min_{\tau}\sum_t(R_t-\tau_t)^2+\lambda\sum_t(\nabla^d\tau_t-m)^2'
framing: "Noisy market variables are compressed into a common latent factor and then smoothed into an interpretable risk-monitoring index."
tags: [dynamic factor models, latent risk, penalized trends, macrofinance]
image: /assets/img/portfolio/latent-risk-preview-800.webp
image_alt: Preview of Latent Risk Estimation in the U.S. Market
pdf: /projects/latent-risk-us-market.pdf
github: https://github.com/heritaco/Estimation-of-latent-risk-in-the-U.S.-market-using-representative-variables
contributions:
  - Built a latent market-risk index from VIX, WTI, gold, and DXY-style financial variables.
  - Used a dynamic factor model to extract a common risk component from representative market signals.
  - Estimated a structural trend with penalized least squares and Guerrero smoothness selection.
  - Analyzed validation behavior, inflation relationships, and stress deviations around crisis periods.
---
