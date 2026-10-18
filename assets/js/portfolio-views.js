// Progressive enhancement for portfolio collections: grid/list views and sorting.
// Original content and order remain accessible without JavaScript.
(() => {
  const months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  const dateValue = (input) => {
    const value = (input || "").trim();
    if (!value) return null;
    const yearOnly = value.match(/^(20\d{2})$/);
    if (yearOnly) return Date.UTC(Number(yearOnly[1]), 0, 1);
    const monthYear = value.match(/^([A-Za-z]{3,9})\.?\s+(20\d{2})$/);
    if (monthYear && Object.hasOwn(months, monthYear[1].slice(0, 3).toLowerCase())) {
      return Date.UTC(Number(monthYear[2]), months[monthYear[1].slice(0, 3).toLowerCase()], 1);
    }
    const iso = value.match(/^(20\d{2})-(\d{2})(?:-(\d{2}))?$/);
    if (iso) return Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3] || 1));
    return null; // Unknown dates appear last, without guessing.
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("[data-portfolio-collection]").forEach((collection, collectionIndex) => {
    const items = Array.from(collection.children).filter((item) =>
      item.matches(".portfolio-card, .portfolio-credentials-highlight")
    );
    if (!items.length) return;
    const collectionName = collection.dataset.collectionLabel || "Portfolio";
    const id = `portfolio-view-${collectionIndex}`;
    const controls = document.createElement("div");
    controls.className = "portfolio-view-tools";
    controls.setAttribute("aria-label", `${collectionName} display options`);
    controls.innerHTML = `
      <div class="portfolio-view-toggle" role="group" aria-label="View ${collectionName}">
        <span class="portfolio-view-label">View</span>
        <button type="button" data-view-option="grid" aria-pressed="true">Grid</button>
        <button type="button" data-view-option="list" aria-pressed="false">List</button>
      </div>
      <div class="portfolio-sort-control">
        <label for="${id}">Sort by</label>
        <select id="${id}">
          <option value="curated">Featured order</option>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">Title A–Z</option>
        </select>
      </div>`;
    collection.before(controls);

    const initial = items.map((element, index) => ({
      element,
      index,
      title: (element.dataset.sortTitle || element.querySelector("h3")?.textContent || "").trim(),
      date: dateValue(element.dataset.sortDate),
    }));
    const buttons = controls.querySelectorAll("[data-view-option]");
    buttons.forEach((button) =>
      button.addEventListener("click", () => {
        const view = button.dataset.viewOption;
        collection.dataset.view = view;
        buttons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      })
    );
    controls.querySelector("select").addEventListener("change", (event) => {
      const selected = event.target.value;
      const ordered = [...initial].sort((a, b) => {
        if (selected === "title") return a.title.localeCompare(b.title, undefined, { sensitivity: "base" }) || a.index - b.index;
        if (selected === "newest" || selected === "oldest") {
          if (a.date === null) return b.date === null ? a.index - b.index : 1;
          if (b.date === null) return -1;
          return (selected === "newest" ? b.date - a.date : a.date - b.date) || a.index - b.index;
        }
        return a.index - b.index;
      });
      ordered.forEach(({ element }) => collection.append(element));
      if (!reducedMotion) {
        collection.classList.remove("is-reordering");
        // Restart the subtle transition when users actively change sorting.
        void collection.offsetWidth;
        collection.classList.add("is-reordering");
      }
    });
  });
})();
