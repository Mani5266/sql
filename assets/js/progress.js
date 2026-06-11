/* ============================================
   SQLSENSEI — Progress Tracking (localStorage)
   ============================================ */

(function () {
  'use strict';

  const KEY = 'sqlsensei_progress_v1';

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      const p = JSON.parse(raw);
      return { ...defaults(), ...p };
    } catch (e) { return defaults(); }
  }

  function defaults() {
    return {
      completed: [],          // module ids: ['1.1', '1.2']
      current: '1.1',         // module currently in progress
      checkpointsPassed: [],  // level numbers: [1, 2]
      exercisesAttempted: 0,
      exercisesCorrect: 0,
      streak: 0,
      lastVisit: null,
      level: 'beginner'       // beginner | some | intermediate | advanced
    };
  }

  function save(p) {
    localStorage.setItem(KEY, JSON.stringify(p));
  }

  function getProgress() { return load(); }

  function completeModule(id) {
    const p = load();
    if (!p.completed.includes(id)) {
      p.completed.push(id);
    }
    // Advance current to next module
    const all = window.getAllModules();
    const idx = all.findIndex(m => m.id === id);
    if (idx >= 0 && idx + 1 < all.length) {
      p.current = all[idx + 1].id;
    }
    save(p);
    return p;
  }

  function setCurrent(id) {
    const p = load();
    p.current = id;
    save(p);
    return p;
  }

  function recordExercise(correct) {
    const p = load();
    p.exercisesAttempted += 1;
    if (correct) p.exercisesCorrect += 1;
    save(p);
    return p;
  }

  function passCheckpoint(levelNumber) {
    const p = load();
    if (!p.checkpointsPassed.includes(levelNumber)) {
      p.checkpointsPassed.push(levelNumber);
    }
    save(p);
    return p;
  }

  function updateStreak() {
    const p = load();
    const today = new Date().toDateString();
    if (p.lastVisit === today) return p;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (p.lastVisit === yesterday) p.streak += 1;
    else if (!p.lastVisit) p.streak = 1;
    else p.streak = 1;
    p.lastVisit = today;
    save(p);
    return p;
  }

  function setEntryLevel(level) {
    const p = load();
    p.level = level;
    // Set starting module based on level
    const startMap = {
      'beginner':    '1.1',
      'some':        '1.3',
      'intermediate':'2.1',
      'advanced':    '4.1'
    };
    p.current = startMap[level] || '1.1';
    // Mark earlier modules as completed for non-beginners
    const all = window.getAllModules();
    const startIdx = all.findIndex(m => m.id === p.current);
    if (startIdx > 0) {
      p.completed = all.slice(0, startIdx).map(m => m.id);
    }
    save(p);
    return p;
  }

  function getProgressStats() {
    const p = load();
    const all = window.getAllModules();
    const completedCount = p.completed.length;
    const totalModules = all.length;
    const percent = Math.round((completedCount / totalModules) * 100);

    // Current level = level of current module
    const currentMod = all.find(m => m.id === p.current);
    const currentLevel = currentMod ? currentMod.levelNumber : 1;

    return {
      completedCount,
      totalModules,
      percent,
      currentLevel,
      currentModule: p.current,
      streak: p.streak,
      checkpointsPassed: p.checkpointsPassed,
      accuracy: p.exercisesAttempted > 0
        ? Math.round((p.exercisesCorrect / p.exercisesAttempted) * 100)
        : 0
    };
  }

  function resetProgress() {
    localStorage.removeItem(KEY);
  }

  // Expose
  window.getProgress = getProgress;
  window.completeModule = completeModule;
  window.setCurrent = setCurrent;
  window.recordExercise = recordExercise;
  window.passCheckpoint = passCheckpoint;
  window.updateStreak = updateStreak;
  window.setEntryLevel = setEntryLevel;
  window.getProgressStats = getProgressStats;
  window.resetProgress = resetProgress;

  // Update streak on load
  updateStreak();
})();
