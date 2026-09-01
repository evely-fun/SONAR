# SONAR — motion site brief

## Brand
**SONAR** — deep-source mineral sparkling water with botanicals.
Proposition: water is drawn from depth; sound is how you find what is below.
Voice: quiet, technical, confident. Short declarative lines. No exclamation marks.

## Style
- **Primary preset:** Cinematic Dark.
- **Accent preset:** Apple Minimal, confined to ONE zone (the product chapter) —
  calm, precise, no effects, so the eye gets a rest before the CTA.
- Type: condensed grotesque display + neutral grotesque text. Wide tracking on eyebrows.
- Palette: derived from the generated assets (near-black base, one luminous cyan accent,
  a warm amber used exactly once, at the surface return).

## Signature interaction (the one hard idea)
**The descent.** Scroll is depth. A readout counts metres as you go down, ambient light
attenuates, and at each chapter a sonar ring expands from the can — the chapter's text is
revealed exactly on the passing wavefront. Nothing else in the page competes with this.

## Chapters
| # | Depth | Beat | Media |
|---|-------|------|-------|
| 0 | 0 m | Hero. Surface, light shafts, the can begins to sink. | scrubbed descent video |
| 1 | −40 m | The ping. Brand statement revealed by the wavefront. | canvas ring over still |
| 2 | −120 m | The source. Mineral spring in basalt. | still + parallax |
| 3 | −200 m | The botanicals, suspended. | looping video |
| 4 | product | Apple-Minimal chapter: the can, three variants, specs. | stills |
| 5 | 0 m | Return to the surface. CTA. | still, warm grade |

## Physical law for every animation
Motion that contradicts physics is the amateur tell. Rules enforced everywhere:
1. **Bubbles only rise.** They accelerate, reach terminal velocity, wobble laterally.
   Nearer bubbles move faster (parallax) and are larger.
2. **The camera descends**, so particles stream *upward* through frame — never down.
3. **Light attenuates with depth**, and red dies first: sections shift measurably
   colder and darker as depth increases. This is real underwater optics, not a mood.
4. **Sonar rings expand at constant speed** (sound speed is constant in a medium)
   and fade with the inverse square of radius (energy over an expanding wavefront).
5. **Liquid falls, splashes crown, foam settles.** Pour motion is always gravity-down.
6. **Water has drag:** every ease is an ease-out. Nothing bounces, nothing overshoots,
   nothing uses elastic or back easing anywhere on this site.

## Product design decision
The can carries **no printed text in the generated imagery** — it is a plain matte black
cylinder with one etched ring. The wordmark is real HTML text laid over it. This avoids
the classic generative-model failure of garbled lettering, and it keeps the type crisp
at every viewport.

## Technology tier
Tier 2: GSAP + ScrollTrigger + Lenis. No Three.js — nothing in the brief needs a 3D
scene, and a 600KB bundle for 2D transforms would cost more than it returns.
The sonar rings are 2D canvas, which is cheaper and exactly controllable.
