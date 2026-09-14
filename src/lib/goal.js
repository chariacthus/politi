// Dagens mål. Ét tal, ét sted — HUD, profil og sti læser det samme.

export const DAILY_GOAL = 60

/** XP tjent i dag, udregnet af sessionshistorikken. */
export function xpToday(state) {
  const day = new Date().toISOString().slice(0, 10)
  return (state.sessions || [])
    .filter((session) => String(session.date).slice(0, 10) === day)
    .reduce((sum, session) => sum + (session.xp || 0), 0)
}
