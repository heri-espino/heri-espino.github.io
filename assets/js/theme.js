// al-folio-compatible theme behavior with light as the first-visit default.

let determineThemeSetting = () => {
  const stored = localStorage.getItem("theme");
  return ["light", "dark", "system"].includes(stored) ? stored : "light";
};

let determineComputedTheme = () => {
  const setting = determineThemeSetting();
  if (setting === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return setting;
};

let setHighlight = (theme) => {
  const light = document.getElementById("highlight_theme_light");
  const dark = document.getElementById("highlight_theme_dark");
  if (!light || !dark) return;
  light.media = theme === "dark" ? "none" : "";
  dark.media = theme === "dark" ? "" : "none";
};

let setSearchTheme = (theme) => {
  const search = document.querySelector("ninja-keys");
  if (search) search.classList.toggle("dark", theme === "dark");
};

let setGiscusTheme = (theme) => {
  const frame = document.querySelector("iframe.giscus-frame");
  if (frame) frame.contentWindow.postMessage({ giscus: { setConfig: { theme } } }, "https://giscus.app");
};

let applyTheme = () => {
  const theme = determineComputedTheme();
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-theme-setting", determineThemeSetting());
  setHighlight(theme);
  setSearchTheme(theme);
  setGiscusTheme(theme);
  document.querySelectorAll("table").forEach((table) => table.classList.toggle("table-dark", theme === "dark"));
};

let setThemeSetting = (setting) => {
  localStorage.setItem("theme", setting);
  applyTheme();
};

let toggleThemeSetting = () => {
  const setting = determineThemeSetting();
  setThemeSetting(setting === "light" ? "dark" : setting === "dark" ? "system" : "light");
};

let initTheme = () => {
  if (!localStorage.getItem("theme")) localStorage.setItem("theme", "light");
  applyTheme();
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (determineThemeSetting() === "system") applyTheme();
  });
};

let initScrollMotion = () => {
  const root = document.documentElement;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

  const selectors = [
    ".portfolio-hero > *",
    ".portfolio-section-heading",
    ".portfolio-grid > .portfolio-card",
    ".portfolio-archive-cta",
    ".portfolio-section-profile-link",
    ".portfolio-contact-links",
    ".portfolio-detail-header",
    ".portfolio-detail-aside",
    ".portfolio-reading-section",
    ".repository-card",
    ".contact-page-intro",
    ".contact-page-link",
    ".post > .post-header",
  ];
  const targets = [...new Set(document.querySelectorAll(selectors.join(", ")))];

  if (!targets.length) return;

  root.classList.add("portfolio-scroll-motion");

  const reveal = (element) => {
    element.classList.add("is-visible");
    element.addEventListener(
      "animationend",
      () => {
        element.classList.remove("portfolio-scroll-reveal", "is-visible");
        element.style.removeProperty("--portfolio-reveal-delay");
      },
      { once: true }
    );
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        reveal(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  targets.forEach((element) => {
    const rect = element.getBoundingClientRect();

    // Leave above-the-fold content untouched so the initial render never flashes.
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) return;

    element.classList.add("portfolio-scroll-reveal");
    if (element.matches(".portfolio-card")) {
      const cardIndex = [...element.parentElement.children].indexOf(element);
      element.style.setProperty("--portfolio-reveal-delay", `${(cardIndex % 2) * 40}ms`);
    }
    observer.observe(element);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("light-toggle");
  if (toggle) toggle.addEventListener("click", toggleThemeSetting);
  applyTheme();
  initScrollMotion();
});
