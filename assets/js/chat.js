/* ============================================
   SQLSENSEI — Chat Tutor Engine
   Scripted Socratic tutor. Handles intake, lessons,
   exercise validation, hints, commands, quizzes.
   ============================================ */

(function () {
  'use strict';

  // ============================================
  // STATE
  // ============================================
  const STATE_KEY = 'sqlsensei_chat_state_v1';

  const STAGES = {
    INTAKE: 'intake',           // first message: ask experience level
    MODULE_INTRO: 'mod_intro',  // show concept + example
    AWAITING_ANSWER: 'await',   // student should answer exercise
    AWAITING_RETRY: 'retry',    // gave a hint, waiting for retry
    QUIZ: 'quiz',               // checkpoint quiz running
    DONE: 'done'
  };

  let state = {
    stage: STAGES.INTAKE,
    currentModule: null,
    hintGiven: false,
    quiz: null,                 // { levelNumber, qIdx, score, answers }
    history: []                 // {role, text}
  };

  function saveState() { try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch(e){} }
  function loadState() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (raw) state = { ...state, ...JSON.parse(raw) };
    } catch(e){}
  }

  // ============================================
  // DOM
  // ============================================
  const els = {};

  function $(id) { return document.getElementById(id); }

  // ============================================
  // RENDERING
  // ============================================
  function addMessage(role, html, opts = {}) {
    const wrap = document.createElement('div');
    wrap.className = `msg msg-${role}`;
    const avatar = role === 'sensei' ? 'SS' : 'YOU';
    const name = role === 'sensei' ? 'SQLSENSEI' : 'You';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    wrap.innerHTML = `
      <div class="msg-avatar">${avatar}</div>
      <div class="msg-body">
        <div class="msg-header">
          <span class="msg-name ${role === 'sensei' ? 'sensei' : ''}">${name}</span>
          <span class="msg-time">${time}</span>
        </div>
        <div class="msg-content">${html}</div>
      </div>
    `;
    els.messages.appendChild(wrap);
    els.messages.scrollTop = els.messages.scrollHeight;

    state.history.push({ role, text: html.replace(/<[^>]+>/g, ' ').trim() });
    saveState();

    return wrap;
  }

  function showTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'msg msg-sensei';
    wrap.id = '__typing';
    wrap.innerHTML = `
      <div class="msg-avatar">SS</div>
      <div class="msg-body">
        <div class="msg-header"><span class="msg-name sensei">SQLSENSEI</span></div>
        <div class="msg-content" style="padding: 0;">
          <div class="typing">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>
    `;
    els.messages.appendChild(wrap);
    els.messages.scrollTop = els.messages.scrollHeight;
  }
  function hideTyping() {
    const t = $('__typing');
    if (t) t.remove();
  }

  function senseiSay(html, delay = 600) {
    showTyping();
    setTimeout(() => {
      hideTyping();
      addMessage('sensei', html);
    }, delay);
  }

  // ============================================
  // LESSON RENDERING
  // ============================================
  function renderModuleLesson(modId) {
    const lesson = window.LESSONS[modId];
    const mod = window.getModuleById(modId);
    if (!lesson || !mod) {
      senseiSay(`<p>That module isn't ready yet. Try another from the sidebar.</p>`);
      return;
    }

    state.currentModule = modId;
    state.stage = STAGES.MODULE_INTRO;
    state.hintGiven = false;
    if (window.setCurrent) window.setCurrent(modId);
    saveState();
    updateSidebar();
    updateHeader();

    // Build the lesson HTML
    let html = `<div class="module-tag">📍 LEVEL ${mod.levelNumber} — Module ${mod.id}: ${mod.title}</div>`;

    html += `<h3>Concept</h3><p>${formatInline(lesson.concept)}</p>`;

    if (lesson.tables && lesson.tables.length) {
      html += `<h3>Sample Data — <code>${lesson.tables[0]}</code></h3>`;
      html += window.renderTable(lesson.tables[0], { rows: 6 });
      if (lesson.tables.length > 1) {
        html += `<h3>Also relevant — <code>${lesson.tables[1]}</code></h3>`;
        html += window.renderTable(lesson.tables[1], { rows: 6 });
      }
    }

    if (lesson.example) {
      html += `<h3>Example Query</h3>${window.codeBlock(lesson.example.sql)}`;
      html += `<h3>Result</h3>${window.renderResultTable(lesson.example.result.columns, lesson.example.result.rows)}`;
    }

    if (lesson.insight) {
      html += `<div class="insight"><strong>Key Insight:</strong> ${formatInline(lesson.insight)}</div>`;
    }

    html += `
      <div class="exercise">
        <div class="exercise-header">✏️ Your Turn</div>
        <p>${formatInline(lesson.exercise.prompt)}</p>
      </div>
      <div class="quick-replies">
        <button class="quick-reply" onclick="window.SENSEI.handleCommand('/hint')">/hint</button>
        <button class="quick-reply" onclick="window.SENSEI.handleCommand('/explain ${mod.title}')">/explain</button>
        <button class="quick-reply" onclick="window.SENSEI.skipModule()">Skip exercise →</button>
      </div>
    `;

    senseiSay(html, 400);
    state.stage = STAGES.AWAITING_ANSWER;
    saveState();
  }

  function showTakeaways(modId) {
    const lesson = window.LESSONS[modId];
    const mod = window.getModuleById(modId);
    if (!lesson) return;

    let html = `<h3>✅ Module ${modId} complete</h3>`;
    html += `<p>Three things to take with you from <strong>${mod.title}</strong>:</p>`;
    html += `<ol>${lesson.takeaways.map(t => `<li>${formatInline(t)}</li>`).join('')}</ol>`;

    // Check if this is the last module of a level → trigger quiz
    const level = window.getLevelByNumber(mod.levelNumber);
    const isLastInLevel = level.modules[level.modules.length - 1].id === modId;
    const all = window.getAllModules();
    const nextMod = all[all.findIndex(m => m.id === modId) + 1];

    if (isLastInLevel) {
      html += `
        <div class="insight" style="border-color: var(--amber-400); background: rgba(251,191,36,0.08);">
          <strong>🏆 You've finished Level ${mod.levelNumber}.</strong><br/>
          Before moving on, you need to pass the Level ${mod.levelNumber} Checkpoint Quiz — 3 questions, 3/3 to unlock the next level.
        </div>
        <div class="quick-replies">
          <button class="quick-reply" onclick="window.SENSEI.startQuiz(${mod.levelNumber})">▶ Start Level ${mod.levelNumber} Quiz</button>
          <button class="quick-reply" onclick="window.SENSEI.handleCommand('/cheatsheet')">/cheatsheet</button>
        </div>
      `;
    } else if (nextMod) {
      html += `
        <div class="quick-replies">
          <button class="quick-reply" onclick="window.SENSEI.gotoModule('${nextMod.id}')">▶ Next: Module ${nextMod.id} — ${nextMod.title}</button>
          <button class="quick-reply" onclick="window.SENSEI.handleCommand('/cheatsheet')">/cheatsheet</button>
          <button class="quick-reply" onclick="window.SENSEI.handleCommand('/quiz')">/quiz (self-test)</button>
        </div>
      `;
    } else {
      html += `
        <div class="insight" style="border-color: var(--emerald-400); background: rgba(52,211,153,0.08);">
          <strong>🥋 You've completed the entire curriculum.</strong><br/>
          Welcome, SQLSENSEI. Time to apply these skills on real data.
        </div>
      `;
    }

    senseiSay(html, 500);
  }

  // ============================================
  // ANSWER VALIDATION
  // ============================================
  function checkSQLAnswer(input, expected) {
    if (!expected) return { correct: true };
    const upper = input.toUpperCase();
    const lower = input.toLowerCase();

    // mustHave (case-insensitive substring)
    if (expected.mustHave) {
      for (const tok of expected.mustHave) {
        if (!lower.includes(tok.toLowerCase())) {
          return { correct: false, missing: tok };
        }
      }
    }

    // keywords (case-insensitive)
    if (expected.keywords) {
      for (const kw of expected.keywords) {
        const re = new RegExp(`\\b${kw.replace(/\s+/g, '\\s+')}\\b`, 'i');
        if (!re.test(input)) {
          return { correct: false, missing: kw };
        }
      }
    }

    // forbidden
    if (expected.forbidden) {
      for (const f of expected.forbidden) {
        if (input.includes(f)) {
          return { correct: false, forbidden: f };
        }
      }
    }

    // regex
    if (expected.regex && !expected.regex.test(input)) {
      return { correct: false, missing: 'expected pattern' };
    }

    // anyOf — at least one must be present
    if (expected.anyOf) {
      const found = expected.anyOf.some(t => lower.includes(t.toLowerCase()));
      if (!found) return { correct: false, missing: `one of ${expected.anyOf.join(' | ')}` };
    }

    return { correct: true };
  }

  function handleExerciseAnswer(input) {
    const lesson = window.LESSONS[state.currentModule];
    if (!lesson) return;

    const ex = lesson.exercise;
    let result;

    if (ex.type === 'sql') {
      result = checkSQLAnswer(input, ex.expected);
    } else if (ex.type === 'free') {
      result = ex.check ? ex.check(input) : { correct: true };
    }

    if (window.recordExercise) window.recordExercise(!!result.correct);

    if (result.correct) {
      let html = `<p>✅ <strong style="color: var(--emerald-400);">Correct.</strong> ${result.feedback || praiseLine()}</p>`;
      if (ex.sampleAnswer) {
        html += `<p style="color: var(--ink-300); font-size: 0.85rem;">Reference solution:</p>${window.codeBlock(ex.sampleAnswer)}`;
      }
      senseiSay(html, 500);

      // Mark complete + advance
      if (window.completeModule) window.completeModule(state.currentModule);
      updateSidebar();
      updateHeader();

      setTimeout(() => showTakeaways(state.currentModule), 1400);
      state.stage = STAGES.DONE;
      saveState();
    } else {
      // Wrong answer
      if (!state.hintGiven) {
        // First wrong: ask them to find the mistake
        state.hintGiven = true;
        saveState();
        const hint = result.missing
          ? `Not quite — look at your query carefully. I expected to see <code>${result.missing}</code> in your answer. What might be missing?`
          : (result.feedback || `Not quite — look at the structure of your query. What part doesn't match what we just covered?`);
        senseiSay(`<p>${hint}</p><p style="color: var(--ink-400); font-size: 0.85rem;">Try again — I'll show the full answer if you're still stuck.</p>`);
        state.stage = STAGES.AWAITING_RETRY;
      } else {
        // Second wrong: reveal answer + offer to retry module
        let html = `<p>No worries — SQL is best learned slowly. Here's the full answer:</p>`;
        if (ex.sampleAnswer) html += window.codeBlock(ex.sampleAnswer);
        if (result.feedback) html += `<p>${result.feedback}</p>`;
        html += `<p style="color: var(--ink-300);">Walk through it once. When you're ready, I'll mark this complete and we'll move on.</p>
          <div class="quick-replies">
            <button class="quick-reply" onclick="window.SENSEI.acceptAnswer()">✓ Got it — mark complete</button>
            <button class="quick-reply" onclick="window.SENSEI.replayModule()">↻ Re-read the module</button>
          </div>`;
        senseiSay(html, 600);
        state.stage = STAGES.DONE;
      }
      saveState();
    }
  }

  function praiseLine() {
    const lines = [
      'Clean syntax, correct logic.',
      'Exactly the structure I wanted to see.',
      'That\'s the right thinking.',
      'Nice — that\'s production-quality.',
      'Beautiful. You\'re building intuition.'
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  }

  // ============================================
  // QUIZ FLOW
  // ============================================
  function startQuiz(levelNumber) {
    const quiz = window.QUIZZES[levelNumber];
    if (!quiz) {
      senseiSay(`<p>No quiz available for Level ${levelNumber} yet.</p>`);
      return;
    }
    state.quiz = { levelNumber, qIdx: 0, score: 0, answers: [] };
    state.stage = STAGES.QUIZ;
    saveState();

    senseiSay(`
      <h3>🎯 ${quiz.title}</h3>
      <p>Three questions: <strong>Recall</strong>, <strong>Apply</strong>, <strong>Debug</strong>.</p>
      <p>Score <strong>3/3</strong> to unlock Level ${levelNumber + 1}. Anything less, we revisit the weakest module.</p>
      <p>Take your time. Type your answer when ready.</p>
    `, 500);
    setTimeout(() => askQuizQuestion(), 1800);
  }

  function askQuizQuestion() {
    const quiz = window.QUIZZES[state.quiz.levelNumber];
    const q = quiz.questions[state.quiz.qIdx];
    senseiSay(`
      <div class="module-tag">QUIZ · Question ${state.quiz.qIdx + 1} / 3 · ${q.kind}</div>
      <p>${formatInline(q.prompt)}</p>
    `, 400);
  }

  function handleQuizAnswer(input) {
    const quiz = window.QUIZZES[state.quiz.levelNumber];
    const q = quiz.questions[state.quiz.qIdx];
    let result;

    if (q.type === 'sql') {
      result = checkSQLAnswer(input, q.expected);
    } else {
      result = q.check ? q.check(input) : { correct: true };
    }

    state.quiz.answers.push({ correct: !!result.correct, qIdx: state.quiz.qIdx });
    if (result.correct) state.quiz.score += 1;

    if (window.recordExercise) window.recordExercise(!!result.correct);

    let feedback;
    if (result.correct) {
      feedback = `<p>✅ <strong style="color: var(--emerald-400);">Correct.</strong> ${result.feedback || ''}</p>`;
    } else {
      feedback = `<p>✗ <strong style="color: var(--rose-400);">Not quite.</strong> ${result.feedback || ''}</p>`;
      if (q.sampleAnswer) feedback += window.codeBlock(q.sampleAnswer);
    }

    state.quiz.qIdx += 1;
    saveState();

    senseiSay(feedback, 500);

    if (state.quiz.qIdx >= 3) {
      setTimeout(finishQuiz, 1600);
    } else {
      setTimeout(askQuizQuestion, 1600);
    }
  }

  function finishQuiz() {
    const { levelNumber, score } = state.quiz;
    let html = `<h3>📊 Quiz Result · ${score} / 3</h3>`;

    if (score === 3) {
      if (window.passCheckpoint) window.passCheckpoint(levelNumber);
      html += `
        <div class="insight" style="border-color: var(--emerald-400); background: rgba(52,211,153,0.08);">
          <strong>🏆 Level ${levelNumber} cleared.</strong> Moving you to Level ${levelNumber + 1}. Real progress — be proud of it.
        </div>
      `;
      const all = window.getAllModules();
      const nextLevel = window.getLevelByNumber(levelNumber + 1);
      if (nextLevel) {
        const next = nextLevel.modules[0];
        html += `<div class="quick-replies"><button class="quick-reply" onclick="window.SENSEI.gotoModule('${next.id}')">▶ Begin Level ${levelNumber + 1} — Module ${next.id}</button></div>`;
      } else {
        html += `<p>🥋 You've passed every level. You are now SQLSENSEI.</p>`;
      }
    } else if (score === 2) {
      const weakIdx = state.quiz.answers.findIndex(a => !a.correct);
      html += `
        <p>Almost there. ${score}/3 isn't a pass, but it's close.</p>
        <p>Let's revisit the module you stumbled on, then re-take the quiz when you're ready.</p>
        <div class="quick-replies">
          <button class="quick-reply" onclick="window.SENSEI.startQuiz(${levelNumber})">↻ Retake quiz</button>
          <button class="quick-reply" onclick="window.SENSEI.openLevelReview(${levelNumber})">📖 Review the level</button>
        </div>
      `;
    } else {
      html += `
        <p>Let's go back and rebuild this level — no rush. SQL is best learned slowly, and rushing now will cost you later.</p>
        <div class="quick-replies">
          <button class="quick-reply" onclick="window.SENSEI.openLevelReview(${levelNumber})">📖 Review level ${levelNumber}</button>
          <button class="quick-reply" onclick="window.SENSEI.startQuiz(${levelNumber})">↻ Retake quiz</button>
        </div>
      `;
    }

    senseiSay(html, 400);
    state.quiz = null;
    state.stage = STAGES.DONE;
    saveState();
  }

  // ============================================
  // COMMANDS
  // ============================================
  function handleCommand(cmd) {
    const c = cmd.trim().toLowerCase();

    if (c === '/status') return cmdStatus();
    if (c === '/quiz') {
      const mod = window.getModuleById(state.currentModule || '1.1');
      return startQuiz(mod ? mod.levelNumber : 1);
    }
    if (c === '/hint') return cmdHint();
    if (c.startsWith('/explain')) return cmdExplain(cmd.slice(8).trim());
    if (c === '/cheatsheet') return cmdCheatsheet();
    if (c === '/project') return cmdProject();
    if (c.startsWith('/dialect')) return cmdDialect(cmd.slice(8).trim());
    if (c === '/reset') return cmdReset();
    if (c === '/help' || c === '/commands') return cmdHelp();

    return false;
  }

  function cmdStatus() {
    const stats = window.getProgressStats();
    const mod = window.getModuleById(stats.currentModule);
    senseiSay(`
      <h3>📊 Your Status</h3>
      <p>
        <strong>Current:</strong> Level ${stats.currentLevel} · Module ${stats.currentModule} — ${mod ? mod.title : ''}<br/>
        <strong>Completed modules:</strong> ${stats.completedCount} / ${stats.totalModules} (${stats.percent}%)<br/>
        <strong>Checkpoints passed:</strong> ${stats.checkpointsPassed.length} / 5<br/>
        <strong>Exercise accuracy:</strong> ${stats.accuracy}%<br/>
        <strong>Streak:</strong> ${stats.streak} day${stats.streak === 1 ? '' : 's'} 🔥
      </p>
    `, 300);
    return true;
  }

  function cmdHint() {
    if (state.stage !== STAGES.AWAITING_ANSWER && state.stage !== STAGES.AWAITING_RETRY) {
      senseiSay(`<p>No active exercise — nothing to hint at right now.</p>`);
      return true;
    }
    const lesson = window.LESSONS[state.currentModule];
    if (!lesson || !lesson.exercise) return true;
    const ex = lesson.exercise;
    let hint = 'Look at the example query just above — the same pattern applies.';
    if (ex.expected) {
      if (ex.expected.keywords) hint = `Make sure your query uses: <code>${ex.expected.keywords.slice(0, 3).join('</code>, <code>')}</code>.`;
      else if (ex.expected.mustHave) hint = `Your answer should mention: <code>${ex.expected.mustHave.slice(0, 3).join('</code>, <code>')}</code>.`;
    }
    senseiSay(`<p>💡 <strong>Hint:</strong> ${hint}</p>`);
    return true;
  }

  function cmdExplain(topic) {
    if (!topic) {
      senseiSay(`<p>Usage: <code>/explain &lt;topic&gt;</code> — e.g. <code>/explain indexes</code>, <code>/explain join</code>.</p>`);
      return true;
    }
    // Find a lesson whose title or topic matches
    const all = window.getAllModules();
    const match = all.find(m =>
      m.title.toLowerCase().includes(topic.toLowerCase()) ||
      m.topic.toLowerCase().includes(topic.toLowerCase())
    );
    if (match) {
      senseiSay(`<p>Closest module: <strong>${match.id} — ${match.title}</strong>. Opening it now.</p>`);
      setTimeout(() => renderModuleLesson(match.id), 800);
    } else {
      senseiSay(`<p>No module matches "${topic}". Try <code>/explain join</code>, <code>/explain index</code>, or <code>/explain window</code>.</p>`);
    }
    return true;
  }

  function cmdCheatsheet() {
    senseiSay(`<p>Opening your cheatsheet in a new tab — it covers everything you've completed.</p>`);
    setTimeout(() => window.open('cheatsheet.html', '_blank'), 600);
    return true;
  }

  function cmdProject() {
    senseiSay(`
      <h3>🎯 Mini Project</h3>
      <p>Using the dataset you know, answer this in the playground:</p>
      <p><strong>"Which city has produced the highest total revenue (from delivered orders), and how much?"</strong></p>
      <p>Hint: JOIN customers to orders, filter by status, GROUP BY city, SUM the amounts, ORDER BY DESC, LIMIT 1.</p>
      <div class="quick-replies">
        <button class="quick-reply" onclick="window.open('playground.html', '_blank')">▶ Open Playground</button>
      </div>
    `);
    return true;
  }

  function cmdDialect(name) {
    const n = (name || '').toLowerCase();
    const map = {
      mysql: 'MySQL — uses <code>CONCAT(a,b)</code>, <code>DATEDIFF(d1,d2)</code>, <code>LIMIT n OFFSET m</code>. No FULL OUTER JOIN.',
      postgresql: 'PostgreSQL — supports <code>||</code> for concat, <code>EXTRACT(part FROM date)</code>, FULL OUTER JOIN, materialized views, window functions in full.',
      postgres: 'PostgreSQL — supports <code>||</code> for concat, <code>EXTRACT(part FROM date)</code>, FULL OUTER JOIN, materialized views, window functions in full.',
      sqlite: 'SQLite — supports <code>||</code> for concat, <code>strftime(\'%Y\', date)</code> for date parts. No FULL OUTER JOIN, no RIGHT JOIN (until v3.39+).'
    };
    const text = map[n];
    if (text) senseiSay(`<p><strong>${name.toUpperCase()}:</strong> ${text}</p>`);
    else senseiSay(`<p>Usage: <code>/dialect mysql</code>, <code>/dialect postgresql</code>, or <code>/dialect sqlite</code>.</p>`);
    return true;
  }

  function cmdReset() {
    if (!confirm('Reset all progress and start from Module 1.1?')) return true;
    window.resetProgress && window.resetProgress();
    localStorage.removeItem(STATE_KEY);
    state = { stage: STAGES.INTAKE, currentModule: null, hintGiven: false, quiz: null, history: [] };
    els.messages.innerHTML = '';
    setTimeout(() => sendFirstMessage(), 200);
    return true;
  }

  function cmdHelp() {
    senseiSay(`
      <h3>Available commands</h3>
      <ul>
        <li><code>/status</code> — your current level and progress</li>
        <li><code>/quiz</code> — start (or retake) the checkpoint quiz</li>
        <li><code>/hint</code> — get a nudge on the current exercise</li>
        <li><code>/explain &lt;topic&gt;</code> — jump to a topic (e.g. <code>/explain join</code>)</li>
        <li><code>/cheatsheet</code> — open your SQL cheatsheet</li>
        <li><code>/project</code> — a mini real-world challenge</li>
        <li><code>/dialect mysql | postgresql | sqlite</code> — dialect notes</li>
        <li><code>/reset</code> — start over from Module 1.1</li>
      </ul>
    `, 300);
    return true;
  }

  // ============================================
  // EXTERNAL API (called from buttons)
  // ============================================
  const api = {
    gotoModule(id) {
      addMessage('user', `Take me to Module ${id}.`);
      setTimeout(() => renderModuleLesson(id), 400);
    },
    skipModule() {
      addMessage('user', 'Skip this exercise.');
      const lesson = window.LESSONS[state.currentModule];
      let html = `<p>OK — skipping. For reference, a clean solution:</p>`;
      if (lesson && lesson.exercise && lesson.exercise.sampleAnswer) {
        html += window.codeBlock(lesson.exercise.sampleAnswer);
      } else {
        html += `<p>No reference for this one.</p>`;
      }
      senseiSay(html);
      if (window.completeModule) window.completeModule(state.currentModule);
      updateSidebar();
      setTimeout(() => showTakeaways(state.currentModule), 1400);
      state.stage = STAGES.DONE;
      saveState();
    },
    acceptAnswer() {
      if (window.completeModule) window.completeModule(state.currentModule);
      updateSidebar();
      updateHeader();
      setTimeout(() => showTakeaways(state.currentModule), 400);
    },
    replayModule() {
      renderModuleLesson(state.currentModule);
    },
    openLevelReview(levelNumber) {
      const lvl = window.getLevelByNumber(levelNumber);
      if (lvl) {
        addMessage('user', `Let's review Level ${levelNumber}.`);
        renderModuleLesson(lvl.modules[0].id);
      }
    },
    startQuiz,
    handleCommand,
    chooseLevel(label) {
      // Called from intake buttons
      addMessage('user', label);
      const map = { 'a)': 'beginner', 'b)': 'some', 'c)': 'intermediate', 'd)': 'advanced' };
      let entry = 'beginner';
      for (const k of Object.keys(map)) {
        if (label.toLowerCase().startsWith(k)) { entry = map[k]; break; }
      }
      if (window.setEntryLevel) window.setEntryLevel(entry);

      const startMap = { beginner: '1.1', some: '1.3', intermediate: '2.1', advanced: '4.1' };
      const startMod = startMap[entry];
      const mod = window.getModuleById(startMod);
      senseiSay(`
        <p>Perfect. Starting you at <strong>Module ${startMod} — ${mod.title}</strong>.</p>
        <p>Remember: we go <em>one concept at a time</em>. Don't try to memorize — try to <em>understand</em>. The patterns will stick on their own.</p>
      `, 400);
      setTimeout(() => renderModuleLesson(startMod), 1600);
    }
  };

  // ============================================
  // INPUT HANDLING
  // ============================================
  function handleUserInput(text) {
    text = text.trim();
    if (!text) return;

    addMessage('user', escapeHtml(text).replace(/\n/g, '<br/>'));

    // Commands
    if (text.startsWith('/')) {
      handleCommand(text);
      return;
    }

    // Stage routing
    if (state.stage === STAGES.QUIZ && state.quiz) {
      handleQuizAnswer(text);
      return;
    }

    if (state.stage === STAGES.AWAITING_ANSWER || state.stage === STAGES.AWAITING_RETRY) {
      handleExerciseAnswer(text);
      return;
    }

    if (state.stage === STAGES.INTAKE) {
      // Try to infer entry level from natural text
      const t = text.toLowerCase();
      if (t.includes('no') || t.includes('beginner') || t.startsWith('a')) api.chooseLevel('a) No — complete beginner');
      else if (t.includes('select') || t.includes('where') || t.startsWith('b')) api.chooseLevel('b) A little');
      else if (t.includes('join') || t.includes('group') || t.startsWith('c')) api.chooseLevel('c) Intermediate');
      else if (t.includes('window') || t.includes('advanced') || t.startsWith('d')) api.chooseLevel('d) Advanced');
      else {
        senseiSay(`<p>Pick one of the options (a, b, c, d) so I can place you at the right starting point.</p>`);
      }
      return;
    }

    // Generic fallback
    senseiSay(`
      <p>I'm a scripted tutor — I work best with answers to exercises or commands like <code>/status</code>, <code>/hint</code>, <code>/quiz</code>.</p>
      <p>Want to continue learning?</p>
      <div class="quick-replies">
        <button class="quick-reply" onclick="window.SENSEI.gotoModule('${state.currentModule || '1.1'}')">▶ Continue current module</button>
        <button class="quick-reply" onclick="window.SENSEI.handleCommand('/help')">/help — show commands</button>
      </div>
    `);
  }

  // ============================================
  // INTAKE / FIRST MESSAGE
  // ============================================
  function sendFirstMessage() {
    state.stage = STAGES.INTAKE;
    saveState();
    senseiSay(`
      <h3>👋 Welcome to SQL with SQLSENSEI</h3>
      <p>SQL is the language every developer, analyst, and data engineer uses daily — and you're about to master it from the ground up.</p>
      <p>Here's how this works:</p>
      <ul>
        <li>We go module by module — no skipping</li>
        <li>You practice every concept before we move on</li>
        <li>After each Level, you pass a checkpoint quiz to unlock the next</li>
      </ul>
      <p><strong>One quick question first:</strong> Have you written any SQL before?</p>
      <div class="quick-replies">
        <button class="quick-reply" onclick="window.SENSEI.chooseLevel('a) No — complete beginner')">a) No — complete beginner</button>
        <button class="quick-reply" onclick="window.SENSEI.chooseLevel('b) A little — I know SELECT and WHERE')">b) A little — I know SELECT and WHERE</button>
        <button class="quick-reply" onclick="window.SENSEI.chooseLevel('c) Intermediate — I have done JOINs and GROUP BY')">c) Intermediate — JOINs and GROUP BY</button>
        <button class="quick-reply" onclick="window.SENSEI.chooseLevel('d) Advanced — straight to window functions')">d) Advanced — window functions, optimization</button>
      </div>
    `, 400);
  }

  // ============================================
  // SIDEBAR + HEADER
  // ============================================
  function updateSidebar() {
    const sidebar = $('chatSidebar');
    if (!sidebar) return;

    const stats = window.getProgressStats();
    const progress = window.getProgress();
    const completed = new Set(progress.completed);

    let html = `<h3>Curriculum</h3>`;

    window.CURRICULUM.forEach(level => {
      html += `<div style="margin-top: 12px; margin-bottom: 4px; padding-left: 4px; font-family: var(--font-mono); font-size: 0.7rem; color: ${level.color}; font-weight: 600;">L${level.number} · ${level.title.toUpperCase()}</div>`;
      level.modules.forEach(m => {
        const isActive = m.id === stats.currentModule;
        const isComp = completed.has(m.id);
        html += `
          <div class="sidebar-module ${isActive ? 'active' : ''} ${isComp ? 'completed' : ''}" onclick="window.SENSEI.gotoModule('${m.id}')">
            <span class="sidebar-module-icon">${isComp ? '✓' : m.id.split('.')[1]}</span>
            <span>${m.title}</span>
          </div>
        `;
      });
    });

    html += `
      <div class="chat-progress-card">
        <div class="label">Progress</div>
        <div class="stat">${stats.completedCount} / ${stats.totalModules}</div>
        <div style="height: 4px; background: var(--bg-3); border-radius: 4px; overflow: hidden;">
          <div style="height: 100%; width: ${stats.percent}%; background: linear-gradient(90deg, var(--cyan-400), var(--amber-400));"></div>
        </div>
        <div style="margin-top: 8px; font-size: 0.7rem; color: var(--ink-400); display: flex; justify-content: space-between;">
          <span>Streak: ${stats.streak} 🔥</span>
          <span>Acc: ${stats.accuracy}%</span>
        </div>
      </div>
    `;

    sidebar.innerHTML = html;
  }

  function updateHeader() {
    const stats = window.getProgressStats();
    const mod = window.getModuleById(stats.currentModule);
    const titleEl = $('chatHeaderTitle');
    const subEl = $('chatHeaderSub');
    if (titleEl) titleEl.textContent = mod ? `${mod.title}` : 'SQLSENSEI';
    if (subEl) subEl.textContent = mod ? `LEVEL ${mod.levelNumber} · Module ${mod.id}` : 'Loading…';
  }

  // ============================================
  // HELPERS
  // ============================================
  function formatInline(text) {
    if (!text) return '';
    let s = escapeHtml(text);
    // **bold**
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // `code`
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Markdown-style code blocks ```sql ... ```
    s = s.replace(/```(?:sql)?\n?([\s\S]*?)```/g, (m, code) => window.codeBlock(code.trim()));
    // newlines → <br/>
    s = s.replace(/\n/g, '<br/>');
    return s;
  }

  function escapeHtml(s) {
    return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  }

  // ============================================
  // BOOT
  // ============================================
  function init() {
    els.messages = $('chatMessages');
    els.input = $('chatInput');
    els.send = $('chatSend');

    loadState();
    updateSidebar();
    updateHeader();

    // Wire up send button + enter
    els.send.addEventListener('click', () => {
      const v = els.input.value;
      if (v.trim()) {
        handleUserInput(v);
        els.input.value = '';
        els.input.style.height = 'auto';
      }
    });

    els.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        els.send.click();
      }
    });

    els.input.addEventListener('input', () => {
      els.input.style.height = 'auto';
      els.input.style.height = Math.min(240, els.input.scrollHeight) + 'px';
    });

    // Composer mode tabs (text vs SQL)
    document.querySelectorAll('.composer-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.composer-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const mode = tab.dataset.mode;
        els.input.classList.toggle('code-mode', mode === 'sql');
        els.input.placeholder = mode === 'sql'
          ? 'SELECT ... FROM ...    (Press Enter to submit, Shift+Enter for newline)'
          : 'Type your answer, or use commands like /hint, /status, /quiz…';
      });
    });

    // URL ?module=X
    const modParam = window.getUrlParam('module');

    // Decide what to do
    if (modParam && window.LESSONS[modParam]) {
      // Direct module link — load it
      els.messages.innerHTML = '';
      state.stage = STAGES.DONE;
      addMessage('user', `Open Module ${modParam}.`);
      setTimeout(() => renderModuleLesson(modParam), 300);
    } else if (state.history && state.history.length > 0) {
      // Returning visitor — replay last few
      state.history.slice(-6).forEach(h => {
        const wrap = document.createElement('div');
        wrap.className = `msg msg-${h.role}`;
        wrap.innerHTML = `
          <div class="msg-avatar">${h.role === 'sensei' ? 'SS' : 'YOU'}</div>
          <div class="msg-body">
            <div class="msg-header"><span class="msg-name ${h.role === 'sensei' ? 'sensei' : ''}">${h.role === 'sensei' ? 'SQLSENSEI' : 'You'}</span></div>
            <div class="msg-content">${h.text}</div>
          </div>`;
        els.messages.appendChild(wrap);
      });
      // Friendly resume
      setTimeout(() => {
        const stats = window.getProgressStats();
        const mod = window.getModuleById(stats.currentModule);
        senseiSay(`
          <p>👋 Welcome back. Where did we leave off?</p>
          <p>You're on <strong>Module ${stats.currentModule} — ${mod ? mod.title : ''}</strong> (${stats.completedCount}/${stats.totalModules} done · ${stats.streak} day streak 🔥).</p>
          <div class="quick-replies">
            <button class="quick-reply" onclick="window.SENSEI.gotoModule('${stats.currentModule}')">▶ Continue Module ${stats.currentModule}</button>
            <button class="quick-reply" onclick="window.SENSEI.handleCommand('/status')">/status</button>
            <button class="quick-reply" onclick="window.SENSEI.handleCommand('/cheatsheet')">/cheatsheet</button>
            <button class="quick-reply" onclick="window.SENSEI.handleCommand('/reset')">/reset</button>
          </div>
        `, 400);
      }, 200);
    } else {
      sendFirstMessage();
    }
  }

  window.SENSEI = api;
  document.addEventListener('DOMContentLoaded', init);
})();
