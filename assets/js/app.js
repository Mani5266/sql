/* ============================================
   SQLSENSEI — Shared helpers
   Tables, syntax highlight, toasts, URL params
   ============================================ */

(function () {
  'use strict';

  /* ---------- Sample-data table renderer ---------- */
  function renderTable(tableName, opts = {}) {
    const data = window.DATASET[tableName];
    if (!data) return '';
    const cols = data.columns;
    const rows = opts.rows ? data.rows.slice(0, opts.rows) : data.rows;

    return `
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>${cols.map(c => `<th>${c.name}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map(r => `<tr>${r.map(v => `<td>${v === null ? '<span style="color:var(--ink-500);">NULL</span>' : v}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderResultTable(columns, rows) {
    if (!rows || rows.length === 0) {
      return '<div class="pg-empty">No rows returned.</div>';
    }
    return `
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>${columns.map(c => `<th>${c}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map(r => `<tr>${r.map(v => `<td>${v === null || v === undefined ? '<span style="color:var(--ink-500);">NULL</span>' : v}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /* ---------- SQL syntax highlighting ---------- */
  const SQL_KEYWORDS = new Set([
    'select','from','where','and','or','not','in','between','like','is','null',
    'order','by','group','having','limit','offset','distinct','as',
    'inner','left','right','full','outer','cross','join','on','using',
    'union','intersect','except','all','any','exists',
    'case','when','then','else','end',
    'with','recursive',
    'insert','into','values','update','set','delete','create','table','drop','alter','add','column','primary','key','foreign','references','default','unique','index',
    'begin','commit','rollback','transaction','savepoint',
    'partition','over','rows','range','preceding','following','current','row',
    'asc','desc','true','false','if','ifnull','coalesce','interval'
  ]);

  const SQL_FUNCTIONS = new Set([
    'count','sum','avg','min','max',
    'upper','lower','concat','substring','substr','length','trim','replace','instr',
    'now','current_date','current_timestamp','date_part','datediff','date_format','date_add','date_sub','extract','to_char','strftime','julianday',
    'row_number','rank','dense_rank','ntile','lag','lead','first_value','last_value',
    'round','floor','ceil','abs','mod','power','sqrt',
    'cast','convert','generate_series'
  ]);

  function highlightSQL(code) {
    if (!code) return '';
    let s = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    s = s.replace(/(--[^\n]*)/g, '<span class="sql-comment">$1</span>');
    s = s.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="sql-comment">$1</span>');
    s = s.replace(/('([^'\\]|\\.)*')/g, '<span class="sql-string">$1</span>');
    s = s.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="sql-number">$1</span>');

    s = s.replace(/\b([a-zA-Z_]+)\b/g, (m, word) => {
      const lower = word.toLowerCase();
      if (SQL_KEYWORDS.has(lower)) return `<span class="sql-keyword">${word.toUpperCase()}</span>`;
      if (SQL_FUNCTIONS.has(lower)) return `<span class="sql-fn">${word.toUpperCase()}</span>`;
      return word;
    });

    return s;
  }

  function codeBlock(sql) {
    return `<pre><code>${highlightSQL(sql)}</code></pre>`;
  }

  /* ---------- Toasts ---------- */
  function showToast(msg, type = 'info', timeout = 3000) {
    const stack = document.getElementById('toastStack');
    if (!stack) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ⓘ';
    t.innerHTML = `<span style="font-weight: 700;">${icon}</span> <span>${msg}</span>`;
    stack.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(-10px)';
      t.style.transition = 'all 0.3s var(--ease)';
      setTimeout(() => t.remove(), 300);
    }, timeout);
  }

  /* ---------- URL helpers ---------- */
  function getUrlParam(name) {
    const u = new URL(window.location.href);
    return u.searchParams.get(name);
  }

  /* ---------- Expose ---------- */
  window.renderTable = renderTable;
  window.renderResultTable = renderResultTable;
  window.highlightSQL = highlightSQL;
  window.codeBlock = codeBlock;
  window.showToast = showToast;
  window.getUrlParam = getUrlParam;
})();
