---
layout: portfolio-item
permalink: /papers/activation-patching-effects-add-up.html
portfolio_type: paper
importance: 30
card_kind: Research paper
title: "When Do Activation-Patching Effects Add Up? Evidence from Controlled CNNs"
card_title: "When Do Activation-Patching Effects Add Up? Evidence from Controlled CNNs"
label: Under Review
status: Springer Nature · SN Computer Science
authors: Heriberto Espino-Montelongo
display_date: "2026"
summary: "This study asks when the effects of joint activation-channel patches can be predicted by summing individual channel changes. In controlled convolutional networks, intervention-size effects can occur even under exact logit additivity; other architectures exhibit substantial departures that can reverse a training-regime contrast."
framing: "The experiments compare retention and release of predefined edge, corner, and ring filters across two synthetic classification tasks, 16 CNN architectures, and a pixel-permuted filter-bank control. Reconstruction first adds individual centered-logit changes and then evaluates the joint output with the original metric, separating metric-induced size dependence from departures from logit additivity."
tags: [mechanistic interpretability, CNNs, activation patching, additivity]
image: /assets/img/portfolio/activation-patching-additivity-preview.svg
image_alt: "Designed manuscript overview for When Do Activation-Patching Effects Add Up? Evidence from Controlled CNNs"
detail_image: /assets/img/portfolio/activation-patching-first-page.webp
detail_image_alt: "First page of When Do Activation-Patching Effects Add Up? Evidence from Controlled CNNs"
pdf: /papers/espino_2026_activation-patching-effects-add-up.pdf
secondary_pdf: /papers/espino_2026_activation-patching-supplementary-information.pdf
secondary_pdf_label: Supplementary Information PDF
github: https://github.com/heri-espino/Activation-Patching-CNN-Reproducibility
contributions:
  - "Demonstrates intervention-size dependence despite numerical logit additivity in a controlled TinyCNN architecture."
  - "Shows an architecture where the additive reconstruction predicts a positive size contrast but the observed contrast is negative (+0.04177 versus −0.13817)."
  - "Uses a spatially permuted filter bank that preserves the Gram matrix and singular values to test how filter arrangement affects intervention contrasts."
  - "Provides 100-block architecture and spatial-control comparisons, paired inferential analyses, and a reproducibility archive."
---

The **compiled manuscript PDF** and its **Supplementary Information PDF** are both hosted on this website. They belong to the same research paper. The article is under review at *SN Computer Science* (Springer Nature).

The <a href="https://doi.org/10.5281/zenodo.23432463" target="_blank" rel="noopener noreferrer">versioned reproducibility archive (Zenodo DOI: 10.5281/zenodo.23432463)</a> contains archived experimental code, protocols, and results for the manuscript's figures and selected numerical checks.
