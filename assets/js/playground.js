/* ============================================
   SQLSENSEI — Playground (sql.js)
   Real SQLite WASM execution in the browser.
   Preloaded with the working dataset.
   ============================================ */

(function () {
  'use strict';

  let db = null;
  let SQL = null;
  let history = JSON.parse(localStorage.getItem('sqlsensei_query_history') || '[]');
  let historyIdx = -1;

  const SQL_JS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js';
  const SQL_WASM_URL = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.wasm';

  // ============================================
  // INIT
  // ============================================
  async function init() {
    setStatus('loading', 'Loading SQLite engine…');

    // Load sql.js
    if (!window.initSqlJs) {
      await loadScript(SQL_JS_URL);
    }
    SQL = await window.initSqlJs({ locateFile: () => SQL_WASM_URL });

    // Create DB and seed it
    db = new SQL.Database();
    seedDatabase();

    setStatus('ready', 'Database ready · 5 tables loaded');
    renderSidebar();
    bindEvents();

    // Load snippet from URL if present
    const snippet = window.getUrlParam('q');
    if (snippet) {
      document.getElementById('pgEditor').value = decodeURIComponent(snippet);
      runQuery();
    } else {
      // Default starter query
      document.getElementById('pgEditor').value = 'SELECT * FROM customers LIMIT 5;';
      runQuery();
    }
  }

  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  // ============================================
  // SEED DATA
  // ============================================
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
  // RUN QUERY
  // ============================================
  function runQuery() {
    const editor = document.getElementById('pgEditor');
    const sql = editor.value.trim();
    if (!sql) return;

    const t0 = performance.now();

    try {
      const results = db.exec(sql);
      const t1 = performance.now();
      const elapsed = (t1 - t0).toFixed(1);

      // Save to history
      if (!history.includes(sql)) {
        history.unshift(sql);
        if (history.length > 30) history.pop();
        localStorage.setItem('sqlsensei_query_history', JSON.stringify(history));
        historyIdx = -1;
        renderHistory();
      }

      renderResults(results, elapsed, sql);
    } catch (err) {
      const t1 = performance.now();
      renderError(err.message, (t1 - t0).toFixed(1));
    }
  }

  function renderResults(results, elapsed, sql) {
    const out = document.getElementById('pgResults');
    if (!results || results.length === 0) {
      // Statement ran but returned no result (INSERT/UPDATE/etc)
      out.innerHTML = `
        <div class="pg-result-header">
          <div class="pg-result-status success">
            <span class="badge-dot"></span> Query OK · No rows returned
          </div>
          <div class="pg-result-meta">${elapsed} ms · 0 rows</div>
        </div>
        <div class="pg-empty">
          <div class="pg-empty-icon">✓</div>
          <p>Statement executed. This kind of statement (INSERT/UPDATE/DDL) doesn't return rows.</p>
        </div>
      `;
      return;
    }

    // Render every result set (in case of multi-statement query)
    let html = '';
    results.forEach((r, i) => {
      const rowCount = r.values.length;
      html += `
        <div class="pg-result-header">
          <div class="pg-result-status success">
            <span class="badge-dot"></span> ${results.length > 1 ? `Result ${i + 1}` : 'Success'}
          </div>
          <div class="pg-result-meta">${elapsed} ms · ${rowCount} row${rowCount === 1 ? '' : 's'}</div>
        </div>
        ${window.renderResultTable(r.columns, r.values)}
        <div style="height: 16px;"></div>
      `;
    });

    out.innerHTML = html;
  }

  function renderError(msg, elapsed) {
    const out = document.getElementById('pgResults');
    out.innerHTML = `
      <div class="pg-result-header">
        <div class="pg-result-status error">
          <span class="badge-dot"></span> Error
        </div>
        <div class="pg-result-meta">${elapsed} ms</div>
      </div>
      <div class="pg-error">${escapeHtml(msg)}</div>
      <div style="margin-top: 16px; padding: 14px 18px; background: var(--bg-2); border: 1px solid var(--line); border-radius: 10px; color: var(--ink-300); font-size: 0.85rem;">
        💡 <strong>Common SQLite quirks:</strong>
        <ul style="margin-top: 8px; padding-left: 20px; line-height: 1.8;">
          <li>String concat: use <code>||</code> (not <code>CONCAT</code>)</li>
          <li>Date parts: <code>strftime('%Y', date_col)</code></li>
          <li>No <code>RIGHT JOIN</code> or <code>FULL OUTER</code> (use LEFT JOIN instead)</li>
        </ul>
      </div>
    `;
  }

  // ============================================
  // SIDEBAR (Schema + Snippets + History)
  // ============================================
  function renderSidebar() {
    renderSchema();
    renderSnippets();
    renderHistory();
  }

  function renderSchema() {
    const wrap = document.getElementById('pgSchema');
    if (!wrap) return;
    const ds = window.DATASET;

    wrap.innerHTML = Object.keys(ds).map(tableName => {
      const table = ds[tableName];
      return `
        <div class="pg-table" data-table="${tableName}">
          <div class="pg-table-header" onclick="this.parentNode.classList.toggle('open')">
            <span class="pg-table-name">${tableName}</span>
            <span class="pg-table-count">${table.rows.length} rows</span>
          </div>
          <div class="pg-table-cols">
            ${table.columns.map(c => `
              <div class="pg-table-col">
                <span>${c.name}${c.pk ? ' 🔑' : ''}${c.fk ? ' 🔗' : ''}</span>
                <span class="pg-table-col-type">${c.type}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  function renderSnippets() {
    const wrap = document.getElementById('pgSnippets');
    if (!wrap) return;
    const snippets = [
      { label: 'All customers',                     sql: 'SELECT * FROM customers;' },
      { label: 'Top 5 highest-priced products',    sql: 'SELECT name, price FROM products ORDER BY price DESC LIMIT 5;' },
      { label: 'Revenue per customer',              sql: 'SELECT customer_id, SUM(total_amount) AS revenue\nFROM orders\nGROUP BY customer_id\nORDER BY revenue DESC;' },
      { label: 'Customers + their orders (JOIN)',  sql: 'SELECT c.name, o.order_id, o.total_amount\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nLIMIT 10;' },
      { label: 'Products never ordered',            sql: "SELECT p.name, p.price\nFROM products p\nWHERE NOT EXISTS (\n  SELECT 1 FROM order_items oi WHERE oi.product_id = p.product_id\n);" },
      { label: 'Best-seller per category (window)', sql: 'WITH ranked AS (\n  SELECT p.category, p.name, SUM(oi.quantity) AS qty,\n    RANK() OVER (PARTITION BY p.category ORDER BY SUM(oi.quantity) DESC) AS rnk\n  FROM products p\n  JOIN order_items oi ON p.product_id = oi.product_id\n  GROUP BY p.category, p.name\n)\nSELECT category, name, qty FROM ranked WHERE rnk = 1;' },
      { label: 'Employees + their manager (self-join)', sql: 'SELECT e.name AS employee, m.name AS manager, e.department\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.employee_id\nORDER BY m.name NULLS LAST;' },
      { label: 'Running revenue total',             sql: 'SELECT order_id, order_date, total_amount,\n  SUM(total_amount) OVER (ORDER BY order_date) AS running_total\nFROM orders\nORDER BY order_date;' }
    ];

    wrap.innerHTML = snippets.map(s => `
      <button class="pg-snippet" data-sql="${encodeURIComponent(s.sql)}">${s.label}</button>
    `).join('');

    wrap.querySelectorAll('.pg-snippet').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('pgEditor').value = decodeURIComponent(btn.dataset.sql);
        runQuery();
      });
    });
  }

  function renderHistory() {
    const wrap = document.getElementById('pgHistory');
    if (!wrap) return;
    if (history.length === 0) {
      wrap.innerHTML = `<div style="color: var(--ink-500); font-size: 0.8rem; font-style: italic;">Your queries appear here…</div>`;
      return;
    }
    wrap.innerHTML = history.slice(0, 8).map(q => {
      const preview = q.length > 60 ? q.slice(0, 57) + '…' : q;
      return `<button class="pg-snippet" data-sql="${encodeURIComponent(q)}" title="${escapeHtml(q)}" style="font-family: var(--font-mono); font-size: 0.75rem;">${escapeHtml(preview)}</button>`;
    }).join('');

    wrap.querySelectorAll('.pg-snippet').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('pgEditor').value = decodeURIComponent(btn.dataset.sql);
      });
    });
  }

  // ============================================
  // EVENTS
  // ============================================
  function bindEvents() {
    document.getElementById('pgRun').addEventListener('click', runQuery);
    document.getElementById('pgClear').addEventListener('click', () => {
      document.getElementById('pgEditor').value = '';
      document.getElementById('pgEditor').focus();
    });
    document.getElementById('pgReset').addEventListener('click', () => {
      if (confirm('Reset the database to its original state? (your current query is preserved)')) {
        db.close();
        db = new SQL.Database();
        seedDatabase();
        window.showToast && window.showToast('Database reset to fresh state', 'success');
      }
    });
    document.getElementById('pgFormat').addEventListener('click', formatSQL);
    document.getElementById('pgShare').addEventListener('click', shareQuery);

    // Ctrl/Cmd + Enter to run
    document.getElementById('pgEditor').addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runQuery();
      }
      // Ctrl/Cmd + / for comment
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        toggleComment();
      }
    });
  }

  function formatSQL() {
    const ed = document.getElementById('pgEditor');
    let s = ed.value;
    // Lightweight formatter: uppercase major keywords + newline before them
    const kws = ['SELECT','FROM','WHERE','GROUP BY','HAVING','ORDER BY','LIMIT','OFFSET',
      'INNER JOIN','LEFT JOIN','RIGHT JOIN','FULL OUTER JOIN','CROSS JOIN','JOIN','ON',
      'UNION ALL','UNION','INTERSECT','EXCEPT','WITH','AS'];
    kws.forEach(kw => {
      const re = new RegExp(`\\b${kw.replace(/\s+/g, '\\s+')}\\b`, 'gi');
      s = s.replace(re, '\n' + kw);
    });
    s = s.replace(/^\n+/, '').replace(/\n{2,}/g, '\n').trim();
    if (!s.endsWith(';')) s += ';';
    ed.value = s;
    window.showToast && window.showToast('Query formatted', 'info', 1500);
  }

  function shareQuery() {
    const sql = document.getElementById('pgEditor').value;
    const url = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(sql)}`;
    navigator.clipboard.writeText(url).then(() => {
      window.showToast && window.showToast('Shareable link copied to clipboard!', 'success');
    });
  }

  function toggleComment() {
    const ed = document.getElementById('pgEditor');
    const start = ed.selectionStart;
    const end = ed.selectionEnd;
    const lineStart = ed.value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = ed.value.indexOf('\n', end);
    const before = ed.value.slice(0, lineStart);
    const line = ed.value.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
    const after = lineEnd === -1 ? '' : ed.value.slice(lineEnd);
    const toggled = line.startsWith('-- ') ? line.slice(3) : '-- ' + line;
    ed.value = before + toggled + after;
  }

  // ============================================
  // STATUS BAR
  // ============================================
  function setStatus(state, msg) {
    const el = document.getElementById('pgStatus');
    if (!el) return;
    el.className = 'pg-toolbar-info';
    el.innerHTML = `
      <span class="badge badge-${state === 'loading' ? 'amber' : 'emerald'}">
        <span class="badge-dot"></span> ${state.toUpperCase()}
      </span>
      <span>${msg}</span>
    `;
  }

  // ============================================
  // HELPERS
  // ============================================
  function escapeHtml(s) {
    return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  }

  document.addEventListener('DOMContentLoaded', init);
})();
