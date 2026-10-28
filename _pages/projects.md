---
layout: page
title: Projects
permalink: /projects/
description: Research, software, and applied modeling projects.
nav: true
nav_order: 3
---

{% assign items = site.projects | where: "portfolio_section", "projects" | sort: "importance" %}

<div class="portfolio-grid" data-portfolio-archive data-collection-label="Projects" data-view="list">
  {% for item in items %}
    {% include portfolio/card.liquid item=item %}
  {% endfor %}
</div>

<script src="{{ '/assets/js/portfolio-views.js' | relative_url }}" defer></script>
