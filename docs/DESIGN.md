# Praxis website design system

Reading: a consumer browser launch with an editorial hierarchy, warm neutral surfaces, deliberate charcoal demonstrations, and restrained violet accents.

Design settings: `DESIGN_VARIANCE: 7`, `MOTION_INTENSITY: 4`, `VISUAL_DENSITY: 4`. Native CSS plus Tailwind 4 form a custom aesthetic, not a claimed external design system. The launch hero is deliberately centred; later sections use open columns, an interactive walkthrough, a split assistant story, a compact information block, and an asymmetric FAQ.

- Type: locally hosted Manrope variable, SIL Open Font License. Rem-based sizes respect enlarged text. Display type uses the same family as the body.
- Light palette: warm neutral `#f8f8f5`, charcoal text `#222225`, secondary text `#66656e`, violet action `#7050d5`.
- Dark palette: `#17171a`, near-white text `#f0eff4`, secondary text `#b3afbc`, legible violet links `#bda2ff`.
- The violet is a website art direction from the brief. No claim is made that it was sampled from a Praxis interface that was not supplied.
- Pill buttons, 20px media, 24px large surfaces; consistent smaller adjustments on narrow screens. Unboxed content groups avoid repetitive feature cards.
- Layout widths: 1248px, expanding to 1360px on large screens. Deliberate layout changes at 1100, 900, 640, 480, and 360px. The requested 320/390/768/1024/1440/1920 viewports are tested directly.
- Layering: normal content, a header at layer 20, and native dialogs in the browser top layer.
- Motion: short hero entrances, offscreen section reveals, tab transitions, button feedback, and modal entrances. No scroll hijacking, pinned page sequences, continuous body-text motion, or large animation dependency.
- Reduced-motion keeps all content visible and disables transition/entrance motion. The optional real hero recording also checks data-saving and page visibility before playback.
- Interactive controls use visible focus, semantic labels, native disclosures, accessible tabs, explicit dialog focus cycling, Escape dismissal, and restoration.

The user explicitly requested warm sections alternating with charcoal product sections, so the site preserves that treatment in both website themes. No screenshots are recoloured for website dark mode. A future product-theme preview requires two actual captures.

The only logo source is the provided Praxis raster. The full mark is preserved in the asset folder; header/footer wordmarks and symbol variants are proportional extractions. Brand and concept illustrations are labelled and do not simulate a browser or assistant output.
