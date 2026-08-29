---
layout: default
title: Home
permalink: /
description: Academic portfolio of Heriberto Espino Montelongo.
---

<section class="portfolio-hero" aria-labelledby="hero-title">
  <p class="portfolio-kicker">Academic portfolio · Puebla, Mexico</p>
  <h1 id="hero-title">Heriberto Espino Montelongo</h1>
  <p class="portfolio-role">Actuarial Science and Data Science student at Universidad de las Américas Puebla.</p>
  <p class="portfolio-intro">I work across stochastic geometry, probability, time series, financial risk, and interpretable machine learning. My projects combine mathematical modeling, reproducible computation, and applied data analysis.</p>
  <div class="portfolio-hero-footer">
    <nav class="portfolio-hero-links" aria-label="Profile links">
      <a href="mailto:{{ site.data.socials.email }}">Email</a>
      <a href="https://www.linkedin.com/in/{{ site.data.socials.linkedin_username }}/">LinkedIn</a>
      <a href="https://github.com/{{ site.data.socials.github_username }}">GitHub</a>
    </nav>
    {% comment %}Restore the View CV link here when `_pages/cv.md` is republished.{% endcomment %}
  </div>
</section>

{% assign papers = site.pages | where: "portfolio_type", "paper" | sort: "importance" %}
{% assign projects = site.projects | sort: "importance" %}
{% assign notes = site.pages | where: "portfolio_type", "note" | sort: "importance" %}
{% assign software_projects = projects | where_exp: "project", "project.label == 'Software Project' or project.label == 'Software Library'" %}
{% assign academic_projects = projects | where_exp: "project", "project.label == 'Course Project' or project.academic_project" %}
{% assign presentations = projects | where_exp: "project", "project.presentation_type == 'Poster' or project.presentation_type == 'Presentation'" | sort: "importance" %}
{% assign featured_papers = papers | slice: 0, 2 %}
{% assign featured_projects = software_projects | slice: 0, 2 %}
{% assign featured_academic_projects = academic_projects | slice: 0, 2 %}
{% assign featured_presentations = presentations | slice: 0, 2 %}
{% assign featured_notes = notes | slice: 0, 2 %}

{% if papers.size > featured_papers.size %}
{% assign papers_eyebrow = "Selected papers" %}
{% assign papers_support = "Selected working manuscripts and research notes; see the full archive for all paper records and materials." %}
{% assign papers_top_link = "Browse all papers" %}
{% assign papers_bottom_link = "Browse the complete papers archive" %}
{% else %}
{% assign papers_eyebrow = "Papers" %}
{% assign papers_support = "All current paper records and materials are shown here and maintained in the papers archive." %}
{% assign papers_top_link = "Open papers archive" %}
{% assign papers_bottom_link = "Open papers archive" %}
{% endif %}

{% if projects.size > featured_projects.size %}
{% assign projects_eyebrow = "Selected projects" %}
{% assign projects_support = "Selected research and software projects; see the full archive for every project and its materials." %}
{% assign projects_top_link = "Browse all projects" %}
{% assign projects_bottom_link = "Browse the complete projects archive" %}
{% else %}
{% assign projects_eyebrow = "Projects" %}
{% assign projects_support = "All current research and software projects are shown here and maintained in the projects archive." %}
{% assign projects_top_link = "Open projects archive" %}
{% assign projects_bottom_link = "Open projects archive" %}
{% endif %}

{% if academic_projects.size > featured_academic_projects.size %}
{% assign academic_projects_eyebrow = "Selected academic projects" %}
{% assign academic_projects_support = "Selected academic and course projects are shown here; visit LinkedIn for certifications, awards, and additional academic activity." %}
{% assign academic_projects_top_link = "Browse all academic projects" %}
{% assign academic_projects_bottom_link = "Browse the complete academic projects archive" %}
{% else %}
{% assign academic_projects_eyebrow = "Academic projects" %}
{% assign academic_projects_support = "Academic research software and course projects; visit LinkedIn for certifications, awards, and additional academic activity." %}
{% assign academic_projects_top_link = "Open academic projects archive" %}
{% assign academic_projects_bottom_link = "Open academic projects archive" %}
{% endif %}

{% if presentations.size > featured_presentations.size %}
{% assign presentations_eyebrow = "Selected posters & presentations" %}
{% assign presentations_support = "Selected visual academic materials are shown here; see the archive for all available posters and presentations." %}
{% assign presentations_top_link = "Browse all materials" %}
{% assign presentations_bottom_link = "Browse the complete posters & presentations archive" %}
{% else %}
{% assign presentations_eyebrow = "Posters & presentations" %}
{% assign presentations_support = "Available poster and presentation materials from academic projects are collected in this archive." %}
{% assign presentations_top_link = "Open materials archive" %}
{% assign presentations_bottom_link = "Open posters & presentations archive" %}
{% endif %}

{% if notes.size > featured_notes.size %}
{% assign notes_eyebrow = "Selected notes" %}
{% assign notes_support = "Selected notes are shown here; see the full archive for all available mathematical materials." %}
{% assign notes_top_link = "Browse all notes" %}
{% assign notes_bottom_link = "Browse the complete notes archive" %}
{% else %}
{% assign notes_eyebrow = "Notes" %}
{% assign notes_support = "All currently available mathematical notes are shown here and maintained in the notes archive." %}
{% assign notes_top_link = "Open notes archive" %}
{% assign notes_bottom_link = "Open notes archive" %}
{% endif %}

{% include portfolio/section.liquid id="papers" title="Papers" eyebrow=papers_eyebrow intro="Research in stochastic geometry and empty-region proximity graphs." support=papers_support top_link=papers_top_link bottom_link=papers_bottom_link items=featured_papers index_url="/papers/" %}
{% include portfolio/section.liquid id="projects" title="Projects" eyebrow=projects_eyebrow intro="Applied work in reproducible data analysis and interpretable machine learning." support=projects_support top_link=projects_top_link bottom_link=projects_bottom_link items=featured_projects index_url="/projects/" %}
{% include portfolio/section.liquid id="academic-projects" title="Academic Projects" eyebrow=academic_projects_eyebrow intro="Research software and course projects in stochastic geometry, financial risk, and quantitative methods." support=academic_projects_support top_link=academic_projects_top_link bottom_link=academic_projects_bottom_link items=featured_academic_projects index_url="/academic-projects/" additional_url="https://www.linkedin.com/in/heri-espino/" additional_link="View certifications and awards on LinkedIn" %}
{% include portfolio/section.liquid id="presentations" title="Posters & Presentations" eyebrow=presentations_eyebrow intro="Visual academic materials from project work." support=presentations_support top_link=presentations_top_link bottom_link=presentations_bottom_link items=featured_presentations index_url="/presentations/" %}
{% include portfolio/section.liquid id="notes" title="Notes" eyebrow=notes_eyebrow intro="Mathematical notes developed through independent study and research preparation." support=notes_support top_link=notes_top_link bottom_link=notes_bottom_link items=featured_notes index_url="/notes/" %}

<section class="portfolio-section portfolio-home-section portfolio-contact" id="contact" aria-labelledby="contact-title">
  <div class="portfolio-section-heading">
    <div>
      <p class="portfolio-kicker">Get in touch</p>
      <h2 id="contact-title">
        <a class="portfolio-section-title-link" href="{{ '/contact/' | relative_url }}">
          <span>Contact</span>
        </a>
      </h2>
      <p class="portfolio-section-intro">Open to research, software, and academic collaboration.</p>
    </div>
  </div>
  <div class="portfolio-contact-links">
    <a href="mailto:{{ site.data.socials.email }}">{{ site.data.socials.email }}</a>
    <a href="https://www.linkedin.com/in/{{ site.data.socials.linkedin_username }}/">LinkedIn</a>
    <a href="https://github.com/{{ site.data.socials.github_username }}">GitHub</a>
    {% comment %}Restore the CV contact link here when `_pages/cv.md` is republished.{% endcomment %}
  </div>
</section>
