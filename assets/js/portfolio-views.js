// Archive-only search, sorting and view controls.
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
    const elements = Array.from(collection.children).filter((node) => node.matches(".portfolio-card"));
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
      '<select id="' + id + '-view"><option value="grid">Grid</option><option value="list">List</option></select></div>',
      '<button type="button" class="credentials-clear" data-archive-reset>Reset</button>',
    ].join("");

    const status = document.createElement("p");
    status.className = "credentials-result-count";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    const empty = document.createElement("p");
    empty.className = "credentials-empty";
    empty.textContent = "No records match these filters.";
    empty.hidden = true;
    collection.before(controls, status, empty);

    const query = controls.querySelector('input[type="search"]');
    const sort = controls.querySelector("select[id$='-sort']");
    const view = controls.querySelector("select[id$='-view']");
    const reset = controls.querySelector("[data-archive-reset]");
    const records = elements.map((element, originalIndex) => ({
      element,
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
      ordered.forEach((record) => collection.append(record.element));
      if (!reducedMotion && choice !== "curated") {
        collection.classList.remove("is-reordering");
        void collection.offsetWidth;
        collection.classList.add("is-reordering");
      } else {
        collection.classList.remove("is-reordering");
      }
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
    };

    query.addEventListener("input", filter);
    sort.addEventListener("change", reorder);
    view.addEventListener("change", () => { collection.dataset.view = view.value; });
    reset.addEventListener("click", () => {
      query.value = "";
      sort.value = "curated";
      view.value = "grid";
      collection.dataset.view = "grid";
      reorder();
      filter();
      query.focus();
    });
    filter();
  });
})();
