/* ============================================================
   HH Goa 2026 — Sticker Library Database
   Contains 32 curated vector stickers across 4 categories:
   1. GOA: Goa Hindi, Palm Tree, Sunset, Ocean Wave, Beach, Coconut, Goa Badge, Goa Map
   2. HACKER: HH Emblem, Terminal, Code, Cursor, Security, Verified, Lock, Command Prompt
   3. FUN: Lightning, Star, Sparkle, Coffee, Arrow, Fire, Rocket, Game Controller
   4. IDENTITY: Builder, Passport, ID Badge, Architect, Core, Founder, Verified, Crew
   ============================================================ */

import { getAssetUrl } from './assetPath.js';

export const STICKER_CATEGORIES = ['GOA', 'HACKER', 'FUN', 'IDENTITY'];

export const STICKER_LIBRARY = [
  // ── GOA CATEGORY (8 stickers) ──
  {
    id: 'goa_hindi',
    name: 'Goa Hindi',
    category: 'GOA',
    svgIcon: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="none" stroke="#0B6839" stroke-width="2.5"/><text x="20" y="25" text-anchor="middle" font-size="13" fill="#0B6839" font-weight="800">गोआ</text></svg>',
    assetUrl: getAssetUrl('/assets/logos/goa_hindi.svg')
  },
  {
    id: 'palm_tree',
    name: 'Palm Tree',
    category: 'GOA',
    svgIcon: '<svg viewBox="0 0 40 40"><path d="M20 38V18M20 18c-6-2-12 0-14-6s6-4 14 6M20 18c6-2 12 0 14-6s-6-4-14 6" stroke="#0B6839" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>'
  },
  {
    id: 'sunset_badge',
    name: 'Goa Sunset',
    category: 'GOA',
    svgIcon: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="#EDD723"/><path d="M6 28h28" stroke="#0A0A0A" stroke-width="2"/><path d="M10 28c0-8 20-8 20 0" fill="none" stroke="#C78118" stroke-width="2"/></svg>'
  },
  {
    id: 'wave_icon',
    name: 'Ocean Wave',
    category: 'GOA',
    svgIcon: '<svg viewBox="0 0 40 40"><path d="M4 22q4-7 8 0t8 0 8 0 8 0" fill="none" stroke="#9AC95F" stroke-width="3" stroke-linecap="round"/></svg>',
    assetUrl: getAssetUrl('/assets/decorations/2-47.svg')
  },
  {
    id: 'beach_umbrella',
    name: 'Beach Umbrella',
    category: 'GOA',
    svgIcon: '<svg viewBox="0 0 40 40"><path d="M20 10v26M8 20c0-8 24-8 24 0" fill="none" stroke="#FF0080" stroke-width="2.5" stroke-linecap="round"/><path d="M8 20h24" stroke="#FF0080" stroke-width="2"/></svg>'
  },
  {
    id: 'coconut',
    name: 'Tender Coconut',
    category: 'GOA',
    svgIcon: '<svg viewBox="0 0 40 40"><circle cx="20" cy="22" r="12" fill="#0B6839"/><path d="M14 16l12 0M22 10l4-6" stroke="#FAFAFA" stroke-width="2" stroke-linecap="round"/></svg>'
  },
  {
    id: 'amber_badge',
    name: 'Goa Stamp',
    category: 'GOA',
    svgIcon: '<svg viewBox="0 0 40 40"><rect x="6" y="8" width="28" height="24" rx="4" fill="#EDD723" stroke="#0A0A0A" stroke-width="2"/><text x="20" y="24" text-anchor="middle" font-size="10" fill="#0A0A0A" font-weight="800">GOA 26</text></svg>',
    assetUrl: getAssetUrl('/assets/stickers/182-frame-1948754788-54-30962.svg')
  },
  {
    id: 'goa_map',
    name: 'Goa Coast',
    category: 'GOA',
    svgIcon: '<svg viewBox="0 0 40 40"><path d="M12 8c6 2 4 10 10 12s4 12 6 12" fill="none" stroke="#0B6839" stroke-width="3" stroke-linecap="round"/><circle cx="22" cy="20" r="4" fill="#FF0080"/></svg>'
  },

  // ── HACKER CATEGORY (8 stickers) ──
  {
    id: 'hh_emblem_pink',
    name: 'HH Pink Emblem',
    category: 'HACKER',
    svgIcon: '<svg viewBox="0 0 40 40"><rect x="6" y="6" width="28" height="28" rx="4" fill="none" stroke="#FF0080" stroke-width="2.5"/><text x="20" y="25" text-anchor="middle" font-size="14" fill="#FF0080" font-weight="800">HH</text></svg>',
    assetUrl: getAssetUrl('/assets/logos/179-vector-54-30944.svg')
  },
  {
    id: 'hh_emblem_yellow',
    name: 'HH Yellow Emblem',
    category: 'HACKER',
    svgIcon: '<svg viewBox="0 0 40 40"><rect x="6" y="6" width="28" height="28" rx="4" fill="#EDD723" stroke="#0A0A0A" stroke-width="2"/><text x="20" y="25" text-anchor="middle" font-size="14" fill="#0A0A0A" font-weight="800">HH</text></svg>',
    assetUrl: getAssetUrl('/assets/logos/036-vector-54-3934.svg')
  },
  {
    id: 'terminal_icon',
    name: 'Terminal CLI',
    category: 'HACKER',
    svgIcon: '<svg viewBox="0 0 40 40"><rect x="4" y="8" width="32" height="24" rx="3" fill="#1A1A1A" stroke="#9AC95F" stroke-width="2"/><path d="M10 18l5 4-5 4M18 26h10" stroke="#9AC95F" stroke-width="2" stroke-linecap="round"/></svg>'
  },
  {
    id: 'code_symbol',
    name: 'Code Tags',
    category: 'HACKER',
    svgIcon: '<svg viewBox="0 0 40 40"><path d="M14 12l-8 8 8 8M26 12l8 8-8 8" stroke="#9AC95F" stroke-width="3" fill="none" stroke-linecap="round"/></svg>'
  },
  {
    id: 'cursor_pointer',
    name: 'Pixel Cursor',
    category: 'HACKER',
    svgIcon: '<svg viewBox="0 0 40 40"><path d="M10 6l16 14-8 2 5 10-4 2-5-10-4 4z" fill="#0A0A0A" stroke="#FAFAFA" stroke-width="1.5"/></svg>'
  },
  {
    id: 'security_stamp',
    name: 'Verified Security',
    category: 'HACKER',
    svgIcon: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="none" stroke="#FF0080" stroke-width="1.5" stroke-dasharray="3 2"/><text x="20" y="18" text-anchor="middle" font-size="7" fill="#FF0080" font-weight="700">VERIFIED</text><text x="20" y="26" text-anchor="middle" font-size="6" fill="#FF0080">2026</text></svg>'
  },
  {
    id: 'lock_icon',
    name: 'Crypto Lock',
    category: 'HACKER',
    svgIcon: '<svg viewBox="0 0 40 40"><rect x="10" y="18" width="20" height="16" rx="3" fill="#0B6839"/><path d="M14 18v-6a6 6 0 0112 0v6" fill="none" stroke="#0B6839" stroke-width="2.5"/></svg>'
  },
  {
    id: 'command_prompt',
    name: 'Cmd Prompt',
    category: 'HACKER',
    svgIcon: '<svg viewBox="0 0 40 40"><rect x="6" y="10" width="28" height="20" rx="3" fill="#0A0A0A" stroke="#EDD723" stroke-width="2"/><text x="20" y="24" text-anchor="middle" font-size="10" fill="#EDD723" font-weight="800">&gt;_</text></svg>'
  },

  // ── FUN CATEGORY (8 stickers) ──
  {
    id: 'lightning',
    name: 'High Voltage',
    category: 'FUN',
    svgIcon: '<svg viewBox="0 0 40 40"><path d="M22 4L10 22h10l-2 14 14-20h-10z" fill="#EDD723" stroke="#0A0A0A" stroke-width="1.5"/></svg>'
  },
  {
    id: 'star_accent',
    name: 'Glitter Star',
    category: 'FUN',
    svgIcon: '<svg viewBox="0 0 40 40"><path d="M20 4l4.5 11H36l-9 7 3.5 11L20 26l-10.5 7 3.5-11-9-7h11.5z" fill="#EDD723" stroke="#0A0A0A" stroke-width="1"/></svg>',
    assetUrl: getAssetUrl('/assets/decorations/181-frame-1948754789-54-30958.svg')
  },
  {
    id: 'sparkle',
    name: 'Sparkle Burst',
    category: 'FUN',
    svgIcon: '<svg viewBox="0 0 40 40"><path d="M20 4v32M4 20h32M9 9l22 22M31 9L9 31" stroke="#FF0080" stroke-width="2" stroke-linecap="round"/><circle cx="20" cy="20" r="3" fill="#FF0080"/></svg>'
  },
  {
    id: 'coffee_cup',
    name: 'Hacker Coffee',
    category: 'FUN',
    svgIcon: '<svg viewBox="0 0 40 40"><rect x="10" y="14" width="16" height="18" rx="2" fill="none" stroke="#C78118" stroke-width="2.5"/><path d="M26 18h4a3 3 0 010 6h-4" fill="none" stroke="#C78118" stroke-width="2.5"/></svg>'
  },
  {
    id: 'fire_emoji',
    name: 'Shipping Fire',
    category: 'FUN',
    svgIcon: '<svg viewBox="0 0 40 40"><path d="M20 6c-2 6-8 10-8 18 0 6 5 10 10 10s10-4 10-10c0-6-6-10-8-18z" fill="#FF0055"/></svg>'
  },
  {
    id: 'rocket_launch',
    name: 'Mainnet Rocket',
    category: 'FUN',
    svgIcon: '<svg viewBox="0 0 40 40"><path d="M20 6c6 0 10 8 10 16l-10 6-10-6c0-8 4-16 10-16z" fill="#FF0080"/><circle cx="20" cy="18" r="4" fill="#FAFAFA"/></svg>'
  },
  {
    id: 'game_controller',
    name: 'Arcade Pad',
    category: 'FUN',
    svgIcon: '<svg viewBox="0 0 40 40"><rect x="6" y="12" width="28" height="16" rx="6" fill="#0F0C20" stroke="#00FFEA" stroke-width="2"/><path d="M12 20h6M15 17v6" stroke="#00FFEA" stroke-width="2"/><circle cx="26" cy="18" r="2" fill="#FF0077"/><circle cx="29" cy="22" r="2" fill="#FEE101"/></svg>'
  },
  {
    id: 'arrow_badge',
    name: 'Go Arrow',
    category: 'FUN',
    svgIcon: '<svg viewBox="0 0 40 40"><path d="M20 4l16 18H4z" fill="#9AC95F" stroke="#0A0A0A" stroke-width="1.5"/><text x="20" y="18" text-anchor="middle" font-size="7" fill="#0A0A0A" font-weight="800">GO</text></svg>'
  },

  // ── IDENTITY CATEGORY (8 stickers) ──
  {
    id: 'builder_badge',
    name: 'Builder Card',
    category: 'IDENTITY',
    svgIcon: '<svg viewBox="0 0 40 40"><rect x="6" y="8" width="28" height="24" rx="3" fill="#0A0A0A" stroke="#EDD723" stroke-width="2"/><text x="20" y="24" text-anchor="middle" font-size="8" fill="#EDD723" font-weight="800">BUILDER</text></svg>'
  },
  {
    id: 'passport_stamp',
    name: 'Visa Stamp',
    category: 'IDENTITY',
    svgIcon: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="none" stroke="#C78118" stroke-width="2"/><circle cx="20" cy="20" r="12" fill="none" stroke="#C78118" stroke-width="1"/><text x="20" y="18" text-anchor="middle" font-size="6" fill="#C78118" font-weight="700">GOA</text><text x="20" y="25" text-anchor="middle" font-size="5" fill="#C78118">2026</text></svg>'
  },
  {
    id: 'id_chip',
    name: 'Identity Chip',
    category: 'IDENTITY',
    svgIcon: '<svg viewBox="0 0 40 40"><rect x="10" y="10" width="20" height="20" rx="3" fill="#C78118" stroke="#0A0A0A" stroke-width="2"/><path d="M16 10v20M24 10v20M10 16h20M10 24h20" stroke="#0A0A0A" stroke-width="1"/></svg>'
  },
  {
    id: 'architect_label',
    name: 'Architect',
    category: 'IDENTITY',
    svgIcon: '<svg viewBox="0 0 40 40"><rect x="4" y="12" width="32" height="16" rx="2" fill="#0B6839"/><text x="20" y="23" text-anchor="middle" font-size="7" fill="#FAFAFA" font-weight="800">ARCHITECT</text></svg>'
  },
  {
    id: 'core_dev',
    name: 'Core Dev',
    category: 'IDENTITY',
    svgIcon: '<svg viewBox="0 0 40 40"><rect x="4" y="12" width="32" height="16" rx="2" fill="#FF0080"/><text x="20" y="23" text-anchor="middle" font-size="7" fill="#FAFAFA" font-weight="800">CORE DEV</text></svg>'
  },
  {
    id: 'founder_seal',
    name: 'Founder Seal',
    category: 'IDENTITY',
    svgIcon: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="#EDD723" stroke="#0A0A0A" stroke-width="2"/><text x="20" y="23" text-anchor="middle" font-size="8" fill="#0A0A0A" font-weight="800">FOUNDER</text></svg>'
  },
  {
    id: 'verified_check',
    name: 'Verified Check',
    category: 'IDENTITY',
    svgIcon: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="#0B6839"/><path d="M13 20l4 4 10-10" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/></svg>'
  },
  {
    id: 'crew_badge',
    name: 'Crew Member',
    category: 'IDENTITY',
    svgIcon: '<svg viewBox="0 0 40 40"><rect x="6" y="12" width="28" height="16" rx="8" fill="#2B4162"/><text x="20" y="23" text-anchor="middle" font-size="7" fill="#FAFAFA" font-weight="800">CREW 26</text></svg>'
  }
];

/**
 * Get sticker configuration by ID.
 * @param {string} id
 * @returns {Object}
 */
export function getStickerConfig(id) {
  return STICKER_LIBRARY.find(s => s.id === id) || STICKER_LIBRARY[0];
}
