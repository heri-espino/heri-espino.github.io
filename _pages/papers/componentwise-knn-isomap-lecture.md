---
layout: portfolio-item
permalink: /papers/componentwise-knn-isomap-lecture.html
portfolio_type: paper
importance: 5
featured: true
card_kind: "Mathematical lecture"
title: "Componentwise kNN-Isomap: From Neighborhood Graphs to Constrained Manifold Embeddings"
card_title: "Componentwise kNN-Isomap: From Neighborhood Graphs to Constrained Manifold Embeddings"
label: "Research Lecture"
status: "53-slide mathematical lecture · Not a journal submission"
display_date: "19 Oct 2026"
summary: "A mathematical lecture deriving the graph-shortest-path, classical MDS, and rigid-placement stages of componentwise Isomap. It distinguishes connected-component discovery from independent embedding, states a constructive strip-separation guarantee, and uses completed EXP-010/EXP-011 experiments to illustrate distortion and separation trade-offs. A more ambitious separation-constrained optimization is explicitly proposed, not implemented."
framing: "The lecture carefully distinguishes established multi-manifold methods, mathematical identities, executed deterministic experiments, and future proposals. The current EXP-011 partition is built using radius graphs or supplied MST cuts before internal 10-NN graphs—not a validated fully unsupervised kNN partition recovery. Do not advertise it as a peer-reviewed paper or an implemented globally optimized embedding method."
tags: ["manifold learning", "Isomap", "geodesics", "classical MDS", "separation constraints"]
image: /assets/img/portfolio/paper-draft-generic.svg
image_alt: "Generic research-material graphic for the mathematical Isomap lecture"
github: https://github.com/heri-espino/ProximityGraphs-Isomap
contributions:
  - "Derives the relationship between graph geodesics, double-centering, and the spectral formulation of classical MDS."
  - "Explains how independent rigid motions preserve computed within-component distances but alter cross-component geometry."
  - "Proves a simple convex-hull clearance guarantee using disjoint strips, without claiming minimal distortion."
  - "Reports illustrative EXP-010/EXP-011 runs, including the five-rings trade-off between within-manifold stress and centroid stress."
  - "Clearly separates proposed EXP-013 unsupervised discovery and constrained placement from completed experiments."
---

**Document type:** 53-slide mathematical lecture, dated 19 October 2026. It is a research and teaching resource, **not a submitted research article**.

**Research stage:** Proposed separation–distortion optimization and EXP-013 are future work. The presented one-run galleries should not be interpreted as broad statistically validated superiority.
