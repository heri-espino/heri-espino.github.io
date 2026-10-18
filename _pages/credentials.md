---
layout: page
title: Credentials & Academic Schools
permalink: /credentials/
description: Academic schools, completed specializations, and independently completed courses.
nav: false
---

{% assign credential_groups = site.data.credentials.groups %}
{% assign credential_total = 0 %}
{% for group in credential_groups %}
{% assign credential_total = credential_total | plus: group.items.size %}
{% endfor %}

<div class="credentials-intro">
  <p class="portfolio-kicker">Academic enrichment · continuing education</p>
  <p>
    A record of academic school attendance and completed online coursework in probability,
    machine learning, finance, computing, and scientific methods.
    The complete list is organized by credential type, with institutions presented first
    within each section. These are not university degrees or professional licenses.
  </p>
  <div class="credentials-overview" aria-label="Credential summary">
    {% for group in credential_groups %}
      <a class="credentials-overview-item" href="#{{ group.id }}">
        <span class="credentials-overview-number">{{ group.items.size }}</span>
        <span class="credentials-overview-label">{{ group.label }}</span>
      </a>
    {% endfor %}
  </div>
</div>

<div class="credentials-tools" role="search" aria-label="Filter credentials">
  <div class="credentials-tool">
    <label for="credential-query">Search by title or institution</label>
    <input id="credential-query" type="search" placeholder="e.g. Bayesian, Imperial, PyTorch" autocomplete="off">
  </div>
  <div class="credentials-tool credentials-tool-select">
    <label for="credential-category">Credential type</label>
    <select id="credential-category">
      <option value="all">All categories</option>
      {% for group in credential_groups %}
        <option value="{{ group.id }}">{{ group.label }}</option>
      {% endfor %}
    </select>
  </div>
  <div class="credentials-tool credentials-tool-select">
    <label for="credential-sort">Sort records</label>
    <select id="credential-sort">
      <option value="curated">Featured order</option>
      <option value="newest">Newest first</option>
      <option value="oldest">Oldest first</option>
      <option value="title">Title A–Z</option>
    </select>
  </div>
  <div class="credentials-tool credentials-tool-select">
    <label for="credential-view">View</label>
    <select id="credential-view">
      <option value="list">List</option>
      <option value="grid">Grid</option>
    </select>
  </div>
  <button class="credentials-clear" id="credential-clear" type="button">Reset</button>
</div>
<p class="credentials-result-count" id="credential-results" role="status" aria-live="polite">
  Showing all {{ credential_total }} records
</p>
<p class="credentials-empty" id="credential-empty" hidden>No credentials match these filters.</p>

{% for group in credential_groups %}
  <section class="credentials-group" id="{{ group.id }}" data-credential-group>
    <div class="credentials-group-heading">
      <div>
        <p class="portfolio-kicker">Category {{ forloop.index }} of {{ credential_groups.size }}</p>
        <h2>{{ group.label }} <span class="credentials-group-count">({{ group.items.size }})</span></h2>
        <p>{{ group.intro }}</p>
      </div>
    </div>
    <ol class="credentials-list" data-view="list">
      {% for item in group.items %}
        {% assign issuer = site.data.credential_issuers[item.issuer_key] %}
        <li class="credentials-entry" data-credential-entry data-category="{{ group.id }}" data-sort-date="{{ item.issued | default: '' | escape }}" data-sort-title="{{ item.title | escape }}">
          <div class="credentials-logo-wrap" aria-hidden="true">
            <span class="credentials-logo-fallback">{{ issuer.initials | default: '?' }}</span>
            {% if issuer.logo %}
              <img class="credentials-logo" src="{{ issuer.logo }}" alt="" loading="lazy" width="64" height="64" data-credential-logo>
            {% endif %}
          </div>
          <div class="credentials-entry-content">
            <h3>{{ item.title }}</h3>
            <p class="credentials-issuer">{{ item.issuer }}</p>
            <p class="credentials-meta">
              {% if group.id == 'academic-schools' %}Attendance{% elsif group.id == 'specializations' %}Specialization{% else %}Course{% endif %}
              {% if item.issued %}<span aria-hidden="true">·</span> {{ item.issued }}{% endif %}
            </p>
            {% if item.part_of %}
              <p class="credentials-parent">Part of {{ item.part_of }}</p>
            {% endif %}
          </div>
          {% if item.url %}
            <a class="credentials-proof" href="{{ item.url }}" target="_blank" rel="noopener noreferrer">
              View certificate <span aria-hidden="true">↗</span>
            </a>
          {% else %}
            <span class="credentials-proof credentials-proof-unlinked">Attendance certificate</span>
          {% endif %}
        </li>
      {% endfor %}
    </ol>
  </section>
{% endfor %}

<p class="credentials-footnote">
  Academic school entries document attendance. Coursera specializations and their constituent
  course certificates are shown separately to avoid obscuring their relationship. Links point
  to the relevant issuer's credential record where a public URL is available.
</p>

<script src="{{ '/assets/js/credentials.js' | relative_url }}" defer></script>
<script src="{{ '/assets/js/credential-logos.js' | relative_url }}" defer></script>
