/**
 * Fremskridt. Ét overblik: hvor du er i uddannelsen, hvad du skal gøre nu,
 * og hvad der driller. Tallene bag det hele står i bunden for den, der vil
 * grave — men de fylder ikke skærmen, før man beder om dem.
 */
import { useMemo, useState } from 'react'
import Icon from '../components/Icon.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { daItems, daTopics } from '../data/grammar.da.js'
import { enItems, enTopics } from '../data/grammar.en.js'
import { stages } from '../data/path.js'
import { policeItems } from '../data/police.js'
import { currentStage, levelFor, pathProgress, rankFor, stageProgress } from '../lib/lessons.js'
import { navigate } from '../lib/router.jsx'
import { topicStats } from '../lib/srs.js'
import { useProgress } from '../lib/state.jsx'

const ALL_ITEMS = [...daItems, ...enItems]
const LEVELS = ['Begynder', 'Øvet', 'Stærk']

function titleFor(lang, topicId) {
  const list = lang === 'en' ? enTopics : daTopics
  return list.find((entry) => entry.id === topicId)?.title || topicId
}

export default function ProgressView() {
  const { state } = useProgress()
  const [details, setDetails] = useState(false)

  const stage = useMemo(() => currentStage(state.lessons, state.unlocked), [state.lessons, state.unlocked])
  const path = useMemo(() => pathProgress(state.lessons), [state.lessons])
  const rank = useMemo(() => rankFor(state.xp || 0), [state.xp])

  const tracks = useMemo(
    () => [
      { id: 'da', label: 'Dansk', level: levelFor(daItems, state.items) },
      { id: 'en', label: 'Engelsk', level: levelFor(enItems, state.items) },
      { id: 'politi', label: 'Politifag', level: levelFor(policeItems, state.items) },
    ],
    [state.items],
  )

  const weak = useMemo(
    () =>
      topicStats(ALL_ITEMS, state.items)
        .filter((entry) => entry.rate !== null && entry.rate < 0.85)
        .slice(0, 3),
    [state.items],
  )

  const totals = useMemo(() => {
    let seen = 0
    let correct = 0
    for (const record of Object.values(state.items)) {
      seen += record.seen
      correct += record.correct
    }
    return { seen, correct, rate: seen ? Math.round((correct / seen) * 100) : 0 }
  }, [state.items])

  return (
    <>
      {/* Uddannelsen som en stige — ét blik fortæller, hvor langt du er. */}
      <section className="card">
        <div className="spread">
          <div>
            <span className="eyebrow">Trin {stage.number}</span>
            <h2 style={{ margin: '0.15rem 0 0' }}>{stage.title}</h2>
          </div>
          <span className="chip accent">{rank.current.title}</span>
        </div>

        <div className="ladder-row mt">
          {stages.map((entry) => {
            const done = stageProgress(entry.id, state.lessons)
            const mark = done.complete ? 'done' : entry.id === stage.id ? 'here' : ''
            return (
              <div className={'ladder-step ' + mark} key={entry.id} title={entry.title}>
                <span className="ladder-num">
                  {done.complete ? <Icon name="check" size={14} strokeWidth={2.6} /> : entry.number}
                </span>
                <div>
                  <b>{entry.title}</b>
                  <span className="small muted">
                    {done.done}/{done.total}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-sm">
          <ProgressBar value={path.done} max={path.total} />
        </div>
      </section>

      {/* Niveauet pr. spor: det eneste tal, der styrer sværhedsgraden. */}
      <section className="card">
        <div className="skill-row">
          {tracks.map((track) => (
            <div className="skill" key={track.id}>
              <b>{track.label}</b>
              <span className={'skill-level lvl' + track.level}>{LEVELS[track.level - 1]}</span>
              <span className="skill-bar">
                <i style={{ width: track.level * 33.4 + '%' }} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {weak.length > 0 ? (
        <section className="card">
          <h2 style={{ fontSize: 'var(--t-1)', marginBottom: '0.7rem' }}>Det her driller</h2>
          <div className="weak-list">
            {weak.map((entry) => (
              <button
                key={entry.lang + entry.topic}
                className="weak-row"
                onClick={() => navigate(`/grammar?lang=${entry.lang}&topic=${entry.topic}&start=1`)}
              >
                <span className="weak-name">{titleFor(entry.lang, entry.topic)}</span>
                <span className="weak-bar">
                  <i style={{ width: Math.round(entry.rate * 100) + '%' }} />
                </span>
                <span className="weak-pct mono">{Math.round(entry.rate * 100)}%</span>
                <Icon name="arrow" size={15} />
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <button className="details-toggle" onClick={() => setDetails(!details)}>
        <Icon name={details ? 'x' : 'layers'} size={15} />
        {details ? 'Skjul tallene' : 'Vis tallene bag'}
      </button>

      {details ? (
        <section className="card">
          <div className="grid grid-3fix">
            <div className="tile">
              <span className="tile-label">XP</span>
              <span className="tile-value">{state.xp || 0}</span>
              <span className="tile-hint">{rank.next ? rank.next.xp - (state.xp || 0) + ' til næste rang' : 'højeste rang'}</span>
            </div>
            <div className="tile">
              <span className="tile-label">Lektioner</span>
              <span className="tile-value">
                {path.done}/{path.total}
              </span>
              <span className="tile-hint">{path.stars} stjerner</span>
            </div>
            <div className="tile">
              <span className="tile-label">Træfprocent</span>
              <span className="tile-value">{totals.rate} %</span>
              <span className="tile-hint">{totals.seen} besvarede</span>
            </div>
            <div className="tile">
              <span className="tile-label">Streak</span>
              <span className="tile-value">{state.streak.current}</span>
              <span className="tile-hint">længste: {state.streak.longest}</span>
            </div>
            <div className="tile">
              <span className="tile-label">Sessioner</span>
              <span className="tile-value">{state.sessions.length}</span>
              <span className="tile-hint">gemt i denne browser</span>
            </div>
            <div className="tile">
              <span className="tile-label">Rigtige</span>
              <span className="tile-value">{totals.correct}</span>
              <span className="tile-hint">svar i alt</span>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
