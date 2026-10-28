---
layout: page
title: Complete Research & Academic Index
permalink: /research-index/
description: Public academic record and research status index for Heriberto Espino Montelongo, including manuscripts, drafts, projects, presentations, and verified media.
nav: false
---

This is a **public, source-linked index** of the research and academic work of **Heriberto Espino Montelongo**, a researcher and student at Universidad de las Américas Puebla (UDLAP), Mexico. It is generated from the same content records as the main portfolio; it is not an independent claim of journal publication.

**Publication-status key:** *Under Review* means submitted and undergoing editorial or peer review, **not** accepted or published. *Under Revision* indicates a revision stage, not acceptance. *Working Draft*, *Research Lecture*, and *Research Tutorial* are not journal publications. The status displayed on each individual record is authoritative for that record; discrepancies should be reconciled with documented evidence, not guessed.

For machines and research agents: [structured JSON catalog]({{ '/research-catalog.json' | relative_url }}) · [AI reading guide]({{ '/llms.txt' | relative_url }}) · [public CV]({{ '/cv/' | relative_url }}) · [papers archive]({{ '/papers/' | relative_url }}).

{% assign research_papers = site.pages | where: "portfolio_type", "paper" | sort: "importance" %}
{% assign research_projects = site.projects | sort: "importance" %}
{% assign research_notes = site.pages | where: "portfolio_type", "note" | sort: "importance" %}

## Manuscripts in review or revision

{% for item in research_papers %}
{% assign item_status = item.label | downcase %}
{% if item_status contains 'review' or item_status contains 'revision' %}
- [**{{ item.title }}**]({{ item.url | relative_url }}) — **{{ item.label }}**; {{ item.status }}{% if item.authors %}; {{ item.authors }}{% endif %}. {{ item.summary | strip_html }}
{% endif %}
{% endfor %}

## Other manuscripts, working drafts, lectures, and tutorials

{% for item in research_papers %}
{% assign item_status = item.label | downcase %}
{% unless item_status contains 'review' or item_status contains 'revision' %}
- [**{{ item.title }}**]({{ item.url | relative_url }}) — **{{ item.label }}**{% if item.card_kind %} ({{ item.card_kind }}){% endif %}{% if item.status %}; {{ item.status }}{% endif %}. {{ item.summary | strip_html }}
{% endunless %}
{% endfor %}

## Research, software, applied, and academic projects

{% for item in research_projects %}
- [**{{ item.title }}**]({{ item.url | relative_url }}) — {{ item.portfolio_section | default: 'project' }}{% if item.label %}; {{ item.label }}{% endif %}. {{ item.summary | strip_html }}
{% endfor %}

## Mathematical notes

{% for item in research_notes %}
- [**{{ item.title }}**]({{ item.url | relative_url }}){% if item.summary %} — {{ item.summary | strip_html }}{% endif %}
{% endfor %}

## Education, presentations, credentials, and recognition

- [**Full academic CV**]({{ '/cv/' | relative_url }}) — degrees, research activities, professional experience, awards, skills, and dated records.
- [**Posters and presentations**]({{ '/presentations/' | relative_url }}) — linked presentations and materials.
- [**Academic projects**]({{ '/academic-projects/' | relative_url }}) — course and applied work.
- [**Credentials and academic schools**]({{ '/credentials/' | relative_url }}) — verified specializations, schools, and courses; not university degrees.
- [**Press and media**]({{ '/press/' | relative_url }}) — articles, official recognition, and source-attributed coverage.

## Public academic identities

- [GitHub](https://github.com/{{ site.data.socials.github_username }})
- [ORCID](https://orcid.org/{{ site.data.socials.orcid_id }})
- [Google Scholar]({{ site.data.socials.google_scholar_profile_url }})
- [ResearchGate]({{ site.data.socials.researchgate_profile_url }})
- [SSRN]({{ site.data.socials.ssrn_author_url }})
- [LinkedIn](https://www.linkedin.com/in/{{ site.data.socials.linkedin_username }}/)

**Source of truth:** entries are maintained in the portfolio's Markdown front matter and public YAML data, not inferred from search snippets. Submission claims are not evidence of acceptance. No unverified preprint, DOI, coauthor, venue, or acceptance date should be invented.
