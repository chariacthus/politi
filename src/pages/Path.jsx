import { useMemo, useState } from 'react'
import CountUp from '../components/CountUp.jsx'
import Icon from '../components/Icon.jsx'
import Mascot from '../components/Mascot.jsx'
import Ring from '../components/Ring.jsx'
import { units } from '../data/path.js'
import { lessonState, nextLesson, pathProgress, rankFor, unitProgress } from '../lib/lessons.js'
import { Link, navigate } from '../lib/router.jsx'
import { useProgress } from '../lib/state.jsx'
import { recognitionSupported, setVoicePreference, voicePreference } from '../lib/voice.js'

const DAILY_GOAL = 60

// Stien slår ud til siderne, så den ligner en vej og ikke en liste.
const SHIFTS = [0, 1, 2, 1, 0, -1, -2, -1]

const FREE = [
  { to: '/dictation', icon: 'dictation', title: 'Diktat' },
  { to: '/write', icon: 'book', title: 'Rapport' },
  { to: '/scenarios', icon: 'scenarios', title: 'Situationer' },
  { to: '/grammar', icon: 'grammar', title: 'Fri grammatik' },
  { to: '/rules', icon: 'bulb', title: 'Regelbogen' },
  { to: '/progress', icon: 'progress', title: 'Fremskridt' },
]

export default function Path() {
  const { state } = useProgress()
  const [voice, setVoice] = useState(voicePreference)

  const progress = useMemo(() => pathProgress(state.lessons), [state.lessons])
  const rank = useMemo(() => rankFor(state.xp || 0), [state.xp])
  const next = useMemo(() => nextLesson(state.lessons), [state.lessons])
  const today = useMemo(() => xpToday(state), [state])

  const goalDone = today >= DAILY_GOAL

  return (
    <div className="board-page">
      <div className="hud">
        <span className="hud-item flame" title="Dage i træk">
          <Icon name="flame" size={20} /> {state.streak.current}
        </span>
        <span className="hud-item xp" title="Samlet XP">
          <Icon name="spark" size={20} /> <CountUp value={state.xp || 0} />
        </span>
        <span className="hud-goal" title={'Dagens mål: ' + DAILY_GOAL + ' XP'}>
          <Ring value={Math.min(today, DAILY_GOAL)} max={DAILY_GOAL} size={30} thickness={4} tone={goalDone ? 'ok' : ''} />
          <span className="small muted mono">
            {today}/{DAILY_GOAL}
          </span>
        </span>
        <span className="hud-item rank">{rank.current.title}</span>
      </div>

      <div className="mascot-strip">
        <Mascot mood={goalDone ? 'happy' : 'neutral'} size={74} />
        <div className="speech">
          {progress.done === 0
            ? 'Vi starter fra toppen. Første lektion tager fem minutter.'
            : goalDone
              ? 'Dagens mål er i hus. Alt herfra er overskud.'
              : next
                ? `Næste op: ${next.title}.`
                : 'Hele forløbet er klaret — kør en runde igen for stjernerne.'}
        </div>
      </div>

      {units.map((unit) => {
        const done = unitProgress(unit, state.lessons)
        const complete = done.done === done.total
        return (
          <section key={unit.id} style={{ '--u': unit.color }}>
            <div className="unit-banner">
              <div style={{ flex: '1 1 240px', minWidth: 0 }}>
                <span className="eyebrow">Enhed {unit.number}</span>
                <h2>{unit.title}</h2>
                <p>{unit.blurb}</p>
              </div>
              <span className="chip">
                {complete ? <Icon name="crown" size={13} /> : null}
                {done.done}/{done.total}
              </span>
            </div>

            <div className="board">
              {unit.lessons.map((lesson, lessonIndex) => {
                const status = lessonState(lesson.id, state.lessons)
                const record = state.lessons[lesson.id]
                const isNext = next?.id === lesson.id
                return (
                  <div className="board-row" data-shift={SHIFTS[lessonIndex % SHIFTS.length]} key={lesson.id}>
                    <div className={'stone ' + status + (lesson.checkpoint ? ' checkpoint' : '') + (isNext ? ' next' : '')}>
                      {isNext ? <span className="start-bubble">{progress.done === 0 ? 'START' : 'FORTSÆT'}</span> : null}
                      <button
                        className="stone-btn"
                        disabled={status === 'locked'}
                        onClick={() => navigate('/lesson?id=' + lesson.id)}
                        aria-label={lesson.title + (status === 'locked' ? ' (låst)' : '')}
                      >
                        {status === 'locked' ? (
                          <Icon name="lock" size={20} />
                        ) : status === 'done' ? (
                          <Icon name="crown" size={24} strokeWidth={2} />
                        ) : lesson.checkpoint ? (
                          <Icon name="target" size={24} />
                        ) : (
                          <Icon name="play" size={22} />
                        )}
                      </button>
                      <span className="stone-label">{lesson.title}</span>
                      {record ? (
                        <span className="stone-stars" aria-label={record.stars + ' af 3 stjerner'}>
                          {[1, 2, 3].map((star) => (
                            <Icon key={star} name="spark" size={12} className={star <= record.stars ? 'star on' : 'star'} />
                          ))}
                        </span>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}

      <div className="board-end">
        <Icon name="shield" size={22} />
        <span className="small">
          {progress.done}/{progress.total} lektioner · {progress.stars}/{progress.maxStars} stjerner
        </span>
        <button
          className="btn-3d ghost"
          onClick={() => {
            const nextValue = !voice
            setVoice(nextValue)
            setVoicePreference(nextValue)
          }}
          title={recognitionSupported() ? undefined : 'Browseren understøtter ikke talegenkendelse — modellen kan stadig læses op'}
        >
          <Icon name="dictation" size={17} /> Stemmeøvelser: {voice ? 'til' : 'fra'}
        </button>
      </div>

      <div className="free-strip">
        {FREE.map((entry) => (
          <Link key={entry.to} to={entry.to} className="free-chip">
            <Icon name={entry.icon} size={17} />
            {entry.title}
          </Link>
        ))}
      </div>

      <p className="small muted" style={{ textAlign: 'center', margin: '1rem auto 0' }}>
        Indholdet er skrevet ud fra politiets regelgrundlag og almindelige retskrivningsregler — ikke officielt
        undervisningsmateriale. Kontrollér gældende regler på retsinformation.dk.
      </p>
    </div>
  )
}

/** XP tjent i dag, udregnet af sessionshistorikken. */
function xpToday(state) {
  const day = new Date().toISOString().slice(0, 10)
  return state.sessions
    .filter((session) => session.module === 'lektion' && String(session.date).slice(0, 10) === day)
    .reduce((sum, session) => sum + (session.xp || session.correct * 10 + 15), 0)
}
