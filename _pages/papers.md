---
layout: page
title: Papers
permalink: /papers/
description: Research manuscripts, working drafts, and published technical articles by Heriberto Espino Montelongo.
nav: true
nav_order: 2
---

{% assign items = site.pages | where: "portfolio_type", "paper" | sort: "importance" %}
{% assign submitted_papers = items | where_exp: "item", "item.url == '/papers/unit-region-factorization.html' or item.url == '/papers/stepping-stone.html' or item.url == '/papers/activation-patching-effects-add-up.html'" %}
{% assign other_papers = items | where_exp: "item", "item.url != '/papers/unit-region-factorization.html' and item.url != '/papers/stepping-stone.html' and item.url != '/papers/activation-patching-effects-add-up.html'" %}
{% assign published_articles = site.pages | where: "portfolio_type", "article" | sort: "importance" %}

<p class="portfolio-section-intro papers-archive-intro">
  Manuscripts under review, working drafts, and authored technical articles are listed by publication type. Lectures and tutorials retain their distinct labels.
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
        <p>Unsubmitted manuscript drafts, mathematical lectures, tutorials, and ongoing research. The first six records are drawn from the uploaded PDFs; all statuses remain explicit.</p>
      </div>
    </div>
    <div class="portfolio-grid" data-portfolio-group>
      {% for item in other_papers %}
        {% include portfolio/card.liquid item=item %}
      {% endfor %}
    </div>
  </section>
  <section class="papers-archive-section papers-archive-section--secondary" id="published-technical-articles" data-portfolio-section aria-labelledby="published-technical-articles-title">
    <div class="papers-archive-heading">
      <div>
        <p class="portfolio-kicker">03 / Published writing</p>
        <h2 id="published-technical-articles-title">Published Articles &amp; Technical Writing <span class="papers-archive-count">({{ published_articles.size }})</span></h2>
        <p>Authored technical writing published outside peer-reviewed research journals, listed separately from submitted manuscripts and working drafts.</p>
      </div>
    </div>
    <div class="portfolio-grid" data-portfolio-group>
      {% for item in published_articles %}
        {% include portfolio/card.liquid item=item %}
      {% endfor %}
    </div>
  </section>

</div>

<script src="{{ '/assets/js/portfolio-views.js' | relative_url }}" defer></script>
