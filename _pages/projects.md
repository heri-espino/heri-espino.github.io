---
layout: page
title: Projects
permalink: /projects/
description: Research, software, and applied modeling projects.
nav: true
nav_order: 3
---

{% assign items = site.projects | sort: "importance" %}

<div class="portfolio-grid">
  {% for item in items %}
    {% include portfolio/card.liquid item=item %}
  {% endfor %}
</div>
