import { useEffect, useMemo, useRef, useState } from 'react'
import Feedback from '../components/Feedback.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import SessionSummary from '../components/SessionSummary.jsx'
import { daItems, daTopics } from '../data/grammar.da.js'
import { enItems, enTopics } from '../data/grammar.en.js'
import { grade } from '../lib/grader.js'
import { navigate } from '../lib/router.jsx'
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
      <section className="card">
        <h1>Grammatik</h1>
        <p className="muted">
          Femten opgaver ad gangen. Forkerte svar kommer igen, indtil de sidder fast. Vælg et emne — eller
          træn blandet, når grundreglerne er på plads.
        </p>
        <div className="row">
          <button
            className={lang === 'da' ? 'primary' : undefined}
            onClick={() => {
              setLang('da')
              setTopic('alle')
            }}
          >
            Dansk retskrivning
          </button>
          <button
            className={lang === 'en' ? 'primary' : undefined}
            onClick={() => {
              setLang('en')
              setTopic('alle')
            }}
          >
            Engelsk grammatik
          </button>
        </div>
      </section>

      <section className="card">
        <div className="spread">
          <h2>Emner</h2>
          <span className="small muted">{filtered.length} opgaver valgt</span>
        </div>

        <div className="grid grid-2" style={{ marginTop: '0.75rem' }}>
          <button
            className={'choice' + (topic === 'alle' ? ' selected' : '')}
            onClick={() => setTopic('alle')}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <strong>Blandet</strong>
            <span className="small muted">Alle emner. Systemet vælger ud fra dine svage punkter.</span>
          </button>

          {topics.map((entry) => {
            const stat = stats[entry.id]
            return (
              <button
                key={entry.id}
                className={'choice' + (topic === entry.id ? ' selected' : '')}
                onClick={() => setTopic(entry.id)}
                style={{ flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <strong>{entry.title}</strong>
                <span className="small muted">{entry.blurb}</span>
                <span className="small muted mono">
                  {stat && stat.rate !== null ? Math.round(stat.rate * 100) + ' % korrekte' : 'ikke trænet endnu'}
                </span>
              </button>
            )
          })}
        </div>

        <div className="row" style={{ marginTop: '1rem' }}>
          <button className="primary" onClick={() => start()} disabled={filtered.length === 0}>
            Start session
          </button>
          <button onClick={() => navigate('/progress')}>Se fremskridt</button>
        </div>
      </section>
    </>
  )
}

function Drill({ session, onAnswer, onNext, onQuit }) {
  const item = session.items[session.index]
  const [given, setGiven] = useState('')
  const [result, setResult] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setGiven('')
    setResult(null)
    if (item.type !== 'mc') inputRef.current?.focus()
  }, [item])

  function submit(value) {
    if (result) return
    const answer = value ?? given
    if (item.type !== 'mc' && !String(answer).trim()) return
    const graded = grade(item, answer)
    setGiven(answer)
    setResult(graded)
    onAnswer(item, graded.correct, answer)
  }

  // Tastaturstyring: 1-4 vælger svar, Enter svarer og går videre.
  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Enter') {
        if (result) {
          event.preventDefault()
          onNext()
        }
        return
      }
      if (result || item.type !== 'mc') return
      const number = Number(event.key)
      if (Number.isInteger(number) && number >= 1 && number <= item.options.length) {
        event.preventDefault()
        submit(item.options[number - 1])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <section className="card">
      <div className="spread">
        <span className="progress-line">
          Opgave {session.index + 1} af {session.items.length}
        </span>
        <span className="pill">Niveau {item.level}</span>
      </div>
      <ProgressBar value={session.index} max={session.items.length} tone="" />

      <p className="prompt-box">{item.prompt}</p>

      {item.type === 'mc' ? (
        <div className="choices">
          {item.options.map((option, index) => {
            let className = 'choice'
            if (result) {
              if (option === item.answer) className += ' correct'
              else if (option === given) className += ' wrong'
            }
            return (
              <button key={option} className={className} onClick={() => submit(option)} disabled={Boolean(result)}>
                <span className="key">{index + 1}</span>
                <span>{option}</span>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="field">
          <label htmlFor="answer">
            {item.type === 'fill' ? 'Skriv det manglende ord' : 'Skriv hele sætningen korrekt'}
          </label>
          <input
            id="answer"
            type="text"
            ref={inputRef}
            value={given}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={Boolean(result)}
            onChange={(event) => setGiven(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !result) {
                event.preventDefault()
                submit()
              }
            }}
          />
        </div>
      )}

      {result ? <Feedback item={item} result={result} given={given} /> : null}

      <div className="row" style={{ marginTop: '1rem' }}>
        {result ? (
          <button className="primary" onClick={onNext}>
            {session.index + 1 === session.items.length ? 'Afslut session' : 'Næste opgave'}
          </button>
        ) : (
          <button className="primary" onClick={() => submit()} disabled={item.type !== 'mc' && !given.trim()}>
            Svar
          </button>
        )}
        <button onClick={onQuit}>Afbryd</button>
        <span className="small muted">Tastatur: {item.type === 'mc' ? '1-3 vælger, ' : ''}Enter går videre.</span>
      </div>
    </section>
  )
}
