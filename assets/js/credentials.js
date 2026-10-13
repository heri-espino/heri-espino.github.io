// Lightweight client-side filtering for the static credentials archive.
// All records remain visible if JavaScript is disabled.
(() => {
  const query = document.getElementById("credential-query");
  const category = document.getElementById("credential-category");
  const reset = document.getElementById("credential-clear");
  const status = document.getElementById("credential-results");
  const empty = document.getElementById("credential-empty");
  const records = Array.from(document.querySelectorAll("[data-credential-entry]"));
  const groups = Array.from(document.querySelectorAll("[data-credential-group]"));

  if (!query || !category || !reset || !status || !empty || !records.length) return;

  const normalized = (value) =>
    value
      .toLocaleLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const searchable = records.map((record) => ({
    element: record,
    text: normalized(record.textContent),
    category: record.dataset.category,
  }));

  const update = () => {
    const term = normalized(query.value);
    const selectedCategory = category.value;
    let visibleCount = 0;

    for (const record of searchable) {
      const visible = (selectedCategory === "all" || selectedCategory === record.category) && (!term || record.text.includes(term));

      record.element.hidden = !visible;
      if (visible) visibleCount += 1;
    }

    for (const group of groups) {
      group.hidden = !group.querySelector("[data-credential-entry]:not([hidden])");
    }

    status.textContent = `Showing ${visibleCount} of ${records.length} records`;
    empty.hidden = visibleCount !== 0;
  };

  query.addEventListener("input", update);
  category.addEventListener("change", update);
  reset.addEventListener("click", () => {
    query.value = "";
    category.value = "all";
    update();
    query.focus();
  });
})();
