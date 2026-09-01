# SONAR — asset manifest

CDN base: `https://d8j0ntlcm91z4.cloudfront.net/user_3FdlHXrI03QULQY7FfHb8N4z8eL`

Assets are hot-linked from the Higgsfield CDN, not committed as binaries. The objects
are served `cache-control: public, max-age=31536000, immutable` with unsigned URLs, so
they are stable. Every URL below is recorded with the job id that produced it.

## Verification method
This session cannot download from the CDN (egress policy blocks that host), so images
were not reviewed by eye here. Each asset was instead measured programmatically:
resolution, mean RGB, red-to-blue ratio (grade consistency) and an 8x5 luminance grid
(composition and negative-space placement). Assets that broke the cold grade or whose
bright mass sat in the wrong place were rejected and regenerated. Final aesthetic review
is the human's.

## Images — `cinematic_studio_2_5`, 2 credits each

| # | name | job id | ratio | luma | r:b | verdict |
|---|------|--------|-------|------|-----|---------|
| 1 | descent-start | `50315eb7-91c2-4572-9c9a-1c114b380d3f` | 16:9 | 75.2 | 0.356 | accepted |
| 2 | descent-end | `06f31d15-edbd-46ab-b02d-f254c0fe0c6f` | 16:9 | 38.5 | 0.322 | accepted |
| 3 | source-rock | `ae012f0c-b0e8-4210-8eae-5642e4a6a53f` | 16:9 | 40.2 | 0.416 | accepted |
| 4 | botanicals-start v1 | `c1d5a11e-a2e5-493b-a810-5ce0e621769a` | 16:9 | 46.7 | 0.658 | superseded by #9 |
| 5 | botanicals-end v1 | `a95d00c7-a327-4bf3-9bb9-2cf72c7c9b2a` | 16:9 | 32.5 | 3.115 | REJECTED — warm grade |
| 6 | can-hero | `2f4f52d0-229d-463d-9786-185ac3578b21` | 4:5 | 43.8 | 0.541 | accepted |
| 7 | pour-start | `4f323af1-0c77-4a32-bca2-e08132e7425e` | 3:4 | 38.5 | 0.698 | accepted |
| 8 | pour-end | `da4afc75-d7f1-40e1-bf8f-2940b10723d6` | 3:4 | — | — | accepted (first job failed server-side, resubmitted) |
| 9 | botanicals-start v2 | `defe7cf1-88c7-4ff6-aa73-340baf49c369` | 16:9 | 30.5 | 0.198 | accepted |
| 10 | botanicals-end v2 | `818b4570-1852-4d1f-b245-9ac207e69cbd` | 16:9 | 25.4 | 0.340 | accepted |
| 12 | snell-surface | `60b04a9b-de51-4945-ad2d-8b88bd0605ef` | 21:9 4K | 43.9 | 0.282 | accepted |

Rejection note (#5): mean RGB 49/29/16 gave a red-to-blue ratio of 3.115 against
0.32-0.66 across the rest of the set — the frame came back amber instead of teal, and
its bright mass sat at the frame edges rather than the centre, so it could not serve as
the end keyframe of a pair whose start frame is centre-weighted. Regenerated as #9/#10
with the failure named explicitly in the prompt ("no warm tones, no amber, no orange").

## Video — `minimax_h3`, 2K, 5s, 10 credits each

| clip | job id | keyframes | motion | delivered as |
|------|--------|-----------|--------|--------------|
| A — descent | `59d14a37-4713-4d8d-b099-da8bdf9e9c8c` | #1 → #2 | constant-speed sink, bubbles rise, light attenuates | `272118f3-…` |
| B — botanicals | `5a92a7fa-fc64-4f0d-9445-25b6b299536a` | #9 → #10 | settling drift, bubble trails rise | `7a7f097a-…` |
| C — pour | `296febe1-9017-423d-9a6e-562bccd83bdb` | #7 → #8 | gravity fill, foam settles | `cb7ef833-…` |

### Video verification and repair

Each clip was sampled at 4 fps and measured; no clip was accepted on appearance alone.

**A — descent.** Luminance falls monotonically 71.09 → 34.32 across the shot, which is
the light attenuation the descent depicts. Largest frame-to-frame delta 4.64, so the
model invented no cut and no morph. The final frame measured r:b 0.317 against the
target keyframe's 0.322 — it lands where it was told to. Repaired: the first 1.2 s
were a static hold that would have wasted a third of the scroll, and the file carried
an unused audio track. Re-encoded all-intra (`-g 1`) so scroll scrubbing does not
stutter — **95 frames, 95 keyframes**, 1600x900, 6.0 MB → 4.3 MB.

**B — botanicals.** No artefacts, but luminance ran 25.7 → 20.3 → 21.2, so looping it
would have jumped 17 % at the seam. Reversing the clip would have fixed the seam and
sent the bubbles downward, so instead the tail was crossfaded into the head: motion
stays forward-only. Seam delta **4.4 → 0.80**. 3019 KB → 670 KB.
Caveat: the intended downward drift is too small to confirm by measurement — worth a
human eye.

**C — pour.** Physics correct: luminance 35.6 → 60.8 as the glass fills, and the
luminance centroid rises 0.637 → 0.567 as the liquid level climbs. But a frame delta
of **16.18** at t=1.75 s marked an abrupt pop against a 0.1-1.8 baseline. Trimmed to
start after it (the preceding 1.5 s were near-static anyway) and crossfade-looped:
max delta **16.18 → 2.57**, seam delta **0.11**. 4049 KB → 591 KB.

## Credits
Images at 2 credits each, one 4K image at 4, three videos at 10.
Measured against the account balance before and after: 1010 → 956,
so **54 credits** for the whole set, including the rejected frame and the retries.


---

# Revision 2 — Kling 3.0 and Nano Banana

Requested after review of the first pass: two of the three clips read as buggy,
and the frame rate was too low.

## What the measurements said

The frame rate was **24 fps, not 30** — on both the old model and the new one.
Kling 3.0 also emits 24 fps, so switching models does not touch it. Choppiness in
a scroll-scrubbed clip comes from frames-per-pixel-of-scroll, not from the model:
121 frames stretched over a 420 % pin is one new frame every ~30 px.

Kling 3.0 was nonetheless the right call, and the numbers say why:

| clip | max frame-to-frame delta, MiniMax | same, Kling 3.0 |
|------|----------------------------------|-----------------|
| botanicals | 1.09, and no measurable motion at all | **0.43**, with the settling now visible as centroidY 0.354 → 0.379 |
| pour | **16.18** (an abrupt pop) | **1.53** |
| descent | 4.64 | 13.57 in the first 0.85 s, then 0.15-2.6 |

Kling's descent clip carries a luminance surge at the head (76.8 → 86.7 → 60.6).
That 0.85 s is trimmed off; what remains is the smoothest of the three.

## The frame-rate fix

Motion interpolation, not a different model. The scrub clip is interpolated
24 → 48 fps with `minterpolate` (mci/aobmc/bidir) and re-encoded all-intra:

- **95 → 197 frames** of temporal resolution
- **all 197 are keyframes**, so seeking never stalls
- max frame-to-frame delta **13.57 → 2.11**
- and it got *smaller*: 4.3 MB → **3.0 MB**, at 1280x714

The two ambient loops were left at 24 fps deliberately. They play at natural
speed, where 24 fps is a normal cinematic rate; interpolating them would have
doubled their weight for no perceptible gain.

## Stills

Regenerated with Nano Banana. Requested as `nano_banana_pro`; the service
reports every job as `nano_banana_2` — worth knowing before choosing between
them. Prompts were rewritten short and concrete rather than filling a
seven-slot template.

The technique that mattered: each pair's END frame was generated with its START
frame passed as an `image_references` input. In revision 1 an unreferenced end
frame came back amber (r:b 3.115) against a set running 0.20-0.70 and had to be
thrown away. This time every pair matched first time:

| pair | luma | r:b | reads as |
|------|------|-----|----------|
| descent | 75.3 → 26.3 | 0.418 → 0.233 | light attenuating, red dying before blue |
| botanicals | 52.5 → 50.9 | 0.335 → 0.293 | constant light, mass settling downward |
| pour | 31.3 → 42.4 | top row stays 9 | glass filling, headline space preserved |

Coldest frame of the set is the source rock at r:b 0.165; the warmest is Snell's
window at 0.724, which is the one warm frame the design allows.

## Layout consequence

Kling 3.0 emits only 16:9, 9:16 and 1:1. The pour was 3:4, so its keyframes were
regenerated at 9:16 and the CSS follows the clip — rather than cropping the clip
to fit a box chosen before the constraint was known.
