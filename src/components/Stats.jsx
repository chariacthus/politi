/**
 * Tallene, der følger dig overalt: streak, dagens mål, XP og rang.
 * De ligger i skallen — i højre skinne på store skærme, som en stribe i
 * toppen på telefonen — så ingen side behøver at vise dem selv.
 */
import { useMemo } from 'react'
import CountUp from './CountUp.jsx'
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
        <Icon name="flame" size={17} /> {state.streak.current}
      </span>
      <span className="stat-pill xp" title="Samlet XP">
        <Icon name="spark" size={17} /> {state.xp || 0}
      </span>
      <span className="stat-pill goal" title={'Dagens mål: ' + DAILY_GOAL + ' XP'}>
        <Ring value={Math.min(today, DAILY_GOAL)} max={DAILY_GOAL} size={22} thickness={3.5} tone={goalDone ? 'ok' : ''} />
        <span className="mono">
          {today}/{DAILY_GOAL}
        </span>
      </span>
    </div>
  )
}

/** Den fulde skinne — kun på brede skærme. */
export default function Stats() {
  const { state, today, goalDone, rank, path, next, days } = useStats()

  return (
    <div className="side-stack">
      <div className="side-card">
        <div className="side-head">
          <Icon name="flame" size={18} /> Streak
        </div>
        <div className="side-big">
          <b className="num">
            <CountUp value={state.streak.current} />
          </b>
          <span>{state.streak.current === 1 ? 'dag i træk' : 'dage i træk'}</span>
        </div>
        <p className="small muted">Længste: {state.streak.longest} · træn hver dag, så tæller den videre.</p>
      </div>

      <div className="side-card">
        <div className="side-head">
          <Icon name="target" size={18} /> Dagens mål
        </div>
        <div className="goal-row">
          <Ring
            value={Math.min(today, DAILY_GOAL)}
            max={DAILY_GOAL}
            size={64}
            thickness={7}
            tone={goalDone ? 'ok' : ''}
            label={today}
            sub={'af ' + DAILY_GOAL}
          />
          <div>
            <b>{goalDone ? 'Målet er nået' : 'XP i dag'}</b>
            <p className="small muted">
              {goalDone ? 'Alt herfra er overskud.' : `${DAILY_GOAL - today} XP tilbage — cirka én lektion.`}
            </p>
          </div>
        </div>
        {next ? (
          <Link className="side-cta" to={'/lesson?id=' + next.id}>
            <Icon name="play" size={16} /> {path.done === 0 ? 'Start forløbet' : 'Fortsæt: ' + next.title}
          </Link>
        ) : (
          <Link className="side-cta" to="/practice">
            <Icon name="bolt" size={16} /> Øv frit
          </Link>
        )}
      </div>

      <div className="side-card">
        <div className="side-head">
          <Icon name="shield" size={18} /> {rank.current.title}
        </div>
        <div className="rank-bar">
          <div style={{ width: (rank.span ? Math.min(100, Math.round((rank.into / rank.span) * 100)) : 100) + '%' }} />
        </div>
        <p className="small muted">
          {state.xp || 0} XP{rank.next ? ` · ${rank.next.xp - (state.xp || 0)} til ${rank.next.title}` : ' · højeste rang'}
        </p>
        <div className="side-split">
          <span>
            <b className="num">
              {path.done}/{path.total}
            </b>
            <small>lektioner</small>
          </span>
          <span>
            <b className="num">
              {path.stars}/{path.maxStars}
            </b>
            <small>stjerner</small>
          </span>
        </div>
      </div>

      <div className="side-card">
        <div className="side-head">
          <Icon name="clock" size={18} /> Prøven
        </div>
        {days !== null ? (
          <div className="side-big">
            <b className="num">{days}</b>
            <span>{days === 1 ? 'dag tilbage' : 'dage tilbage'}</span>
          </div>
        ) : (
          <p className="small muted" style={{ marginBottom: '0.5rem' }}>
            Sæt din prøvedato, så regner planen baglæns fra den.
          </p>
        )}
        <Link className="small" to="/profile?tab=plan">
          Træningsplanen →
        </Link>
      </div>
    </div>
  )
}
