/**
 * Stien. Fire trin fra begynder til professionel, hvert trin med sine
 * enheder og lektioner. Tryk på en sten for at se, hvad den indeholder.
 * Kan du stoffet i forvejen, kan en hel enhed åbnes med en springtest — og
 * driller noget, samler genopfriskningen det op af sig selv.
 */
import { useEffect, useMemo, useState } from 'react'
import Icon from '../components/Icon.jsx'
import Mascot from '../components/Mascot.jsx'
import { stages, units } from '../data/path.js'
import {
  JUMP_SIZE,
  PLACEMENT_SIZE,
  lessonState,
  nextLesson,
  pathProgress,
  stageLocked,
  stageProgress,
  unitLocked,
  unitProgress,
  weakItems,
} from '../lib/lessons.js'
import { navigate } from '../lib/router.jsx'
import { useProgress } from '../lib/state.jsx'

// Stien slår ud til siderne, så den ligner en vej og ikke en liste.
const SHIFTS = [0, 1, 2, 1, 0, -1, -2, -1]

export default function Path() {
  const { state } = useProgress()
  const [open, setOpen] = useState(null)

  const progress = useMemo(() => pathProgress(state.lessons), [state.lessons])
  const next = useMemo(() => nextLesson(state.lessons, state.unlocked), [state.lessons, state.unlocked])
  const weak = useMemo(() => weakItems(state.items, { limit: 8 }), [state.items])

  useEffect(() => {
    if (!open) return undefined
    function onKey(event) {
      if (event.key === 'Escape') setOpen(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const started = progress.done > 0
  const placed = Boolean(state.placement)

  return (
    <div className="board-page" onClick={() => setOpen(null)}>
      {/* Brættet har ingen synlig titel — men siden skal have én overskrift. */}
      <h1 className="sr-only">Din uddannelse: stien fra begynder til professionel</h1>

      <div className="mascot-strip">
        <Mascot mood={started ? 'happy' : 'neutral'} size={70} />
        <div className="speech">
          {!started
            ? 'Vi starter fra nul. Første lektion tager fem minutter — og du skal ikke kunne noget på forhånd.'
            : next
              ? `Næste op: ${next.title}.`
              : 'Hele uddannelsen er kørt igennem. Tag en runde igen for stjernerne.'}
        </div>
      </div>

      {!placed && !started ? (
        <button className="offer" onClick={() => navigate('/lesson?placement=1')}>
          <span className="offer-icon">
            <Icon name="target" size={22} />
          </span>
          <span className="offer-body">
            <b>Kan du noget i forvejen?</b>
            <span>Tag niveautesten på {PLACEMENT_SIZE} opgaver, så starter du det rigtige sted.</span>
          </span>
          <Icon name="arrow" size={18} />
        </button>
      ) : null}

      {weak.length >= 4 ? (
        <button className="offer weak" onClick={() => navigate('/lesson?refresh=1')}>
          <span className="offer-icon">
            <Icon name="refresh" size={20} />
          </span>
          <span className="offer-body">
            <b>Genopfriskning klar</b>
            <span>
              {weak.length} opgaver driller lige nu. Tag dem, før de falder ud igen — det er sådan, det
              sætter sig.
            </span>
          </span>
          <Icon name="arrow" size={18} />
        </button>
      ) : null}

      {stages.map((stage) => {
        const done = stageProgress(stage.id, state.lessons)
        const locked = stageLocked(stage.id, state.lessons, state.unlocked)
        const stageUnits = units.filter((unit) => unit.stageId === stage.id)
        return (
          <section className="stage" key={stage.id} data-stage={stage.number}>
            <header className={'stage-head' + (locked ? ' locked' : '') + (done.complete ? ' complete' : '')}>
              <span className="stage-mark">
                {done.complete ? <Icon name="crown" size={20} /> : locked ? <Icon name="lock" size={18} /> : stage.number}
              </span>
              <div className="stage-text">
                <span className="eyebrow">
                  Trin {stage.number} · {stage.level}
                </span>
                <h2>{stage.title}</h2>
                <p>{stage.blurb}</p>
                <p className="stage-goal">
                  <Icon name="target" size={14} /> {stage.goal}
                </p>
              </div>
              <span className="stage-count">
                {done.done}/{done.total}
              </span>
            </header>

            {stageUnits.map((unit) => {
              const unitDone = unitProgress(unit, state.lessons)
              const complete = unitDone.done === unitDone.total
              const unitIsLocked = unitLocked(unit, state.lessons, state.unlocked)
              return (
                <div key={unit.id} style={{ '--u': unit.color }}>
                  <div className={'unit-banner' + (unitIsLocked ? ' locked' : '')}>
                    <div style={{ flex: '1 1 240px', minWidth: 0 }}>
                      <span className="eyebrow">Enhed {unit.number}</span>
                      <h3>{unit.title}</h3>
                      <p>{unit.blurb}</p>
                    </div>
                    <div className="unit-tail">
                      <span className="chip">
                        {complete ? <Icon name="crown" size={13} /> : null}
                        {unitDone.done}/{unitDone.total}
                      </span>
                      {unitIsLocked ? (
                        <button
                          className="jump-btn"
                          onClick={(event) => {
                            event.stopPropagation()
                            navigate('/lesson?jump=' + unit.id)
                          }}
                        >
                          <Icon name="skip" size={16} /> Spring videre
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="board">
                    {unit.lessons.map((lesson, lessonIndex) => {
                      const status = lessonState(lesson.id, state.lessons, state.unlocked)
                      const record = state.lessons[lesson.id]
                      const isNext = next?.id === lesson.id
                      return (
                        <div
                          className={'board-row' + (open === lesson.id ? ' popped' : '')}
                          data-shift={SHIFTS[lessonIndex % SHIFTS.length]}
                          key={lesson.id}
                        >
                          <div
                            className={
                              'stone ' +
                              status +
                              (lesson.checkpoint ? ' checkpoint' : '') +
                              (isNext ? ' next' : '') +
                              (open === lesson.id ? ' popped' : '')
                            }
                          >
                            {isNext && open !== lesson.id ? (
                              <span className="start-bubble">{started ? 'FORTSÆT' : 'START'}</span>
                            ) : null}
                            <button
                              className="stone-btn"
                              onClick={(event) => {
                                event.stopPropagation()
                                setOpen(open === lesson.id ? null : lesson.id)
                              }}
                              aria-expanded={open === lesson.id}
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

                            {open === lesson.id ? (
                              <NodeCard
                                lesson={lesson}
                                unit={unit}
                                status={status}
                                record={record}
                                index={lessonIndex}
                                onClose={() => setOpen(null)}
                              />
                            ) : null}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </section>
        )
      })}

      <div className="board-end">
        <Icon name="shield" size={22} />
        <span className="small">
          {progress.done}/{progress.total} lektioner · {progress.stars}/{progress.maxStars} stjerner
        </span>
      </div>
    </div>
  )
}

/** Boblen over stenen: hvad lektionen er, og hvad knappen gør. */
function NodeCard({ lesson, unit, status, record, index, onClose }) {
  const locked = status === 'locked'
  return (
    <div className="node-card" style={{ '--u': unit.color }} onClick={(event) => event.stopPropagation()}>
      <span className="eyebrow">
        Enhed {unit.number} · lektion {index + 1} af {unit.lessons.length}
      </span>
      <b>{lesson.title}</b>
      <p className="small">
        {locked
          ? 'Klar lektionerne før denne — eller tag enhedens springtest, hvis du allerede kan stoffet.'
          : lesson.checkpoint
            ? `Tjek på hele enheden: ${lesson.size} opgaver på tværs af emnerne.`
            : `${lesson.size} opgaver · ${status === 'done' ? 'klaret' : 'ikke taget endnu'}`}
      </p>
      {record ? (
        <span className="node-stars">
          {[1, 2, 3].map((star) => (
            <Icon key={star} name="spark" size={15} className={star <= record.stars ? 'star on' : 'star'} />
          ))}
        </span>
      ) : null}

      {locked ? (
        <button className="btn-3d ghost sm" onClick={() => navigate('/lesson?jump=' + unit.id)}>
          <Icon name="skip" size={16} /> Springtest ({JUMP_SIZE} opgaver)
        </button>
      ) : (
        <>
          <button className="btn-3d sm" onClick={() => navigate('/lesson?id=' + lesson.id)}>
            {status === 'done' ? 'Øv igen' : 'Start'} <Icon name="arrow" size={16} />
          </button>
          <button className="node-learn" onClick={() => navigate('/lesson?id=' + lesson.id + '&teach=1')}>
            <Icon name="bulb" size={15} /> Læs reglen først
          </button>
        </>
      )}
      <button className="node-close" onClick={onClose} aria-label="Luk">
        <Icon name="x" size={15} />
      </button>
    </div>
  )
}
