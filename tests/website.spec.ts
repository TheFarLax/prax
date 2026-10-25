import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const routes = [
  "/",
  "/features",
  "/xasri-ai",
  "/download",
  "/support",
  "/privacy",
  "/terms",
];
const widths = [320, 390, 768, 1024, 1440, 1920];

async function loaded(page: Page, route: string) {
  const response = await page.goto(route, { waitUntil: "networkidle" });
  if (response) expect(response.status(), route).toBe(200);
  else
    expect(
      route,
      "Only same-document anchor navigation may omit an HTTP response",
    ).toContain("#");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("main h1")).toBeVisible();
}

async function noOverflow(page: Page, label: string) {
  const measurement = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const overflow = [
      ...document.querySelectorAll<HTMLElement>(
        "main, header, footer, h1, h2, h3, .btn, .faq-search",
      ),
    ]
      .filter((node) => {
        const rect = node.getBoundingClientRect();
        return (
          rect.width > 0 &&
          (rect.right > width + 1 ||
            rect.left < -1 ||
            node.scrollWidth > node.clientWidth + 2)
        );
      })
      .map((node) => ({
        tag: node.tagName,
        class: node.className,
        text: node.textContent?.slice(0, 60),
        client: node.clientWidth,
        scroll: node.scrollWidth,
      }));
    return {
      width,
      scrollWidth: document.documentElement.scrollWidth,
      overflow,
    };
  });
  expect(
    measurement.scrollWidth,
    `${label}: document overflow ${JSON.stringify(measurement)}`,
  ).toBeLessThanOrEqual(measurement.width + 1);
  expect(
    measurement.overflow,
    `${label}: clipped controls or headings`,
  ).toEqual([]);
}

test.beforeAll(async () => {
  await mkdir("artifacts/screenshots", { recursive: true });
});

for (const width of widths) {
  test(`all seven routes fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of routes) {
      await loaded(page, route);
      await noOverflow(page, `${route} at ${width}px`);
      for (const image of await page.locator("img:visible").all()) {
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(
            () =>
              image.evaluate(
                (node) =>
                  (node as HTMLImageElement).complete &&
                  (node as HTMLImageElement).naturalWidth > 0,
              ),
            {
              message: `Image should load when scrolled into view on ${route}`,
            },
          )
          .toBe(true);
      }
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      expect(await page.title()).toContain("PRAXIS");
      if (route === "/")
        await page.screenshot({
          path: `artifacts/screenshots/home-${width}.png`,
          fullPage: true,
          animations: "disabled",
        });
    }
    expect(errors).toEqual([]);
  });
}

for (const colorScheme of ["light", "dark"] as const) {
  test(`all routes pass automated accessibility in ${colorScheme} mode`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
    for (const route of routes) {
      await loaded(page, route);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(
        results.violations.map((item) => ({
          id: item.id,
          impact: item.impact,
          nodes: item.nodes.map((node) => ({
            html: node.html,
            reason: node.failureSummary,
          })),
        })),
        `Accessibility for ${route} (${colorScheme})`,
      ).toEqual([]);
      if (route === "/")
        await page.screenshot({
          path: `artifacts/screenshots/home-${colorScheme}.png`,
          fullPage: true,
          animations: "disabled",
        });
    }
  });
}

test("mobile navigation contains focus, closes with Escape, and follows links", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await loaded(page, "/");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  const dialog = page.locator("#mobile-navigation");
  await expect(dialog).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  for (let i = 0; i < 9; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() =>
        document
          .querySelector("#mobile-navigation")
          ?.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await dialog.getByRole("link", { name: "Features", exact: true }).click();
  await expect(page).toHaveURL(/\/features$/);
  await expect(dialog).not.toBeVisible();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .not.toBe("hidden");
});

test("introduction tabs and modal keyboard controls work", async ({ page }) => {
  await loaded(page, "/");
  const trigger = page
    .locator(".hero-content")
    .getByRole("button", { name: "Meet Praxis", exact: true });
  await trigger.click();
  const dialog = page.locator(".overview-modal");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Not a product recording.");
  await dialog.getByRole("tab", { name: "Ask", exact: true }).click();
  await expect(dialog.getByRole("tabpanel")).toContainText(
    "Bring your next question.",
  );
  await page.keyboard.press("ArrowRight");
  await expect(
    dialog.getByRole("tab", { name: "Act", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(dialog.getByRole("tabpanel")).toContainText(
    "Put an instruction in motion.",
  );
  for (let i = 0; i < 7; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() =>
        document
          .querySelector(".overview-modal")
          ?.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(accessibility.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .not.toBe("hidden");
});

test("agentic steps support mouse and arrow-key navigation", async ({
  page,
}) => {
  await loaded(page, "/");
  const first = page.getByRole("tab", {
    name: "1 Give an instruction",
    exact: false,
  });
  await first.click();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator("#step-tab-1")).toBeFocused();
  await expect(page.locator("#step-tab-1")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator("#step-panel")).toContainText(
    "Put the question in context.",
  );
  await page.keyboard.press("End");
  await expect(page.locator("#step-panel")).toContainText(
    "Know where the task stands.",
  );
  await page.keyboard.press("Home");
  await expect(page.locator("#step-tab-0")).toBeFocused();
});

test("FAQ search, filters, reset, disclosure, and deep links work", async ({
  page,
}) => {
  await loaded(page, "/support");
  const search = page.getByRole("searchbox", { name: "Find an answer" });
  await search.fill("voice");
  await expect(page.locator(".faq-item")).toHaveCount(1);
  await page.locator("#voice summary").click();
  await expect(page.locator("#voice")).toHaveAttribute("open", "");
  await page
    .getByRole("button", { name: "Downloads & privacy", exact: true })
    .click();
  await expect(page.getByText("No matching questions.")).toBeVisible();
  await page.getByRole("button", { name: "See all questions" }).click();
  await expect(search).toHaveValue("");
  await expect(page.locator(".faq-item")).toHaveCount(9);
  await loaded(page, "/support#downloads");
  await expect(page.locator("#downloads")).toHaveAttribute("open", "");
});

test("theme preference persists and only stores the website preference", async ({
  page,
}) => {
  await loaded(page, "/");
  const button = page.getByRole("button", {
    name: "Website theme: switch between light and dark",
  });
  await button.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([
    "praxis-website-theme",
  ]);
  expect(await page.context().cookies()).toEqual([]);
  await button.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("reduced motion keeps all content visible and stops automatic animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await loaded(page, "/");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  expect(
    await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((animation) => animation.playState === "running").length,
    ),
  ).toBe(0);
  const invisible = await page
    .locator("[data-reveal]")
    .evaluateAll(
      (nodes) =>
        nodes.filter((node) => getComputedStyle(node).opacity === "0").length,
    );
  expect(invisible).toBe(0);
});

for (const width of [320, 390, 1024]) {
  test(`200 percent text remains usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of routes) {
      await loaded(page, route);
      await page.addStyleTag({
        content: "html { font-size: 200% !important; }",
      });
      await noOverflow(page, `200% text ${route} at ${width}px`);
    }
    await page.screenshot({
      path: `artifacts/screenshots/text-200-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
  });
}

test("all internal links, anchors, images, and metadata assets resolve", async ({
  page,
  request,
}) => {
  const targets = new Set<string>();
  const requests: string[] = [];
  page.on("response", (response) => {
    if (response.status() >= 400)
      requests.push(`${response.status()} ${response.url()}`);
  });
  for (const route of routes) {
    await loaded(page, route);
    const links = await page
      .locator("a[href]")
      .evaluateAll((nodes) =>
        nodes.map(
          (node) => (node as HTMLAnchorElement).getAttribute("href") ?? "",
        ),
      );
    for (const href of links) {
      expect(href).not.toBe("");
      expect(href).not.toBe("#");
      expect(href).not.toMatch(/^javascript:/i);
      if (!href.startsWith("http") && !href.startsWith("mailto:"))
        targets.add(
          new URL(href, new URL(route, "http://local.test")).pathname +
            new URL(href, new URL(route, "http://local.test")).hash,
        );
    }
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /social-preview\.png$/,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  }
  for (const target of targets) {
    const [path, hash] = target.split("#");
    const response = await request.get(path);
    expect(response.status(), target).toBe(200);
    if (hash) expect(await response.text(), target).toContain(`id="${hash}"`);
  }
  for (const path of [
    "/images/social-preview.png",
    "/favicon.ico",
    "/brand/icon-180.png",
    "/robots.txt",
    "/sitemap.xml",
  ])
    expect((await request.get(path)).status(), path).toBe(200);
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain(
    "localhost",
  );
  expect(requests).toEqual([]);
});

test("unavailable releases never create fake platform buttons or download links", async ({
  page,
}) => {
  await loaded(page, "/download");
  await expect(
    page.getByText("Praxis downloads are not available on this site yet.", {
      exact: false,
    }),
  ).toBeVisible();
  await expect(page.locator("a[download]")).toHaveCount(0);
  await expect(page.locator("select")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(
    /Windows|macOS|App Store|Linux|iOS|Android/,
  );
});

test("core content and native FAQ remain available without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto(test.info().project.use.baseURL + "/");
  await expect(page.locator("main h1")).toBeVisible();
  await expect(
    page
      .locator(".hero-content")
      .getByRole("link", { name: "Download Praxis" }),
  ).toBeVisible();
  await page.locator("#what-is-praxis summary").click();
  await expect(page.locator("#what-is-praxis .faq-answer")).toBeVisible();
  await context.close();
});
