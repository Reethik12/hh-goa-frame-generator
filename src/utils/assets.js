/* ============================================================
   HH Goa 2026 — Asset Loader Helper
   Loads official Hacker House logo and decorative vector assets.
   ============================================================ */

import { loadImage, getCachedImage } from './imageLoader.js';

export async function loadHackerHouseLogo() {
  const src = '/assets/logos/Hacker house.png';
  try {
    return await loadImage(src);
  } catch (e) {
    console.warn('Failed to load Hacker House logo:', e);
    return getCachedImage(src);
  }
}

export async function loadLogoVector() {
  const src = '/assets/logos/036-vector-54-3934.svg';
  try {
    return await loadImage(src);
  } catch (e) {
    return getCachedImage(src);
  }
}
