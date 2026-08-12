/* ============================================================
   HH Goa 2026 — Identity Data Utility
   Single source of truth for builder & team identity state.
   ============================================================ */

/**
 * @typedef {Object} MemberIdentity
 * @property {string} builderId
 * @property {string} name
 * @property {string} stack
 * @property {string} [role]
 * @property {string} [builderClass]
 * @property {string} [socialHandle]
 * @property {HTMLImageElement|null} [photoImg]
 * @property {number} [zoom]
 * @property {number} [panX]
 * @property {number} [panY]
 */

/**
 * @typedef {Object} TeamIdentity
 * @property {string} mode - 'team'
 * @property {number} crewSize - 2 | 3
 * @property {string} teamName
 * @property {string} teamId
 * @property {MemberIdentity[]} members
 */

/**
 * Create a structured individual identity payload.
 * @param {Object} data
 * @returns {Object}
 */
export function createIdentityPayload(data = {}) {
  if (data.mode === 'team') {
    return createTeamPayload(data);
  }

  return {
    mode: 'individual',
    builderId: data.builderId || 'HH-GOA-26-9X2M',
    name: (data.name || 'Anonymous Builder').trim(),
    stack: (data.stack || 'Full Stack').trim(),
    role: (data.role || 'Builder').trim(),
    builderClass: (data.builderClass || 'ARCHITECT').trim(),
    socialHandle: (data.socialHandle || '').trim()
  };
}

/**
 * Create a structured team identity payload.
 * @param {Object} data
 * @returns {TeamIdentity}
 */
export function createTeamPayload(data = {}) {
  const crewSize = Math.min(3, Math.max(2, data.crewSize || 2));
  const rawMembers = data.members || [];
  
  const members = Array.from({ length: crewSize }, (_, idx) => {
    const m = rawMembers[idx] || {};
    return {
      builderId: m.builderId || `HH-GOA-26-M${idx + 1}X`,
      name: (m.name || `Member 0${idx + 1}`).trim(),
      stack: (m.stack || 'Full Stack').trim(),
      role: (m.role || 'Builder').trim(),
      builderClass: (m.builderClass || 'ARCHITECT').trim(),
      socialHandle: (m.socialHandle || '').trim(),
      photoImg: m.photoImg || null,
      zoom: m.zoom || 1.0,
      panX: m.panX || 0,
      panY: m.panY || 0
    };
  });

  return {
    mode: 'team',
    crewSize,
    teamName: (data.teamName || 'THE BEACH BUILDERS').trim(),
    teamId: data.teamId || 'HH-GOA-26-CREW-7K2P',
    members
  };
}

/**
 * Format QR Code text payload from individual or team identity object.
 * Guaranteed to produce a compact, readable string within QR matrix limits.
 * @param {Object} identity
 * @returns {string}
 */
export function formatQRPayload(identity) {
  return 'https://reethik12.github.io/hh-goa-frame-generator/';
}

/**
 * Format Barcode text payload (Code 128 Subset B format).
 * @param {Object} identity
 * @returns {string}
 */
export function formatBarcodePayload(identity = {}) {
  if (!identity) return 'HH-GOA-26-9X2M';
  if (identity.mode === 'team') {
    return identity.teamId || 'HH-GOA-26-CREW-7K2P';
  }
  return identity.builderId || 'HH-GOA-26-9X2M';
}
