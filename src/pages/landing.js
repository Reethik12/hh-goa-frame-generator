/* ============================================================
   HH Goa 2026 — Landing Page
   Renders the hero section with video, branding, and CTA.
   ============================================================ */

import { renderEditor } from './editor.js';

/**
 * Check if user prefers reduced motion.
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Render the full landing page into the given container.
 * @param {HTMLElement} container
 */
export function renderLanding(container) {
  const reducedMotion = prefersReducedMotion();

  container.innerHTML = `
    <main class="landing" role="main">

      <!-- Hero Video Background -->
      <div class="hero-video-wrap ${reducedMotion ? 'is-hidden' : ''}" aria-hidden="true">
        <video
          class="hero-video"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
        >
          <source src="/assets/video/Prehype.mp4" type="video/mp4" />
        </video>
      </div>

      <!-- Static fallback for reduced motion -->
      <div class="hero-static-bg ${reducedMotion ? 'is-active' : ''}" aria-hidden="true"></div>

      <!-- Overlay -->
      <div class="hero-overlay" aria-hidden="true"></div>

      <!-- Film grain -->
      <div class="hero-grain" aria-hidden="true"></div>

      <!-- Decorative: Ticker borders -->
      <div class="deco-ticker-top" aria-hidden="true">
        <img src="/assets/decorations/138-frame-1948755142-54-27257.svg" alt="" loading="lazy" />
      </div>
      <div class="deco-ticker-bottom" aria-hidden="true">
        <img src="/assets/decorations/140-frame-1948755145-54-27273.svg" alt="" loading="lazy" />
      </div>

      <!-- Decorative: Corner crosshair markers -->
      <img class="deco-corner-marker top-left" src="/assets/decorations/180-frame-1948754793-54-30952.svg" alt="" aria-hidden="true" />
      <img class="deco-corner-marker top-right" src="/assets/decorations/180-frame-1948754793-54-30952.svg" alt="" aria-hidden="true" />
      <img class="deco-corner-marker bottom-left" src="/assets/decorations/180-frame-1948754793-54-30952.svg" alt="" aria-hidden="true" />
      <img class="deco-corner-marker bottom-right" src="/assets/decorations/180-frame-1948754793-54-30952.svg" alt="" aria-hidden="true" />

      <!-- Decorative: Star accents -->
      <img class="deco-star pos-1" src="/assets/decorations/181-frame-1948754789-54-30958.svg" alt="" aria-hidden="true" />
      <img class="deco-star pos-2" src="/assets/decorations/181-frame-1948754789-54-30958.svg" alt="" aria-hidden="true" />
      <img class="deco-star pos-3" src="/assets/decorations/181-frame-1948754789-54-30958.svg" alt="" aria-hidden="true" />

      <!-- Decorative: Wave curve -->
      <img class="deco-wave" src="/assets/decorations/2-47.svg" alt="" aria-hidden="true" loading="lazy" />

      <!-- Hero Content -->
      <section class="hero-content">

        <!-- Brand composition -->
        <div class="hero-brand">
          <img
            class="hero-logo"
            src="/assets/logos/Hacker house.png"
            alt="Hacker House logo"
            width="480"
            height="99"
          />
          <div class="hero-brand-row">
            <img
              class="hero-hindi-badge"
              src="/assets/logos/goa_hindi.svg"
              alt="Goa in Hindi script"
              width="48"
              height="48"
            />
            <span class="hero-year-badge">GOA · 2026</span>
            <img
              class="hero-brand-emblem"
              src="/assets/logos/036-vector-54-3934.svg"
              alt="HH brand emblem"
              width="40"
              height="35"
            />
          </div>
        </div>

        <!-- Zigzag divider -->
        <img
          class="deco-zigzag above-cta"
          src="/assets/decorations/002-group-54-14.svg"
          alt=""
          aria-hidden="true"
        />

        <!-- Headline -->
        <h1 class="hero-headline">
          Build Your<br /><em>Goa Identity</em>
        </h1>

        <!-- Supporting copy -->
        <p class="hero-sub">
          Create your own <strong>Hacker House Goa</strong>-inspired builder identity card.
          Solo or crew — design it, download it, share it.
        </p>

        <!-- CTA -->
        <button class="cta-primary" id="cta-create" type="button" aria-label="Create your builder card">
          <span class="cta-label">Create Your Card</span>
          <span class="cta-arrow" aria-hidden="true">→</span>
        </button>

        <!-- No login badge -->
        <span class="hero-badge">No Login · Just Build</span>

      </section>

    </main>
  `;

  // ── Navigation to Editor ──

  const ctaButton = container.querySelector('#cta-create');
  ctaButton?.addEventListener('click', () => {
    renderEditor(container);
  });

  // ── Reduced Motion Listener (live toggle) ──

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  motionQuery.addEventListener('change', (e) => {
    const videoWrap = container.querySelector('.hero-video-wrap');
    const staticBg = container.querySelector('.hero-static-bg');
    const video = container.querySelector('.hero-video');

    if (e.matches) {
      videoWrap?.classList.add('is-hidden');
      staticBg?.classList.add('is-active');
      video?.pause();
    } else {
      videoWrap?.classList.remove('is-hidden');
      staticBg?.classList.remove('is-active');
      video?.play();
    }
  });

  // ── Pause video when tab is not visible (performance) ──

  document.addEventListener('visibilitychange', () => {
    const video = container.querySelector('.hero-video');
    if (!video) return;
    if (document.hidden) {
      video.pause();
    } else if (!prefersReducedMotion()) {
      video.play();
    }
  });
}
