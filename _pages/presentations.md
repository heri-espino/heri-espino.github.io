---
layout: page
title: Posters & Presentations
permalink: /presentations/
description: Posters and presentation materials from academic projects.
---

{% assign items = site.projects | where: "presentation_type", "Poster" | sort: "importance" %}

<div class="portfolio-grid">
  {% for item in items %}
    {% include portfolio/card.liquid item=item %}
  {% endfor %}
</div>
