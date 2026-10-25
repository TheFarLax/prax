# Asset record

## Supplied and prepared brand assets

`/praxislogo.png` is the original user-supplied 1254 × 1254 RGB raster. It is preserved unchanged. Its SHA-256 is `0fc91b9f1b042bfd46bf03d8113926616560f4194ecf6028a8026049eb9cecef`.

`scripts/prepare-brand.py` removes only the near-white background and extracts the complete symbol and complete wordmark into transparent lossless WebP assets. It does not redraw the mark, cut it into a circle, stretch it, or manufacture a Xasri logo. Dark/light monochrome derivatives retain the source geometry.

| Asset                                            | Dimensions            | Source / purpose                                              |
| ------------------------------------------------ | --------------------- | ------------------------------------------------------------- |
| `public/brand/praxis-lockup-transparent.png`     | 1254 × 1254           | Full original composition, transparent background             |
| `public/brand/praxis-lockup-{dark,light}.webp`   | 1254 × 1254           | Full lockup, lossless                                         |
| `public/brand/praxis-symbol-{dark,light}.webp`   | 625 × 650             | Complete P symbol, source bounds (316,231)-(941,881)          |
| `public/brand/praxis-wordmark-{dark,light}.webp` | 820 × 113             | Complete PRAXIS wordmark, source bounds (217,926)-(1037,1039) |
| `public/brand/icon-{180,192,512}.png`            | As named              | Complete symbol with transparent padding                      |
| `public/favicon.ico`                             | 16/32/48              | Complete symbol, browser favicon                              |
| `public/images/social-preview.png`               | 1200 × 630            | Website sharing graphic, never represented as product UI      |
| `fonts/manrope-latin-variable.woff2`             | 27 KB                 | Locally hosted Manrope variable font                          |
| `fonts/OFL.txt`                                  | SIL Open Font License | Font licence copied from Fontsource package                   |

The home hero and assistant illustration are CSS brand/concept artwork. They are explicitly labelled as illustrations, contain no fabricated browser toolbar or assistant response, and are replaced by actual media when configured.

The requested `Xasri BG No` source and its prepared transparent orb asset are **missing**. No unrelated orb or cropped substitute is used. Supply the full mark and record its provenance before adding it to the assistant presentation.

## Required actual product captures

Place approved captures in `public/media/screenshots/` and register them in `src/content/product.json`. All are currently missing.

| Content ID          | Required subject                                            |
| ------------------- | ----------------------------------------------------------- |
| `home-desktop`      | Current Praxis desktop home                                 |
| `home-mobile`       | Current mobile home, no removed bottom navigation           |
| `normal-page`       | Public webpage with current top bar                         |
| `assistant-page`    | Real Xasri panel beside a real webpage                      |
| `contextual-answer` | Successful, real page-context answer                        |
| `tab-context`       | Explicit multi-tab context selection and answer             |
| `agent-task`        | Successful supported browser task                           |
| `settings-light`    | Actual light settings screen                                |
| `settings-dark`     | Actual dark settings screen, never recoloured               |
| `developer-tools`   | Current implemented Developer Tools                         |
| `downloads`         | Actual download manager or another polished everyday screen |

For every capture, record platform, exact build/commit, date, source provenance, dimensions, accessible description, and a visitor-facing caption. Set `authentic: true` only after human/source verification.

The top-bar review must confirm one Xasri icon on the right, appropriate controls on the left, no duplicate Xasri mark, no refresh control in the top toolbar, and a clear overflow menu. Do not include the removed mobile bottom navigation.

Keep full, correct aspect ratios. Use lossless WebP/PNG for interface text. Do not add controls, reskin, recolour, warp, or fabricate content inside the capture. Product images support keyboard-accessible fullscreen and original-size viewing.

## Required recordings

`public/media/videos/` holds actual product footage. `public/media/captions/` holds matching WebVTT. Posters live beside the footage or under screenshots. No recordings are currently supplied.

| Content ID             | Target duration                | Subject                                                                                           |
| ---------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------- |
| `hero-loop`            | 8-15 seconds                   | Open Ask Xasri and ask about the current page                                                     |
| `product-tour`         | 45-90 seconds                  | Browsing, page question, selected tabs, supported action, personalisation or developer inspection |
| `agent-task`           | A readable successful sequence | Actual supported action from instruction to result                                                |
| `page-understanding`   | 10-25 seconds                  | Contextual answer                                                                                 |
| `tab-comparison`       | 10-25 seconds                  | Explicit tab context and comparison                                                               |
| `voice-input`          | 10-25 seconds, if supported    | Voice with captions and visible transcript                                                        |
| `assistant-workflow`   | 10-25 seconds, if supported    | Workflow through assistant prompts, never a separate Automations screen                           |
| `developer-inspection` | 10-25 seconds, if supported    | Inspect element, review styles, open Ask Xasri                                                    |

`artifacts/screenshots/` contains validation screenshots of **this marketing website**. They are not product captures and must not be put in the product media registry.
