# PRAXIS website

A responsive, statically rendered marketing website for Praxis, the AI-powered browser from Xasri. Built with Next.js 16, React 19, TypeScript, Tailwind 4, native CSS motion, and locally hosted Manrope.

The website implementation is working. The source workspace did **not** include a runnable Praxis application, product screenshots or recordings, browser releases, the Xasri orb, or approved browser legal text. These have not been fabricated. The current site uses explicitly labelled brand/concept artwork, an interactive introduction, and a clear download-availability state. Product feature sections, real videos, platform selection, and release links are enabled by verified content in one registry.

## Run locally

```bash
npm ci
npm run dev -- --port 3001
```

Open `http://localhost:3001`. Port 3000 was already occupied in the supplied workspace. Localhost and 127.0.0.1 are explicitly allowed for Next.js development assets.

For production:

```bash
npm run build
npm run start -- --port 4173
```

All seven routes are prerendered: `/`, `/features`, `/xasri-ai`, `/download`, `/support`, `/privacy`, and `/terms`. There are also a custom 404 page, metadata, local social preview, favicon, robots, and sitemap routes.

## Validate

```bash
npm run typecheck
npm run lint
npm run verify:content
npm run build
npx playwright install chromium
npm test
npm run test:zoom
npm run audit:performance
```

`npm test` starts/reuses a production server on port 4173. Set `PLAYWRIGHT_BASE_URL` to test an already running server. `CHROMIUM_PATH` can select a compatible installed browser. The supplied Android/Linux environment uses its working Chromium 153 build; this environment-specific fallback is isolated in `scripts/browser-config.mjs`. Normal operating systems use Playwright's installed Chromium.

Performance measurement needs the production server running; set `AUDIT_URL` to change its address. The script saves mobile/desktop Lighthouse JSON, HTML, and a numeric summary under `artifacts/`. These are lab results, not field Core Web Vitals.

`npm run test:zoom` checks real 200% and 400% browser zoom in a disposable Chromium profile, including navigation and all routes. Set `ZOOM_BASE_URL` to change the target. The temporary browser profile is removed afterward.

Run `npm run verify:launch` before public release. It deliberately fails while the genuine product inputs are absent. A successful website build is not evidence that the Praxis browser supports a feature.

## Where things live

| Path                        | Purpose                                                                      |
| --------------------------- | ---------------------------------------------------------------------------- |
| `src/app/`                  | Static routes and shared design tokens/styles                                |
| `src/components/`           | Navigation, modal, walkthrough, media, downloads, FAQ, and reusable sections |
| `src/content/product.json`  | Verified media, feature, release, legal, and contact registry                |
| `src/content/faq.ts`        | FAQ with availability-sensitive answers                                      |
| `src/lib/product.ts`        | Registry types and evidence filters                                          |
| `public/brand/`             | Complete, proportional derivatives of the supplied Praxis mark               |
| `public/media/screenshots/` | Approved actual application captures only                                    |
| `public/media/videos/`      | Actual application recordings only                                           |
| `public/media/captions/`    | Matching WebVTT files                                                        |
| `fonts/`                    | Local variable font and SIL Open Font License                                |
| `docs/FEATURE-RECORD.md`    | Internal claims and implementation evidence                                  |
| `docs/ASSET-RECORD.md`      | Source provenance and exact missing capture list                             |
| `docs/RECORDING-GUIDE.md`   | Recording and authenticity requirements                                      |
| `docs/LAUNCH.md`            | Content integration and release process                                      |
| `artifacts/`                | Website validation screenshots and measured reports; never product assets    |

## Interactions

- Accessible native-dialog mobile navigation and introduction, with focus containment, Escape, and restoration.
- Arrow-key-accessible agentic concept steps and overview chapters.
- Searchable/filterable FAQ, native disclosures, clear/reset, and direct question links.
- Website light/dark preference stored locally, with system preference used initially.
- Genuine media integration: native video controls, captions, transcript, error fallback, motion/data-saving-aware hero playback, and screenshot fullscreen/original-size view.
- Verified release handling: platform/architecture choice, OS suggestion, real download links, version/requirements/install notes, and optional checksum copy. No automatic download.
- Actual screenshot light/dark switch when both verified captures exist; no screenshot recolouring.

The motion system uses CSS and IntersectionObserver. No animation library is shipped for simple transitions. Content remains present with reduced motion or without JavaScript.

## Brand handling

The original `praxislogo.png` is untouched. `scripts/prepare-brand.py` deterministically prepares complete transparent symbol/wordmark/lockup variants, favicons, and the social graphic. It requires Python Pillow and fontTools, but those are not needed to build or serve the website because the resulting assets are included. No Xasri orb was invented.

The brand and product evidence records are important parts of the handoff. See `docs/VALIDATION.md` for the actual check results and remaining input limitations.
