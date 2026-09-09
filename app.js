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

  function workoutCard(key, label, block, isPrimary) {
    var ring = isPrimary ? 'border-l-2 ' + (
      key === 'listening' ? 'border-brand-sky' :
      key === 'reading' ? 'border-brand-emerald' :
      key === 'writing' ? 'border-brand-amber' : 'border-brand-rose'
    ) : 'border-l-2 border-white/10';
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
            workoutCard('listening', 'Listening', day.listening, isL) +
            workoutCard('reading', 'Reading', day.reading, isR) +
            workoutCard('writing', 'Writing', day.writing, isW) +
            workoutCard('speaking', 'Speaking', day.speaking, isS) +
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
     INIT
  ========================================================= */
  function init() {
    renderMonthStrip();
    buildChips();
    buildTree();
    applyExpandState();
    updateProgressUI();
    updateTimerUI();
    setSyncStatus('connecting');
    initDbSync();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
