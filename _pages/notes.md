---
layout: page
title: Notes
permalink: /notes/
description: Mathematical notes in probability and related areas.
nav: true
nav_order: 4
---

{% assign items = site.pages | where: "portfolio_type", "note" | sort: "importance" %}

<div class="portfolio-grid">
  {% for item in items %}
    {% include portfolio/card.liquid item=item %}
  {% endfor %}
</div>
