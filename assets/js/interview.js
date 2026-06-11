/* ============================================
   SQLSENSEI — Interview Page Renderer
   Filtering, rendering, markdown-lite, search
   ============================================ */

(function () {
  'use strict';

  let activeFilters = {
    difficulty: null,    // 'Easy' | 'Medium' | 'Hard' | null
    category: null,      // category id | null
    company: null,       // company id | null
    tricky: false,
    search: ''
  };

  const data = window.INTERVIEW;

  // ============================================
  // STATS
  // ============================================
  function renderStats() {
    document.getElementById('statQuestions').textContent = data.questions.length;
    document.getElementById('statCompanies').textContent = data.companies.length;
    document.getElementById('statTricky').textContent = data.questions.filter(q => q.tricky).length;
    document.getElementById('statTopics').textContent = data.categories.length;
  }

  // ============================================
  // COMPANIES
  // ============================================
  function renderCompanies() {
    const wrap = document.getElementById('ivCompanies');
    wrap.innerHTML = data.companies.map(c => `
      <div class="iv-company-card" data-company="${c.id}">
        <div class="iv-company-emoji">${c.emoji}</div>
        <div>
          <div class="iv-company-name">${c.name}</div>
          <div class="iv-company-focus">${c.focus}</div>
        </div>
      </div>
    `).join('');

    wrap.querySelectorAll('.iv-company-card').forEach(card => {
      card.addEventListener('click', () => {
        setFilter('company', card.dataset.company);
        // Scroll to questions
        document.getElementById('ivQuestions').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // ============================================
  // FILTERS
  // ============================================
  function renderFilterChips() {
    // Categories
    const catWrap = document.getElementById('ivCategoryFilters');
    catWrap.innerHTML = data.categories.map(c => `
      <button class="iv-chip" data-filter="category" data-value="${c.id}" style="border-left: 3px solid ${c.color};">
        ${c.label}
      </button>
    `).join('');

    // Companies
    const cmpWrap = document.getElementById('ivCompanyFilters');
    cmpWrap.innerHTML = data.companies.map(c => `
      <button class="iv-chip" data-filter="company" data-value="${c.id}">
        ${c.emoji} ${c.name}
      </button>
    `).join('');

    // Wire all chips
    document.querySelectorAll('.iv-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const filter = chip.dataset.filter;
        const value = chip.dataset.value;
        setFilter(filter, activeFilters[filter] === value ? null : value);
      });
    });

    // Search
    document.getElementById('ivSearch').addEventListener('input', (e) => {
      activeFilters.search = e.target.value.trim().toLowerCase();
      renderQuestions();
    });
  }

  function setFilter(name, value) {
    activeFilters[name] = value;
    activeFilters.tricky = false; // reset tricky-only when other filters change
    syncChipState();
    renderQuestions();
  }

  function syncChipState() {
    document.querySelectorAll('.iv-chip').forEach(chip => {
      const f = chip.dataset.filter;
      const v = chip.dataset.value;
      chip.classList.toggle('active', activeFilters[f] === v);
    });
  }

  window.filterTricky = function () {
    activeFilters = { difficulty: null, category: null, company: null, tricky: true, search: '' };
    document.getElementById('ivSearch').value = '';
    syncChipState();
    renderQuestions();
    document.getElementById('ivQuestions').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.clearFilters = function () {
    activeFilters = { difficulty: null, category: null, company: null, tricky: false, search: '' };
    document.getElementById('ivSearch').value = '';
    syncChipState();
    renderQuestions();
  };

  // ============================================
  // QUESTIONS
  // ============================================
  function filterQuestions() {
    return data.questions.filter(q => {
      if (activeFilters.difficulty && q.difficulty !== activeFilters.difficulty) return false;
      if (activeFilters.category && !q.categories.includes(activeFilters.category)) return false;
      if (activeFilters.company && !q.companies.includes(activeFilters.company)) return false;
      if (activeFilters.tricky && !q.tricky) return false;
      if (activeFilters.search) {
        const s = activeFilters.search;
        const hay = (q.title + ' ' + q.question + ' ' + q.answer + ' ' + q.categories.join(' ')).toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }

  function renderQuestions() {
    const wrap = document.getElementById('ivQuestions');
    const filtered = filterQuestions();

    // Title + count
    const titleEl = document.getElementById('ivResultsTitle');
    const countEl = document.getElementById('ivResultsCount');
    if (activeFilters.tricky) titleEl.textContent = '💀 Tricky-but-easy questions';
    else if (activeFilters.company) {
      const c = data.companies.find(x => x.id === activeFilters.company);
      titleEl.textContent = `${c.emoji} ${c.name} — questions they're known for`;
    } else if (activeFilters.category) {
      const cat = data.categories.find(x => x.id === activeFilters.category);
      titleEl.textContent = `Category: ${cat.label}`;
    } else if (activeFilters.difficulty) {
      titleEl.textContent = `${activeFilters.difficulty} questions`;
    } else if (activeFilters.search) {
      titleEl.textContent = `Search: "${activeFilters.search}"`;
    } else {
      titleEl.textContent = 'All Questions';
    }
    countEl.textContent = `${filtered.length} of ${data.questions.length}`;

    if (filtered.length === 0) {
      wrap.innerHTML = `
        <div class="iv-empty">
          <p style="font-size: 1rem; margin-bottom: 12px;">No questions match these filters.</p>
          <button class="btn btn-ghost btn-sm" onclick="clearFilters()">Clear filters</button>
        </div>
      `;
      return;
    }

    wrap.innerHTML = filtered.map((q, idx) => renderQuestionCard(q, idx + 1)).join('');

    // Wire up expand/collapse
    wrap.querySelectorAll('.iv-q-header').forEach(h => {
      h.addEventListener('click', () => {
        h.parentNode.classList.toggle('open');
      });
    });
  }

  function renderQuestionCard(q, num) {
    const companies = q.companies.map(cid => {
      const c = data.companies.find(x => x.id === cid);
      return c ? `<span class="iv-tag company">${c.emoji} ${c.name}</span>` : '';
    }).join('');

    const cats = q.categories.map(catId => {
      const cat = data.categories.find(x => x.id === catId);
      return cat ? `<span class="iv-tag category" style="border-left: 2px solid ${cat.color}; padding-left: 8px;">${cat.label}</span>` : '';
    }).join('');

    const followups = q.followups && q.followups.length
      ? `<div class="iv-q-section">
          <h4>🎯 Likely follow-ups</h4>
          <div class="iv-followups">
            <ul>${q.followups.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>
          </div>
        </div>`
      : '';

    return `
      <div class="iv-q" id="${q.id}">
        <div class="iv-q-header">
          <div class="iv-q-title">
            <span class="iv-q-num">#${String(num).padStart(2, '0')}</span>
            <span>${escapeHtml(q.title)}</span>
          </div>
          <div class="iv-q-meta">
            ${q.tricky ? '<span class="iv-tricky-flag">💀 Tricky</span>' : ''}
            <span class="iv-difficulty ${q.difficulty.toLowerCase()}">${q.difficulty}</span>
            <span class="iv-tag freq">${q.frequency}</span>
            <svg class="iv-q-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
        <div class="iv-q-body">
          <div class="iv-q-tags">
            ${companies}
            ${cats}
          </div>

          <div class="iv-q-section">
            <h4>📝 The Question</h4>
            ${renderMarkdown(q.question)}
          </div>

          <div class="iv-q-section">
            <h4>✅ The Answer</h4>
            ${renderMarkdown(q.answer)}
          </div>

          ${followups}
        </div>
      </div>
    `;
  }

  // ============================================
  // MARKDOWN-LITE RENDERER
  // ============================================
  function renderMarkdown(text) {
    if (!text) return '';
    let s = escapeHtml(text);

    // Code blocks (```sql ... ``` or ``` ... ```)
    s = s.replace(/```(?:sql)?\n?([\s\S]*?)```/g, (m, code) => {
      return `<pre><code>${window.highlightSQL ? window.highlightSQL(unescape(code.trim())) : escapeHtml(code.trim())}</code></pre>`;
    });

    // Tables (markdown style: | a | b |)
    s = s.replace(/((?:\|[^\n]+\|\n)+)/g, (m) => {
      const lines = m.trim().split('\n');
      if (lines.length < 2) return m;
      const header = lines[0].split('|').filter(c => c.trim()).map(c => c.trim());
      const rest = lines.slice(2); // skip separator
      const rows = rest.map(line => line.split('|').filter(c => c.trim()).map(c => c.trim()));
      return `<table><thead><tr>${header.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    });

    // Inline code
    s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');

    // Bold
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic
    s = s.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');

    // Numbered lists
    s = s.replace(/(?:^|\n)(\d+\.\s[^\n]+(?:\n\d+\.\s[^\n]+)*)/g, (m, list) => {
      const items = list.trim().split('\n').map(l => l.replace(/^\d+\.\s/, ''));
      return `\n<ol>${items.map(i => `<li>${i}</li>`).join('')}</ol>`;
    });

    // Bullet lists
    s = s.replace(/(?:^|\n)(-\s[^\n]+(?:\n-\s[^\n]+)*)/g, (m, list) => {
      const items = list.trim().split('\n').map(l => l.replace(/^-\s/, ''));
      return `\n<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
    });

    // Paragraphs (double newlines)
    s = s.split(/\n{2,}/).map(p => {
      if (p.startsWith('<') || !p.trim()) return p;
      return `<p>${p.replace(/\n/g, '<br/>')}</p>`;
    }).join('\n');

    return s;
  }

  function unescape(s) {
    return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  }

  // ============================================
  // BOOT
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    renderStats();
    renderCompanies();
    renderFilterChips();
    renderQuestions();

    // Handle ?company=X or ?tricky=1 from URL
    const cid = window.getUrlParam('company');
    if (cid) setFilter('company', cid);
    if (window.getUrlParam('tricky') === '1') window.filterTricky();
  });
})();
