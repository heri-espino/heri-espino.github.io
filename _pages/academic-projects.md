---
layout: page
title: Academic Projects
permalink: /academic-projects/
description: Course projects in actuarial modeling, quantitative finance, econometrics, and data analysis.
nav: false
---

{% assign items = site.projects | where: "portfolio_section", "academic-projects" | sort: "importance" %}

<div class="portfolio-grid">
  {% for item in items %}
    {% include portfolio/card.liquid item=item %}
  {% endfor %}
</div>
