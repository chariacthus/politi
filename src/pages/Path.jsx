/**
 * Stien. Seks enheder, fire lektioner i hver, en sten ad gangen. Tryk på en
 * sten for at se, hvad den indeholder — og spring en hel enhed over med en
 * springtest, hvis du allerede kan stoffet.
 */
import { useEffect, useMemo, useState } from 'react'
import Icon from '../components/Icon.jsx'
import Mascot from '../components/Mascot.jsx'
import { units } from '../data/path.js'
import { JUMP_SIZE, lessonState, nextLesson, pathProgress, unitLocked, unitProgress } from '../lib/lessons.js'
import { navigate } from '../lib/router.jsx'
import { useProgress } from '../lib/state.jsx'

// Stien slår ud til siderne, så den ligner en vej og ikke en liste.
const SHIFTS = [0, 1, 2, 1, 0, -1, -2, -1]

export default function Path() {
  const { state } = useProgress()
  const [open, setOpen] = useState(null)

  const progress = useMemo(() => pathProgress(state.lessons), [state.lessons])
  const next = useMemo(() => nextLesson(state.lessons, state.unlocked), [state.lessons, state.unlocked])

  // Esc lukker boblen, og et klik ved siden af gør det samme.
  useEffect(() => {
    if (!open) return undefined
    function onKey(event) {
      if (event.key === 'Escape') setOpen(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="board-page" onClick={() => setOpen(null)}>
      <div className="mascot-strip">
        <Mascot mood={progress.done > 0 ? 'happy' : 'neutral'} size={70} />
        <div className="speech">
          {progress.done === 0
            ? 'Vi starter fra toppen. Første lektion tager fem minutter.'
            : next
              ? `Næste op: ${next.title}.`
              : 'Hele forløbet er klaret — tag en runde igen for stjernerne.'}
        </div>
      </div>

      {units.map((unit) => {
        const done = unitProgress(unit, state.lessons)
        const complete = done.done === done.total
        const locked = unitLocked(unit, state.lessons, state.unlocked)
        return (
          <section key={unit.id} style={{ '--u': unit.color }}>
            <div className={'unit-banner' + (locked ? ' locked' : '')}>
              <div style={{ flex: '1 1 240px', minWidth: 0 }}>
                <span className="eyebrow">Enhed {unit.number}</span>
                <h2>{unit.title}</h2>
                <p>{unit.blurb}</p>
              </div>
              <div className="unit-tail">
                <span className="chip">
                  {complete ? <Icon name="crown" size={13} /> : null}
                  {done.done}/{done.total}
                </span>
                {locked ? (
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
                        <span className="start-bubble">{progress.done === 0 ? 'START' : 'FORTSÆT'}</span>
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
