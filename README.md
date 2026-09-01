# SONAR

A scroll-driven motion site for a fictional deep-source mineral water brand.
Built as a demonstration piece: the brief, the imagery, the motion and the
verification are all part of the deliverable.

**Live preview:** enable GitHub Pages for this branch (Settings → Pages →
Deploy from a branch → `claude/gigsfield-photo-links-gpdhul` → `/root`), then
open the published URL. No build step — it is static HTML, CSS and one ES module.

## What it is

Scroll is depth. A readout counts metres as you descend, ambient light attenuates
with depth, and at each chapter a sonar wavefront expands from the can — the copy
is revealed exactly as the front reaches it. One idea, protected from everything else.

| file | role |
|------|------|
| `index.html` | the whole document, six chapters |
| `src/styles.css` | design tokens and layout; Cinematic Dark with one Apple-Minimal chapter |
| `src/main.js` | Lenis + GSAP/ScrollTrigger, the wavefront, the depth instrument |
| `src/media.js` | **every remote asset URL, in one place** |
| `docs/brief.md` | brand, style, chapter plan, and the physical rules for motion |
| `assets/manifest.md` | every asset, its prompt, its measurements, and why it was kept or rejected |

## Assets

Images and video are hot-linked from the Higgsfield CDN rather than committed.
The objects are unsigned and served `max-age=31536000, immutable`. Images are
referenced through their `_min.webp` derivatives: the source PNGs run 4.8-22.4 MB
each, the derivatives 41-344 KB. To move to local files, change `src/media.js`
and nothing else.

## The physics

Motion that contradicts physics is the tell that gives generated work away. The
rules enforced here, and how each was checked, are in `docs/brief.md` and
`assets/manifest.md`. In short: bubbles only ever rise, light attenuates
monotonically with depth (and red dies before blue), wavefronts expand at
constant speed and fade with the square of the radius, and every ease is an
ease-out because water has drag.

## Verification

`prefers-reduced-motion` is a complete branch, not a toned-down one: no pinning,
no scrubbing, no wavefront — 5.6 viewports of ordinary sections instead of 13.6.

Checked in headless Chromium at 1440x900 and 390x844, plus a reduced-motion run
and a run with the video deliberately unavailable: zero console errors,
zero horizontal overflow, and **CLS 0.0000 at load** in every run.
