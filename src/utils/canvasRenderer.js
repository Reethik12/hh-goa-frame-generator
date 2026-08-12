/* ============================================================
   HH Goa 2026 — Authoritative Poster Canvas Renderer
   Single shared renderer function for Live Preview & PNG Export.
   Canvas resolution: 2160 × 2700 px (4:5 Portrait) & 3840 x 2160 (16:9 Landscape).
   ============================================================ */

import { getCachedImage, loadImage } from './imageLoader.js';
import { loadHackerHouseLogo } from './assets.js';
import { getPersonAlphaImage, buildPaperCutoutLayer } from './paperCutout.js';
import { drawQRCodeOnCanvas } from './qrGenerator.js';
import { formatQRPayload } from './identityData.js';
import { getAssetUrl } from './assetPath.js';

export const CANVAS_WIDTH = 2160;
export const CANVAS_HEIGHT = 2700;

export const CREW2_WIDTH = 3840;
export const CREW2_HEIGHT = 2160;

const COLORS = {
  green: '#06402B',
  greenDark: '#043321',
  greenLight: '#0A5A3D',
  pink: '#FF0080',
  yellow: '#E2F524',
  paper: '#FDF8F0',
  paperShadow: '#E8DFC8',
  black: '#0A0A0A',
};

const FONT_DISPLAY = "'Anton', 'Archivo Black', 'Imbue', sans-serif";
const FONT_PRIMARY = "'Archivo', 'Inter', sans-serif";
const FONT_MONO = "'Space Mono', 'Victor Mono', monospace";

const ASSETS = {
  bgAgenda: '/assets/backgrounds/agenda.png',
  bgDetails: '/assets/backgrounds/details.png',
  bgSunrise: '/assets/backgrounds/Sun rise.png',
  bgHackers: '/assets/backgrounds/hackers.png',
  bgPalms: '/assets/backgrounds/footer trees.png',
  logoHackerHouse: '/assets/logos/Hacker house.png',
  logoHindi: '/assets/logos/goa_hindi.svg',
  logoEmblemYellow: '/assets/logos/036-vector-54-3934.svg',
  waveCurve: '/assets/decorations/2-47.svg',
  footerTrees: '/assets/backgrounds/footer trees.png'
};

/** Preload core assets */
export async function preloadStyle1Assets() {
  const promises = Object.values(ASSETS).map(url => loadImage(url).catch(() => null));
  await Promise.all(promises);
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
}

/** Cache for processed paper cutouts */
const cutoutCache = new Map();

async function getProcessedCutout(photoImg, monochrome = true) {
  if (!photoImg) return null;
  const key = `${photoImg.src || photoImg.currentSrc || 'canvas'}_${monochrome}`;
  if (cutoutCache.has(key)) {
    return cutoutCache.get(key);
  }

  try {
    const alphaCanvas = await getPersonAlphaImage(photoImg);
    const cutoutLayer = buildPaperCutoutLayer(alphaCanvas, {
      borderPx: 28,
      paperColor: COLORS.paper,
      shadowColor: 'rgba(10,10,10,0.38)',
      shadowOffsetY: 18,
      shadowBlur: 40,
      monochrome
    });
    cutoutCache.set(key, cutoutLayer);
    return cutoutLayer;
  } catch (e) {
    console.warn('Failed to generate paper cutout layer:', e);
    return null;
  }
}

/**
 * Single authoritative render function.
 * Called identically by live preview and high-res PNG export.
 */
export async function renderCardCanvas(canvas, data = {}, options = {}) {
  if (data.mode === 'team') {
    if (data.crewSize === 3) {
      return renderCrewOf3Poster(canvas, data);
    }
    return renderCrewOf2Poster(canvas, data);
  }
  return renderIndividualPoster(canvas, data);
}

// ══════════════════════════════════════════════════════════════
// INDIVIDUAL POSTER RENDERER (2160 × 2700 px, 4:5 Portrait)
// ══════════════════════════════════════════════════════════════

async function renderIndividualPoster(canvas, data) {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = CANVAS_WIDTH;
  const H = CANVAS_HEIGHT;

  const {
    name = 'KISHAN R',
    stack = 'PYTHON · DEVOPS · AI',
    role = 'CODE NAVIGATOR BUILDER',
    builderClass = 'ARCHITECT',
    builderId = 'HH-GOA-26-9X2M',
    socialHandle = '@kishan',
    photoImg = null,
    monochrome = true,
    bgChoice = 'agenda',
    speechText = 'Level sabke niklege...'
  } = data;

  const identityPayload = {
    mode: 'individual',
    name, stack, role, builderClass, builderId, socialHandle
  };

  // ── 1. BASE BACKGROUND & TROPICAL WALLPAPER ──
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, COLORS.greenLight);
  bgGrad.addColorStop(0.55, COLORS.green);
  bgGrad.addColorStop(1, COLORS.greenDark);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Background wallpaper overlay
  let bgImgUrl = ASSETS.bgAgenda;
  if (bgChoice === 'sunrise') bgImgUrl = ASSETS.bgSunrise;
  else if (bgChoice === 'details') bgImgUrl = ASSETS.bgDetails;
  else if (bgChoice === 'hackers') bgImgUrl = ASSETS.bgHackers;
  else if (bgChoice === 'palms') bgImgUrl = ASSETS.bgPalms;

  const bgImg = getCachedImage(bgImgUrl);
  if (bgImg && bgChoice !== 'solid') {
    ctx.save();
    ctx.globalAlpha = 0.14;
    const scale = Math.max(W / bgImg.naturalWidth, H / bgImg.naturalHeight);
    const bw = bgImg.naturalWidth * scale;
    const bh = bgImg.naturalHeight * scale;
    ctx.drawImage(bgImg, (W - bw) / 2, (H - bh) / 2, bw, bh);
    ctx.restore();
  }

  // ── 2. LEFT BAMBOO / PALM GRAPHIC (fill left vertical area) ──
  const leftPalmImg = getCachedImage(ASSETS.bgPalms);
  if (leftPalmImg) {
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.drawImage(leftPalmImg, -60, 160, 560, 1900);
    ctx.restore();
  }

  // ── 3. HEADLINE: "HACKER HOUSE" (left aligned) ──
  ctx.save();
  ctx.font = `900 220px ${FONT_DISPLAY}`;
  ctx.fillStyle = COLORS.yellow;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.letterSpacing = '-2px';
  ctx.fillText('HACKER', 120, 100);
  ctx.fillText('HOUSE', 120, 320);
  ctx.restore();

  // ── 4. TOP-RIGHT BRANDING: HACKER HOUSE LOGO + ENLARGED HINDI GOA MARK + 247 STUDIOS ──
  // A. Hacker House Real Logo (moved slightly down to y:160)
  const logo = await loadHackerHouseLogo();
  if (logo) {
    const lbX = 1800, lbY = 160, lbW = 240, lbH = 240;
    const lW = logo.naturalWidth || logo.width || 300;
    const lH = logo.naturalHeight || logo.height || 100;
    const lScale = Math.min(lbW / lW, lbH / lH);
    const drawW = lW * lScale;
    const drawH = lH * lScale;
    ctx.drawImage(logo, lbX + (lbW - drawW) / 2, lbY + (lbH - drawH) / 2, drawW, drawH);
  }

  // E. Enlarged Hindi Goa Mark (placed close to Hacker House logo, filling middle-right)
  const hindiLogo = getCachedImage(ASSETS.logoHindi);
  if (hindiLogo) {
    ctx.save();
    ctx.shadowColor = 'rgba(10, 10, 10, 0.45)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    ctx.drawImage(hindiLogo, 1640, 150, 180, 180);
    ctx.restore();
  }

  // D. Real 247 Studios Logo (100% full opacity, enlarged, sharp & clean in top-right)
  const studioLogo = getCachedImage(ASSETS.waveCurve);
  if (studioLogo) {
    ctx.save();
    ctx.globalAlpha = 1.0; // 100% opacity
    ctx.globalCompositeOperation = 'source-over';
    const sBoxW = 440;
    const sW = studioLogo.naturalWidth || studioLogo.width || 400;
    const sH = studioLogo.naturalHeight || studioLogo.height || 170;
    const scale = sBoxW / sW;
    const drawW = sW * scale;
    const drawH = sH * scale;
    const drawX = 1600;
    const drawY = 370;
    ctx.drawImage(studioLogo, drawX, drawY, drawW, drawH);
    ctx.restore();
  }

  // ── 5. GOA · 2026 PINK TAG (moved down to y:640 to intentionally overlap upper portrait/chest) ──
  drawRotatedTag(ctx, {
    x: 140, y: 640, w: 520, h: 100, rotationDeg: -2,
    fill: COLORS.pink, textColor: COLORS.paper,
    text: 'GOA · 2026', font: `800 46px ${FONT_PRIMARY}`,
    letterSpacing: 0.04, shadow: true
  });

  // ── 6. HERO CUTOUT PERSON (NO FAINT 247 STAMP) ──
  let cutoutLayer = null;
  if (photoImg) {
    cutoutLayer = await getProcessedCutout(photoImg, monochrome);
  }

  const heroX = 260, heroY = 550, heroW = 1500, heroH = 1700;
  if (cutoutLayer) {
    const layerCanvas = cutoutLayer.canvas;
    const scale = Math.min(heroW / layerCanvas.width, heroH / layerCanvas.height);
    const drawW = layerCanvas.width * scale;
    const drawH = layerCanvas.height * scale;
    const drawX = heroX + (heroW - drawW) / 2 - 40;
    const drawY = heroY + heroH - drawH; // anchor to bottom

    ctx.drawImage(layerCanvas, drawX, drawY, drawW, drawH);
  } else {
    renderDefaultBuilderSilhouette(ctx, heroX + 150, heroY + 100, heroW - 300, heroH - 200);
  }

  // ── 7. SPEECH BUBBLE ──
  if (speechText) {
    renderSpeechBubble(ctx, speechText, 1480, 820, 520, 280);
  }

  // ══════════════════════════════════════════════════════════
  // 8. IDENTITY BLOCK — strict non-overlapping y-coordinates
  // ══════════════════════════════════════════════════════════

  // Step A: Role Pink Tag (y:2020, h:90)
  drawRotatedTag(ctx, {
    x: 260, y: 2020, w: 720, h: 90, rotationDeg: -2,
    fill: COLORS.pink, textColor: COLORS.paper,
    text: (role || 'CODE NAVIGATOR BUILDER').toUpperCase(),
    font: `700 38px ${FONT_PRIMARY}`, letterSpacing: 0.05
  });

  // Step B: Builder Name (y:2140, font 120px)
  const rawName = (name || 'KISHAN R').trim().toUpperCase();
  ctx.save();
  ctx.font = `900 120px ${FONT_DISPLAY}`;
  ctx.fillStyle = COLORS.black;
  ctx.fillText(rawName, 266, 2256);
  ctx.fillStyle = COLORS.yellow;
  ctx.fillText(rawName, 260, 2250);
  ctx.restore();

  // Step C: Stack Cream Strip (y:2310, h:85)
  drawRotatedTag(ctx, {
    x: 260, y: 2310, w: 940, h: 85, rotationDeg: -1.5,
    fill: COLORS.paper, textColor: COLORS.black,
    text: (stack || 'PYTHON · DEVOPS · AI').toUpperCase(),
    font: `600 34px ${FONT_PRIMARY}`, letterSpacing: 0.03
  });

  // Step D: Builder ID Chip (y:2440, h:60)
  ctx.save();
  const idX = 260, idY = 2440, idW = 600, idH = 60;
  ctx.fillStyle = COLORS.black;
  drawRoundedRect(ctx, idX, idY, idW, idH, 10);
  ctx.fill();
  ctx.strokeStyle = COLORS.yellow;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.font = `700 28px ${FONT_MONO}`;
  ctx.fillStyle = COLORS.yellow;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`BUILDER ID: ${(builderId || 'HH-GOA-26-9X2M').toUpperCase()}`, idX + idW / 2, idY + idH / 2 + 1);
  ctx.restore();

  // Step E: #FrameInGoa Footer Tag (y:2560)
  ctx.save();
  ctx.font = `500 30px ${FONT_MONO}`;
  ctx.fillStyle = COLORS.paper;
  ctx.globalAlpha = 0.7;
  ctx.fillText('#FRAMEINGOA', 120, 2580);
  ctx.restore();

  // ── 9. QR CODE STAMP (right side) ──
  const qrX = 1760, qrY = 2280, qrW = 280, qrH = 280;
  ctx.save();
  ctx.fillStyle = COLORS.paper;
  drawRoundedRect(ctx, qrX, qrY, qrW, qrH, 12);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = COLORS.black;
  ctx.setLineDash([8, 6]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  drawQRCodeOnCanvas(ctx, formatQRPayload(identityPayload), qrX + 12, qrY + 12, qrW - 24, {
    moduleColor: COLORS.black, bgColor: COLORS.paper, label: 'SCAN · VISIT', labelColor: COLORS.black
  });

  // ── 10. GRAIN OVERLAY & CHECKERBOARD BORDER ──
  renderGrainOverlay(ctx, W, H);
  renderCheckerboardFrame(ctx, W, H);
}

// ══════════════════════════════════════════════════════════════
// DEFAULT BUILDER SILHOUETTE VECTOR (NO RECTANGLE)
// ══════════════════════════════════════════════════════════════

function renderDefaultBuilderSilhouette(ctx, x, y, w, h) {
  ctx.save();
  ctx.translate(x, y);

  ctx.shadowColor = 'rgba(10, 10, 10, 0.38)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 18;

  // Paper silhouette border
  ctx.fillStyle = COLORS.paper;
  ctx.beginPath();
  ctx.arc(w / 2, h * 0.22, w * 0.24, 0, Math.PI * 2);
  ctx.rect(w / 2 - w * 0.08, h * 0.38, w * 0.16, h * 0.1);
  ctx.moveTo(w * 0.1, h);
  ctx.lineTo(w * 0.18, h * 0.48);
  ctx.quadraticCurveTo(w * 0.22, h * 0.42, w * 0.35, h * 0.42);
  ctx.lineTo(w * 0.65, h * 0.42);
  ctx.quadraticCurveTo(w * 0.78, h * 0.42, w * 0.82, h * 0.48);
  ctx.lineTo(w * 0.9, h);
  ctx.closePath();
  ctx.fill();

  // Dark inner figure
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#1A1A1A';
  ctx.beginPath();
  ctx.arc(w / 2, h * 0.22, w * 0.20, 0, Math.PI * 2);
  ctx.moveTo(w * 0.15, h);
  ctx.lineTo(w * 0.22, h * 0.50);
  ctx.quadraticCurveTo(w * 0.26, h * 0.45, w * 0.38, h * 0.45);
  ctx.lineTo(w * 0.62, h * 0.45);
  ctx.quadraticCurveTo(w * 0.74, h * 0.45, w * 0.78, h * 0.50);
  ctx.lineTo(w * 0.85, h);
  ctx.closePath();
  ctx.fill();

  // Upload prompt text
  ctx.font = `700 42px ${FONT_PRIMARY}`;
  ctx.fillStyle = COLORS.yellow;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('📸 UPLOAD PORTRAIT', w / 2, h * 0.62);
  ctx.font = `500 28px ${FONT_MONO}`;
  ctx.fillStyle = COLORS.paper;
  ctx.fillText('AUTO PAPER CUTOUT', w / 2, h * 0.68);

  ctx.restore();
}

// ══════════════════════════════════════════════════════════════
// CREW OF 2 POSTER RENDERER (3840 × 2160 px, 16:9 Landscape)
// ══════════════════════════════════════════════════════════════

async function renderCrewOf2Poster(canvas, data) {
  canvas.width = CREW2_WIDTH;
  canvas.height = CREW2_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = CREW2_WIDTH;
  const H = CREW2_HEIGHT;

  const teamName = (data.teamName || 'THE BEACH BUILDERS').toUpperCase();
  const teamId = data.teamId || 'HH-GOA-26-CREW-7K2P';
  const members = data.members || [];
  const m1 = members[0] || {};
  const m2 = members[1] || {};
  const bgChoice = data.bgChoice || 'agenda';

  const identityPayload = {
    mode: 'team', crewSize: 2, teamName, teamId, members: [m1, m2]
  };

  // 1. BASE BACKGROUND & SELECTED WALLPAPER
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, COLORS.greenLight);
  bgGrad.addColorStop(0.55, COLORS.green);
  bgGrad.addColorStop(1, COLORS.greenDark);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  let bgImgUrl = ASSETS.bgAgenda;
  if (bgChoice === 'sunrise') bgImgUrl = ASSETS.bgSunrise;
  else if (bgChoice === 'details') bgImgUrl = ASSETS.bgDetails;
  else if (bgChoice === 'hackers') bgImgUrl = ASSETS.bgHackers;
  else if (bgChoice === 'palms') bgImgUrl = ASSETS.bgPalms;

  const bgImg = getCachedImage(bgImgUrl);
  if (bgImg && bgChoice !== 'solid') {
    ctx.save();
    ctx.globalAlpha = 0.14;
    const scale = Math.max(W / bgImg.naturalWidth, H / bgImg.naturalHeight);
    const bw = bgImg.naturalWidth * scale;
    const bh = bgImg.naturalHeight * scale;
    ctx.drawImage(bgImg, (W - bw) / 2, (H - bh) / 2, bw, bh);
    ctx.restore();
  }

  // Bamboo artwork overlay
  const leftPalmImg = getCachedImage(ASSETS.bgPalms);
  if (leftPalmImg) {
    ctx.save(); ctx.globalAlpha = 0.20;
    ctx.drawImage(leftPalmImg, 60, 100, 600, 1900);
    ctx.drawImage(leftPalmImg, W - 660, 100, 600, 1900);
    ctx.restore();
  }

  // 2. BRANDING: Hacker House Logo, 247 Studios, Goa Hindi Emblem
  const logo = await loadHackerHouseLogo();
  if (logo) {
    const lScale = Math.min(260 / logo.width, 260 / logo.height);
    ctx.drawImage(logo, W - 340, 100, logo.width * lScale, logo.height * lScale);
  }

  const studioLogo = getCachedImage(ASSETS.waveCurve);
  if (studioLogo) {
    ctx.save(); ctx.globalAlpha = 1.0;
    ctx.drawImage(studioLogo, W - 800, 100, 400, 160);
    ctx.restore();
  }

  const hindiLogo = getCachedImage(ASSETS.logoHindi);
  if (hindiLogo) {
    ctx.drawImage(hindiLogo, 100, 100, 160, 160);
  }

  // 3. HEADER TYPOGRAPHY & CREW TITLE
  ctx.save();
  ctx.font = `900 160px ${FONT_DISPLAY}`;
  ctx.fillStyle = COLORS.yellow;
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText('HACKER HOUSE GOA 2026', W / 2, 70);
  ctx.restore();

  // Team Name Pink Tag
  drawRotatedTag(ctx, {
    x: W / 2 - 450, y: 250, w: 900, h: 90, rotationDeg: -1,
    fill: COLORS.pink, textColor: COLORS.paper,
    text: teamName, font: `800 52px ${FONT_PRIMARY}`, letterSpacing: 0.04
  });

  // 4. PORTRAITS & MEMBER IDENTITY (VERTICALLY BALANCED)
  const fW = 1250, fH = 1250;
  const f1X = (W / 2) - fW - 70;
  const f2X = (W / 2) + 70;
  const fY = 390;

  async function drawCrewCutout(m, fX, fY, titleLabel) {
    let cutout = null;
    if (m.photoImg) {
      cutout = await getProcessedCutout(m.photoImg, data.monochrome !== false);
    }
    if (cutout) {
      ctx.drawImage(cutout.canvas, fX, fY, fW, fH);
    } else {
      renderDefaultBuilderSilhouette(ctx, fX + 100, fY + 50, fW - 200, fH - 100);
    }

    const metaY = fY + fH + 10;
    ctx.save();
    ctx.font = `900 64px ${FONT_DISPLAY}`;
    ctx.fillStyle = COLORS.yellow; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText((m.name || titleLabel).toUpperCase(), fX + fW / 2, metaY);

    drawRotatedTag(ctx, {
      x: fX + 220, y: metaY + 75, w: fW - 440, h: 56, rotationDeg: -1.5,
      fill: COLORS.pink, textColor: COLORS.paper,
      text: (m.stack || 'BUILDER').toUpperCase(), font: `700 30px ${FONT_PRIMARY}`,
      letterSpacing: 0.04
    });
    ctx.restore();
  }

  await drawCrewCutout(m1, f1X, fY, 'MEMBER 01');
  await drawCrewCutout(m2, f2X, fY, 'MEMBER 02');

  // Bottom QR Stamp & Checkerboard Frame
  drawQRCodeOnCanvas(ctx, formatQRPayload(identityPayload), W - 440, H - 440, 320, {
    moduleColor: COLORS.black, bgColor: COLORS.paper, label: 'CREW IDENTITY', labelColor: COLORS.black
  });

  renderGrainOverlay(ctx, W, H);
  renderCheckerboardFrame(ctx, W, H);
}

// ══════════════════════════════════════════════════════════════
// CREW OF 3 POSTER RENDERER (2160 × 2700 px, 4:5 Portrait)
// ══════════════════════════════════════════════════════════════

async function renderCrewOf3Poster(canvas, data) {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = CANVAS_WIDTH;
  const H = CANVAS_HEIGHT;

  const teamName = (data.teamName || 'THE BEACH BUILDERS').toUpperCase();
  const teamId = data.teamId || 'HH-GOA-26-CREW-7K2P';
  const members = data.members || [];
  const m1 = members[0] || {};
  const m2 = members[1] || {};
  const m3 = members[2] || {};
  const bgChoice = data.bgChoice || 'agenda';

  const identityPayload = {
    mode: 'team', crewSize: 3, teamName, teamId, members: [m1, m2, m3]
  };

  // 1. BASE BACKGROUND & SELECTED WALLPAPER
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, COLORS.greenLight);
  bgGrad.addColorStop(0.55, COLORS.green);
  bgGrad.addColorStop(1, COLORS.greenDark);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  let bgImgUrl = ASSETS.bgAgenda;
  if (bgChoice === 'sunrise') bgImgUrl = ASSETS.bgSunrise;
  else if (bgChoice === 'details') bgImgUrl = ASSETS.bgDetails;
  else if (bgChoice === 'hackers') bgImgUrl = ASSETS.bgHackers;
  else if (bgChoice === 'palms') bgImgUrl = ASSETS.bgPalms;

  const bgImg = getCachedImage(bgImgUrl);
  if (bgImg && bgChoice !== 'solid') {
    ctx.save();
    ctx.globalAlpha = 0.14;
    const scale = Math.max(W / bgImg.naturalWidth, H / bgImg.naturalHeight);
    const bw = bgImg.naturalWidth * scale;
    const bh = bgImg.naturalHeight * scale;
    ctx.drawImage(bgImg, (W - bw) / 2, (H - bh) / 2, bw, bh);
    ctx.restore();
  }

  // Bamboo artwork
  const leftPalmImg = getCachedImage(ASSETS.bgPalms);
  if (leftPalmImg) {
    ctx.save(); ctx.globalAlpha = 0.20;
    ctx.drawImage(leftPalmImg, -40, 160, 520, 1900);
    ctx.restore();
  }

  // 2. BRANDING: Hacker House Logo + 247 Studios Logo (top-right)
  const logo = await loadHackerHouseLogo();
  if (logo) {
    const lScale = Math.min(220 / logo.width, 220 / logo.height);
    ctx.drawImage(logo, W - 300, 110, logo.width * lScale, logo.height * lScale);
  }

  const studioLogo = getCachedImage(ASSETS.waveCurve);
  if (studioLogo) {
    ctx.save(); ctx.globalAlpha = 1.0;
    ctx.drawImage(studioLogo, W - 720, 120, 380, 150);
    ctx.restore();
  }

  // 3. HEADER TYPOGRAPHY & TEAM NAME
  ctx.save();
  ctx.font = `900 150px ${FONT_DISPLAY}`;
  ctx.fillStyle = COLORS.yellow;
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText('HACKER HOUSE GOA', W / 2, 90);
  ctx.restore();

  drawRotatedTag(ctx, {
    x: W / 2 - 400, y: 260, w: 800, h: 80, rotationDeg: -1.5,
    fill: COLORS.pink, textColor: COLORS.paper,
    text: teamName, font: `800 44px ${FONT_PRIMARY}`, letterSpacing: 0.04
  });

  // 4. THREE MEMBER CUTOUTS & IDENTITY (VERTICALLY FILLING POSTER SPACE)
  const fW = 630, fH = 1350; // Generous height filling space!
  const spacing = 35;
  const totalW = fW * 3 + spacing * 2;
  const startX = (W - totalW) / 2;
  const fY = 380;

  async function drawCrew3Cutout(m, fX, fY, titleLabel) {
    let cutout = null;
    if (m.photoImg) {
      cutout = await getProcessedCutout(m.photoImg, data.monochrome !== false);
    }
    if (cutout) {
      ctx.drawImage(cutout.canvas, fX, fY, fW, fH);
    } else {
      renderDefaultBuilderSilhouette(ctx, fX + 40, fY + 30, fW - 80, fH - 60);
    }

    const metaY = fY + fH + 15;
    ctx.save();
    ctx.font = `900 52px ${FONT_DISPLAY}`;
    ctx.fillStyle = COLORS.yellow; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText((m.name || titleLabel).toUpperCase(), fX + fW / 2, metaY);

    drawRotatedTag(ctx, {
      x: fX + 50, y: metaY + 65, w: fW - 100, h: 48, rotationDeg: -1.5,
      fill: COLORS.pink, textColor: COLORS.paper,
      text: (m.stack || 'BUILDER').toUpperCase(), font: `700 24px ${FONT_PRIMARY}`,
      letterSpacing: 0.04
    });
    ctx.restore();
  }

  await drawCrew3Cutout(m1, startX, fY, 'MEMBER 01');
  await drawCrew3Cutout(m2, startX + fW + spacing, fY, 'MEMBER 02');
  await drawCrew3Cutout(m3, startX + (fW + spacing) * 2, fY, 'MEMBER 03');

  // Dedicated Team ID Tag
  ctx.save();
  const idX = 120, idY = 2440, idW = 600, idH = 60;
  ctx.fillStyle = COLORS.black;
  drawRoundedRect(ctx, idX, idY, idW, idH, 10);
  ctx.fill();
  ctx.strokeStyle = COLORS.yellow;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.font = `700 28px ${FONT_MONO}`;
  ctx.fillStyle = COLORS.yellow;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(`TEAM ID: ${(teamId || 'HH-GOA-26-CREW-7K2P').toUpperCase()}`, idX + idW / 2, idY + idH / 2 + 1);
  ctx.restore();

  // Footer Tag
  ctx.save();
  ctx.font = `500 30px ${FONT_MONO}`;
  ctx.fillStyle = COLORS.paper;
  ctx.globalAlpha = 0.7;
  ctx.fillText('#FRAMEINGOA', 120, 2580);
  ctx.restore();

  // QR Code Stamp
  drawQRCodeOnCanvas(ctx, formatQRPayload(identityPayload), W - 140 - 280, H - 420, 280, {
    moduleColor: COLORS.black, bgColor: COLORS.paper, label: 'CREW IDENTITY', labelColor: COLORS.black
  });

  renderGrainOverlay(ctx, W, H);
  renderCheckerboardFrame(ctx, W, H);
}

// ══════════════════════════════════════════════════════════════
// RENDER HELPERS
// ══════════════════════════════════════════════════════════════

function drawRoundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawRotatedTag(ctx, { x, y, w, h, rotationDeg, fill, textColor, text, font, letterSpacing = 0, shadow = false }) {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  if (shadow) {
    ctx.shadowColor = 'rgba(10, 10, 10, 0.45)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
  }
  drawRoundedRect(ctx, -w / 2, -h / 2, w, h, 12);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.font = font;
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (ctx.letterSpacing !== undefined) ctx.letterSpacing = `${letterSpacing * 100}%`;
  ctx.fillText(text, 0, 3);
  ctx.restore();
}

function renderSpeechBubble(ctx, text, x, y, w, h) {
  ctx.save();
  ctx.translate(x, y);

  ctx.beginPath();
  ctx.moveTo(20, 10);
  ctx.bezierCurveTo(w * 0.3, 2, w * 0.7, 4, w - 10, 15);
  ctx.bezierCurveTo(w, h * 0.4, w - 2, h * 0.7, w - 15, h - 10);
  ctx.bezierCurveTo(w * 0.6, h - 2, w * 0.3, h + 4, 15, h - 12);
  ctx.bezierCurveTo(0, h * 0.6, 2, h * 0.3, 20, 10);
  ctx.closePath();

  ctx.shadowColor = 'rgba(10, 10, 10, 0.35)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = COLORS.paper;
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.lineWidth = 6;
  ctx.strokeStyle = COLORS.black;
  ctx.stroke();

  // Pointer tail
  ctx.beginPath();
  ctx.moveTo(60, h - 4);
  ctx.lineTo(-25, h + 50);
  ctx.lineTo(120, h - 4);
  ctx.closePath();
  ctx.fillStyle = COLORS.paper;
  ctx.fill();
  ctx.stroke();

  // Text inside bubble
  ctx.font = `italic 600 44px ${FONT_PRIMARY}`;
  ctx.fillStyle = COLORS.black;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  wrapText(ctx, `"${text}"`, w / 2, h / 2, w - 80, 52);
  ctx.restore();
}

function wrapText(ctx, text, cx, cy, maxWidth, lineHeight) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line.trim());
      line = word + ' ';
    } else {
      line = test;
    }
  }
  lines.push(line.trim());
  const startY = cy - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l, cx, startY + i * lineHeight));
}

function renderGrainOverlay(ctx, w, h) {
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.globalCompositeOperation = 'overlay';
  const dotCount = Math.floor((w * h) / 120);
  for (let i = 0; i < dotCount; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.fillStyle = Math.random() > 0.5 ? '#000000' : '#FFFFFF';
    ctx.fillRect(x, y, 1.5, 1.5);
  }
  ctx.restore();
}

function renderCheckerboardFrame(ctx, w, h) {
  const inset = 48;
  const step = 28;
  ctx.save();
  ctx.strokeStyle = COLORS.yellow;
  ctx.lineWidth = 4;
  ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2);

  ctx.fillStyle = COLORS.yellow;
  for (let x = inset; x < w - inset; x += step * 2) {
    ctx.fillRect(x, inset - 6, step, 6);
    ctx.fillRect(x, h - inset, step, 6);
  }
  for (let y = inset; y < h - inset; y += step * 2) {
    ctx.fillRect(inset - 6, y, 6, step);
    ctx.fillRect(w - inset, y, 6, step);
  }
  ctx.restore();
}
