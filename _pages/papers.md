---
layout: page
title: Papers
permalink: /papers/
description: Research manuscripts, working drafts, and published technical articles by Heriberto Espino Montelongo.
nav: true
nav_order: 2
---

{% assign paper_records = site.pages | where: "portfolio_type", "paper" %}
{% assign items = paper_records | where_exp: "item", "item.hide_from_papers != true" | sort: "importance" %}
{% assign existing_submissions = items | where_exp: "item", "item.url == '/papers/unit-region-factorization.html' or item.url == '/papers/stepping-stone.html' or item.url == '/papers/activation-patching-effects-add-up.html'" %}
{% assign wiley_submission = items | where: "url", "/papers/posterior-integration-volatility-wti-asian-options.html" %}
{% assign submitted_papers = existing_submissions | concat: wiley_submission %}
{% assign other_papers = items | where_exp: "item", "item.url != '/papers/unit-region-factorization.html' and item.url != '/papers/stepping-stone.html' and item.url != '/papers/activation-patching-effects-add-up.html'" %}
{% assign other_papers = other_papers | where_exp: "item", "item.url != '/papers/posterior-integration-volatility-wti-asian-options.html'" %}
{% assign notebook_and_lecture_drafts = other_papers | where: "archive_group", "research_notes" %}
{% assign internal_research_papers = other_papers | where: "archive_group", "internal_research" %}
{% assign published_articles = site.pages | where: "portfolio_type", "article" | sort: "importance" %}

<p class="portfolio-section-intro papers-archive-intro">
  Research outputs are separated by publication stage and document type: submitted manuscripts, published writing, research notes and teaching materials, and internal research papers. Lecture/tutorial materials are not journal submissions.
</p>

<div class="papers-archive" data-portfolio-archive data-collection-label="Papers" data-view="list">
  <section class="papers-archive-section" id="submitted-manuscripts" data-portfolio-section aria-labelledby="submitted-manuscripts-title">
    <div class="papers-archive-heading">
      <div>
        <p class="portfolio-kicker">01 / Submitted</p>
        <h2 id="submitted-manuscripts-title">Submitted Manuscripts <span class="papers-archive-count">({{ submitted_papers.size }})</span></h2>
        <p>Manuscripts sent to journals for peer review or currently undergoing revision.</p>
      </div>
    </div>
    <div class="portfolio-grid" data-portfolio-group data-view="list">
      {% for item in submitted_papers %}
        {% include portfolio/card.liquid item=item %}
      {% endfor %}
    </div>
  </section>

  <section class="papers-archive-section papers-archive-section--secondary" id="published-technical-articles" data-portfolio-section aria-labelledby="published-technical-articles-title">
    <div class="papers-archive-heading">
      <div>
        <p class="portfolio-kicker">02 / Published writing</p>
        <h2 id="published-technical-articles-title">Published Articles &amp; Technical Writing <span class="papers-archive-count">({{ published_articles.size }})</span></h2>
        <p>Authored technical writing published outside peer-reviewed research journals, listed separately from submitted manuscripts and working drafts.</p>
      </div>
    </div>
    <div class="portfolio-grid" data-portfolio-group data-view="list">
      {% for item in published_articles %}
        {% include portfolio/card.liquid item=item %}
      {% endfor %}
    </div>
  </section>

  <section class="papers-archive-section papers-archive-section--secondary" id="working-drafts" data-portfolio-section aria-labelledby="working-drafts-title">
    <div class="papers-archive-heading">
      <div>
        <p class="portfolio-kicker">03 / Working drafts and learning materials</p>
        <h2 id="working-drafts-title">Research Notes, Lectures &amp; Tutorials <span class="papers-archive-count">({{ notebook_and_lecture_drafts.size }})</span></h2>
        <p>Exploratory handwritten notes, in-progress mathematical exposition, an Isomap lecture, and a Max-Cut tutorial. These four documents are not submitted journal manuscripts.</p>
      </div>
    </div>
    <div class="portfolio-grid" data-portfolio-group data-view="list">
      {% for item in notebook_and_lecture_drafts %}
        {% include portfolio/card.liquid item=item %}
      {% endfor %}
    </div>
  </section>

  <section class="papers-archive-section papers-archive-section--secondary" id="internal-research-papers" data-portfolio-section aria-labelledby="internal-research-papers-title">
    <div class="papers-archive-heading">
      <div>
        <p class="portfolio-kicker">04 / Internal research</p>
        <h2 id="internal-research-papers-title">Internal Research Papers <span class="papers-archive-count">({{ internal_research_papers.size }})</span></h2>
        <p>Four unpublished studies of mathematics education, academic-support use, assessment comparability, and longitudinal adaptation. They remain internal working papers or research drafts, not journal submissions.</p>
      </div>
    </div>
    <div class="portfolio-grid" data-portfolio-group data-view="list">
      {% for item in internal_research_papers %}
        {% include portfolio/card.liquid item=item %}
      {% endfor %}
    </div>
  </section>

</div>

<script src="{{ '/assets/js/portfolio-views.js' | relative_url }}" defer></script>
