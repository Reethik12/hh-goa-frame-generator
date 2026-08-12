/* ============================================================
   HH Goa 2026 — Main Entry Point
   Imports all style layers and bootstraps the app.
   ============================================================ */

import './styles/tokens.css';
import './styles/reset.css';
import './styles/landing.css';
import { renderLanding } from './pages/landing.js';

/**
 * Boot the application.
 * Phase 1: Landing page only.
 */
function init() {
  const app = document.getElementById('app');
  if (!app) return;

  renderLanding(app);
}

// Wait for DOM ready (module scripts are deferred by default, but be safe)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
