# Website validation

Validated on 25 October 2026. These results describe the marketing website in this workspace, not the Praxis browser application.

The seven implemented routes are `/`, `/features`, `/xasri-ai`, `/download`, `/support`, `/privacy`, and `/terms`. The site builds and runs locally. A public product launch remains incomplete because authentic application media, verified releases, and approved product information were not supplied.

## Build and content

| Check                              | Result                                                                       |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| Production build                   | Passed; all seven pages, 404, robots, and sitemap prerendered                |
| TypeScript                         | Passed                                                                       |
| ESLint                             | Passed without warnings                                                      |
| Prettier                           | Passed                                                                       |
| Content and local asset validation | Passed                                                                       |
| Dependency audit                   | Zero reported vulnerabilities across production and development dependencies |
| Product launch validation          | Intentionally fails; actual product inputs are missing                       |

The launch check is separate from build validation. No fabricated screenshots, recordings, successful assistant responses, platform availability, installer links, or browser legal text have been added to make that check pass.

## Browser and accessibility checks

The final full Playwright run **passed all 20 tests**, with no failures, skipped tests, or retries. The report is saved in [playwright-results.json](../artifacts/playwright-results.json).

- All seven routes fit at **320, 390, 768, 1024, 1440, and 1920 pixels**: 42 route/width combinations, including checks for overflowing documents and clipped headings or controls.
- Visible website images load correctly. Desktop, mobile, and dark-theme captures were visually reviewed. These are website validation captures, never Praxis application screenshots.
- Automated axe checks cover WCAG 2 A/AA and 2.1 A/AA rules on all routes in both website themes. The open introduction dialog is also checked. Automated scans do not establish complete accessibility conformance.
- Mobile navigation and the introduction modal support keyboard focus containment, Escape, and focus restoration. Navigation links resolve, and closing a dialog restores page scrolling.
- Introduction chapters and the agentic concept walkthrough support arrow-key navigation.
- FAQ search, category filters, reset, native disclosures, and direct question links work.
- The website theme persists locally. Only the website preference is stored in the tested flows; no cookies were set.
- Reduced-motion preferences keep content visible and stop entrance animations.
- **200% text enlargement** was checked on all seven routes at 320, 390, and 1024 pixels.
- Internal links, anchors, visible images, page descriptions, social metadata, favicon, robots, and sitemap resolve without broken requests or uncaught page errors.
- The download route accurately reports missing availability and exposes no invented platforms or installer links.
- Core page content, download navigation, and native FAQ disclosures remain usable without JavaScript.

Native browser zoom was separately tested at **200% and 400%** on all seven routes, including navigation. This used Chrome's actual zoom setting in a disposable browser profile, not CSS `zoom` or a resized screenshot. From a 1440-pixel browser window, the measured CSS viewports were 720 and 360 pixels with device pixel ratios of 2 and 4. No overflowing documents or clipped controls were detected. This run used the development server at `http://127.0.0.1:3001`; the Playwright suite used the production server at `http://127.0.0.1:4173`.

See [browser-zoom.json](../artifacts/browser-zoom.json) and [website screenshots](../artifacts/screenshots/).

## Measured performance

Lighthouse 13.5.0 measured the production homepage at `http://127.0.0.1:4173/`, with no concurrent browser test run. Mobile was measured at 15:46:01 UTC and desktop at 15:46:25 UTC on 25 October 2026. Both runs completed without Lighthouse runtime warnings.

| Measurement              |   Mobile | Desktop |
| ------------------------ | -------: | ------: |
| Performance              |   **92** |  **98** |
| Accessibility            |      100 |     100 |
| Best practices           |      100 |     100 |
| SEO                      |       66 |      66 |
| First Contentful Paint   |   788 ms |  243 ms |
| Largest Contentful Paint | 2,308 ms |  639 ms |
| Total Blocking Time      |   309 ms |  131 ms |
| Cumulative Layout Shift  |        0 |       0 |
| Speed Index              | 1,975 ms |  874 ms |

The SEO score reflects deliberate `noindex` metadata and a robots crawl restriction. "Page is blocked from indexing" is the only failed SEO audit. The site will remain unindexed until the real domain and launch content are configured; see [LAUNCH.md](LAUNCH.md).

Mobile uses Lighthouse's simulated mobile throttling: 150 ms RTT, 1,638.4 Kbps throughput, and 4× CPU slowdown. Desktop uses the desktop preset: 40 ms RTT, 10,240 Kbps throughput, and 1× CPU slowdown. The measured homepage transferred about 250 KiB across 17 requests, including about 168 KiB of JavaScript. No third-party resources or product videos were loaded.

These are **single-run local lab measurements**, not field Core Web Vitals or real-user INP measurements. Mobile main-thread work remains a performance opportunity. Real product images and recordings will change page weight and must be measured again after integration.

The initial measurement was 83 mobile / 92 desktop. Before the final measurement, header logos were changed to eager loading, unnecessary header/hero route prefetches were disabled, and the website theme button's accessible name was corrected to include its visible label. The initial reports are retained under `artifacts/baseline-performance/`; scores can vary between runs.

Reports:

- [Numeric summary](../artifacts/performance-summary.json)
- [Mobile Lighthouse report](../artifacts/lighthouse-mobile.report.html)
- [Desktop Lighthouse report](../artifacts/lighthouse-desktop.report.html)
- [Dependency audit](../artifacts/dependency-audit.json)

## Environment and reproduction

| Component                  | Tested version or configuration                               |
| -------------------------- | ------------------------------------------------------------- |
| Node.js                    | 22.23.3                                                       |
| Next.js / React            | 16.4.3 / 19.3.0                                               |
| TypeScript                 | 5.9.3                                                         |
| Playwright                 | 1.64.1                                                        |
| axe Playwright integration | 4.14.0                                                        |
| Browser                    | Google Chrome for Testing 153.0.8010.12                       |
| Host                       | ARM64 Linux compatibility environment on an Android 13 kernel |

The environment's bundled Chromium 156 renderer could not run. `scripts/browser-config.mjs` selects the existing compatible Chrome 153 executable here; ordinary installations use Playwright's bundled browser. `CHROMIUM_PATH` overrides the selection. No Safari, Firefox, or physical mobile device run is claimed.

```bash
npm ci
npm run build
npm run typecheck
npm run lint
npm run format:check
npm run verify:content
npm test
```

Run `npm run start -- --port 4173` in a separate terminal before `npm run audit:performance`. For native zoom against that production server, run `ZOOM_BASE_URL=http://127.0.0.1:4173 npm run test:zoom`. Run browser tests and performance measurement sequentially.

## Remaining inputs and validation limits

The original workspace supplied the Praxis logo but no runnable product or evidence of individual browser features. The following inputs are still needed:

1. The current Praxis application repository or runnable build, exact revision, and supported platform details, to verify feature claims and completed tasks.
2. Authentic desktop/mobile captures and recordings, with matching posters, captions, and transcripts. The exact capture IDs and toolbar requirements are in [ASSET-RECORD.md](ASSET-RECORD.md).
3. Real release files or HTTPS download URLs, versions, architecture, requirements, installation notes, and checksums where supplied.
4. The complete `Xasri BG No` source and prepared transparent Xasri orb.
5. Approved browser privacy and terms text, a confirmed production domain, and confirmed support channels.

The current media and release integrations are implemented but cannot be validated end to end against missing application assets or binaries. Actual video playback, caption timing, screenshot authenticity, installer download and installation, supported browser tasks, settings, Developer Tools, and application privacy controls remain unverified. No public deployment has been performed.

The central content registry is [product.json](../src/content/product.json). The internal [feature record](FEATURE-RECORD.md), [asset record](ASSET-RECORD.md), and [recording guide](RECORDING-GUIDE.md) describe how to finish the product integration without changing the surrounding layouts.
