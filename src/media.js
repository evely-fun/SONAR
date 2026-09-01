/**
 * Single source of truth for every remote asset on this page.
 *
 * Assets are hot-linked from the Higgsfield CDN rather than committed as binaries.
 * The objects are unsigned and served `cache-control: public, max-age=31536000,
 * immutable`, so the URLs are stable. If they ever need to become local files,
 * this is the only file that changes.
 *
 * Images are referenced through their `_min.webp` derivative, never the source
 * PNG: the originals run 4.8-22.4 MB each, the derivatives 41-344 KB.
 */

const IMG = "https://d8j0ntlcm91z4.cloudfront.net/user_3FdlHXrI03QULQY7FfHb8N4z8eL";
const VID = "https://d2ol7oe51mr4n9.cloudfront.net/user_3FdlHXrI03QULQY7FfHb8N4z8eL";

export const media = {
  // Chapter 0 — the descent. All-intra re-encode so scroll scrubbing does not
  // stutter: 95 frames, 95 keyframes, 1600x900, 4.3 MB.
  descentScrub: `${VID}/272118f3-5ada-4e29-bb0a-73549b7cd4d7.mp4`,
  descentPoster: `${IMG}/hf_20260901_122601_50315eb7-91c2-4572-9c9a-1c114b380d3f_min.webp`,

  // Chapter 1 — the ping. Still frame; the wavefront is drawn on canvas.
  deepStill: `${IMG}/hf_20260901_122601_06f31d15-edbd-46ab-b02d-f254c0fe0c6f_min.webp`,

  // Chapter 2 — the source.
  sourceRock: `${IMG}/hf_20260901_122602_ae012f0c-b0e8-4210-8eae-5642e4a6a53f_min.webp`,

  // Chapter 3 — the botanicals. Seamless loop (end crossfaded into start, so the
  // motion stays forward-only and no bubble ever travels downward).
  botanicalsLoop: `${VID}/7a7f097a-2a70-4d72-a465-ab7a5b2e9467.mp4`,
  botanicalsPoster: `${IMG}/hf_20260901_123203_defe7cf1-88c7-4ff6-aa73-340baf49c369_min.webp`,
  botanicalsSettled: `${IMG}/hf_20260901_123203_818b4570-1852-4d1f-b245-9ac207e69cbd_min.webp`,

  // Chapter 4 — the can, and the pour. Pour loop trimmed past a luminance pop.
  canHero: `${IMG}/hf_20260901_122947_2f4f52d0-229d-463d-9786-185ac3578b21_min.webp`,
  pourLoop: `${VID}/cb7ef833-108c-4285-b372-08d94c390aeb.mp4`,
  pourPoster: `${IMG}/hf_20260901_123041_4f323af1-0c77-4a32-bca2-e08132e7425e_min.webp`,
  pourFilled: `${IMG}/hf_20260901_123237_da4afc75-d7f1-40e1-bf8f-2940b10723d6_min.webp`,

  // Chapter 5 — the ascent. Snell's window; the only warm frame on the site.
  surface: `${IMG}/hf_20260901_123416_60b04a9b-de51-4945-ad2d-8b88bd0605ef_min.webp`,
};
