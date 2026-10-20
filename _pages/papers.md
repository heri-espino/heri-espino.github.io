---
layout: page
title: Papers
permalink: /papers/
description: Manuscripts under review and research projects in stochastic and computational geometry.
nav: true
nav_order: 2
---

{% assign items = site.pages | where: "portfolio_type", "paper" | sort: "importance" %}

<section class="portfolio-external-paper" aria-labelledby="ssrn-paper-heading">
  <p class="portfolio-kicker">Research record · SSRN</p>
  <h2 id="ssrn-paper-heading">SSRN manuscript · 7634746</h2>
  <p>
    This paper has an external SSRN record. Visit SSRN for its title, author list,
    abstract, and current manuscript details.
  </p>
  <a class="portfolio-section-profile-link" href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7634746" target="_blank" rel="noopener noreferrer">
    View paper on SSRN <span aria-hidden="true">↗</span>
  </a>
</section>

<div class="portfolio-grid" data-portfolio-archive data-collection-label="Papers">
  {% for item in items %}
    {% include portfolio/card.liquid item=item %}
  {% endfor %}
</div>

<script src="{{ '/assets/js/portfolio-views.js' | relative_url }}" defer></script>
