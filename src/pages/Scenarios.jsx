import { useEffect, useRef, useState } from 'react'
import ProgressBar from '../components/ProgressBar.jsx'
import { maxScore, scenarios } from '../data/scenarios.js'
import { analyzeReply, toneLabel } from '../lib/tone.js'
import { useProgress } from '../lib/state.jsx'

const TENSION = ['', 'rolig', 'spændt', 'ophidset', 'kritisk']

export default function Scenarios() {
  const { state, recordScenario } = useProgress()
  const [active, setActive] = useState(null)

  if (active) {
    return (
      <Play
        scenario={active}
        onDone={(score) => {
          recordScenario(active.id, score)
        }}
        onExit={() => setActive(null)}
      />
    )
  }

  return (
    <>
      <section className="card">
        <h1>Situationer og tone</h1>
        <p className="muted">
          Seks situationer fra almindeligt politiarbejde. For hver replik vælger du et svar — og du kan
          formulere dit eget først. Du får feedback på tone, ordvalg og sprog, og til sidst ser du et modelsvar.
        </p>
        <p className="note small">
          Feedbacken på dine egne formuleringer er regelbaseret. Den fanger typiske fejl i tone og skriftsprog,
          men den kan ikke vurdere en formulering i sin fulde sammenhæng. Brug modelsvaret til at sammenligne.
        </p>
      </section>

      <div className="grid grid-2">
        {scenarios.map((scenario) => {
          const record = state.scenarios[scenario.id]
          return (
            <section className="card" key={scenario.id} style={{ marginBottom: 0 }}>
              <div className="spread">
                <h2>{scenario.title}</h2>
                <span className="pill">{TENSION[scenario.tension]}</span>
              </div>
              <p className="small muted">{scenario.context}</p>
              <div className="spread">
                <span className="small mono muted">
                  {record ? `Bedste: ${record.bestScore} af ${maxScore(scenario)} · ${record.runs} gennemløb` : 'Ikke gennemført'}
                </span>
                <button className="primary" onClick={() => setActive(scenario)}>
                  Start
                </button>
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}

function Play({ scenario, onDone, onExit }) {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState(null)
  const [draft, setDraft] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [done, setDone] = useState(false)
  const reported = useRef(false)

  const turn = scenario.turns[index]

  useEffect(() => {
    setPicked(null)
    setDraft('')
    setAnalysis(null)
  }, [index])

  useEffect(() => {
    if (done && !reported.current) {
      reported.current = true
      onDone(score)
    }
  }, [done, score, onDone])

  if (done) {
    const max = maxScore(scenario)
    return (
      <section className="card">
        <h1>{scenario.title}</h1>
        <div className="spread">
          <span>
            Samlet: <strong className="mono">{score}</strong> af {max} point
          </span>
          <span className="mono">{Math.round((score / max) * 100)} %</span>
        </div>
        <ProgressBar value={score} max={max} />

        <h2 style={{ marginTop: '1.5rem' }}>Principperne i denne situation</h2>
        <ul>
          {scenario.principles.map((principle) => (
            <li key={principle}>{principle}</li>
          ))}
        </ul>

        <div className="row" style={{ marginTop: '1rem' }}>
          <button
            className="primary"
            onClick={() => {
              reported.current = false
              setIndex(0)
              setScore(0)
              setDone(false)
            }}
          >
            Kør igen
          </button>
          <button onClick={onExit}>Tilbage til oversigten</button>
        </div>
      </section>
    )
  }

  return (
    <section className="card">
      <div className="spread">
        <span className="progress-line">
          {scenario.title} — replik {index + 1} af {scenario.turns.length}
        </span>
        <span className="pill">{TENSION[scenario.tension]}</span>
      </div>
      <ProgressBar value={index} max={scenario.turns.length} tone="" />

      {index === 0 ? <p className="small muted" style={{ marginTop: '0.75rem' }}>{scenario.context}</p> : null}

      <div className="situation">
        <div className="who">Situationen</div>
        <div>{turn.situation}</div>
      </div>

      <div className="field">
        <label htmlFor="draft">Hvad siger du? (formulér selv — valgfrit, men det er her træningen ligger)</label>
        <textarea
          id="draft"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Skriv din replik, præcis som du ville sige den."
        />
        <div className="row" style={{ marginTop: '0.5rem' }}>
          <button onClick={() => setAnalysis(analyzeReply(draft, turn))} disabled={!draft.trim()}>
            Analysér min replik
          </button>
        </div>
      </div>

      {analysis ? (
        <div className="feedback">
          <div className="spread">
            <span className="verdict">Tone: {toneLabel(analysis.score)}</span>
            <span className="mono">{analysis.score} / 100</span>
          </div>
          <ProgressBar value={analysis.score} max={100} />
          <div style={{ marginTop: '0.75rem' }}>
            {analysis.findings.map((finding, i) => (
              <div className="finding" key={i}>
                <span className={'tag ' + finding.level}>
                  {finding.level === 'good' ? 'ok' : finding.level === 'warn' ? 'skærp' : 'fejl'}
                </span>
                <span>{finding.text}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <h3 style={{ marginTop: '1.25rem' }}>Vælg det svar, der kommer tættest på dit eget</h3>
      <div className="choices">
        {turn.options.map((option, i) => {
          let className = 'choice'
          if (picked) {
            if (option === picked) className += option.score === 2 ? ' correct' : ' wrong'
            else if (option.score === 2) className += ' correct'
          }
          return (
            <button
              key={i}
              className={className}
              disabled={Boolean(picked)}
              onClick={() => {
                setPicked(option)
                setScore((prev) => prev + option.score)
              }}
            >
              <span className="key">{i + 1}</span>
              <span>{option.text}</span>
            </button>
          )
        })}
      </div>

      {picked ? (
        <div className={'feedback ' + (picked.score === 2 ? 'ok' : 'bad')}>
          <div className="spread">
            <span className="verdict">{picked.score} af 2 point</span>
            <span className="pill">{picked.tone}</span>
          </div>
          <p>{picked.feedback}</p>
          <dl>
            <dt>Modelsvar</dt>
            <dd>{turn.modelAnswer}</dd>
          </dl>
        </div>
      ) : null}

      <div className="row" style={{ marginTop: '1rem' }}>
        {picked ? (
          <button
            className="primary"
            onClick={() => {
              if (index + 1 >= scenario.turns.length) setDone(true)
              else setIndex(index + 1)
            }}
          >
            {index + 1 >= scenario.turns.length ? 'Afslut scenarie' : 'Næste replik'}
          </button>
        ) : null}
        <button onClick={onExit}>Afbryd</button>
      </div>
    </section>
  )
}
