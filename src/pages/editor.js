/* ============================================================
   HH Goa 2026 — Builder Identity Studio (Editor)
   Streamlined design studio for creating single authoritative
   paper-cutout collectible identity posters.
   ============================================================ */

import '../styles/editor.css';
import { generateBuilderId, generateTeamId } from '../utils/builderId.js';
import { createIdentityPayload, createTeamPayload } from '../utils/identityData.js';
import { generateCaption, getTemplateCount, MANDATORY_HASHTAG } from '../utils/captionEngine.js';
import { renderCardCanvas, preloadStyle1Assets } from '../utils/canvasRenderer.js';
import { renderLanding } from './landing.js';
import { getAssetUrl } from '../utils/assetPath.js';

// Predefined Builder Classes
const BUILDER_CLASSES = [
  'ARCHITECT', 'PIONEER', 'VOYAGER', 'MAVERICK', 'ALCHEMIST', 'SENTINEL'
];

// Background choices with thumbnails
const BACKGROUNDS = [
  { id: 'agenda', name: 'Goa Villa', thumb: getAssetUrl('/assets/backgrounds/agenda.png'), previewColor: '#06402B' },
  { id: 'details', name: 'Coastal Sand', thumb: getAssetUrl('/assets/backgrounds/details.png'), previewColor: '#FDF8F0' },
  { id: 'sunrise', name: 'Goa Sunrise', thumb: getAssetUrl('/assets/backgrounds/Sun rise.png'), previewColor: '#FEE101' },
  { id: 'hackers', name: 'Hacker Room', thumb: getAssetUrl('/assets/backgrounds/hackers.png'), previewColor: '#1A1A1A' },
  { id: 'palms', name: 'Tropical Palms', thumb: getAssetUrl('/assets/backgrounds/footer trees.png'), previewColor: '#0B6839' }
];

/** Floating toast notification. */
function showToast(container, message) {
  let toast = container.querySelector('#toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-notification';
    container.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');
  setTimeout(() => toast.classList.remove('is-visible'), 2500);
}

/**
 * Render the Editor Page into the container.
 * @param {HTMLElement} container
 */
export async function renderEditor(container) {
  // Main Studio State
  const state = {
    mode: 'individual', // 'individual' | 'team'
    crewSize: 2, // 2 | 3
    bgChoice: 'agenda',
    activeTab: 'info', // 'info' | 'bg' | 'social'

    // Individual mode
    individual: {
      name: 'KISHAN R',
      stack: 'PYTHON · DEVOPS · AI',
      role: 'CODE NAVIGATOR BUILDER',
      builderClass: 'ARCHITECT',
      builderId: generateBuilderId(),
      socialHandle: '@kishan',
      photoImg: null,
      monochrome: true,
      speechText: 'Level sabke niklege...'
    },

    // Team mode
    team: {
      teamName: 'THE BEACH BUILDERS',
      teamId: generateTeamId(),
      members: [
        {
          builderId: generateBuilderId(),
          name: 'Alice Nakamoto',
          stack: 'Solana / Rust',
          role: 'Lead Architect',
          builderClass: 'ARCHITECT',
          socialHandle: '@alice',
          photoImg: null
        },
        {
          builderId: generateBuilderId(),
          name: 'Bob Finney',
          stack: 'React / Move',
          role: 'Frontend Dev',
          builderClass: 'MAVERICK',
          socialHandle: '@bob',
          photoImg: null
        },
        {
          builderId: generateBuilderId(),
          name: 'Charlie Szabo',
          stack: 'Smart Contracts',
          role: 'Protocol Engineer',
          builderClass: 'PIONEER',
          socialHandle: '@charlie',
          photoImg: null
        }
      ]
    },

    captionTemplateIndex: 0
  };

  /** Get active identity payload object */
  function getIdentity() {
    if (state.mode === 'team') {
      return createTeamPayload({
        mode: 'team',
        crewSize: state.crewSize,
        teamName: state.team.teamName,
        teamId: state.team.teamId,
        members: state.team.members.slice(0, state.crewSize)
      });
    }
    return createIdentityPayload({
      mode: 'individual',
      builderId: state.individual.builderId,
      name: state.individual.name,
      stack: state.individual.stack,
      role: state.individual.role,
      builderClass: state.individual.builderClass,
      socialHandle: state.individual.socialHandle
    });
  }

  // Initial HTML Structure
  container.innerHTML = `
    <div class="editor-container">
      <!-- Top Navigation -->
      <nav class="editor-nav">
        <div class="editor-nav-brand">
          <img src="${getAssetUrl('/assets/logos/Hacker house.png')}" alt="HH Logo" />
          <span>BUILDER POSTER STUDIO</span>
        </div>

        <!-- Mode Toggle: INDIVIDUAL vs CREW -->
        <div class="mode-tabs-wrap">
          <button class="mode-tab ${state.mode === 'individual' ? 'is-active' : ''}" id="tab-individual" type="button">
            Solo Poster
          </button>
          <button class="mode-tab ${state.mode === 'team' ? 'is-active' : ''}" id="tab-crew" type="button">
            Crew Poster
          </button>
        </div>

        <button class="editor-nav-back" id="btn-back-home" type="button" aria-label="Back to Landing Page">
          ← Back
        </button>
      </nav>

      <!-- Main Editor Layout -->
      <div class="editor-layout">

        <!-- Left/Center: Hero Live Card Canvas -->
        <section class="editor-preview-area" aria-label="Live Card Preview">
          <div class="card-canvas-wrapper" id="canvas-wrapper">
            <canvas class="card-preview-canvas" id="preview-canvas"></canvas>
            <div class="canvas-loading-overlay" id="loading-overlay">
              Loading Studio Assets...
            </div>
          </div>
        </section>

        <!-- Right: Studio Controls Panel -->
        <aside class="editor-controls-panel">
          
          <!-- Streamlined 3 Subtabs -->
          <div class="studio-subtabs-wrap" id="subtab-bar">
            <button class="subtab-btn ${state.activeTab === 'info' ? 'is-active' : ''}" id="subtab-info" type="button">Identity</button>
            <button class="subtab-btn ${state.activeTab === 'bg' ? 'is-active' : ''}" id="subtab-bg" type="button">Backdrop</button>
            <button class="subtab-btn ${state.activeTab === 'social' ? 'is-active' : ''}" id="subtab-social" type="button">Social & Share</button>
          </div>

          <div class="controls-body" id="controls-body">
            <!-- Dynamic Subtab Content -->
          </div>

          <!-- Download Action Footer -->
          <footer class="controls-footer">
            <button class="btn-export" id="btn-download" type="button">
              <span id="export-label">⬇ Download Identity Frame</span>
            </button>
          </footer>

        </aside>
      </div>
    </div>
  `;

  // DOM References
  const previewCanvas = container.querySelector('#preview-canvas');
  const canvasWrapper = container.querySelector('#canvas-wrapper');
  const loadingOverlay = container.querySelector('#loading-overlay');
  const controlsBody = container.querySelector('#controls-body');

  // Preload Assets & Initial Canvas Draw
  loadingOverlay?.classList.add('is-active');
  await preloadStyle1Assets();
  loadingOverlay?.classList.remove('is-active');

  /** Prepare current state payload for canvas renderer */
  function getCanvasData() {
    const commonData = {
      bgChoice: state.bgChoice,
      monochrome: state.individual.monochrome,
      speechText: state.individual.speechText
    };

    if (state.mode === 'team') {
      return {
        ...commonData,
        mode: 'team',
        crewSize: state.crewSize,
        teamName: state.team.teamName,
        teamId: state.team.teamId,
        members: state.team.members.slice(0, state.crewSize)
      };
    }

    return {
      ...commonData,
      mode: 'individual',
      name: state.individual.name,
      stack: state.individual.stack,
      role: state.individual.role,
      builderClass: state.individual.builderClass,
      builderId: state.individual.builderId,
      socialHandle: state.individual.socialHandle,
      photoImg: state.individual.photoImg
    };
  }

  let preparedShareFile = null;

  async function updatePreparedShareFile() {
    try {
      const blob = await renderCurrentCardToBlob();
      if (blob && blob.size > 0) {
        const filename = getSanitizedFilename();
        preparedShareFile = new File([blob], filename, { type: 'image/png' });
      }
    } catch (e) {
      preparedShareFile = null;
    }
  }

  /** Authoritative Render Update Trigger */
  async function updateAll() {
    if (state.mode === 'team') {
      canvasWrapper?.classList.add('is-landscape');
    } else {
      canvasWrapper?.classList.remove('is-landscape');
    }

    // Render onto preview canvas
    await renderCardCanvas(previewCanvas, getCanvasData(), { isExport: false });

    // Update social caption textarea if visible
    const captionPreview = container.querySelector('#caption-preview');
    if (captionPreview) {
      captionPreview.value = generateCaption(getIdentity(), state.captionTemplateIndex);
    }

    // Pre-calculate share file in background so social share handlers can execute synchronously
    updatePreparedShareFile();
  }

  /** Render Controls Panel UI based on active subtab */
  function renderControlsUI() {
    if (!controlsBody) return;

    // Highlight active subtab button
    ['info', 'bg', 'social'].forEach((tabName) => {
      const btn = container.querySelector(`#subtab-${tabName}`);
      if (btn) {
        if (state.activeTab === tabName) btn.classList.add('is-active');
        else btn.classList.remove('is-active');
      }
    });

    if (state.activeTab === 'info') {
      // ── IDENTITY / INFO SUBTAB ──
      if (state.mode === 'individual') {
        controlsBody.innerHTML = `
          <!-- Photo Upload & Paper Cutout Controls -->
          <div class="control-group">
            <span class="group-title">📸 Portrait Photo & Auto Paper-Cutout</span>
            <p class="controls-subtitle">Upload any portrait photo. Background is automatically removed and converted to a paper cutout silhouette outline.</p>

            <div class="photo-upload-zone" id="upload-zone">
              <div class="photo-upload-icon">✂️</div>
              <div class="photo-upload-prompt">${state.individual.photoImg ? 'Change Photo' : 'Drop portrait photo here or click'}</div>
              <input type="file" class="photo-file-input" id="photo-input" accept="image/*" />
            </div>

            ${state.individual.photoImg ? `
              <div style="margin-top: 12px; background: var(--hh-black); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--hh-graphite);">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size: 12px; font-weight:700; color:var(--hh-white);">CUTOUT STYLE</span>
                  <button class="btn-secondary" id="btn-toggle-mono" type="button" style="width: 130px;">
                    ${state.individual.monochrome ? 'Monochrome' : 'Full Color'}
                  </button>
                </div>
              </div>
            ` : ''}

            <label class="form-label" style="margin-top: 12px;">Speech Bubble Callout</label>
            <input type="text" class="form-input" id="input-speech" value="${state.individual.speechText}" placeholder="e.g. Level sabke niklege..." maxlength="40" />
          </div>

          <!-- Builder Profile Fields -->
          <div class="control-group">
            <span class="group-title">👤 Builder Identity</span>
            <label class="form-label">Name *</label>
            <input type="text" class="form-input" id="input-name" value="${state.individual.name}" maxlength="30" />

            <label class="form-label">Stack / Skills *</label>
            <input type="text" class="form-input" id="input-stack" value="${state.individual.stack}" maxlength="35" />

            <label class="form-label">Role / Designation</label>
            <input type="text" class="form-input" id="input-role" value="${state.individual.role}" maxlength="35" />

            <label class="form-label">Builder Class</label>
            <select class="form-select" id="select-class">
              ${BUILDER_CLASSES.map((c) => `<option value="${c}" ${c === state.individual.builderClass ? 'selected' : ''}>${c}</option>`).join('')}
            </select>

            <label class="form-label">Social Handle</label>
            <input type="text" class="form-input" id="input-handle" value="${state.individual.socialHandle}" placeholder="@handle" maxlength="30" />
          </div>

          <!-- Builder ID -->
          <div class="control-group">
            <span class="group-title">🆔 Builder ID</span>
            <div style="display: flex; gap: 8px;">
              <input type="text" class="form-input" id="input-builder-id" value="${state.individual.builderId}" readonly style="color: var(--hh-yellow); font-weight:700;" />
              <button class="btn-secondary" id="btn-new-id" type="button" style="flex:none; padding:0 16px;">🔄 New</button>
            </div>
          </div>
        `;
        bindIndividualControls();
      } else {
        // Team mode info controls
        controlsBody.innerHTML = `
          <div class="control-group">
            <span class="group-title">👥 Crew Composition</span>
            <div class="crew-tabs-wrap">
              <button class="crew-tab ${state.crewSize === 2 ? 'is-active' : ''}" id="tab-crew-2" type="button">Crew of 2 (16:9)</button>
              <button class="crew-tab ${state.crewSize === 3 ? 'is-active' : ''}" id="tab-crew-3" type="button">Crew of 3 (4:5)</button>
            </div>
          </div>

          <div class="control-group">
            <span class="group-title">🏷️ Team Identity</span>
            <label class="form-label">Team Name *</label>
            <input type="text" class="form-input" id="input-team-name" value="${state.team.teamName}" placeholder="e.g. THE BEACH BUILDERS" maxlength="32" />

            <label class="form-label" style="margin-top: 8px;">Team ID</label>
            <div style="display: flex; gap: 8px;">
              <input type="text" class="form-input" id="input-team-id" value="${state.team.teamId}" readonly style="color: var(--hh-yellow); font-weight:700;" />
              <button class="btn-secondary" id="btn-new-team-id" type="button" style="flex:none; padding:0 16px;">🔄 New</button>
            </div>
          </div>

          ${Array.from({ length: state.crewSize }, (_, idx) => renderMemberFormHTML(idx)).join('')}
        `;
        bindTeamControls();
      }

    } else if (state.activeTab === 'bg') {
      // ── BACKDROP SUBTAB ──
      controlsBody.innerHTML = `
        <div class="control-group">
          <span class="group-title">🌆 Poster Backdrop Wallpaper</span>
          <p class="controls-subtitle">Select a Goa tropical background theme.</p>
          <div class="bg-picker-grid">
            ${BACKGROUNDS.map((bg) => `
              <button class="btn-secondary bg-option ${state.bgChoice === bg.id ? 'is-active-style' : ''}" data-bg-id="${bg.id}" type="button">
                <div class="bg-thumb-preview" style="background-color: ${bg.previewColor};">
                  ${bg.thumb ? `<img src="${bg.thumb}" alt="${bg.name}" class="bg-thumb-img" />` : ''}
                </div>
                <span class="bg-name-label">${bg.name}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;

      container.querySelectorAll('.bg-option').forEach((el) => {
        el.addEventListener('click', (e) => {
          state.bgChoice = e.currentTarget.dataset.bgId;
          renderControlsUI();
          updateAll();
        });
      });

    } else if (state.activeTab === 'social') {
      // ── SOCIAL & CAPTION SUBTAB ──
      controlsBody.innerHTML = `
        <div class="control-group">
          <span class="group-title">
            <span>💬 Social Caption Engine</span>
            <span style="color: var(--hh-yellow); font-size: 10px;">${MANDATORY_HASHTAG} Included</span>
          </span>
          <p class="controls-subtitle">Dynamic captions for ${state.mode} identity. Click to rotate template.</p>

          <div class="caption-box-wrap">
            <textarea class="caption-textarea" id="caption-preview" readonly></textarea>
            <div class="caption-actions">
              <button class="btn-caption-action" id="btn-rotate-caption" type="button">↻ Change Caption</button>
              <button class="btn-caption-action btn-caption-copy" id="btn-copy-caption" type="button">Copy Caption</button>
            </div>
          </div>
        </div>

        <div class="control-group">
          <span class="group-title">🚀 Share To Platform</span>
          <div class="share-buttons-grid">
            <button class="btn-share btn-x" id="btn-share-x" type="button">𝕏 Share</button>
            <button class="btn-share btn-whatsapp" id="btn-share-wa" type="button">WhatsApp</button>
            <button class="btn-share btn-instagram" id="btn-share-ig" type="button">Instagram</button>
            <button class="btn-share" id="btn-share-native" type="button">Share...</button>
          </div>
        </div>
      `;
      bindCommonSocialControls();
      const captionPreview = container.querySelector('#caption-preview');
      if (captionPreview) {
        captionPreview.value = generateCaption(getIdentity(), state.captionTemplateIndex);
      }
    }
  }

  function renderMemberFormHTML(idx) {
    const m = state.team.members[idx] || {};
    return `
      <div class="member-card-box" style="margin-top: 12px;">
        <div class="member-card-title">
          <span>MEMBER 0${idx + 1}</span>
          <span style="color: var(--hh-slate); font-size: 11px;">ID: ${m.builderId}</span>
        </div>

        <div class="photo-upload-zone" id="upload-zone-m${idx}">
          <div class="photo-upload-icon">✂️</div>
          <div class="photo-upload-prompt">${m.photoImg ? 'Change Photo' : `Upload Photo`}</div>
          <input type="file" class="photo-file-input" id="photo-input-m${idx}" accept="image/*" />
        </div>

        <label class="form-label">Name *</label>
        <input type="text" class="form-input input-name-m" data-idx="${idx}" value="${m.name || ''}" placeholder="Teammate Name" maxlength="26" />

        <label class="form-label">Stack *</label>
        <input type="text" class="form-input input-stack-m" data-idx="${idx}" value="${m.stack || ''}" placeholder="Skills" maxlength="30" />

        <label class="form-label">Role</label>
        <input type="text" class="form-input input-role-m" data-idx="${idx}" value="${m.role || ''}" placeholder="Role" maxlength="30" />
      </div>
    `;
  }

  // ── Subtab Switcher Events (3 Streamlined Tabs) ──
  ['info', 'bg', 'social'].forEach((tabName) => {
    container.querySelector(`#subtab-${tabName}`)?.addEventListener('click', () => {
      state.activeTab = tabName;
      renderControlsUI();
      updateAll();
    });
  });

  // ── Mode Switcher & Tab Listeners ──
  const tabIndividual = container.querySelector('#tab-individual');
  const tabCrew = container.querySelector('#tab-crew');

  tabIndividual?.addEventListener('click', () => {
    state.mode = 'individual';
    state.captionTemplateIndex = 0;
    tabIndividual.classList.add('is-active');
    tabCrew?.classList.remove('is-active');
    renderControlsUI();
    updateAll();
  });

  tabCrew?.addEventListener('click', () => {
    state.mode = 'team';
    state.captionTemplateIndex = 0;
    tabCrew.classList.add('is-active');
    tabIndividual?.classList.remove('is-active');
    renderControlsUI();
    updateAll();
  });

  // ── Bind Individual Mode Controls ──
  function bindIndividualControls() {
    container.querySelector('#input-name')?.addEventListener('input', (e) => {
      state.individual.name = e.target.value; updateAll();
    });
    container.querySelector('#input-stack')?.addEventListener('input', (e) => {
      state.individual.stack = e.target.value; updateAll();
    });
    container.querySelector('#input-role')?.addEventListener('input', (e) => {
      state.individual.role = e.target.value; updateAll();
    });
    container.querySelector('#select-class')?.addEventListener('change', (e) => {
      state.individual.builderClass = e.target.value; updateAll();
    });
    container.querySelector('#input-handle')?.addEventListener('input', (e) => {
      state.individual.socialHandle = e.target.value; updateAll();
    });
    container.querySelector('#input-speech')?.addEventListener('input', (e) => {
      state.individual.speechText = e.target.value; updateAll();
    });

    const btnNewId = container.querySelector('#btn-new-id');
    const inputBuilderId = container.querySelector('#input-builder-id');
    btnNewId?.addEventListener('click', () => {
      state.individual.builderId = generateBuilderId();
      if (inputBuilderId) inputBuilderId.value = state.individual.builderId;
      updateAll();
      showToast(container, 'NEW ID GENERATED ✓');
    });

    const photoInput = container.querySelector('#photo-input');
    photoInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const img = new Image();
        img.onload = () => {
          state.individual.photoImg = img;
          renderControlsUI(); updateAll();
          showToast(container, 'PHOTO CUTOUT PROCESSED ✓');
        };
        img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    });

    container.querySelector('#btn-toggle-mono')?.addEventListener('click', () => {
      state.individual.monochrome = !state.individual.monochrome;
      renderControlsUI(); updateAll();
    });
  }

  // ── Bind Team Mode Controls ──
  function bindTeamControls() {
    container.querySelector('#tab-crew-2')?.addEventListener('click', () => {
      state.crewSize = 2; renderControlsUI(); updateAll();
    });
    container.querySelector('#tab-crew-3')?.addEventListener('click', () => {
      state.crewSize = 3; renderControlsUI(); updateAll();
    });

    container.querySelector('#input-team-name')?.addEventListener('input', (e) => {
      state.team.teamName = e.target.value; updateAll();
    });

    const btnNewTeamId = container.querySelector('#btn-new-team-id');
    const inputTeamId = container.querySelector('#input-team-id');
    btnNewTeamId?.addEventListener('click', () => {
      state.team.teamId = generateTeamId();
      if (inputTeamId) inputTeamId.value = state.team.teamId;
      updateAll();
      showToast(container, 'NEW TEAM ID GENERATED ✓');
    });

    container.querySelectorAll('.input-name-m').forEach((el) => {
      el.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        state.team.members[idx].name = e.target.value; updateAll();
      });
    });
    container.querySelectorAll('.input-stack-m').forEach((el) => {
      el.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        state.team.members[idx].stack = e.target.value; updateAll();
      });
    });
    container.querySelectorAll('.input-role-m').forEach((el) => {
      el.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        state.team.members[idx].role = e.target.value; updateAll();
      });
    });

    Array.from({ length: state.crewSize }).forEach((_, idx) => {
      const pInput = container.querySelector(`#photo-input-m${idx}`);
      pInput?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          const img = new Image();
          img.onload = () => {
            state.team.members[idx].photoImg = img;
            renderControlsUI(); updateAll();
            showToast(container, `MEMBER 0${idx + 1} CUTOUT PROCESSED ✓`);
          };
          img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // ── Helper to render current frame to PNG Blob ──
  async function renderCurrentCardToBlob() {
    return new Promise((resolve) => {
      try {
        const exportCanvas = document.createElement('canvas');
        renderCardCanvas(exportCanvas, getCanvasData(), { isExport: true }).then(() => {
          if (exportCanvas.toBlob) {
            exportCanvas.toBlob((blob) => {
              if (blob && blob.size > 0) resolve(blob);
              else resolve(null);
            }, 'image/png');
          } else {
            const dataUrl = exportCanvas.toDataURL('image/png');
            if (!dataUrl || !dataUrl.startsWith('data:image/png')) {
              resolve(null); return;
            }
            const arr = dataUrl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) { u8arr[n] = bstr.charCodeAt(n); }
            const blob = new Blob([u8arr], { type: mime });
            if (blob && blob.size > 0) resolve(blob);
            else resolve(null);
          }
        }).catch(err => {
          console.error('Failed renderCardCanvas in blob helper:', err);
          resolve(null);
        });
      } catch (err) {
        console.error('Failed to render current card to blob:', err);
        resolve(null);
      }
    });
  }

  function downloadBlobFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  // ── Common Caption & Social Share Listeners ──
  function bindCommonSocialControls() {
    const captionPreview = container.querySelector('#caption-preview');

    function getCaptionText() {
      if (captionPreview && captionPreview.value) {
        return captionPreview.value;
      }
      return generateCaption(getIdentity(), state.captionTemplateIndex);
    }

    container.querySelector('#btn-rotate-caption')?.addEventListener('click', () => {
      const count = getTemplateCount(state.mode);
      state.captionTemplateIndex = (state.captionTemplateIndex + 1) % count;
      if (captionPreview) {
        captionPreview.value = generateCaption(getIdentity(), state.captionTemplateIndex);
      }
      showToast(container, 'Caption template changed ↻');
    });

    container.querySelector('#btn-copy-caption')?.addEventListener('click', async () => {
      const text = getCaptionText();
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(text);
          const btn = container.querySelector('#btn-copy-caption');
          if (btn) { btn.classList.add('is-copied'); btn.textContent = 'COPIED ✓'; }
          showToast(container, 'CAPTION COPIED ✓');
          setTimeout(() => {
            if (btn) { btn.classList.remove('is-copied'); btn.textContent = 'Copy Caption'; }
          }, 2000);
        } catch (e) {
          showToast(container, '⚠ COPY FAILED. Select text to copy.');
        }
      }
    });

    function shareToX() {
      const caption = getCaptionText();
      const shareUrl = `https://x.com/intent/post?text=${encodeURIComponent(caption)}`;
      window.location.href = shareUrl;
      showToast(container, 'FRAME READY ✓ — Opening X post composer...');
    }

    function shareToWhatsApp() {
      const caption = getCaptionText();
      const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(caption)}`;
      window.location.href = shareUrl;
      showToast(container, 'FRAME READY ✓ — Opening WhatsApp...');
    }

    function shareToInstagram() {
      const caption = getCaptionText();
      if (navigator.share && navigator.canShare && preparedShareFile && navigator.canShare({ files: [preparedShareFile] })) {
        navigator.share({
          title: 'Hacker House Goa 2026',
          text: caption,
          files: [preparedShareFile]
        }).then(() => {
          showToast(container, 'FRAME SHARED ✓');
        }).catch((err) => {
          if (err?.name !== 'AbortError') console.error('Share failed:', err);
        });
        return;
      }

      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
      showToast(container, 'CAPTION COPIED ✓ — Upload your identity frame on Instagram!');
    }

    function shareNative() {
      const caption = getCaptionText();
      if (navigator.share) {
        const shareData = {
          title: 'Hacker House Goa 2026',
          text: caption
        };
        if (preparedShareFile && navigator.canShare && navigator.canShare({ files: [preparedShareFile] })) {
          shareData.files = [preparedShareFile];
        }
        navigator.share(shareData).then(() => {
          showToast(container, 'FRAME SHARED ✓');
        }).catch((err) => {
          if (err?.name !== 'AbortError') console.error('Native share failed:', err);
        });
        return;
      }

      if (navigator.clipboard) {
        navigator.clipboard.writeText(caption).catch(() => {});
      }
      showToast(container, 'CAPTION COPIED ✓ — Link & caption copied to clipboard!');
    }

    container.querySelector('#btn-share-x')?.addEventListener('click', (e) => { e.preventDefault(); shareToX(); });
    container.querySelector('#btn-share-wa')?.addEventListener('click', (e) => { e.preventDefault(); shareToWhatsApp(); });
    container.querySelector('#btn-share-ig')?.addEventListener('click', (e) => { e.preventDefault(); shareToInstagram(); });
    container.querySelector('#btn-share-native')?.addEventListener('click', (e) => { e.preventDefault(); shareNative(); });
  }

  // ══════════════════════════════════════════════════════════════
  // EXPORT PIPELINE
  // ══════════════════════════════════════════════════════════════

  function getSanitizedFilename() {
    if (state.mode === 'team') {
      const sanitized = (state.team.teamName || 'team').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      return `hh-goa-2026-team-${sanitized || 'crew'}.png`;
    }
    const sanitized = (state.individual.name || 'builder').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    return `hh-goa-2026-${sanitized || 'frame'}.png`;
  }

  async function triggerDownload() {
    try {
      const blob = await renderCurrentCardToBlob();
      const filename = getSanitizedFilename();
      if (!blob || blob.size === 0) {
        showToast(container, '⚠ EXPORT FAILED. Please try again.');
        return;
      }
      downloadBlobFile(blob, filename);
      showToast(container, 'IDENTITY FRAME SAVED ✓');
    } catch (err) {
      console.error('Export error caught:', err);
      showToast(container, '⚠ EXPORT FAILED. Please try again.');
    }
  }

  // Action Button Listeners
  container.querySelector('#btn-download')?.addEventListener('click', triggerDownload);
  container.querySelector('#btn-back-home')?.addEventListener('click', () => {
    renderLanding(container);
  });

  // Initial render setup
  renderControlsUI();
  updateAll();
}
