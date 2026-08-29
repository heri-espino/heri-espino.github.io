---
layout: page
title: Papers
permalink: /papers/
description: Working manuscripts in stochastic and computational geometry.
nav: true
nav_order: 2
---

{% assign items = site.pages | where: "portfolio_type", "paper" | sort: "importance" %}

<div class="portfolio-grid">
  {% for item in items %}
    {% include portfolio/card.liquid item=item %}
  {% endfor %}
</div>
