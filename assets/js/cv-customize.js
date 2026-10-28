/* Browser-only CV configurator. The original YAML order remains readable without JS. */
(() => {
  "use strict";

  const root = document.getElementById("cv-page");
  if (!root) return;

  const controls = {
    order: document.getElementById("cv-order"),
    template: document.getElementById("cv-template"),
    font: document.getElementById("cv-font"),
    paper: document.getElementById("cv-paper"),
    density: document.getElementById("cv-density"),
    palette: document.getElementById("cv-palette"),
    accent: document.getElementById("cv-custom-accent"),
    printUrls: document.getElementById("cv-print-urls"),
    size: document.getElementById("cv-text-size"),
    margin: document.getElementById("cv-page-margin"),
  };
  const timeline = document.getElementById("cv-timeline");
  const timelineItems = document.getElementById("cv-timeline-items");
  const status = document.getElementById("cv-status");
  const printButton = document.getElementById("cv-print");
  const resetButton = document.getElementById("cv-reset");
  const previewButton = document.getElementById("cv-preview");
  const previewHelp = document.getElementById("cv-preview-help");
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
    !printButton ||
    !resetButton ||
    !previewButton ||
    !previewHelp ||
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
    "GitHub Actions", "Springer Nature", "SN Computer Science", "activation patching",
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
  const pageMargins = { narrow: "8mm", standard: "13mm", wide: "19mm" };
  const paletteColors = {
    velvet: "#00166c",
    sapphire: "#123b63",
    teal: "#00686d",
    forest: "#225940",
    burgundy: "#7b2d42",
    graphite: "#363d48",
  };
  const templateDefaults = {
    personal: "#00166c",
    harvard: "#252525",
    minimal: "#123b63",
    editorial: "#31536e",
    professional: "#27374d",
  };
  // The paper preview must reveal sections that browser printing expands.
  // Restore a reader's disclosure choices upon returning to full-width mode.
  const paperDisclosureState = new Map();
  const setPreview = (mode) => {
    root.dataset.cvPreview = mode;
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
      ? "Live paper-width preview; page breaks are approximated. Print / Save as PDF opens the exact paginated preview."
      : "Full-width reading view; choose Paper preview to see the print-style page.";
  };
  const pageStyle = document.createElement("style");
  pageStyle.id = "cv-page-size";
  document.head.appendChild(pageStyle);

  const included = (section) => {
    const toggle = toggles.find((item) => item.dataset.cvSectionToggle === section.dataset.cvSection);
    return !toggle || toggle.checked;
  };

  const render = () => {
    const order = controls.order.value;
    root.dataset.cvTemplate = controls.template.value;
    root.dataset.cvFont = controls.font.value;
    root.dataset.cvDensity = controls.density.value;
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

    if (order === "sections") {
      timeline.hidden = true;
      timelineItems.replaceChildren();
      status.textContent = entries.filter((item) => item.included && included(item.section)).length +
        " entries selected across " + toggles.filter((toggle) => toggle.checked).length + " sections";
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
      category.textContent = item.section.dataset.cvTitle;
      clone.prepend(category);
      fragment.appendChild(clone);
    });
    timelineItems.replaceChildren(fragment);
    timeline.hidden = active.length === 0;
    status.textContent = active.length + " selected entries in chronological order";
  };

  Object.values(controls).forEach((control) => control.addEventListener("change", render));
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
    document.getElementById("cv-document").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  resetButton.addEventListener("click", () => {
    controls.order.value = "sections";
    controls.template.value = "personal";
    controls.font.value = "site";
    controls.paper.value = "a4";
    controls.density.value = "balanced";
    controls.palette.value = "default";
    controls.accent.value = "#00166c";
    controls.printUrls.checked = false;
    controls.size.value = "regular";
    controls.margin.value = "standard";
    printToggles.forEach((toggle) => { toggle.checked = true; });
    for (const [item, control] of entryControls) {
      item.included = true;
      control.checkbox.checked = true;
    }
    entrySearch.value = "";
    entrySearch.dispatchEvent(new Event("input"));
    setPreview("paper");
    toggles.forEach((toggle) => { toggle.checked = true; });
    render();
  });

  printButton.addEventListener("click", () => window.print());

  // Closed <details> normally suppress their children in print. Restore each
  // disclosure's original state after the browser finishes printing.
  let previouslyOpen = [];
  window.addEventListener("beforeprint", () => {
    const details = Array.from(root.querySelectorAll("details.cv-details"));
    previouslyOpen = details.filter((item) => item.open);
    details.forEach((item) => { item.open = true; });
  });
  window.addEventListener("afterprint", () => {
    root.querySelectorAll("details.cv-details").forEach((item) => {
      item.open = previouslyOpen.includes(item);
    });
    previouslyOpen = [];
  });

  setPreview("paper");
  render();
})();
