/* ============================================================
   HH Goa 2026 — Asset Path Helper
   Ensures static public assets resolve correctly both in local
   development (/) and under subpath deployment (/hh-goa-frame-generator/).
   ============================================================ */

/**
 * Prefix an asset path with the active Vite BASE_URL.
 * @param {string} path - asset path (e.g. '/assets/logos/Hacker house.png')
 * @returns {string} resolved asset URL
 */
export function getAssetUrl(path) {
  if (!path || typeof path !== 'string') return path;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = (typeof import.meta !== 'undefined' && import.meta?.env?.BASE_URL) ? import.meta.env.BASE_URL : '/';
  return baseUrl.endsWith('/') ? `${baseUrl}${cleanPath}` : `${baseUrl}/${cleanPath}`;
}
