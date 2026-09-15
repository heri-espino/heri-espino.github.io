---
layout: portfolio-item
permalink: /projects/cnn-primitive-bases.html
portfolio_type: paper
importance: 70
card_kind: Research paper
title: "Template Priors in Small CNNs: Learning Dynamics and the Measurement Dependence of Causal Usefulness"
label: Under Review
status: Transactions on Machine Learning Research (TMLR) · Double-blind review
authors: Heriberto Espino Montelongo
display_date: "2026"
summary: 'A controlled study of template initialization, retention, and release in small CNNs on two rendering tasks. Across staged experiments with \(n=400\) primary runs, \(n=200\) gradual-release runs, \(80\) final checkpoints, and \(2{,}000\) saved states, template initialization does not uniformly accelerate learning; releasing retention improves compositional accuracy relative to constant retention while reducing alignment; and the relative causal-usefulness difference changes with channel ranking and intervention size.'
framing: "The paper separates kernel appearance, concept selectivity, and matched activation-patching outcomes, showing that preserved kernel shape and a single patching score are insufficient to establish an interpretability benefit."
tags: [CNNs, activation patching, mechanistic interpretability, template priors]
image: /assets/img/portfolio/template-priors-patching-preview-1200.webp
image_alt: "First-page preview of Template Priors in Small CNNs: Learning Dynamics and the Measurement Dependence of Causal Usefulness"
detail_image: /assets/img/portfolio/template-priors-patching-first-page.webp
detail_image_alt: "First page of Template Priors in Small CNNs: Learning Dynamics and the Measurement Dependence of Causal Usefulness"
github: https://github.com/heri-espino/Privileged-Template-Priors-for-Mechanistic-Interpretability-in-CNNs
contributions:
  - Compares template strength with renderer-based concept and intervention measures using matched normalization and spectrum controls.
  - Separates initialization, continued retention, and release across staged training experiments rather than pooling them as independent replications.
  - Reanalyzes 80 existing final checkpoints with three validation-only channel rankings and four intervention sizes, finding negative release effects at one or two channels and positive effects at four or eight in TinyCNN.
  - Shows that the retained-kernel contrast persists under one-to-one kernel matching across 2,000 saved checkpoint states while keeping later comparisons exploratory.
---
