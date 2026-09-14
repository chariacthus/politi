import { useEffect, useMemo, useRef, useState } from 'react'
import Confetti from '../components/Confetti.jsx'
import CountUp from '../components/CountUp.jsx'
import Exercise from '../components/Exercise.jsx'
import Icon from '../components/Icon.jsx'
import Mascot from '../components/Mascot.jsx'
import Teach from '../components/Teach.jsx'
import { daTopics } from '../data/grammar.da.js'
import { enTopics } from '../data/grammar.en.js'
import { allLessons, stages, units } from '../data/path.js'
import { policeTopics } from '../data/police.js'
import {
  JUMP_PASS,
  stageProgress,
  buildLesson,
  jumpTest,
  placementResult,
  placementTest,
  refreshLesson,
  scoreLesson,
  teachFor,
  unitsUpTo,
} from '../lib/lessons.js'
import { plural, scrollTop } from '../lib/media.js'
import { Link, navigate } from '../lib/router.jsx'
import { play as playSound } from '../lib/sound.js'
import { useProgress } from '../lib/state.jsx'
import { voicePreference } from '../lib/voice.js'

const HEARTS = 5

const CHEERS = ['Flot!', 'Præcis.', 'Den sad.', 'Godt set.', 'Lige i skabet.', 'Korrekt.']
const MISSES = ['Ikke helt.', 'Tæt på.', 'Nej — se her.', 'Den var svær.']

export default function Lesson({ params }) {
  const { state, recordAnswer, recordLesson, unlockUnit, recordPlacement } = useProgress()
  // Fire slags sessioner: lektionen, springtesten på en enhed, niveautesten
  // ved start og genopfriskningen af det, der driller.
  const mode = params.placement === '1' ? 'placement' : params.refresh === '1' ? 'refresh' : params.jump ? 'jump' : 'lesson'
  const jumpUnit = mode === 'jump' ? units.find((entry) => entry.id === params.jump) : null

  // Opgavesættet lægges fast, når siden åbnes — ikke hver gang svarene ændrer sig.
  const lesson = useMemo(() => {
    if (mode === 'placement') return placementTest()
    if (mode === 'refresh') return refreshLesson(state.items, { voice: voicePreference() })
    if (mode === 'jump') return jumpUnit ? jumpTest(jumpUnit) : null
    return allLessons.find((entry) => entry.id === params.id) || null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const unit = jumpUnit || units.find((entry) => entry.id === lesson?.unitId)
  const plain = mode === 'lesson'

  // Forklaringen kommer først, når lektionen er ny — eller når man beder om den.
  const teach = useMemo(() => (lesson && plain ? teachFor(lesson) : []), [lesson, plain])
  const [teaching, setTeaching] = useState(
    () => plain && teachFor(allLessons.find((entry) => entry.id === params.id) || { sources: [] }).length > 0 &&
      (params.teach === '1' || !state.lessons[params.id]),
  )
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
  const outOfHearts = hearts <= 0 && !done && mode !== 'placement'

  const score = useMemo(() => scoreLesson(results, total || 1), [results, total])

  const passedJump = Boolean(jumpUnit) && score.asked > 0 && score.correct / score.asked >= JUMP_PASS

  const placement = useMemo(() => (mode === 'placement' && done ? placementResult(results) : null), [mode, done, results])

  useEffect(() => {
    if (!done || reported.current || results.length === 0) return
    reported.current = true
    if (jumpUnit && passedJump) unlockUnit(unitsUpTo(jumpUnit.id))
    if (placement) {
      if (placement.unitIds.length > 0) unlockUnit(placement.unitIds)
      recordPlacement({ correct: placement.correct, asked: placement.asked, reached: placement.reached })
    }
    recordLesson(lesson.id, {
      stars: score.stars,
      xp: score.xp,
      correct: score.correct,
      asked: results.length,
      seconds: Math.round((Date.now() - startedAt.current) / 1000),
    })
    playSound('done')
  }, [done, results, score, lesson, recordLesson, jumpUnit, passedJump, unlockUnit, placement, recordPlacement])

  // Enter fører videre, når svaret er afgivet — hele vejen gennem lektionen.
  useEffect(() => {
    function onKey(event) {
      if (event.key !== 'Enter' || !current || teaching) return
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
          <Mascot mood="neutral" size={104} />
          <h1>{mode === 'refresh' ? 'Ikke nok at genopfriske endnu' : 'Lektionen findes ikke'}</h1>
          <p className="lead">
            {mode === 'refresh'
              ? 'Genopfriskningen samler de opgaver, der driller. Tag et par lektioner først, så har den noget at arbejde med.'
              : 'Linket peger på noget, der ikke findes. Gå tilbage til stien og vælg en lektion.'}
          </p>
          <Link className="btn-3d" to="/">
            Til stien
          </Link>
        </div>
      </div>
    )
  }

  function restart() {
    reported.current = false
    setTeaching(false)
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
      // Niveautesten må ikke flytte på gentagelsessystemet — den måler kun.
      if (mode !== 'placement') recordAnswer(item.id, outcome.correct)
      if (!outcome.correct && mode !== 'placement') {
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
    // Sprunget over? Så kommer den ikke igen — du valgte den fra med vilje.
    const wasWrong = current && !current.correct && !current.skipped
    setCurrent(null)
    // Den, der gik galt, kommer igen sidst i lektionen — én gang.
    if (wasWrong && !item.repeated) setQueue((prev) => [...prev, { ...item, repeated: true }])
    if (index + 1 >= queue.length) setDone(true)
    else setIndex(index + 1)
    scrollTop()
  }

  if (teaching) {
    return (
      <div className="play">
        <div className="play-bar">
          <button className="quit" onClick={() => navigate('/')} aria-label="Forlad lektionen">
            <Icon name="x" size={22} />
          </button>
          <div className="track">
            <div style={{ width: '0%' }} />
          </div>
          <span className="chip">{unit?.title}</span>
        </div>
        <Teach
          title={lesson.title}
          entries={teach}
          onStart={() => {
            setTeaching(false)
            scrollTop()
          }}
          onSkip={() => {
            setTeaching(false)
            scrollTop()
          }}
        />
      </div>
    )
  }

  if (outOfHearts) {
    return (
      <div className="play">
        <div className="celebrate">
          <Mascot mood="sad" size={116} />
          <h1>{jumpUnit ? 'Springtesten stoppede her' : 'Livene er brugt op'}</h1>
          <p className="lead">
            Du nåede {plural(results.filter((entry) => entry.correct).length, 'rigtig', 'rigtige')}.{' '}
            {jumpUnit
              ? 'Fem fejl, og testen stopper. Tag enheden på stien — den lærer dig stoffet undervejs.'
              : 'Læs reglen igennem, og tag den igen — det er sådan, det sætter sig.'}
          </p>
          <div className="row" style={{ justifyContent: 'center', marginTop: '1.2rem' }}>
            <button className="btn-3d" onClick={restart}>
              <Icon name="refresh" size={18} /> Prøv igen
            </button>
            <button className="btn-3d ghost" onClick={() => navigate('/')}>
              Til stien
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Hvilket emne gik mest galt? Det er dét, forklaringen skal pege på.
  const weakest = (() => {
    const misses = results.filter((entry) => !entry.correct && !entry.skipped)
    if (misses.length === 0) return null
    const byTopic = {}
    for (const entry of misses) {
      const key = (entry.item.lang || 'police') + ':' + entry.item.topic
      byTopic[key] = byTopic[key] || { count: 0, item: entry.item }
      byTopic[key].count += 1
    }
    const top = Object.values(byTopic).sort((a, b) => b.count - a.count)[0]
    const item = top.item
    const title = topicTitle(item)
    return { count: top.count, title, link: ruleLink(item) }
  })()

  const wrongList = results.some((entry) => !entry.correct) ? (
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
  ) : null

  if (done && placement) {
    const stage = placement.startStage
    return (
      <div className="play">
        <div className="celebrate">
          <Confetti />
          <Mascot mood="happy" size={116} />
          <span className="eyebrow">Niveautest</span>
          <h1>Du starter på trin {stage.number}</h1>
          <p className="lead">
            {placement.correct} af {placement.asked} rigtige. {stage.title} — {stage.blurb}
          </p>

          <div className="stage-ladder" aria-hidden="true">
            {[1, 2, 3, 4].map((step) => (
              <span key={step} className={'rung' + (step < stage.number ? ' passed' : step === stage.number ? ' here' : '')}>
                {step}
              </span>
            ))}
          </div>

          <p className="small muted" style={{ maxWidth: '46ch', margin: '0 auto' }}>
            {placement.reached === 0
              ? 'Vi starter helt fra begyndelsen. Det er det rigtige sted at starte — resten bygger oven på det.'
              : `De første ${placement.reached === 1 ? 'trin' : placement.reached + ' trin'} er låst op. Du kan altid gå tilbage og tage dem for stjernerne.`}
          </p>

          <div className="row" style={{ justifyContent: 'center', marginTop: '1.2rem' }}>
            <button className="btn-3d" onClick={() => navigate('/')}>
              Kom i gang <Icon name="arrow" size={18} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (done && jumpUnit) {
    const share = score.asked > 0 ? Math.round((score.correct / score.asked) * 100) : 0
    return (
      <div className="play">
        <div className="celebrate">
          {passedJump ? <Confetti /> : null}
          <Mascot mood={passedJump ? 'happy' : 'sad'} size={116} />
          <h1>{passedJump ? 'Springtest bestået' : 'Ikke bestået'}</h1>
          <span className="eyebrow">Enhed {jumpUnit.number} · {jumpUnit.title}</span>
          <p className="lead">
            {passedJump
              ? `Du ramte ${share} % — enhed 1 til ${jumpUnit.number} er nu åbne. Du kan stadig tage lektionerne for stjernerne.`
              : `Du ramte ${share} %, og der skal ${Math.round(JUMP_PASS * 100)} % til. Tag enheden på stien i stedet — det er hurtigere end at gætte.`}
          </p>

          <div className="score-row">
            <div className="score-box gold">
              <span className="label">XP</span>
              <span className="value">
                +<CountUp value={score.xp} />
              </span>
            </div>
            <div className="score-box green">
              <span className="label">Rigtige</span>
              <span className="value">
                {score.correct}/{score.asked}
              </span>
            </div>
            <div className="score-box">
              <span className="label">Krav</span>
              <span className="value">{Math.round(JUMP_PASS * 100)}%</span>
            </div>
          </div>

          <div className="row" style={{ justifyContent: 'center' }}>
            <button className="btn-3d" onClick={() => navigate('/')}>
              Til stien <Icon name="arrow" size={18} />
            </button>
            {!passedJump ? (
              <button className="btn-3d ghost" onClick={restart}>
                <Icon name="refresh" size={18} /> Prøv testen igen
              </button>
            ) : null}
          </div>

          {wrongList}
        </div>
      </div>
    )
  }

  if (done) {
    // Klarede den her lektion hele trinnet? Så skal det fejres for sig.
    const stage = unit ? stages.find((entry) => entry.id === unit.stageId) : null
    const stageDone = stage ? stageProgress(stage.id, { ...state.lessons, [lesson.id]: { stars: score.stars } }) : null
    const justFinishedStage = Boolean(stageDone?.complete && plain)
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

          {justFinishedStage ? (
            <div className="stage-win">
              <span className="badge-num">{stage.number}</span>
              <b>Trin {stage.number} klaret</b>
              <p>
                {stage.title} er gennemført: {stage.goal} Næste trin er åbent.
              </p>
            </div>
          ) : null}

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
              <span className="value">
                +<CountUp value={score.xp} />
              </span>
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
                Til stien
              </button>
            )}
            <button className="btn-3d ghost" onClick={() => navigate('/')}>
              Stop her
            </button>
          </div>

          {weakest ? (
            <div className="card mt plain" style={{ textAlign: 'left' }}>
              <div className="spread">
                <div>
                  <span className="eyebrow">Det her skal du læse igen</span>
                  <b style={{ display: 'block', fontSize: 'var(--t-1)' }}>{weakest.title}</b>
                  <p className="small muted" style={{ margin: '0.2rem 0 0' }}>
                    {weakest.count === 1 ? 'Én opgave gik galt her.' : weakest.count + ' opgaver gik galt her.'} Reglen
                    tager et minut — og så sidder den næste gang.
                  </p>
                </div>
                <Link className="btn-3d ghost sm" to={weakest.link}>
                  <Icon name="bulb" size={16} /> Læs reglen
                </Link>
              </div>
            </div>
          ) : null}

          {wrongList}
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
        {mode === 'placement' ? (
          <span className="chip">
            {index + 1}/{total}
          </span>
        ) : (
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
        )}
      </div>

      <div className={'play-body' + (current && !current.correct && !current.skipped ? ' shake' : '')}>
        <div className="spread" style={{ marginBottom: '0.4rem' }}>
          <span className="eyebrow">{unit?.title || lesson.title}</span>
          <span className="chip">
            {mode === 'placement'
              ? 'niveautest'
              : mode === 'refresh'
                ? 'genopfriskning'
                : jumpUnit
                  ? 'springtest'
                  : lesson.checkpoint
                    ? 'tjek'
                    : lesson.title}
          </span>
        </div>

        <Exercise key={item.id + index} item={item} locked={Boolean(current)} result={current} onAnswer={answer} />

        {!current ? (
          <div className="play-skip">
            <button
              className="skip-btn"
              onClick={() => answer({ correct: false, skipped: true, given: 'sprunget over', expected: formatExpected({ item }) })}
            >
              <Icon name="skip" size={16} /> Spring over
            </button>
            <span className="small muted">Koster ikke et liv — opgaven kommer igen en anden dag.</span>
          </div>
        ) : null}
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
              {!current.correct ? (
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

function topicTitle(item) {
  if (item.lang === 'en') return enTopics.find((entry) => entry.id === item.topic)?.title || item.topic
  if (item.lang === 'da') return daTopics.find((entry) => entry.id === item.topic)?.title || item.topic
  return policeTopics.find((entry) => entry.id === item.topic)?.title || item.topic
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
