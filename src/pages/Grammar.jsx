import { useEffect, useMemo, useRef, useState } from 'react'
import Exercise from '../components/Exercise.jsx'
import Feedback from '../components/Feedback.jsx'
import Icon from '../components/Icon.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import Ring from '../components/Ring.jsx'
import SectionHead from '../components/SectionHead.jsx'
import SessionSummary from '../components/SessionSummary.jsx'
import { daItems, daTopics } from '../data/grammar.da.js'
import { enItems, enTopics } from '../data/grammar.en.js'
import { scrollTop } from '../lib/media.js'
import { play as playSound } from '../lib/sound.js'
import { buildSession, topicStats } from '../lib/srs.js'
import { useProgress } from '../lib/state.jsx'

const SESSION_SIZE = 15

export function poolFor(lang) {
  return lang === 'en' ? enItems : daItems
}

export function topicsFor(lang) {
  return lang === 'en' ? enTopics : daTopics
}

export default function Grammar({ params }) {
  const { state, recordAnswer, recordSession } = useProgress()
  const [lang, setLang] = useState(params.lang === 'en' ? 'en' : 'da')
  const [topic, setTopic] = useState(params.topic || 'alle')
  const [session, setSession] = useState(null)
  const startedAt = useRef(0)

  const pool = poolFor(lang)
  const topics = topicsFor(lang)

  const filtered = useMemo(
    () => (topic === 'alle' ? pool : pool.filter((item) => item.topic === topic)),
    [pool, topic],
  )

  const stats = useMemo(() => {
    const byKey = {}
    for (const entry of topicStats(pool, state.items)) byKey[entry.topic] = entry
    return byKey
  }, [pool, state.items])

  function start(nextTopic = topic, nextLang = lang) {
    const nextPool = nextTopic === 'alle' ? poolFor(nextLang) : poolFor(nextLang).filter((i) => i.topic === nextTopic)
    const items = buildSession(nextPool, state.items, SESSION_SIZE)
    if (items.length === 0) return
    startedAt.current = Date.now()
    setSession({ items, index: 0, results: [] })
  }

  // Et link som #/grammar?lang=da&topic=kommatering&start=1 springer direkte i gang.
  const autoStart = params.start === '1'
  useEffect(() => {
    if (!autoStart || session) return
    start(params.topic || 'alle', params.lang === 'en' ? 'en' : 'da')
    // Kun ved første render med start-parameteren.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart])

  function finish(results) {
    recordSession({
      module: 'grammatik',
      lang,
      topic,
      asked: results.length,
      correct: results.filter((entry) => entry.correct).length,
      seconds: Math.round((Date.now() - startedAt.current) / 1000),
    })
  }

  if (session && session.index < session.items.length) {
    return (
      <Drill
        session={session}
        onAnswer={(item, correct, given) => {
          recordAnswer(item.id, correct)
          setSession((prev) => ({ ...prev, results: [...prev.results, { item, correct, given }] }))
        }}
        onNext={() => {
          // Registreringen sker her og ikke inde i state-opdateringen: React kan kalde
          // en updater-funktion flere gange, og så ville sessionen blive gemt dobbelt.
          if (session.index + 1 >= session.items.length) finish(session.results)
          setSession((prev) => ({ ...prev, index: prev.index + 1 }))
        }}
        onQuit={() => setSession(null)}
      />
    )
  }

  if (session) {
    return (
      <SessionSummary
        results={session.results}
        onRestart={() => start()}
        onExit={() => setSession(null)}
        exitLabel="Vælg andet emne"
      />
    )
  }

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Træning</span>
        <h1>Grammatik</h1>
        <p>
          Femten opgaver ad gangen. Forkerte svar kommer igen, indtil de sidder fast. Vælg et emne — eller træn
          blandet, når grundreglerne er på plads.
        </p>
      </div>

      <section className="card">
        <SectionHead
          title="Vælg emne"
          tail={
            <span className="chip">
              <Icon name="layers" size={13} /> {filtered.length} opgaver
            </span>
          }
        />
        <div className="spread">
          <div className="segmented">
            <button
              className={lang === 'da' ? 'on' : ''}
              onClick={() => {
                setLang('da')
                setTopic('alle')
              }}
            >
              Dansk
            </button>
            <button
              className={lang === 'en' ? 'on' : ''}
              onClick={() => {
                setLang('en')
                setTopic('alle')
              }}
            >
              Engelsk
            </button>
          </div>
          <span className="small muted">
            Sessionen sammensættes af forfaldne gentagelser og nyt stof.
          </span>
        </div>

        <div className="grid grid-2 mt">
          <button className={'pick' + (topic === 'alle' ? ' on' : '')} onClick={() => setTopic('alle')}>
            <div className="pick-head">
              <Icon name="spark" size={18} style={{ color: 'var(--accent)' }} />
              <b>Blandet</b>
            </div>
            <span className="pick-desc">
              Alle emner. Systemet prioriterer det, du er svagest i, og det der er forfaldent til gentagelse.
            </span>
          </button>

          {topics.map((entry) => {
            const stat = stats[entry.id]
            const rate = stat && stat.rate !== null ? Math.round(stat.rate * 100) : null
            return (
              <button
                key={entry.id}
                className={'pick' + (topic === entry.id ? ' on' : '')}
                onClick={() => setTopic(entry.id)}
              >
                <div className="pick-head">
                  <b>{entry.title}</b>
                  {rate === null ? (
                    <span className="chip" style={{ marginLeft: 'auto' }}>ny</span>
                  ) : (
                    <span
                      className={'chip ' + (rate >= 85 ? 'good' : rate >= 60 ? 'warn' : 'error')}
                      style={{ marginLeft: 'auto' }}
                    >
                      {rate} %
                    </span>
                  )}
                </div>
                <span className="pick-desc">{entry.blurb}</span>
                <div className="pick-foot">
                  <ProgressBar value={stat ? stat.mastered : 0} max={stat ? stat.total : 1} tone="ok" thin />
                  <span className="small muted num" style={{ flex: 'none' }}>
                    {stat ? stat.mastered : 0}/{stat ? stat.total : 0}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="row mt">
          <button className="primary btn-lg" onClick={() => start()} disabled={filtered.length === 0}>
            <Icon name="play" size={18} /> Start session
          </button>
          <span className="small muted">
            {Math.min(SESSION_SIZE, filtered.length)} opgaver · ca. {Math.max(3, Math.round(Math.min(SESSION_SIZE, filtered.length) * 0.5))} minutter
          </span>
        </div>
      </section>
    </>
  )
}

/**
 * Selve opgavefladen i fri træning. Opgaven tegnes af den fælles
 * Exercise-komponent — samme kode som i lektionerne, så en opgavetype kun
 * findes ét sted.
 */
function Drill({ session, onAnswer, onNext, onQuit }) {
  const item = session.items[session.index]
  const [result, setResult] = useState(null)
  const correctCount = session.results.filter((entry) => entry.correct).length
  const isLast = session.index + 1 === session.items.length

  // Nyt spørgsmål: ryd det forrige resultat.
  useEffect(() => {
    setResult(null)
  }, [session.index])

  // Enter fører videre, når der er svaret.
  useEffect(() => {
    function onKey(event) {
      if (event.key !== 'Enter' || !result) return
      event.preventDefault()
      scrollTop()
      onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function handleAnswer(outcome) {
    if (result) return
    playSound(outcome.correct ? 'correct' : 'wrong')
    setResult(outcome)
    onAnswer(item, outcome.correct, outcome.given)
  }

  return (
    <section className="card focus-card">
      <div className="drill-head">
        <div className="drill-meta">
          <Ring value={session.index} max={session.items.length} size={46} thickness={5} tone="" label={session.index + 1} />
          <div>
            <div className="small muted">
              Opgave {session.index + 1} af {session.items.length}
            </div>
            <div className="small muted num">{correctCount} korrekte indtil nu</div>
          </div>
        </div>
        <div className="row" style={{ gap: '0.4rem' }}>
          <span className="chip">Niveau {item.level}</span>
          <button className="btn-ghost icon-btn" onClick={onQuit} title="Afbryd sessionen" aria-label="Afbryd sessionen">
            <Icon name="x" size={18} />
          </button>
        </div>
      </div>

      <Exercise key={item.id} item={item} locked={Boolean(result)} result={result} onAnswer={handleAnswer} />

      {result ? <Feedback item={item} result={result} given={result.given} /> : null}

      <div className="spread mt">
        {result ? (
          <button
            className="primary btn-lg"
            onClick={() => {
              scrollTop()
              onNext()
            }}
          >
            {isLast ? 'Afslut session' : 'Næste opgave'}
            <Icon name="arrow" size={18} />
          </button>
        ) : (
          <span className="small muted">Svar på opgaven for at komme videre.</span>
        )}
        <span className="small muted row" style={{ gap: '0.35rem' }}>
          <Icon name="keyboard" size={15} />
          {item.type === 'mc' ? (
            <>
              <span className="kbd">1</span>–<span className="kbd">{item.options.length}</span> vælger ·
            </>
          ) : null}
          <span className="kbd">Enter</span> {result ? 'går videre' : 'svarer'}
        </span>
      </div>
    </section>
  )
}
