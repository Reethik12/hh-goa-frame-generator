/* ============================================================
   HH Goa 2026 — Social Caption Engine (CORE FEATURE)
   Generates human, catchy, playful hacker & Goa-themed captions
   for both Individual and Team/Crew modes.
   Mandatory Hashtag: #FrameInGoa (REQUIRED)
   ============================================================ */

/**
 * MANDATORY HASHTAG — Required by hackathon tracking rules.
 * NEVER omit or remove this string.
 */
export const MANDATORY_HASHTAG = '#FrameInGoa';

/**
 * Secondary supporting hashtags.
 */
export const SUPPORTING_HASHTAGS = '#HHGoa2026 #HackerHouse #Goa #Builders';

/**
 * 13 distinct Individual Caption Templates.
 */
export const INDIVIDUAL_TEMPLATES = [
  // 0: Classic Builder
  (d) => `Just framed my builder identity for Hacker House Goa 2026 🏝️⚡

${d.name}${d.stack ? ` | ${d.stack}` : ''}
${d.builderClass ? `Class: ${d.builderClass}` : ''}
ID: ${d.builderId}

Building ideas. Shipping chaos. Catch you in Goa.

${MANDATORY_HASHTAG} ${SUPPORTING_HASHTAGS}`,

  // 1: Terminal / Hacker Status
  (d) => `> STATUS: CONFIRMED FOR HH GOA 2026 💻🌴

Name: ${d.name}
Stack: ${d.stack}
Role: ${d.role || 'Builder'}
ID: ${d.builderId}

Ready to hack by the ocean.

${MANDATORY_HASHTAG} #HHGoa2026 #Goa #Builders`,

  // 2: Goa Called / Shipped
  (d) => `Goa called. I shipped. 🌊⚡

${d.name}
${d.builderClass ? `${d.builderClass} · ` : ''}${d.stack}
ID: ${d.builderId}

${MANDATORY_HASHTAG} #Goa #HackerHouse #Builders`,

  // 3: Beach & Smart Contracts
  (d) => `Sun, sand, and smart contracts ☀️🌊

${d.name} is heading to Hacker House Goa 2026!
Stack: ${d.stack} | ID: ${d.builderId}

Let's build something epic by the beach.

${MANDATORY_HASHTAG} ${SUPPORTING_HASHTAGS}`,

  // 4: Not Just A Badge
  (d) => `Not just a badge. A builder identity. 🎫⚡

${d.name}
${d.stack}${d.builderClass ? ` · ${d.builderClass}` : ''}
ID: ${d.builderId}

${MANDATORY_HASHTAG} #HHGoa2026 #Builders`,

  // 5: Code & Coast Grid
  (d) => `Built something real. Found my way to Goa.
Now officially on the builder grid. 🌴⚡

${d.name} · ${d.stack}
ID: ${d.builderId}

${MANDATORY_HASHTAG} ${SUPPORTING_HASHTAGS}`,

  // 6: Cyber Tropical Protocol
  (d) => `⚡ HACKER HOUSE GOA 2026 PASSPORT ⚡

Holder: ${d.name}
Class: ${d.builderClass || 'ARCHITECT'}
Stack: ${d.stack}
ID: ${d.builderId}

Protocol initialized. See you on the coast.

${MANDATORY_HASHTAG} #HackerHouse #Goa`,

  // 7: Tropical Chaos
  (d) => `Current status: BUILDING IN GOA 🌴⚡

${d.name} (${d.builderId})
Stack: ${d.stack}

Less talk. More shipping.

${MANDATORY_HASHTAG} ${SUPPORTING_HASHTAGS}`,

  // 8: Arcade Player Profile
  (d) => `🎮 PLAYER 1 READY FOR HH GOA 2026 🎮

Name: ${d.name}
Class: ${d.builderClass || 'MAVERICK'}
Stack: ${d.stack}
ID: ${d.builderId}

Leveling up by the Arabian Sea!

${MANDATORY_HASHTAG} #HHGoa2026 #Goa`,

  // 9: Classified Dossier
  (d) => `📁 CLASSIFIED BUILDER DOSSIER // HH-GOA-2026

Subject: ${d.name}
Role: ${d.role || 'Core Developer'}
Specialization: ${d.stack}
Identity Code: ${d.builderId}

Clearance: GRANTED.

${MANDATORY_HASHTAG} #HackerHouse #Goa`,

  // 10: Sunset Signal
  (d) => `Sunset signals from the coast. 🌅⚡

${d.name} is confirmed for Hacker House Goa 2026.
${d.stack} | ${d.builderId}

${MANDATORY_HASHTAG} ${SUPPORTING_HASHTAGS}`,

  // 11: Mainnet Launch
  (d) => `Deploying to Goa mainnet. 🚀🌴

${d.name} (${d.builderId})
Stack: ${d.stack}

${MANDATORY_HASHTAG} #HHGoa2026 #Builders`,

  // 12: Collector Edition Pass
  (d) => `HACKER HOUSE GOA 2026 — BUILDER PASS 🏝️

Name: ${d.name}
Class: ${d.builderClass || 'PIONEER'}
ID: ${d.builderId}

${MANDATORY_HASHTAG} ${SUPPORTING_HASHTAGS}`
];

/**
 * 13 distinct Team/Crew Caption Templates.
 */
export const TEAM_TEMPLATES = [
  // 0: Classic Team Pass
  (d) => `The crew is locked in for Hacker House Goa 2026! 🌴⚡

Team: ${d.teamName} (Crew of ${d.crewSize})
Team ID: ${d.teamId}

Members:
${d.members.map((m, i) => `${i + 1}. ${m.name} (${m.stack || 'Dev'})`).join('\n')}

Goa isn't ready for this build.

${MANDATORY_HASHTAG} ${SUPPORTING_HASHTAGS}`,

  // 1: Crew Terminal Status
  (d) => `> SQUAD CONFIRMED FOR HH GOA 2026 💻🌊

Team: ${d.teamName}
Team ID: ${d.teamId}

Squad Roster:
${d.members.map((m) => `• ${m.name} [${m.role || 'Member'}]`).join('\n')}

Status: Shipping from the shore.

${MANDATORY_HASHTAG} #HHGoa2026 #Crew`,

  // 2: Multi-Builder Beach Raid
  (d) => `Building together. Shipping together.
${d.teamName} is heading to Goa! ☀️🏄‍♂️

Team ID: ${d.teamId}
${d.members.map((m, i) => `Builder 0${i + 1}: ${m.name} · ${m.stack}`).join('\n')}

${MANDATORY_HASHTAG} ${SUPPORTING_HASHTAGS}`,

  // 3: Cyberpunk Squad Protocol
  (d) => `⚡ HACKER HOUSE GOA 2026 CREW PROTOCOL ⚡

Crew: ${d.teamName}
Team ID: ${d.teamId}

Roster:
${d.members.map((m) => `> ${m.name} (${m.builderClass || 'ARCHITECT'})`).join('\n')}

See you in the tropico-digital realm!

${MANDATORY_HASHTAG} #HackerHouse #Goa`,

  // 4: Not 1, Not 2, The Whole Crew
  (d) => `We don't hack solo. We pull up as a crew. 🌴🚀

Team: ${d.teamName}
Team ID: ${d.teamId}
Members: ${d.members.map((m) => m.name).join(' & ')}

${MANDATORY_HASHTAG} #HHGoa2026 #Builders`,

  // 5: Tropical Syndicate
  (d) => `🌴 GOA BUILDER SYNDICATE 🌴

Team Name: ${d.teamName}
Team ID: ${d.teamId}
Crew Count: ${d.crewSize}

Roster:
${d.members.map((m) => `• ${m.name} (${m.stack})`).join('\n')}

${MANDATORY_HASHTAG} ${SUPPORTING_HASHTAGS}`,

  // 6: Arcade Squad Select
  (d) => `🎮 MULTI-PLAYER CREW SELECT 🎮

Team: ${d.teamName} (ID: ${d.teamId})
Players: ${d.members.map((m) => m.name).join(', ')}

Co-op mode: ENGAGED.

${MANDATORY_HASHTAG} #HHGoa2026`,

  // 7: Classified Crew Dossier
  (d) => `📁 CLASSIFIED SQUAD FILE // HH-GOA-2026

Unit: ${d.teamName}
Team ID: ${d.teamId}
Agents: ${d.members.map((m) => `${m.name} (${m.role || 'Agent'})`).join(', ')}

Mission: Ship relentless software by the sea.

${MANDATORY_HASHTAG} #HackerHouse #Goa`,

  // 8: Sunset Squad Signal
  (d) => `Sunset signals for ${d.teamName}! 🌅⚡

Team ID: ${d.teamId}
Crew: ${d.members.map((m) => m.name).join(' + ')}

${MANDATORY_HASHTAG} ${SUPPORTING_HASHTAGS}`,

  // 9: Mainnet Alliance
  (d) => `Deploying the crew to Goa mainnet. 🚀🌴

Squad: ${d.teamName} (${d.teamId})
Builders:
${d.members.map((m) => `→ ${m.name} | ${m.stack}`).join('\n')}

${MANDATORY_HASHTAG} #HHGoa2026 #Builders`,

  // 10: Coastal Syndicate
  (d) => `Coastline credentials generated! 🏝️

Team: ${d.teamName}
Team ID: ${d.teamId}
Members: ${d.members.map((m) => m.name).join(', ')}

${MANDATORY_HASHTAG} ${SUPPORTING_HASHTAGS}`,

  // 11: High Voltage Squad
  (d) => `HIGH VOLTAGE SQUAD LOCKED FOR GOA ⚡

Team: ${d.teamName}
Team ID: ${d.teamId}
Roster:
${d.members.map((m) => `⚡ ${m.name} (${m.stack})`).join('\n')}

${MANDATORY_HASHTAG} #HHGoa2026 #Goa`,

  // 12: Collector Edition Crew Pass
  (d) => `HACKER HOUSE GOA 2026 — OFFICIAL CREW PASS 🎫

Team: ${d.teamName}
ID: ${d.teamId}
Crew of ${d.crewSize}: ${d.members.map((m) => m.name).join(', ')}

${MANDATORY_HASHTAG} ${SUPPORTING_HASHTAGS}`
];

/**
 * Generate social caption from individual or team identity payload.
 * @param {Object} identity
 * @param {number} [templateIndex=0]
 * @returns {string}
 */
export function generateCaption(identity, templateIndex = 0) {
  if (identity.mode === 'team') {
    const idx = templateIndex % TEAM_TEMPLATES.length;
    return TEAM_TEMPLATES[idx](identity);
  }
  const idx = templateIndex % INDIVIDUAL_TEMPLATES.length;
  return INDIVIDUAL_TEMPLATES[idx](identity);
}

/**
 * Get total template count for mode.
 * @param {string} mode
 * @returns {number}
 */
export function getTemplateCount(mode = 'individual') {
  if (mode === 'team') return TEAM_TEMPLATES.length;
  return INDIVIDUAL_TEMPLATES.length;
}
