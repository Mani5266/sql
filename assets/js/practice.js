/* ============================================
   SQLSENSEI — Practice Page Runtime
   StrataScratch-style: question left, editor right
   Real sql.js, Run, Check Solution, topic switcher
   ============================================ */

(function () {
  'use strict';

  const SQL_JS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js';
  const SQL_WASM_URL = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.wasm';

  let SQL = null;
  let db = null;
  let dbReady = null;

  let state = {
    topic: 'basics',
    qIdx: 0
  };

  // ============================================
  // sql.js bootstrap
  // ============================================
  async function initDB() {
    if (!window.initSqlJs) await loadScript(SQL_JS_URL);
    SQL = await window.initSqlJs({ locateFile: () => SQL_WASM_URL });
    rebuildDB();
  }

  function rebuildDB() {
    if (db) db.close();
    db = new SQL.Database();
    const ds = window.PRACTICE_DATASET;
    Object.keys(ds).forEach(name => {
      const t = ds[name];
      const colDefs = t.columns.map(c => `${c.name} ${c.type}${c.pk ? ' PRIMARY KEY' : ''}`).join(', ');
      db.run(`CREATE TABLE ${name} (${colDefs});`);
      const placeholders = t.columns.map(() => '?').join(', ');
      const stmt = db.prepare(`INSERT INTO ${name} VALUES (${placeholders});`);
      t.rows.forEach(r => stmt.run(r));
      stmt.free();
    });
  }

  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  // ============================================
  // BOOT
  // ============================================
  async function init() {
    // URL params
    const t = window.getUrlParam('topic');
    const q = window.getUrlParam('q');
    if (t && window.PRACTICE_QUESTIONS[t]) state.topic = t;
    if (q !== null) state.qIdx = parseInt(q, 10) || 0;

    renderSidebar();
    renderQuestion();
    bindEvents();

    dbReady = initDB().catch(err => {
      console.error('DB init failed:', err);
      setStatus('error', 'Database failed to load — refresh the page');
    });
    await dbReady;
    setStatus('ready', 'Database loaded · 9 tables');
  }

  // ============================================
  // SIDEBAR (topics + question list)
  // ============================================
  function renderSidebar() {
    const wrap = document.getElementById('pgsTopics');
    if (!wrap) return;

    wrap.innerHTML = window.PRACTICE_TOPICS.map(t => {
      const isActive = t.id === state.topic;
      return `
        <button class="pgs-topic ${isActive ? 'active' : ''}" data-topic="${t.id}">
          <span class="pgs-topic-icon">${t.icon}</span>
          <span class="pgs-topic-label">${t.label}</span>
          <span class="pgs-topic-count">${t.count}</span>
        </button>
      `;
    }).join('');

    wrap.querySelectorAll('.pgs-topic').forEach(btn => {
      btn.addEventListener('click', () => {
        state.topic = btn.dataset.topic;
        state.qIdx = 0;
        renderSidebar();
        renderQuestion();
        updateURL();
      });
    });

    renderQuestionList();
  }

  function renderQuestionList() {
    const wrap = document.getElementById('pgsQuestionList');
    if (!wrap) return;

    const qs = window.PRACTICE_QUESTIONS[state.topic] || [];
    wrap.innerHTML = qs.map((q, i) => `
      <button class="pgs-q-item ${i === state.qIdx ? 'active' : ''}" data-idx="${i}">
        <span class="pgs-q-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="pgs-q-title">${q.title}</span>
        <span class="pgs-q-diff diff-${q.difficulty.toLowerCase()}">${q.difficulty[0]}</span>
      </button>
    `).join('');

    wrap.querySelectorAll('.pgs-q-item').forEach(btn => {
      btn.addEventListener('click', () => {
        state.qIdx = parseInt(btn.dataset.idx, 10);
        renderQuestionList();
        renderQuestion();
        updateURL();
      });
    });
  }

  // ============================================
  // RENDER QUESTION
  // ============================================
  function renderQuestion() {
    const qs = window.PRACTICE_QUESTIONS[state.topic] || [];
    const q = qs[state.qIdx];
    const topic = window.PRACTICE_TOPICS.find(t => t.id === state.topic);

    if (!q) {
      document.getElementById('pgsQuestion').innerHTML = '<p style="padding:40px;color:var(--ink-400);">No question found.</p>';
      return;
    }

    document.title = `${q.title} · Practice · SQLSENSEI`;

    // Question panel
    const qPanel = document.getElementById('pgsQuestion');
    qPanel.innerHTML = `
      <div class="pgs-q-header">
        <div class="pgs-q-breadcrumb">
          ${topic.icon} ${topic.label} · Question ${state.qIdx + 1} of ${qs.length}
        </div>
        <h1 class="pgs-q-h">${q.title}</h1>
        <div class="pgs-q-meta">
          <span class="pgs-tag pgs-tag-company">${q.company}</span>
          <span class="pgs-tag pgs-tag-diff diff-${q.difficulty.toLowerCase()}">${q.difficulty}</span>
          <span class="pgs-tag">ID ${q.id.toUpperCase()}</span>
        </div>
      </div>

      <div class="pgs-q-prompt">
        ${q.prompt}
      </div>

      <div class="pgs-q-tables">
        <div class="pgs-q-tables-label">📊 Available tables</div>
        ${q.tables.length === 0 ? '<p style="color:var(--ink-400);font-size:0.85rem;">No tables needed — pure SQL.</p>' : ''}
        ${q.tables.map(t => renderTablePreview(t)).join('')}
      </div>

      <div class="pgs-q-nav">
        <button class="btn btn-ghost btn-sm" id="pgsPrev" ${state.qIdx === 0 ? 'disabled' : ''}>← Previous</button>
        <button class="btn btn-ghost btn-sm" id="pgsNext" ${state.qIdx === qs.length - 1 ? 'disabled' : ''}>Next →</button>
      </div>
    `;

    // Editor panel — clear it for new question
    const editor = document.getElementById('pgsEditor');
    editor.value = '-- Write your SQL here\n';
    editor.focus();

    // Clear result
    const result = document.getElementById('pgsResult');
    result.innerHTML = `
      <div class="pgs-result-empty">
        <div class="pgs-result-empty-icon">▶</div>
        <p>Write your query and click <strong>Run</strong> to see results.</p>
      </div>
    `;

    // Hide solution if shown
    document.getElementById('pgsSolution').style.display = 'none';
    document.getElementById('pgsShowSolution').textContent = '👁️ Show Solution';

    // Wire nav buttons
    document.getElementById('pgsPrev').addEventListener('click', () => navigate(-1));
    document.getElementById('pgsNext').addEventListener('click', () => navigate(1));
  }

  function renderTablePreview(tableName) {
    const t = window.PRACTICE_DATASET[tableName];
    if (!t) return `<p>Table <code>${tableName}</code> not found.</p>`;

    // Show first 4 rows
    const rows = t.rows.slice(0, 4);

    return `
      <details class="pgs-table-preview">
        <summary>
          <span class="pgs-table-name">${tableName}</span>
          <span class="pgs-table-meta">${t.rows.length} rows · ${t.columns.length} cols</span>
        </summary>
        <div class="data-table-wrap" style="margin-top:8px;">
          <table class="data-table">
            <thead>
              <tr>${t.columns.map(c => `<th>${c.name}<br/><span style="font-weight:400;color:var(--ink-500);font-size:0.65rem;text-transform:none;letter-spacing:0;">${c.type}</span></th>`).join('')}</tr>
            </thead>
            <tbody>
              ${rows.map(r => `<tr>${r.map(v => `<td>${v === null ? '<span style="color:var(--ink-500);">NULL</span>' : v}</td>`).join('')}</tr>`).join('')}
              ${t.rows.length > 4 ? `<tr><td colspan="${t.columns.length}" style="text-align:center;color:var(--ink-500);font-style:italic;">… ${t.rows.length - 4} more rows</td></tr>` : ''}
            </tbody>
          </table>
        </div>
      </details>
    `;
  }

  function navigate(delta) {
    const qs = window.PRACTICE_QUESTIONS[state.topic] || [];
    const newIdx = state.qIdx + delta;
    if (newIdx < 0 || newIdx >= qs.length) return;
    state.qIdx = newIdx;
    renderQuestionList();
    renderQuestion();
    updateURL();
  }

  function updateURL() {
    const u = new URL(window.location.href);
    u.searchParams.set('topic', state.topic);
    u.searchParams.set('q', state.qIdx);
    window.history.replaceState({}, '', u);
  }

  // ============================================
  // RUN + CHECK
  // ============================================
  async function runQuery(checkAgainstExpected = false) {
    const sql = document.getElementById('pgsEditor').value.trim();
    if (!sql) {
      setResult('<div class="pgs-result-empty"><p>Editor is empty. Write a query first.</p></div>');
      return;
    }

    setResult('<div class="pgs-result-running"><span class="ex-loading"></span> Running…</div>');

    if (dbReady) await dbReady;
    if (!db) {
      setResult('<div class="pgs-result-error">Database not loaded.</div>');
      return;
    }

    const qs = window.PRACTICE_QUESTIONS[state.topic] || [];
    const q = qs[state.qIdx];

    try {
      const t0 = performance.now();
      const results = db.exec(sql);
      const elapsed = (performance.now() - t0).toFixed(1);

      // Compare to expected
      let pass = false;
      if (checkAgainstExpected && q && q.solution) {
        try {
          const expected = db.exec(q.solution);
          pass = resultsMatch(results, expected);
        } catch (e) { /* ignore */ }
      }

      renderResult(results, elapsed, checkAgainstExpected ? pass : null);
    } catch (err) {
      setResult(`
        <div class="pgs-result-header">
          <div class="pgs-result-status error"><span>✗</span> SQL Error</div>
        </div>
        <div class="pgs-result-error">${escapeHtml(err.message)}</div>
      `);
    }
  }

  function renderResult(results, elapsed, pass) {
    if (!results || results.length === 0) {
      setResult(`
        <div class="pgs-result-header">
          <div class="pgs-result-status success">✓ Query ran (no rows returned)</div>
          <div class="pgs-result-meta">${elapsed} ms</div>
        </div>
      `);
      return;
    }

    const r = results[0];
    const rowCount = r.values.length;

    let html = `
      <div class="pgs-result-header">
        <div class="pgs-result-status success">✓ ${rowCount} row${rowCount === 1 ? '' : 's'}</div>
        <div class="pgs-result-meta">${elapsed} ms · ${r.columns.length} cols</div>
      </div>
      <div class="pgs-result-table">
        <table>
          <thead><tr>${r.columns.map(c => `<th>${escapeHtml(c)}</th>`).join('')}</tr></thead>
          <tbody>${r.values.map(row => `<tr>${row.map(v => `<td>${v === null || v === undefined ? '<span style="color:var(--ink-500);">NULL</span>' : escapeHtml(String(v))}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>
    `;

    if (pass === true) {
      html += `<div class="pgs-banner pgs-banner-pass">🎉 Correct! Your query matches the expected output.</div>`;
    } else if (pass === false) {
      html += `<div class="pgs-banner pgs-banner-fail">⚠️ Your query ran, but the result doesn't match. Click <strong>Show Solution</strong> if stuck, or refine and try again.</div>`;
    }

    setResult(html);
  }

  function setResult(html) {
    document.getElementById('pgsResult').innerHTML = html;
  }

  function resultsMatch(actual, expected) {
    if (!actual || !expected) return false;
    if (actual.length === 0 && expected.length === 0) return true;
    if (actual.length !== expected.length) return false;
    const a = actual[0], e = expected[0];
    if (!a || !e) return false;
    if (a.columns.length !== e.columns.length) return false;
    const aRows = a.values.map(r => r.map(v => v === null ? 'NULL' : String(v).trim()).join('|'));
    const eRows = e.values.map(r => r.map(v => v === null ? 'NULL' : String(v).trim()).join('|'));
    if (aRows.length !== eRows.length) return false;
    const aSorted = [...aRows].sort();
    const eSorted = [...eRows].sort();
    for (let i = 0; i < aSorted.length; i++) if (aSorted[i] !== eSorted[i]) return false;
    return true;
  }

  // ============================================
  // EVENTS
  // ============================================
  function bindEvents() {
    document.getElementById('pgsRun').addEventListener('click', () => runQuery(false));
    document.getElementById('pgsCheck').addEventListener('click', () => runQuery(true));

    document.getElementById('pgsEditor').addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runQuery(true); // Ctrl+Enter = Check Solution
      }
    });

    document.getElementById('pgsShowSolution').addEventListener('click', () => {
      const qs = window.PRACTICE_QUESTIONS[state.topic] || [];
      const q = qs[state.qIdx];
      const wrap = document.getElementById('pgsSolution');
      const btn = document.getElementById('pgsShowSolution');
      if (wrap.style.display === 'none' || !wrap.style.display) {
        wrap.style.display = 'block';
        wrap.innerHTML = `
          <div class="pgs-solution-label">✓ Reference Solution</div>
          ${window.codeBlock(q.solution)}
        `;
        btn.textContent = '🙈 Hide Solution';
      } else {
        wrap.style.display = 'none';
        btn.textContent = '👁️ Show Solution';
      }
    });

    document.getElementById('pgsReset').addEventListener('click', () => {
      document.getElementById('pgsEditor').value = '-- Write your SQL here\n';
      setResult('<div class="pgs-result-empty"><p>Editor cleared. Write a new query.</p></div>');
    });
  }

  function setStatus(state, msg) {
    const el = document.getElementById('pgsStatus');
    if (!el) return;
    el.innerHTML = `
      <span class="badge badge-${state === 'ready' ? 'emerald' : state === 'error' ? 'rose' : 'amber'}">
        <span class="badge-dot"></span> ${state.toUpperCase()}
      </span>
      <span>${msg}</span>
    `;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  document.addEventListener('DOMContentLoaded', init);
})();
