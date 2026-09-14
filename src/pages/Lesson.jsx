import { useEffect, useMemo, useRef, useState } from 'react'
import Confetti from '../components/Confetti.jsx'
import Exercise from '../components/Exercise.jsx'
import Icon from '../components/Icon.jsx'
import Mascot from '../components/Mascot.jsx'
import { allLessons, units } from '../data/path.js'
import { buildLesson, scoreLesson } from '../lib/lessons.js'
import { scrollTop } from '../lib/media.js'
import { Link, navigate } from '../lib/router.jsx'
import { play as playSound } from '../lib/sound.js'
import { useProgress } from '../lib/state.jsx'
import { voicePreference } from '../lib/voice.js'

const HEARTS = 5

const CHEERS = ['Flot!', 'Præcis.', 'Den sad.', 'Godt set.', 'Lige i skabet.', 'Korrekt.']
const MISSES = ['Ikke helt.', 'Tæt på.', 'Nej — se her.', 'Den var svær.']

export default function Lesson({ params }) {
  const { state, recordAnswer, recordLesson } = useProgress()
  const lesson = allLessons.find((entry) => entry.id === params.id)
  const unit = units.find((entry) => entry.id === lesson?.unitId)

  const [queue, setQueue] = useState(() => (lesson ? buildLesson(lesson, state.items, { voice: voicePreference() }) : []))
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState([])
  const [current, setCurrent] = useState(null)
  const [hearts, setHearts] = useState(HEARTS)
  const [lostHeart, setLostHeart] = useState(false)
  const [wonHeart, setWonHeart] = useState(false)
  const [done, setDone] = useState(false)
  const startedAt = useRef(Date.now())
  const reported = useRef(false)

  const item = queue[index]
  const total = queue.length
  const outOfHearts = hearts <= 0 && !done

  const score = useMemo(() => scoreLesson(results, total || 1), [results, total])

  useEffect(() => {
    if (!done || reported.current || results.length === 0) return
    reported.current = true
    recordLesson(lesson.id, {
      stars: score.stars,
      xp: score.xp,
      correct: score.correct,
      asked: results.length,
      seconds: Math.round((Date.now() - startedAt.current) / 1000),
    })
    playSound('done')
  }, [done, results, score, lesson, recordLesson])

  // Enter fører videre, når svaret er afgivet — hele vejen gennem lektionen.
  useEffect(() => {
    function onKey(event) {
      if (event.key !== 'Enter' || !current) return
      event.preventDefault()
      next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!lesson) {
    return (
      <div className="play">
        <div className="celebrate">
          <h1>Lektionen findes ikke</h1>
          <Link className="btn-3d" to="/">
            Til forløbet
          </Link>
        </div>
      </div>
    )
  }

  function restart() {
    reported.current = false
    setQueue(buildLesson(lesson, state.items, { voice: voicePreference() }))
    setIndex(0)
    setResults([])
    setCurrent(null)
    setHearts(HEARTS)
    setDone(false)
    startedAt.current = Date.now()
    scrollTop()
  }

  function answer(outcome) {
    if (current) return
    if (!outcome.skipped) {
      playSound(outcome.correct ? 'correct' : 'wrong')
      recordAnswer(item.id, outcome.correct)
      if (!outcome.correct) {
        setHearts((left) => Math.max(0, left - 1))
        setLostHeart(true)
        setTimeout(() => setLostHeart(false), 500)
      } else if (item.repeated && hearts < HEARTS) {
        // Retter du den, du fejlede, får du livet tilbage. Det skal kunne betale
        // sig at lære af fejlen frem for at starte forfra.
        setHearts((left) => Math.min(HEARTS, left + 1))
        setWonHeart(true)
        setTimeout(() => setWonHeart(false), 900)
      }
    }
    setCurrent(outcome)
    setResults((prev) => [...prev, { item, ...outcome }])
  }

  function next() {
    const wasWrong = current && !current.correct
    setCurrent(null)
    // Den, der gik galt, kommer igen sidst i lektionen — én gang.
    if (wasWrong && !item.repeated) setQueue((prev) => [...prev, { ...item, repeated: true }])
    if (index + 1 >= queue.length) setDone(true)
    else setIndex(index + 1)
    scrollTop()
  }

  if (outOfHearts) {
    return (
      <div className="play">
        <div className="celebrate">
          <Mascot mood="sad" size={116} />
          <h1>Livene er brugt op</h1>
          <p className="lead">
            Du nåede {results.filter((entry) => entry.correct).length} rigtige. Læs reglen igennem, og tag den
            igen — det er sådan, det sætter sig.
          </p>
          <div className="row" style={{ justifyContent: 'center', marginTop: '1.2rem' }}>
            <button className="btn-3d" onClick={restart}>
              <Icon name="refresh" size={18} /> Prøv igen
            </button>
            <button className="btn-3d ghost" onClick={() => navigate('/')}>
              Til forløbet
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (done) {
    const lessonIndex = allLessons.findIndex((entry) => entry.id === lesson.id)
    const upcoming = allLessons[lessonIndex + 1]
    const cheer = score.perfect
      ? 'Fejlfrit. Sådan skal det se ud.'
      : score.stars === 2
        ? 'Godt gået — næsten hele vejen.'
        : 'Klaret. Tag den igen for flere stjerner.'

    return (
      <div className="play">
        <div className="celebrate">
          {score.stars === 3 ? <Confetti /> : null}
          <Mascot mood={score.stars >= 2 ? 'happy' : 'neutral'} size={116} />
          <div className="speech" style={{ marginTop: '0.6rem' }}>
            {cheer}
          </div>

          <h1>{lesson.checkpoint ? 'Tjek bestået' : 'Lektion klaret'}</h1>
          <span className="eyebrow">
            {unit?.title} · {lesson.title}
          </span>

          <div className="big-stars">
            {[1, 2, 3].map((star) => (
              <Icon key={star} name="spark" size={38} className={star <= score.stars ? 'star on' : 'star'} />
            ))}
          </div>

          <div className="score-row">
            <div className="score-box gold">
              <span className="label">XP</span>
              <span className="value">+{score.xp}</span>
            </div>
            <div className="score-box green">
              <span className="label">Rigtige</span>
              <span className="value">
                {score.correct}/{results.length}
              </span>
            </div>
            <div className="score-box">
              <span className="label">Liv tilbage</span>
              <span className="value">{hearts}</span>
            </div>
          </div>

          <div className="row" style={{ justifyContent: 'center' }}>
            {upcoming ? (
              <button className="btn-3d" onClick={() => navigate('/lesson?id=' + upcoming.id)}>
                Næste lektion <Icon name="arrow" size={18} />
              </button>
            ) : (
              <button className="btn-3d" onClick={() => navigate('/')}>
                Til forløbet
              </button>
            )}
            <button className="btn-3d ghost" onClick={() => navigate('/')}>
              Stop her
            </button>
          </div>

          {results.some((entry) => !entry.correct) ? (
            <div className="card mt" style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: 'var(--t-1)' }}>Det, der drillede</h2>
              <ul className="list-reset stacklist">
                {results
                  .filter((entry) => !entry.correct)
                  .map((entry, i) => (
                    <li key={entry.item.id + i}>
                      <div className="small muted">{entry.item.prompt}</div>
                      <div>
                        Rigtigt: <strong>{formatExpected(entry)}</strong>
                      </div>
                      <div className="small muted">{entry.item.rule}</div>
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="play">
      <div className="play-bar">
        <button className="quit" onClick={() => navigate('/')} aria-label="Forlad lektionen">
          <Icon name="x" size={22} />
        </button>
        <div className="track">
          <div style={{ width: Math.round((index / Math.max(1, total)) * 100) + '%' }} />
        </div>
        <div className="hearts" aria-label={hearts + ' liv tilbage'}>
          {Array.from({ length: HEARTS }).map((_, i) => (
            <Icon
              key={i}
              name="heart"
              size={20}
              className={
                'heart' +
                (i >= hearts ? ' gone' : '') +
                (lostHeart && i === hearts ? ' lost' : '') +
                (wonHeart && i === hearts - 1 ? ' won' : '')
              }
            />
          ))}
        </div>
      </div>

      <div className={'play-body' + (current && !current.correct && !current.skipped ? ' shake' : '')}>
        <div className="spread" style={{ marginBottom: '0.4rem' }}>
          <span className="eyebrow">{unit?.title}</span>
          <span className="chip">{lesson.checkpoint ? 'tjek' : lesson.title}</span>
        </div>

        <Exercise key={item.id + index} item={item} locked={Boolean(current)} result={current} onAnswer={answer} />
      </div>

      {current ? (
        <div className={'verdict-bar ' + (current.skipped ? '' : current.correct ? 'ok' : 'bad')}>
          <div className="verdict-inner">
            <Mascot mood={current.skipped ? 'neutral' : current.correct ? 'happy' : 'sad'} size={58} />
            <div className="verdict-text">
              <div className="verdict-title">
                <Icon name={current.skipped ? 'arrow' : current.correct ? 'check' : 'x'} size={22} strokeWidth={2.6} />
                {current.skipped ? 'Sprunget over' : current.correct ? pick(CHEERS, index) : pick(MISSES, index)}
              </div>
              {!current.correct && !current.skipped ? (
                <p>
                  Rigtigt svar: <span className="answer">{formatExpected({ item, ...current })}</span>
                </p>
              ) : null}
              {wonHeart ? (
                <p className="answer">
                  <Icon name="heart" size={14} /> Du fik et liv tilbage.
                </p>
              ) : null}
              {current.missing?.length ? <p>{current.missing.join(' ')}</p> : null}
              <p>{item.rule}</p>
              <Link className="small" to={ruleLink(item)}>
                Læs hele reglen →
              </Link>
            </div>
            <div className="verdict-actions">
              <button className={'btn-3d ' + (current.correct || current.skipped ? 'ok' : 'bad')} onClick={next}>
                {index + 1 >= queue.length ? 'Afslut' : 'Fortsæt'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function pick(list, seed) {
  return list[seed % list.length]
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
