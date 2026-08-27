---
layout: portfolio-item
permalink: /projects/cnn-primitive-bases.html
portfolio_type: paper
importance: 4
card_kind: Software project
title: Privileged Template Priors for Mechanistic Interpretability in CNNs
label: Software Project
status: In progress
authors: Heriberto Espino Montelongo
display_date: Jun 2026
summary: In-progress mechanistic-interpretability project proposing a controlled synthetic-shapes benchmark for small CNNs. The design factorizes images into geometric primitives and nuisance transformations, then compares privileged-basis CNNs with compact learned models using visualization, attribution, unit semantics, and causal intervention tests.
formula: '\text{geometric primitives}+\text{nuisance factors}\longrightarrow\text{privileged CNN bases}\longrightarrow\text{testable mechanisms}'
framing: "Because the data-generating factors are known, claims about learned detectors, invariances, and circuits can be checked against ground truth rather than only inspected qualitatively."
tags: [CNNs, mechanistic interpretability, synthetic data, inductive bias]
image: /assets/img/portfolio/cnn-primitive-bases-preview-800.webp
image_alt: Preview of Privileged Template Priors for Mechanistic Interpretability in CNNs
pdf: /projects/cnn-primitive-bases.pdf
github: https://github.com/heri-espino/Privileged-Template-Priors-for-Mechanistic-Interpretability-in-CNNs
contributions:
  - Specified a synthetic-shapes dataset with geometric primitives under rotation, translation, scale, stroke-width, and noise factors.
  - Contrasted privileged-basis CNNs with first-layer template filters against compact learned CNNs with comparable capacity.
  - Outlined probes for feature visualization, inversion, attribution, localization, concept testing, and unit-level semantic scoring.
  - Framed mechanistic hypotheses through causal interventions, activation patching, and circuit-style tests of explanatory adequacy.
---
