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
detail_image: /assets/img/portfolio/activation-patching-additivity-preview.svg
detail_image_alt: "Manuscript overview identifying the paper title, author, and additivity comparison"
external_url: https://github.com/heri-espino/Regularizing-First-Layer-CNN-Filters-Toward-Predefined-Templates/blob/main/paper/main.tex
external_label: View manuscript source
resource_url: https://raw.githubusercontent.com/heri-espino/Regularizing-First-Layer-CNN-Filters-Toward-Predefined-Templates/main/paper/sn_supplement.pdf
resource_label: Supplementary Information PDF
github: https://github.com/heri-espino/Activation-Patching-CNN-Reproducibility
contributions:
  - "Demonstrates intervention-size dependence despite numerical logit additivity in a controlled TinyCNN architecture."
  - "Shows an architecture where the additive reconstruction predicts a positive size contrast but the observed contrast is negative (+0.04177 versus −0.13817)."
  - "Uses a spatially permuted filter bank that preserves the Gram matrix and singular values to test how filter arrangement affects intervention contrasts."
  - "Provides 100-block architecture and spatial-control comparisons, paired inferential analyses, and a reproducibility archive."
---

The main manuscript and the Supplementary Information form **one research article**. The manuscript is under review; its accompanying supplement details architecture specifications, training dynamics, statistical robustness checks, and a reproducibility map.

The <a href="https://doi.org/10.5281/zenodo.23432463" target="_blank" rel="noopener noreferrer">versioned reproducibility archive (Zenodo DOI: 10.5281/zenodo.23432463)</a> contains the code, frozen protocols, and derived results used to regenerate the paper's figures and selected numerical checks.
