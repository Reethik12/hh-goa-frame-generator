/* ============================================================
   HH Goa 2026 — Code 128 Barcode Generator & Canvas Renderer
   Pure client-side Code 128 B barcode encoder and renderer.
   Defensively structured to handle missing or undefined inputs
   without crashing card export rendering.
   ============================================================ */

// Code 128 B pattern lookup table (indices 0 to 106)
// Each pattern string represents bar (1) and space (0) module widths
const CODE128_PATTERNS = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213", // 0-9
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132", // 10-19
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211", // 20-29
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313", // 30-39
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331", // 40-49
  "231131", "311123", "311321", "331121", "312113", "312311", "332111", "314111", "221411", "431111", // 50-59
  "111224", "111422", "121124", "121421", "141122", "141221", "112214", "112412", "122114", "122411", // 60-69
  "142112", "142211", "241211", "221114", "413111", "241112", "134111", "111242", "121142", "121241", // 70-79
  "114212", "124112", "124211", "411212", "421112", "421211", "212141", "214121", "412121", "111143", // 80-89
  "111341", "131141", "114113", "114311", "411113", "411311", "113141", "114131", "311141", "411131", // 90-99
  "211412", "211214", "211232", "211412", "211214", "211232", "2331112" // 100-106 (104 = Start B, 106 = Stop)
];

const START_B_INDEX = 104; // Code 128 Start B
const STOP_INDEX = 106;    // Code 128 Stop pattern

/**
 * Encode an ASCII string into Code 128 B module widths array.
 * @param {any} text - The input text to encode into barcode
 * @returns {number[]} Array of module widths (in bars and spaces)
 */
export function encodeCode128B(text) {
  if (text === undefined || text === null) {
    return [];
  }

  const val = String(text).trim();
  if (!val) {
    return [];
  }

  const codeIndices = [START_B_INDEX];
  let checksum = START_B_INDEX;

  for (let i = 0; i < val.length; i++) {
    const charCode = val.charCodeAt(i);
    const codeIndex = charCode - 32; // Code 128 B maps ASCII 32-127 to indices 0-95
    if (codeIndex >= 0 && codeIndex <= 95) {
      codeIndices.push(codeIndex);
      checksum += codeIndex * (i + 1);
    }
  }

  const checksumIndex = checksum % 103;
  codeIndices.push(checksumIndex);
  codeIndices.push(STOP_INDEX);

  // Convert pattern strings to numeric module widths
  const modules = [];
  codeIndices.forEach((idx) => {
    let pat = CODE128_PATTERNS[idx];
    if (!pat && idx === START_B_INDEX) pat = "211214";
    if (!pat && idx === STOP_INDEX) pat = "2331112";
    if (!pat || typeof pat !== "string") return;

    for (let c = 0; c < pat.length; c++) {
      modules.push(parseInt(pat[c], 10));
    }
  });

  return modules;
}

/**
 * Render a Code 128 Barcode directly onto a 2D Canvas context.
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {any} text - e.g. "HH-GOA-26-9X2M"
 * @param {number} x - Left X position
 * @param {number} y - Top Y position
 * @param {number} width - Total target barcode width in px
 * @param {number} height - Total target barcode height in px (bars only)
 * @param {Object} [options]
 * @param {string} [options.barColor] - Bar color (default '#0A0A0A')
 * @param {string} [options.bgColor] - Background color (default '#FAFAFA')
 * @param {boolean} [options.showText] - Whether to draw text below (default true)
 * @param {string} [options.textColor] - Text color (default '#0A0A0A')
 */
export function drawBarcodeOnCanvas(ctx, text, x, y, width, height, options = {}) {
  if (!ctx) return;
  if (text === undefined || text === null) {
    return;
  }

  const value = String(text).trim();
  if (!value) {
    return;
  }

  let {
    barColor = '#0A0A0A',
    bgColor = '#FAFAFA',
    showText = true,
    textColor = '#0A0A0A'
  } = options;

  if (!bgColor || bgColor === 'transparent') bgColor = '#FAFAFA';
  if (!barColor || barColor === bgColor) barColor = '#0A0A0A';
  if (bgColor.toUpperCase().includes('FFF') && barColor.toUpperCase().includes('FFF')) {
    barColor = '#0A0A0A';
    textColor = '#0A0A0A';
  }

  const modules = encodeCode128B(value);
  if (!modules || !Array.isArray(modules) || modules.length === 0) {
    return;
  }

  const totalModuleUnits = modules.reduce((sum, w) => sum + w, 0);
  if (!totalModuleUnits || totalModuleUnits <= 0) return;

  const moduleWidth = width / totalModuleUnits;

  ctx.save();

  // Background Quiet Zone Box
  const padding = 16;
  const textHeight = showText ? 44 : 0;
  const totalBoxH = height + padding * 2 + textHeight;

  ctx.fillStyle = bgColor;
  ctx.fillRect(x - padding, y - padding, width + padding * 2, totalBoxH);

  // Draw Bars
  let currX = x;
  let isBar = true; // Alternates bar (true) and space (false)

  for (let i = 0; i < modules.length; i++) {
    const w = modules[i] * moduleWidth;
    if (isBar) {
      ctx.fillStyle = barColor;
      ctx.fillRect(currX, y, w, height);
    }
    currX += w;
    isBar = !isBar;
  }

  // Human-readable text below barcode
  if (showText) {
    ctx.font = '700 28px "Victor Mono", monospace';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.letterSpacing = '4px';
    ctx.fillText(value.toUpperCase(), x + width / 2, y + height + 10);
  }

  ctx.restore();
}
