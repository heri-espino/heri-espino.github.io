---
layout: portfolio-item
permalink: /notes/random-variables-as-vectors.html
portfolio_type: note
importance: 1
nav: true
nav_order: 30
title: "Random Variables as Vectors: Geometry of L², Projections, Variance, and Bias"
card_title: Random Variables as Vectors in L²
label: Notes
status: In progress
authors: Heriberto Espino Montelongo
display_date: Jun 2026
summary: 'In-progress notes formalizing random variables as vectors in the Hilbert space \(L^2(\Omega,\mathcal{F},\mathbb{P})\). They interpret expectation and conditional expectation as orthogonal projections, variance and bias-variance as Pythagorean decompositions, and Chapman-Kolmogorov as a tower-property identity.'
formula: '\mathcal{H}=L^2(\Omega,\mathcal{F},\mathbb{P}),\qquad \langle X,Y\rangle=\mathbb{E}[XY],\qquad \mathbb{E}[X\mid Y]=\operatorname{Proj}_{\mathcal{H}_Y}(X)'
framing: "The notes form a conceptual bridge from linear algebra to probability: once random variables are treated as L² vectors, expectation, conditional expectation, variance identities, and Markov transition formulas become projection statements."
tags: [measure theory, probability, Hilbert spaces, Markov chains]
image: /assets/img/portfolio/random-variables-l2-preview-800.webp
image_alt: Preview of Random Variables as Vectors in L²
pdf: /notes/espino_2026_random-variables-as-vectors.pdf
contributions:
  - 'Defines random variables as measurable functions and builds the \(L^2\) inner-product geometry using \(\mathbb{E}[XY]\).'
  - Shows expectation and conditional expectation as orthogonal projections onto constants and information subspaces.
  - Interprets variance, bias-variance, total variance, and prediction error as Pythagorean decompositions.
  - Derives Chapman-Kolmogorov from indicators, the Markov property, and the tower property of conditional expectation.
---
