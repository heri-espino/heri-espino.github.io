---
layout: page
title: Academic Projects
permalink: /academic-projects/
description: Research software, course reports, and academic presentations in stochastic geometry, finance, econometrics, and actuarial modeling.
nav: false
---

{% assign items = site.projects | where_exp: "project", "project.label == 'Course Project' or project.academic_project" | sort: "importance" %}

<div class="portfolio-grid">
  {% for item in items %}
    {% include portfolio/card.liquid item=item %}
  {% endfor %}
</div>
