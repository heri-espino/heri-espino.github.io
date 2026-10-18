// Static, accessible credentials filtering, view switching, and category-local sorting.
// Without JavaScript all records remain readable in their curated order.
(() => {
  const query = document.getElementById("credential-query");
  const category = document.getElementById("credential-category");
  const reset = document.getElementById("credential-clear");
  const status = document.getElementById("credential-results");
  const empty = document.getElementById("credential-empty");
  const sort = document.getElementById("credential-sort");
  const view = document.getElementById("credential-view");
  const groups = Array.from(document.querySelectorAll("[data-credential-group]"));

  if (![query, category, reset, status, empty, sort, view].every(Boolean) || !groups.length) return;

  const normalize = (value) =>
    (value || "").toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  const toDate = (raw) => {
    const value = (raw || "").trim();
    const year = value.match(/^(20\d{2})$/);
    if (year) return Date.UTC(Number(year[1]), 0, 1);
    const match = value.match(/^([A-Za-z]{3,9})\.?\s+(20\d{2})$/);
    const month = match?.[1].slice(0, 3).toLowerCase();
    return match && Object.hasOwn(months, month) ? Date.UTC(Number(match[2]), months[month], 1) : null;
  };

  const all = groups.flatMap((group) => {
    const list = group.querySelector(".credentials-list");
    return Array.from(list.querySelectorAll("[data-credential-entry]")).map((element, index) => ({
      element,
      list,
      category: element.dataset.category,
      text: normalize(element.textContent),
      title: element.dataset.sortTitle || "",
      date: toDate(element.dataset.sortDate),
      index,
    }));
  });

  const reorder = () => {
    groups.forEach((group) => {
      const list = group.querySelector(".credentials-list");
      const items = all.filter((record) => record.list === list);
      const selected = sort.value;
      items.sort((a, b) => {
        if (selected === "title") {
          return a.title.localeCompare(b.title, undefined, { sensitivity: "base" }) || a.index - b.index;
        }
        if (selected === "newest" || selected === "oldest") {
          if (a.date === null) return b.date === null ? a.index - b.index : 1;
          if (b.date === null) return -1;
          return (selected === "newest" ? b.date - a.date : a.date - b.date) || a.index - b.index;
        }
        return a.index - b.index;
      });
      items.forEach(({ element }) => list.append(element));
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        list.classList.remove("is-reordering");
        void list.offsetWidth;
        list.classList.add("is-reordering");
      }
    });
  };

  const update = () => {
    const term = normalize(query.value);
    const activeCategory = category.value;
    let shown = 0;
    all.forEach((item) => {
      const matches = (activeCategory === "all" || item.category === activeCategory) && (!term || item.text.includes(term));
      item.element.hidden = !matches;
      if (matches) shown += 1;
    });
    groups.forEach((group) => {
      group.hidden = !group.querySelector("[data-credential-entry]:not([hidden])");
    });
    status.textContent = `Showing ${shown} of ${all.length} records`;
    empty.hidden = shown !== 0;
  };

  query.addEventListener("input", update);
  category.addEventListener("change", update);
  sort.addEventListener("change", reorder);
  view.addEventListener("change", () => {
    groups.forEach((group) => {
      const list = group.querySelector(".credentials-list");
      list.dataset.view = view.value;
      // Animate certificate actions when switching into grid view, but not in list view.
      list.classList.toggle("is-grid-activated", view.value === "grid");
    });
  });
  reset.addEventListener("click", () => {
    query.value = "";
    category.value = "all";
    sort.value = "curated";
    view.value = "list";
    groups.forEach((group) => {
      const list = group.querySelector(".credentials-list");
      list.dataset.view = "list";
      list.classList.remove("is-grid-activated");
    });
    reorder();
    update();
    query.focus();
  });
})();
