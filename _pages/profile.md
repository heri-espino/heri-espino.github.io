---
layout: page
title: About Heriberto Espino Montelongo
permalink: /about-me/
nav: false
description: Academic biography and research profile of Heriberto Espino Montelongo (Heriberto Espino-Montelongo), UDLAP researcher and scientific software developer.
---

{% assign profile = site.data.profile %}
{% assign curriculum = site.data.cv.cv %}
{% assign research_papers = site.pages | where: "portfolio_type", "paper" | sort: "importance" %}
{% assign published_writing = site.pages | where: "portfolio_type", "article" | sort: "importance" %}

<script type="application/ld+json" id="academic-profile-jsonld">
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": {{ '/about-me/#profile' | absolute_url | jsonify }},
  "url": {{ '/about-me/' | absolute_url | jsonify }},
  "mainEntity": {
    "@type": "Person",
    "@id": {{ '/#person' | absolute_url | jsonify }},
    "name": {{ profile.full_name | jsonify }},
    "alternateName": {{ profile.alternate_names | jsonify }},
    "description": {{ profile.short_bio | jsonify }},
    "url": {{ '/' | absolute_url | jsonify }},
    "affiliation": {
      "@type": "CollegeOrUniversity",
      "name": {{ profile.institution_name | jsonify }},
      "url": {{ profile.institution_url | jsonify }}
    },
    "knowsAbout": {{ profile.research_interests | jsonify }},
    "sameAs": [
      "https://github.com/{{ site.data.socials.github_username }}",
      "https://orcid.org/{{ site.data.socials.orcid_id }}",
      {{ site.data.socials.google_scholar_profile_url | jsonify }},
      {{ site.data.socials.researchgate_profile_url | jsonify }},
      {{ site.data.socials.ssrn_author_url | jsonify }},
      "https://www.linkedin.com/in/{{ site.data.socials.linkedin_username }}/"
    ]
  }
}
</script>

# About Heriberto Espino Montelongo

{{ profile.short_bio }}

{{ profile.extended_bio }}

I use **Heriberto Espino Montelongo** in my public academic profile and **Heriberto Espino-Montelongo** in some research bylines. Both names refer to the same person.

## Education

{% for item in curriculum.sections.Education %}
- **{{ item.degree }}**, {{ item.institution }} — {{ item.date }}.
{% endfor %}

These are undergraduate degree programs. An expected completion date is not a conferred degree.

## Current and previous work

{% for item in curriculum.sections["Professional Experience"] limit: 3 %}
- **{{ item.role }}**{% if item.subtitle %} ({{ item.subtitle }}){% endif %} — {{ item.organization }}, {{ item.date }}{% if item.location %}, {{ item.location }}{% endif %}.
{% endfor %}

My Mathematics Learning Center work includes statistical investigation of university learning-support records, reproducible analysis, and communication of results for academic decision-making. The [full CV]({{ '/cv/' | relative_url }}) preserves the precise role descriptions and verified dates.

## Research areas

{% for topic in profile.research_interests %}
- {{ topic }}
{% endfor %}

### Submitted manuscripts

The following list is generated from individual manuscript records; the statuses below describe review stages, **not accepted publications**.

{% for item in research_papers %}
{% assign stage = item.label | downcase %}
{% if stage contains 'review' or stage contains 'revision' %}
- [**{{ item.title }}**]({{ item.url | relative_url }}) — **{{ item.label }}**{% if item.status %} ({{ item.status }}){% endif %}{% if item.authors %}; authors: {{ item.authors }}{% endif %}.
{% endif %}
{% endfor %}

Other [working drafts, research notes, and tutorials]({{ '/papers/' | relative_url }}) are separate from submitted work. See the [complete research index]({{ '/research-index/' | relative_url }}) for the current records and source materials.

### Published technical writing

{% for item in published_writing %}
- [**{{ item.title }}**]({{ item.url | relative_url }}) — {{ item.status }}{% if item.authors %}; authors: {{ item.authors }}{% endif %}. This is technical writing, not a peer-reviewed journal article.
{% endfor %}

## Open-source scientific software

{% for item in curriculum.sections["Programming Experience"] %}
- **{{ item.organization }}** — {{ item.role }}{% if item.date %}; {{ item.date }}{% endif %}{% if item.links and item.links.size > 0 %}; [sources and documentation]({{ item.links[0].url }}){% endif %}.
{% endfor %}

The [projects archive]({{ '/projects/' | relative_url }}) contains software descriptions, documentation, source repositories, and selected citable releases. Collaboration and authorship are specified at the individual project level.

## Academic presentations, activities, and community involvement

{% for item in curriculum.sections["Academic Experience"] limit: 4 %}
- **{{ item.role }}** — {{ item.name }}, {{ item.organization }} ({{ item.date }}).
{% endfor %}

{% for item in curriculum.sections.Leadership limit: 2 %}
- **{{ item.role }}** — {{ item.organization }} ({{ item.date }}).
{% endfor %}

- **Member, IMEF Universitario** — August 2026 to June 2027 (expected); student membership, not an elected leadership position.

Selected competition results, training, volunteering, certificates, and additional academic activities appear in the [public CV]({{ '/cv/' | relative_url }}) and [credentials archive]({{ '/credentials/' | relative_url }}).

## Verified public identity and research records

- [Academic CV]({{ '/cv/' | relative_url }})
- [Research and academic index]({{ '/research-index/' | relative_url }})
- [Machine-readable research catalog]({{ '/research-catalog.json' | relative_url }})
- [ORCID](https://orcid.org/{{ site.data.socials.orcid_id }})
- [Google Scholar]({{ site.data.socials.google_scholar_profile_url }})
- [GitHub](https://github.com/{{ site.data.socials.github_username }})
- [LinkedIn](https://www.linkedin.com/in/{{ site.data.socials.linkedin_username }}/)
- [ResearchGate]({{ site.data.socials.researchgate_profile_url }})
- [SSRN]({{ site.data.socials.ssrn_author_url }})

**Source policy:** Research status and authorship come from the linked detail pages; professional dates, degree schedules, and affiliations come from the public CV. In particular, *under review*, *under revision*, *working draft*, and *published technical writing* are distinct. This page is not evidence of acceptance, a completed degree, or an unverified award.
