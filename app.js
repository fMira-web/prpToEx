(function () {
  'use strict';

  /* =========================================================
     DATA
  ========================================================= */
  // Works two ways: the multi-file site loads data/roadmap-data.js first, which
  // sets window.ROADMAP_DATA; the single-file Artifact build instead embeds the
  // same data inline as a JSON script tag. Support both without forking this file.
  var DATA = (typeof window.ROADMAP_DATA !== 'undefined')
    ? window.ROADMAP_DATA
    : JSON.parse(document.getElementById('roadmap-data').textContent);
  var DAYS = DATA.days;
  var MONTHS = DATA.months;
  var PHASE_NAMES = DATA.phaseNames;

  DAYS.forEach(function (d) {
    var parts = [
      d.topic, d.phase, d.grammar.name, d.grammar.rule, d.grammar.example, d.grammar.tip,
      d.listening.title, d.listening.detail, d.reading.title, d.reading.detail,
      d.writing.title, d.writing.detail, d.speaking.title, d.speaking.detail,
      d.action, d.focus.join(' ')
    ];
    d.vocab.forEach(function (v) { parts.push(v.phrase, v.sentence); });
    d._hay = parts.join(' • ').toLowerCase();
  });

  var DAY_BY_N = {};
  DAYS.forEach(function (d) { DAY_BY_N[d.n] = d; });

  var WEEKS = {}; // weekNum -> {month, topic, days:[...]}
  DAYS.forEach(function (d) {
    if (!WEEKS[d.w]) WEEKS[d.w] = { month: d.m, topic: d.topic, days: [] };
    WEEKS[d.w].days.push(d);
  });

  var MONTH_WEEKS = {};
  MONTHS.forEach(function (m) { MONTH_WEEKS[m.month] = m.weeks; });

  /* =========================================================
     STORAGE
  ========================================================= */
  var STORAGE_KEY = 'ielts-roadmap-progress-v1';
  var POMO_PREFIX = 'ielts-roadmap-pomo-';

  function safeGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function safeSet(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }

  function loadProgress() {
    try {
      var raw = safeGet(STORAGE_KEY);
      if (!raw) return new Set();
      var arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr : []);
    } catch (e) { return new Set(); }
  }
  function saveProgress() { safeSet(STORAGE_KEY, JSON.stringify(Array.from(completed))); }

  function todayKey() { return POMO_PREFIX + new Date().toDateString(); }
  function loadPomoCount() { var v = safeGet(todayKey()); return v ? parseInt(v, 10) || 0 : 0; }
  function savePomoCount(n) { safeSet(todayKey(), String(n)); }

  /* =========================================================
     REAL-TIME SYNC (Artifact "db" capability)
     Progress is always saved to localStorage first (instant, works
     offline and in any plain saved copy of this file). When this page
     is opened as the published, live artifact, it additionally syncs
     a shared "progress/state" document through claude.use("db") —
     so ticking a day here shows up immediately on any other device
     or tab where the same artifact link is open. A standalone saved
     HTML file has no window.claude at all, so it simply stays on
     local-only storage — that is expected, not an error.
  ========================================================= */
  var dbDoc = null;
  var dbFirstSnapshotHandled = false;

  function setSyncStatus(state) {
    var dot = document.getElementById('syncDot');
    var label = document.getElementById('syncLabel');
    if (!dot || !label) return;
    dot.className = 'w-1.5 h-1.5 rounded-full';
    if (state === 'live') {
      dot.classList.add('bg-brand-emerald', 'animate-pulseGlow');
      label.textContent = 'Live sync — updates instantly everywhere';
      label.className = 'text-[10px] text-brand-emerald';
    } else if (state === 'connecting') {
      dot.classList.add('bg-slate-500');
      label.textContent = 'Connecting…';
      label.className = 'text-[10px] text-slate-500';
    } else if (state === 'error') {
      dot.classList.add('bg-brand-rose');
      label.textContent = 'Sync unavailable — saved on this device';
      label.className = 'text-[10px] text-brand-rose/80';
    } else {
      dot.classList.add('bg-slate-500');
      label.textContent = 'Saved on this device only';
      label.className = 'text-[10px] text-slate-500';
    }
  }

  function refreshAllCheckboxes() {
    DAYS.forEach(function (d) {
      var chk = document.querySelector('[data-day-check="' + d.n + '"]');
      if (!chk) return;
      var isDone = completed.has(d.n);
      if (chk.checked !== isDone) chk.checked = isDone;
      var row = chk.closest('.day-row');
      if (row) row.classList.toggle('opacity-70', isDone);
    });
  }

  function pushCompletedToDb() {
    if (!dbDoc) return;
    dbDoc.set({ completed: Array.from(completed), updatedAt: Date.now() }).catch(function () {
      setSyncStatus('error');
    });
  }

  function initDbSync() {
    if (typeof window.claude === 'undefined' || typeof window.claude.use !== 'function') {
      setSyncStatus('local');
      return;
    }
    setSyncStatus('connecting');
    window.claude.use('db').then(function (db) {
      if (!db) { setSyncStatus('local'); return; }
      dbDoc = db.doc('progress/state');
      dbDoc.onSnapshot(function (snap) {
        if (!dbFirstSnapshotHandled) {
          dbFirstSnapshotHandled = true;
          if (snap.exists) {
            var data = snap.data() || {};
            var remote = new Set(Array.isArray(data.completed) ? data.completed : []);
            var merged = new Set(remote);
            completed.forEach(function (n) { merged.add(n); });
            completed = merged;
            if (merged.size !== remote.size) pushCompletedToDb();
          } else {
            pushCompletedToDb();
          }
          saveProgress();
          refreshAllCheckboxes();
          updateProgressUI();
          setSyncStatus('live');
          return;
        }
        // live update — from this tab's own write, or another device/tab
        var d2 = snap.data() || {};
        completed = new Set(Array.isArray(d2.completed) ? d2.completed : []);
        saveProgress();
        refreshAllCheckboxes();
        updateProgressUI();
        setSyncStatus('live');
      }, function () {
        setSyncStatus('error');
      });
    }).catch(function () { setSyncStatus('local'); });
  }

  /* =========================================================
     STATE
  ========================================================= */
  var completed = loadProgress();
  var expandedMonths = new Set([1]);
  var expandedWeeks = new Set([1]);
  var expandedDays = new Set();
  var renderedDetail = new Set();
  var activeSkills = new Set();
  var searchQuery = '';
  var pomoCount = loadPomoCount();

  var SKILL_LIST = ['Grammar', 'Listening', 'Reading', 'Writing', 'Speaking', 'Full Mock', 'Rest & Review'];
  var SKILL_COLORS = {
    'Grammar': 'text-brand-indigo border-brand-indigo/40 bg-brand-indigo/10',
    'Listening': 'text-brand-sky border-brand-sky/40 bg-brand-sky/10',
    'Reading': 'text-brand-emerald border-brand-emerald/40 bg-brand-emerald/10',
    'Writing': 'text-brand-amber border-brand-amber/40 bg-brand-amber/10',
    'Speaking': 'text-brand-rose border-brand-rose/40 bg-brand-rose/10',
    'Full Mock': 'text-fuchsia-300 border-fuchsia-400/40 bg-fuchsia-400/10',
    'Rest & Review': 'text-slate-300 border-slate-400/30 bg-slate-400/10'
  };
  var SKILL_ICONS = {
    'Grammar': '<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
    'Listening': '<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>',
    'Reading': '<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>',
    'Writing': '<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>',
    'Speaking': '<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"></path></svg>',
    'Full Mock': '<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3"></path><circle cx="12" cy="12" r="10"></circle></svg>',
    'Rest & Review': '<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a8 8 0 1 0-11.31 11.31"></path><path d="M18 12a6 6 0 1 1-6-6"></path></svg>'
  };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function dayMatchesSkill(day, skill) {
    if (skill === 'Full Mock') return day.dayType === 'mock';
    if (skill === 'Rest & Review') return day.dayType === 'rest' || day.focus.indexOf('Rest & Review') !== -1;
    return day.focus.indexOf(skill) !== -1;
  }

  function dayVisible(day) {
    if (searchQuery && day._hay.indexOf(searchQuery) === -1) return false;
    if (activeSkills.size > 0) {
      var ok = false;
      activeSkills.forEach(function (s) { if (dayMatchesSkill(day, s)) ok = true; });
      if (!ok) return false;
    }
    return true;
  }

  function filtersActive() { return !!searchQuery || activeSkills.size > 0; }

  /* =========================================================
     PROGRESS HELPERS
  ========================================================= */
  function weekProgress(w) {
    var days = WEEKS[w].days, done = 0;
    days.forEach(function (d) { if (completed.has(d.n)) done++; });
    return { done: done, total: days.length };
  }
  function monthProgress(m) {
    var days = DAYS.filter(function (d) { return d.m === m; }), done = 0;
    days.forEach(function (d) { if (completed.has(d.n)) done++; });
    return { done: done, total: days.length };
  }
  function overallProgress() {
    return { done: completed.size, total: DAYS.length };
  }
  function currentStreak() {
    var n = 1, streak = 0;
    while (DAY_BY_N[n] && completed.has(n)) { streak++; n++; }
    return streak;
  }
  function hoursLogged() {
    var mins = 0;
    completed.forEach(function (n) { var d = DAY_BY_N[n]; if (d) mins += d.estMinutes; });
    return Math.round((mins / 60) * 10) / 10;
  }
  function skillStats() {
    var res = {};
    ['Grammar', 'Listening', 'Reading', 'Writing', 'Speaking'].forEach(function (s) {
      var total = 0, done = 0;
      DAYS.forEach(function (d) {
        if (dayMatchesSkill(d, s)) { total++; if (completed.has(d.n)) done++; }
      });
      res[s] = { done: done, total: total };
    });
    return res;
  }

  /* =========================================================
     BUILD: MONTH STRIP
  ========================================================= */
  var monthStripEl = document.getElementById('monthStrip');
  function renderMonthStrip() {
    monthStripEl.innerHTML = MONTHS.map(function (m) {
      var p = monthProgress(m.month);
      var pct = Math.round((p.done / p.total) * 100);
      return (
        '<button data-jump-month="' + m.month + '" class="focus-ring group text-left glass rounded-xl px-3 py-2.5 card-hover">' +
          '<div class="flex items-center justify-between">' +
            '<span class="font-display font-bold text-[13px]">M' + m.month + '</span>' +
            '<span class="text-[10px] text-slate-400 num-pill">' + pct + '%</span>' +
          '</div>' +
          '<div class="mt-1 text-[10.5px] text-slate-400 leading-snug line-clamp-2">' + esc(m.phase) + '</div>' +
          '<div class="mt-2 h-1.5 rounded-full progress-track overflow-hidden">' +
            '<div class="h-full progress-fill rounded-full" style="width:' + pct + '%"></div>' +
          '</div>' +
        '</button>'
      );
    }).join('');
  }

  /* =========================================================
     BUILD: FILTER CHIPS
  ========================================================= */
  var filterChipsEl = document.getElementById('filterChips');
  function chipBaseClass() {
    return 'chip focus-ring flex items-center gap-1.5 text-[11.5px] font-medium px-2.5 py-1.5 rounded-lg border';
  }
  function updateChipVisuals() {
    SKILL_LIST.forEach(function (s) {
      var btn = filterChipsEl.querySelector('[data-chip="' + s + '"]');
      if (!btn) return;
      var active = activeSkills.has(s);
      btn.className = chipBaseClass() + ' ' +
        (active ? SKILL_COLORS[s] + ' shadow-glow' : 'text-slate-400 border-white/10 glass hover:text-slate-200');
    });
  }
  function buildChips() {
    SKILL_LIST.forEach(function (s) {
      var btn = document.createElement('button');
      btn.setAttribute('data-chip', s);
      btn.setAttribute('type', 'button');
      btn.innerHTML = SKILL_ICONS[s] + '<span>' + s + '</span>';
      btn.addEventListener('click', function () {
        if (activeSkills.has(s)) activeSkills.delete(s); else activeSkills.add(s);
        updateChipVisuals();
        applyFilters();
      });
      filterChipsEl.appendChild(btn);
    });
    updateChipVisuals();
  }

  /* =========================================================
     BUILD: ROADMAP TREE (built once)
  ========================================================= */
  var root = document.getElementById('roadmapRoot');

  function skillIconSmall(name) {
    return SKILL_ICONS[name] || '';
  }

  function focusBadges(focus, dayType) {
    return focus.map(function (f) {
      var cls = SKILL_COLORS[f] || 'text-slate-300 border-slate-500/30 bg-slate-500/10';
      return '<span class="skill-badge inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border ' + cls + '">' + skillIconSmall(f) + esc(f) + '</span>';
    }).join('');
  }

  function workoutCard(key, label, block, isPrimary, dayNum, hasExercise) {
    var ring = isPrimary ? 'border-l-2 ' + (
      key === 'listening' ? 'border-brand-sky' :
      key === 'reading' ? 'border-brand-emerald' :
      key === 'writing' ? 'border-brand-amber' : 'border-brand-rose'
    ) : 'border-l-2 border-white/10';
    var launchBtn = hasExercise
      ? '<button type="button" data-launch-exercise="' + key + '" data-launch-day="' + dayNum + '" ' +
          'class="focus-ring mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-100">' +
          '<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>' +
          '<span>Start Exercise</span>' +
        '</button>'
      : '';
    return (
      '<div class="rounded-xl bg-black/20 px-3.5 py-3 ' + ring + '">' +
        '<div class="flex items-center justify-between gap-2">' +
          '<div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">' +
            skillIconSmall(label) + '<span>' + label + (isPrimary ? ' <span class="text-brand-emerald">· primary</span>' : '') + '</span>' +
          '</div>' +
          '<span class="text-[10.5px] text-slate-500 num-pill">' + block.minutes + ' min</span>' +
        '</div>' +
        '<div class="mt-1 text-[13px] font-semibold text-slate-100">' + esc(block.title) + '</div>' +
        '<div class="mt-0.5 text-[12.5px] text-slate-400 leading-relaxed">' + esc(block.detail) + '</div>' +
        launchBtn +
      '</div>'
    );
  }

  function buildDayDetailHTML(day) {
    var g = day.grammar;
    var isL = day.focus.indexOf('Listening') !== -1 || day.dayType === 'mock';
    var isR = day.focus.indexOf('Reading') !== -1 || day.dayType === 'mock';
    var isW = day.focus.indexOf('Writing') !== -1 || day.dayType === 'mock';
    var isS = day.focus.indexOf('Speaking') !== -1 || day.dayType === 'mock';

    var vocabHTML = day.vocab.map(function (v, i) {
      var colors = ['border-brand-emerald/30', 'border-brand-sky/30', 'border-brand-indigo/30'];
      return (
        '<div class="rounded-xl bg-black/20 border ' + colors[i % 3] + ' px-3.5 py-3">' +
          '<div class="text-[13px] font-semibold text-slate-100">' + esc(v.phrase) + '</div>' +
          '<div class="mt-1 text-[12.5px] text-slate-400 italic leading-relaxed">“' + esc(v.sentence) + '”</div>' +
        '</div>'
      );
    }).join('');

    return (
      '<div class="px-4 sm:px-5 pb-5 pt-1 space-y-4">' +

        '<div class="rounded-xl bg-gradient-to-br from-brand-indigo/10 to-transparent border border-brand-indigo/25 px-3.5 py-3.5">' +
          '<div class="flex flex-wrap items-center justify-between gap-2">' +
            '<div class="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-brand-indigo">' +
              skillIconSmall('Grammar') + '<span>Grammar Component</span>' +
            '</div>' +
            '<span class="text-[10px] px-2 py-0.5 rounded-full bg-brand-indigo/15 text-brand-indigo border border-brand-indigo/30">' + esc(g.level) + ' · ' + esc(g.pass_) + '</span>' +
          '</div>' +
          '<div class="mt-2 text-[14px] font-bold text-slate-100">' + esc(g.name) + '</div>' +
          '<div class="mt-1.5 text-[12.5px] text-slate-300 leading-relaxed">' + esc(g.rule) + '</div>' +
          '<div class="mt-2 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">' +
            '<span class="text-[10.5px] uppercase tracking-wide text-slate-500 shrink-0">Formula</span>' +
            '<code class="text-[12px] px-2 py-1 rounded-md bg-black/40 text-brand-emerald border border-white/10 font-mono">' + esc(g.formula) + '</code>' +
          '</div>' +
          '<div class="mt-2 text-[12.5px] text-slate-300"><span class="text-slate-500">Example —</span> <span class="italic">“' + esc(g.example) + '”</span></div>' +
          '<div class="mt-2 flex items-start gap-1.5 text-[12px] text-brand-amber/90"><span class="mt-0.5">⚠</span><span><b>Error-avoidance tip:</b> ' + esc(g.tip) + '</span></div>' +
        '</div>' +

        '<div>' +
          '<div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Productive &amp; Receptive Workouts</div>' +
          '<div class="grid sm:grid-cols-2 gap-2.5">' +
            workoutCard('listening', 'Listening', day.listening, isL, day.n, !!(day.exercise && day.exercise.listening)) +
            workoutCard('reading', 'Reading', day.reading, isR, day.n, !!(day.exercise && day.exercise.reading)) +
            workoutCard('writing', 'Writing', day.writing, isW, day.n, !!(day.exercise && day.exercise.writing)) +
            workoutCard('speaking', 'Speaking', day.speaking, isS, day.n, !!(day.exercise && day.exercise.speaking)) +
          '</div>' +
        '</div>' +

        '<div>' +
          '<div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Vocabulary &amp; Collocations of the Day</div>' +
          '<div class="grid sm:grid-cols-3 gap-2.5">' + vocabHTML + '</div>' +
        '</div>' +

        '<div class="rounded-xl bg-gradient-to-br from-brand-emerald/10 to-transparent border border-brand-emerald/30 px-3.5 py-3.5">' +
          '<div class="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-brand-emerald">' +
            '<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>' +
            '<span>Today’s Action Item / Deliverable</span>' +
          '</div>' +
          '<div class="mt-1.5 text-[13px] text-slate-100 leading-relaxed">' + esc(day.action) + '</div>' +
        '</div>' +

      '</div>'
    );
  }

  function dayRowHTML(day) {
    var checked = completed.has(day.n) ? 'checked' : '';
    var doneClass = completed.has(day.n) ? 'opacity-70' : '';
    return (
      '<div class="day-row card-hover rounded-xl glass ' + doneClass + '" data-day="' + day.n + '" data-daytype="' + day.dayType + '">' +
        '<div class="flex items-center gap-3 px-3.5 sm:px-4 py-3 cursor-pointer" data-day-toggle="' + day.n + '">' +
          '<label class="shrink-0" data-no-toggle>' +
            '<input type="checkbox" ' + checked + ' data-day-check="' + day.n + '" aria-label="Mark Day ' + day.n + ' complete" class="checkbox-glow w-[18px] h-[18px] rounded-md accent-emerald-400 cursor-pointer" />' +
          '</label>' +
          '<div class="shrink-0 w-9 h-9 rounded-lg bg-black/25 grid place-items-center text-[11px] font-bold num-pill text-slate-300">' + day.n + '</div>' +
          '<div class="min-w-0 flex-1">' +
            '<div class="flex items-center gap-2 flex-wrap">' +
              '<span class="text-[12.5px] font-semibold text-slate-100">' + esc(day.wdName) + '</span>' +
              '<span class="hidden sm:flex items-center gap-1 flex-wrap">' + focusBadges(day.focus, day.dayType) + '</span>' +
            '</div>' +
            '<div class="sm:hidden mt-1 flex items-center gap-1 flex-wrap">' + focusBadges(day.focus, day.dayType) + '</div>' +
          '</div>' +
          '<div class="shrink-0 text-[10.5px] text-slate-500 num-pill hide-mobile">' + day.estMinutes + ' min</div>' +
          '<svg class="chev shrink-0 w-4 h-4 text-slate-500 rotate-open" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>' +
        '</div>' +
        '<div class="accordion" data-day-acc="' + day.n + '"><div class="accordion-inner" data-day-inner="' + day.n + '"></div></div>' +
      '</div>'
    );
  }

  function weekHeaderHTML(w, weekData) {
    var p = weekProgress(w);
    var pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
    return (
      '<div class="flex items-center gap-3 px-4 py-3 cursor-pointer select-none" data-week-toggle="' + w + '">' +
        '<svg class="chev shrink-0 w-4 h-4 text-slate-400 rotate-open" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>' +
        '<div class="min-w-0 flex-1">' +
          '<div class="flex items-center gap-2 flex-wrap">' +
            '<span class="font-display font-bold text-[13px]">Week ' + w + '</span>' +
            '<span class="text-[12px] text-slate-400 truncate">' + esc(weekData.topic) + '</span>' +
          '</div>' +
        '</div>' +
        '<span class="text-[10.5px] text-slate-500 num-pill hide-mobile">' + p.done + '/' + p.total + '</span>' +
        '<div class="w-16 sm:w-24 h-1.5 rounded-full progress-track overflow-hidden shrink-0">' +
          '<div class="h-full progress-fill rounded-full" data-week-bar="' + w + '" style="width:' + pct + '%"></div>' +
        '</div>' +
      '</div>'
    );
  }

  function monthHeaderHTML(m) {
    var p = monthProgress(m.month);
    var pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
    return (
      '<div class="flex items-center gap-3.5 px-4 sm:px-5 py-4 cursor-pointer select-none" data-month-toggle="' + m.month + '">' +
        '<div class="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-brand-indigo/25 to-brand-emerald/15 border border-white/10 grid place-items-center font-display font-extrabold text-[15px]">M' + m.month + '</div>' +
        '<div class="min-w-0 flex-1">' +
          '<div class="font-display font-bold text-[14.5px] sm:text-base text-slate-100">' + esc(m.phase) + '</div>' +
          '<div class="text-[11.5px] text-slate-400">Weeks ' + m.weeks[0] + '–' + m.weeks[m.weeks.length - 1] + ' · ' + m.dayCount + ' days</div>' +
        '</div>' +
        '<span class="text-[11px] text-slate-400 num-pill hide-mobile">' + p.done + '/' + p.total + '</span>' +
        '<div class="w-20 sm:w-32 h-2 rounded-full progress-track overflow-hidden shrink-0">' +
          '<div class="h-full progress-fill rounded-full" data-month-bar="' + m.month + '" style="width:' + pct + '%"></div>' +
        '</div>' +
        '<svg class="chev shrink-0 w-5 h-5 text-slate-400 rotate-open" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>' +
      '</div>'
    );
  }

  function buildTree() {
    var html = MONTHS.map(function (m) {
      var weeksHTML = m.weeks.map(function (w) {
        var wd = WEEKS[w];
        var daysHTML = wd.days.map(dayRowHTML).join('');
        return (
          '<div class="week-block rounded-xl bg-black/15 border border-white/5" data-week-block="' + w + '">' +
            weekHeaderHTML(w, wd) +
            '<div class="accordion" data-week-acc="' + w + '"><div class="accordion-inner"><div class="px-3 sm:px-4 pb-3.5 flex flex-col gap-2">' + daysHTML + '</div></div></div>' +
          '</div>'
        );
      }).join('');

      return (
        '<section class="month-section glass-strong rounded-2xl overflow-hidden shadow-card" data-month-section="' + m.month + '">' +
          monthHeaderHTML(m) +
          '<div class="accordion" data-month-acc="' + m.month + '"><div class="accordion-inner"><div class="px-3 sm:px-4 pb-4 flex flex-col gap-3 border-t border-white/5 pt-3.5">' + weeksHTML + '</div></div></div>' +
        '</section>'
      );
    }).join('');
    root.innerHTML = html;
  }

  /* =========================================================
     ACCORDION STATE APPLICATION
  ========================================================= */
  function setAcc(el, open) {
    if (!el) return;
    el.classList.toggle('open', open);
    var chev = el.previousElementSibling ? el.previousElementSibling.querySelector('.chev') : null;
    if (chev) chev.classList.toggle('is-open', open);
  }

  function monthsWithMatches() {
    var s = new Set();
    DAYS.forEach(function (d) { if (dayVisible(d)) s.add(d.m); });
    return s;
  }
  function weeksWithMatches() {
    var s = new Set();
    DAYS.forEach(function (d) { if (dayVisible(d)) s.add(d.w); });
    return s;
  }

  function applyExpandState() {
    var active = filtersActive();
    var mMatches = active ? monthsWithMatches() : null;
    var wMatches = active ? weeksWithMatches() : null;

    MONTHS.forEach(function (m) {
      var open = active ? mMatches.has(m.month) : expandedMonths.has(m.month);
      setAcc(document.querySelector('[data-month-acc="' + m.month + '"]'), open);
    });
    Object.keys(WEEKS).forEach(function (w) {
      w = parseInt(w, 10);
      var open = active ? wMatches.has(w) : expandedWeeks.has(w);
      setAcc(document.querySelector('[data-week-acc="' + w + '"]'), open);
    });
  }

  /* =========================================================
     FILTER APPLICATION (show/hide day rows)
  ========================================================= */
  var noResultsEl = document.getElementById('noResults');
  var filterStatusEl = document.getElementById('filterStatus');

  function applyFilters() {
    var visibleCount = 0;
    DAYS.forEach(function (d) {
      var row = document.querySelector('.day-row[data-day="' + d.n + '"]');
      if (!row) return;
      var vis = dayVisible(d);
      row.classList.toggle('day-hidden', !vis);
      if (vis) visibleCount++;
    });

    // hide week blocks / month sections with zero visible children when filtering
    Object.keys(WEEKS).forEach(function (w) {
      var block = document.querySelector('.week-block[data-week-block="' + w + '"]');
      if (!block) return;
      var anyVisible = WEEKS[w].days.some(dayVisible);
      block.classList.toggle('day-hidden', filtersActive() && !anyVisible);
    });
    MONTHS.forEach(function (m) {
      var sec = document.querySelector('.month-section[data-month-section="' + m.month + '"]');
      if (!sec) return;
      var anyVisible = DAYS.some(function (d) { return d.m === m.month && dayVisible(d); });
      sec.classList.toggle('day-hidden', filtersActive() && !anyVisible);
    });

    applyExpandState();

    if (filtersActive()) {
      filterStatusEl.classList.remove('hidden');
      filterStatusEl.textContent = visibleCount + ' of 180 days match your filters';
      noResultsEl.classList.toggle('hidden', visibleCount !== 0);
    } else {
      filterStatusEl.classList.add('hidden');
      noResultsEl.classList.add('hidden');
    }
  }

  /* =========================================================
     PROGRESS UI
  ========================================================= */
  function updateProgressUI() {
    var op = overallProgress();
    var pct = Math.round((op.done / op.total) * 100);
    document.getElementById('statPercent').textContent = pct + '%';
    document.getElementById('progressBar').style.width = pct + '%';
    document.getElementById('statDone').textContent = op.done;
    document.getElementById('statStreak').textContent = currentStreak();
    document.getElementById('statHours').textContent = hoursLogged();
    document.getElementById('statPomo').textContent = pomoCount;

    MONTHS.forEach(function (m) {
      var p = monthProgress(m.month);
      var pc = p.total ? Math.round((p.done / p.total) * 100) : 0;
      var bar = document.querySelector('[data-month-bar="' + m.month + '"]');
      if (bar) bar.style.width = pc + '%';
    });
    Object.keys(WEEKS).forEach(function (w) {
      var p = weekProgress(parseInt(w, 10));
      var pc = p.total ? Math.round((p.done / p.total) * 100) : 0;
      var bar = document.querySelector('[data-week-bar="' + w + '"]');
      if (bar) bar.style.width = pc + '%';
    });

    renderMonthStrip();
  }

  /* =========================================================
     EVENT DELEGATION
  ========================================================= */
  root.addEventListener('click', function (e) {
    var launchBtn = e.target.closest('[data-launch-exercise]');
    if (launchBtn) {
      openExercise(parseInt(launchBtn.getAttribute('data-launch-day'), 10), launchBtn.getAttribute('data-launch-exercise'));
      return;
    }

    var monthToggle = e.target.closest('[data-month-toggle]');
    var weekToggle = e.target.closest('[data-week-toggle]');
    var dayToggle = e.target.closest('[data-day-toggle]');
    var noToggle = e.target.closest('[data-no-toggle]');

    if (noToggle) return; // clicking the checkbox label shouldn't toggle accordion

    if (monthToggle) {
      var mnum = parseInt(monthToggle.getAttribute('data-month-toggle'), 10);
      if (expandedMonths.has(mnum)) expandedMonths.delete(mnum); else expandedMonths.add(mnum);
      if (!filtersActive()) applyExpandState();
      return;
    }
    if (weekToggle) {
      var wnum = parseInt(weekToggle.getAttribute('data-week-toggle'), 10);
      if (expandedWeeks.has(wnum)) expandedWeeks.delete(wnum); else expandedWeeks.add(wnum);
      if (!filtersActive()) applyExpandState();
      return;
    }
    if (dayToggle) {
      var dnum = parseInt(dayToggle.getAttribute('data-day-toggle'), 10);
      var accEl = document.querySelector('[data-day-acc="' + dnum + '"]');
      if (!renderedDetail.has(dnum)) {
        var inner = document.querySelector('[data-day-inner="' + dnum + '"]');
        inner.innerHTML = buildDayDetailHTML(DAY_BY_N[dnum]);
        renderedDetail.add(dnum);
      }
      var isOpen = accEl.classList.contains('open');
      setAcc(accEl, !isOpen);
      return;
    }
  });

  root.addEventListener('change', function (e) {
    var chk = e.target.closest('[data-day-check]');
    if (!chk) return;
    var dnum = parseInt(chk.getAttribute('data-day-check'), 10);
    if (chk.checked) completed.add(dnum); else completed.delete(dnum);
    saveProgress();
    pushCompletedToDb();
    var row = chk.closest('.day-row');
    if (row) row.classList.toggle('opacity-70', chk.checked);
    updateProgressUI();
  });

  monthStripEl.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-jump-month]');
    if (!btn) return;
    var mnum = parseInt(btn.getAttribute('data-jump-month'), 10);
    expandedMonths.add(mnum);
    searchQuery = '';
    activeSkills.clear();
    document.getElementById('searchInput').value = '';
    updateChipVisuals();
    applyFilters();
    var sec = document.querySelector('.month-section[data-month-section="' + mnum + '"]');
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* =========================================================
     TOOLBAR: search, expand/collapse, reset
  ========================================================= */
  var searchInput = document.getElementById('searchInput');
  var btnClearSearch = document.getElementById('btnClearSearch');
  var searchDebounce = null;
  searchInput.addEventListener('input', function () {
    clearTimeout(searchDebounce);
    var val = searchInput.value;
    btnClearSearch.classList.toggle('hidden', !val);
    searchDebounce = setTimeout(function () {
      searchQuery = val.trim().toLowerCase();
      applyFilters();
    }, 150);
  });
  btnClearSearch.addEventListener('click', function () {
    searchInput.value = '';
    searchQuery = '';
    btnClearSearch.classList.add('hidden');
    applyFilters();
    searchInput.focus();
  });

  document.getElementById('btnExpandAll').addEventListener('click', function () {
    MONTHS.forEach(function (m) { expandedMonths.add(m.month); });
    Object.keys(WEEKS).forEach(function (w) { expandedWeeks.add(parseInt(w, 10)); });
    applyExpandState();
  });
  document.getElementById('btnCollapseAll').addEventListener('click', function () {
    expandedMonths = new Set();
    expandedWeeks = new Set();
    applyExpandState();
  });
  document.getElementById('btnClearAll').addEventListener('click', function () {
    searchInput.value = '';
    searchQuery = '';
    btnClearSearch.classList.add('hidden');
    activeSkills.clear();
    updateChipVisuals();
    applyFilters();
  });
  document.getElementById('btnReset').addEventListener('click', function () {
    var msg = dbDoc
      ? 'Reset all progress? This clears every checked day everywhere this plan is synced, on every device, and cannot be undone.'
      : 'Reset all progress? This clears every checked day on this device and cannot be undone.';
    if (!confirm(msg)) return;
    completed = new Set();
    saveProgress();
    pushCompletedToDb();
    document.querySelectorAll('[data-day-check]').forEach(function (c) { c.checked = false; });
    document.querySelectorAll('.day-row').forEach(function (r) { r.classList.remove('opacity-70'); });
    updateProgressUI();
  });

  /* =========================================================
     ABOUT MODAL
  ========================================================= */
  var aboutModal = document.getElementById('aboutModal');
  document.getElementById('btnAbout').addEventListener('click', function () { aboutModal.classList.remove('hidden'); });
  aboutModal.querySelectorAll('[data-close-about]').forEach(function (b) {
    b.addEventListener('click', function () { aboutModal.classList.add('hidden'); });
  });
  aboutModal.addEventListener('click', function (e) { if (e.target === aboutModal) aboutModal.classList.add('hidden'); });

  /* =========================================================
     AI GRADER SETTINGS (global entry point, header button)
     Configures the third-party AI used to review Speaking exercises.
     loadAiConfig/saveAiConfig are defined later in this file (Exercise
     Runner section) but are plain function declarations, so they're
     hoisted and callable from here.
  ========================================================= */
  var aiConfigModal = document.getElementById('aiConfigModal');
  function openAiConfigModal() {
    var cfg = loadAiConfig();
    document.getElementById('aiConfigEndpoint').value = cfg.endpoint || '';
    document.getElementById('aiConfigKey').value = cfg.apiKey || '';
    document.getElementById('aiConfigModel').value = cfg.model || '';
    document.getElementById('aiConfigSavedNote').classList.add('hidden');
    aiConfigModal.classList.remove('hidden');
  }
  document.getElementById('btnAiGrader').addEventListener('click', openAiConfigModal);
  aiConfigModal.querySelectorAll('[data-close-aiconfig]').forEach(function (b) {
    b.addEventListener('click', function () { aiConfigModal.classList.add('hidden'); });
  });
  aiConfigModal.addEventListener('click', function (e) { if (e.target === aiConfigModal) aiConfigModal.classList.add('hidden'); });
  document.getElementById('btnSaveAiConfigModal').addEventListener('click', function () {
    saveAiConfig({
      endpoint: document.getElementById('aiConfigEndpoint').value.trim(),
      apiKey: document.getElementById('aiConfigKey').value.trim(),
      model: document.getElementById('aiConfigModel').value.trim()
    });
    document.getElementById('aiConfigSavedNote').classList.remove('hidden');
    document.dispatchEvent(new CustomEvent('ai-config-saved'));
  });

  /* =========================================================
     POMODORO TIMER
  ========================================================= */
  var TIMER_MODES = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
  var TIMER_LABELS = { focus: 'Focus session', short: 'Short break', long: 'Long break' };
  var timerModal = document.getElementById('timerModal');
  var timerDisplay = document.getElementById('timerDisplay');
  var timerLabel = document.getElementById('timerLabel');
  var timerRing = document.getElementById('timerRing');
  var RING_CIRC = 2 * Math.PI * 88;

  var timerMode = 'focus';
  var remaining = TIMER_MODES.focus;
  var timerInterval = null;
  var isRunning = false;

  function fmtTime(sec) {
    var m = Math.floor(sec / 60), s = sec % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }
  function updateTimerUI() {
    timerDisplay.textContent = fmtTime(remaining);
    timerLabel.textContent = TIMER_LABELS[timerMode];
    var total = TIMER_MODES[timerMode];
    var frac = remaining / total;
    timerRing.setAttribute('stroke-dasharray', String(RING_CIRC));
    timerRing.setAttribute('stroke-dashoffset', String(RING_CIRC * (1 - frac)));
    document.querySelectorAll('.timer-mode-btn').forEach(function (b) {
      var active = b.getAttribute('data-mode') === timerMode;
      b.classList.toggle('shadow-glowEmerald', active);
      b.classList.toggle('text-white', active);
      b.classList.toggle('text-slate-400', !active);
    });
    document.getElementById('iconPlay').classList.toggle('hidden', isRunning);
    document.getElementById('iconPause').classList.toggle('hidden', !isRunning);
  }

  function beep() {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      var ctx = new Ctx();
      [0, 0.16, 0.32].forEach(function (t, i) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = i === 2 ? 1046.5 : 784;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + t);
        gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.28);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + 0.3);
      });
    } catch (e) {}
  }

  function tick() {
    remaining--;
    if (remaining <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      beep();
      if (timerMode === 'focus') { pomoCount++; savePomoCount(pomoCount); updateProgressUI(); }
      var next = timerMode === 'focus' ? 'short' : 'focus';
      setMode(next);
      updateTimerUI();
      return;
    }
    updateTimerUI();
  }

  function setMode(mode) {
    timerMode = mode;
    remaining = TIMER_MODES[mode];
    updateTimerUI();
  }

  document.querySelectorAll('.timer-mode-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      clearInterval(timerInterval);
      isRunning = false;
      setMode(b.getAttribute('data-mode'));
    });
  });
  document.getElementById('btnTimerToggle').addEventListener('click', function () {
    if (isRunning) {
      clearInterval(timerInterval);
      isRunning = false;
    } else {
      isRunning = true;
      timerInterval = setInterval(tick, 1000);
    }
    updateTimerUI();
  });
  document.getElementById('btnTimerReset').addEventListener('click', function () {
    clearInterval(timerInterval);
    isRunning = false;
    remaining = TIMER_MODES[timerMode];
    updateTimerUI();
  });
  document.getElementById('btnTimerSkip').addEventListener('click', function () {
    clearInterval(timerInterval);
    isRunning = false;
    var next = timerMode === 'focus' ? 'short' : 'focus';
    setMode(next);
  });
  document.getElementById('btnTimer').addEventListener('click', function () {
    timerModal.classList.remove('hidden');
  });
  timerModal.querySelectorAll('[data-close-timer]').forEach(function (b) {
    b.addEventListener('click', function () { timerModal.classList.add('hidden'); });
  });
  timerModal.addEventListener('click', function (e) { if (e.target === timerModal) timerModal.classList.add('hidden'); });

  /* =========================================================
     EXERCISE RUNNER
     Real, gradable practice content (Week 1 only, for now) that runs
     full-screen and locked: leaving full-screen, switching tabs, or
     switching windows resets the attempt. Listening audio is
     synthesised in the browser (no external audio files). Speaking
     review is done by a THIRD-PARTY AI service the user configures
     themselves (endpoint + API key, stored only in localStorage) —
     this app never calls Claude, or any AI, on its own.
  ========================================================= */
  var exerciseModal = document.getElementById('exerciseModal');
  var exerciseBody = document.getElementById('exerciseBody');
  var currentCtx = null;       // {dayNum, skill, exercise}
  var exerciseActive = false;  // true once the full-screen-locked attempt has begun
  var graceUntil = 0;          // Date.now() timestamp; ignore exit/blur signals until this passes
  var mediaStreams = [];       // live getUserMedia streams to tear down on close
  var activeIntervalId = null; // the Writing exercise's timer/stopwatch
  var speakingIntervalId = null; // the Speaking exercise's prep/record countdown
  var speakingCancelled = false; // guards Speaking's async callbacks after the modal closes
  var aiConfigSavedHandler = null; // active 'ai-config-saved' listener while the Speaking review screen is open
  var ttsToken = 0; // bumped on every stop/replay so an in-flight speakSegments chain can detect it's stale

  function grace(ms) { graceUntil = Date.now() + (ms || 900); }
  function inGrace() { return Date.now() < graceUntil; }

  function isFS() { return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement); }
  function requestFS() {
    var el = exerciseModal;
    var fn = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (!fn) return Promise.reject(new Error('unsupported'));
    return fn.call(el);
  }
  function exitFSIfAny() {
    if (!isFS()) return;
    var fn = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
    if (fn) { try { fn.call(document); } catch (e) {} }
  }

  function skillLabel(k) { return { listening: 'Listening', reading: 'Reading', writing: 'Writing', speaking: 'Speaking' }[k] || k; }

  function clearActiveInterval() { if (activeIntervalId) { clearInterval(activeIntervalId); activeIntervalId = null; } }
  function clearSpeakingInterval() { if (speakingIntervalId) { clearInterval(speakingIntervalId); speakingIntervalId = null; } }

  function stopAllMedia() {
    speakingCancelled = true;
    ttsToken++; // invalidate any in-flight speakSegments chain (see note below on why this is needed)
    clearActiveInterval();
    clearSpeakingInterval();
    mediaStreams.forEach(function (s) { try { s.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {} });
    mediaStreams = [];
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
    if (aiConfigSavedHandler) { document.removeEventListener('ai-config-saved', aiConfigSavedHandler); aiConfigSavedHandler = null; }
  }

  function openExercise(dayNum, skill) {
    var day = DAY_BY_N[dayNum];
    var ex = day && day.exercise && day.exercise[skill];
    if (!ex) return;
    currentCtx = { dayNum: dayNum, skill: skill, exercise: ex };
    exerciseModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    renderGate();
  }

  function closeExercise() {
    exerciseActive = false;
    stopAllMedia();
    exitFSIfAny();
    exerciseModal.classList.add('hidden');
    document.body.style.overflow = '';
    currentCtx = null;
  }

  function renderGate() {
    var ctx = currentCtx;
    exerciseBody.innerHTML =
      '<div class="max-w-lg mx-auto text-center py-16 px-4">' +
        '<div class="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-brand-amber/20 to-brand-rose/10 border border-brand-amber/30 grid place-items-center text-2xl mb-4">🔒</div>' +
        '<div class="text-[11px] uppercase tracking-wide text-brand-amber font-semibold mb-2">Proctored Practice</div>' +
        '<div class="font-display font-bold text-xl mb-3">' + esc(skillLabel(ctx.skill)) + ' Exercise — Day ' + ctx.dayNum + '</div>' +
        '<p class="text-slate-400 text-[13px] leading-relaxed mb-6">This exercise runs in full-screen so you can practise without distraction. If you exit full-screen, switch tabs, or switch windows before you finish, your attempt will be reset — make sure you have a few uninterrupted minutes.' +
          (ctx.skill === 'speaking' ? ' You’ll also be asked for microphone access.' : '') + '</p>' +
        '<button id="btnStartEx" type="button" class="focus-ring px-6 py-3 rounded-xl btn-primary font-semibold text-[13.5px] shadow-glowEmerald">Enter Full-Screen &amp; Start</button>' +
        '<div class="mt-4"><button data-close-exercise type="button" class="text-[12px] text-slate-500 hover:text-slate-300">Cancel</button></div>' +
      '</div>';
    document.getElementById('btnStartEx').addEventListener('click', function () {
      grace(1000);
      requestFS().catch(function () {}).then(function () {
        exerciseActive = true;
        grace(700);
        renderExercise();
      });
    });
  }

  function renderCheatScreen() {
    stopAllMedia();
    exitFSIfAny();
    exerciseBody.innerHTML =
      '<div class="max-w-lg mx-auto text-center py-16 px-4">' +
        '<div class="w-14 h-14 mx-auto rounded-2xl bg-brand-rose/15 border border-brand-rose/30 grid place-items-center text-2xl mb-4">🚫</div>' +
        '<div class="font-display font-bold text-xl mb-2 text-brand-rose">Attempt reset</div>' +
        '<p class="text-slate-400 text-[13px] leading-relaxed mb-6">Looks like you left full-screen, or switched tabs or windows, during the exercise — were you trying to cheat? To keep practice honest, this attempt has been cleared. Stay in full-screen and on this tab until you submit.</p>' +
        '<button id="btnRetryEx" type="button" class="focus-ring px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-100 font-semibold text-[13px]">Try Again</button>' +
        '<div class="mt-4"><button data-close-exercise type="button" class="text-[12px] text-slate-500 hover:text-slate-300">Close</button></div>' +
      '</div>';
    document.getElementById('btnRetryEx').addEventListener('click', renderGate);
  }

  function onPotentialCheat() {
    if (!exerciseActive || inGrace()) return;
    exerciseActive = false;
    renderCheatScreen();
  }

  document.addEventListener('fullscreenchange', function () { if (!isFS()) onPotentialCheat(); });
  document.addEventListener('webkitfullscreenchange', function () { if (!isFS()) onPotentialCheat(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) onPotentialCheat(); });
  window.addEventListener('blur', function () { onPotentialCheat(); });

  exerciseModal.addEventListener('click', function (e) {
    if (e.target.closest('[data-close-exercise]')) closeExercise();
  });
  exerciseBody.addEventListener('click', function (e) {
    if (e.target.closest('[data-finish-exercise]')) {
      if (currentCtx) {
        completed.add(currentCtx.dayNum);
        saveProgress();
        pushCompletedToDb();
        refreshAllCheckboxes();
        updateProgressUI();
      }
      closeExercise();
    }
  });

  function exHeaderHTML(ctx) {
    return (
      '<div class="flex items-center justify-between py-3.5 border-b border-white/10 mb-5">' +
        '<div>' +
          '<div class="text-[10.5px] uppercase tracking-wide text-slate-500">' + esc(skillLabel(ctx.skill)) + ' · Day ' + ctx.dayNum + '</div>' +
          '<div class="font-display font-bold text-[15px] sm:text-base">' + esc(ctx.exercise.title || ctx.exercise.taskType || (skillLabel(ctx.skill) + ' Practice')) + '</div>' +
        '</div>' +
        '<button data-close-exercise type="button" class="focus-ring shrink-0 w-9 h-9 rounded-lg hover:bg-white/10 grid place-items-center text-slate-400 hover:text-white text-lg" title="Exit (resets this attempt)">✕</button>' +
      '</div>'
    );
  }
  function completionFooterHTML(extraLabel) {
    return (
      '<div class="mt-6 rounded-xl bg-brand-emerald/10 border border-brand-emerald/30 px-4 py-3.5 flex items-center justify-between gap-3 flex-wrap">' +
        '<div class="text-[12.5px] text-slate-200">' + (extraLabel || 'Nice work — you can mark today’s day complete from here.') + '</div>' +
        '<button data-finish-exercise type="button" class="focus-ring shrink-0 px-4 py-2 rounded-lg btn-primary text-[12.5px] font-semibold">Mark Day ' + (currentCtx ? currentCtx.dayNum : '') + ' Complete &amp; Close</button>' +
      '</div>'
    );
  }

  function renderExercise() {
    var ctx = currentCtx;
    if (ctx.skill === 'listening') renderListening(ctx);
    else if (ctx.skill === 'reading') renderReading(ctx);
    else if (ctx.skill === 'writing') renderWriting(ctx);
    else if (ctx.skill === 'speaking') renderSpeaking(ctx);
  }

  /* ---------- shared question rendering (Listening + Reading) ---------- */
  function normalizeQuestion(q) {
    if (q.type === 'tfng') {
      var opts = ['True', 'False', 'Not Given'];
      return { id: q.id, type: 'mcq', prompt: q.prompt, options: opts, answerIndex: opts.indexOf(q.answer) };
    }
    return q;
  }
  function normalizeAnswerText(s) {
    return String(s || '').toLowerCase().trim().replace(/[.,!?;:'"()]/g, '').replace(/\s+/g, ' ');
  }
  function gapIsCorrect(q, given) {
    var norm = normalizeAnswerText(given);
    if (!norm) return false;
    var cands = [q.answer].concat(q.altAnswers || []).map(normalizeAnswerText);
    return cands.indexOf(norm) !== -1;
  }
  function renderQuestionsHTML(questions) {
    return questions.map(normalizeQuestion).map(function (q) {
      if (q.type === 'gap') {
        return (
          '<div class="mb-3.5">' +
            '<label class="block text-[12.5px] text-slate-300 mb-1.5">' + esc(q.prompt) + '</label>' +
            '<input type="text" data-ex-answer="' + q.id + '" autocomplete="off" spellcheck="false" ' +
              'class="focus-ring w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-[13px] text-slate-100" />' +
            '<div data-ex-feedback="' + q.id + '" class="mt-1 text-[11.5px]"></div>' +
          '</div>'
        );
      }
      var opts = q.options.map(function (opt, i) {
        return (
          '<label class="flex items-center gap-2 py-1 text-[12.5px] text-slate-300 cursor-pointer">' +
            '<input type="radio" name="mcq-' + q.id + '" value="' + i + '" data-ex-answer="' + q.id + '" class="accent-emerald-400" />' +
            '<span>' + esc(opt) + '</span>' +
          '</label>'
        );
      }).join('');
      return (
        '<div class="mb-3.5">' +
          '<div class="text-[12.5px] text-slate-300 mb-1.5">' + esc(q.prompt) + '</div>' +
          '<div class="flex flex-col gap-0.5">' + opts + '</div>' +
          '<div data-ex-feedback="' + q.id + '" class="mt-1 text-[11.5px]"></div>' +
        '</div>'
      );
    }).join('');
  }
  function gradeQuestions(questions) {
    var norm = questions.map(normalizeQuestion);
    var correct = 0;
    norm.forEach(function (q) {
      var isCorrect, correctText;
      if (q.type === 'gap') {
        var el = exerciseBody.querySelector('[data-ex-answer="' + q.id + '"]');
        isCorrect = gapIsCorrect(q, el ? el.value : '');
        correctText = q.answer;
      } else {
        var checked = exerciseBody.querySelector('[data-ex-answer="' + q.id + '"]:checked');
        var given = checked ? parseInt(checked.value, 10) : null;
        isCorrect = given === q.answerIndex;
        correctText = q.options[q.answerIndex];
      }
      if (isCorrect) correct++;
      var fb = exerciseBody.querySelector('[data-ex-feedback="' + q.id + '"]');
      if (fb) {
        fb.innerHTML = isCorrect
          ? '<span class="text-brand-emerald">✓ Correct</span>'
          : '<span class="text-brand-rose">✗ Correct answer: ' + esc(correctText) + '</span>';
      }
    });
    return { correct: correct, total: norm.length };
  }

  /* ---------- Text-to-speech (Listening audio) ---------- */
  function primeVoices() {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = function () {};
  }
  function pickVoice(hint) {
    if (!('speechSynthesis' in window)) return null;
    var voices = window.speechSynthesis.getVoices() || [];
    var exact = voices.filter(function (v) { return v.lang === hint; });
    if (exact.length) return exact[0];
    var lang = voices.filter(function (v) { return v.lang && v.lang.indexOf('en') === 0; });
    return lang.length ? lang[0] : null;
  }
  function speakSegments(segments, hint, onDone) {
    if (!('speechSynthesis' in window)) { onDone && onDone(); return; }
    window.speechSynthesis.cancel();
    // Note: calling cancel() above interrupts whatever utterance is currently
    // speaking, which fires that utterance's onerror (not onend) in most
    // browsers. Since onerror is also wired to next(), a naive chain would
    // treat "interrupted" the same as "finished" and immediately speak the
    // NEXT segment — so closing the exercise mid-playback used to just skip
    // ahead instead of stopping, and the recording would keep talking after
    // the modal was gone. myToken/ttsToken fixes this: every call here (and
    // every stopAllMedia()) bumps the shared counter, so a chain started
    // before the bump can recognise it's stale and stop instead of queuing
    // the next segment.
    var myToken = ++ttsToken;
    var i = 0;
    function next() {
      if (myToken !== ttsToken) return; // superseded by a stop/replay — do not speak any more
      if (i >= segments.length) { onDone && onDone(); return; }
      var seg = segments[i++];
      var u = new SpeechSynthesisUtterance(seg.text);
      u.lang = hint || 'en-GB';
      u.rate = 0.98;
      var v = pickVoice(u.lang);
      if (v) u.voice = v;
      u.onend = next;
      u.onerror = next;
      window.speechSynthesis.speak(u);
    }
    next();
  }

  /* ---------- Listening ---------- */
  function renderListening(ctx) {
    var ex = ctx.exercise;
    exerciseBody.innerHTML =
      exHeaderHTML(ctx) +
      '<p class="text-[13px] text-slate-300 leading-relaxed mb-4">' + esc(ex.instructions) + '</p>' +
      '<div class="rounded-xl bg-black/25 border border-white/10 px-4 py-3.5 mb-5 flex items-center gap-3">' +
        '<button id="btnPlayAudio" type="button" class="focus-ring shrink-0 w-11 h-11 rounded-full btn-primary grid place-items-center shadow-glowEmerald">' +
          '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>' +
        '</button>' +
        '<div class="text-[12.5px] text-slate-400" id="audioStatus">Press play to hear the recording. The voice is synthesised in your browser.</div>' +
      '</div>' +
      (ex.predictionMode ? '<div class="text-[11.5px] text-brand-amber/90 mb-3">Fill in your predicted answers first, then press play — predictions aren’t graded, only your final answers after listening are.</div>' : '') +
      (ex.formTitle ? '<div class="font-display font-semibold text-[13.5px] mb-2.5">' + esc(ex.formTitle) + '</div>' : '') +
      '<div>' + renderQuestionsHTML(ex.questions) + '</div>' +
      '<button id="btnGradeListening" type="button" class="focus-ring mt-2 px-5 py-2.5 rounded-xl btn-primary font-semibold text-[13px]">Submit Answers</button>' +
      '<div id="listeningResult" class="mt-4"></div>';

    document.getElementById('btnPlayAudio').addEventListener('click', function (e) {
      var btn = e.currentTarget;
      btn.disabled = true;
      document.getElementById('audioStatus').textContent = 'Playing…';
      speakSegments(ex.segments, ex.voiceHint, function () {
        btn.disabled = false;
        document.getElementById('audioStatus').textContent = 'Finished. Press play again to replay.';
      });
    });
    document.getElementById('btnGradeListening').addEventListener('click', function () {
      var res = gradeQuestions(ex.questions);
      document.getElementById('listeningResult').innerHTML =
        '<div class="rounded-xl bg-black/25 border border-white/10 px-4 py-3.5 mb-3">' +
          '<span class="font-display font-bold text-lg">' + res.correct + '/' + res.total + '</span> <span class="text-slate-400 text-[12.5px]">correct</span>' +
        '</div>' + completionFooterHTML();
    });
  }

  /* ---------- Reading ---------- */
  function renderReading(ctx) {
    var ex = ctx.exercise;
    var passageHTML = ex.passage.map(function (p) {
      return '<p class="text-[13px] text-slate-300 leading-relaxed mb-3 whitespace-pre-line">' + esc(p) + '</p>';
    }).join('');

    if (ex.questions && ex.questions.length) {
      exerciseBody.innerHTML =
        exHeaderHTML(ctx) +
        (ex.instructions ? '<p class="text-[12.5px] text-brand-amber/90 mb-3">' + esc(ex.instructions) + '</p>' : '') +
        '<div class="font-display font-semibold text-[14px] mb-2">' + esc(ex.title) + '</div>' +
        '<div class="rounded-xl bg-black/20 border border-white/10 px-4 py-3.5 mb-5">' + passageHTML + '</div>' +
        '<div>' + renderQuestionsHTML(ex.questions) + '</div>' +
        '<button id="btnGradeReading" type="button" class="focus-ring mt-2 px-5 py-2.5 rounded-xl btn-primary font-semibold text-[13px]">Submit Answers</button>' +
        '<div id="readingResult" class="mt-4"></div>';
      document.getElementById('btnGradeReading').addEventListener('click', function () {
        var res = gradeQuestions(ex.questions);
        document.getElementById('readingResult').innerHTML =
          '<div class="rounded-xl bg-black/25 border border-white/10 px-4 py-3.5 mb-3">' +
            '<span class="font-display font-bold text-lg">' + res.correct + '/' + res.total + '</span> <span class="text-slate-400 text-[12.5px]">correct</span>' +
          '</div>' + completionFooterHTML();
      });
      return;
    }

    // Skim + self-summary mode (no auto-graded questions — e.g. Day 4)
    var paras = ex.passage.map(function (p, i) {
      var summary = (ex.modelSummaries && ex.modelSummaries[i]) || '';
      return (
        '<div class="rounded-xl bg-black/20 border border-white/10 px-4 py-3.5 mb-3.5">' +
          '<div class="text-[10.5px] uppercase tracking-wide text-slate-500 mb-1.5">Paragraph ' + (i + 1) + '</div>' +
          '<p class="text-[13px] text-slate-300 leading-relaxed mb-3">' + esc(p) + '</p>' +
          '<label class="block text-[11.5px] text-slate-400 mb-1">Your one-sentence summary:</label>' +
          '<input type="text" class="focus-ring w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-[13px] text-slate-100 mb-2" />' +
          (summary ? '<button data-reveal-summary="' + i + '" type="button" class="text-[11.5px] text-brand-sky hover:underline">Show model summary</button>' +
            '<div data-summary-model="' + i + '" class="hidden mt-1.5 text-[12px] text-slate-400 italic">' + esc(summary) + '</div>' : '') +
        '</div>'
      );
    }).join('');
    exerciseBody.innerHTML =
      exHeaderHTML(ctx) +
      '<p class="text-[12.5px] text-brand-amber/90 mb-4">' + esc(ex.instructions) + '</p>' +
      paras +
      completionFooterHTML('When you’ve summarised every paragraph, mark the day complete.');
    exerciseBody.querySelectorAll('[data-reveal-summary]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = btn.getAttribute('data-reveal-summary');
        exerciseBody.querySelector('[data-summary-model="' + i + '"]').classList.remove('hidden');
      });
    });
  }

  /* ---------- Writing ---------- */
  function renderChartHTML(chart) {
    if (!chart) return '';
    if (chart.type === 'pie') {
      var total = chart.data.reduce(function (s, d) { return s + d.value; }, 0);
      var acc = 0;
      var stops = chart.data.map(function (d) {
        var start = (acc / total) * 360; acc += d.value;
        var end = (acc / total) * 360;
        return d.color + ' ' + start.toFixed(1) + 'deg ' + end.toFixed(1) + 'deg';
      }).join(', ');
      var legend = chart.data.map(function (d) {
        return '<div class="flex items-center gap-1.5 text-[11.5px] text-slate-400"><span class="w-2.5 h-2.5 rounded-sm shrink-0" style="background:' + d.color + '"></span>' + esc(d.label) + ' — ' + d.value + '%</div>';
      }).join('');
      return (
        '<div class="flex flex-col sm:flex-row items-center gap-5 mb-5 rounded-xl bg-black/20 border border-white/10 px-4 py-4">' +
          '<div class="w-32 h-32 rounded-full shrink-0" style="background: conic-gradient(' + stops + ')"></div>' +
          '<div class="flex flex-col gap-1">' + legend + '</div>' +
        '</div>'
      );
    }
    if (chart.type === 'bar') {
      var max = Math.max.apply(null, chart.data.map(function (d) { return d.value; }));
      var bars = chart.data.map(function (d) {
        var h = Math.round((d.value / max) * 100);
        return (
          '<div class="flex flex-col items-center gap-1.5 flex-1">' +
            '<div class="text-[11px] text-slate-300 num-pill">' + d.value + '%</div>' +
            '<div class="w-full ex-bar-track rounded-t-md flex items-end" style="height:120px">' +
              '<div class="w-full ex-bar-fill rounded-t-md" style="height:' + h + '%;background:' + d.color + '"></div>' +
            '</div>' +
            '<div class="text-[10.5px] text-slate-500 text-center">' + esc(d.label) + '</div>' +
          '</div>'
        );
      }).join('');
      return '<div class="flex items-end gap-3 mb-5 rounded-xl bg-black/20 border border-white/10 px-4 py-4">' + bars + '</div>';
    }
    return '';
  }
  function fmtMMSS(sec) {
    sec = Math.max(0, sec);
    var m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }
  function startCountdown(el, totalSeconds) {
    clearActiveInterval();
    var remaining = totalSeconds;
    el.textContent = fmtMMSS(remaining) + ' remaining';
    activeIntervalId = setInterval(function () {
      remaining--;
      el.textContent = remaining >= 0 ? fmtMMSS(remaining) + ' remaining' : 'Time’s up';
      if (remaining <= 0) clearActiveInterval();
    }, 1000);
  }
  function startStopwatch(el) {
    clearActiveInterval();
    var elapsed = 0;
    el.textContent = '00:00 elapsed (untimed)';
    activeIntervalId = setInterval(function () {
      elapsed++;
      el.textContent = fmtMMSS(elapsed) + ' elapsed (untimed)';
    }, 1000);
  }

  function renderWriting(ctx) {
    var ex = ctx.exercise;
    var promptsHTML;
    if (ex.extraPrompts) {
      promptsHTML = ex.extraPrompts.map(function (p, i) {
        return (
          '<div class="mb-5">' +
            '<div class="text-[12.5px] text-slate-300 leading-relaxed mb-2 rounded-lg bg-black/20 border border-white/10 px-3.5 py-3">' + esc(p) + '</div>' +
            '<textarea data-writing-input="' + i + '" rows="3" class="focus-ring w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2.5 text-[13px] text-slate-100 leading-relaxed" placeholder="Your overview paragraph…"></textarea>' +
          '</div>'
        );
      }).join('');
    } else {
      promptsHTML =
        renderChartHTML(ex.chart) +
        '<textarea id="writingMain" rows="12" class="focus-ring w-full rounded-lg bg-black/30 border border-white/10 px-3.5 py-3 text-[13.5px] text-slate-100 leading-relaxed" placeholder="Write your response here…"></textarea>' +
        '<div class="mt-1.5 text-[11.5px]" id="wordCount">0 words' + (ex.minWords ? ' / ' + ex.minWords + ' min' : '') + '</div>';
    }

    var checklistHTML = ex.checklist.map(function (c) {
      return (
        '<label class="flex items-start gap-2 py-1 text-[12px] text-slate-300 cursor-pointer">' +
          '<input type="checkbox" class="mt-0.5 accent-emerald-400" />' +
          '<span>' + esc(c) + '</span>' +
        '</label>'
      );
    }).join('');

    exerciseBody.innerHTML =
      exHeaderHTML(ctx) +
      '<div class="text-[10.5px] uppercase tracking-wide text-brand-amber font-semibold mb-1.5">' + esc(ex.taskType) + '</div>' +
      '<p class="text-[13px] text-slate-300 leading-relaxed mb-1">' + esc(ex.prompt) + '</p>' +
      '<div class="text-right text-[11.5px] text-slate-500 num-pill mb-4" id="writingTimer"></div>' +
      promptsHTML +
      '<div class="mt-5">' +
        '<div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Self-Assessment Checklist</div>' +
        checklistHTML +
      '</div>' +
      '<div class="mt-4"><button id="btnRevealModel" type="button" class="focus-ring text-[12px] text-brand-sky hover:underline">Reveal model answer</button></div>' +
      '<div id="modelAnswerBox" class="hidden mt-3 rounded-xl bg-black/20 border border-white/10 px-4 py-3.5 text-[12.5px] text-slate-400 leading-relaxed whitespace-pre-line"></div>' +
      completionFooterHTML();

    document.getElementById('btnRevealModel').addEventListener('click', function () {
      var box = document.getElementById('modelAnswerBox');
      box.textContent = ex.modelAnswer;
      box.classList.remove('hidden');
    });

    if (!ex.extraPrompts) {
      var textarea = document.getElementById('writingMain');
      var wc = document.getElementById('wordCount');
      textarea.addEventListener('input', function () {
        var n = textarea.value.trim() ? textarea.value.trim().split(/\s+/).length : 0;
        wc.textContent = n + ' words' + (ex.minWords ? ' / ' + ex.minWords + ' min' : '');
        wc.className = ex.minWords && n < ex.minWords ? 'text-brand-amber' : 'text-brand-emerald';
      });
    }

    var timerEl = document.getElementById('writingTimer');
    if (ex.timeLimitMinutes) startCountdown(timerEl, ex.timeLimitMinutes * 60);
    else startStopwatch(timerEl);
  }

  /* ---------- Speaking ---------- */
  var AI_CONFIG_KEY = 'ielts-roadmap-ai-grader-v1';
  function loadAiConfig() {
    try { return JSON.parse(localStorage.getItem(AI_CONFIG_KEY) || 'null') || {}; } catch (e) { return {}; }
  }
  function saveAiConfig(cfg) {
    try { localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(cfg)); } catch (e) {}
  }

  function renderSpeaking(ctx) {
    var ex = ctx.exercise;
    var idx = 0;
    var records = [];
    speakingCancelled = false;

    function renderItem() {
      var item = ex.items[idx];
      exerciseBody.innerHTML =
        exHeaderHTML(ctx) +
        '<p class="text-[12.5px] text-slate-400 mb-4">' + esc(ex.instructions) + '</p>' +
        '<div class="text-[11px] text-slate-500 mb-1.5">Question ' + (idx + 1) + ' of ' + ex.items.length + '</div>' +
        '<div class="rounded-xl bg-black/20 border border-white/10 px-4 py-4 mb-5">' +
          '<div class="font-display font-semibold text-[15px] text-slate-100">' + esc(item.prompt) + '</div>' +
        '</div>' +
        '<div id="speakStage" class="rounded-xl bg-black/25 border border-white/10 px-4 py-6 text-center">' +
          '<button id="btnBeginItem" type="button" class="focus-ring px-5 py-2.5 rounded-xl btn-primary font-semibold text-[13px]">Get Ready (' + item.prepSeconds + 's) &amp; Record</button>' +
        '</div>' +
        '<div id="itemResult" class="mt-4"></div>';
      document.getElementById('btnBeginItem').addEventListener('click', function () { beginPrep(item); });
    }

    function beginPrep(item) {
      var stage = document.getElementById('speakStage');
      var remaining = item.prepSeconds;
      stage.innerHTML = '<div class="text-[12px] text-slate-400 mb-2">Get ready…</div><div class="font-display font-extrabold text-3xl num-pill">' + remaining + '</div>';
      clearSpeakingInterval();
      speakingIntervalId = setInterval(function () {
        if (speakingCancelled) { clearSpeakingInterval(); return; }
        remaining--;
        if (remaining <= 0) { clearSpeakingInterval(); beginRecording(item); return; }
        var d = stage.querySelector('.font-display'); if (d) d.textContent = remaining;
      }, 1000);
    }

    function beginRecording(item) {
      var stage = document.getElementById('speakStage');
      grace(1500); // the mic-permission prompt can blur the window
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        if (speakingCancelled) { try { stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {} return; }
        mediaStreams.push(stream);
        var chunks = [];
        var mr = null;
        try { mr = new MediaRecorder(stream); } catch (e) { mr = null; }
        var transcriptParts = [];
        var recognition = null;
        var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SR) {
          recognition = new SR();
          recognition.lang = 'en-US';
          recognition.continuous = true;
          recognition.interimResults = false;
          recognition.onresult = function (e) {
            for (var i = e.resultIndex; i < e.results.length; i++) {
              if (e.results[i].isFinal) transcriptParts.push(e.results[i][0].transcript);
            }
          };
          try { recognition.start(); } catch (e) {}
        }
        var remaining = item.speakSeconds;
        stage.innerHTML =
          '<div class="flex items-center justify-center gap-2 mb-2 text-brand-rose"><span class="w-2.5 h-2.5 rounded-full bg-brand-rose rec-pulse"></span><span class="text-[12px] font-semibold">Recording</span></div>' +
          '<div class="font-display font-extrabold text-3xl num-pill">' + remaining + '</div>' +
          '<button id="btnStopEarly" type="button" class="focus-ring mt-3 text-[11.5px] text-slate-400 hover:text-slate-200 underline">Stop early</button>';

        if (mr) { mr.ondataavailable = function (e) { if (e.data.size) chunks.push(e.data); }; mr.start(); }

        function finish() {
          if (speakingCancelled) return;
          clearSpeakingInterval();
          if (mr && mr.state !== 'inactive') mr.stop();
          if (recognition) { try { recognition.stop(); } catch (e) {} }
          try { stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
          if (mr) {
            setTimeout(function () {
              if (speakingCancelled) return;
              try {
                var blob = new Blob(chunks, { type: 'audio/webm' });
                var blobUrl = URL.createObjectURL(blob);
                records[idx] = { blobUrl: blobUrl, transcript: transcriptParts.join(' ') };
                showItemDone(blobUrl, transcriptParts.join(' '));
              } catch (e) { showItemDone(null, transcriptParts.join(' ')); }
            }, 250);
          } else {
            records[idx] = { blobUrl: null, transcript: transcriptParts.join(' ') };
            showItemDone(null, transcriptParts.join(' '));
          }
        }

        clearSpeakingInterval();
        speakingIntervalId = setInterval(function () {
          if (speakingCancelled) { clearSpeakingInterval(); return; }
          remaining--;
          var d = document.querySelector('#speakStage .font-display');
          if (d) d.textContent = Math.max(0, remaining);
          if (remaining <= 0) finish();
        }, 1000);

        document.getElementById('btnStopEarly').addEventListener('click', finish);
      }).catch(function () {
        if (speakingCancelled) return;
        stage.innerHTML = '<div class="text-[12.5px] text-brand-rose">Microphone access was denied or unavailable — you can still continue, but this response won’t be recorded.</div>' +
          '<button id="btnSkipItem" type="button" class="focus-ring mt-3 px-4 py-2 rounded-lg bg-white/10 text-[12.5px]">Continue</button>';
        document.getElementById('btnSkipItem').addEventListener('click', function () { showItemDone(null, ''); });
      });
    }

    function showItemDone(blobUrl, transcript) {
      var isLast = idx === ex.items.length - 1;
      var playerHTML = blobUrl ? '<audio controls src="' + blobUrl + '" class="w-full mt-3"></audio>' : '';
      var transcriptHTML = transcript
        ? '<div class="mt-3 text-[12px] text-slate-400"><span class="text-slate-500">Auto transcript:</span> <span class="italic">' + esc(transcript) + '</span></div>'
        : '<div class="mt-3 text-[11.5px] text-slate-500">No automatic transcript available in this browser.</div>';
      document.getElementById('itemResult').innerHTML =
        '<div class="rounded-xl bg-black/20 border border-white/10 px-4 py-3.5">' +
          '<div class="text-brand-emerald text-[12.5px] font-semibold mb-1">Recorded ✓</div>' +
          playerHTML + transcriptHTML +
        '</div>' +
        '<button id="btnNextItem" type="button" class="focus-ring mt-3 px-5 py-2.5 rounded-xl btn-primary font-semibold text-[13px]">' +
          (isLast ? 'Continue' : 'Next Question') + '</button>';
      document.getElementById('btnNextItem').addEventListener('click', function () {
        if (isLast) renderReview(); else { idx++; renderItem(); }
      });
    }

    function renderReview() {
      var reflectionHTML = ex.reflectionPrompt
        ? '<label class="block text-[12px] text-slate-400 mb-1.5 mt-4">' + esc(ex.reflectionPrompt) + '</label>' +
          '<textarea rows="3" class="focus-ring w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-[13px] text-slate-100"></textarea>'
        : '';
      var cfg = loadAiConfig();
      var configured = !!(cfg.endpoint && cfg.apiKey);
      exerciseBody.innerHTML =
        exHeaderHTML(ctx) +
        '<div class="text-[13px] text-slate-300 mb-2">All ' + ex.items.length + ' response(s) recorded.</div>' +
        reflectionHTML +
        '<div class="mt-5 rounded-xl bg-gradient-to-br from-brand-indigo/10 to-transparent border border-brand-indigo/25 px-4 py-4">' +
          '<div class="flex items-center justify-between gap-2 mb-2">' +
            '<div class="text-[11px] font-semibold uppercase tracking-wide text-brand-indigo">AI Speaking Review</div>' +
            '<button id="btnAiSettings" type="button" class="text-[11px] text-slate-400 hover:text-slate-200 underline">' + (configured ? 'Change AI settings' : 'Set up AI grader') + '</button>' +
          '</div>' +
          (configured
            ? '<button id="btnGetAiFeedback" type="button" class="focus-ring px-4 py-2.5 rounded-lg btn-primary font-semibold text-[12.5px]">Get AI Feedback</button>'
            : '<div class="text-[12px] text-slate-500">Not configured yet. This uses a third-party AI service of your choice (NOT Claude) — click “Set up AI grader” and enter its API endpoint, key and model.</div>') +
          '<div id="aiFeedbackBox" class="mt-3"></div>' +
        '</div>' +
        completionFooterHTML();

      document.getElementById('btnAiSettings').addEventListener('click', openAiConfigModal);
      if (aiConfigSavedHandler) document.removeEventListener('ai-config-saved', aiConfigSavedHandler);
      aiConfigSavedHandler = function () { renderReview(); };
      document.addEventListener('ai-config-saved', aiConfigSavedHandler);

      var btnGet = document.getElementById('btnGetAiFeedback');
      if (btnGet) {
        btnGet.addEventListener('click', function () {
          btnGet.disabled = true;
          btnGet.textContent = 'Requesting feedback…';
          var box = document.getElementById('aiFeedbackBox');
          box.innerHTML = '';
          requestAiFeedback(ex, records).then(function (text) {
            box.innerHTML = '<div class="rounded-xl bg-black/25 border border-white/10 px-4 py-3.5 text-[12.5px] text-slate-200 leading-relaxed whitespace-pre-line">' + esc(text) + '</div>';
          }).catch(function (err) {
            box.innerHTML = '<div class="text-[12px] text-brand-rose">Could not get feedback: ' + esc(err && err.message ? err.message : String(err)) + '</div>';
          }).then(function () {
            btnGet.disabled = false;
            btnGet.textContent = 'Get AI Feedback';
          });
        });
      }
    }

    renderItem();
  }

  function requestAiFeedback(ex, records) {
    var cfg = loadAiConfig();
    var transcripts = ex.items.map(function (item, i) {
      var r = records[i] || {};
      return 'Q' + (i + 1) + ': "' + item.prompt + '"\nAnswer transcript: ' + (r.transcript || '(no transcript captured — audio only)');
    }).join('\n\n');
    var systemPrompt = 'You are an IELTS Speaking examiner. Score the candidate’s answers using the four official IELTS Speaking band criteria (Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation — the last only if evidence allows). Give an estimated overall band (1-9, may use .5), one line per criterion with a short justification, and 2-3 concrete improvement tips. Be concise.';
    var body = {
      model: cfg.model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'IELTS Speaking Part ' + ex.part + ' practice.\n\n' + transcripts }
      ]
    };
    return fetch(cfg.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + cfg.apiKey },
      body: JSON.stringify(body)
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (data) {
      var text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (!text) throw new Error('Unexpected response shape from the AI endpoint');
      return text;
    });
  }

  /* =========================================================
     INIT
  ========================================================= */
  function init() {
    renderMonthStrip();
    buildChips();
    buildTree();
    applyExpandState();
    updateProgressUI();
    updateTimerUI();
    primeVoices();
    setSyncStatus('connecting');
    initDbSync();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
