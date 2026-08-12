# HH Goa 2026 — Builder Identity Studio

## Design Specification & UI/UX Architecture

**Version:** 2.1 (Master Final Overhaul Complete)  
**Date:** 2026-08-12  
**Status:** Full Production Release Verified in Live Browser Runtime (Zero Canvas Tainting, Hardware-Accelerated Glitch Slice Engine, High-Contrast QR/Barcode Matrix, 8 Distinct Styles, 24 Compositions, Interactive Object Stickers, 6 Live Effects, Web Share API + File Export Fallbacks).

---

## A. Product Vision

A premium, highly interactive, collectible identity builder for **Hacker House Goa 2026**. Attendees can design, customize, and export personalized builder identity cards — as an **Individual** or as a **Crew of 2 / Crew of 3**.

- **Cinematic Landing Page**: Video backdrop, clear typography, zero text collisions, bold `CREATE YOUR CARD` CTA.
- **Studio Editor**: Hero canvas preview, professional sidebar control tabs (Style, Identity, Background, Stickers, Effects, Social).
- **Single Source of Truth**: Unified canvas renderer (`renderCardCanvas`) powering both live preview and high-resolution PNG exports.

---

## B. Aspect Ratios & Export Dimensions

| Mode | Members | Photos | Aspect Ratio | Dimensions | Composition Style |
|------|---------|--------|--------------|------------|-------------------|
| **Individual** | 1 | 1 | 4:5 Portrait | 2160 × 2700 | Hero personal poster |
| **Crew of 2** | 2 | 2 | 16:9 Landscape | 3840 × 2160 | Paired crew poster |
| **Crew of 3** | 3 | 3 | 4:5 Portrait | 2160 × 2700 | Trio squad poster |

---

## C. 8 Distinct Frame Styles (24 Total Layouts)

1. **Goa Builder Pass (`builder-pass`)**: Retro travel pass, warm cream tones, ticket scallops, tropical stamp accents.
2. **Cyber Tropical (`cyber-tropical`)**: Dark vaporwave, neon pink & lime glow, scanlines, digital coordinates.
3. **Hacker Passport (`hacker-passport`)**: Passport visa document, security gridlines, formal rectangular framing, document stamps.
4. **Beach Terminal (`beach-terminal`)**: Developer CLI console, monospace typography, terminal green headers, ocean backdrop.
5. **Retro Postcard (`retro-postcard`)**: Polaroid postcard, paper texture, handwritten typography accents, warm vintage feel.
6. **Goa Arcade (`goa-arcade`)**: Retro arcade character screen, "PLAYER 01", "BUILDER LEVEL: MAX", score badges.
7. **Digital Dossier (`digital-dossier`)**: Classified hacker identity file, security redaction bars, red stamps, technical coordinates.
8. **Sunset Signal (`sunset-signal`)**: Minimal premium editorial poster, amber-to-pink sunset background, giant serif headlines.

---

## D. Interactive Canvas Sticker Engine

- **Properties**: `instanceId`, `stickerId`, `nx`, `ny`, `scale`, `rotation`.
- **Interactions**:
  - Pointer drag across preview canvas.
  - Selection overlay with rotate (`↻`), scale (`⤢`), and delete (`✖`) handles.
  - Sidebar control sliders for scale & rotation.
  - Keyboard `Delete` / `Backspace` support.
  - Maximum 5 stickers limit with toast notification.
- **Parity**: Exact position, scale, and rotation rendered on exported PNG.

---

## E. Hardware-Accelerated Static Visual Effects Engine

- **Effects**: Glitch, Scanlines, Film Grain, Vignette, Halftone, Chromatic Aberration.
- **Glitch Implementation**: Hardware-accelerated slice displacement (`ctx.drawImage(ctx.canvas, ...)`), eliminating `getImageData` canvas tainting while rendering instant digital slice shifts.
- **Export Toggle**: `includeEffectsInExport` toggle allows toggling post-processing on output PNG.

---

## F. High-Contrast QR Code & Barcode Engine

- **Scannable QR**: Encodes real identity / team payload string. Automatic contrast resolution guarantees dark modules on light background across all 8 themes.
- **Code 128 Barcode**: Encodes Builder ID / Team ID with readable bar text and quiet zone.

---

## G. Social Sharing & Hashtags

- **Mandatory Hashtag**: `#FrameInGoa` strictly present in all 26 templates (13 individual, 13 team).
- **Web Share API**: Directly passes generated PNG image blob + caption text on supporting devices (`navigator.share`).
- **Fallbacks**: Downloads PNG card, copies caption to clipboard, opens platform intent (𝕏, WhatsApp, Instagram).
