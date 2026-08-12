/* ============================================================
   HH Goa 2026 — Paper Cutout Silhouette Processor
   Performs background removal, alpha dilation for white paper border,
   paper grain texturing, drop shadow, and monochrome/duotone filter.
   ============================================================ */

/**
 * Extracts person alpha image from source URL, Blob, or Image Element.
 * @param {HTMLImageElement|Blob|string} source
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function getPersonAlphaImage(source) {
  let imgElement = null;

  if (source instanceof HTMLImageElement || source instanceof HTMLCanvasElement) {
    imgElement = source;
  } else if (typeof source === 'string') {
    imgElement = new Image();
    imgElement.crossOrigin = 'anonymous';
    imgElement.src = source;
    await new Promise((res, rej) => { imgElement.onload = res; imgElement.onerror = rej; });
  } else if (source instanceof Blob) {
    const url = URL.createObjectURL(source);
    imgElement = new Image();
    imgElement.src = url;
    await new Promise((res, rej) => { imgElement.onload = res; imgElement.onerror = rej; });
    URL.revokeObjectURL(url);
  }

  const w = imgElement.naturalWidth || imgElement.width || 800;
  const h = imgElement.naturalHeight || imgElement.height || 1000;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgElement, 0, 0, w, h);

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // Sample background color from 4 corners and borders
  const bgSamples = [];
  function samplePixel(x, y) {
    const idx = (y * w + x) * 4;
    return [data[idx], data[idx + 1], data[idx + 2]];
  }

  bgSamples.push(samplePixel(2, 2));
  bgSamples.push(samplePixel(w - 3, 2));
  bgSamples.push(samplePixel(2, h - 3));
  bgSamples.push(samplePixel(w - 3, h - 3));

  for (let x = 10; x < w; x += Math.floor(w / 8)) {
    bgSamples.push(samplePixel(x, 4));
  }

  let avgR = 0, avgG = 0, avgB = 0;
  bgSamples.forEach(([r, g, b]) => { avgR += r; avgG += g; avgB += b; });
  avgR /= bgSamples.length;
  avgG /= bgSamples.length;
  avgB /= bgSamples.length;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    const dist = Math.sqrt((r - avgR) ** 2 + (g - avgG) ** 2 + (b - avgB) ** 2);
    let alpha = 255;
    if (dist < 34) {
      alpha = 0;
    } else if (dist < 68) {
      alpha = Math.floor(((dist - 34) / 34) * 255);
    }

    if (a < 50) alpha = 0;
    data[i + 3] = Math.min(a, alpha);
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

/**
 * Builds paper-cutout composite layer from alpha silhouette canvas.
 * @param {HTMLCanvasElement} personCanvas 
 * @param {Object} [opts] 
 * @returns {{canvas: HTMLCanvasElement, offsetX: number, offsetY: number, width: number, height: number}}
 */
export function buildPaperCutoutLayer(personCanvas, opts = {}) {
  const {
    borderPx = 28,
    paperColor = '#FDF8F0',
    shadowColor = 'rgba(10,10,10,0.38)',
    shadowOffsetY = 18,
    shadowBlur = 40,
    monochrome = true,
  } = opts;

  const w = personCanvas.width;
  const h = personCanvas.height;
  const pad = borderPx * 4;

  const off = document.createElement('canvas');
  off.width = w + pad * 2;
  off.height = h + pad * 2;
  const ctx = off.getContext('2d');

  // 1. Extract alpha mask into its own canvas
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = off.width;
  maskCanvas.height = off.height;
  const maskCtx = maskCanvas.getContext('2d');
  maskCtx.drawImage(personCanvas, pad, pad);
  const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);

  // 2. Dilate the alpha channel to create irregular paper border
  const dilated = dilateAlpha(maskData, borderPx);
  maskCtx.putImageData(dilated, 0, 0);

  // 3. Drop shadow: blurred, offset silhouette of dilated mask
  ctx.save();
  ctx.filter = `blur(${shadowBlur}px)`;
  ctx.globalAlpha = 0.9;
  ctx.drawImage(maskCanvas, 0, shadowOffsetY);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = shadowColor;
  ctx.fillRect(0, 0, off.width, off.height);
  ctx.restore();

  // 4. Paper border: dilated silhouette filled with warm paper + grain
  ctx.save();
  ctx.drawImage(maskCanvas, 0, 0);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = paperColor;
  ctx.fillRect(0, 0, off.width, off.height);
  ctx.globalCompositeOperation = 'source-over';
  drawPaperGrain(ctx, off.width, off.height, 0.08);
  ctx.restore();

  // 5. The actual person on top (monochrome or color)
  ctx.save();
  if (monochrome) {
    ctx.filter = 'grayscale(1) contrast(1.18)';
  }
  ctx.drawImage(personCanvas, pad, pad);
  ctx.restore();

  return {
    canvas: off,
    offsetX: -pad,
    offsetY: -pad,
    width: off.width,
    height: off.height
  };
}

/** Dilate alpha channel outward by `radius` px */
function dilateAlpha(imageData, radius) {
  const { width, height, data } = imageData;
  const src = new Uint8ClampedArray(data);
  const out = new Uint8ClampedArray(data);
  const r = Math.max(1, Math.round(radius));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let maxA = 0;
      for (let dy = -r; dy <= r; dy += Math.max(1, Math.floor(r / 3))) {
        for (let dx = -r; dx <= r; dx += Math.max(1, Math.floor(r / 3))) {
          if (dx * dx + dy * dy > r * r) continue;
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const a = src[(ny * width + nx) * 4 + 3];
          if (a > maxA) maxA = a;
        }
      }
      const i = (y * width + x) * 4;
      out[i] = 253; out[i + 1] = 248; out[i + 2] = 240; // paper color #FDF8F0
      out[i + 3] = maxA;
    }
  }
  return new ImageData(out, width, height);
}

/** Subtle paper grain texture */
function drawPaperGrain(ctx, w, h, intensity = 0.08) {
  ctx.save();
  ctx.globalCompositeOperation = 'source-atop';
  const dotCount = Math.floor((w * h) / 900);
  for (let i = 0; i < dotCount; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const a = Math.random() * intensity;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(10,10,10,${a})` : `rgba(255,255,255,${a})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }
  ctx.restore();
}
