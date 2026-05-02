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
const Storage = {
  getProgress() {
    try { return JSON.parse(localStorage.getItem("ciip_progress") || "{}"); }
    catch { return {}; }
  },
  setProgress(progress) {
    localStorage.setItem("ciip_progress", JSON.stringify(progress));
  },
  updateCard(cardId, update) {
    const p = this.getProgress();
    p[cardId] = { ...(p[cardId] || {}), ...update };
    this.setProgress(p);
  },
  getSettings() {
    try { return JSON.parse(localStorage.getItem("ciip_settings") || "{}"); }
    catch { return {}; }
  },
  setSettings(settings) {
    localStorage.setItem("ciip_settings", JSON.stringify(settings));
  },
  getCards() {
    try { return JSON.parse(localStorage.getItem("ciip_cards") || "null") || SAMPLE_CARDS; }
    catch { return SAMPLE_CARDS; }
  },
  async initCards() {
    try {
      const res = await fetch("cards.json");
      if (!res.ok) throw new Error(res.status);
      const cards = await res.json();
      localStorage.setItem("ciip_cards", JSON.stringify(cards));
    } catch {
      // Keep whatever is already in localStorage; SAMPLE_CARDS fallback handles cold start
    }
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
