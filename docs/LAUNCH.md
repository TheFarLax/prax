# Content integration and launch

## Current state

The website source, routes, responsive layouts, brand assets, and interactions are implemented. Product launch content is not yet available in the supplied workspace. There are no fake installers, product screenshots, assistant outputs, task recordings, testimonials, customer counts, social channels, or legal documents.

The user was asked for the current application repository/build, approved captures/recordings, and release links. Independent website implementation continued while those inputs were unavailable.

## Add actual product content

1. Provide access to the current Praxis source/runnable build and record the exact revision. Verify the feature using public, non-sensitive test content.
2. Complete the internal `FEATURE-RECORD.md` rows with platform, evidence, limitations, capture/demo, and approved copy.
3. Add captures/recordings to the organised `public/media/` directories. See `ASSET-RECORD.md` for required IDs, exact framing, and toolbar checks. Never use marketing-site validation screenshots as application evidence.
4. Add typed entries to `src/content/product.json`. The complete field definitions are in `src/lib/product.ts`:
   - `screenshots`: real capture path, original dimensions, useful alt/caption, platform, build, captured date, evidence, `authentic: true`.
   - `videos`: actual recording, poster, captions, transcript, duration/dimensions, build/evidence, `authentic: true`, accurate `editedForLength`.
   - `features`: verified title/copy, supported items and platforms, relevant limitations, actual screenshot/video references, evidence, `verified: true`.
   - `releases`: real HTTPS file URL (or local `/releases/` file), platform/architecture/version, published date, exact file name/size, requirements/install notes, checksum if supplied, verification evidence.
5. Rebuild. A `product-tour` entry replaces the introduction with the actual accessible video player, and the demo action becomes “Watch Praxis in action”. `hero-loop` or `home-desktop` replaces the brand illustration. Feature groups render in the requested story order only when evidence and captures exist. The Settings preview needs two separate real captures.
6. Supply the complete Xasri orb asset. It must be used only for assistant interactions, retain its full geometry, and remain separate from the Praxis browser symbol. A generic sparkle in the current concept illustration is not represented as the Xasri logo.
7. Supply approved browser privacy and terms text with source, approver, and effective date. The current pages state their absence and describe only implemented website behaviour.
8. Add confirmed support/social URLs only if provided. No fabricated contact form or signup flow is included.

Do not add a separate Automations or Schedule Tasks route, navigation entry, or screen. Automation belongs to assistant prompts/voice where implemented. Record browser-open execution limits explicitly. Never imply Chrome DevTools parity, cloud workspaces, isolated terminals, or extension-store support without separate verification.

## Domain and indexing

Set the real HTTPS origin in `NEXT_PUBLIC_SITE_URL`. Until there is a real origin and minimum launch content, metadata stays `noindex`, robots disallows crawling, and the sitemap does not invent a domain. This is a local preview, not a published launch.

After content checks pass, set `NEXT_PUBLIC_ALLOW_INDEXING=true`, rebuild, and verify canonical URLs, Open Graph images, robots, and the sitemap on the real domain. No deployment or external publication has been performed as part of this implementation.

## Final release validation

- Run `npm run verify:content` and `npm run verify:launch`. The launch check must no longer report missing inputs.
- Download each real binary from its public URL, verify its type, exact version and platform, file size, and checksum if provided. Run installation on that supported platform. The website tests cannot verify the browser binary itself.
- Play every actual recording, inspect its poster and full transcript, verify caption timing, and ensure the task really completes in the application.
- Verify product imagery at 320, 390, 768, 1024, 1440, and 1920 pixels, including fullscreen inspection. Marketing illustration checks are not a substitute for this pass.
- Run the production build, browser tests, and fresh Lighthouse measurements after adding real media. Videos and screenshots will change page weight and performance.
- Review all public claims against the product feature record. Keep every relevant limitation beside the action it qualifies.

See `VALIDATION.md` for the checks completed on the current website and the honest boundary of those results.
