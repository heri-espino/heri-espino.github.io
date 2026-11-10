const { test, expect } = require("@playwright/test");
const { preparePage, stabilizeVisuals } = require("./helpers");

test("publications Abs toggle opens and closes", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/publications/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const absButton = page.getByRole("button", { name: "Abs" }).first();
  await expect(absButton).toBeVisible();

  const panel = page.locator(".abstract.hidden").first();
  await absButton.click();
  await expect(panel).toHaveClass(/open/);

  await absButton.click();
  await expect(panel).not.toHaveClass(/open/);
});

test("publication popover works without bootstrap compat runtime", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/publications/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const popoverTrigger = page.locator('[data-toggle="popover"]').first();
  test.skip((await popoverTrigger.count()) === 0, "no popover trigger found in fixture data");

  await popoverTrigger.hover();
  await expect(page.locator(".af-popover")).toBeVisible();
});

test("mobile navbar can expand/collapse", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile-only navigation behavior");

  await preparePage(page, "light");
  await page.goto("/al-folio/", { waitUntil: "networkidle" });

  const toggle = page.locator(".navbar-toggler").first();
  await expect(toggle).toBeVisible();

  const nav = page.locator(".navbar-collapse").first();
  await toggle.click();
  await expect(nav).toHaveClass(/show/);

  await toggle.click();
  await expect(nav).not.toHaveClass(/show/);
});

test("repositories page renders external stat cards with deterministic fixtures", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/repositories/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const repoImages = page.locator('img[src*="github-readme-stats"], img[src*="github-profile-trophy"]');
  await expect(repoImages.first()).toBeVisible();

  const renderedCount = await repoImages.evaluateAll((images) => images.filter((img) => img.complete && img.naturalWidth > 0).length);
  expect(renderedCount).toBeGreaterThan(0);
});

test("blog pagination uses core Tailwind-native styling contract", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/blog/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const pagination = page.locator(".af-pagination");
  await expect(pagination.first()).toBeVisible();

  const pageLink = page.locator(".af-page-link").first();
  await expect(pageLink).toBeVisible();

  const styles = await pageLink.evaluate((node) => {
    const computed = window.getComputedStyle(node);
    return {
      borderTopWidth: computed.borderTopWidth,
      backgroundColor: computed.backgroundColor,
      paddingTop: computed.paddingTop,
      paddingLeft: computed.paddingLeft,
    };
  });

  expect(styles.borderTopWidth).not.toBe("0px");
  expect(styles.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  expect(styles.paddingTop).not.toBe("0px");
  expect(styles.paddingLeft).not.toBe("0px");
});

test("navbar menu stays right-aligned on desktop pages", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "desktop-only alignment contract");

  await preparePage(page, "light");
  await page.goto("/al-folio/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const alignment = await page.evaluate(() => {
    const container = document.querySelector("#navbar .container");
    const menu = document.querySelector("#navbarNav .navbar-menu-list");
    if (!container || !menu) {
      return null;
    }
    const containerBox = container.getBoundingClientRect();
    const menuBox = menu.getBoundingClientRect();
    return {
      containerRight: containerBox.right,
      menuRight: menuBox.right,
    };
  });

  expect(alignment).not.toBeNull();
  expect(Math.abs(alignment.menuRight - alignment.containerRight)).toBeLessThanOrEqual(24);
});

test("navbar search button opens modal and toggle buttons use pointer cursor", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "navbar search/theme controls are collapsed under mobile menu");

  await preparePage(page, "light");
  await page.goto("/al-folio/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  await page.evaluate(() => {
    const ninjaKeys = document.querySelector("ninja-keys");
    if (!ninjaKeys || typeof ninjaKeys.open !== "function") {
      return;
    }
    ninjaKeys.__openCalled = false;
    const originalOpen = ninjaKeys.open.bind(ninjaKeys);
    ninjaKeys.open = () => {
      ninjaKeys.__openCalled = true;
      return originalOpen();
    };
  });

  await page.click("#search-toggle");
  const modalOpened = await page.evaluate(() => Boolean(document.querySelector("ninja-keys")?.__openCalled));
  expect(modalOpened).toBeTruthy();

  const searchCursor = await page.locator("#search-toggle").evaluate((el) => window.getComputedStyle(el).cursor);
  const themeCursor = await page.locator("#light-toggle").evaluate((el) => window.getComputedStyle(el).cursor);
  expect(searchCursor).toBe("pointer");
  expect(themeCursor).toBe("pointer");
});

test("related posts are wrapped in a valid list", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/blog/2023/tables/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const heading = page.getByRole("heading", { name: "Enjoy Reading This Article?" });
  await expect(heading).toBeVisible();

  const relatedList = heading.locator("xpath=following::ul[1]");
  await expect(relatedList).toBeVisible();
  await expect(relatedList.locator("li").first()).toBeVisible();

  const relatedLinkWeight = await relatedList
    .locator("a")
    .first()
    .evaluate((el) => Number.parseInt(window.getComputedStyle(el).fontWeight, 10) || 400);
  expect(relatedLinkWeight).toBeLessThanOrEqual(400);
});

test("inline code uses compact normal-weight typography", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/blog/2023/sidebar-table-of-contents/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const inlineCodeStyle = await page.evaluate(() => {
    const candidate = Array.from(document.querySelectorAll("main code, [role='main'] code")).find((el) => !el.closest("pre"));
    if (!candidate) {
      return null;
    }
    const computed = window.getComputedStyle(candidate);
    const numericWeight = Number.parseInt(computed.fontWeight, 10);
    return {
      fontSize: Number.parseFloat(computed.fontSize),
      fontWeight: Number.isNaN(numericWeight) ? (computed.fontWeight === "bold" ? 700 : 400) : numericWeight,
    };
  });

  expect(inlineCodeStyle).not.toBeNull();
  expect(inlineCodeStyle.fontSize).toBeLessThan(16);
  expect(inlineCodeStyle.fontWeight).toBeLessThanOrEqual(400);
});

test("project cards hover with upward lift animation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "hover-specific assertion is desktop-only");

  await preparePage(page, "light");
  await page.goto("/al-folio/projects/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const card = page.locator(".projects .hoverable").first();
  await expect(card).toBeVisible();

  const before = await card.boundingBox();
  await card.hover();
  await page.waitForTimeout(150);
  const after = await card.boundingBox();

  expect(before).not.toBeNull();
  expect(after).not.toBeNull();
  expect(after.y).toBeLessThan(before.y);
});

test("teaching calendar toggle has pointer cursor and toggles calendar visibility", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/teaching/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const button = page.locator("#calendar-toggle-btn");
  await expect(button).toBeVisible();

  const buttonStyles = await button.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return { cursor: computed.cursor, fontSize: computed.fontSize };
  });
  expect(buttonStyles.cursor).toBe("pointer");
  expect(Number.parseFloat(buttonStyles.fontSize)).toBeGreaterThan(12);

  await button.click();
  await expect(page.locator("#calendar-container")).toBeVisible();
  await expect(button).toContainText("Hide Calendar");
});

test("toc sidebar renders with tocbot styling and data-toc-text label", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "TOC sidebar is hidden on mobile viewport");

  await preparePage(page, "light");
  await page.goto("/al-folio/blog/2023/sidebar-table-of-contents/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const tocSidebar = page.locator("#toc-sidebar");
  const tocLinks = tocSidebar.locator(".toc-link");
  await expect.poll(async () => tocLinks.count()).toBeGreaterThan(0);
  await expect(tocSidebar.getByText("Customizing")).toHaveCount(1);

  const firstLink = tocLinks.first();
  await firstLink.hover();
  const tocDecor = await firstLink.evaluate((el) => {
    const linkStyle = window.getComputedStyle(el);
    const listBorders = Array.from(document.querySelectorAll("#toc-sidebar .toc-list")).map((list) => window.getComputedStyle(list).borderLeftWidth);
    return {
      linkBorderLeftWidth: linkStyle.borderLeftWidth,
      listBorders,
    };
  });
  expect(tocDecor.linkBorderLeftWidth).toBe("0px");
  expect(tocDecor.listBorders.every((value) => value === "0px")).toBeTruthy();

  await page.getByRole("heading", { name: "Customizing Your Table of Contents" }).scrollIntoViewIfNeeded();
  await expect.poll(async () => tocSidebar.locator(".toc-link.is-active-link").count()).toBeGreaterThan(0);

  const activeDecor = await tocSidebar
    .locator(".toc-link.is-active-link")
    .first()
    .evaluate((el) => {
      const activeStyle = window.getComputedStyle(el);
      const activeMarkerStyle = window.getComputedStyle(el, "::before");
      return {
        activeColor: activeStyle.color,
        markerColor: activeMarkerStyle.backgroundColor,
      };
    });
  expect(activeDecor.markerColor).toBe(activeDecor.activeColor);
});

test("tailwind table engine provides search, pagination, and sorting in pretty tables", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/blog/2023/tables/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const interactiveTable = page.locator('table[data-search="true"]');
  await expect(interactiveTable).toBeVisible();
  await expect(interactiveTable).toHaveClass(/af-table-enhanced/);

  const searchInput = page.locator(".af-table-search").first();
  await expect(searchInput).toBeVisible();
  await searchInput.fill("Item 19");
  await expect(interactiveTable.locator("tbody tr")).toHaveCount(1);

  await searchInput.fill("");
  const sortableHeader = interactiveTable.locator('thead th[data-field="id"]');
  await sortableHeader.click();
  await sortableHeader.click();
  await expect(interactiveTable.locator("tbody tr").first().locator("td").nth(1)).toHaveText("20");
});

test("lightbox galleries open in-page modal instead of navigating away", async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/blog/2024/photo-gallery/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const firstLightboxLink = page.locator("a[data-lightbox]").first();
  const firstHref = await firstLightboxLink.getAttribute("href");
  await firstLightboxLink.click();

  const overlay = page.locator(".al-lightbox-overlay");
  await expect(overlay).toHaveClass(/is-open/);
  await expect(page.locator(".al-lightbox-image")).toHaveAttribute("src", firstHref);

  const firstImageSrc = await page.locator(".al-lightbox-image").getAttribute("src");
  await page.locator(".al-lightbox-next").click();
  await expect(page.locator(".al-lightbox-image")).not.toHaveAttribute("src", firstImageSrc);

  await page.keyboard.press("Escape");
  await expect(overlay).not.toHaveClass(/is-open/);
});

test("core pages no longer emit jQuery-style runtime errors", async ({ page }) => {
  const failures = [];
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      failures.push(message.text());
    }
  });

  await preparePage(page, "light");
  const pages = ["/al-folio/", "/al-folio/projects/", "/al-folio/blog/2024/photo-gallery/", "/al-folio/blog/2023/tables/"];

  for (const target of pages) {
    await page.goto(target, { waitUntil: "networkidle" });
    await stabilizeVisuals(page);
  }

  const jqueryFailures = failures.filter((message) => /\$\s*is not defined|lightbox/i.test(message));
  expect(jqueryFailures).toEqual([]);
});



test("CV sections collapse independently while the paper preview retains their entries", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });

  const sections = page.locator("#cv-sections > .cv-section");
  const disclosures = page.locator("#cv-sections > .cv-section > details.cv-details");
  const sectionCount = await sections.count();
  expect(sectionCount).toBeGreaterThan(8);
  await expect(disclosures).toHaveCount(sectionCount);

  const education = page.locator('#cv-sections [data-cv-section="education"]');
  await expect(education.locator(".cv-date")).toHaveText([
    "Aug 2023 — Dec 2026 (expected)",
    "Aug 2021 — Dec 2026 (expected)",
  ]);
  const details = education.locator("details.cv-details");
  await expect(details).toHaveAttribute("open", "");
  await details.locator("summary").click();
  await expect(details).not.toHaveAttribute("open", "");
  await expect(education.locator(".cv-entry").first()).toBeHidden();

  // A disclosure only changes the reading view: printing must retain its records.
  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-preview").click();
  await expect(page.locator("#cv-paged-preview")).toContainText("Dec 2026 (expected)");
  await expect(page.locator("#cv-paged-preview")).toContainText("Data Science");
  await page.locator("#cv-preview").click();
  await expect(details).not.toHaveAttribute("open", "");
});

test("CV section order can be changed, survives reload, and resets to source order", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  const sections = page.locator("#cv-sections > .cv-section");
  const originalIds = await sections.evaluateAll((nodes) => nodes.map((node) => node.dataset.cvSection));
  expect(originalIds.length).toBeGreaterThan(8);

  await page.locator("#cv-panel-toggle").click();
  await page.locator(".cv-section-picker > summary").click();
  const second = originalIds[1];
  await page.locator(`[data-cv-order-item="${second}"] [data-cv-move="up"]`).click();
  await expect(sections.first()).toHaveAttribute("data-cv-section", second);
  await expect(page.locator("#cv-section-order-list > .cv-section-order-item").first())
    .toHaveAttribute("data-cv-order-item", second);

  await page.reload({ waitUntil: "networkidle" });
  await expect(sections.first()).toHaveAttribute("data-cv-section", second);
  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-reset").click();
  await expect(sections.first()).toHaveAttribute("data-cv-section", originalIds[0]);
  expect(await page.evaluate(() => localStorage.getItem("cv-section-order-v1"))).toBeNull();
});

test("CV Wiley JFM submission and Papers page expose both PDFs and their first-page previews", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  const cvJfm = page.locator('#cv-sections [data-cv-section="research"] [data-cv-record]').filter({
    hasText: "When Does Posterior Integration Change Option Values?",
  });
  await expect(cvJfm).toHaveCount(1);
  await expect(cvJfm).toContainText("Wiley · The Journal of Futures Markets · Submitted");
  await expect(cvJfm.locator(".cv-org-logo")).toHaveAttribute("src", /wiley\.com/);
  await expect(cvJfm.locator(".cv-links a")).toHaveCount(3);

  await page.goto("/al-folio/papers/", { waitUntil: "networkidle" });
  const url = "/al-folio/papers/posterior-integration-volatility-wti-asian-options.html";
  await expect(page.locator('#submitted-manuscripts a[href="' + url + '"]')).not.toHaveCount(0);
  await expect(page.locator('#working-drafts a[href="' + url + '"]')).toHaveCount(0);
  await expect(page.locator("#submitted-manuscripts .portfolio-card-image img")
    .filter({ visible: true }).last()).toHaveAttribute("loading", "lazy");

  await page.goto(url, { waitUntil: "networkidle" });
  const detail = page.locator(".portfolio-detail");
  await expect(detail.locator("h1")).toContainText("When Does Posterior Integration Change Option Values?");
  await expect(detail.locator(".portfolio-detail-preview"))
    .toHaveAttribute("src", /jfm-posterior-integration-first-page\.webp/);
  await expect(detail.locator('a.portfolio-button[href$="when-does-posterior-integration-change-option-values.pdf"]'))
    .toBeVisible();
  await expect(detail.locator('a.portfolio-button[href$="when-does-posterior-integration-change-option-values-supplement.pdf"]'))
    .toBeVisible();
  const supplement = detail.locator(".portfolio-supplement-first-page img");
  await expect(supplement).toBeVisible();
  await expect(supplement).toHaveAttribute("src", /jfm-posterior-integration-supplement-first-page\.webp/);
  const sourceImagesLoaded = await detail.locator(".portfolio-detail-preview, .portfolio-supplement-first-page img")
    .evaluateAll((images) => images.every((img) => img.complete && img.naturalWidth > 0));
  expect(sourceImagesLoaded).toBeTruthy();
});

test("CV Harvard paper preview preserves the organization/role and city/date corners", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  await expect(page.locator("#cv-print")).toBeHidden();
  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-template").selectOption("harvard");
  await page.locator("#cv-preview").click();
  await expect(page.locator("#cv-page")).toHaveAttribute("data-cv-preview", "paper");
  await expect(page.locator(".cv-preview-page").first()).toBeVisible();

  const measurement = await page.locator(".cv-preview-paper-body .cv-entry-heading").first().evaluate((heading) => {
    const entry = heading.closest("[data-cv-record]");
    const organization = heading.querySelector(".cv-organization")?.getBoundingClientRect();
    const role = heading.querySelector("h3")?.getBoundingClientRect();
    const location = heading.querySelector(".cv-location")?.getBoundingClientRect();
    const date = heading.querySelector(".cv-date")?.getBoundingClientRect();
    const sheet = heading.closest(".cv-preview-sheet");
    return {
      display: getComputedStyle(heading).display,
      paperWidth: sheet.getBoundingClientRect().width,
      leftOrder: organization && role ? organization.y <= role.y : null,
      rightOrder: location && date ? location.y <= date.y : null,
      rightOfTitle: location && role ? location.x > role.x : null,
      entryFits: entry.scrollWidth <= entry.clientWidth + 3,
    };
  });
  expect(measurement.display).toBe("grid");
  expect(measurement.paperWidth).toBeGreaterThan(700);
  expect(measurement.leftOrder).toBeTruthy();
  expect(measurement.rightOrder).toBeTruthy();
  expect(measurement.rightOfTitle).toBeTruthy();
  expect(measurement.entryFits).toBeTruthy();
});

test("CV Europass uses EU section sequence and truthful language layout", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-template").selectOption("europass");

  const sections = await page.locator("#cv-sections > [data-cv-section]").evaluateAll((nodes) =>
    nodes.map((node) => node.dataset.cvTitle));
  expect(sections.indexOf("Professional Experience")).toBeLessThan(sections.indexOf("Education"));
  expect(sections.indexOf("Education")).toBeLessThan(sections.indexOf("Languages"));
  expect(sections.indexOf("Languages")).toBeLessThan(sections.indexOf("Research"));
  await expect(page.locator("#cv-sections .cv-europass-language-table")).toBeVisible();
  await expect(page.locator("#cv-sections .cv-europass-mother-tongue")).toContainText("Spanish");

  const entryLayout = await page.locator("#cv-sections .cv-entry").first().evaluate((entry) => {
    const heading = entry.querySelector(".cv-entry-heading");
    const meta = entry.querySelector(".cv-meta")?.getBoundingClientRect();
    const title = entry.querySelector("h3")?.getBoundingClientRect();
    return {
      display: getComputedStyle(entry).display,
      heading: getComputedStyle(heading).display,
      dateLeft: meta && title ? meta.x < title.x : null,
    };
  });
  expect(entryLayout.display).toBe("grid");
  expect(entryLayout.heading).toBe("contents");
  expect(entryLayout.dateLeft).toBeTruthy();

  await page.locator("#cv-preview").click();
  await expect(page.locator(".cv-preview-paper-body .cv-europass-language-table").first()).toBeVisible();
  const previewLayout = await page.locator(".cv-preview-paper-body .cv-entry").first().evaluate((entry) => ({
    display: getComputedStyle(entry).display,
    dateLeft: entry.querySelector(".cv-meta").getBoundingClientRect().x <
      entry.querySelector("h3").getBoundingClientRect().x,
  }));
  expect(previewLayout.display).toBe("grid");
  expect(previewLayout.dateLeft).toBeTruthy();
});

test("CV name-first header and Display print action retain searchable text and rasterize only graphics", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  await expect(page.locator("#cv-document .cv-eyebrow")).toHaveCount(0);
  const name = page.locator("#cv-document .cv-intro h1.post-title");
  await expect(name).toBeVisible();
  const typography = await name.evaluate((element) => {
    const style = getComputedStyle(element);
    return { size: parseFloat(style.fontSize), weight: Number(style.fontWeight) };
  });
  expect(typography.size).toBeGreaterThanOrEqual(36);
  expect(typography.weight).toBeGreaterThanOrEqual(800);

  // No second floating button: the print control lives inside Display.
  await expect(page.locator("#cv-print")).toBeHidden();
  await page.locator("#cv-panel-toggle").click();
  const printButton = page.locator("#cv-settings-panel #cv-print");
  await expect(printButton).toBeVisible();
  const panel = page.locator("#cv-settings-panel");
  const initialPosition = await printButton.evaluate((button) => {
    const parent = button.closest("#cv-settings-panel");
    return button.getBoundingClientRect().top - parent.getBoundingClientRect().top;
  });
  expect(initialPosition).toBeGreaterThanOrEqual(0);
  expect(initialPosition).toBeLessThan(175);
  await panel.evaluate((element) => { element.scrollTop = element.scrollHeight; });
  const stickyPosition = await printButton.evaluate((button) => {
    const outer = button.closest("#cv-settings-panel").getBoundingClientRect();
    const rect = button.getBoundingClientRect();
    return { top: rect.top - outer.top, bottom: rect.bottom - outer.top, height: outer.height };
  });
  expect(stickyPosition.top).toBeGreaterThanOrEqual(0);
  expect(stickyPosition.bottom).toBeLessThan(stickyPosition.height);
  await panel.evaluate((element) => { element.scrollTop = 0; });

  // The test stubs the native browser print dialog, without suppressing
  // synchronous graphic rasterization on the real button click.
  await page.evaluate(() => {
    window.__cvPrintInvocations = 0;
    window.print = () => { window.__cvPrintInvocations += 1; };
  });
  const svg = page.locator('#cv-document img.cv-org-logo[src*="proximitygraphs.svg"]').first();
  await expect(svg).toHaveCount(1);
  await svg.evaluate((image) => image.decode());
  const initialSrc = await svg.getAttribute("src");

  await printButton.click();
  const called = await page.evaluate(() => window.__cvPrintInvocations);
  expect(called).toBe(1);
  // Printing must use the fully populated pages, not the full-width source.
  // Source text and source logos remain untouched for editing after print.
  await expect(page.locator("#cv-page")).toHaveAttribute("data-cv-printing", "true");
  await expect(page.locator("#cv-paged-preview .cv-preview-page")).not.toHaveCount(0);
  await expect(svg).toHaveAttribute("src", initialSrc);
  const printBitmap = page.locator("#cv-paged-preview canvas.cv-org-logo").first();
  if (await printBitmap.count()) {
    const pixels = await printBitmap.evaluate((canvas) => [canvas.width, canvas.height]);
    expect(Math.min(...pixels)).toBeGreaterThan(0);
    expect(Math.max(...pixels)).toBeLessThanOrEqual(960);
  }

  // The normal wide view and original source artwork return after printing.
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
  await expect(svg).toHaveAttribute("src", initialSrc);
  await expect(page.locator("#cv-page")).toHaveAttribute("data-cv-printing", "false");
  await expect(page.locator("#cv-paged-preview .cv-preview-page")).toHaveCount(0);
  await expect(name).toBeVisible();
});

test("CV embeds descriptions for every course in both reading and A4 paper preview", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  const credentials = page.locator('#cv-document [data-cv-section="credentials"]');
  await expect(credentials).toContainText("Narrative Economics");
  await expect(credentials).toContainText("Economic narratives: examined their diffusion");
  await expect(credentials).toContainText("Git workflows: used branches");
  await expect(credentials.locator(".cv-highlights li")).toHaveCount(23);

  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-preview").click();
  await expect(page.locator("#cv-paged-preview")).toContainText("Economic narratives: examined their diffusion");
  await expect(page.locator("#cv-paged-preview")).toContainText("Git workflows: used branches");
  await expect(page.locator("#cv-paged-preview .cv-eyebrow")).toHaveCount(0);
});

test("CV skill bullets occupy exactly one complete line in print and paper preview", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  await page.locator("#cv-panel-toggle").click();

  // Screen preview stays at the device viewport. Browser print is evaluated
  // at physical sheet width (96 CSS px/in), not at an iPhone screen width.
  const screenViewport = page.viewportSize();
  for (const [template, paper] of [["personal", "a4"], ["harvard", "letter"], ["europass", "a4"]]) {
    await page.locator("#cv-template").selectOption(template);
    await page.locator("#cv-paper").selectOption(paper);
    await page.locator("#cv-preview").click();
    await expect(page.locator("#cv-page")).toHaveAttribute("data-cv-preview", "paper");

    const preview = await page.locator(".cv-preview-paper-body .cv-highlights li").evaluateAll((nodes) => {
      const visible = nodes.filter((node) => node.getClientRects().length > 0);
      return {
        total: visible.length,
        bad: visible.filter((node) =>
          getComputedStyle(node).whiteSpace !== "nowrap" ||
          node.scrollWidth > node.clientWidth + 1
        ).map((node) => node.textContent.trim()).slice(0, 10),
      };
    });
    expect(preview.total).toBeGreaterThan(0);
    expect(preview.bad, `${template}/${paper} paper preview overflows`).toEqual([]);
    await page.locator("#cv-preview").click();

    // Chromium's emulateMedia('print') does NOT resize the page as the real
    // print/PDF compositor does. Simulate A4/Letter width for an honest
    // print-geometry check, also when this test runs on the mobile project.
    await page.setViewportSize({ width: paper === "a4" ? 718 : 740, height: 1123 });
    // Enter print media first: Chromium's media emulation may fire
    // afterprint, clearing preview pages prepared before the switch.
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    await expect(page.locator("#cv-document")).toBeHidden();
    await expect(page.locator("#cv-paged-preview")).toBeVisible();
    await expect(page.locator("#cv-paged-preview .cv-preview-page").first()).toBeVisible();
    const printed = await page.locator("#cv-paged-preview .cv-highlights li").evaluateAll((nodes) => {
      const visible = nodes.filter((node) => node.getClientRects().length > 0);
      return {
        total: visible.length,
        bad: visible.filter((node) =>
          getComputedStyle(node).whiteSpace !== "nowrap" ||
          node.scrollWidth > node.clientWidth + 1
        ).map((node) => node.textContent.trim()).slice(0, 10),
      };
    });
    expect(printed.total).toBeGreaterThan(0);
    expect(printed.bad, `${template}/${paper} browser print overflows`).toEqual([]);
    await page.emulateMedia({ media: "screen" });
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    await page.setViewportSize(screenViewport);
  }
});


test("CV emphasizes full unique labels, never repetitive software tokens", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  const source = page.locator("#cv-document");
  const labels = await source.locator(".cv-highlights .cv-keyword").allTextContents();
  expect(labels).toContain("Stochastic geometry:");
  expect(labels).not.toContain("Stochastic:");
  expect(labels.filter((label) => label === "PyTorch:")).toHaveLength(1);
  expect(new Set(labels.map((label) => label.toLowerCase())).size).toBe(labels.length);
  await expect(source.locator(".cv-skills .cv-keyword")).toHaveCount(0);
  await expect(source.getByText("First Author · Published Technical Article", { exact: false })).toHaveCount(1);
  await expect(source.getByText("Technical writing: coauthored an AbaQuant article", { exact: false })).toHaveCount(0);

  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-preview").click();
  const preview = page.locator("#cv-paged-preview");
  await expect(preview.locator(".cv-keyword", { hasText: "Stochastic geometry:" }).first()).toBeAttached();
  await expect(preview.locator(".cv-keyword", { hasText: "PyTorch:" })).toHaveCount(1);
});

test("CV native Print uses A4 and Letter paper preview pages instead of the wide source", async ({ page }, testInfo) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  await page.locator("#cv-panel-toggle").click();
  for (const [paper, template] of [["a4", "personal"], ["letter", "harvard"]]) {
    await page.locator("#cv-paper").selectOption(paper);
    await page.locator("#cv-template").selectOption(template);
    // Print while still in the full-width reading mode. No preview toggle.
    await expect(page.locator("#cv-page")).toHaveAttribute("data-cv-preview", "reading");
    // Enter print media first: Chromium's media emulation may fire
    // afterprint, clearing preview pages prepared before the switch.
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    const geometry = await page.locator("#cv-page").evaluate((root) => {
      const source = root.querySelector("#cv-document");
      const pages = [...root.querySelectorAll("#cv-paged-preview .cv-preview-page")];
      const preview = root.querySelector("#cv-paged-preview");
      return {
        printing: root.dataset.cvPrinting,
        sourceDisplay: getComputedStyle(source).display,
        previewDisplay: getComputedStyle(preview).display,
        pages: pages.length,
        allSections: pages.map((el) => el.textContent).join(" ").toLowerCase().includes("programming experience"),
        noPageLabels: pages.every((el) =>
          getComputedStyle(el.querySelector(".cv-preview-page-number")).display === "none"),
        sized: pages.every((el) => el.querySelector(".cv-preview-paper-body") !== null),
      };
    });
    expect(geometry.printing).toBe("true");
    expect(geometry.sourceDisplay).toBe("none");
    expect(geometry.previewDisplay).not.toBe("none");
    expect(geometry.pages).toBeGreaterThan(1);
    expect(geometry.noPageLabels).toBe(true);
    expect(geometry.sized).toBe(true);
    expect(geometry.allSections).toBe(true);

    if (testInfo.project.name === "desktop") {
      const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
      expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
      expect(pdf.byteLength).toBeGreaterThan(1000);
    }
    await page.emulateMedia({ media: "screen" });
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    await expect(page.locator("#cv-page")).toHaveAttribute("data-cv-printing", "false");
    await expect(page.locator("#cv-paged-preview .cv-preview-page")).toHaveCount(0);
  }
});

test("CV print balances top and bottom whitespace only for one-page selections", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-print-options > summary").click();
  await page.locator("#cv-entry-picker > summary").click();
  await page.locator("#cv-entries-none").click();
  await page.locator("#cv-entry-options input[type=checkbox]").first().check();

  // The default reading view must compute a print balance without displaying
  // the offscreen measuring sheets or changing the reading density.
  await expect(page.locator("#cv-page")).toHaveAttribute("data-cv-preview", "reading");
  for (const [size, paper] of [["small", "a4"], ["large", "letter"]]) {
    await page.locator("#cv-text-size").selectOption(size);
    await page.locator("#cv-paper").selectOption(paper);
    const reading = await page.locator("#cv-page").evaluate((root) => ({
      single: root.dataset.cvSinglePage,
      offset: parseFloat(root.style.getPropertyValue("--cv-print-top-balance")),
      density: root.dataset.cvDensity,
      previewHidden: document.querySelector("#cv-paged-preview").hidden,
    }));
    expect(reading.single).toBe("true");
    expect(reading.offset).toBeGreaterThan(0);
    expect(reading.density).toBe("balanced");
    expect(reading.previewHidden).toBe(true);

    await page.locator("#cv-preview").click();
    const balanced = await page.locator(".cv-preview-paper-body").first().evaluate((body) => {
      const box = body.getBoundingClientRect();
      const intro = body.querySelector(".cv-intro").getBoundingClientRect();
      const content = body.querySelector(".cv-content").getBoundingClientRect();
      return { top: intro.top - box.top, bottom: box.bottom - content.bottom, used: body.scrollHeight };
    });
    expect(Math.abs(balanced.top - balanced.bottom)).toBeLessThan(14);
    // Enter print media first: Chromium's media emulation may fire
    // afterprint, clearing preview pages prepared before the switch.
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    // Printed page keeps the same balanced top padding as its paper preview.
    const printPadding = await page.locator("#cv-paged-preview .cv-preview-paper-body").first()
      .evaluate((node) => parseFloat(getComputedStyle(node).paddingTop));
    expect(printPadding).toBeGreaterThan(0);
    await expect(page.locator("#cv-document")).toBeHidden();
    await page.emulateMedia({ media: "screen" });
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    await page.locator("#cv-preview").click();
  }

  // A full CV requires multiple pages and must not receive added top padding
  // or alter the user's equal physical @page margins.
  await page.locator("#cv-entries-all").click();
  await expect(page.locator("#cv-page")).toHaveAttribute("data-cv-single-page", "false");
  const full = await page.locator("#cv-page").evaluate((root) => ({
    offset: parseFloat(root.style.getPropertyValue("--cv-print-top-balance")),
    margin: root.style.getPropertyValue("--cv-print-margin").trim(),
  }));
  expect(full.offset).toBe(0);
  expect(full.margin).toBe("10mm");
});
