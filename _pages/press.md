---
layout: page
title: Press & Media
permalink: /press/
description: University news and media coverage of academic activities.
nav: true
nav_order: 6
---

<p class="portfolio-section-intro">University news and media coverage related to academic projects and activities. Articles are linked to their original publishers.</p>

<div class="portfolio-grid" data-portfolio-archive data-collection-label="Press and Media">
  {% for item in site.data.press %}
    <article class="portfolio-card portfolio-card--press" data-sort-date="{{ item.date | escape }}" data-sort-title="{{ item.title | escape }}">
      <a class="portfolio-card-image" href="{{ item.url }}" target="_blank" rel="noopener noreferrer">
        <img src="{{ '/assets/img/portfolio/press-media.svg' | relative_url }}" alt="Newspaper illustration" loading="lazy">
        <span class="portfolio-card-kind">University news</span>
      </a>
      <div class="portfolio-card-body">
        <div class="portfolio-card-meta"><span class="portfolio-label">{{ item.publisher }}</span><span>{{ item.date_label }}</span></div>
        <h3><a href="{{ item.url }}" target="_blank" rel="noopener noreferrer">{{ item.title }}</a></h3>
        <p>{{ item.summary }}</p>
        <div class="portfolio-tags" aria-label="Topics">{% for tag in item.tags %}<span>{{ tag }}</span>{% endfor %}</div>
      </div>
    </article>
  {% endfor %}
</div>
<script src="{{ '/assets/js/portfolio-views.js' | relative_url }}" defer></script>
