---
layout: page
permalink: /repositories/
published: false
title: Repositories
description: Selected research and software repositories.
nav: false
nav_order: 5
---

<div class="repository-list">
  {% for repository in site.data.repositories.repositories %}
    <article class="repository-card">
      <div>
        <p class="portfolio-label">{{ repository.role }}</p>
        <h2><a href="{{ repository.url }}">{{ repository.name }}</a></h2>
      </div>
      <a class="repository-url" href="{{ repository.url }}">{{ repository.url | remove: "https://" }} <span aria-hidden="true">↗</span></a>
    </article>
  {% endfor %}
</div>
