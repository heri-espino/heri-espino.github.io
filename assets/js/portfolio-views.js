// Archive-only search, sorting and view controls; collapsed by default.
// Content remains readable in its featured order without JavaScript.
(() => {
  const months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const normalize = (value) =>
    (value || "").toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const dateValue = (input) => {
    const value = (input || "").trim();
    if (!value) return null;
    const year = value.match(/^(20\d{2})$/);
    if (year) return Date.UTC(Number(year[1]), 0, 1);
    const monthYear = value.match(/^([A-Za-z]{3,9})\.?\s+(20\d{2})$/);
    if (monthYear) {
      const month = monthYear[1].slice(0, 3).toLowerCase();
      if (Object.hasOwn(months, month)) return Date.UTC(Number(monthYear[2]), months[month], 1);
    }
    const iso = value.match(/^(20\d{2})-(\d{2})(?:-(\d{2}))?$/);
    if (iso) return Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3] || 1));
    return null; // Keep undated items last in date sorts instead of inventing dates.
  };

  document.querySelectorAll("[data-portfolio-archive]").forEach((collection, index) => {
    // Papers has three grouped grids with one shared control panel.
    // Flat archives retain their existing behavior.
    const groups = Array.from(collection.querySelectorAll("[data-portfolio-group]"));
    const containers = groups.length ? groups : [collection];
    const elements = containers.flatMap((container) =>
      Array.from(container.children).filter((node) => node.matches(".portfolio-card"))
    );
    if (!elements.length) return;

    const label = collection.dataset.collectionLabel || "portfolio";
    const id = "portfolio-archive-" + index;
    const controls = document.createElement("div");
    controls.className = "credentials-tools portfolio-archive-tools";
    controls.setAttribute("role", "search");
    controls.setAttribute("aria-label", "Filter " + label);
    controls.innerHTML = [
      '<div class="credentials-tool"><label for="' + id + '-query">Search by title or topic</label>',
      '<input type="search" id="' + id + '-query" placeholder="Search ' + label.toLowerCase() + '" autocomplete="off"></div>',
      '<div class="credentials-tool credentials-tool-select"><label for="' + id + '-sort">Sort records</label>',
      '<select id="' + id + '-sort"><option value="curated">Featured order</option>',
      '<option value="newest">Newest first</option><option value="oldest">Oldest first</option>',
      '<option value="title">Title A–Z</option></select></div>',
      '<div class="credentials-tool credentials-tool-select"><label for="' + id + '-view">View</label>',
      '<select id="' + id + '-view"><option value="list">List</option>',
      '<option value="compact">Compact list</option><option value="grid">Grid</option></select></div>',
      '<button type="button" class="credentials-clear" data-archive-reset>Reset</button>',
    ].join("");

    // A native details/summary toggle is keyboard accessible and stays closed
    // initially; visitors can reveal all search, sort and display controls.
    const settings = document.createElement("details");
    settings.className = "portfolio-display-settings";
    const summary = document.createElement("summary");
    summary.className = "portfolio-display-settings-toggle";
    summary.title = "Customize " + label + " display";
    summary.innerHTML = '<span class="portfolio-display-chevron" aria-hidden="true">&gt;</span>' +
      '<span class="portfolio-sr-only">Customize ' + label + ' display</span>';
    settings.append(summary, controls);

    const status = document.createElement("p");
    status.className = "credentials-result-count";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    const empty = document.createElement("p");
    empty.className = "credentials-empty";
    empty.textContent = "No records match these filters.";
    empty.hidden = true;
    collection.before(settings, status, empty);

    const query = controls.querySelector('input[type="search"]');
    const sort = controls.querySelector("select[id$='-sort']");
    const view = controls.querySelector("select[id$='-view']");
    const reset = controls.querySelector("[data-archive-reset]");
    const records = elements.map((element, originalIndex) => ({
      element,
      container: element.parentElement,
      originalIndex,
      title: normalize(element.dataset.sortTitle || element.querySelector("h3")?.textContent),
      text: normalize(element.textContent),
      date: dateValue(element.dataset.sortDate),
    }));

    const reorder = () => {
      const choice = sort.value;
      const ordered = [...records].sort((a, b) => {
        if (choice === "title") return a.title.localeCompare(b.title) || a.originalIndex - b.originalIndex;
        if (choice === "newest" || choice === "oldest") {
          if (a.date === null) return b.date === null ? a.originalIndex - b.originalIndex : 1;
          if (b.date === null) return -1;
          return (choice === "newest" ? b.date - a.date : a.date - b.date) || a.originalIndex - b.originalIndex;
        }
        return a.originalIndex - b.originalIndex;
      });
      // Sorting must never move a manuscript across its submission-stage divider.
      containers.forEach((container) => {
        ordered.filter((record) => record.container === container)
          .forEach((record) => container.append(record.element));
        if (!reducedMotion && choice !== "curated") {
          container.classList.remove("is-reordering");
          void container.offsetWidth;
          container.classList.add("is-reordering");
        } else {
          container.classList.remove("is-reordering");
        }
      });
    };

    const filter = () => {
      const term = normalize(query.value);
      let count = 0;
      records.forEach((record) => {
        const visible = !term || record.text.includes(term);
        record.element.hidden = !visible;
        if (visible) count += 1;
      });
      status.textContent = term ? "Showing " + count + " of " + records.length + " records" : "Showing all " + records.length + " records";
      empty.hidden = count !== 0;
      // Hide empty sections while searching; restore both headings when reset.
      if (groups.length) {
        groups.forEach((group) => {
          const section = group.closest("[data-portfolio-section]");
          if (section) {
            section.hidden = Boolean(term) && !records.some((record) =>
              record.container === group && !record.element.hidden
            );
          }
        });
      }
    };

    query.addEventListener("input", filter);
    sort.addEventListener("change", reorder);
    const setView = (mode) => {
      collection.dataset.view = mode;
      containers.forEach((container) => { container.dataset.view = mode; });
    };
    view.addEventListener("change", () => setView(view.value));
    reset.addEventListener("click", () => {
      query.value = "";
      sort.value = "curated";
      view.value = "list";
      setView("list");
      reorder();
      filter();
      query.focus();
    });
    // Explicit initialization also handles markup without data-view attributes.
    setView("list");
    filter();
  });
})();
