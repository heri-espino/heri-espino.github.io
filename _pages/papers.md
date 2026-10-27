---
layout: page
title: Papers
permalink: /papers/
description: Submitted manuscripts, working drafts, and ongoing research by Heriberto Espino Montelongo.
nav: true
nav_order: 2
---

{% assign items = site.pages | where: "portfolio_type", "paper" | sort: "importance" %}
{% assign submitted_papers = items | where_exp: "item", "item.url == '/papers/unit-region-factorization.html' or item.url == '/papers/stepping-stone.html' or item.url == '/papers/activation-patching-effects-add-up.html'" %}
{% assign other_papers = items | where_exp: "item", "item.url != '/papers/unit-region-factorization.html' and item.url != '/papers/stepping-stone.html' and item.url != '/papers/activation-patching-effects-add-up.html'" %}

<p class="portfolio-section-intro papers-archive-intro">
  Research manuscripts are organized by submission stage. Current review and development details are shown on each record.
</p>

<div class="papers-archive" data-portfolio-archive data-collection-label="Papers">
  <section class="papers-archive-section" id="submitted-manuscripts" data-portfolio-section aria-labelledby="submitted-manuscripts-title">
    <div class="papers-archive-heading">
      <div>
        <p class="portfolio-kicker">01 / Submitted</p>
        <h2 id="submitted-manuscripts-title">Submitted Manuscripts <span class="papers-archive-count">({{ submitted_papers.size }})</span></h2>
        <p>Manuscripts sent to journals for peer review or currently undergoing revision.</p>
      </div>
    </div>
    <div class="portfolio-grid" data-portfolio-group>
      {% for item in submitted_papers %}
        {% include portfolio/card.liquid item=item %}
      {% endfor %}
    </div>
  </section>

  <section class="papers-archive-section papers-archive-section--secondary" id="working-drafts" data-portfolio-section aria-labelledby="working-drafts-title">
    <div class="papers-archive-heading">
      <div>
        <p class="portfolio-kicker">02 / In development</p>
        <h2 id="working-drafts-title">Working Drafts &amp; Ongoing Research <span class="papers-archive-count">({{ other_papers.size }})</span></h2>
        <p>Research drafts and related work. Individual status labels are preserved, including any separately recorded review activity.</p>
      </div>
    </div>
    <div class="portfolio-grid" data-portfolio-group>
      {% for item in other_papers %}
        {% include portfolio/card.liquid item=item %}
      {% endfor %}
    </div>
  </section>
</div>

<script src="{{ '/assets/js/portfolio-views.js' | relative_url }}" defer></script>
