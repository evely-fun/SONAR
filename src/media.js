/**
 * Single source of truth for every remote asset on this page.
 *
 * Assets are hot-linked from the Higgsfield CDN rather than committed as
 * binaries. The objects are unsigned and served `cache-control: public,
 * max-age=31536000, immutable`, so the URLs are stable. If they ever need to
 * become local files, this is the only file that changes.
 *
 * Images are referenced through their `_min.webp` derivative, never the source
 * PNG: the originals run several MB each, the derivatives 34-309 KB.
 *
 * Stills: Nano Banana (requested as nano_banana_pro; the service reports the
 * jobs as nano_banana_2). Each chapter's END frame was generated with its START
 * frame passed as an image reference, which is what keeps a pair's grade and
 * framing matched well enough to interpolate between.
 *
 * Motion: Kling 3.0 (mode pro, audio off), start-frame + end-frame keyframing.
 */

const IMG = "https://d8j0ntlcm91z4.cloudfront.net/user_3FdlHXrI03QULQY7FfHb8N4z8eL";
const VID = "https://d2ol7oe51mr4n9.cloudfront.net/user_3FdlHXrI03QULQY7FfHb8N4z8eL";

export const media = {
  // Chapter 0 — the descent, scrubbed by scroll.
  // Kling's first 0.85 s carried a luminance surge (76.8 -> 86.7 -> 60.6, a
  // frame delta of 13.6); that head is trimmed off. The remainder is
  // motion-interpolated 24 -> 48 fps and re-encoded all-intra, so every one of
  // its 197 frames is a keyframe and seeking never stalls: 1280x714, 3.0 MB.
  descentScrub: `${VID}/471fe134-f9ba-4733-93c5-418ba4284eb0.mp4`,
  descentPoster: `${IMG}/hf_20260901_131249_69c11246-2440-40c1-8517-1ccdda093f40_min.webp`,

  // Chapter 1 — the ping. Still frame; the wavefront is drawn on canvas.
  deepStill: `${IMG}/hf_20260901_131509_5ec00ddb-ef00-48e9-9b6a-423350839edc_min.webp`,

  // Chapter 2 — the source.
  sourceRock: `${IMG}/hf_20260901_133220_af5ed7b9-5de6-41c3-984a-b22df996975e_min.webp`,

  // Chapter 3 — the botanicals. Seamless loop: the tail is crossfaded into the
  // head rather than reversed, so the motion stays forward-only and no bubble
  // ever travels downward. Seam delta 0.61.
  botanicalsLoop: `${VID}/8f1fac6a-d49c-4f85-a973-dc4976b341d8.mp4`,
  botanicalsPoster: `${IMG}/hf_20260901_131252_b544f11b-7ad6-4aac-bb12-e8eb63c033a6_min.webp`,
  botanicalsSettled: `${IMG}/hf_20260901_131509_cf1c9910-a07d-442a-8cee-79e7b8a19480_min.webp`,

  // Chapter 4 — the can, and the pour. Pour is 9:16 because Kling 3.0 emits
  // only 16:9, 9:16 and 1:1; the keyframes were regenerated to match the clip
  // rather than cropping the clip to fit the layout. Seam delta 0.11.
  canHero: `${IMG}/hf_20260901_132708_ae8b7d70-ff0b-4298-bd81-3778130990e6_min.webp`,
  pourLoop: `${VID}/5f2834a1-ffb2-41eb-856c-de40542a0e56.mp4`,
  pourPoster: `${IMG}/hf_20260901_131653_cb3004a9-1b9d-4055-9d71-ef2ad0e89f80_min.webp`,
  pourFilled: `${IMG}/hf_20260901_131748_3268a8d1-8c0b-4744-9d82-e71cb84ef523_min.webp`,

  // Chapter 5 — the ascent. Snell's window; the only warm frame on the site
  // (r:b 0.724 against 0.2-0.6 everywhere else), which is the point.
  surface: `${IMG}/hf_20260901_132708_e40193a3-d85a-4afe-9a8a-df87cb3be010_min.webp`,
};
