/* ============================================
   SQLSENSEI — Lesson Page Renderer
   Loads lesson by URL ?module=X.Y
   ============================================ */

(function () {
  'use strict';

  function init() {
    const modId = window.getUrlParam('module') || '1.1';
    const lesson = window.LESSONS[modId];
    const mod = window.getModuleById(modId);
    const level = window.getLevelByNumber(mod ? mod.levelNumber : 1);

    if (!lesson || !mod) {
      document.getElementById('lessonMain').innerHTML = `
        <h1>Module not found</h1>
        <p>That module doesn't exist. <a href="mindmap.html">Back to mind map →</a></p>
      `;
      return;
    }

    document.title = `${mod.id} ${mod.title} · SQLSENSEI`;

    renderSidebar(modId);
    renderMain(modId, lesson, mod, level);
    wireExercises();
  }

  function renderSidebar(currentId) {
    const wrap = document.getElementById('lessonSidebar');
    if (!wrap) return;

    let html = '';
    window.CURRICULUM.forEach(lvl => {
      html += `<h3>L${lvl.number} · ${lvl.title}</h3>`;
      lvl.modules.forEach(m => {
        const active = m.id === currentId ? 'active' : '';
        html += `
          <a href="lesson.html?module=${m.id}" class="lesson-sidebar-link ${active}">
            <span class="lid">${m.id}</span>
            <span>${m.title}</span>
          </a>
        `;
      });
    });

    wrap.innerHTML = html;
  }

  function renderMain(modId, lesson, mod, level) {
    const main = document.getElementById('lessonMain');

    // Build breadcrumb
    let html = `
      <div class="lesson-breadcrumb">
        <a href="mindmap.html">Mind Map</a>
        <span>/</span>
        <span style="color: ${level.color};">Level ${level.number} — ${level.title}</span>
        <span>/</span>
        <span style="color: var(--ink-100);">${mod.id}</span>
      </div>

      <h1 class="lesson-title">${lesson.title}</h1>
      <p class="lesson-lead">${lesson.lead}</p>

      <div class="concept-box">
        <div class="concept-box-label">📍 Module ${mod.id} · ${mod.topic}</div>
      </div>
    `;

    // Sections
    lesson.sections.forEach((sec, i) => {
      html += `<div class="lesson-section">`;
      html += `<h2><span class="num">${String(i + 1).padStart(2, '0')}</span> ${sec.title}</h2>`;
      if (sec.body) html += sec.body;
      if (sec.showTable) {
        html += `<h3>Table: <code>${sec.showTable}</code></h3>`;
        html += window.renderTable(sec.showTable, { rows: 8 });
      }
      if (sec.examples) {
        sec.examples.forEach(ex => {
          html += window.codeBlock(ex.sql);
        });
      }
      html += `</div>`;
    });

    // Insight
    if (lesson.insight) {
      html += `
        <div class="insight-box">
          <div class="insight-box-label">💡 Key Insight</div>
          <p>${lesson.insight}</p>
        </div>
      `;
    }

    // Practice exercises
    if (lesson.practice && lesson.practice.length) {
      html += `<div class="lesson-section">`;
      html += `<h2><span class="num">★</span> Practice</h2>`;
      lesson.practice.forEach((ex, idx) => {
        html += `
          <div class="exercise" data-idx="${idx}">
            <div class="exercise-header">
              <span>✏️ Exercise ${idx + 1} of ${lesson.practice.length}</span>
            </div>
            <div class="exercise-prompt">${ex.prompt}</div>
            <div class="exercise-actions">
              <button class="btn btn-primary btn-sm exercise-toggle">Show Solution</button>
              <button class="btn btn-secondary btn-sm exercise-playground" data-sql="${encodeURIComponent(ex.solution || '')}">Open in Playground →</button>
            </div>
            <div class="exercise-solution">
              <div class="exercise-solution-label">✓ Solution</div>
              ${window.codeBlock(ex.solution)}
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }

    // Takeaways
    if (lesson.takeaways && lesson.takeaways.length) {
      html += `
        <div class="takeaways">
          <h3>✓ 3 things to remember</h3>
          <ol>
            ${lesson.takeaways.map(t => `<li>${t}</li>`).join('')}
          </ol>
        </div>
      `;
    }

    // Prev / Next nav
    const all = window.getAllModules();
    const idx = all.findIndex(m => m.id === modId);
    const prev = idx > 0 ? all[idx - 1] : null;
    const next = idx < all.length - 1 ? all[idx + 1] : null;

    html += `<div class="module-nav">`;
    if (prev) {
      html += `
        <a href="lesson.html?module=${prev.id}" class="module-nav-link prev">
          <div class="module-nav-label">← Previous · ${prev.id}</div>
          <div class="module-nav-title">${prev.title}</div>
        </a>
      `;
    } else {
      html += `<div></div>`;
    }
    if (next) {
      html += `
        <a href="lesson.html?module=${next.id}" class="module-nav-link next">
          <div class="module-nav-label">Next · ${next.id} →</div>
          <div class="module-nav-title">${next.title}</div>
        </a>
      `;
    } else {
      html += `
        <a href="mindmap.html" class="module-nav-link next">
          <div class="module-nav-label">🎓 Done →</div>
          <div class="module-nav-title">Back to Mind Map</div>
        </a>
      `;
    }
    html += `</div>`;

    main.innerHTML = html;
  }

  function wireExercises() {
    document.querySelectorAll('.exercise-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ex = e.target.closest('.exercise');
        ex.classList.toggle('show-solution');
        btn.textContent = ex.classList.contains('show-solution') ? 'Hide Solution' : 'Show Solution';
      });
    });

    document.querySelectorAll('.exercise-playground').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sql = e.target.dataset.sql;
        window.open(`playground.html?q=${sql}`, '_blank');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
