/* ============================================
   SQLSENSEI — Mind Map V2
   Clean horizontal tree, working clicks,
   color-coded levels, expandable modules.
   ============================================ */

(function () {
  'use strict';

  function renderMindMap(containerId) {
    const container = document.getElementById(containerId);
    if (!container || !window.CURRICULUM) return;

    container.innerHTML = `
      <div class="mm-tree">
        <div class="mm-root">
          <div class="mm-root-inner">
            <div class="mm-root-label">SQL</div>
            <div class="mm-root-sub">SENSEI</div>
          </div>
        </div>
        <div class="mm-branches">
          ${window.CURRICULUM.map((lvl, i) => renderLevel(lvl, i)).join('')}
        </div>
      </div>
    `;

    // Wire up clicks
    container.querySelectorAll('.mm-module').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.moduleId;
        window.location.href = `lesson.html?module=${id}`;
      });
    });

    container.querySelectorAll('.mm-level-card').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.mm-module')) return;
        const id = el.dataset.firstModule;
        window.location.href = `lesson.html?module=${id}`;
      });
    });
  }

  function renderLevel(lvl, i) {
    const color = lvl.color;
    return `
      <div class="mm-level" style="--lvl-color: ${color};">
        <div class="mm-connector"></div>
        <div class="mm-level-card" data-first-module="${lvl.modules[0].id}">
          <div class="mm-level-header">
            <div class="mm-level-badge">L${lvl.number}</div>
            <div>
              <div class="mm-level-title">${lvl.title}</div>
              <div class="mm-level-tagline">${lvl.tagline}</div>
            </div>
          </div>
          <div class="mm-modules">
            ${lvl.modules.map(m => `
              <div class="mm-module" data-module-id="${m.id}">
                <span class="mm-module-id">${m.id}</span>
                <span class="mm-module-title">${m.title}</span>
                <svg class="mm-module-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  window.renderMindMap = renderMindMap;
})();
