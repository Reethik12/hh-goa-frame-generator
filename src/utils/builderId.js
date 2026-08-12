/* ============================================================
   HH Goa 2026 — Builder & Team ID Generator
   Generates session-based IDs:
   - Individual: HH-GOA-26-XXXX
   - Team:       HH-GOA-26-CREW-XXXX
   ============================================================ */

/**
 * Generate a random 4-character uppercase alphanumeric code.
 * @returns {string}
 */
export function generateRandomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a full Builder ID string.
 * @param {string} [customCode]
 * @returns {string} e.g. "HH-GOA-26-9X2M"
 */
export function generateBuilderId(customCode) {
  const code = customCode || generateRandomCode();
  return `HH-GOA-26-${code}`;
}

/**
 * Generate a full Team ID string.
 * @param {string} [customCode]
 * @returns {string} e.g. "HH-GOA-26-CREW-7K2P"
 */
export function generateTeamId(customCode) {
  const code = customCode || generateRandomCode();
  return `HH-GOA-26-CREW-${code}`;
}
