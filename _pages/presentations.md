---
layout: page
title: Posters & Presentations
permalink: /presentations/
description: Posters and presentation materials from academic projects.
---

{% assign items = site.projects | where_exp: "project", "project.presentation_type == 'Poster' or project.presentation_type == 'Presentation'" | sort: "importance" %}

<div class="portfolio-grid">
  {% for item in items %}
    {% include portfolio/card.liquid item=item %}
  {% endfor %}
</div>
