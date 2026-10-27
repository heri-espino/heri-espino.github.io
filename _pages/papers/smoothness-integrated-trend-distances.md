---
layout: portfolio-item
permalink: /papers/smoothness-integrated-trend-distances.html
portfolio_type: paper
importance: 65
card_kind: Research draft
title: "Smoothness-Integrated Trend Distances with Nonzero Difference Drift"
label: Research Draft
status: Mathematical research note · Oct 2026
authors: Heriberto Espino Montelongo
display_date: "2026"
summary: 'A mathematical framework for comparing time series through entire families of penalized least-squares trends, rather than a single smoothing parameter. It permits a nonzero target for finite differences and develops a Hilbert-space global distance, time-local rolling distances, and smoothness–time discrepancy surfaces, with spectral formulas and a synthetic illustration.'
formula: 'D_{\mathrm{PLS}}(y_1,y_2)^2=\frac{1}{N}\int_0^1\left\|\boldsymbol{\tau}_{y_2}(S)-\boldsymbol{\tau}_{y_1}(S)\right\|_2^2\,dS'
framing: "The research note extends the Guerrero-type penalized trend formulation to nonzero finite-difference reference drift. It distinguishes the penalty drift from the mean signed gap between fitted trends, and separates descriptive change statistics from statistically validated change-point detection. Agricultural monitoring is a proposed application, not an established empirical finding."
tags: [trend estimation, penalized least squares, Hilbert spaces, change detection, smoothness]
image: /assets/img/portfolio/smoothness-integrated-trend-distances.svg
image_alt: "Illustrative pairs of trends and a corresponding three-point rolling RMS discrepancy; synthetic example"
detail_image: /assets/img/portfolio/smoothness-integrated-trend-distances.svg
detail_image_alt: "Synthetic comparison of two trend trajectories and a three-point rolling discrepancy based on the research note"
github: https://github.com/heri-espino/Trend-Estimation
contributions:
  - 'Derives an affine penalized trend estimator for a possibly nonzero \(d\)th-difference reference drift \(\mu\), including its strongly smoothed limit.'
  - 'Uses a normalized, data-independent smoothness coordinate \(S\in[0,1]\) to compare entire fitted trend paths.'
  - 'Defines a global Hilbert-space distance and decomposes discrepancy into level and shape components without assuming zero mean difference.'
  - 'Provides spectral expressions for shared versus unequal reference drifts, retaining the unequal-drift correction.'
  - 'Develops rolling, smoothness-integrated and scale–time comparisons with efficient cumulative-sum evaluation and explicit cautions about future-data leakage.'
---

## Mathematical formulation

For an observed time series \(y\in\mathbb{R}^{N}\), a difference operator \(D_d\) of order \(d\), a smoothing penalty \(\lambda\geq0\), and reference drift \(\mu\in\mathbb{R}\), the proposed trend estimator is

$$
\widehat{\boldsymbol{\tau}}_{\lambda,\mu}(y)
=
\underset{u\in\mathbb{R}^{N}}{\operatorname{argmin}}
\left\{
\|y-u\|_2^2+
\lambda\|D_du-\mu\mathbf{1}_{N-d}\|_2^2
\right\}.
$$

Writing \(Q=D_d^\top D_d\) and \(H_\lambda=(I_N+\lambda Q)^{-1}\) gives

$$
\widehat{\boldsymbol{\tau}}_{\lambda,\mu}(y)
=
H_\lambda\big(y+\lambda\mu D_d^\top\mathbf{1}_{N-d}\big).
$$

In particular, a large penalty does not necessarily force the fitted \(d\)th differences to zero when \(\mu\neq0\).

## Comparing entire smoothness paths

The normalized smoothness coordinate is defined from the eigenvalues \(\rho_j>0\) of \(Q\):

$$
S(\lambda;N,d)=1-\frac{1}{N-d}
\sum_{j=1}^{N-d}\frac{1}{1+\lambda\rho_j}.
$$

For aligned series \(y_1,y_2\), let \(\Delta(S,t)\) be the signed difference between their fitted trends at smoothness \(S\) and time \(t\). The global distance integrates over all \(S\in[0,1]\), not just one selected \(\lambda\). Its squared form separates into level and shape contributions:

$$
D_{\mathrm{PLS}}^2=D_{\mathrm{level}}^2+D_{\mathrm{shape}}^2.
$$

The distinction between the penalty target \(\mu\) and the signed mean difference \(\mu_\Delta\) is essential. A common nonzero penalty drift cancels in the pairwise distance; separately estimated drifts generally do not.

## Time-local comparisons

For a window of \(w\) observations ending at time \(t\), the research note defines a scale-specific rolling RMS distance,

$$
D_w(S,t)=\left[
\frac{1}{w}\sum_{k=t-w+1}^{t}\Delta(S,k)^2
\right]^{1/2},
$$

and then integrates its square over smoothness:

$$
\mathcal{D}_w(t)^2
=\int_0^1D_w(S,t)^2\,dS.
$$

The resulting surface \((S,t)\mapsto D_w(S,t)\) makes it possible to distinguish discrepancies that appear only at particular smoothing levels from discrepancies visible across many levels.

## Illustrative example

At one fixed smoothness level, consider the *illustrative* trajectories

$$
\boldsymbol{\tau}_1=(1,1,1,1,1,1,1)^\top,\qquad
\boldsymbol{\tau}_2=(1,1,1,1,3,5,7)^\top.
$$

Their pointwise absolute difference is \((0,0,0,0,2,4,6)\). For \(w=3\), the rolling RMS at \(t=7\) is \(\sqrt{56/3}\approx4.320\), while the signed rolling mean is \(4\). These vectors illustrate the statistics; they are **not** asserted to be outputs of a particular penalized least-squares fit.

## Scope and next steps

The note proposes agricultural monitoring using vegetation indices such as NDMI, but does not claim to have validated a water-stress detector. Future work includes comparisons against raw-series and single-scale baselines, dependence-aware uncertainty quantification, window-length sensitivity analyses, and a strictly causal online protocol. Full-sample smoothers may use future observations when estimating past trend values, so retrospective detection times must not be interpreted as real-time alarms.

**Source note:** *Smoothness-Integrated Trend Distances with Nonzero Difference Drift: Mathematical Formulation and Numerical Implications* (five-page working research note supplied October 2026). The full PDF is not yet hosted as a public website asset.
