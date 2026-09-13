import { useEffect, useMemo, useRef, useState } from 'react'
import Feedback from '../components/Feedback.jsx'
import Icon from '../components/Icon.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import Ring from '../components/Ring.jsx'
import SessionSummary from '../components/SessionSummary.jsx'
import { daItems, daTopics } from '../data/grammar.da.js'
import { enItems, enTopics } from '../data/grammar.en.js'
import SentenceEditor from '../components/SentenceEditor.jsx'
import SectionHead from '../components/SectionHead.jsx'
import { grade } from '../lib/grader.js'
import { editorMode, parsePrompt } from '../lib/items.js'
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

function Drill({ session, onAnswer, onNext, onQuit }) {
  const item = session.items[session.index]
  const correctCount = session.results.filter((entry) => entry.correct).length

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

      <Question
        key={item.id}
        item={item}
        onAnswer={onAnswer}
        onNext={onNext}
        isLast={session.index + 1 === session.items.length}
      />
    </section>
  )
}

function Question({ item, onAnswer, onNext, isLast }) {
  const mode = useMemo(() => editorMode(item), [item])
  const parsed = useMemo(() => parsePrompt(item), [item])
  const [given, setGiven] = useState(() => (mode === 'edit' ? parsed.sentence : ''))
  const [result, setResult] = useState(null)

  function submit(value) {
    if (result) return
    const answer = value ?? given
    if (mode !== 'choice' && !String(answer).trim()) return
    const graded = grade(item, answer)
    setGiven(answer)
    setResult(graded)
    playSound(graded.correct ? 'correct' : 'wrong')
    onAnswer(item, graded.correct, answer)
  }

  // Tastaturstyring: 1-4 vælger svar, Enter svarer og går videre.
  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Enter') {
        if (result) {
          event.preventDefault()
          scrollTop()
          onNext()
        }
        return
      }
      if (result || mode !== 'choice') return
      const number = Number(event.key)
      if (Number.isInteger(number) && number >= 1 && number <= item.options.length) {
        event.preventDefault()
        submit(item.options[number - 1])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const canSubmit = mode === 'choice' || Boolean(String(given).trim())

  return (
    <>
      <p className="task-instruction">{parsed.instruction || item.prompt}</p>
      {parsed.trailing ? <p className="small muted" style={{ marginTop: '-0.4rem' }}>{parsed.trailing}</p> : null}

      {mode === 'choice' ? (
        <>
          {parsed.sentence ? (
            <p className="sentence">
              {parsed.hasBlank ? (
                <>
                  {parsed.sentence.split('____')[0]}
                  <span className={'blank-slot' + (result ? ' filled' : '')}>{result ? given : '?'}</span>
                  {parsed.sentence.split('____')[1]}
                </>
              ) : (
                parsed.sentence
              )}
            </p>
          ) : null}
          <div className="choices">
            {item.options.map((option, index) => {
              let className = 'choice'
              let mark = null
              if (result) {
                if (option === item.answer) {
                  className += ' correct'
                  mark = 'check'
                } else if (option === given) {
                  className += ' wrong'
                  mark = 'x'
                }
              }
              return (
                <button
                  key={option}
                  className={className}
                  style={{ '--i': index }}
                  onClick={() => submit(option)}
                  disabled={Boolean(result)}
                >
                  <span className="key">{index + 1}</span>
                  <span className="choice-text">{option}</span>
                  {mark ? <Icon name={mark} size={18} strokeWidth={2.4} className="mark" /> : null}
                </button>
              )
            })}
          </div>
        </>
      ) : (
        <SentenceEditor
          item={item}
          mode={mode}
          value={given}
          onChange={setGiven}
          onSubmit={() => submit()}
          locked={Boolean(result)}
        />
      )}

      {result ? <Feedback item={item} result={result} given={given} /> : null}

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
          <button className="primary btn-lg" onClick={() => submit()} disabled={!canSubmit}>
            <Icon name="check" size={18} /> Svar
          </button>
        )}
        <span className="small muted row" style={{ gap: '0.35rem' }}>
          <Icon name="keyboard" size={15} />
          {mode === 'choice' ? (
            <>
              <span className="kbd">1</span>–<span className="kbd">{item.options.length}</span> vælger ·
            </>
          ) : null}
          <span className="kbd">Enter</span> {result ? 'går videre' : 'svarer'}
        </span>
      </div>
    </>
  )
}
