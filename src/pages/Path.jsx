/**
 * Stien. Ét spørgsmål skal besvares på denne skærm: hvad gør jeg nu?
 * Derfor er der kun det nødvendige — trinnet, enheden og stenene. Alt andet
 * (forklaringer, tal, planer) hører hjemme et andet sted.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from '../components/Icon.jsx'
import Mascot from '../components/Mascot.jsx'
import Trail from '../components/Trail.jsx'
import { stages, units } from '../data/path.js'
import {
  JUMP_SIZE,
  cleared,
  examFor,
  lessonState,
  nextLesson,
  pathProgress,
  stageProgress,
  unitLocked,
  unitProgress,
  weakItems,
} from '../lib/lessons.js'
import { DAILY_GOAL, xpToday } from '../lib/goal.js'
import { navigate } from '../lib/router.jsx'
import { useProgress } from '../lib/state.jsx'

// Stien slår ud til siderne, så den ligner en vej og ikke en liste.
const SHIFTS = [0, 1, 2, 1, 0, -1, -2, -1]

/**
 * Instruktøren siger én ting. Han kommenterer det, der faktisk er sket —
 * og han holder mund, når der ikke er noget at sige.
 */
function guideLine({ started, next, weak, goalDone, streak }) {
  if (!started) return { text: 'Godt du er her. Vi starter forfra.', mood: 'neutral' }
  if (!next) return { text: 'Hele vejen igennem. Flot arbejde.', mood: 'happy' }
  if (weak.length >= 6) return { text: 'Noget driller. Tag en genopfriskning først.', mood: 'neutral' }
  if (goalDone) return { text: 'Dagens mål er i hus.', mood: 'happy' }
  if (streak >= 3) return { text: streak + ' dage i træk. Bliv ved.', mood: 'happy' }
  return { text: 'Klar? Så tager vi den næste.', mood: 'neutral' }
}

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
  const guide = guideLine({ started, next, weak, goalDone: xpToday(state) >= DAILY_GOAL, streak: state.streak.current })

  return (
    <div className="board-page" onClick={() => setOpen(null)}>
      <h1 className="sr-only">Din uddannelse</h1>

      <div className="guide">
        <Mascot mood={guide.mood} size={54} />
        <p>{guide.text}</p>
        {!placed && !started ? (
          <button className="guide-act" onClick={() => navigate('/lesson?placement=1')}>
            Kan du noget i forvejen?
          </button>
        ) : weak.length >= 4 ? (
          <button className="guide-act" onClick={() => navigate('/lesson?refresh=1')}>
            <Icon name="refresh" size={14} /> Genopfrisk {weak.length}
          </button>
        ) : null}
      </div>

      {stages.map((stage, stageIndex) => {
        const done = stageProgress(stage.id, state.lessons)
        const share = done.total ? Math.round((done.done / done.total) * 100) : 0
        const stageUnits = stage.units.map((id) => units.find((unit) => unit.id === id)).filter(Boolean)
        const locked = stageUnits.every((unit) => unitLocked(unit, state.lessons, state.unlocked))
        return (
          <section className={'stage' + (locked ? ' locked' : '') + (done.complete ? ' complete' : '')} key={stage.id}>
            <header className="stage-head">
              <span className="stage-num">{done.complete ? <Icon name="crown" size={16} /> : stage.number}</span>
              <h2>{stage.title}</h2>
              <span className="stage-meter" aria-label={done.done + ' af ' + done.total + ' lektioner'}>
                <i style={{ width: share + '%' }} />
              </span>
              <span className="stage-of">
                {done.done}/{done.total}
              </span>
            </header>

            {stageUnits.map((unit) => (
              <UnitBoard
                key={unit.id}
                unit={unit}
                lessons={state.lessons}
                unlocked={state.unlocked}
                next={next}
                started={started}
                open={open}
                setOpen={setOpen}
              />
            ))}

            <ExamNode stage={stage} exam={examFor(stage.id, state.lessons, state.unlocked)} />

          </section>
        )
      })}

      <p className="board-end">
        {progress.done}/{progress.total}
      </p>
    </div>
  )
}


/** Én enhed: overskrift, spor og sten. */
function UnitBoard({ unit, lessons, unlocked, next, started, open, setOpen }) {
  const boardRef = useRef(null)
  const done = unitProgress(unit, lessons)
  const isLocked = unitLocked(unit, lessons, unlocked)
  const active = unit.lessons.some((lesson) => lesson.id === next?.id)

  return (
    <div className="unit" style={{ '--u': unit.color }}>
      <div className={'unit-bar' + (isLocked ? ' locked' : '') + (active ? ' active' : '') + (done.done === done.total ? ' complete' : '')}>
        <span className="unit-tag" aria-hidden="true" />
        <span className="unit-name">{unit.title}</span>
        {done.done === done.total ? <span className="stamp">Gennemført</span> : null}
        {active ? <span className="unit-note">{unit.blurb}</span> : null}
        <span className="unit-dots" aria-label={done.done + ' af ' + done.total}>
          {unit.lessons.map((lesson) => (
            <i key={lesson.id} className={cleared(lesson, lessons[lesson.id]) ? 'on' : ''} />
          ))}
        </span>
        {isLocked ? (
          <button
            className="unit-jump"
            title={'Springtest: ' + JUMP_SIZE + ' opgaver'}
            onClick={(event) => {
              event.stopPropagation()
              navigate('/lesson?jump=' + unit.id)
            }}
          >
            <Icon name="skip" size={15} />
          </button>
        ) : null}
      </div>

      <div className="board" ref={boardRef}>
        <Trail containerRef={boardRef} count={unit.lessons.length} doneCount={done.done} dep={open} />
        {unit.lessons.map((lesson, lessonIndex) => {
          const status = lessonState(lesson.id, lessons, unlocked)
          const record = lessons[lesson.id]
          const isNext = next?.id === lesson.id
          return (
            <div
              className={'board-row' + (open === lesson.id ? ' popped' : '')}
              data-shift={SHIFTS[lessonIndex % SHIFTS.length]}
              key={lesson.id}
              style={{ '--d': (lessonIndex * 0.06).toFixed(2) + 's' }}
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
                {isNext && open !== lesson.id ? <span className="start-bubble">{started ? 'FORTSÆT' : 'START'}</span> : null}
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
                    <Icon name="lock" size={19} />
                  ) : status === 'done' ? (
                    <Icon name="crown" size={23} strokeWidth={2} />
                  ) : lesson.checkpoint ? (
                    <Icon name="target" size={23} />
                  ) : (
                    <Icon name="play" size={21} />
                  )}
                </button>
                {isNext ? <span className="stone-label">{lesson.title}</span> : null}
                {record ? (
                  <span className="stone-stars" aria-label={record.stars + ' af 3 stjerner'}>
                    {[1, 2, 3].map((star) => (
                      <i key={star} className={star <= record.stars ? 'on' : ''} />
                    ))}
                  </span>
                ) : null}

                {open === lesson.id ? (
                  <NodeCard lesson={lesson} unit={unit} status={status} onClose={() => setOpen(null)} />
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** Trinnets eksamen. Den skal bestås, før næste trin åbner. */
function ExamNode({ stage, exam }) {
  if (!exam) return null
  const locked = exam.status === 'locked'
  const passed = exam.status === 'done'
  return (
    <div className={'exam' + (locked ? ' locked' : '') + (passed ? ' passed' : '')}>
      <span className="exam-mark">
        <Icon name={passed ? 'crown' : locked ? 'lock' : 'shield'} size={20} />
      </span>
      {passed ? <span className="stamp big">Bestået</span> : null}
      <div className="exam-text">
        <b>Eksamen</b>
        <span>{passed ? 'Bestået · ' + exam.record.stars + ' af 3 stjerner' : locked ? 'Klar enhederne først' : exam.size + ' opgaver · 2 stjerner for at bestå'}</span>
      </div>
      <button className="exam-go" disabled={locked} onClick={() => navigate('/lesson?id=' + exam.id)}>
        {passed ? 'Tag igen' : 'Start'}
      </button>
      <span className="sr-only">{stage.title}</span>
    </div>
  )
}

/** Boblen over stenen: navnet, og hvad knappen gør. Ikke mere. */
function NodeCard({ lesson, unit, status, onClose }) {
  const locked = status === 'locked'
  return (
    <div className="node-card" style={{ '--u': unit.color }} onClick={(event) => event.stopPropagation()}>
      <b>{lesson.title}</b>
      <span className="node-meta">
        {locked ? 'Låst' : lesson.checkpoint ? 'Tjek · ' + lesson.size + ' opgaver' : lesson.size + ' opgaver'}
      </span>

      {locked ? (
        <button className="btn-3d ghost sm" onClick={() => navigate('/lesson?jump=' + unit.id)}>
          <Icon name="skip" size={15} /> Springtest
        </button>
      ) : (
        <>
          <button className="btn-3d sm" onClick={() => navigate('/lesson?id=' + lesson.id)}>
            {status === 'done' ? 'Øv igen' : 'Start'}
          </button>
          <button className="node-learn" onClick={() => navigate('/lesson?id=' + lesson.id + '&teach=1')}>
            Læs reglen først
          </button>
        </>
      )}
      <button className="node-close" onClick={onClose} aria-label="Luk">
        <Icon name="x" size={14} />
      </button>
    </div>
  )
}
