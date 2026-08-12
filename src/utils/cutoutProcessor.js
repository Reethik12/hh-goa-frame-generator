/* ============================================================
   HH Goa 2026 — Automatic Paper Cutout & Background Remover
   Extracts subject from photo, removes background using color-distance
   & contrast mask, applies thick white paper silhouette outline, and
   optional screen-printed monochrome/color filter.
   ============================================================ */

/**
 * Automatically processes a photo into a paper cutout object with white outline.
 * @param {HTMLImageElement|HTMLCanvasElement} img 
 * @param {Object} [options]
 * @param {boolean} [options.monochrome=true] - Convert subject to high-contrast screen print monochrome
 * @param {number} [options.outlineWidth=24] - Thickness of white paper silhouette border in px
 * @param {string} [options.outlineColor='#FDFDFD'] - Paper outline color
 * @returns {Promise<{subjectCanvas: HTMLCanvasElement, outlineCanvas: HTMLCanvasElement, width: number, height: number}>}
 */
export async function createPaperCutoutFromImage(img, options = {}) {
  const monochrome = options.monochrome !== undefined ? options.monochrome : true;
  const outlineWidth = options.outlineWidth || 28;
  const outlineColor = options.outlineColor || '#FDFDFD';

  const w = img.naturalWidth || img.width || 800;
  const h = img.naturalHeight || img.height || 1000;

  // 1. Create source canvas
  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = w;
  srcCanvas.height = h;
  const sCtx = srcCanvas.getContext('2d');
  sCtx.drawImage(img, 0, 0, w, h);

  const imgData = sCtx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // 2. Sample background color from 4 corners and borders
  const bgSamples = [];
  function samplePixel(x, y) {
    const idx = (y * w + x) * 4;
    return [data[idx], data[idx + 1], data[idx + 2]];
  }

  // Corners
  bgSamples.push(samplePixel(2, 2));
  bgSamples.push(samplePixel(w - 3, 2));
  bgSamples.push(samplePixel(2, h - 3));
  bgSamples.push(samplePixel(w - 3, h - 3));

  // Top border sampling
  for (let x = 10; x < w; x += Math.floor(w / 8)) {
    bgSamples.push(samplePixel(x, 4));
  }

  // Average background color
  let avgR = 0, avgG = 0, avgB = 0;
  bgSamples.forEach(([r, g, b]) => { avgR += r; avgG += g; avgB += b; });
  avgR /= bgSamples.length;
  avgG /= bgSamples.length;
  avgB /= bgSamples.length;

  // 3. Create Subject Cutout Canvas
  const subjectCanvas = document.createElement('canvas');
  subjectCanvas.width = w;
  subjectCanvas.height = h;
  const subCtx = subjectCanvas.getContext('2d');
  const subImgData = subCtx.createImageData(w, h);
  const subData = subImgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Color distance to background
    const dist = Math.sqrt((r - avgR) ** 2 + (g - avgG) ** 2 + (b - avgB) ** 2);
    
    // Smooth alpha threshold
    let alpha = 255;
    if (dist < 32) {
      alpha = 0;
    } else if (dist < 65) {
      alpha = Math.floor(((dist - 32) / 33) * 255);
    }

    if (a < 50) alpha = 0;

    if (monochrome && alpha > 0) {
      // Screen-print monochrome treatment matching visual reference photo
      let gray = 0.299 * r + 0.587 * g + 0.114 * b;
      // High contrast curves
      gray = Math.min(255, Math.max(0, (gray - 128) * 1.2 + 128));
      subData[i] = gray;
      subData[i + 1] = gray;
      subData[i + 2] = gray;
      subData[i + 3] = Math.min(a, alpha);
    } else {
      subData[i] = r;
      subData[i + 1] = g;
      subData[i + 2] = b;
      subData[i + 3] = Math.min(a, alpha);
    }
  }

  subCtx.putImageData(subImgData, 0, 0);

  // 4. Create Dilated White Paper Silhouette Outline Canvas
  const outlineCanvas = document.createElement('canvas');
  outlineCanvas.width = w;
  outlineCanvas.height = h;
  const oCtx = outlineCanvas.getContext('2d');

  // Radial Dilation
  const steps = 32;
  for (let i = 0; i < steps; i++) {
    const angle = (i * Math.PI * 2) / steps;
    const dx = Math.cos(angle) * outlineWidth;
    const dy = Math.sin(angle) * outlineWidth;
    oCtx.drawImage(subjectCanvas, dx, dy);
  }

  // Replace non-transparent pixels with paper white outline color
  oCtx.globalCompositeOperation = 'source-in';
  oCtx.fillStyle = outlineColor;
  oCtx.fillRect(0, 0, w, h);

  return {
    subjectCanvas,
    outlineCanvas,
    width: w,
    height: h
  };
}
