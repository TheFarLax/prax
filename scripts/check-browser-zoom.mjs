import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "@playwright/test";
import { browserArgs, browserExecutablePath } from "./browser-config.mjs";

// Use actual browser zoom in a disposable profile, not CSS transform/zoom.
const profile = await mkdtemp(join(tmpdir(), "praxis-zoom-"));
const base = process.env.ZOOM_BASE_URL ?? "http://127.0.0.1:4173";
const routes = [
  "/",
  "/features",
  "/xasri-ai",
  "/download",
  "/support",
  "/privacy",
  "/terms",
];
const measurements = [];
let context;
try {
  context = await chromium.launchPersistentContext(profile, {
    headless: true,
    executablePath: browserExecutablePath,
    args: [...browserArgs, "--window-size=1440,1000"],
    viewport: null,
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const settings = await context.newPage();
  await settings.goto("chrome://settings/appearance");
  const page = await context.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  const originalWidth = await page.evaluate(() => innerWidth);
  for (const factor of [2, 4]) {
    await settings.evaluate(
      (zoom) =>
        new Promise((resolve) =>
          chrome.settingsPrivate.setDefaultZoom(zoom, resolve),
        ),
      factor,
    );
    for (const route of routes) {
      await page.goto(new URL(route, base).href, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const dimensions = await page.evaluate(() => ({
        viewport: innerWidth,
        devicePixelRatio,
        documentWidth: document.documentElement.clientWidth,
        contentWidth: document.documentElement.scrollWidth,
        clipped: [...document.querySelectorAll("h1, h2, h3, .btn")]
          .filter(
            (node) =>
              node.getClientRects().length > 0 &&
              node.scrollWidth > node.clientWidth + 2,
          )
          .map((node) => node.textContent),
      }));
      assert.ok(
        Math.abs(dimensions.viewport - originalWidth / factor) <= 2,
        "Native browser zoom must actually change the layout viewport",
      );
      assert.ok(
        dimensions.contentWidth <= dimensions.documentWidth + 1,
        `Overflow at ${factor * 100}% on ${route}`,
      );
      assert.deepEqual(
        dimensions.clipped,
        [],
        `Clipped controls at ${factor * 100}% on ${route}`,
      );
      measurements.push({ zoomPercent: factor * 100, route, ...dimensions });
      if (route === "/") {
        await page.getByRole("button", { name: "Open navigation" }).click();
        await page.locator("#mobile-navigation").waitFor({ state: "visible" });
        await page.keyboard.press("Escape");
        await page.waitForFunction(
          () => document.body.style.overflow !== "hidden",
        );
        await mkdir("artifacts/screenshots", { recursive: true });
        await page.screenshot({
          path: `artifacts/screenshots/browser-zoom-${factor * 100}.png`,
          animations: "disabled",
        });
      }
    }
    console.log(
      `PASS: ${factor * 100}% native browser zoom across all seven routes, with usable navigation.`,
    );
  }
  await writeFile(
    "artifacts/browser-zoom.json",
    JSON.stringify({ base, originalWidth, measurements }, null, 2) + "\n",
  );
} finally {
  await context?.close();
  await rm(profile, { recursive: true, force: true });
}
