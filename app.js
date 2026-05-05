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
    const base = _settingsCache || {};
    // Local-only prefs (not synced to Supabase — schema doesn't store them)
    let local = {};
    try { local = JSON.parse(localStorage.getItem("ciip_local_settings") || "{}"); } catch {}
    return { ...base, ...local };
  },

  setSettings(settings) {
    // Split synced vs local prefs
    const { mcqFirst, ...synced } = settings;
    _settingsCache = synced;
    try {
      localStorage.setItem("ciip_local_settings", JSON.stringify({ mcqFirst: !!mcqFirst }));
    } catch {}
    if (_userId) {
      _sb.from("settings").upsert({
        user_id:    _userId,
        exam_date:  synced.examDate  ?? null,
        daily_goal: synced.dailyGoal ?? 20,
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
    // 1. Get logged-in user — cards endpoint requires an authenticated session
    //    with an active subscription (gated by /.netlify/functions/get-cards).
    const { data: { session } } = await _sb.auth.getSession();
    _userId = session?.user?.id ?? null;

    // 2. Fetch cards from the gated function. Falls back to cached cards in
    //    localStorage if the request fails (e.g., offline, expired sub).
    if (session?.access_token) {
      try {
        const res = await fetch("/.netlify/functions/get-cards", {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        if (!res.ok) throw new Error(res.status);
        const cards = await res.json();
        localStorage.setItem("ciip_cards", JSON.stringify(cards));
      } catch { /* keep cached version */ }
    }

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

// ── Exam Mode ─────────────────────────────────────────────────────────────────
const Exam = {
  // Weighted random sample of `length` cards across all 10 domains.
  // Weights come from DOMAINS[].scoredQ (official ABII CIIP distribution).
  buildSample(allCards, length) {
    const totalScored = DOMAINS.reduce((s, d) => s + d.scoredQ, 0);
    const byDomain = {};
    for (const d of DOMAINS) {
      byDomain[d.id] = allCards.filter(c => c.id.startsWith(d.id + "-"));
    }

    // First pass: take floor(length * weight / total) per domain
    let picks = [];
    let remainders = [];
    for (const d of DOMAINS) {
      const exact = (length * d.scoredQ) / totalScored;
      const take = Math.floor(exact);
      const pool = shuffle([...byDomain[d.id]]);
      picks.push(...pool.slice(0, take));
      remainders.push({ domain: d, leftover: pool.slice(take), frac: exact - take });
    }

    // Second pass: fill the gap from highest-fractional domains
    remainders.sort((a, b) => b.frac - a.frac);
    let i = 0;
    while (picks.length < length && i < remainders.length * 4) {
      const r = remainders[i % remainders.length];
      if (r.leftover.length > 0) picks.push(r.leftover.shift());
      i++;
    }

    return shuffle(picks).slice(0, length);
  },

  // Grade a completed exam. answers: { [cardId]: "A" | "B" | "C" | "D" | null }
  grade(cards, answers) {
    const results = cards.map(card => {
      const picked = answers[card.id] ?? null;
      const correct = picked === card.back.answer;
      return { card, picked, correct };
    });
    const correctCount = results.filter(r => r.correct).length;
    const score = Math.round((correctCount / cards.length) * 100);

    // Per-domain breakdown
    const perDomain = DOMAINS.map(d => {
      const inDomain = results.filter(r => r.card.id.startsWith(d.id + "-"));
      const right = inDomain.filter(r => r.correct).length;
      return {
        domain: d,
        total: inDomain.length,
        correct: right,
        pct: inDomain.length > 0 ? Math.round((right / inDomain.length) * 100) : null
      };
    }).filter(p => p.total > 0);

    return { results, correctCount, score, perDomain };
  },

  // Apply exam outcome to SRS:
  //   - Every answered card gets a history entry (so dashboard daily-goal counts).
  //   - Missed/unanswered cards get an additional sm2 quality=0 update + failCount bump.
  applyResults(results) {
    const progress = Storage.getProgress();
    const now = Date.now();
    for (const { card, picked, correct } of results) {
      const old = progress[card.id] || {};
      const history = [...(old.history || []), { date: now, quality: correct ? 3 : 0, exam: true }];
      if (correct) {
        // Don't move SRS interval for correct exam answers — diagnostic only.
        Storage.updateCard(card.id, { history, starred: old.starred || false });
      } else {
        const newSM2 = sm2(old, 0);
        const failCount = (old.failCount || 0) + 1;
        Storage.updateCard(card.id, { ...newSM2, failCount, history, starred: old.starred || false });
      }
    }
  }
};

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
