const { test, expect } = require("@playwright/test");
const { preparePage, stabilizeVisuals } = require("./helpers");

test("CV research profile connects mathematics, models and communication in print", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  const header = page.locator("#cv-document .cv-intro");
  const profile = header.locator(".cv-research-profile");
  const expectedFragments = [
    "formulating research questions",
    "mathematical theory",
    "computational implementation",
    "statistical and optimization models",
    "reproducible experiments",
    "informed decisions",
    "scientific writing, visualization, and presentations",
  ];
  await expect(profile).toHaveCount(1);
  for (const fragment of expectedFragments) await expect(profile).toContainText(fragment);
  expect(await profile.evaluate((node) => getComputedStyle(node).color))
    .toBe(await header.evaluate((node) => getComputedStyle(node).color));
  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-preview").click();
  const preview = page.locator("#cv-paged-preview .cv-intro .cv-research-profile");
  await expect(preview).toHaveCount(1);
  await expect(preview).toContainText("informed decisions");

  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
  const printed = page.locator("#cv-paged-preview .cv-intro .cv-research-profile");
  await expect(printed).toHaveCount(1);
  await expect(printed).toContainText("scientific writing, visualization, and presentations");
  await expect(page.locator("#cv-document")).toBeHidden();
  await page.emulateMedia({ media: "screen" });
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
});

test("CV introductory description supports multiline edits, reload, print and reset", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });

  const profile = page.locator("#cv-document .cv-research-profile");
  const published = await profile.textContent();
  await expect(profile).toContainText("formulating research questions");
  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-profile-editor > summary").click();
  const input = page.locator("#cv-profile-text");
  await expect(input).toHaveValue(published);

  // Arbitrary multiline copy is literal text, not markup.
  const custom = "I study stochastic geometry and mathematical models.\n\nI implement algorithms and present results.";
  await input.fill(custom);
  await expect(profile).toHaveText(custom);
  await expect.poll(async () => profile.evaluate((node) => getComputedStyle(node).whiteSpace))
    .toBe("pre-wrap");
  expect(await page.evaluate(() => localStorage.getItem("cv-profile-text-v1"))).toBe(custom);

  await page.locator("#cv-preview").click();
  const paper = page.locator("#cv-paged-preview .cv-intro .cv-research-profile");
  await expect(paper).toHaveCount(1);
  await expect(paper).toHaveText(custom);

  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
  await expect(page.locator("#cv-document")).toBeHidden();
  await expect(page.locator("#cv-paged-preview .cv-intro .cv-research-profile")).toHaveText(custom);
  await page.emulateMedia({ media: "screen" });
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));

  await page.reload({ waitUntil: "networkidle" });
  await expect(profile).toHaveText(custom);
  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-profile-editor > summary").click();
  await expect(input).toHaveValue(custom);

  // Untrusted input cannot create elements or execute event handlers.
  const html = "<img src=x onerror=alert(1)>\n<i>plain text</i>";
  await input.fill(html);
  await expect(profile).toHaveText(html);
  await expect(profile.locator("img, i")).toHaveCount(0);

  // A blank override intentionally hides the description until reset.
  await input.fill("");
  await expect(profile).toHaveText("");
  expect(await page.evaluate(() => localStorage.getItem("cv-profile-text-v1"))).toBe("");

  await page.locator("#cv-reset").click();
  await expect(input).toHaveValue(published);
  await expect(profile).toHaveText(published);
  expect(await page.evaluate(() => localStorage.getItem("cv-profile-text-v1"))).toBeNull();
});

test("CV uses the same eight concise research bullets in reading, paper and print", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  const professional = page.locator('#cv-document [data-cv-section="professional-experience"]');
  const experiences = professional.locator("[data-cv-record]");
  await expect(experiences).toHaveCount(5);
  const independent = experiences.first();
  await expect(independent).toContainText("Independent Researcher");
  await expect(independent).toContainText("Scientific Software Developer");
  const expected = [
    "Areas: Stochastic/computational geometry, ML interpretability, quant finance.",
    "Publication: Elsevier Computational Geometry; three other journal submissions.",
    "Ongoing: TrendEstimation (penalized least squares) and Max-Cut/Max-k-Cut SDP.",
    "Software: Built AbaQuant; co-maintained ProximityGraphs and SDP workflows.",
    "Tooling: Docling Math (PDF processing) and AwesomeFigures (visualization).",
    "Writing: La Catarina publication and interactive ProximityGraphs author draft.",
    "Reproducibility: Python, Git, tests, CI; selected PyPI and Zenodo DOI releases.",
    "Coordination: Convened meetings, reports, presentations, progress and feedback.",
  ];
  const researchBullets = independent.locator(".cv-highlights li");
  await expect(researchBullets).toHaveText(expected);
  await expect(independent.locator(".cv-highlight-detailed, .cv-highlight-condensed")).toHaveCount(0);
  await expect(independent.locator(".cv-organization")).toHaveCount(0);
  await expect(independent.locator('.cv-links a[href="https://heri-espino.github.io/papers/"]')).toHaveCount(1);
  await expect(independent.locator('.cv-links a[href="https://github.com/heri-espino"]')).toHaveCount(1);
  const softwareRecords = page.locator('#cv-document [data-cv-section="programming-experience"] [data-cv-record]');
  for (const name of ["AbaQuant", "ProximityGraphs", "Trend Estimation", "AwesomeFigures", "Docling Math"]) {
    await expect(softwareRecords.filter({ hasText: name }).first()).toHaveCount(1);
  }
  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-preview").click();
  const paper = page.locator("#cv-paged-preview");
  const paperEntry = paper.locator("[data-cv-record]").filter({ hasText: "Independent Researcher" }).first();
  await expect(paperEntry.locator(".cv-highlights li")).toHaveText(expected);
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
  await expect(page.locator("#cv-document")).toBeHidden();
  const printEntry = paper.locator("[data-cv-record]").filter({ hasText: "Independent Researcher" }).first();
  await expect(printEntry.locator(".cv-highlights li")).toHaveText(expected);
  await page.emulateMedia({ media: "screen" });
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
});

test("Papers separates unsubmitted research notes from internal research studies", async ({ page }) => {
  await page.goto("/al-folio/papers/", { waitUntil: "networkidle" });
  const ids = ["submitted-manuscripts", "published-technical-articles", "working-drafts", "internal-research-papers"];
  const sections = page.locator(".papers-archive > section[data-portfolio-section]");
  await expect(sections).toHaveCount(4);
  expect(await sections.evaluateAll((nodes) => nodes.map((n) => n.id))).toEqual(ids);
  const drafts = page.locator("#working-drafts");
  const internal = page.locator("#internal-research-papers");
  await expect(drafts.locator(".portfolio-card")).toHaveCount(4);
  await expect(internal.locator(".portfolio-card")).toHaveCount(4);
  for (const href of [
    "/al-folio/papers/handwritten-trend-estimation-notes.html",
    "/al-folio/notes/random-variables-as-vectors.html",
    "/al-folio/papers/componentwise-knn-isomap-lecture.html",
    "/al-folio/papers/maxcut-sdp-eva-clustering-tutorial.html",
  ]) {
    await expect(drafts.locator(`a[href="${href}"]`).first()).toHaveCount(1);
    await expect(internal.locator(`a[href="${href}"]`)).toHaveCount(0);
  }
  for (const href of [
    "/al-folio/papers/academic-support-persistence-incentive.html",
    "/al-folio/papers/mathematics-support-classroom-performance.html",
    "/al-folio/papers/course-grades-comparability.html",
    "/al-folio/papers/student-engagement-adaptation.html",
  ]) {
    await expect(internal.locator(`a[href="${href}"]`).first()).toHaveCount(1);
    await expect(drafts.locator(`a[href="${href}"]`)).toHaveCount(0);
  }
  await expect(page.locator("#submitted-manuscripts .portfolio-card")).toHaveCount(3);
  await expect(page.locator("#published-technical-articles .portfolio-card")).toHaveCount(3);
});

test("Elsevier Stepping-Stone journal publication has correct DOI and appears only in published works", async ({ page }) => {
  const doi = "10.1016/j.comgeo.2026.102287";
  const doiUrl = "https://doi.org/" + doi;
  const journalUrl = "https://www.sciencedirect.com/science/article/pii/S0925772126000453";
  await page.goto("/al-folio/papers/", { waitUntil: "networkidle" });
  const submitted = page.locator("#submitted-manuscripts");
  const published = page.locator("#published-technical-articles");
  const journalCard = published.locator(".portfolio-card").filter({
    hasText: "Geometry and Volume of Stepping-Stone Diversion Neighborhoods",
  });
  await expect(journalCard).toHaveCount(1);
  await expect(journalCard).toContainText("Published");
  await expect(journalCard).toContainText("Peer-reviewed journal article");
  await expect(submitted).not.toContainText("Stepping-Stone Diversion Neighborhoods");
  await journalCard.locator("h3 a").click();
  await expect(page).toHaveURL(/\\/papers\\/stepping-stone\\.html$/);
  await expect(page.locator(".portfolio-detail")).toContainText(doi);
  await expect(page.locator('.portfolio-actions a[href="' + journalUrl + '"]')).toHaveCount(1);
  await expect(page.locator('.portfolio-actions a[href="' + doiUrl + '"]')).toHaveCount(1);
  await expect(page.locator(".portfolio-detail")).toContainText("Héctor Maravillo");

  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  const source = page.locator('#cv-document [data-cv-section="published-articles-technical-writing"]');
  const cvJournal = source.locator("[data-cv-record]").filter({
    hasText: "Stepping–Stone diversion neighborhoods",
  });
  await expect(cvJournal).toHaveCount(1);
  await expect(cvJournal).toContainText("Published");
  await expect(cvJournal).toContainText(doi);
  await expect(cvJournal.locator('.cv-links a[href="' + journalUrl + '"]')).toHaveCount(1);
  await expect(cvJournal.locator('.cv-links a[href="' + doiUrl + '"]')).toHaveCount(1);
  await expect(page.locator('#cv-document [data-cv-section="submitted-manuscripts"]'))
    .not.toContainText("Stepping–Stone diversion neighborhoods");
  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-preview").click();
  await expect(page.locator("#cv-paged-preview")).toContainText(doi);
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
  await expect(page.locator("#cv-paged-preview")).toContainText(doi);
  await page.emulateMedia({ media: "screen" });
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
});

test("Papers and CV list the ProximityGraphs author-hosted feature with the AbaQuant article", async ({ page }) => {
  await page.goto("/al-folio/papers/", { waitUntil: "networkidle" });
  const technical = page.locator("#published-technical-articles");
  await expect(technical.locator(".portfolio-card")).toHaveCount(3);
  const feature = technical.locator(".portfolio-card").filter({ hasText: "The Empty Space That Makes a Network" });
  const aba = technical.locator(".portfolio-card").filter({ hasText: "AbaQuant" });
  await expect(feature).toHaveCount(1);
  await expect(aba).toHaveCount(1);
  await expect(feature).toContainText("Author-hosted preview");
  await expect(feature.locator(".portfolio-card-image img"))
    .toHaveAttribute("src", new RegExp("proximitygraphs-empty-space-compare.svg"));
  await feature.locator("h3 a").click();
  await expect(page).toHaveURL((url) => url.pathname.endsWith("/articles/the-empty-space-that-makes-a-network.html"));
  await expect(page.locator(".portfolio-detail")).toContainText("Héctor Maravillo");
  await expect(page.locator(".portfolio-detail")).toContainText("has not been submitted");
  await expect(page.locator('.portfolio-actions a[href="https://heri-espino.github.io/proximitygraphs-siam-figures/article.html"]')).toHaveCount(1);

  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  const section = page.locator('#cv-document [data-cv-section="published-articles-technical-writing"]');
  await expect(section.locator("[data-cv-record]")).toHaveCount(3);
  const item = section.locator("[data-cv-record]").filter({ hasText: "The Empty Space That Makes a Network" });
  await expect(item).toContainText("First Author · Interactive Technical Feature");
  await expect(item).not.toContainText("Coauthored with Héctor Maravillo");
  // The title is intentionally clickable too; count just the explicit resource link.
  await expect(item.locator('.cv-links a[href="https://heri-espino.github.io/proximitygraphs-siam-figures/article.html"]')).toHaveCount(1);
  await expect(section).not.toContainText("Published by SIAM News");

  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-preview").click();
  const paperItem = page.locator("#cv-paged-preview [data-cv-record]")
    .filter({ hasText: "The Empty Space That Makes a Network" });
  await expect(paperItem).toHaveCount(1);
  await expect(paperItem.locator('.cv-links a[href="https://heri-espino.github.io/proximitygraphs-siam-figures/article.html"]')).toHaveCount(1);
});

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

test("CV Linear Algebra assistant lists Beamer course decks, topics and feedback in paper and print", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  const expected = [
    "Slides: authored full-course LaTeX Beamer decks on systems of linear equations.",
    "Topics: vector spaces, linear transformations, eigenvalues, and complex numbers.",
    "Teaching: presented the slides, incorporated feedback, and revised materials.",
  ];
  const assistant = page.locator('#cv-document [data-cv-section="professional-experience"] [data-cv-record]')
    .filter({ hasText: "Linear Algebra Course" });
  await expect(assistant).toHaveCount(1);
  await expect(assistant.locator(".cv-highlights li")).toHaveText(expected);
  await expect(assistant).not.toContainText("translated existing LaTeX slides");

  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-preview").click();
  const paperAssistant = page.locator("#cv-paged-preview [data-cv-record]")
    .filter({ hasText: "Linear Algebra Course" });
  await expect(paperAssistant).toHaveCount(1);
  await expect(paperAssistant.locator(".cv-highlights li")).toHaveText(expected);

  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
  await expect(page.locator("#cv-document")).toBeHidden();
  await expect(page.locator("#cv-paged-preview [data-cv-record]")
    .filter({ hasText: "Linear Algebra Course" }).locator(".cv-highlights li"))
    .toHaveText(expected);
  await page.emulateMedia({ media: "screen" });
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
});

test("CV start and graduation dates can be independently edited, printed, remembered and reset", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-graduation-editor > summary").click();

  const dataScienceStart = page.locator("#cv-graduation-start-data-science");
  const actuarialStart = page.locator("#cv-graduation-start-actuarial-science");
  const dataScienceEnd = page.locator("#cv-graduation-data-science");
  const actuarialEnd = page.locator("#cv-graduation-actuarial-science");
  await expect(dataScienceStart).toHaveValue("Aug 2023");
  await expect(actuarialStart).toHaveValue("Aug 2021");
  await expect(dataScienceEnd).toHaveValue("Dec 2026 (expected)");
  await expect(actuarialEnd).toHaveValue("Dec 2026 (expected)");
  await expect(page.locator(".cv-graduation-degree")).toHaveCount(2);

  // Both dates are arbitrary literal text rather than normalized date widgets.
  await dataScienceStart.fill("Sep 2022");
  await actuarialStart.fill("Feb 2021");
  await dataScienceEnd.fill("Jun 2027 (expected)");
  await actuarialEnd.fill("December 2027 — coursework complete");
  const education = page.locator('#cv-document [data-cv-section="education"]');
  await expect(education.locator(".cv-date")).toHaveText([
    "Sep 2022 — Jun 2027 (expected)",
    "Feb 2021 — December 2027 — coursework complete",
  ]);
  // Changes are presentation-only: original data-cv-date is retained for sorting.
  await expect(education.locator("[data-cv-graduation-key]").first())
    .toHaveAttribute("data-cv-date", "Aug 2023 — Dec 2026 (expected)");

  await page.locator("#cv-preview").click();
  const paper = page.locator("#cv-paged-preview");
  await expect(paper).toContainText("Sep 2022 — Jun 2027 (expected)");
  await expect(paper).toContainText("Feb 2021 — December 2027 — coursework complete");

  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
  await expect(page.locator("#cv-document")).toBeHidden();
  await expect(paper).toContainText("Sep 2022 — Jun 2027 (expected)");
  await expect(paper).toContainText("Feb 2021 — December 2027 — coursework complete");
  await page.emulateMedia({ media: "screen" });
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));

  await page.reload({ waitUntil: "networkidle" });
  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-graduation-editor > summary").click();
  await expect(dataScienceStart).toHaveValue("Sep 2022");
  await expect(actuarialStart).toHaveValue("Feb 2021");
  await expect(dataScienceEnd).toHaveValue("Jun 2027 (expected)");
  await expect(actuarialEnd).toHaveValue("December 2027 — coursework complete");
  await expect(education).toContainText("Sep 2022 — Jun 2027 (expected)");
  await expect(education).toContainText("Feb 2021 — December 2027 — coursework complete");
  const savedStarts = await page.evaluate(() => JSON.parse(localStorage.getItem("cv-graduation-start-text-v1")));
  expect(savedStarts).toEqual({ "data-science": "Sep 2022", "actuarial-science": "Feb 2021" });

  // Chronological mode must clone the same live degree text.
  await page.locator("#cv-order").selectOption("newest");
  await expect(page.locator("#cv-timeline")).toContainText("Sep 2022 — Jun 2027 (expected)");
  await expect(page.locator("#cv-timeline")).toContainText("Feb 2021 — December 2027 — coursework complete");

  // Both start and end inputs are literal text, never interpreted as markup.
  await actuarialStart.fill("<img src=x onerror=alert(1)>");
  await actuarialEnd.fill("<svg onload=alert(1)>");
  await expect(education).toContainText("<img src=x onerror=alert(1)>");
  await expect(education).toContainText("<svg onload=alert(1)>");
  await expect(education.locator(".cv-date img, .cv-date svg")).toHaveCount(0);

  // Clearing either side must not leave an orphan separator.
  await actuarialStart.fill("");
  await actuarialEnd.fill("Dec 2028");
  await expect(education.locator(".cv-date").nth(1)).toHaveText("Dec 2028");
  await actuarialStart.fill("Feb 2021");
  await actuarialEnd.fill("");
  await expect(education.locator(".cv-date").nth(1)).toHaveText("Feb 2021");

  await page.locator("#cv-reset").click();
  await expect(dataScienceStart).toHaveValue("Aug 2023");
  await expect(actuarialStart).toHaveValue("Aug 2021");
  await expect(dataScienceEnd).toHaveValue("Dec 2026 (expected)");
  await expect(actuarialEnd).toHaveValue("Dec 2026 (expected)");
  await expect(education.locator(".cv-date")).toHaveText([
    "Aug 2023 — Dec 2026 (expected)",
    "Aug 2021 — Dec 2026 (expected)",
  ]);
  expect(await page.evaluate(() => localStorage.getItem("cv-graduation-text-v1"))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem("cv-graduation-start-text-v1"))).toBeNull();
});

test("CV keeps legacy saved graduation text after adding editable start dates", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.setItem("cv-graduation-text-v1", JSON.stringify({
    "data-science": "Jun 2027 (expected)",
    "actuarial-science": "Dec 2026 (expected)",
  })));
  await page.reload({ waitUntil: "networkidle" });
  const education = page.locator('#cv-document [data-cv-section="education"]');
  await expect(education.locator(".cv-date")).toHaveText([
    "Aug 2023 — Jun 2027 (expected)",
    "Aug 2021 — Dec 2026 (expected)",
  ]);
  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-graduation-editor > summary").click();
  await expect(page.locator("#cv-graduation-start-data-science")).toHaveValue("Aug 2023");
  await expect(page.locator("#cv-graduation-data-science")).toHaveValue("Jun 2027 (expected)");
  await page.locator("#cv-graduation-start-data-science").fill("Jan 2024");
  await expect(education.locator(".cv-date").first()).toHaveText("Jan 2024 — Jun 2027 (expected)");
  const storedEnd = await page.evaluate(() => JSON.parse(localStorage.getItem("cv-graduation-text-v1")));
  expect(storedEnd["data-science"]).toBe("Jun 2027 (expected)");
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
  expect(await page.evaluate(() => localStorage.getItem("cv-section-order-v3"))).toBeNull();
});

test("CV defaults to Modern Minimal with right-hand settings and the requested research order", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  const cv = page.locator("#cv-page");
  await expect(cv).toHaveAttribute("data-cv-template", "minimal");
  await expect(page.locator("#cv-template")).toHaveValue("minimal");

  const sections = await page.locator("#cv-sections > [data-cv-section]").evaluateAll((nodes) =>
    nodes.map((node) => node.dataset.cvSection));
  const professional = sections.indexOf("professional-experience");
  expect(professional).toBeGreaterThan(0);
  expect(sections.slice(professional + 1, professional + 4)).toEqual([
    "submitted-manuscripts", "completed-research", "working-drafts-notes",
  ]);
  expect(sections).not.toContain("manuscripts");
  expect(sections).not.toContain("research");
  expect(sections).not.toContain("research-drafts");
  expect(sections).not.toContain("volunteering");

  const submitted = page.locator('#cv-sections [data-cv-section="submitted-manuscripts"]');
  const completed = page.locator('#cv-sections [data-cv-section="completed-research"]');
  const working = page.locator('#cv-sections [data-cv-section="working-drafts-notes"]');
  await expect(submitted.locator("[data-cv-record]")).toHaveCount(3);
  await expect(completed.locator("[data-cv-record]")).toHaveCount(6);
  await expect(working.locator("[data-cv-record]")).toHaveCount(7);
  await expect(completed).toContainText("Student Engagement and Adaptation");
  await expect(completed).toContainText("Stepping-Stone Volume Validation");
  await expect(completed).toContainText("Estimation of Latent Risk");
  await expect(working).toContainText("Smoothness-Integrated Trend Distances");
  await expect(working).toContainText("Handwritten Notes on Penalized Trend Estimation");
  await expect(working).toContainText("Mathematical Notes on Random Variables");
  await expect(completed).not.toContainText("Smoothness-Integrated Trend Distances");
  await expect(working).not.toContainText("Student Engagement and Adaptation");
  await expect(page.locator('[data-cv-order-item="volunteering"]')).toHaveCount(0);
  await expect(page.locator('[data-cv-order-item="completed-research"]')).toHaveCount(1);
  await expect(page.locator('[data-cv-order-item="working-drafts-notes"]')).toHaveCount(1);

  const geometry = await page.evaluate(() => {
    const header = document.querySelector("#cv-document .cv-intro").getBoundingClientRect();
    const toggle = document.querySelector("#cv-panel-toggle").getBoundingClientRect();
    return {
      insideRightEdge: toggle.right <= header.right + 2 && toggle.right >= header.right - 7,
      clearsNameStart: toggle.left > header.left + header.width / 2,
    };
  });
  expect(geometry.insideRightEdge).toBeTruthy();
  expect(geometry.clearsNameStart).toBeTruthy();

  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-template").selectOption("harvard");
  await page.locator("#cv-reset").click();
  await expect(cv).toHaveAttribute("data-cv-template", "minimal");
  await page.locator("#cv-preview").click();
  await expect(page.locator("#cv-paged-preview")).toContainText("Stepping-Stone Volume Validation");
  await expect(page.locator("#cv-paged-preview")).toContainText("Smoothness-Integrated Trend Distances");
});

test("CV sections animate on interaction but honor reduced-motion and keyboard input", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  const details = page.locator('#cv-sections [data-cv-section="submitted-manuscripts"] > details');
  const summary = details.locator("summary");
  await expect(details).toHaveAttribute("open", "");
  const activeAnimations = await summary.evaluate((element) => {
    element.click();
    return element.closest("details").getAnimations().length;
  });
  expect(activeAnimations).toBeGreaterThan(0);
  await expect(details).not.toHaveAttribute("open", "");
  await expect(details).not.toHaveAttribute("data-cv-interaction", "closing");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(details).toHaveAttribute("open", "");
  const animationsWithReducedMotion = await details.evaluate((element) => element.getAnimations().length);
  expect(animationsWithReducedMotion).toBe(0);
});

test("CV Wiley JFM submission and Papers page expose both PDFs and their first-page previews", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  const cvJfm = page.locator('#cv-sections [data-cv-section="submitted-manuscripts"] [data-cv-record]').filter({
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
  // The supplement is lazy-loaded and may be below the mobile viewport.
  // Scroll to trigger its request, then wait for both images to decode.
  await supplement.scrollIntoViewIfNeeded();
  await expect.poll(async () =>
    detail.locator(".portfolio-detail-preview, .portfolio-supplement-first-page img")
      .evaluateAll((images) => images.every((img) => img.complete && img.naturalWidth > 0))
  ).toBeTruthy();
});

test("CV author locations, Wiley submission month and quantum paper links remain readable", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  const submitted = page.locator('#cv-sections [data-cv-section="submitted-manuscripts"]');
  const springer = submitted.locator("[data-cv-record]").filter({
    hasText: "When Do Activation-Patching Effects Add Up?",
  });
  const wiley = submitted.locator("[data-cv-record]").filter({
    hasText: "When Does Posterior Integration Change Option Values?",
  });
  await expect(springer.locator(".cv-location")).toHaveText("Puebla, Mexico");
  await expect(springer.locator(".cv-date")).toHaveText("Oct 2026");
  await expect(wiley.locator(".cv-date")).toHaveText("Nov 2026");
  await expect(wiley.locator(".cv-location")).toHaveText("Puebla, Mexico");

  const talk = page.locator('#cv-sections [data-cv-section="academic-experience"] [data-cv-record]').filter({
    hasText: "Asymptotic Characteristics of Proximity Graphs",
  });
  await expect(talk.locator(".cv-location")).toHaveText("Tlaxcala, Mexico");
  await expect(talk.locator(".cv-date")).toHaveText("Oct 2026");

  const directory = "https://www.udlap.mx/vidaestudiantil/organizaciones-estudiantiles/";
  const quantum = page.locator('#cv-sections [data-cv-section="leadership"] [data-cv-record]').filter({
    hasText: "Quantum Computing Curriculum and Instruction",
  });
  await expect(quantum.locator(".cv-organization a")).toHaveAttribute("href", directory);
  await expect(quantum.locator(".cv-links a")).toHaveAttribute("href", directory);
  await expect(quantum.locator(".cv-links")).toBeVisible();

  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-preview").click();
  const paper = page.locator(".cv-preview-paper-body [data-cv-record]").filter({
    hasText: "Quantum Computing Curriculum and Instruction",
  });
  await expect(paper).toHaveCount(1);
  await expect(paper.locator(".cv-organization a")).toHaveAttribute("href", directory);
  await expect(paper.locator(".cv-links.cv-paper-redundant-links")).toBeHidden();
  const printGeometry = await paper.evaluate((entry) => {
    const link = entry.querySelector(".cv-organization a");
    const rect = link.getBoundingClientRect();
    const parent = entry.closest(".cv-preview-paper-body").getBoundingClientRect();
    return {
      underlined: getComputedStyle(link).textDecorationLine.includes("underline"),
      fitsPaper: rect.right <= parent.right + 2 && rect.left >= parent.left - 2,
      visibleText: link.textContent.trim(),
    };
  });
  expect(printGeometry.underlined).toBe(false);
  expect(printGeometry.fitsPaper).toBe(true);
  expect(printGeometry.visibleText).toContain("Preety Good Quantum OE");

  // The same paginated source is used for actual browser printing.
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
  await expect(page.locator("#cv-page")).toHaveAttribute("data-cv-printing", "true");
  await expect(paper.locator(".cv-links.cv-paper-redundant-links")).toBeHidden();
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
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
  expect(sections.indexOf("Languages")).toBeLessThan(sections.indexOf("Submitted Manuscripts"));
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

test("CV native Print uses continuous A4 and Letter content with browser pagination", async ({ page }, testInfo) => {
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
        nativeBreaks: getComputedStyle(pages[0]).breakAfter === "auto",
        allSections: pages.map((el) => el.textContent).join(" ").toLowerCase().includes("programming experience"),
        noPageLabels: pages.every((el) =>
          getComputedStyle(el.querySelector(".cv-preview-page-number")).display === "none"),
        sized: pages.every((el) => el.querySelector(".cv-preview-paper-body") !== null),
      };
    });
    expect(geometry.printing).toBe("true");
    expect(geometry.sourceDisplay).toBe("none");
    expect(geometry.previewDisplay).not.toBe("none");
    expect(geometry.pages).toBe(1);
    expect(geometry.nativeBreaks).toBe(true);
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

test("CV A4 PDF never strands a single record on an extra physical page", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "desktop") return;
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-template").selectOption("minimal");
  await page.locator("#cv-paper").selectOption("a4");
  await page.locator("#cv-page-margin").selectOption("latex");
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
  const flow = page.locator("#cv-paged-preview .cv-preview-page");
  await expect(flow).toHaveCount(1);
  await expect(flow).toContainText("Unit-Region Factorization");
  await expect(flow).toContainText("When Does Posterior Integration Change Option Values?");
  await expect(flow).toContainText("GitHub: From Zero to Pull Request");
  const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
  const physicalPages = (pdf.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
  // The owner's old A4 PDF needed six physical sheets because sheets two
  // and five were almost empty. Natural pagination must use fewer sheets.
  expect(physicalPages).toBeGreaterThanOrEqual(3);
  expect(physicalPages).toBeLessThan(6);
  await page.emulateMedia({ media: "screen" });
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
});

test("CV paper preview and print start at the top and keep link typography consistent", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-print-options > summary").click();
  await page.locator("#cv-entry-picker > summary").click();
  await page.locator("#cv-entries-none").click();
  await page.locator("#cv-entry-options input[type=checkbox]").first().check();

  // A short selection previously received half its unused vertical height
  // as extra top padding, leaving the owner's name far down the first page.
  for (const [size, paper] of [["small", "a4"], ["large", "letter"]]) {
    await page.locator("#cv-text-size").selectOption(size);
    await page.locator("#cv-paper").selectOption(paper);
    await expect(page.locator("#cv-page")).toHaveAttribute("data-cv-single-page", "true");
    await expect(page.locator("#cv-page")).toHaveAttribute("data-cv-preview", "reading");
    const offset = await page.locator("#cv-page").evaluate((root) =>
      root.style.getPropertyValue("--cv-print-top-balance").trim());
    expect(offset).toBe("");

    await page.locator("#cv-preview").click();
    const preview = await page.locator(".cv-preview-paper-body").first().evaluate((body) => {
      const name = body.querySelector(".cv-intro h1");
      const intro = body.querySelector(".cv-intro");
      const anchors = [...body.querySelectorAll("a")];
      return {
        name: name.textContent,
        topGap: intro.getBoundingClientRect().top - body.getBoundingClientRect().top,
        paddingTop: parseFloat(getComputedStyle(body).paddingTop) || 0,
        links: anchors.map((a) => {
          const own = getComputedStyle(a);
          const parent = getComputedStyle(a.parentElement);
          return {
            decoration: own.textDecorationLine,
            fontSize: own.fontSize,
            parentSize: parent.fontSize,
            fontFamily: own.fontFamily,
            parentFamily: parent.fontFamily,
            fontWeight: own.fontWeight,
            parentWeight: parent.fontWeight,
          };
        }),
      };
    });
    expect(preview.name).toContain("Heriberto Espino Montelongo");
    expect(Math.abs(preview.topGap)).toBeLessThan(2);
    expect(preview.paddingTop).toBe(0);
    expect(preview.links.length).toBeGreaterThan(1);
    for (const link of preview.links) {
      expect(link.decoration).toBe("none");
      expect(link.fontSize).toBe(link.parentSize);
      expect(link.fontFamily).toBe(link.parentFamily);
      expect(link.fontWeight).toBe(link.parentWeight);
    }

    // Native PDF printing must keep the same name position and link styling.
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    await expect(page.locator("#cv-document")).toBeHidden();
    const printed = await page.locator("#cv-paged-preview .cv-preview-paper-body").first().evaluate((body) => ({
      paddingTop: parseFloat(getComputedStyle(body).paddingTop) || 0,
      links: [...body.querySelectorAll("a")].map((a) => ({
        decoration: getComputedStyle(a).textDecorationLine,
        fontSize: getComputedStyle(a).fontSize,
        parentSize: getComputedStyle(a.parentElement).fontSize,
      })),
    }));
    expect(printed.paddingTop).toBe(0);
    expect(printed.links.length).toBeGreaterThan(1);
    for (const link of printed.links) {
      expect(link.decoration).toBe("none");
      expect(link.fontSize).toBe(link.parentSize);
    }
    await page.emulateMedia({ media: "screen" });
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    await page.locator("#cv-preview").click();
  }

  // Longer CVs must also begin at the upper paper margin.
  await page.locator("#cv-entries-all").click();
  await expect(page.locator("#cv-page")).toHaveAttribute("data-cv-single-page", "false");
  await page.locator("#cv-preview").click();
  const fullTopGap = await page.locator(".cv-preview-paper-body").first().evaluate((body) =>
    body.querySelector(".cv-intro").getBoundingClientRect().top - body.getBoundingClientRect().top);
  expect(Math.abs(fullTopGap)).toBeLessThan(2);
});

test("CV NYU and IESE icons, Zenodo DOIs, and no redundant research context rows", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  const root = page.locator("#cv-page");
  const document = page.locator("#cv-document");

  // Local owner-provided marks must render at physical paper size and
  // keep readable institution fallbacks if a logo ever fails.
  const organizations = [
    ["New York University", "nyu-torch-owner.webp"],
    ["IESE Business School", "iese-shield-owner.webp"],
    ["Paletas Loreto", "paletas-loreto-owner.webp"],
  ];
  for (const [organization, filename] of organizations) {
    const record = document.locator("[data-cv-record]").filter({ hasText: organization }).first();
    await expect(record).toHaveCount(1);
    const logo = record.locator(".cv-org-logo");
    await expect(logo).toHaveAttribute("src", new RegExp("assets/img/cv-organizations/" + filename));
    await expect.poll(async () => logo.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
    const fallback = record.locator(".cv-org-icon").first();
    await expect(fallback).toHaveCount(1);
  }
  // Credentials also consume the same two local issuer assets with correct
  // site.baseurl-relative paths, not broken absolute-root URLs.
  await page.goto("/al-folio/credentials/", { waitUntil: "networkidle" });
  for (const [issuer, filename] of organizations.slice(0, 2)) {
    const record = page.locator("[data-credential-entry]").filter({ hasText: issuer }).first();
    await expect(record).toHaveCount(1);
    const image = record.locator("img.credentials-logo");
    await expect(image).toHaveAttribute("src", new RegExp("/al-folio/assets/img/cv-organizations/" + filename));
    await expect.poll(async () => image.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });

  const zenodo = document.locator(".cv-links a:has(.cv-zenodo-mark)");
  await expect(zenodo).toHaveCount(5);
  for (let i = 0; i < 5; i++) {
    const label = await zenodo.nth(i).innerText();
    expect(label).toContain("DOI: 10.5281/zenodo.");
  }

  const redundantExplanations = [
    "Independent research software · numerical validation",
    "Latent financial-risk modeling",
    "Research working draft",
    "Mathematical research lecture",
    "Mathematical research tutorial",
    "Handwritten mathematical research notebook",
    "Expository probability and Hilbert-space analysis",
  ];
  const assertCleanCV = async (locator) => {
    await expect(locator.locator(".cv-context")).toHaveCount(0);
    for (const explanation of redundantExplanations) {
      await expect(locator).not.toContainText(explanation);
    }
    await expect(locator).not.toContainText(/not submitted/i);
  };
  await assertCleanCV(document);
  // Removing the extra explanation must not remove the research entry or its links.
  const volume = document.locator("[data-cv-record]").filter({ hasText: "Stepping-Stone Volume Validation" });
  await expect(volume).toContainText("Research Software Developer");
  await expect(volume.locator('a[href="https://github.com/heri-espino/Stepping-Stone-Volume-Constants"]')).toHaveCount(1);

  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-preview").click();
  const paper = page.locator("#cv-paged-preview");
  await assertCleanCV(paper);
  await expect(paper.locator(".cv-links a:has(.cv-zenodo-mark)")).toHaveCount(5);

  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
  await expect(root).toHaveAttribute("data-cv-printing", "true");
  await assertCleanCV(paper);
  await page.emulateMedia({ media: "screen" });
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
});


test("CV print geometry has tight margins and matched compact preview typography", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  await page.locator("#cv-panel-toggle").click();
  await page.locator("#cv-page-margin").selectOption("latex");
  await page.locator("#cv-preview").click();
  await expect(page.locator("#cv-page")).toHaveAttribute("data-cv-density", "latex");

  const metric = () => page.locator("#cv-paged-preview .cv-preview-page").first().evaluate((first) => {
    const sheet = first.querySelector(".cv-preview-sheet");
    const body = first.querySelector(".cv-preview-paper-body");
    const heading = body.querySelector(".cv-entry h3, .cv-compact-entry h3");
    const description = body.querySelector(".cv-highlights");
    const list = body.querySelector(".cv-entry-list");
    const computed = (element) => getComputedStyle(element);
    return {
      sheetPadding: parseFloat(computed(sheet).paddingTop),
      textSize: parseFloat(computed(sheet).fontSize),
      headingSize: parseFloat(computed(heading).fontSize),
      descriptionSize: parseFloat(computed(description).fontSize),
      descriptionLineHeight: parseFloat(computed(description).lineHeight),
      listGap: parseFloat(computed(list).rowGap),
      bodyTop: body.getBoundingClientRect().top,
      firstTop: first.getBoundingClientRect().top,
    };
  });

  const preview = await metric();
  // Seven physical millimetres in a 96-dpi preview, not a second paper margin.
  expect(preview.sheetPadding).toBeGreaterThan(25);
  expect(preview.sheetPadding).toBeLessThan(28);

  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
  const printed = await metric();
  // @page provides the paper padding; the HTML sheet must not add it again.
  expect(printed.sheetPadding).toBe(0);
  for (const key of ["textSize", "headingSize", "descriptionSize", "descriptionLineHeight", "listGap"]) {
    expect(Math.abs(printed[key] - preview[key]), key + " changed between paper measurement and printing").toBeLessThan(0.8);
  }
  const topOffsets = await page.locator("#cv-page").evaluate((root) => {
    const ancestorMain = root.closest("main");
    const px = (node, prop) => parseFloat(getComputedStyle(node)[prop]) || 0;
    return {
      rootMargin: px(root, "marginTop"),
      rootPadding: px(root, "paddingTop"),
      mainMargin: ancestorMain ? px(ancestorMain, "marginTop") : 0,
      mainPadding: ancestorMain ? px(ancestorMain, "paddingTop") : 0,
    };
  });
  Object.entries(topOffsets).forEach(([name, value]) => expect(value, name).toBe(0));
  await page.emulateMedia({ media: "screen" });
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
});
