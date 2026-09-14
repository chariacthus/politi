import { useEffect, useMemo, useRef, useState } from 'react'
import Exercise from '../components/Exercise.jsx'
import Icon from '../components/Icon.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import Ring from '../components/Ring.jsx'
import { allLessons, units } from '../data/path.js'
import { buildLesson, scoreLesson } from '../lib/lessons.js'
import { scrollTop } from '../lib/media.js'
import { Link, navigate } from '../lib/router.jsx'
import { play as playSound } from '../lib/sound.js'
import { useProgress } from '../lib/state.jsx'
import { voicePreference } from '../lib/voice.js'

export default function Lesson({ params }) {
  const { state, recordAnswer, recordLesson } = useProgress()
  const lesson = allLessons.find((entry) => entry.id === params.id)
  const unit = units.find((entry) => entry.id === lesson?.unitId)

  const [queue, setQueue] = useState(() => (lesson ? buildLesson(lesson, state.items, { voice: voicePreference() }) : []))
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState([])
  const [current, setCurrent] = useState(null)
  const [done, setDone] = useState(false)
  const startedAt = useRef(Date.now())
  const reported = useRef(false)

  const item = queue[index]
  const total = queue.length

  useEffect(() => {
    if (!done || reported.current || results.length === 0) return
    reported.current = true
    const score = scoreLesson(results, total)
    recordLesson(lesson.id, {
      stars: score.stars,
      xp: score.xp,
      correct: score.correct,
      asked: results.length,
      seconds: Math.round((Date.now() - startedAt.current) / 1000),
    })
    playSound(score.perfect ? 'done' : 'correct')
  }, [done, results, total, lesson, recordLesson])

  if (!lesson) {
    return (
      <section className="card">
        <h1>Lektionen findes ikke</h1>
        <Link className="btn" to="/">
          Tilbage til forløbet
        </Link>
      </section>
    )
  }

  function answer(outcome) {
    if (current) return
    // En sprunget stemmeøvelse tæller hverken for eller imod: den skal ikke
    // koste en stjerne, og den skal ikke registreres som kunnen.
    if (!outcome.skipped) {
      playSound(outcome.correct ? 'correct' : 'wrong')
      recordAnswer(item.id, outcome.correct)
    }
    setCurrent(outcome)
    setResults((prev) => [...prev, { item, ...outcome }])
  }

  function next() {
    setCurrent(null)
    // Forkerte opgaver stilles igen sidst i lektionen — én gang.
    if (!current?.correct && !item.repeated) {
      setQueue((prev) => [...prev, { ...item, repeated: true }])
    }
    if (index + 1 >= queue.length) setDone(true)
    else setIndex(index + 1)
    scrollTop()
  }

  if (done) {
    const score = scoreLesson(results, total)
    const wrong = results.filter((entry) => !entry.correct)
    const lessonIndex = allLessons.findIndex((entry) => entry.id === lesson.id)
    const upcoming = allLessons[lessonIndex + 1]

    return (
      <>
        <section className="card focus-card">
          <div className="row" style={{ gap: '1.5rem' }}>
            <div className="pop">
              <Ring value={score.correct} max={results.length || 1} size={104} thickness={9} label={'+' + score.xp} sub="xp" />
            </div>
            <div style={{ flex: '1 1 220px' }}>
              <span className="eyebrow">{unit?.title}</span>
              <h1 style={{ fontSize: 'var(--t-3)' }}>{lesson.title}</h1>
              <div className="stars" aria-label={score.stars + ' af 3 stjerner'}>
                {[1, 2, 3].map((star) => (
                  <Icon key={star} name="spark" size={22} className={star <= score.stars ? 'star on' : 'star'} />
                ))}
              </div>
              <p style={{ marginBottom: 0 }}>
                {score.correct} af {results.length} rigtige{score.perfect ? ' — uden en eneste fejl.' : '.'}
              </p>
            </div>
          </div>

          <div className="row mt">
            {upcoming ? (
              <button className="primary btn-lg" onClick={() => navigate('/lesson?id=' + upcoming.id)}>
                Næste lektion <Icon name="arrow" size={18} />
              </button>
            ) : null}
            <button onClick={() => navigate('/')}>
              <Icon name="back" size={17} /> Til forløbet
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                reported.current = false
                setQueue(buildLesson(lesson, state.items, { voice: voicePreference() }))
                setIndex(0)
                setResults([])
                setDone(false)
                startedAt.current = Date.now()
              }}
            >
              <Icon name="refresh" size={17} /> Tag den igen
            </button>
          </div>
        </section>

        {wrong.length > 0 ? (
          <section className="card focus-card">
            <h2>Det, der drillede</h2>
            <ul className="list-reset stacklist">
              {wrong.map((entry, i) => (
                <li key={entry.item.id + i}>
                  <div className="small muted">{entry.item.prompt}</div>
                  <div>
                    Rigtigt svar: <strong>{formatExpected(entry)}</strong>
                  </div>
                  <div className="small muted">{entry.item.rule}</div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </>
    )
  }

  return (
    <section className="card focus-card lesson-card">
      <div className="lesson-head">
        <button className="btn-ghost icon-btn" onClick={() => navigate('/')} aria-label="Forlad lektionen">
          <Icon name="x" size={18} />
        </button>
        <ProgressBar value={index} max={total} tone="" />
        <span className="chip">
          {index + 1}/{total}
        </span>
      </div>

      <div className="lesson-meta">
        <span className="eyebrow">{unit?.title}</span>
        <span className="chip">{lesson.checkpoint ? 'tjek' : lesson.title}</span>
      </div>

      <Exercise key={item.id + index} item={item} locked={Boolean(current)} result={current} onAnswer={answer} />

      {current ? (
        <>
          <div className={'feedback ' + (current.skipped ? '' : current.correct ? 'ok' : 'bad')}>
            <div className="verdict">
              <Icon name={current.skipped ? 'arrow' : current.correct ? 'check' : 'x'} size={20} strokeWidth={2.4} />
              {current.skipped ? 'Sprunget over' : current.correct ? 'Rigtigt' : 'Ikke helt'}
            </div>
            {!current.correct ? (
              <p>
                Rigtigt svar: <strong>{formatExpected({ item, ...current })}</strong>
              </p>
            ) : null}
            {current.missing?.length ? (
              <ul className="small">
                {current.missing.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : null}
            <div className="rule-card">
              <div className="rule-line">
                <Icon name="bulb" size={18} />
                <div>
                  <span className="eyebrow">Hvorfor</span>
                  <p>{item.rule}</p>
                </div>
              </div>
              {item.example ? (
                <div className="rule-line">
                  <Icon name="quote" size={18} />
                  <div>
                    <span className="eyebrow">Eksempel</span>
                    <p>{item.example}</p>
                  </div>
                </div>
              ) : null}
              <Link className="small rule-more" to={ruleLink(item)}>
                Læs hele reglen →
              </Link>
            </div>
          </div>

          <button className="primary btn-lg mt" onClick={next}>
            {index + 1 >= queue.length ? 'Afslut lektionen' : 'Fortsæt'} <Icon name="arrow" size={18} />
          </button>
        </>
      ) : null}
    </section>
  )
}

function ruleLink(item) {
  if (item.lang) return `/rules?lang=${item.lang}&topic=${item.topic}`
  return `/rules?bank=police&topic=${item.topic}`
}

function formatExpected(entry) {
  const { item } = entry
  if (item.type === 'tf') return item.answer ? 'Sandt' : 'Falsk'
  if (item.type === 'order') return item.answer
  if (item.type === 'spot') return item.wrong
  if (item.type === 'sort') return item.tokens.map((token) => `${token.text} → ${token.bucket}`).join(' · ')
  if (item.type === 'match') return item.pairs.map((pair) => `${pair[0]} → ${pair[1]}`).join(' · ')
  if (item.type === 'speak') return item.target
  return item.answer
}
