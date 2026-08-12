/* ============================================================
   HH Goa 2026 — Image Loader & Cache
   Pre-loads and caches image/SVG assets for high-performance
   canvas rendering.
   ============================================================ */

import { getAssetUrl } from './assetPath.js';

const cache = new Map();

/**
 * Load an image from a URL and cache it.
 * @param {string} src
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(src) {
  if (!src) return Promise.reject(new Error('No src provided'));
  const resolvedSrc = getAssetUrl(src);

  if (cache.has(src)) {
    const cached = cache.get(src);
    if (cached.complete && cached.naturalWidth > 0) {
      return Promise.resolve(cached);
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    if (resolvedSrc.startsWith('http://') || resolvedSrc.startsWith('https://')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      cache.set(src, img);
      cache.set(resolvedSrc, img);
      resolve(img);
    };
    img.onerror = (err) => {
      console.warn(`Failed to load asset image: ${resolvedSrc}`, err);
      reject(err);
    };
    img.src = resolvedSrc;
  });
}

/**
 * Pre-load a list of image URLs.
 * @param {string[]} urls
 * @returns {Promise<HTMLImageElement[]>}
 */
export function preloadImages(urls) {
  return Promise.all(urls.map((url) => loadImage(url).catch(() => null)));
}

/**
 * Get an image synchronously from cache (returns null if not yet loaded).
 * @param {string} src
 * @returns {HTMLImageElement|null}
 */
export function getCachedImage(src) {
  const resolvedSrc = getAssetUrl(src);
  const cached = cache.get(src) || cache.get(resolvedSrc);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return cached;
  }
  return null;
}
