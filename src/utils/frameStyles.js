/* ============================================================
   HH Goa 2026 — Frame Style System Configurations
   Provides design settings for all 8 original styles:
   1. Goa Builder Pass (Retro Goa travel poster + conference pass)
   2. Cyber Tropical (Futuristic dark neon cyberpunk Goa)
   3. Hacker Passport (Official hacker visa travel document)
   4. Beach Terminal (CLI developer console running on shore)
   5. Retro Postcard (Vintage Polaroid postcard)
   6. Goa Arcade (Retro arcade profile character screen)
   7. Digital Dossier (Classified intelligence dossier file)
   8. Sunset Signal (Premium editorial Goa poster)
   ============================================================ */

export const FRAME_STYLES = [
  {
    id: 'builder-pass',
    name: 'Goa Builder Pass',
    description: 'Retro Goa travel poster meets hacker conference pass. Warm cream, sand, ticket scallops, and palms.',
    theme: {
      bgColor: '#F5E6D0',
      textColor: '#0A0A0A',
      labelColor: '#0B6839',
      valueColor: '#0A0A0A',
      borderColor: '#0B6839',
      accentColor: '#FF0080',
      idBgColor: '#0A0A0A',
      idTextColor: '#FEE101',
      qrBgColor: '#FAFAFA',
      barcodeBgColor: '#FAFAFA'
    },
    options: {
      hasScallops: true,
      hasZigzag: true,
      hasFooterTrees: true,
      hasHindiStamp: true,
      photoBorderWidth: 10,
      photoBorderRadius: 24,
      photoOuterBorder: '#FF0080',
      photoInnerBorder: '#0B6839',
      photoFrameBg: '#1A1A1A',
      cornerDecorations: 'crosshair',
      fontDisplay: 'Imbue',
      fontMono: 'Victor Mono',
      grainOpacity: 0.04,
      hasWave: true,
      layoutVariant: 'classic'
    }
  },
  {
    id: 'cyber-tropical',
    name: 'Cyber Tropical',
    description: 'Futuristic dark cyberpunk beachfront console. Charcoal background, neon pink glow, and CRT scanlines.',
    theme: {
      bgColor: '#0A0A0A',
      textColor: '#FAFAFA',
      labelColor: '#9AC95F',
      valueColor: '#FAFAFA',
      borderColor: '#FF0080',
      accentColor: '#9AC95F',
      idBgColor: '#FF0080',
      idTextColor: '#FAFAFA',
      qrBgColor: '#FAFAFA',
      barcodeBgColor: '#FAFAFA'
    },
    options: {
      hasScallops: false,
      hasZigzag: false,
      hasFooterTrees: true,
      hasHindiStamp: false,
      photoBorderWidth: 8,
      photoBorderRadius: 0, // Sharp rectangular crop
      photoOuterBorder: '#FF0080',
      photoInnerBorder: '#FF0080',
      photoFrameBg: '#1A1A1A',
      cornerDecorations: 'crosshair',
      fontDisplay: 'Imbue',
      fontMono: 'Victor Mono',
      grainOpacity: 0.02,
      hasWave: false,
      layoutVariant: 'cyber'
    }
  },
  {
    id: 'hacker-passport',
    name: 'Hacker Passport',
    description: 'Official fictional hacker visa travel document. Passport grid, security marks, and visa hierarchy.',
    theme: {
      bgColor: '#FDF8F0',
      textColor: '#0A0A0A',
      labelColor: '#6B6B6B',
      valueColor: '#0A0A0A',
      borderColor: '#0B6839',
      accentColor: '#C78118',
      idBgColor: '#2A2A2A',
      idTextColor: '#FAFAFA',
      qrBgColor: '#FAFAFA',
      barcodeBgColor: '#FAFAFA'
    },
    options: {
      hasScallops: true,
      hasZigzag: true,
      hasFooterTrees: false,
      hasHindiStamp: true,
      photoBorderWidth: 6,
      photoBorderRadius: 0,
      photoOuterBorder: '#0B6839',
      photoInnerBorder: '#0B6839',
      photoFrameBg: '#1A1A1A',
      cornerDecorations: 'passport-corners',
      fontDisplay: 'Imbue',
      fontMono: 'Victor Mono',
      grainOpacity: 0.05,
      hasWave: false,
      layoutVariant: 'passport'
    }
  },
  {
    id: 'beach-terminal',
    name: 'Beach Terminal',
    description: 'CLI developer console running on a sandy shore. Monospace CLI formatting, green text, and horizon wave.',
    theme: {
      bgColor: '#1A1A1A',
      textColor: '#9AC95F',
      labelColor: '#9AC95F',
      valueColor: '#FAFAFA',
      borderColor: '#9AC95F',
      accentColor: '#EDD723',
      idBgColor: '#0A0A0A',
      idTextColor: '#EDD723',
      qrBgColor: '#FAFAFA',
      barcodeBgColor: '#FAFAFA'
    },
    options: {
      hasScallops: false,
      hasZigzag: false,
      hasFooterTrees: true,
      hasHindiStamp: false,
      photoBorderWidth: 8,
      photoBorderRadius: 9999, // Circular photo crop
      photoOuterBorder: '#9AC95F',
      photoInnerBorder: '#0B6839',
      photoFrameBg: '#0A0A0A',
      cornerDecorations: 'none',
      fontDisplay: 'Victor Mono',
      fontMono: 'Victor Mono',
      grainOpacity: 0.03,
      hasWave: true,
      layoutVariant: 'terminal'
    }
  },
  {
    id: 'retro-postcard',
    name: 'Retro Postcard',
    description: 'Nostalgic Polaroid postcard. Tilted photo frames, Greetings stamp, paper grain, and analog print aesthetic.',
    theme: {
      bgColor: '#FDF8F0',
      textColor: '#0A0A0A',
      labelColor: '#C78118',
      valueColor: '#0A0A0A',
      borderColor: '#C78118',
      accentColor: '#FF0080',
      idBgColor: '#FEE101',
      idTextColor: '#0A0A0A',
      qrBgColor: '#FAFAFA',
      barcodeBgColor: '#FAFAFA'
    },
    options: {
      hasScallops: true,
      hasZigzag: false,
      hasFooterTrees: true,
      hasHindiStamp: true,
      photoBorderWidth: 16, // Polaroid white border
      photoBorderRadius: 4,
      photoOuterBorder: '#FAFAFA',
      photoInnerBorder: '#FAFAFA',
      photoFrameBg: '#FAFAFA',
      cornerDecorations: 'none',
      fontDisplay: 'Imbue',
      fontMono: 'Victor Mono',
      grainOpacity: 0.07,
      hasWave: true,
      layoutVariant: 'postcard'
    }
  },
  {
    id: 'goa-arcade',
    name: 'Goa Arcade',
    description: 'Retro arcade character profile screen. Pixel UI accents, player stats, level badges, and game UI.',
    theme: {
      bgColor: '#0F0C20',
      textColor: '#00FFEA',
      labelColor: '#FF0077',
      valueColor: '#00FFEA',
      borderColor: '#FF0077',
      accentColor: '#FEE101',
      idBgColor: '#FF0077',
      idTextColor: '#FFFFFF',
      qrBgColor: '#FFFFFF',
      barcodeBgColor: '#FFFFFF'
    },
    options: {
      hasScallops: false,
      hasZigzag: true,
      hasFooterTrees: false,
      hasHindiStamp: false,
      photoBorderWidth: 8,
      photoBorderRadius: 8,
      photoOuterBorder: '#00FFEA',
      photoInnerBorder: '#FF0077',
      photoFrameBg: '#05030A',
      cornerDecorations: 'pixel-corners',
      fontDisplay: 'Victor Mono',
      fontMono: 'Victor Mono',
      grainOpacity: 0.02,
      hasWave: false,
      layoutVariant: 'arcade'
    }
  },
  {
    id: 'digital-dossier',
    name: 'Digital Dossier',
    description: 'Classified Hacker House intelligence dossier file. Confidential labels, profile blocks, and redactions.',
    theme: {
      bgColor: '#EBE5D8',
      textColor: '#1A1A1A',
      labelColor: '#8C1C13',
      valueColor: '#1A1A1A',
      borderColor: '#8C1C13',
      accentColor: '#2B4162',
      idBgColor: '#1A1A1A',
      idTextColor: '#EBE5D8',
      qrBgColor: '#FFFFFF',
      barcodeBgColor: '#FFFFFF'
    },
    options: {
      hasScallops: false,
      hasZigzag: false,
      hasFooterTrees: false,
      hasHindiStamp: true,
      photoBorderWidth: 4,
      photoBorderRadius: 0,
      photoOuterBorder: '#8C1C13',
      photoInnerBorder: '#1A1A1A',
      photoFrameBg: '#D8D0C0',
      cornerDecorations: 'dossier-clips',
      fontDisplay: 'Imbue',
      fontMono: 'Victor Mono',
      grainOpacity: 0.06,
      hasWave: false,
      layoutVariant: 'dossier'
    }
  },
  {
    id: 'sunset-signal',
    name: 'Sunset Signal',
    description: 'Premium editorial Goa poster. Cinematic sunset composition, bold editorial typography, and wave shapes.',
    theme: {
      bgColor: '#1D0A1C',
      textColor: '#FF9E00',
      labelColor: '#FF0055',
      valueColor: '#FFFFFF',
      borderColor: '#FF0055',
      accentColor: '#FF9E00',
      idBgColor: '#FF0055',
      idTextColor: '#FFFFFF',
      qrBgColor: '#FFFFFF',
      barcodeBgColor: '#FFFFFF'
    },
    options: {
      hasScallops: false,
      hasZigzag: false,
      hasFooterTrees: true,
      hasHindiStamp: false,
      photoBorderWidth: 10,
      photoBorderRadius: 30,
      photoOuterBorder: '#FF9E00',
      photoInnerBorder: '#FF0055',
      photoFrameBg: '#0F040E',
      cornerDecorations: 'none',
      fontDisplay: 'Imbue',
      fontMono: 'Victor Mono',
      grainOpacity: 0.03,
      hasWave: true,
      layoutVariant: 'sunset'
    }
  }
];

/**
 * Get frame style by ID.
 * @param {string} id
 * @returns {Object}
 */
export function getFrameStyle(id) {
  return FRAME_STYLES.find(style => style.id === id) || FRAME_STYLES[0];
}
