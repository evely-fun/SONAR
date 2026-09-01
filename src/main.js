import { media } from "./media.js";

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

/* ── 1. Wire the manifest into the document ─────────────────────────────
   Nothing in the markup hard-codes a URL, so swapping the CDN for local
   files is a one-file change.                                            */

function wireMedia() {
  $("#descentFallback").src = media.descentPoster;
  $("#pingStill").src       = media.deepStill;
  $("#sourceImg").src       = media.sourceRock;
  $("#canImg").src          = media.canHero;
  $("#surfaceImg").src      = media.surface;

  const descent = $("#descent");
  descent.poster = media.descentPoster;
  descent.src = media.descentScrub;
  descent.addEventListener("error", () => {
    descent.hidden = true;
    $("#descentFallback").hidden = false;
  }, { once: true });

  // Loops: poster-first, source attached only when the section is near.
  setupLoop($("#botVideo"), $("#botStill"), media.botanicalsLoop, media.botanicalsPoster, media.botanicalsSettled);
  setupLoop($("#pourVideo"), $("#pourStill"), media.pourLoop, media.pourPoster, media.pourFilled);

  for (const img of $$("img")) img.loading = img.closest(".hero, .ping") ? "eager" : "lazy";
}

/* A loop plays only while it is on screen. Under reduced motion the video is
   never loaded at all and the still stands in for it permanently. */
function setupLoop(video, still, src, poster, reducedStill) {
  video.poster = poster;
  if (REDUCED) {
    video.hidden = true;
    still.src = reducedStill;
    still.hidden = false;
    return;
  }
  let loaded = false;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        if (!loaded) { video.src = src; loaded = true; }
        video.play().catch(() => {});
      } else if (loaded) {
        video.pause();
      }
    }
  }, { rootMargin: "200px 0px" });
  io.observe(video);
}

/* ── 2. Word splitting ─────────────────────────────────────────────────── */

function splitWords(el, cls) {
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = "";
  return words.map((w, i) => {
    const outer = document.createElement("span");
    if (cls === "reveal") {
      outer.className = "word";
      const inner = document.createElement("span");
      inner.textContent = w;
      outer.appendChild(inner);
    } else {
      outer.className = "w";
      outer.textContent = w;
    }
    el.appendChild(outer);
    if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    return cls === "reveal" ? outer.firstChild : outer;
  });
}

/* ── 3. The depth instrument ────────────────────────────────────────────
   Each chapter declares the depth band it covers. Bands are read from the
   section's own scroll progress, so the number always agrees with what is
   on screen — including inside pinned chapters, where ScrollTrigger already
   accounts for the pin.                                                   */

let setDepth = () => {};

/* The readout sink is installed before the pinned chapters are built, because
   they write to it from their own onUpdate. The plain chapters get their
   triggers afterwards: ScrollTrigger resolves start/end in creation order, so a
   trigger created before the pins would be measured against a document that
   does not yet contain their pin distance, and would fire pages too early. */
function initDepthOutput() {
  const out = $("#depthVal");
  setDepth = (v) => { out.textContent = Math.round(v); };
}

function setupDepthSections() {
  $$("[data-depth-from]").forEach((section) => {
    if (section.id === "hero" || section.id === "ping") return; // driven by their pins
    const from = Number(section.dataset.depthFrom);
    const to   = Number(section.dataset.depthTo);
    ScrollTrigger.create({
      trigger: section,
      // Chapters hand over exactly at the viewport centre, so no two bands are
      // ever live at once.
      start: "top center",
      end: "bottom center",
      onUpdate: (self) => setDepth(from + (to - from) * self.progress),
    });
  });
}

/* ── 4. Chapter 0 — scrubbing the descent ───────────────────────────────
   The clip is all-intra encoded, so seeking to an arbitrary frame is cheap
   and the scrub does not stutter.                                         */

const HERO = "#hero";
const band = (sel) => Number($(sel).dataset.depthTo) - Number($(sel).dataset.depthFrom);

function setupHero() {
  const video = $("#descent");
  const copy  = $(".hero__copy");
  const hint  = $(".hero__hint");

  // Created immediately, in DOM order. ScrollTrigger computes pin spacing in
  // creation order, so deferring this until the video reports metadata (or
  // never, if the file 404s) leaves every later chapter measured against a
  // hero that was never pinned.
  ScrollTrigger.create({
    trigger: "#hero",
    pin: true,
    start: "top top",
    end: "+=420%",
    scrub: 0.6,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const d = video.duration;
      // A stalled or malformed file reports 0, NaN or Infinity; multiplying by
      // it yields a currentTime the browser silently discards.
      if (Number.isFinite(d) && d > 0) video.currentTime = self.progress * d;
      setDepth(band(HERO) * self.progress);
    },
  });

  // The title sinks and fades with the descent; it is gone by the halfway
  // point so the water has the frame to itself.
  gsap.to(copy, {
    yPercent: -18, opacity: 0, ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "+=210%", scrub: 0.6 },
  });
  gsap.to(hint, {
    opacity: 0, ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "+=60%", scrub: true },
  });

  video.addEventListener("loadedmetadata", () => ScrollTrigger.refresh(), { once: true });
}

/* ── 5. Chapter 1 — the ping ────────────────────────────────────────────
   The signature interaction. A wavefront leaves the can at a constant speed
   (sound speed does not vary in a uniform medium) and its amplitude decays
   with the square of the radius, because a fixed amount of energy is spread
   over an expanding circle. A word switches on exactly as the front reaches
   it — the reveal is not a timed effect, it is the geometry.              */

function setupPing() {
  const pingEl = $("#ping");
  const PINGB = [Number(pingEl.dataset.depthFrom), Number(pingEl.dataset.depthTo)];
  const canvas = $("#pingCanvas");
  const ctx = canvas.getContext("2d");
  const words = [
    ...splitWords($("#pingLine"), "w"),
    ...splitWords($("#pingBody"), "w"),
  ];

  // Origin sits where the can hangs in the frame: lower right.
  const ORIGIN = { fx: 0.70, fy: 0.58 };
  let W = 0, H = 0, ox = 0, oy = 0, rMax = 1, dists = [];

  function measure() {
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ox = W * ORIGIN.fx; oy = H * ORIGIN.fy;
    rMax = Math.max(
      Math.hypot(ox, oy), Math.hypot(W - ox, oy),
      Math.hypot(ox, H - oy), Math.hypot(W - ox, H - oy)
    );

    const cr = canvas.getBoundingClientRect();
    dists = words.map((w) => {
      const b = w.getBoundingClientRect();
      return Math.hypot((b.left + b.width / 2) - (cr.left + ox), (b.top + b.height / 2) - (cr.top + oy));
    });
  }

  const BAND = 150;          // px of ramp behind the wavefront
  const TRAIL = [0, 110, 220]; // trailing rings, in px behind the front

  function draw(front) {
    ctx.clearRect(0, 0, W, H);
    for (const back of TRAIL) {
      const r = front - back;
      if (r <= 0) continue;
      // Inverse-square amplitude falloff, normalised so the first metres
      // are not blindingly bright.
      const amp = 1 / (1 + Math.pow(r / 260, 2));
      const alpha = amp * (back === 0 ? 0.55 : 0.22);
      if (alpha < 0.004) continue;
      ctx.beginPath();
      ctx.arc(ox, oy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(79, 224, 210, ${alpha.toFixed(4)})`;
      ctx.lineWidth = back === 0 ? 1.6 : 1;
      ctx.stroke();
    }
  }

  function apply(front) {
    draw(front);
    for (let i = 0; i < words.length; i++) {
      const o = clamp((front - dists[i]) / BAND, 0, 1);
      const w = words[i];
      w.style.opacity = o;
      w.style.transform = `translate3d(0,${((1 - o) * 10).toFixed(2)}px,0)`;
    }
  }

  measure();
  apply(0);

  ScrollTrigger.create({
    trigger: "#ping",
    pin: true,
    start: "top top",
    end: "+=320%",
    scrub: 0.5,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      apply(self.progress * rMax * 1.18);
      setDepth(PINGB[0] + (PINGB[1] - PINGB[0]) * self.progress);
    },
    onRefreshInit: measure,
  });

  ScrollTrigger.addEventListener("refreshInit", measure);
}

/* ── 6. Chapter reveals and parallax ────────────────────────────────────── */

function setupReveals() {
  for (const el of $$("[data-reveal]")) {
    const trigger = { trigger: el, start: "top 85%", once: true };

    // Word splitting rebuilds an element's children from its text, which would
    // flatten any markup inside it — a list item's label and paragraph would
    // collapse into one run of words. Only leaf elements get split; containers
    // rise as a whole.
    if (el.children.length > 0) {
      gsap.fromTo(el,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: trigger });
      continue;
    }

    const inners = splitWords(el, "reveal");
    gsap.set(inners, { yPercent: 110 });
    gsap.to(inners, {
      yPercent: 0, duration: 0.9, ease: "power3.out", stagger: 0.045,
      scrollTrigger: trigger,
    });
  }
}

/* Parallax is deliberately small. Anything larger reads as a slideshow,
   and on a full-bleed image it exposes the crop edges. */
function setupParallax() {
  for (const [sel, amount] of [["#sourceImg", 8], ["#surfaceImg", 10]]) {
    gsap.fromTo(sel,
      { yPercent: -amount / 2, scale: 1.06 },
      { yPercent: amount / 2, ease: "none",
        scrollTrigger: { trigger: sel, start: "top bottom", end: "bottom top", scrub: true } });
  }
}

/* ── 7. Boot ────────────────────────────────────────────────────────────── */

function boot() {
  wireMedia();

  if (REDUCED) {
    // Full static branch: no pin, no scrub, no wavefront. Every chapter
    // becomes an ordinary section and all copy is visible immediately.
    const d = $("#depthVal");
    if (d) d.textContent = "940";
    $("#pingCanvas")?.remove();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ lerp: 0.085 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  initDepthOutput();
  setupHero();
  setupPing();
  setupReveals();
  setupParallax();
  setupDepthSections();  // must come last — see the note on creation order

  // Line breaks depend on the real fonts; re-measure once they land.
  if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

  let t;
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(() => ScrollTrigger.refresh(), 180);
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
