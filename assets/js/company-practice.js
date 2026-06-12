/* ============================================
   SQLSENSEI — Company Practice Runtime
   Filter by company + topic + difficulty
   Same editor/run/check engine as Practice
   ============================================ */

(function () {
  'use strict';

  const SQL_JS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js';
  const SQL_WASM_URL = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.wasm';

  let SQL = null;
  let db = null;
  let dbReady = null;

  let state = {
    company: 'all',
    topic: 'all',
    difficulty: 'all',
    qIdx: 0
  };

  // ============================================
  // DB BOOTSTRAP (reuses PRACTICE_DATASET)
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
    const c = window.getUrlParam('company');
    const t = window.getUrlParam('topic');
    const d = window.getUrlParam('difficulty');
    const q = window.getUrlParam('q');
    if (c) state.company = c;
    if (t) state.topic = t;
    if (d) state.difficulty = d;
    if (q !== null) state.qIdx = parseInt(q, 10) || 0;

    renderCompanySidebar();
    renderTopFilters();
    renderQuestionList();
    renderQuestion();
    bindEditorEvents();

    dbReady = initDB().catch(err => {
      console.error('DB init failed:', err);
      setStatus('error', 'DB failed — refresh');
    });
    await dbReady;
    setStatus('ready', `${getFilteredQuestions().length} questions loaded`);
  }

  // ============================================
  // FILTERING
  // ============================================
  function getFilteredQuestions() {
    let qs = window.COMPANY_QUESTIONS;
    if (state.company !== 'all') qs = qs.filter(q => q.company === state.company);
    if (state.topic !== 'all') qs = qs.filter(q => q.topic === state.topic);
    if (state.difficulty !== 'all') qs = qs.filter(q => q.difficulty.toLowerCase() === state.difficulty);
    return qs;
  }

  // ============================================
  // RENDER: LEFT SIDEBAR (companies)
  // ============================================
  function renderCompanySidebar() {
    const wrap = document.getElementById('cpCompanies');
    if (!wrap) return;

    wrap.innerHTML = window.COMPANIES_LIST.map(c => {
      const count = window.getCompanyQuestionCount(c.id);
      const isActive = c.id === state.company;
      return `
        <button class="cp-company ${isActive ? 'active' : ''}" data-company="${c.id}" style="--co-color: ${c.color};">
          <span class="cp-company-emoji">${c.emoji}</span>
          <span class="cp-company-name">${c.name}</span>
          <span class="cp-company-count">${count}</span>
        </button>
      `;
    }).join('');

    wrap.querySelectorAll('.cp-company').forEach(btn => {
      btn.addEventListener('click', () => {
        state.company = btn.dataset.company;
        state.qIdx = 0;
        renderCompanySidebar();
        renderTopFilters();
        renderQuestionList();
        renderQuestion();
        updateURL();
      });
    });
  }

  // ============================================
  // RENDER: TOP FILTERS (topic + difficulty)
  // ============================================
  function renderTopFilters() {
    const topicWrap = document.getElementById('cpTopicFilters');
    const diffWrap = document.getElementById('cpDifficultyFilters');

    topicWrap.innerHTML = window.TOPICS_LIST.map(t => {
      const count = window.getTopicQuestionCount(t.id, state.company);
      const isActive = t.id === state.topic;
      return `<button class="cp-chip ${isActive ? 'active' : ''}" data-topic="${t.id}" ${count === 0 ? 'disabled' : ''}>${t.label} <span class="cp-chip-count">${count}</span></button>`;
    }).join('');

    diffWrap.innerHTML = ['all', 'easy', 'medium', 'hard'].map(d => {
      const isActive = d === state.difficulty;
      const label = d === 'all' ? 'All' : d[0].toUpperCase() + d.slice(1);
      return `<button class="cp-chip cp-chip-diff diff-${d}  ${isActive ? 'active' : ''}" data-difficulty="${d}">${label}</button>`;
    }).join('');

    topicWrap.querySelectorAll('.cp-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        state.topic = btn.dataset.topic;
        state.qIdx = 0;
        renderTopFilters();
        renderQuestionList();
        renderQuestion();
        updateURL();
      });
    });

    diffWrap.querySelectorAll('.cp-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        state.difficulty = btn.dataset.difficulty;
        state.qIdx = 0;
        renderTopFilters();
        renderQuestionList();
        renderQuestion();
        updateURL();
      });
    });
  }

  // ============================================
  // RENDER: QUESTION LIST
  // ============================================
  function renderQuestionList() {
    const wrap = document.getElementById('cpQuestionList');
    const qs = getFilteredQuestions();

    if (qs.length === 0) {
      wrap.innerHTML = `<p style="padding:12px;color:var(--ink-400);font-size:0.85rem;font-style:italic;">No questions match these filters.</p>`;
      return;
    }

    wrap.innerHTML = qs.map((q, i) => {
      const co = window.COMPANIES_LIST.find(c => c.id === q.company);
      return `
        <button class="cp-q-item ${i === state.qIdx ? 'active' : ''}" data-idx="${i}">
          <span class="cp-q-num">${String(i + 1).padStart(2, '0')}</span>
          <span class="cp-q-title">${q.title}</span>
          <span class="cp-q-co" title="${co.name}">${co.emoji}</span>
          <span class="cp-q-diff diff-${q.difficulty.toLowerCase()}">${q.difficulty[0]}</span>
        </button>
      `;
    }).join('');

    wrap.querySelectorAll('.cp-q-item').forEach(btn => {
      btn.addEventListener('click', () => {
        state.qIdx = parseInt(btn.dataset.idx, 10);
        renderQuestionList();
        renderQuestion();
        updateURL();
      });
    });
  }

  // ============================================
  // RENDER: QUESTION
  // ============================================
  function renderQuestion() {
    const qs = getFilteredQuestions();
    const q = qs[state.qIdx];
    const wrap = document.getElementById('cpQuestion');

    if (!q) {
      wrap.innerHTML = `<div class="pgs-result-empty"><p style="font-size:1.05rem;">No questions match your current filters.</p><p>Try removing a filter on the left.</p></div>`;
      // Clear editor
      document.getElementById('cpEditor').value = '';
      document.getElementById('cpResult').innerHTML = '';
      return;
    }

    const co = window.COMPANIES_LIST.find(c => c.id === q.company);
    const topic = window.TOPICS_LIST.find(t => t.id === q.topic);

    document.title = `${q.title} · ${co.name} · SQLSENSEI`;

    wrap.innerHTML = `
      <div class="pgs-q-breadcrumb">
        ${co.emoji} ${co.name} · ${topic ? topic.label : q.topic} · Question ${state.qIdx + 1} of ${qs.length}
      </div>
      <h1 class="pgs-q-h">${q.title}</h1>
      <div class="pgs-q-meta">
        <span class="pgs-tag pgs-tag-company" style="background: ${co.color}1a; color: ${co.color}; border-color: ${co.color}40;">${co.emoji} ${co.name}</span>
        <span class="pgs-tag pgs-tag-diff diff-${q.difficulty.toLowerCase()}">${q.difficulty}</span>
        <span class="pgs-tag">${topic.label}</span>
        <span class="pgs-tag">ID ${q.id.toUpperCase()}</span>
      </div>

      <div class="pgs-q-prompt">${q.prompt}</div>

      <div class="pgs-q-tables">
        <div class="pgs-q-tables-label">📊 Available tables</div>
        ${q.tables.length === 0 ? '<p style="color:var(--ink-400);font-size:0.85rem;">No tables needed.</p>' : ''}
        ${q.tables.map(t => renderTablePreview(t)).join('')}
      </div>

      <div class="pgs-q-nav">
        <button class="btn btn-ghost btn-sm" id="cpPrev" ${state.qIdx === 0 ? 'disabled' : ''}>← Previous</button>
        <button class="btn btn-ghost btn-sm" id="cpNext" ${state.qIdx === qs.length - 1 ? 'disabled' : ''}>Next →</button>
      </div>
    `;

    document.getElementById('cpEditor').value = '-- Write your SQL here\n';
    document.getElementById('cpEditor').focus();
    document.getElementById('cpResult').innerHTML = `<div class="pgs-result-empty"><div class="pgs-result-empty-icon">▶</div><p>Write your query and click <strong>Run</strong> or <strong>Check Solution</strong>.</p></div>`;
    document.getElementById('cpSolution').style.display = 'none';
    document.getElementById('cpShowSolution').textContent = '👁️ Show Solution';

    document.getElementById('cpPrev').addEventListener('click', () => navigate(-1));
    document.getElementById('cpNext').addEventListener('click', () => navigate(1));
  }

  function renderTablePreview(tableName) {
    const t = window.PRACTICE_DATASET[tableName];
    if (!t) return `<p>Table <code>${tableName}</code> not found.</p>`;
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
    const qs = getFilteredQuestions();
    const newIdx = state.qIdx + delta;
    if (newIdx < 0 || newIdx >= qs.length) return;
    state.qIdx = newIdx;
    renderQuestionList();
    renderQuestion();
    updateURL();
  }

  function updateURL() {
    const u = new URL(window.location.href);
    u.searchParams.set('company', state.company);
    u.searchParams.set('topic', state.topic);
    u.searchParams.set('difficulty', state.difficulty);
    u.searchParams.set('q', state.qIdx);
    window.history.replaceState({}, '', u);
  }

  // ============================================
  // EDITOR: RUN + CHECK
  // ============================================
  async function runQuery(check = false) {
    const sql = document.getElementById('cpEditor').value.trim();
    if (!sql) {
      setResult('<div class="pgs-result-empty"><p>Editor is empty.</p></div>');
      return;
    }

    setResult('<div class="pgs-result-running"><span class="ex-loading"></span> Running…</div>');

    if (dbReady) await dbReady;
    if (!db) { setResult('<div class="pgs-result-error">Database not loaded.</div>'); return; }

    const qs = getFilteredQuestions();
    const q = qs[state.qIdx];

    try {
      const t0 = performance.now();
      const results = db.exec(sql);
      const elapsed = (performance.now() - t0).toFixed(1);

      let pass = null;
      if (check && q && q.solution) {
        try {
          const expected = db.exec(q.solution);
          pass = resultsMatch(results, expected);
        } catch (e) { /* ignore */ }
      }

      renderResult(results, elapsed, pass);
    } catch (err) {
      setResult(`
        <div class="pgs-result-header">
          <div class="pgs-result-status error">✗ SQL Error</div>
        </div>
        <div class="pgs-result-error">${escapeHtml(err.message)}</div>
      `);
    }
  }

  function renderResult(results, elapsed, pass) {
    if (!results || results.length === 0) {
      setResult(`<div class="pgs-result-header"><div class="pgs-result-status success">✓ Query ran (no rows)</div><div class="pgs-result-meta">${elapsed} ms</div></div>`);
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
    if (pass === true) html += `<div class="pgs-banner pgs-banner-pass">🎉 Correct! Your query matches the expected output.</div>`;
    else if (pass === false) html += `<div class="pgs-banner pgs-banner-fail">⚠️ Your query ran but the result doesn't match. Try <strong>Show Solution</strong> if stuck.</div>`;
    setResult(html);
  }

  function setResult(html) {
    document.getElementById('cpResult').innerHTML = html;
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
    const aS = [...aRows].sort(), eS = [...eRows].sort();
    for (let i = 0; i < aS.length; i++) if (aS[i] !== eS[i]) return false;
    return true;
  }

  function bindEditorEvents() {
    document.getElementById('cpRun').addEventListener('click', () => runQuery(false));
    document.getElementById('cpCheck').addEventListener('click', () => runQuery(true));
    document.getElementById('cpEditor').addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runQuery(true);
      }
    });
    document.getElementById('cpShowSolution').addEventListener('click', () => {
      const qs = getFilteredQuestions();
      const q = qs[state.qIdx];
      if (!q) return;
      const wrap = document.getElementById('cpSolution');
      const btn = document.getElementById('cpShowSolution');
      if (wrap.style.display === 'none' || !wrap.style.display) {
        wrap.style.display = 'block';
        wrap.innerHTML = `<div class="pgs-solution-label">✓ Reference Solution</div>${window.codeBlock(q.solution)}`;
        btn.textContent = '🙈 Hide Solution';
      } else {
        wrap.style.display = 'none';
        btn.textContent = '👁️ Show Solution';
      }
    });
    document.getElementById('cpReset').addEventListener('click', () => {
      document.getElementById('cpEditor').value = '-- Write your SQL here\n';
      setResult('<div class="pgs-result-empty"><p>Editor cleared.</p></div>');
    });
  }

  function setStatus(state, msg) {
    const el = document.getElementById('cpStatus');
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
