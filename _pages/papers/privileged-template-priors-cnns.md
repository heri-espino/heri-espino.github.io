---
layout: portfolio-item
permalink: /projects/cnn-primitive-bases.html
portfolio_type: paper
importance: 4
card_kind: Research paper
title: "Template Priors in Small CNNs: Activation-Patching Effects Depend on the Number of Patched Channels"
label: Under Review
status: Transactions on Machine Learning Research (TMLR) · Double-blind review
authors: Heriberto Espino Montelongo
display_date: "2026"
summary: 'A controlled study of template initialization, persistent template retention, and gradual release in small CNNs. Kernel-template similarity and activation-patching behavior separate: in the prospectively confirmed TinyCNN setting, the release-versus-retention selected-channel fidelity effect changes sharply with patch size, from strongly negative at one and two patched channels to slightly positive at eight.'
formula: 'B=\frac{\Delta F(4)+\Delta F(8)}{2}-\frac{\Delta F(1)+\Delta F(2)}{2}=0.33098'
framing: "Retained kernel-template similarity is a weight-space property; matched activation patching measures a distinct functional property whose release-versus-retention effect depends on patch size and architecture."
tags: [CNNs, activation patching, mechanistic interpretability, template priors]
image: /assets/img/portfolio/template-priors-patching-preview.svg
image_alt: Preview of Template Priors in Small CNNs: Activation-Patching Effects Depend on the Number of Patched Channels
github: https://github.com/heri-espino/Privileged-Template-Priors-for-Mechanistic-Interpretability-in-CNNs
contributions:
  - Separates kernel-template similarity from matched activation-patching fidelity in two controlled rendering tasks and two small CNN architectures.
  - Prospectively confirms patch-size dependence in 20 previously unused two_concepts TinyCNN blocks, with the predeclared contrast B = 0.33098 (95% CI [0.27368, 0.38827]).
  - Extends the sensitivity analysis to 1,200 models across two tasks, two architectures, and six prior schedules, showing a different pattern in TwoLayerCNN.
  - Decomposes selected-versus-random patching effects to show how the control baseline can change a relative comparison, and reports an independent 32-checkpoint implementation audit.
---
