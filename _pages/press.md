---
layout: page
title: Press & Media
permalink: /press/
description: University news and media coverage of academic activities.
nav: true
nav_order: 6
---

<p class="portfolio-section-intro">Selected university news, official UDLAP institutional recognitions, and social-media coverage about academic work involving Heriberto Espino Montelongo. Verified articles link to their publisher or to a public reshare. A Facebook mention without a verified post URL is explicitly marked as pending. Several outlets covered the same Tech Capital Puebla Summit 2025 hackathon; these are separate publications, not separate achievements.</p>

<div class="portfolio-grid" data-portfolio-archive data-collection-label="Press and Media" data-view="list">
  {% for item in site.data.press %}
    <article class="portfolio-card portfolio-card--press" data-sort-date="{{ item.date | escape }}" data-sort-title="{{ item.title | escape }}">
      {% capture press_cover %}
        <img src="{{ item.image | default: '/assets/img/portfolio/press-media.svg' | escape }}" alt="{{ item.image_alt | default: item.title | escape }}" loading="lazy" referrerpolicy="no-referrer" data-press-image>
        <span class="portfolio-card-kind">{{ item.kind | default: 'University news' }}</span>
      {% endcapture %}
      {% if item.url %}
        <a class="portfolio-card-image" href="{{ item.url }}" target="_blank" rel="noopener noreferrer">{{ press_cover }}</a>
      {% else %}
        <div class="portfolio-card-image">{{ press_cover }}</div>
      {% endif %}
      <div class="portfolio-card-body">
        <div class="portfolio-card-meta"><span class="portfolio-label">{{ item.publisher }}</span><span>{{ item.date_label }}</span></div>
        <h3>{% if item.url %}<a href="{{ item.url }}" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>{% else %}{{ item.title }}{% endif %}</h3>
        <p>{{ item.summary }}</p>
        {% if item.verification_status %}<p class="portfolio-section-support"><strong>Source pending:</strong> {{ item.verification_status }}</p>{% endif %}
        {% if item.related_url %}
          <p class="portfolio-section-support"><a href="{% if item.related_url contains '://' %}{{ item.related_url }}{% else %}{{ item.related_url | relative_url }}{% endif %}" {% if item.related_url contains '://' %}target="_blank" rel="noopener noreferrer"{% endif %}>{{ item.related_label | default: 'Related source' }}</a></p>
        {% endif %}
        {% if item.coverage_group %}<p class="portfolio-section-support">Additional coverage of: {{ item.coverage_group }}</p>{% endif %}
        {% if item.image_credit %}<p class="portfolio-section-support">Image: {{ item.image_credit }}</p>{% endif %}
        <div class="portfolio-tags" aria-label="Topics">{% for tag in item.tags %}<span>{{ tag }}</span>{% endfor %}</div>
      </div>
    </article>
  {% endfor %}
</div>
<script src="{{ '/assets/js/portfolio-views.js' | relative_url }}" defer></script>
<script src="{{ '/assets/js/press-images.js' | relative_url }}" defer></script>
