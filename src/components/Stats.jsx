/**
 * Skinnen til højre. Den viser én ting ad gangen: hvad du skal nu, og hvor
 * tæt du er på dagens mål. Resten af tallene står i profilen, hvor de hører
 * hjemme — de skal ikke konkurrere med lektionen om opmærksomheden.
 */
import { useMemo } from 'react'
import Icon from './Icon.jsx'
import Ring from './Ring.jsx'
import { DAILY_GOAL, xpToday } from '../lib/goal.js'
import { nextLesson, pathProgress, rankFor } from '../lib/lessons.js'
import { Link } from '../lib/router.jsx'
import { daysUntil, useProgress } from '../lib/state.jsx'

export function useStats() {
  const { state } = useProgress()
  return useMemo(() => {
    const today = xpToday(state)
    return {
      state,
      today,
      goalDone: today >= DAILY_GOAL,
      rank: rankFor(state.xp || 0),
      path: pathProgress(state.lessons),
      next: nextLesson(state.lessons, state.unlocked),
      days: daysUntil(state.examDate),
    }
  }, [state])
}

/** Kompakt stribe — telefonens toplinje. */
export function StatStrip() {
  const { state, today, goalDone } = useStats()
  return (
    <div className="statstrip">
      <span className="stat-pill flame" title="Dage i træk">
        <Icon name="flame" size={16} /> {state.streak.current}
      </span>
      <span className={'stat-pill goal' + (goalDone ? ' done' : '')} title={'Dagens mål: ' + DAILY_GOAL + ' XP'}>
        <Ring value={Math.min(today, DAILY_GOAL)} max={DAILY_GOAL} size={20} thickness={3} tone={goalDone ? 'ok' : ''} />
        {today}
      </span>
    </div>
  )
}

/** Højre skinne: næste skridt øverst, dagens mål under. */
export default function Stats() {
  const { state, today, goalDone, next, path } = useStats()
  const left = Math.max(0, DAILY_GOAL - today)

  return (
    <div className="side-stack">
      <div className="next-card">
        <span className="next-label">Næste</span>
        <b className="next-title">{next ? next.title : 'Alt er kørt igennem'}</b>
        {next ? (
          <Link className="next-go" to={'/lesson?id=' + next.id}>
            <Icon name="play" size={15} /> {path.done === 0 ? 'Start' : 'Fortsæt'}
          </Link>
        ) : (
          <Link className="next-go" to="/practice">
            <Icon name="bolt" size={15} /> Øv frit
          </Link>
        )}
      </div>

      <div className="goal-card">
        <Ring
          value={Math.min(today, DAILY_GOAL)}
          max={DAILY_GOAL}
          size={52}
          thickness={6}
          tone={goalDone ? 'ok' : ''}
          label={today}
        />
        <div>
          <b>{goalDone ? 'Dagens mål nået' : left + ' XP tilbage'}</b>
          <span className="small muted">
            <Icon name="flame" size={13} /> {state.streak.current} {state.streak.current === 1 ? 'dag' : 'dage'} i træk
          </span>
        </div>
      </div>
    </div>
  )
}
