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
  const promises = Object.values(ASSETS).map(url =>
    loadImage(url).catch(() => null)
  );

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
// INDIVIDUAL POSTER RENDERER
// 2160 × 2700 px, 4:5 Portrait
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
    name,
    stack,
    role,
    builderClass,
    builderId,
    socialHandle
  };

  // ── 1. BASE BACKGROUND & TROPICAL WALLPAPER ──

  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);

  bgGrad.addColorStop(0, COLORS.greenLight);
  bgGrad.addColorStop(0.55, COLORS.green);
  bgGrad.addColorStop(1, COLORS.greenDark);

  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  let bgImgUrl = ASSETS.bgAgenda;

  if (bgChoice === 'sunrise') {
    bgImgUrl = ASSETS.bgSunrise;
  } else if (bgChoice === 'details') {
    bgImgUrl = ASSETS.bgDetails;
  } else if (bgChoice === 'hackers') {
    bgImgUrl = ASSETS.bgHackers;
  } else if (bgChoice === 'palms') {
    bgImgUrl = ASSETS.bgPalms;
  }

  const bgImg = getCachedImage(bgImgUrl);

  if (bgImg && bgChoice !== 'solid') {
    ctx.save();

    ctx.globalAlpha = 0.14;

    const scale = Math.max(
      W / bgImg.naturalWidth,
      H / bgImg.naturalHeight
    );

    const bw = bgImg.naturalWidth * scale;
    const bh = bgImg.naturalHeight * scale;

    ctx.drawImage(
      bgImg,
      (W - bw) / 2,
      (H - bh) / 2,
      bw,
      bh
    );

    ctx.restore();
  }

  // ── 2. LEFT BAMBOO / PALM GRAPHIC ──

  const leftPalmImg = getCachedImage(ASSETS.bgPalms);

  if (leftPalmImg) {
    ctx.save();

    ctx.globalAlpha = 0.22;

    ctx.drawImage(
      leftPalmImg,
      -60,
      160,
      560,
      1900
    );

    ctx.restore();
  }

  // ── 3. HEADLINE ──

  ctx.save();

  ctx.font = `900 220px ${FONT_DISPLAY}`;
  ctx.fillStyle = COLORS.yellow;

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  ctx.letterSpacing = '-2px';

  ctx.fillText('HACKER', 120, 140);
  ctx.fillText('HOUSE', 120, 350);

  ctx.restore();

  // ── 4. BRANDING ASSETS ──

  // A. Hindi Goa Mark

  const hindiLogo = getCachedImage(ASSETS.logoHindi);

  if (hindiLogo) {
    ctx.save();

    ctx.shadowColor = 'rgba(10, 10, 10, 0.45)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;

    ctx.drawImage(
      hindiLogo,
      630,
      280,
      240,
      240
    );

    ctx.restore();
  }

  // B. Small Hacker House logo

  const logo = await loadHackerHouseLogo();

  if (logo) {
    const lbX = 1660;
    const lbY = 130;
    const lbW = 400;
    const lbH = 500;

    const lW = logo.naturalWidth || logo.width || 300;
    const lH = logo.naturalHeight || logo.height || 100;

    const lScale = Math.min(
      lbW / lW,
      lbH / lH
    );

    const drawW = lW * lScale;
    const drawH = lH * lScale;

    ctx.drawImage(
      logo,
      lbX + (lbW - drawW) / 2,
      lbY,
      drawW,
      drawH
    );
  }

  // C. 247 Studio Logo

  const studioLogo = getCachedImage(ASSETS.waveCurve);

  if (studioLogo) {
    ctx.save();

    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';

    const sBoxW = 520;

    const sW =
      studioLogo.naturalWidth ||
      studioLogo.width ||
      400;

    const sH =
      studioLogo.naturalHeight ||
      studioLogo.height ||
      170;

    const scale = sBoxW / sW;

    const drawW = sW * scale;
    const drawH = sH * scale;

    const drawX = 1550;
    const drawY = 320;

    ctx.drawImage(
      studioLogo,
      drawX,
      drawY,
      drawW,
      drawH
    );

    ctx.restore();
  }

  // ── 5. HERO CUTOUT PERSON ──

  let cutoutLayer = null;

  if (photoImg) {
    cutoutLayer = await getProcessedCutout(
      photoImg,
      monochrome
    );
  }

  const heroX = 260;
  const heroY = 540;
  const heroW = 1480;
  const heroH = 1520;

  if (cutoutLayer) {
    const layerCanvas = cutoutLayer.canvas;

    const scale = Math.min(
      heroW / layerCanvas.width,
      heroH / layerCanvas.height
    );

    const drawW = layerCanvas.width * scale;
    const drawH = layerCanvas.height * scale;

    const drawX =
      heroX +
      (heroW - drawW) / 2 -
      20;

    const drawY =
      heroY +
      heroH -
      drawH;

    ctx.drawImage(
      layerCanvas,
      drawX,
      drawY,
      drawW,
      drawH
    );
  } else {
    renderDefaultBuilderSilhouette(
      ctx,
      heroX + 150,
      heroY + 80,
      heroW - 300,
      heroH - 160
    );
  }

  // ── 6. GOA · 2026 PINK TAG ──

  drawRotatedTag(ctx, {
    x: 140,
    y: 640,
    w: 550,
    h: 110,
    rotationDeg: -2,
    fill: COLORS.pink,
    textColor: COLORS.paper,
    text: 'GOA · 2026',
    font: `800 48px ${FONT_PRIMARY}`,
    letterSpacing: 0.04,
    shadow: true
  });

  // ── 7. SPEECH BUBBLE ──

  if (speechText) {
    renderSpeechBubble(
      ctx,
      speechText,
      1350,
      820,
      520,
      280
    );
  }

  // ══════════════════════════════════════════════════════════
  // 8. IDENTITY BLOCK
  // ══════════════════════════════════════════════════════════

  drawRotatedTag(ctx, {
    x: 260,
    y: 2020,
    w: 720,
    h: 90,
    rotationDeg: -2,
    fill: COLORS.pink,
    textColor: COLORS.paper,
    text: (
      role ||
      'CODE NAVIGATOR BUILDER'
    ).toUpperCase(),
    font: `700 38px ${FONT_PRIMARY}`,
    letterSpacing: 0.05
  });

  const rawName =
    (name || 'KISHAN R')
      .trim()
      .toUpperCase();

  ctx.save();

  ctx.font = `900 120px ${FONT_DISPLAY}`;

  ctx.fillStyle = COLORS.black;
  ctx.fillText(
    rawName,
    266,
    2256
  );

  ctx.fillStyle = COLORS.yellow;
  ctx.fillText(
    rawName,
    260,
    2250
  );

  ctx.restore();

  drawRotatedTag(ctx, {
    x: 260,
    y: 2310,
    w: 940,
    h: 85,
    rotationDeg: -1.5,
    fill: COLORS.paper,
    textColor: COLORS.black,
    text: (
      stack ||
      'PYTHON · DEVOPS · AI'
    ).toUpperCase(),
    font: `600 34px ${FONT_PRIMARY}`,
    letterSpacing: 0.03
  });

  ctx.save();

  const idX = 260;
  const idY = 2440;
  const idW = 600;
  const idH = 60;

  ctx.fillStyle = COLORS.black;

  drawRoundedRect(
    ctx,
    idX,
    idY,
    idW,
    idH,
    10
  );

  ctx.fill();

  ctx.strokeStyle = COLORS.yellow;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.font = `700 28px ${FONT_MONO}`;
  ctx.fillStyle = COLORS.yellow;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText(
    `BUILDER ID: ${(
      builderId ||
      'HH-GOA-26-9X2M'
    ).toUpperCase()
    }`,
    idX + idW / 2,
    idY + idH / 2 + 1
  );

  ctx.restore();

  ctx.save();

  ctx.font = `500 30px ${FONT_MONO}`;
  ctx.fillStyle = COLORS.paper;
  ctx.globalAlpha = 0.7;

  ctx.fillText(
    '#FRAMEINGOA',
    120,
    2580
  );

  ctx.restore();

  // ── 9. QR CODE STAMP ──

  const qrX = 1760;
  const qrY = 2280;
  const qrW = 280;
  const qrH = 280;

  ctx.save();

  ctx.fillStyle = COLORS.paper;

  drawRoundedRect(
    ctx,
    qrX,
    qrY,
    qrW,
    qrH,
    12
  );

  ctx.fill();

  ctx.lineWidth = 3;
  ctx.strokeStyle = COLORS.black;

  ctx.setLineDash([8, 6]);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.restore();

  drawQRCodeOnCanvas(
    ctx,
    formatQRPayload(identityPayload),
    qrX + 12,
    qrY + 12,
    qrW - 24,
    {
      moduleColor: COLORS.black,
      bgColor: COLORS.paper,
      label: 'SCAN · VISIT',
      labelColor: COLORS.black
    }
  );

  renderGrainOverlay(
    ctx,
    W,
    H
  );

  renderCheckerboardFrame(
    ctx,
    W,
    H
  );
}


// ══════════════════════════════════════════════════════════════
// DEFAULT BUILDER SILHOUETTE VECTOR
// ══════════════════════════════════════════════════════════════

function renderDefaultBuilderSilhouette(
  ctx,
  x,
  y,
  w,
  h
) {
  ctx.save();

  ctx.translate(x, y);

  ctx.shadowColor =
    'rgba(10, 10, 10, 0.38)';

  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 18;

  // Paper silhouette border

  ctx.fillStyle = COLORS.paper;

  ctx.beginPath();

  ctx.arc(
    w / 2,
    h * 0.22,
    w * 0.24,
    0,
    Math.PI * 2
  );

  ctx.rect(
    w / 2 - w * 0.08,
    h * 0.38,
    w * 0.16,
    h * 0.1
  );

  ctx.moveTo(
    w * 0.1,
    h
  );

  ctx.lineTo(
    w * 0.18,
    h * 0.48
  );

  ctx.quadraticCurveTo(
    w * 0.22,
    h * 0.42,
    w * 0.35,
    h * 0.42
  );

  ctx.lineTo(
    w * 0.65,
    h * 0.42
  );

  ctx.quadraticCurveTo(
    w * 0.78,
    h * 0.42,
    w * 0.82,
    h * 0.48
  );

  ctx.lineTo(
    w * 0.9,
    h
  );

  ctx.closePath();

  ctx.fill();

  // Dark inner figure

  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#1A1A1A';

  ctx.beginPath();

  ctx.arc(
    w / 2,
    h * 0.22,
    w * 0.20,
    0,
    Math.PI * 2
  );

  ctx.moveTo(
    w * 0.15,
    h
  );

  ctx.lineTo(
    w * 0.22,
    h * 0.50
  );

  ctx.quadraticCurveTo(
    w * 0.26,
    h * 0.45,
    w * 0.38,
    h * 0.45
  );

  ctx.lineTo(
    w * 0.62,
    h * 0.45
  );

  ctx.quadraticCurveTo(
    w * 0.74,
    h * 0.45,
    w * 0.78,
    h * 0.50
  );

  ctx.lineTo(
    w * 0.85,
    h
  );

  ctx.closePath();

  ctx.fill();

  // Upload prompt text

  ctx.font = `700 38px ${FONT_PRIMARY}`;
  ctx.fillStyle = COLORS.yellow;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText(
    '📸 UPLOAD PORTRAIT',
    w / 2,
    h * 0.58
  );

  ctx.font = `500 26px ${FONT_MONO}`;
  ctx.fillStyle = COLORS.paper;

  ctx.fillText(
    'AUTO PAPER CUTOUT',
    w / 2,
    h * 0.65
  );

  ctx.restore();
}


// ══════════════════════════════════════════════════════════════
// CREW OF 2 POSTER RENDERER
// 3840 × 2160 px, 16:9 Landscape
// ══════════════════════════════════════════════════════════════

async function renderCrewOf2Poster(
  canvas,
  data
) {
  canvas.width = CREW2_WIDTH;
  canvas.height = CREW2_HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = CREW2_WIDTH;
  const H = CREW2_HEIGHT;

  const teamName = (
    data.teamName ||
    'THE BEACH BUILDERS'
  ).toUpperCase();

  const teamId =
    data.teamId ||
    'HH-GOA-26-CREW-7K2P';

  const members =
    data.members || [];

  const m1 =
    members[0] || {};

  const m2 =
    members[1] || {};

  const bgChoice =
    data.bgChoice || 'agenda';

  const identityPayload = {
    mode: 'team',
    crewSize: 2,
    teamName,
    teamId,
    members: [
      m1,
      m2
    ]
  };

  // ── 1. BASE BACKGROUND & SELECTED WALLPAPER ──

  const bgGrad =
    ctx.createLinearGradient(
      0,
      0,
      0,
      H
    );

  bgGrad.addColorStop(
    0,
    COLORS.greenLight
  );

  bgGrad.addColorStop(
    0.55,
    COLORS.green
  );

  bgGrad.addColorStop(
    1,
    COLORS.greenDark
  );

  ctx.fillStyle = bgGrad;

  ctx.fillRect(
    0,
    0,
    W,
    H
  );

  let bgImgUrl =
    ASSETS.bgAgenda;

  if (bgChoice === 'sunrise') {
    bgImgUrl =
      ASSETS.bgSunrise;
  } else if (bgChoice === 'details') {
    bgImgUrl =
      ASSETS.bgDetails;
  } else if (bgChoice === 'hackers') {
    bgImgUrl =
      ASSETS.bgHackers;
  } else if (bgChoice === 'palms') {
    bgImgUrl =
      ASSETS.bgPalms;
  }

  const bgImg =
    getCachedImage(bgImgUrl);

  if (
    bgImg &&
    bgChoice !== 'solid'
  ) {
    ctx.save();

    ctx.globalAlpha = 0.14;

    const scale =
      Math.max(
        W / bgImg.naturalWidth,
        H / bgImg.naturalHeight
      );

    const bw =
      bgImg.naturalWidth * scale;

    const bh =
      bgImg.naturalHeight * scale;

    ctx.drawImage(
      bgImg,
      (W - bw) / 2,
      (H - bh) / 2,
      bw,
      bh
    );

    ctx.restore();
  }

  // ── BAMBOO ARTWORK ──

  const leftPalmImg =
    getCachedImage(
      ASSETS.bgPalms
    );

  if (leftPalmImg) {
    ctx.save();

    ctx.globalAlpha = 0.20;

    ctx.drawImage(
      leftPalmImg,
      60,
      100,
      600,
      1900
    );

    ctx.drawImage(
      leftPalmImg,
      W - 660,
      100,
      600,
      1900
    );

    ctx.restore();
  }


  // ══════════════════════════════════════════════════════════
  // 2. BRANDING
  // ══════════════════════════════════════════════════════════

  /*
   * 247 STUDIOS
   * ----------------------------------------------------------
   * Increased size.
   * Preserves the ORIGINAL aspect ratio.
   * Positioned cleanly on the right side.
   */

  const studioLogo =
    getCachedImage(
      ASSETS.waveCurve
    );

  if (studioLogo) {
    ctx.save();

    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation =
      'source-over';

    const sBoxW = 560;

    const sW =
      studioLogo.naturalWidth ||
      studioLogo.width ||
      400;

    const sH =
      studioLogo.naturalHeight ||
      studioLogo.height ||
      170;

    const sScale =
      sBoxW / sW;

    const drawW =
      sW * sScale;

    const drawH =
      sH * sScale;

    const drawX =
      W - 700;

    const drawY =
      270;

    ctx.drawImage(
      studioLogo,
      drawX,
      drawY,
      drawW,
      drawH
    );

    ctx.restore();
  }


  /*
   * MINI HACKER HOUSE LOGO
   * ----------------------------------------------------------
   * Made larger and placed ABOVE the 247 Studios logo.
   */

  const logo =
    await loadHackerHouseLogo();

  if (logo) {
    const lbW = 450;
    const lbH = 180;

    const lW =
      logo.naturalWidth ||
      logo.width ||
      400;

    const lH =
      logo.naturalHeight ||
      logo.height ||
      200;

    const lScale =
      Math.min(
        lbW / lW,
        lbH / lH
      );

    const drawW =
      lW * lScale;

    const drawH =
      lH * lScale;

    const lbX =
      W - 550;

    const lbY =
      100;

    ctx.drawImage(
      logo,
      lbX + (lbW - drawW) / 2,
      lbY,
      drawW,
      drawH
    );
  }


  // Hindi Goa Logo

  const hindiLogo =
    getCachedImage(
      ASSETS.logoHindi
    );

  if (hindiLogo) {
    ctx.drawImage(
      hindiLogo,
      140,
      80,
      300,
      260
    );
  }


  // ══════════════════════════════════════════════════════════
  // 3. HEADER TYPOGRAPHY
  // ══════════════════════════════════════════════════════════

  ctx.save();

  ctx.font =
    `900 190px ${FONT_DISPLAY}`;

  ctx.fillStyle =
    COLORS.yellow;

  ctx.textAlign =
    'center';

  ctx.textBaseline =
    'top';

  ctx.fillText(
    'HACKER HOUSE GOA 2026',
    W / 2,
    130
  );

  ctx.restore();


  /*
   * MAIN TEAM NAME PINK CARD
   * ----------------------------------------------------------
   * Original:
   * y: 300
   *
   * Updated:
   * y: 330
   *
   * Only moved slightly downward.
   */

  drawRotatedTag(ctx, {
    x: W / 2 - 450,
    y: 330,
    w: 1000,
    h: 90,
    rotationDeg: 0,

    fill: COLORS.pink,
    textColor: COLORS.paper,

    text: teamName,

    font:
      `800 70px ${FONT_PRIMARY}`,

    letterSpacing: 0.04
  });


  // ══════════════════════════════════════════════════════════
  // 4. PORTRAITS & MEMBER IDENTITY
  // ══════════════════════════════════════════════════════════

  const fW = 1100;
  const fH = 1150;

  const f1X =
    (W / 2) -
    fW -
    70;

  const f2X =
    (W / 2) +
    70;

  const fY =
    500;


  async function drawCrewCutout(
    m,
    fX,
    fY,
    titleLabel
  ) {
    let cutout = null;

    if (m.photoImg) {
      cutout =
        await getProcessedCutout(
          m.photoImg,
          data.monochrome !== false
        );
    }


    // ── PERSON CUTOUT ──

    if (cutout) {
      const layerCanvas =
        cutout.canvas;

      const scale =
        Math.min(
          fW / layerCanvas.width,
          fH / layerCanvas.height
        );

      const drawW =
        layerCanvas.width *
        scale;

      const drawH =
        layerCanvas.height *
        scale;

      const drawX =
        fX +
        (fW - drawW) / 2;

      const drawY =
        fY +
        fH -
        drawH;

      ctx.drawImage(
        layerCanvas,
        drawX,
        drawY,
        drawW,
        drawH
      );
    } else {
      renderDefaultBuilderSilhouette(
        ctx,
        fX + 100,
        fY + 50,
        fW - 200,
        fH - 100
      );
    }


    // ══════════════════════════════════════════════════════
    // INDIVIDUAL PINK STACK CARD
    // ══════════════════════════════════════════════════════

    const metaY =
      fY +
      fH +
      15;

    ctx.save();

    ctx.font =
      `900 64px ${FONT_DISPLAY}`;

    ctx.fillStyle =
      COLORS.yellow;

    ctx.textAlign =
      'center';

    ctx.textBaseline =
      'top';


    drawRotatedTag(ctx, {
      x: fX + 150,
      y: metaY + -90,

      w: fW - 300,
      h: 85,

      rotationDeg: -1.5,

      fill: COLORS.pink,
      textColor: COLORS.paper,

      text: (
        m.stack ||
        'BUILDER'
      ).toUpperCase(),

      font:
        `700 50px ${FONT_PRIMARY}`,

      letterSpacing: 0.04,

      shadow: false
    });

    ctx.restore();
  }


  // MEMBER 01

  await drawCrewCutout(
    m1,
    f1X,
    fY,
    'MEMBER 01'
  );


  // MEMBER 02

  await drawCrewCutout(
    m2,
    f2X,
    fY,
    'MEMBER 02'
  );


  // ══════════════════════════════════════════════════════════
  // 5. DEDICATED TEAM ID CHIP
  // ══════════════════════════════════════════════════════════

  ctx.save();

  const idW = 1000;
  const idH = 130;

  const idX =
    (W - idW) / 2;

  const idY =
    1820;


  // Black background

  ctx.fillStyle =
    COLORS.black;

  drawRoundedRect(
    ctx,
    idX,
    idY,
    idW,
    idH,
    12
  );

  ctx.fill();


  // Yellow outline

  ctx.strokeStyle =
    COLORS.yellow;

  ctx.lineWidth =
    3;

  ctx.stroke();


  // Team ID text

  ctx.font =
    `700 42px ${FONT_MONO}`;

  ctx.fillStyle =
    COLORS.yellow;

  ctx.textAlign =
    'center';

  ctx.textBaseline =
    'middle';


  ctx.fillText(
    `TEAM ID: ${(
      teamId ||
      'HH-GOA-26-CREW-7K2P'
    ).toUpperCase()
    }`,
    idX + idW / 2,
    idY + idH / 2
  );


  ctx.restore();


  // ══════════════════════════════════════════════════════════
  // 6. BOTTOM QR STAMP & CHECKERBOARD FRAME
  // ══════════════════════════════════════════════════════════

  drawQRCodeOnCanvas(
    ctx,
    formatQRPayload(
      identityPayload
    ),
    W - 440,
    H - 500, 320,
    {
      moduleColor:
        COLORS.black,

      bgColor:
        COLORS.paper,

      label:
        'CREW IDENTITY',

      labelColor:
        COLORS.black
    }
  );


  renderGrainOverlay(
    ctx,
    W,
    H
  );

  renderCheckerboardFrame(
    ctx,
    W,
    H
  );
}


// ══════════════════════════════════════════════════════════════
// CREW OF 3 POSTER RENDERER
// 3840 × 2160 px, 16:9 Landscape
//
// SAME VALUES AS CREW OF 2.
// ONLY THE 3-MEMBER PORTRAIT LAYOUT IS DIFFERENT.
// ══════════════════════════════════════════════════════════════

async function renderCrewOf3Poster(
  canvas,
  data
) {
  canvas.width = CREW2_WIDTH;
  canvas.height = CREW2_HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = CREW2_WIDTH;
  const H = CREW2_HEIGHT;

  const teamName = (
    data.teamName ||
    'THE BEACH BUILDERS'
  ).toUpperCase();

  const teamId =
    data.teamId ||
    'HH-GOA-26-CREW-7K2P';

  const members =
    data.members || [];

  const m1 =
    members[0] || {};

  const m2 =
    members[1] || {};

  const m3 =
    members[2] || {};

  const bgChoice =
    data.bgChoice || 'agenda';

  const identityPayload = {
    mode: 'team',
    crewSize: 3,
    teamName,
    teamId,
    members: [
      m1,
      m2,
      m3
    ]
  };


  // ── 1. BASE BACKGROUND & SELECTED WALLPAPER ──

  const bgGrad =
    ctx.createLinearGradient(
      0,
      0,
      0,
      H
    );

  bgGrad.addColorStop(
    0,
    COLORS.greenLight
  );

  bgGrad.addColorStop(
    0.55,
    COLORS.green
  );

  bgGrad.addColorStop(
    1,
    COLORS.greenDark
  );

  ctx.fillStyle =
    bgGrad;

  ctx.fillRect(
    0,
    0,
    W,
    H
  );


  let bgImgUrl =
    ASSETS.bgAgenda;

  if (bgChoice === 'sunrise') {
    bgImgUrl =
      ASSETS.bgSunrise;
  } else if (bgChoice === 'details') {
    bgImgUrl =
      ASSETS.bgDetails;
  } else if (bgChoice === 'hackers') {
    bgImgUrl =
      ASSETS.bgHackers;
  } else if (bgChoice === 'palms') {
    bgImgUrl =
      ASSETS.bgPalms;
  }


  const bgImg =
    getCachedImage(bgImgUrl);

  if (
    bgImg &&
    bgChoice !== 'solid'
  ) {
    ctx.save();

    ctx.globalAlpha =
      0.14;

    const scale =
      Math.max(
        W / bgImg.naturalWidth,
        H / bgImg.naturalHeight
      );

    const bw =
      bgImg.naturalWidth *
      scale;

    const bh =
      bgImg.naturalHeight *
      scale;

    ctx.drawImage(
      bgImg,
      (W - bw) / 2,
      (H - bh) / 2,
      bw,
      bh
    );

    ctx.restore();
  }


  // ── BAMBOO ARTWORK ──

  const leftPalmImg =
    getCachedImage(
      ASSETS.bgPalms
    );

  if (leftPalmImg) {
    ctx.save();

    ctx.globalAlpha =
      0.20;

    ctx.drawImage(
      leftPalmImg,
      60,
      100,
      600,
      1900
    );

    ctx.drawImage(
      leftPalmImg,
      W - 660,
      100,
      600,
      1900
    );

    ctx.restore();
  }


  // ══════════════════════════════════════════════════════════
  // 2. BRANDING
  // SAME VALUES AS CREW OF 2
  // ══════════════════════════════════════════════════════════

  const studioLogo =

    getCachedImage(

      ASSETS.waveCurve

    );

  if (studioLogo) {

    ctx.save();

    ctx.globalAlpha = 1.0;

    ctx.globalCompositeOperation =

      'source-over';

    const sBoxW = 560;

    const sW =

      studioLogo.naturalWidth ||

      studioLogo.width ||

      400;

    const sH =

      studioLogo.naturalHeight ||

      studioLogo.height ||

      170;

    const sScale =

      sBoxW / sW;

    const drawW =

      sW * sScale;

    const drawH =

      sH * sScale;

    // KEEPING THE EXACT SAME POSITION

    const drawX =

      W - 700;

    const drawY =

      270;

    ctx.drawImage(

      studioLogo,

      drawX,

      drawY,

      drawW,

      drawH

    );

    ctx.restore();

  }


  // MINI HACKER HOUSE LOGO

  const logo =
    await loadHackerHouseLogo();

  if (logo) {
    const lbW = 450;
    const lbH = 180;

    const lW =
      logo.naturalWidth ||
      logo.width ||
      400;

    const lH =
      logo.naturalHeight ||
      logo.height ||
      200;

    const lScale =
      Math.min(
        lbW / lW,
        lbH / lH
      );

    const drawW =
      lW * lScale;

    const drawH =
      lH * lScale;

    const lbX =
      W - 550;

    const lbY =
      100;

    ctx.drawImage(
      logo,
      lbX + (lbW - drawW) / 2,
      lbY,
      drawW,
      drawH
    );
  }


  // Hindi Goa Logo

  const hindiLogo =
    getCachedImage(
      ASSETS.logoHindi
    );

  if (hindiLogo) {
    ctx.drawImage(
      hindiLogo,
      140,
      80,
      300,
      260
    );
  }


  // ══════════════════════════════════════════════════════════
  // 3. HEADER TYPOGRAPHY
  // SAME VALUES AS CREW OF 2
  // ══════════════════════════════════════════════════════════

  ctx.save();

  ctx.font =
    `900 190px ${FONT_DISPLAY}`;

  ctx.fillStyle =
    COLORS.yellow;

  ctx.textAlign =
    'center';

  ctx.textBaseline =
    'top';

  ctx.fillText(
    'HACKER HOUSE GOA 2026',
    W / 2,
    130
  );

  ctx.restore();


  // SAME MAIN TEAM NAME CARD

  drawRotatedTag(ctx, {
    x: W / 2 - 450,
    y: 330,
    w: 1000,
    h: 90,
    rotationDeg: 0,

    fill: COLORS.pink,
    textColor: COLORS.paper,

    text: teamName,

    font:
      `800 70px ${FONT_PRIMARY}`,

    letterSpacing: 0.04
  });


  // ══════════════════════════════════════════════════════════
  // 4. THREE-MEMBER PORTRAIT GRID
  //
  // ONLY THIS PART IS DIFFERENT FROM CREW OF 2.
  // The same fH, fY, card size, card position,
  // card font and spacing logic are preserved.
  // ══════════════════════════════════════════════════════════

  const fW = 1050;
  const fH = 1150;

  const gap = 30;

  const totalW =
    fW * 3 +
    gap * 2;

  const startX =
    (W - totalW) / 2;

  const fY =
    500;


  async function drawCrew3Cutout(
    m,
    fX,
    fY,
    titleLabel
  ) {
    let cutout = null;

    if (m.photoImg) {
      cutout =
        await getProcessedCutout(
          m.photoImg,
          data.monochrome !== false
        );
    }


    // ── PERSON CUTOUT ──

    if (cutout) {
      const layerCanvas =
        cutout.canvas;

      const scale =
        Math.min(
          fW / layerCanvas.width,
          fH / layerCanvas.height
        );

      const drawW =
        layerCanvas.width *
        scale;

      const drawH =
        layerCanvas.height *
        scale;

      const drawX =
        fX +
        (fW - drawW) / 2;

      const drawY =
        fY +
        fH -
        drawH;

      ctx.drawImage(
        layerCanvas,
        drawX,
        drawY,
        drawW,
        drawH
      );
    } else {
      renderDefaultBuilderSilhouette(
        ctx,
        fX + 100,
        fY + 50,
        fW - 200,
        fH - 100
      );
    }


    // ══════════════════════════════════════════════════════
    // INDIVIDUAL PINK STACK CARD
    // SAME VALUES AS CREW OF 2
    // ══════════════════════════════════════════════════════

    const metaY =
      fY +
      fH +
      15;

    ctx.save();

    ctx.font =
      `900 64px ${FONT_DISPLAY}`;

    ctx.fillStyle =
      COLORS.yellow;

    ctx.textAlign =
      'center';

    ctx.textBaseline =
      'top';


    drawRotatedTag(ctx, {
      x: fX + 150,
      y: metaY + -90,

      w: fW - 300,
      h: 85,

      rotationDeg: -1.5,

      fill: COLORS.pink,
      textColor: COLORS.paper,

      text: (
        m.stack ||
        'BUILDER'
      ).toUpperCase(),

      font:
        `700 50px ${FONT_PRIMARY}`,

      letterSpacing: 0.04,

      shadow: false
    });

    ctx.restore();
  }


  // MEMBER 01

  await drawCrew3Cutout(
    m1,
    startX,
    fY,
    'MEMBER 01'
  );


  // MEMBER 02

  await drawCrew3Cutout(
    m2,
    startX + fW + gap,
    fY,
    'MEMBER 02'
  );


  // MEMBER 03

  await drawCrew3Cutout(
    m3,
    startX + (fW + gap) * 2,
    fY,
    'MEMBER 03'
  );


  // ══════════════════════════════════════════════════════════
  // 5. DEDICATED TEAM ID CHIP
  // SAME VALUES AS CREW OF 2
  // ══════════════════════════════════════════════════════════

  ctx.save();

  const idW = 1000;
  const idH = 130;

  const idX =
    (W - idW) / 2;

  const idY =
    1820;


  // Black background

  ctx.fillStyle =
    COLORS.black;

  drawRoundedRect(
    ctx,
    idX,
    idY,
    idW,
    idH,
    12
  );

  ctx.fill();


  // Yellow outline

  ctx.strokeStyle =
    COLORS.yellow;

  ctx.lineWidth =
    3;

  ctx.stroke();


  // Team ID text

  ctx.font =
    `700 42px ${FONT_MONO}`;

  ctx.fillStyle =
    COLORS.yellow;

  ctx.textAlign =
    'center';

  ctx.textBaseline =
    'middle';


  ctx.fillText(
    `TEAM ID: ${(
      teamId ||
      'HH-GOA-26-CREW-7K2P'
    ).toUpperCase()
    }`,
    idX + idW / 2,
    idY + idH / 2
  );


  ctx.restore();


  // ══════════════════════════════════════════════════════════
  // 6. BOTTOM QR STAMP & CHECKERBOARD FRAME
  // SAME VALUES AS CREW OF 2
  // ══════════════════════════════════════════════════════════

  drawQRCodeOnCanvas(
    ctx,
    formatQRPayload(
      identityPayload
    ),
    W - 440,
    H - 500,
    320,
    {
      moduleColor:
        COLORS.black,

      bgColor:
        COLORS.paper,

      label:
        'CREW IDENTITY',

      labelColor:
        COLORS.black
    }
  );


  renderGrainOverlay(
    ctx,
    W,
    H
  );

  renderCheckerboardFrame(
    ctx,
    W,
    H
  );
}


// ══════════════════════════════════════════════════════════════
// RENDER HELPERS
// ══════════════════════════════════════════════════════════════

function drawRoundedRect(
  ctx,
  x,
  y,
  width,
  height,
  radius
) {
  const r =
    Math.min(
      radius,
      width / 2,
      height / 2
    );

  ctx.beginPath();

  ctx.moveTo(
    x + r,
    y
  );

  ctx.lineTo(
    x + width - r,
    y
  );

  ctx.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + r
  );

  ctx.lineTo(
    x + width,
    y + height - r
  );

  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - r,
    y + height
  );

  ctx.lineTo(
    x + r,
    y + height
  );

  ctx.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - r
  );

  ctx.lineTo(
    x,
    y + r
  );

  ctx.quadraticCurveTo(
    x,
    y,
    x + r,
    y
  );

  ctx.closePath();
}


function drawRotatedTag(
  ctx,
  {
    x,
    y,
    w,
    h,
    rotationDeg,
    fill,
    textColor,
    text,
    font,
    letterSpacing = 0,
    shadow = false
  }
) {
  ctx.save();

  ctx.translate(
    x + w / 2,
    y + h / 2
  );

  ctx.rotate(
    (rotationDeg * Math.PI) / 180
  );


  if (shadow) {
    ctx.shadowColor =
      'rgba(10, 10, 10, 0.45)';

    ctx.shadowBlur =
      20;

    ctx.shadowOffsetY =
      8;
  }


  drawRoundedRect(
    ctx,
    -w / 2,
    -h / 2,
    w,
    h,
    12
  );


  ctx.fillStyle =
    fill;

  ctx.fill();


  ctx.shadowColor =
    'transparent';


  ctx.font =
    font;

  ctx.fillStyle =
    textColor;

  ctx.textAlign =
    'center';

  ctx.textBaseline =
    'middle';


  if (
    ctx.letterSpacing !==
    undefined
  ) {
    ctx.letterSpacing =
      `${letterSpacing * 100}%`;
  }


  ctx.fillText(
    text,
    0,
    3
  );

  ctx.restore();
}


function renderSpeechBubble(
  ctx,
  text,
  x,
  y,
  w,
  h
) {
  ctx.save();

  ctx.translate(
    x,
    y
  );


  ctx.beginPath();

  ctx.moveTo(
    20,
    10
  );

  ctx.bezierCurveTo(
    w * 0.3,
    2,
    w * 0.7,
    4,
    w - 10,
    15
  );

  ctx.bezierCurveTo(
    w,
    h * 0.4,
    w - 2,
    h * 0.7,
    w - 15,
    h - 10
  );

  ctx.bezierCurveTo(
    w * 0.6,
    h - 2,
    w * 0.3,
    h + 4,
    15,
    h - 12
  );

  ctx.bezierCurveTo(
    0,
    h * 0.6,
    2,
    h * 0.3,
    20,
    10
  );

  ctx.closePath();


  ctx.shadowColor =
    'rgba(10, 10, 10, 0.35)';

  ctx.shadowBlur =
    24;

  ctx.shadowOffsetY =
    10;

  ctx.fillStyle =
    COLORS.paper;

  ctx.fill();


  ctx.shadowColor =
    'transparent';

  ctx.lineWidth =
    6;

  ctx.strokeStyle =
    COLORS.black;

  ctx.stroke();


  // Pointer tail

  ctx.beginPath();

  ctx.moveTo(
    60,
    h - 4
  );

  ctx.lineTo(
    -25,
    h + 50
  );

  ctx.lineTo(
    120,
    h - 4
  );

  ctx.closePath();

  ctx.fillStyle =
    COLORS.paper;

  ctx.fill();

  ctx.stroke();


  // Text inside bubble

  ctx.font =
    `italic 600 44px ${FONT_PRIMARY}`;

  ctx.fillStyle =
    COLORS.black;

  ctx.textAlign =
    'center';

  ctx.textBaseline =
    'middle';


  wrapText(
    ctx,
    `"${text}"`,
    w / 2,
    h / 2,
    w - 80,
    52
  );


  ctx.restore();
}


function wrapText(
  ctx,
  text,
  cx,
  cy,
  maxWidth,
  lineHeight
) {
  const words =
    text.split(' ');

  const lines = [];

  let line = '';


  for (const word of words) {
    const test =
      line +
      word +
      ' ';

    if (
      ctx.measureText(test).width >
      maxWidth &&
      line
    ) {
      lines.push(
        line.trim()
      );

      line =
        word +
        ' ';
    } else {
      line =
        test;
    }
  }


  lines.push(
    line.trim()
  );


  const startY =
    cy -
    ((lines.length - 1) *
      lineHeight) /
    2;


  lines.forEach(
    (l, i) => {
      ctx.fillText(
        l,
        cx,
        startY +
        i *
        lineHeight
      );
    }
  );
}


function renderGrainOverlay(
  ctx,
  w,
  h
) {
  ctx.save();

  ctx.globalAlpha =
    0.04;

  ctx.globalCompositeOperation =
    'overlay';


  const dotCount =
    Math.floor(
      (w * h) / 120
    );


  for (
    let i = 0;
    i < dotCount;
    i++
  ) {
    const x =
      Math.random() * w;

    const y =
      Math.random() * h;


    ctx.fillStyle =
      Math.random() > 0.5
        ? '#000000'
        : '#FFFFFF';


    ctx.fillRect(
      x,
      y,
      1.5,
      1.5
    );
  }


  ctx.restore();
}


function renderCheckerboardFrame(
  ctx,
  w,
  h
) {
  const inset =
    48;

  const step =
    28;


  ctx.save();


  ctx.strokeStyle =
    COLORS.yellow;

  ctx.lineWidth =
    4;


  ctx.strokeRect(
    inset,
    inset,
    w - inset * 2,
    h - inset * 2
  );


  ctx.fillStyle =
    COLORS.yellow;


  for (
    let x = inset;
    x < w - inset;
    x += step * 2
  ) {
    ctx.fillRect(
      x,
      inset - 6,
      step,
      6
    );

    ctx.fillRect(
      x,
      h - inset,
      step,
      6
    );
  }


  for (
    let y = inset;
    y < h - inset;
    y += step * 2
  ) {
    ctx.fillRect(
      inset - 6,
      y,
      6,
      step
    );

    ctx.fillRect(
      w - inset,
      y,
      6,
      step
    );
  }


  ctx.restore();
}