import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const product = JSON.parse(
  readFileSync(resolve(root, "src/content/product.json"), "utf8"),
);
const issues = [];
const missing = [];
const launch = process.argv.includes("--launch");
const check = (condition, message) => {
  if (!condition) issues.push(message);
};
const nonempty = (value) =>
  typeof value === "string" && value.trim().length > 0;
const placeholder =
  /example\.(com|org|net)|placeholder|your-confirmed-domain|INSERT_|TODO|lorem ipsum/i;

function localFile(path, label, prefix) {
  check(
    nonempty(path) && path.startsWith(prefix),
    `${label}: must be a local asset under ${prefix}`,
  );
  if (!nonempty(path)) return;
  const file = resolve(root, "public", path.replace(/^\//, ""));
  check(
    file.startsWith(resolve(root, "public") + "/"),
    `${label}: invalid asset path`,
  );
  check(existsSync(file), `${label}: file is missing (${path})`);
}

function ids(items, label) {
  const seen = new Set();
  for (const item of items) {
    check(
      nonempty(item.id) && !seen.has(item.id),
      `${label}: duplicate or missing id ${item.id}`,
    );
    seen.add(item.id);
  }
}

for (const field of ["releases", "screenshots", "videos", "features"])
  ids(product[field], field);
for (const shot of product.screenshots) {
  check(
    shot.authentic === true &&
      nonempty(shot.evidence) &&
      nonempty(shot.build) &&
      nonempty(shot.capturedAt),
    `${shot.id}: authentic capture evidence, build, and date are required`,
  );
  check(
    shot.width > 0 &&
      shot.height > 0 &&
      nonempty(shot.alt) &&
      nonempty(shot.caption),
    `${shot.id}: dimensions and accessible text are required`,
  );
  localFile(shot.src, shot.id, "/media/screenshots/");
}

for (const video of product.videos) {
  check(
    video.authentic === true &&
      nonempty(video.evidence) &&
      nonempty(video.build),
    `${video.id}: real recording evidence and build are required`,
  );
  check(
    video.width > 0 && video.height > 0 && video.duration > 0,
    `${video.id}: dimensions and duration are required`,
  );
  check(
    nonempty(video.title) && nonempty(video.transcript),
    `${video.id}: a title and transcript are required`,
  );
  localFile(video.src, video.id, "/media/videos/");
  localFile(video.poster, `${video.id} poster`, "/media/");
  localFile(video.captions, `${video.id} captions`, "/media/captions/");
  const captionFile = resolve(
    root,
    "public",
    (video.captions ?? "").replace(/^\//, ""),
  );
  if (existsSync(captionFile) && video.captions)
    check(
      /^WEBVTT[\s\S]+-->/.test(readFileSync(captionFile, "utf8")),
      `${video.id}: captions must contain actual WebVTT cues`,
    );
}

for (const release of product.releases) {
  check(
    release.verified === true && nonempty(release.evidence),
    `${release.id}: release verification evidence is required`,
  );
  for (const key of [
    "platform",
    "platformLabel",
    "architecture",
    "version",
    "publishedAt",
    "url",
    "fileName",
    "fileSize",
    "requirements",
  ])
    check(nonempty(release[key]), `${release.id}: ${key} is required`);
  check(
    Array.isArray(release.installation) && release.installation.length > 0,
    `${release.id}: installation notes are required`,
  );
  check(
    !placeholder.test(release.url ?? ""),
    `${release.id}: placeholder download URL is forbidden`,
  );
  if (release.url?.startsWith("/"))
    localFile(release.url, release.id, "/releases/");
  else
    check(
      /^https:\/\//.test(release.url ?? ""),
      `${release.id}: remote downloads require HTTPS`,
    );
  if (release.sha256)
    check(
      /^[a-f0-9]{64}$/i.test(release.sha256),
      `${release.id}: invalid SHA-256 checksum`,
    );
}

const allowedFeatures = [
  "page-context",
  "tab-context",
  "voice",
  "workflows",
  "essentials",
  "developer-tools",
  "privacy-controls",
  "personalisation",
];
for (const feature of product.features) {
  check(
    allowedFeatures.includes(feature.id),
    `${feature.id}: unknown feature section`,
  );
  check(
    feature.verified === true && nonempty(feature.evidence),
    `${feature.id}: implementation evidence is required`,
  );
  check(
    nonempty(feature.title) && nonempty(feature.description),
    `${feature.id}: approved copy is required`,
  );
  check(
    Array.isArray(feature.platforms) && feature.platforms.length > 0,
    `${feature.id}: verified platforms are required`,
  );
  check(
    Array.isArray(feature.screenshotIds) && feature.screenshotIds.length > 0,
    `${feature.id}: a real capture is required`,
  );
  for (const id of feature.screenshotIds ?? [])
    check(
      product.screenshots.some((shot) => shot.id === id),
      `${feature.id}: missing screenshot ${id}`,
    );
  if (feature.videoId)
    check(
      product.videos.some((video) => video.id === feature.videoId),
      `${feature.id}: missing video ${feature.videoId}`,
    );
  if (["workflows", "developer-tools"].includes(feature.id))
    check(
      feature.limitations?.length > 0,
      `${feature.id}: execution or implementation limits must be stated`,
    );
}

for (const kind of ["privacy", "terms"]) {
  const document = product.legal[kind];
  if (!document) continue;
  check(
    nonempty(document.approvedBy) && nonempty(document.source),
    `${kind}: approved legal source is required`,
  );
  check(
    nonempty(document.effectiveDate) && document.sections?.length > 0,
    `${kind}: date and approved content are required`,
  );
}
for (const social of product.social)
  check(
    /^https:\/\//.test(social.url) && !placeholder.test(social.url),
    `${social.name}: confirmed HTTPS URL is required`,
  );

for (const path of [
  "public/brand/praxis-symbol-dark.webp",
  "public/brand/praxis-wordmark-dark.webp",
  "public/brand/praxis-lockup-transparent.png",
  "public/images/social-preview.png",
  "public/favicon.ico",
  "fonts/manrope-latin-variable.woff2",
  "fonts/OFL.txt",
])
  check(
    existsSync(resolve(root, path)),
    `Required website asset missing: ${path}`,
  );

if (!product.releases.length)
  missing.push(
    "Verified release files/URLs, platforms, versions, and installation notes.",
  );
if (!product.screenshots.length)
  missing.push(
    "Authentic current-product screenshots (see docs/ASSET-RECORD.md).",
  );
if (!product.videos.length)
  missing.push(
    "Actual product recordings, posters, captions, and transcripts.",
  );
if (!product.features.length)
  missing.push("Product repository/build evidence for feature claims.");
if (!product.legal.privacy || !product.legal.terms)
  missing.push("Approved browser privacy notice and terms.");
if (!existsSync(resolve(root, "public/brand/xasri-orb.png")))
  missing.push(
    "Supplied Xasri BG No source and prepared transparent orb asset.",
  );
if (
  !process.env.NEXT_PUBLIC_SITE_URL ||
  placeholder.test(process.env.NEXT_PUBLIC_SITE_URL) ||
  !/^https:\/\//.test(process.env.NEXT_PUBLIC_SITE_URL)
)
  missing.push("Confirmed HTTPS site origin (NEXT_PUBLIC_SITE_URL).");

if (launch) {
  const requiredShots = [
    "home-desktop",
    "home-mobile",
    "normal-page",
    "assistant-page",
    "contextual-answer",
    "tab-context",
    "agent-task",
    "settings-light",
    "settings-dark",
    "developer-tools",
    "downloads",
  ];
  for (const id of requiredShots)
    if (!product.screenshots.some((shot) => shot.id === id))
      issues.push(`Launch capture missing: ${id}`);
  for (const id of ["hero-loop", "product-tour", "agent-task"])
    if (!product.videos.some((video) => video.id === id))
      issues.push(`Launch recording missing: ${id}`);
  issues.push(...missing);
}

console.log(
  `Content: ${product.releases.length} verified releases, ${product.screenshots.length} authentic captures, ${product.videos.length} authentic recordings, ${product.features.length} verified feature groups.`,
);
if (!issues.length)
  console.log(
    "PASS: configured content and website assets are valid. No unverified product assets or release links are published.",
  );
if (issues.length) {
  console.error(
    `${launch ? "LAUNCH INCOMPLETE" : "CONTENT INVALID"}:\n${issues.map((issue) => `- ${issue}`).join("\n")}`,
  );
  process.exitCode = 1;
} else if (missing.length)
  console.log(
    `Product inputs still missing:\n${missing.map((item) => `- ${item}`).join("\n")}`,
  );
