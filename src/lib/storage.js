const KEY = 'politi.v1'
const VERSION = 1

export function emptyState() {
  return {
    version: VERSION,
    startedAt: new Date().toISOString(),
    examDate: null,
    items: {},
    sessions: [],
    streak: { current: 0, longest: 0, lastDay: null },
    scenarios: {},
    reports: {},
    lessons: {},
    unlocked: {},
    placement: null,
    xp: 0,
    planDone: {},
  }
}

/** localStorage kan kaste (privat vindue, blokerede cookies). Alt går gennem try/catch. */
export function load() {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw)
    return migrate(parsed)
  } catch {
    return emptyState()
  }
}

export function save(state) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export function reset() {
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    /* ignoreres med vilje */
  }
  return emptyState()
}

function migrate(state) {
  const base = emptyState()
  if (!state || typeof state !== 'object') return base
  // Flet ind i den tomme struktur, så manglende felter fra ældre versioner får en værdi.
  return {
    ...base,
    ...state,
    version: VERSION,
    items: state.items && typeof state.items === 'object' ? state.items : base.items,
    sessions: Array.isArray(state.sessions) ? state.sessions : base.sessions,
    streak: { ...base.streak, ...(state.streak || {}) },
    scenarios: state.scenarios && typeof state.scenarios === 'object' ? state.scenarios : base.scenarios,
    reports: state.reports && typeof state.reports === 'object' ? state.reports : base.reports,
    lessons: state.lessons && typeof state.lessons === 'object' ? state.lessons : base.lessons,
    unlocked: state.unlocked && typeof state.unlocked === 'object' ? state.unlocked : base.unlocked,
    placement: state.placement && typeof state.placement === 'object' ? state.placement : base.placement,
    xp: Number.isFinite(state.xp) ? state.xp : base.xp,
    planDone: state.planDone && typeof state.planDone === 'object' ? state.planDone : base.planDone,
  }
}

export function today() {
  return new Date().toISOString().slice(0, 10)
}

/** Opdaterer streak ud fra sidste træningsdag. Returnerer et nyt streak-objekt. */
export function bumpStreak(streak) {
  const day = today()
  if (streak.lastDay === day) return streak

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const current = streak.lastDay === yesterday ? streak.current + 1 : 1
  return {
    current,
    longest: Math.max(current, streak.longest || 0),
    lastDay: day,
  }
}
