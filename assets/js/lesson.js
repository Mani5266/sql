/* ============================================
   SQLSENSEI — Lesson Page V2
   Concept + Tables + Inline editor per exercise
   Real sql.js execution + auto-checking
   ============================================ */

(function () {
  'use strict';

  const SQL_JS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js';
  const SQL_WASM_URL = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.wasm';

  let SQL = null;
  let db = null;
  let dbReady = null;

  // ============================================
  // sql.js bootstrap (shared single DB for the page)
  // ============================================
  async function initDB() {
    if (!window.initSqlJs) await loadScript(SQL_JS_URL);
    SQL = await window.initSqlJs({ locateFile: () => SQL_WASM_URL });
    db = new SQL.Database();
    seedDatabase();
  }

  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  function seedDatabase() {
    const ds = window.DATASET;
    Object.keys(ds).forEach(tableName => {
      const table = ds[tableName];
      const colDefs = table.columns.map(c => {
        let def = `${c.name} ${c.type}`;
        if (c.pk) def += ' PRIMARY KEY';
        return def;
      }).join(', ');
      db.run(`CREATE TABLE ${tableName} (${colDefs});`);
      const placeholders = table.columns.map(() => '?').join(', ');
      const stmt = db.prepare(`INSERT INTO ${tableName} VALUES (${placeholders});`);
      table.rows.forEach(row => stmt.run(row));
      stmt.free();
    });
  }

  // ============================================
  // BOOT
  // ============================================
  async function init() {
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

    // Boot DB in background (non-blocking)
    dbReady = initDB().catch(err => {
      console.error('DB init failed:', err);
      document.querySelectorAll('.ex-btn-run').forEach(b => {
        b.disabled = true;
        b.textContent = 'DB Error';
      });
    });

    wireExercises();
  }

  // ============================================
  // SIDEBAR
  // ============================================
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

  // ============================================
  // MAIN CONTENT
  // ============================================
  function renderMain(modId, lesson, mod, level) {
    const main = document.getElementById('lessonMain');

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

    // Sections (concepts, examples, sample tables)
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

    // Tables shown automatically if not in sections
    if (lesson.tables && !lesson.sections.some(s => s.showTable)) {
      html += `<div class="lesson-section">`;
      html += `<h2><span class="num">📊</span> Reference tables</h2>`;
      lesson.tables.forEach(t => {
        html += `<h3>Table: <code>${t}</code></h3>`;
        html += window.renderTable(t, { rows: 8 });
      });
      html += `</div>`;
    }

    // Insight
    if (lesson.insight) {
      html += `
        <div class="insight-box">
          <div class="insight-box-label">💡 Key Insight</div>
          <p>${lesson.insight}</p>
        </div>
      `;
    }

    // PRACTICE — inline editors
    if (lesson.practice && lesson.practice.length) {
      html += `<div class="lesson-section">`;
      html += `<h2><span class="num">★</span> Practice — Write SQL, Run, Check</h2>`;
      html += `<p style="color: var(--ink-300); margin-bottom: 20px;">Type your query in each editor below, click <strong>Run</strong>, and we'll check it against the expected result. Press <kbd style="background:var(--bg-3);border:1px solid var(--line-strong);padding:1px 5px;border-radius:3px;font-family:var(--font-mono);font-size:0.7rem;">Ctrl+Enter</kbd> to run faster.</p>`;

      lesson.practice.forEach((ex, idx) => {
        const exId = `ex-${modId.replace('.', '-')}-${idx}`;
        const solutionSql = ex.solution || '';
        html += `
          <div class="exercise" data-idx="${idx}" id="${exId}">
            <div class="exercise-header">
              <span>✏️ Exercise ${idx + 1} of ${lesson.practice.length}</span>
            </div>
            <div class="exercise-prompt">${ex.prompt}</div>

            <div class="ex-editor-wrap">
              <textarea class="ex-editor" spellcheck="false" placeholder="-- Type your SQL here&#10;SELECT ..."></textarea>
              <div class="ex-toolbar">
                <span class="ex-toolbar-hint"><kbd>Ctrl</kbd>+<kbd>Enter</kbd> to run</span>
                <div class="ex-toolbar-actions">
                  <button class="ex-btn ex-btn-reset">Reset</button>
                  <button class="ex-btn ex-btn-hint">Show Solution</button>
                  <button class="ex-btn ex-btn-run" data-expected="${encodeURIComponent(solutionSql)}">▶ Run</button>
                </div>
              </div>
            </div>

            <div class="ex-result"></div>

            <div class="exercise-solution">
              <div class="exercise-solution-label">✓ Reference Solution</div>
              ${window.codeBlock(solutionSql)}
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
          <ol>${lesson.takeaways.map(t => `<li>${t}</li>`).join('')}</ol>
        </div>
      `;
    }

    // Prev/Next nav
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
    } else { html += `<div></div>`; }

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

  // ============================================
  // EXERCISE WIRING
  // ============================================
  function wireExercises() {
    document.querySelectorAll('.exercise').forEach(exEl => {
      const editor = exEl.querySelector('.ex-editor');
      const runBtn = exEl.querySelector('.ex-btn-run');
      const hintBtn = exEl.querySelector('.ex-btn-hint');
      const resetBtn = exEl.querySelector('.ex-btn-reset');
      const resultEl = exEl.querySelector('.ex-result');

      if (!editor || !runBtn) return;

      const expectedSql = decodeURIComponent(runBtn.dataset.expected || '');

      // Run handler
      const runQuery = async () => {
        const sql = editor.value.trim();
        if (!sql) return;

        resultEl.classList.add('has-result');
        resultEl.innerHTML = `<div class="ex-result-status"><span class="ex-loading"></span> Running…</div>`;

        // Wait for DB ready
        if (dbReady) await dbReady;
        if (!db) {
          resultEl.innerHTML = `<div class="ex-result-error">Database not loaded yet — refresh the page.</div>`;
          return;
        }

        try {
          const t0 = performance.now();
          const results = db.exec(sql);
          const elapsed = (performance.now() - t0).toFixed(1);

          // Run expected to compare
          let pass = false;
          let expectedResults = null;
          if (expectedSql) {
            try {
              expectedResults = db.exec(expectedSql);
              pass = resultsMatch(results, expectedResults);
            } catch (e) { /* ignore */ }
          }

          renderResult(resultEl, results, elapsed, pass, !!expectedSql);

          // Auto-collapse solution if they passed
          if (pass) exEl.classList.remove('show-solution');
        } catch (err) {
          resultEl.innerHTML = `
            <div class="ex-result-header">
              <div class="ex-result-status error"><span>✗</span> SQL Error</div>
            </div>
            <div class="ex-result-error">${escapeHtml(err.message)}</div>
            <div class="ex-fail-hint">💡 Check your syntax — typos, missing commas, or wrong column names are the usual suspects.</div>
          `;
        }
      };

      runBtn.addEventListener('click', runQuery);

      editor.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          runQuery();
        }
      });

      // Show / hide solution
      hintBtn.addEventListener('click', () => {
        exEl.classList.toggle('show-solution');
        hintBtn.textContent = exEl.classList.contains('show-solution') ? 'Hide Solution' : 'Show Solution';
      });

      // Reset
      resetBtn.addEventListener('click', () => {
        editor.value = '';
        resultEl.classList.remove('has-result');
        resultEl.innerHTML = '';
        exEl.classList.remove('show-solution');
        hintBtn.textContent = 'Show Solution';
        editor.focus();
      });
    });
  }

  // ============================================
  // RENDER RESULT
  // ============================================
  function renderResult(el, results, elapsed, pass, hasExpected) {
    if (!results || results.length === 0) {
      el.innerHTML = `
        <div class="ex-result-header">
          <div class="ex-result-status success"><span class="badge-dot" style="background:currentColor;width:8px;height:8px;border-radius:50%;display:inline-block;"></span> Query ran (no rows)</div>
          <div class="ex-result-meta">${elapsed} ms</div>
        </div>
      `;
      return;
    }

    const r = results[0];
    const rowCount = r.values.length;

    let html = `
      <div class="ex-result-header">
        <div class="ex-result-status success"><span class="badge-dot" style="background:currentColor;width:8px;height:8px;border-radius:50%;display:inline-block;"></span> ${rowCount} row${rowCount === 1 ? '' : 's'}</div>
        <div class="ex-result-meta">${elapsed} ms</div>
      </div>
      <div class="ex-result-table">
        <table>
          <thead><tr>${r.columns.map(c => `<th>${escapeHtml(c)}</th>`).join('')}</tr></thead>
          <tbody>${r.values.map(row => `<tr>${row.map(v => `<td>${v === null || v === undefined ? '<span style="color:var(--ink-500);">NULL</span>' : escapeHtml(String(v))}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>
    `;

    if (hasExpected) {
      if (pass) {
        html += `<div class="ex-pass-banner">✓ Correct! Your query matches the expected output.</div>`;
      } else {
        html += `<div class="ex-fail-hint">⚠️ Your query ran, but the result doesn't match the expected output. Compare the rows above with the expected solution. Click <strong>Show Solution</strong> if stuck.</div>`;
      }
    }

    el.innerHTML = html;
  }

  // ============================================
  // RESULT COMPARISON
  // ============================================
  function resultsMatch(actual, expected) {
    if (!actual || !expected) return false;
    if (actual.length === 0 && expected.length === 0) return true;
    if (actual.length !== expected.length) return false;

    const a = actual[0];
    const e = expected[0];
    if (!a || !e) return false;

    // Compare columns case-insensitive (alias-friendly)
    if (a.columns.length !== e.columns.length) return false;

    // Compare rows — order-insensitive (sort both)
    const aRows = a.values.map(r => r.map(v => v === null ? 'NULL' : String(v)).join('|'));
    const eRows = e.values.map(r => r.map(v => v === null ? 'NULL' : String(v)).join('|'));

    if (aRows.length !== eRows.length) return false;

    const aSorted = [...aRows].sort();
    const eSorted = [...eRows].sort();

    for (let i = 0; i < aSorted.length; i++) {
      if (aSorted[i] !== eSorted[i]) return false;
    }

    return true;
  }

  // ============================================
  // HELPERS
  // ============================================
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  document.addEventListener('DOMContentLoaded', init);
})();
