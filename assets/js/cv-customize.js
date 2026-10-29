/* Browser-only CV configurator. The original YAML order remains readable without JS. */
(() => {
  "use strict";

  const root = document.getElementById("cv-page");
  if (!root) return;

  // Swap the fallback pictogram only after the institution's logo loads.
  // Broken or blocked remote images leave the existing icon intact.
  root.querySelectorAll("[data-cv-org-logo]").forEach((image) => {
    const fallback = image.parentElement?.querySelector(".cv-org-icon");
    const reveal = () => {
      if (!image.naturalWidth) return;
      image.hidden = false;
      if (fallback) fallback.hidden = true;
    };
    image.addEventListener("load", reveal, { once: true });
    if (image.complete) reveal();
  });

  const controls = {
    order: document.getElementById("cv-order"),
    template: document.getElementById("cv-template"),
    font: document.getElementById("cv-font"),
    paper: document.getElementById("cv-paper"),
    density: document.getElementById("cv-density"),
    markers: document.getElementById("cv-markers"),
    palette: document.getElementById("cv-palette"),
    accent: document.getElementById("cv-custom-accent"),
    printUrls: document.getElementById("cv-print-urls"),
    size: document.getElementById("cv-text-size"),
    margin: document.getElementById("cv-page-margin"),
  };
  const timeline = document.getElementById("cv-timeline");
  const timelineItems = document.getElementById("cv-timeline-items");
  const status = document.getElementById("cv-status");
  const resetButton = document.getElementById("cv-reset");
  const previewButton = document.getElementById("cv-preview");
  const previewHelp = document.getElementById("cv-preview-help");
  const sourceDocument = document.getElementById("cv-document");
  const pagedPreview = document.getElementById("cv-paged-preview");
  const panelToggle = document.getElementById("cv-panel-toggle");
  const settingsPanel = document.getElementById("cv-settings-panel");
  const printToggles = Array.from(root.querySelectorAll("[data-cv-print-toggle]"));
  const entryPicker = document.getElementById("cv-entry-picker");
  const entryCount = document.getElementById("cv-entry-count");
  const entrySearch = document.getElementById("cv-entry-search");
  const entryOptions = document.getElementById("cv-entry-options");
  const allEntriesButton = document.getElementById("cv-entries-all");
  const noEntriesButton = document.getElementById("cv-entries-none");
  const toggles = Array.from(root.querySelectorAll("[data-cv-section-toggle]"));
  const sections = Array.from(root.querySelectorAll(".cv-content [data-cv-section]"));

  if (
    Object.values(controls).some((element) => !element) ||
    !timeline ||
    !timelineItems ||
    !status ||
    !resetButton ||
    !previewButton ||
    !previewHelp ||
    !sourceDocument ||
    !pagedPreview ||
    !panelToggle ||
    !settingsPanel ||
    !entryPicker ||
    !entryCount ||
    !entrySearch ||
    !entryOptions ||
    !allEntriesButton ||
    !noEntriesButton
  ) return;

  // Sort by the first calendar date, not by the present-day end of an ongoing role.
  // This is also correct for date ranges such as "Aug 2023 — Dec 2027 (expected)".
  const months = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  };
  const parseStartDate = (value) => {
    const raw = String(value || "");
    const match = raw.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+((?:19|20)\d{2})\b/i);
    if (match) return Date.UTC(Number(match[2]), months[match[1].toLowerCase()], 1);
    const year = raw.match(/\b((?:19|20)\d{2})\b/);
    return year ? Date.UTC(Number(year[1]), 0, 1) : null;
  };

  // Semibold emphasis of technical terminology without changing source data.
  // Operate on text nodes only: never interpolate arbitrary content into HTML.
  const keywords = [
    "GitHub Actions", "penalized least squares", "stochastic processes", "finite differences", "Springer Nature", "SN Computer Science", "activation patching",
    "logit additivity", "Monte Carlo", "mathematical OCR", "Deep Learning",
    "Machine Learning", "Bayesian", "Python", "PyTorch", "TensorFlow",
    "Matplotlib", "Docling", "LaTeX", "NumPy", "SciPy", "Ruff",
    "pytest", "CatBoost", "XGBoost", "PostgreSQL", "Docker",
    "Airflow", "Streamlit", "Qiskit", "optimization", "stochastic"
  ];
  const escaped = keywords.map((word) => word.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"));
  const keywordPattern = new RegExp("\\b(" + escaped.join("|") + ")\\b", "gi");
  root.querySelectorAll(".cv-highlights li, .cv-skills dd").forEach((target) => {
    const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const source = node.nodeValue || "";
      keywordPattern.lastIndex = 0;
      if (!keywordPattern.test(source)) return;
      keywordPattern.lastIndex = 0;
      const fragment = document.createDocumentFragment();
      let offset = 0;
      for (const match of source.matchAll(keywordPattern)) {
        if (match.index > offset) fragment.appendChild(document.createTextNode(source.slice(offset, match.index)));
        const element = document.createElement("span");
        element.className = "cv-keyword";
        element.textContent = match[0];
        fragment.appendChild(element);
        offset = match.index + match[0].length;
      }
      if (offset < source.length) fragment.appendChild(document.createTextNode(source.slice(offset)));
      node.replaceWith(fragment);
    });
  });

  const entries = sections.flatMap((section, sectionIndex) =>
    Array.from(section.querySelectorAll("[data-cv-record]")).map((element, index) => ({
      element,
      section,
      sectionIndex,
      index,
      timestamp: parseStartDate(element.dataset.cvDate),
      included: true,
      label: element.querySelector("h3")?.textContent.trim() || "Unnamed entry",
    }))
  );

  // Build checkboxes from existing Jekyll-rendered entries; do not duplicate data.
  // Checkbox changes affect both grouped and chronological views.
  const entryControls = new Map();
  sections.forEach((section) => {
    const groupEntries = entries.filter((item) => item.section === section);
    if (!groupEntries.length) return;
    const group = document.createElement("fieldset");
    group.className = "cv-entry-option-group";
    const legend = document.createElement("legend");
    legend.textContent = section.dataset.cvTitle;
    group.appendChild(legend);
    groupEntries.forEach((item) => {
      const label = document.createElement("label");
      label.className = "cv-entry-option";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = true;
      checkbox.setAttribute("aria-label", "Include " + item.label);
      const title = document.createElement("span");
      title.textContent = item.label;
      label.append(checkbox, title);
      group.appendChild(label);
      entryControls.set(item, { checkbox, label, group });
      checkbox.addEventListener("change", () => {
        item.included = checkbox.checked;
        render();
      });
    });
    entryOptions.appendChild(group);
  });

  // Only whitelisted values can alter @page. Never insert arbitrary user strings into CSS.
  const pageSizes = { a4: "A4", letter: "letter" };
  const pageMargins = { latex: "10mm", narrow: "8mm", standard: "13mm", wide: "19mm" };
  const paletteColors = {
    velvet: "#00166c",
    sapphire: "#123b63",
    teal: "#00686d",
    forest: "#225940",
    burgundy: "#7b2d42",
    graphite: "#363d48",
  };
  const templateDefaults = {
    personal: "#00104c",
    harvard: "#252525",
    europass: "#2176ac",
    minimal: "#123b63",
    editorial: "#31536e",
    professional: "#27374d",
  };
  // Both views use the same controls. Only density has separate defaults:
  // readable/balanced on the full-width page and LaTeX-compact in paper/PDF.
  // Changing density in either view is remembered when switching back.
  const viewDensity = { reading: "balanced", paper: "latex" };
  // The paper preview must reveal sections that browser printing expands.
  // Restore a reader's disclosure choices upon returning to full-width mode.
  const paperDisclosureState = new Map();
  const setPreview = (mode) => {
    const previousMode = root.dataset.cvPreview;
    if (previousMode === "reading" || previousMode === "paper") {
      viewDensity[previousMode] = controls.density.value;
    }
    root.dataset.cvPreview = mode;
    controls.density.value = viewDensity[mode];
    const paper = mode === "paper";
    if (paper) {
      root.querySelectorAll("details.cv-details").forEach((detail) => {
        if (!paperDisclosureState.has(detail)) paperDisclosureState.set(detail, detail.open);
        detail.open = true;
      });
    } else {
      paperDisclosureState.forEach((wasOpen, detail) => { detail.open = wasOpen; });
      paperDisclosureState.clear();
    }
    previewButton.textContent = paper ? "Full-width view" : "Paper preview";
    previewButton.setAttribute("aria-pressed", String(paper));
    previewHelp.textContent = paper
      ? "LaTeX-compact paper preview by default. Page breaks are approximate; your browser's Print dialog shows the final pages."
      : "Balanced full-width reading by default. Switch to Paper preview for compact print pages.";
  };
  const pageStyle = document.createElement("style");
  pageStyle.id = "cv-page-size";
  document.head.appendChild(pageStyle);

  // Europass-inspired headings are presentation labels, not edits to CV YAML.
  const europassLabels = {
    "Education": "Education and training",
    "Professional Experience": "Work experience",
    "Academic Experience": "Academic work experience",
    "Volunteering": "Volunteering experience",
    "Programming Experience": "Software development experience",
    "Research": "Research and publications",
    "Research Drafts": "Research drafts and related materials",
    "Technical Skills": "Digital and technical skills",
    "Languages": "Language skills",
    "Credentials": "Certificates and credentials",
    "Published Articles & Technical Writing": "Publications",
    "Selected Academic Projects": "Projects",
    "Awards": "Honours and awards",
  };
  // The EU's standard order puts work experience before education/training,
  // followed by personal skills and optional additional information.
  // Reorder presentation nodes only; never mutate the original YAML or
  // independently selected inclusions.
  const sectionContainer = sourceDocument.querySelector("#cv-sections");
  const europassOrder = [
    "Professional Experience", "Programming Experience", "Academic Experience",
    "Volunteering", "Education", "Credentials", "Schools",
    "Languages", "Technical Skills", "Research", "Research Drafts",
    "Published Articles & Technical Writing", "Selected Academic Projects",
    "Leadership", "Awards", "Selected Extracurricular Activities"
  ];
  const orderedSections = () => root.dataset.cvTemplate !== "europass"
    ? sections
    : [...sections].sort((a, b) => {
        const ai = europassOrder.indexOf(a.dataset.cvTitle);
        const bi = europassOrder.indexOf(b.dataset.cvTitle);
        return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
      });
  const europassGroup = (section) => ({
    "Languages": "PERSONAL SKILLS",
    "Research": "ADDITIONAL INFORMATION"
  })[section.dataset.cvTitle] || "";
  const syncSectionOrder = () => {
    sectionContainer.querySelectorAll(":scope > .cv-europass-group-heading").forEach((heading) => heading.remove());
    for (const section of orderedSections()) {
      if (root.dataset.cvTemplate === "europass" && controls.order.value === "sections" &&
          toggles.some((toggle) => toggle.dataset.cvSectionToggle === section.dataset.cvSection && toggle.checked)) {
        const group = europassGroup(section);
        if (group) {
          const heading = document.createElement("h2");
          heading.className = "cv-europass-group-heading";
          heading.textContent = group;
          sectionContainer.appendChild(heading);
        }
      }
      sectionContainer.appendChild(section);
    }
  };

  const displayTitle = (section) => root.dataset.cvTemplate === "europass"
    ? (europassLabels[section.dataset.cvTitle] || section.dataset.cvTitle)
    : section.dataset.cvTitle;
  const updateSectionTitles = () => {
    for (const section of sections) {
      const heading = section.querySelector(":scope > h2, :scope > details > summary > span");
      if (heading) heading.textContent = displayTitle(section);
    }
  };

  const included = (section) => {
    const toggle = toggles.find((item) => item.dataset.cvSectionToggle === section.dataset.cvSection);
    return !toggle || toggle.checked;
  };

  // The print engine owns actual page breaks. Build the same physical-sheet
  // measurement even in reading mode (offscreen), since Ctrl+P can start there.
  // Only a CV that fits on ONE sheet receives a vertical centering offset;
  // multipage CVs retain equal, fixed physical @page margins and native breaks.
  function renderPagedPreview() {
    const showing = root.dataset.cvPreview === "paper";
    const screenDensity = root.dataset.cvDensity;
    if (!showing) {
      root.dataset.cvDensity = viewDensity.paper;
      pagedPreview.style.position = "absolute";
      pagedPreview.style.left = "-10000px";
      pagedPreview.style.top = "0";
      pagedPreview.style.width = "var(--cv-paper-width)";
      pagedPreview.style.visibility = "hidden";
      pagedPreview.style.pointerEvents = "none";
    }
    pagedPreview.hidden = false;
    pagedPreview.style.display = "";
    pagedPreview.replaceChildren();

    let pageNumber = 0;
    let overlongBlocks = 0;
    const newPage = () => {
      pageNumber += 1;
      const wrapper = document.createElement("div");
      wrapper.className = "cv-preview-page";
      const label = document.createElement("p");
      label.className = "cv-preview-page-number";
      label.textContent = "Page " + pageNumber + " · " + (controls.paper.value === "letter" ? "US Letter" : "A4");
      const sheet = document.createElement("div");
      sheet.className = "cv-preview-sheet";
      const body = document.createElement("div");
      body.className = "cv-preview-paper-body";
      const content = document.createElement("article");
      content.className = "cv-content";
      body.appendChild(content);
      sheet.appendChild(body);
      wrapper.append(label, sheet);
      pagedPreview.appendChild(wrapper);
      return { body, sheet, content };
    };
    let page = newPage();

    // Clones must not duplicate the IDs of elements in the printable source.
    const cloneForPreview = (node) => {
      const copy = node.cloneNode(true);
      if (copy.hasAttribute("id")) copy.removeAttribute("id");
      copy.removeAttribute("aria-labelledby");
      copy.querySelectorAll("[id], [aria-labelledby]").forEach((child) => {
        child.removeAttribute("id");
        child.removeAttribute("aria-labelledby");
      });
      return copy;
    };

    const intro = sourceDocument.querySelector(".cv-intro");
    if (intro) {
      const heading = cloneForPreview(intro);
      heading.querySelector(".post-description")?.remove();
      page.body.insertBefore(heading, page.content);
    }

    const groups = [];
    if (controls.order.value !== "sections" && !timeline.hidden) {
      groups.push({
        title: "Chronological record",
        tag: "div",
        listClass: "cv-entry-list",
        items: Array.from(timelineItems.children),
      });
    }

    for (const section of orderedSections()) {
      if (section.hidden) continue;
      const europassLanguages = root.dataset.cvTemplate === "europass" && section.dataset.cvTitle === "Languages";
      const originalList = europassLanguages
        ? section.querySelector(".cv-europass-languages")
        : section.querySelector(".cv-entry-list, .cv-compact-grid, .cv-skills, .cv-inline-list");
      if (!originalList) continue;
      const items = Array.from(originalList.children).filter(
        (item) => item.dataset.cvIncluded !== "false"
      );
      if (!items.length) continue;
      groups.push({
        title: displayTitle(section) || "Section",
        groupHeading: root.dataset.cvTemplate === "europass" ? europassGroup(section) : "",
        tag: originalList.tagName.toLowerCase(),
        listClass: originalList.className,
        items,
      });
    }

    const startGroup = (group, continued) => {
      const section = document.createElement("section");
      section.className = "cv-section";
      if (group.groupHeading && !continued) {
        const label = document.createElement("h2");
        label.className = "cv-europass-group-heading";
        label.textContent = group.groupHeading;
        section.appendChild(label);
      }
      const heading = document.createElement("h2");
      heading.textContent = group.title + (continued ? " (continued)" : "");
      const list = document.createElement(group.tag);
      list.className = group.listClass;
      section.append(heading, list);
      page.content.appendChild(section);
      return { section, list };
    };

    for (const group of groups) {
      let block = startGroup(group, false);
      for (const original of group.items) {
        const entry = cloneForPreview(original);
        block.list.appendChild(entry);
        if (page.body.scrollHeight <= page.body.clientHeight + 2) continue;

        // Do not strand a section heading by itself at a page boundary.
        entry.remove();
        if (!block.list.children.length) block.section.remove();
        page = newPage();
        block = startGroup(group, true);
        block.list.appendChild(entry);

        // An individual record may be longer than one sheet; retain its
        // entire text visibly rather than clipping or silently discarding it.
        if (page.body.scrollHeight > page.body.clientHeight + 2) {
          page.sheet.dataset.cvOverflow = "true";
          overlongBlocks += 1;
        }
      }
    }

    // Center a short, single-page selection inside the printable paper area.
    // Balance each half of the *unused* height; never compress text or change
    // the user-selected minimum @page margin. For longer documents the offset
    // stays zero, preventing accidental new pages or fragmented flex columns.
    let topBalance = 0;
    if (pageNumber === 1 && !overlongBlocks) {
      const bodyTop = page.body.getBoundingClientRect().top;
      const contentBottom = page.content.getBoundingClientRect().bottom;
      const unusedHeight = page.body.clientHeight - (contentBottom - bodyTop);
      if (unusedHeight > 12) {
        topBalance = Math.floor(unusedHeight / 2);
        page.body.style.boxSizing = "border-box";
        page.body.style.paddingTop = topBalance + "px";
      }
    }
    root.dataset.cvSinglePage = pageNumber === 1 && !overlongBlocks ? "true" : "false";
    root.style.setProperty("--cv-print-top-balance", topBalance + "px");

    // The on-screen sheet uses the same offset as the actual print document.
    // In reading mode the measuring sheets must never become visible.
    root.dataset.cvPaginated = showing ? "true" : "false";
    if (!showing) {
      // Cache the numeric offset only; don't retain duplicate, invisible CV
      // entries or active links in the reading-mode DOM.
      pagedPreview.replaceChildren();
      pagedPreview.hidden = true;
      pagedPreview.style.display = "none";
      for (const key of ["position", "left", "top", "width", "visibility", "pointerEvents"]) {
        pagedPreview.style[key] = "";
      }
      root.dataset.cvDensity = screenDensity;
      return;
    }
    previewHelp.textContent = pageNumber + " approximate " +
      (pageNumber === 1 ? "page" : "pages") + " (" +
      (controls.paper.value === "letter" ? "US Letter" : "A4") +
      "). Page breaks can differ in the browser's Print dialog." +
      (overlongBlocks ? " Some long entries may span a printed page." : "") +
      (topBalance ? " Short single-page selections are centered vertically." : "");
  }

  const render = () => {
    const order = controls.order.value;
    root.dataset.cvTemplate = controls.template.value;
    syncSectionOrder();
    updateSectionTitles();
    root.dataset.cvFont = controls.font.value;
    root.dataset.cvDensity = controls.density.value;
    viewDensity[root.dataset.cvPreview] = controls.density.value;
    root.dataset.cvMarkers = controls.markers.value;
    root.dataset.cvPaper = controls.paper.value;
    root.dataset.cvShowUrls = controls.printUrls.checked ? "true" : "false";
    root.dataset.cvTextSize = controls.size.value;
    for (const toggle of printToggles) {
      root.dataset["cvShow" + toggle.dataset.cvPrintToggle[0].toUpperCase() + toggle.dataset.cvPrintToggle.slice(1)] =
        toggle.checked ? "true" : "false";
    }
    const chosenMargin = pageMargins[controls.margin.value] || pageMargins.standard;
    root.style.setProperty("--cv-print-margin", chosenMargin);
    entries.forEach((item) => {
      item.element.dataset.cvIncluded = item.included ? "true" : "false";
    });
    entryCount.textContent = "(" + entries.filter((item) => item.included).length + " / " + entries.length + ")";
    const selectedPalette = controls.palette.value;
    controls.accent.disabled = selectedPalette !== "custom";
    const color = selectedPalette === "custom"
      ? controls.accent.value
      : paletteColors[selectedPalette] || templateDefaults[controls.template.value] || paletteColors.velvet;
    // Strictly validate hex color; do not interpolate arbitrary strings into CSS.
    root.style.setProperty("--cv-accent", /^#[0-9a-f]{6}$/i.test(color) ? color : paletteColors.velvet);
    pageStyle.textContent =
      "@page { size: " + (pageSizes[controls.paper.value] || "A4") +
      "; margin: " + chosenMargin + "; }";

    // Keep undated sections in their authored place after the dynamic timeline.
    sections.forEach((section) => {
      const dated = entries.some((item) => item.section === section);
      const hasChosenEntry = !dated || entries.some((item) => item.section === section && item.included);
      section.hidden = !included(section) || !hasChosenEntry || (order !== "sections" && dated);
    });
    // Hide optional Europass group headers when their section was excluded.
    for (const heading of sectionContainer.querySelectorAll(":scope > .cv-europass-group-heading")) {
      heading.hidden = heading.nextElementSibling?.hidden ?? true;
    }

    if (order === "sections") {
      timeline.hidden = true;
      timelineItems.replaceChildren();
      status.textContent = entries.filter((item) => item.included && included(item.section)).length +
        " entries selected across " + toggles.filter((toggle) => toggle.checked).length + " sections";
      renderPagedPreview();
      return;
    }

    const active = entries
      .filter((item) => included(item.section) && item.included)
      .sort((a, b) => {
        // Unknown dates are always last. Stable section/entry indices break ties.
        if (a.timestamp === null) return b.timestamp === null ? a.sectionIndex - b.sectionIndex || a.index - b.index : 1;
        if (b.timestamp === null) return -1;
        const difference = order === "newest" ? b.timestamp - a.timestamp : a.timestamp - b.timestamp;
        return difference || a.sectionIndex - b.sectionIndex || a.index - b.index;
      });

    const fragment = document.createDocumentFragment();
    active.forEach((item) => {
      const clone = item.element.cloneNode(true);
      // Add the original section label to every dated entry so context is never lost.
      const category = document.createElement("p");
      category.className = "cv-timeline-category";
      category.textContent = displayTitle(item.section);
      clone.prepend(category);
      fragment.appendChild(clone);
    });
    timelineItems.replaceChildren(fragment);
    timeline.hidden = active.length === 0;
    status.textContent = active.length + " selected entries in chronological order";
    renderPagedPreview();
  };

  Object.entries(controls).filter(([key]) => key !== "template").forEach(([, control]) => control.addEventListener("change", render));
  controls.template.addEventListener("change", () => {
    // Europass uses grouped sections by default, while users remain free to
    // choose the chronological timeline afterwards.
    if (controls.template.value === "europass") controls.order.value = "sections";
    render();
  });
  toggles.forEach((toggle) => toggle.addEventListener("change", render));
  printToggles.forEach((toggle) => toggle.addEventListener("change", render));
  entrySearch.addEventListener("input", () => {
    const query = entrySearch.value.trim().toLocaleLowerCase();
    for (const [item, control] of entryControls) {
      control.label.hidden = !(
        item.label.toLocaleLowerCase().includes(query) ||
        item.section.dataset.cvTitle.toLocaleLowerCase().includes(query)
      );
    }
    for (const group of entryOptions.querySelectorAll("fieldset")) {
      group.hidden = !Array.from(group.querySelectorAll(".cv-entry-option")).some((label) => !label.hidden);
    }
  });
  const setAllEntries = (included) => {
    for (const [item, control] of entryControls) {
      item.included = included;
      control.checkbox.checked = included;
    }
    render();
  };
  allEntriesButton.addEventListener("click", () => setAllEntries(true));
  noEntriesButton.addEventListener("click", () => setAllEntries(false));
  controls.accent.addEventListener("input", render);
  previewButton.addEventListener("click", () => {
    setPreview(root.dataset.cvPreview === "paper" ? "reading" : "paper");
    render();
    (root.dataset.cvPreview === "paper" ? pagedPreview : sourceDocument).scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Keep export available while the configuration panel is collapsed.
  const setPanelOpen = (open) => {
    settingsPanel.hidden = !open;
    root.dataset.cvTools = open ? "open" : "closed";
    panelToggle.setAttribute("aria-expanded", String(open));
    panelToggle.setAttribute("aria-label", open ? "Hide CV settings" : "Show CV settings");
    panelToggle.title = open ? "Hide CV settings" : "Show CV settings";
    const chevron = panelToggle.querySelector("i");
    if (chevron) {
      chevron.classList.toggle("fa-chevron-right", !open);
      chevron.classList.toggle("fa-chevron-left", open);
    }
    requestAnimationFrame(() => renderPagedPreview());
  };
  panelToggle.addEventListener("click", () => setPanelOpen(settingsPanel.hidden));

  resetButton.addEventListener("click", () => {
    controls.order.value = "sections";
    controls.template.value = "personal";
    controls.font.value = "site";
    controls.paper.value = "a4";
    viewDensity.reading = "balanced";
    viewDensity.paper = "latex";
    controls.density.value = "balanced";
    controls.markers.value = "dashes";
    controls.palette.value = "default";
    controls.accent.value = "#00104c";
    controls.printUrls.checked = false;
    controls.size.value = "regular";
    controls.margin.value = "latex";
    printToggles.forEach((toggle) => { toggle.checked = true; });
    for (const [item, control] of entryControls) {
      item.included = true;
      control.checkbox.checked = true;
    }
    entrySearch.value = "";
    entrySearch.dispatchEvent(new Event("input"));
    setPreview("reading");
    // Reset always restores the wide default, even if reset was clicked
    // while a custom paper density was selected.
    viewDensity.reading = "balanced";
    viewDensity.paper = "latex";
    controls.density.value = "balanced";
    toggles.forEach((toggle) => { toggle.checked = true; });
    render();
  });


  // The browser Print dialog (Ctrl+P / Cmd+P) uses the paper view's density.
  // Keep the shared dropdown and on-screen preview unchanged, whether
  // printing from the wide view or from the page-by-page preview.
  // Closed <details> suppress their children in print; reopen temporarily.
  let previouslyOpen = [];
  let screenDensityBeforePrint = null;
  window.addEventListener("beforeprint", () => {
    if (screenDensityBeforePrint === null) {
      screenDensityBeforePrint = root.dataset.cvDensity;
      const details = Array.from(root.querySelectorAll("details.cv-details"));
      previouslyOpen = details.filter((item) => item.open);
    }
    root.dataset.cvDensity = viewDensity.paper;
    root.querySelectorAll("details.cv-details").forEach((item) => { item.open = true; });
  });
  window.addEventListener("afterprint", () => {
    root.dataset.cvDensity = screenDensityBeforePrint ?? controls.density.value;
    screenDensityBeforePrint = null;
    root.querySelectorAll("details.cv-details").forEach((item) => {
      item.open = previouslyOpen.includes(item);
    });
    previouslyOpen = [];
  });

  setPanelOpen(false);
  setPreview("reading");
  render();

  // Re-measure after responsive width changes or fonts become available.
  let resizeFrame = 0;
  window.addEventListener("resize", () => {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      renderPagedPreview();
    });
  });
  if (document.fonts?.ready) document.fonts.ready.then(() => renderPagedPreview());
})();
