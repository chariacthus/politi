import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { bumpStreak, load, reset as resetStorage, save } from './storage.js'
import { updateItem } from './srs.js'

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [state, setState] = useState(() => load())

  const update = useCallback((fn) => {
    setState((prev) => {
      const next = fn(prev)
      save(next)
      return next
    })
  }, [])

  const value = useMemo(() => {
    return {
      state,

      recordAnswer(itemId, correct) {
        update((prev) => ({
          ...prev,
          items: { ...prev.items, [itemId]: updateItem(prev.items[itemId], correct) },
        }))
      },

      recordSession(session) {
        update((prev) => ({
          ...prev,
          // Gem de seneste 100 sessioner — nok til historik, uden at fylde localStorage.
          sessions: [...prev.sessions, { date: new Date().toISOString(), ...session }].slice(-100),
          streak: bumpStreak(prev.streak),
        }))
      },

      recordScenario(scenarioId, score) {
        update((prev) => {
          const prevRun = prev.scenarios[scenarioId] || { runs: 0, bestScore: 0 }
          return {
            ...prev,
            scenarios: {
              ...prev.scenarios,
              [scenarioId]: { runs: prevRun.runs + 1, bestScore: Math.max(prevRun.bestScore, score) },
            },
            streak: bumpStreak(prev.streak),
          }
        })
      },

      recordReport(reportId, score) {
        update((prev) => {
          const prevRun = prev.reports[reportId] || { runs: 0, bestScore: 0 }
          return {
            ...prev,
            reports: {
              ...prev.reports,
              [reportId]: { runs: prevRun.runs + 1, bestScore: Math.max(prevRun.bestScore, score) },
            },
            streak: bumpStreak(prev.streak),
          }
        })
      },

      setExamDate(date) {
        update((prev) => ({ ...prev, examDate: date || null }))
      },

      togglePlanTask(taskId) {
        update((prev) => {
          const planDone = { ...prev.planDone }
          if (planDone[taskId]) delete planDone[taskId]
          else planDone[taskId] = true
          return { ...prev, planDone }
        })
      },

      resetAll() {
        const fresh = resetStorage()
        setState(fresh)
      },
    }
  }, [state, update])

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) throw new Error('useProgress skal bruges inde i ProgressProvider')
  return context
}

/** Dage til prøvedatoen, eller null hvis der ikke er sat en dato. */
export function daysUntil(dateString) {
  if (!dateString) return null
  const target = new Date(dateString + 'T00:00:00')
  if (Number.isNaN(target.getTime())) return null
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((target - startOfToday) / 86400000)
}
