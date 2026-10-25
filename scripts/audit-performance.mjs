import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { browserExecutablePath } from "./browser-config.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const url = process.env.AUDIT_URL ?? "http://127.0.0.1:4173/";
const output = resolve(root, "artifacts");
await mkdir(output, { recursive: true });
const results = [];

for (const mode of ["mobile", "desktop"]) {
  const outputPath = resolve(output, `lighthouse-${mode}`);
  const args = [
    resolve(root, "node_modules/lighthouse/cli/index.js"),
    url,
    "--output=json",
    "--output=html",
    `--output-path=${outputPath}`,
    "--only-categories=performance,accessibility,best-practices,seo",
    "--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage",
    "--quiet",
    ...(mode === "desktop" ? ["--preset=desktop"] : []),
  ];
  console.log(`Measuring ${mode} on ${url}...`);
  await new Promise((resolveRun, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: root,
      env: {
        ...process.env,
        CHROME_PATH: browserExecutablePath ?? chromium.executablePath(),
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let log = "";
    child.stdout.on("data", (chunk) => {
      log += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      log += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0
        ? resolveRun()
        : reject(
            new Error(`Lighthouse ${mode} exited ${code}: ${log.slice(-5000)}`),
          ),
    );
  });
  const report = JSON.parse(
    await readFile(`${outputPath}.report.json`, "utf8"),
  );
  if (report.runtimeError) throw new Error(report.runtimeError.message);
  const audit = (id) => report.audits[id]?.numericValue ?? null;
  const result = {
    mode,
    url: report.finalDisplayedUrl,
    lighthouseVersion: report.lighthouseVersion,
    fetchTime: report.fetchTime,
    userAgent: report.userAgent,
    throttling: report.configSettings.throttling,
    scores: Object.fromEntries(
      Object.entries(report.categories).map(([key, value]) => [
        key,
        value.score === null ? null : Math.round(value.score * 100),
      ]),
    ),
    metrics: {
      fcpMs: audit("first-contentful-paint"),
      lcpMs: audit("largest-contentful-paint"),
      cls: audit("cumulative-layout-shift"),
      tbtMs: audit("total-blocking-time"),
      speedIndexMs: audit("speed-index"),
    },
  };
  results.push(result);
  console.log(JSON.stringify(result, null, 2));
}

await writeFile(
  resolve(output, "performance-summary.json"),
  JSON.stringify(
    {
      note: "Local production lab measurements, not field Core Web Vitals. INP requires representative interactions/field traffic. Indexing intentionally remains disabled until verified product launch content is supplied.",
      results,
    },
    null,
    2,
  ) + "\n",
);
