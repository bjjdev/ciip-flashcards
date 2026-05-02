// ── CIIP Flashcard App — Core Logic ──────────────────────────────────────────

// Cards live in cards.json and are loaded into localStorage by Storage.initCards().
// SAMPLE_CARDS is an empty fallback used only if the fetch fails and localStorage is also empty.
const SAMPLE_CARDS = [];

const DOMAINS = [
  { id: "01", name: "Procurement",                  letter: "A", scoredQ: 5  },
  { id: "02", name: "Project Management",            letter: "B", scoredQ: 7  },
  { id: "03", name: "Operations",                    letter: "C", scoredQ: 16 },
  { id: "04", name: "Communications",                letter: "D", scoredQ: 7  },
  { id: "05", name: "Training & Education",          letter: "E", scoredQ: 5  },
  { id: "06", name: "Image Management",              letter: "F", scoredQ: 23 },
  { id: "07", name: "Information Technology",        letter: "G", scoredQ: 16 },
  { id: "08", name: "Systems Management",            letter: "H", scoredQ: 20 },
  { id: "09", name: "Clinical Engineering",          letter: "I", scoredQ: 13 },
  { id: "10", name: "Medical Imaging Informatics",   letter: "J", scoredQ: 18 }
];

// ── Storage ───────────────────────────────────────────────────────────────────
// Progress and settings are loaded from Supabase into memory on initCards(),
// then getProgress/getSettings return from cache synchronously so the rest of
// the app doesn't need to change. updateCard/setSettings write through to
// Supabase in the background (fire-and-forget) after updating the cache.

let _userId = null;
let _progressCache = null;
let _settingsCache = null;

const Storage = {
  getProgress() {
    return _progressCache || {};
  },

  setProgress(progress) {
    _progressCache = progress;
  },

  updateCard(cardId, update) {
    if (!_progressCache) _progressCache = {};
    _progressCache[cardId] = { ...(_progressCache[cardId] || {}), ...update };

    if (_userId) {
      const s = _progressCache[cardId];
      _sb.from("progress").upsert({
        user_id: _userId,
        card_id: cardId,
        interval:     s.interval     ?? 0,
        repetitions:  s.repetitions  ?? 0,
        ease_factor:  s.easeFactor   ?? 2.5,
        next_due:     s.nextDue      ?? 0,
        fail_count:   s.failCount    ?? 0,
        starred:      s.starred      ?? false,
        history:      s.history      ?? [],
        updated_at:   new Date().toISOString()
      }, { onConflict: "user_id,card_id" }).then(({ error }) => {
        if (error) console.warn("progress write failed:", error.message);
      });
    }
  },

  getSettings() {
    return _settingsCache || {};
  },

  setSettings(settings) {
    _settingsCache = settings;
    if (_userId) {
      _sb.from("settings").upsert({
        user_id:    _userId,
        exam_date:  settings.examDate  ?? null,
        daily_goal: settings.dailyGoal ?? 20,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" }).then(({ error }) => {
        if (error) console.warn("settings write failed:", error.message);
      });
    }
  },

  getCards() {
    try { return JSON.parse(localStorage.getItem("ciip_cards") || "null") || SAMPLE_CARDS; }
    catch { return SAMPLE_CARDS; }
  },

  async initCards() {
    // 1. Load cards (static — same for all users)
    try {
      const res = await fetch("cards.json");
      if (!res.ok) throw new Error(res.status);
      const cards = await res.json();
      localStorage.setItem("ciip_cards", JSON.stringify(cards));
    } catch { /* keep cached version */ }

    // 2. Get logged-in user
    const { data: { session } } = await _sb.auth.getSession();
    _userId = session?.user?.id ?? null;
    if (!_userId) { _progressCache = {}; _settingsCache = {}; return; }

    // 3. Load progress from Supabase into cache
    const { data: rows, error: pErr } = await _sb
      .from("progress").select("*").eq("user_id", _userId);
    if (pErr) console.warn("progress load failed:", pErr.message);
    _progressCache = {};
    if (rows) {
      rows.forEach(r => {
        _progressCache[r.card_id] = {
          interval:    r.interval,
          repetitions: r.repetitions,
          easeFactor:  r.ease_factor,
          nextDue:     r.next_due,
          failCount:   r.fail_count,
          starred:     r.starred,
          history:     r.history || []
        };
      });
    }

    // 4. Load settings from Supabase into cache
    const { data: cfg, error: sErr } = await _sb
      .from("settings").select("*").eq("user_id", _userId).maybeSingle();
    if (sErr) console.warn("settings load failed:", sErr.message);
    _settingsCache = cfg
      ? { examDate: cfg.exam_date, dailyGoal: cfg.daily_goal }
      : {};
  }
};

// ── SM-2 Algorithm ────────────────────────────────────────────────────────────
function sm2(state = {}, quality) {
  // quality: 0=Again, 1=Hard, 3=Good, 5=Easy
  let { interval = 0, repetitions = 0, easeFactor = 2.5 } = state;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions++;
  }

  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  const nextDue = Date.now() + interval * 86400000;

  return { interval, repetitions, easeFactor, nextDue };
}

// ── Stats ─────────────────────────────────────────────────────────────────────
const Stats = {
  getMaturity(state) {
    if (!state || state.repetitions === 0) return "new";
    if (state.interval < 21) return "learning";
    if (state.interval < 90) return "review";
    return "mastered";
  },

  getRetentionRate(history = []) {
    if (!history.length) return null;
    const cutoff = Date.now() - 30 * 86400000;
    const recent = history.filter(h => h.date > cutoff);
    if (!recent.length) return null;
    const good = recent.filter(h => h.quality >= 3).length;
    return Math.round((good / recent.length) * 100);
  },

  getDomainStats(domainId, allCards, progress) {
    const cards = allCards.filter(c => c.id.startsWith(domainId + "-"));
    const now = Date.now();

    let counts = { new: 0, learning: 0, review: 0, mastered: 0 };
    let dueCount = 0;
    let allHistory = [];

    for (const card of cards) {
      const state = progress[card.id];
      const maturity = this.getMaturity(state);
      counts[maturity]++;
      if (!state || !state.nextDue || state.nextDue <= now) dueCount++;
      if (state?.history) allHistory = allHistory.concat(state.history);
    }

    const total = cards.length;
    const retention = this.getRetentionRate(allHistory);
    const avgEF = cards.reduce((sum, c) => {
      return sum + (progress[c.id]?.easeFactor || 2.5);
    }, 0) / Math.max(cards.length, 1);

    return { total, dueCount, counts, retention, avgEF: Math.round(avgEF * 100) / 100 };
  },

  getStreak(progress) {
    const allDates = new Set();
    for (const state of Object.values(progress)) {
      if (state.history) {
        for (const h of state.history) {
          allDates.add(new Date(h.date).toDateString());
        }
      }
    }

    let streak = 0;
    const d = new Date();
    if (!allDates.has(d.toDateString())) d.setDate(d.getDate() - 1);

    while (allDates.has(d.toDateString())) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  },

  getTodayCount(progress) {
    const today = new Date().toDateString();
    let count = 0;
    for (const state of Object.values(progress)) {
      if (state.history) {
        count += state.history.filter(h => new Date(h.date).toDateString() === today).length;
      }
    }
    return count;
  },

  getHeatmapData(progress) {
    const counts = {};
    for (const state of Object.values(progress)) {
      if (state.history) {
        for (const h of state.history) {
          const key = new Date(h.date).toDateString();
          counts[key] = (counts[key] || 0) + 1;
        }
      }
    }
    return counts;
  },

  getCountdown(settings) {
    if (!settings.examDate) return null;
    const exam = new Date(settings.examDate);
    const now = new Date();
    return Math.ceil((exam - now) / 86400000);
  },

  getLeeches(allCards, progress) {
    return allCards.filter(c => (progress[c.id]?.failCount || 0) >= 4);
  },

  getStarred(allCards, progress) {
    return allCards.filter(c => progress[c.id]?.starred);
  }
};

// ── Queue Builder ─────────────────────────────────────────────────────────────
function buildQueue(cards, progress, limit = 50) {
  const now = Date.now();
  const due = [];
  const fresh = [];

  for (const card of cards) {
    const state = progress[card.id];
    if (!state || !state.nextDue) {
      fresh.push(card);
    } else if (state.nextDue <= now) {
      due.push({ card, overdue: now - state.nextDue });
    }
  }

  due.sort((a, b) => b.overdue - a.overdue);
  shuffle(fresh);

  return [...due.map(d => d.card), ...fresh].slice(0, limit);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── Utility ───────────────────────────────────────────────────────────────────
function fmtRetention(ret) {
  if (ret === null) return '<span class="ret-none">—</span>';
  const cls = ret >= 85 ? "ret-good" : ret >= 70 ? "ret-warn" : "ret-bad";
  return `<span class="${cls}">${ret}%</span>`;
}

function fmtMaturity(maturity) {
  const map = { new: "tag-new", learning: "tag-learning", review: "tag-review", mastered: "tag-mastered" };
  return `<span class="${map[maturity] || ''}">${maturity}</span>`;
}

function difficultyBadge(difficulty) {
  const map = { easy: "diff-easy", medium: "diff-medium", hard: "diff-hard" };
  return `<span class="diff-badge ${map[difficulty] || ''}">${difficulty}</span>`;
}

function el(id) { return document.getElementById(id); }
