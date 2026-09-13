import { useEffect, useRef, useState } from 'react'
import Icon from '../components/Icon.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import Ring from '../components/Ring.jsx'
import { maxScore, scenarios } from '../data/scenarios.js'
import { analyzeReply, toneLabel } from '../lib/tone.js'
import { play as playSound } from '../lib/sound.js'
import { useProgress } from '../lib/state.jsx'

const TENSION = ['', 'rolig', 'spændt', 'ophidset', 'kritisk']
const SCENARIO_ICON = {
  'sc-faerdsel': 'target',
  'sc-nabostrid': 'scenarios',
  'sc-paaroerende': 'shield',
  'sc-natteliv': 'flame',
  'sc-psykisk': 'bulb',
  'sc-butikstyveri': 'book',
}

function Tension({ level }) {
  return (
    <span className="tension" title={TENSION[level]} aria-label={'Spændingsniveau: ' + TENSION[level]}>
      {[1, 2, 3, 4].map((step) => (
        <i key={step} className={step <= level ? 'on' : ''} />
      ))}
    </span>
  )
}

export default function Scenarios() {
  const { state, recordScenario } = useProgress()
  const [active, setActive] = useState(null)

  if (active) {
    return <Play scenario={active} onDone={(score) => recordScenario(active.id, score)} onExit={() => setActive(null)} />
  }

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Træning</span>
        <h1>Situationer og tone</h1>
        <p>
          Seks situationer fra almindeligt politiarbejde. For hver replik formulerer du dit eget svar og får
          feedback på tone, ordvalg og sprog — derefter vælger du mellem tre svar og ser modelsvaret.
        </p>
      </div>

      <div className="grid grid-2">
        {scenarios.map((scenario) => {
          const record = state.scenarios[scenario.id]
          const max = maxScore(scenario)
          return (
            <section className="card card-flush" key={scenario.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="row" style={{ flexWrap: 'nowrap', gap: '0.7rem' }}>
                <span className="brand-mark" style={{ width: 34, height: 34, borderRadius: 10 }}>
                  <Icon name={SCENARIO_ICON[scenario.id] || 'scenarios'} size={18} />
                </span>
                <h2 style={{ margin: 0, fontSize: 'var(--t-1)' }}>{scenario.title}</h2>
                <span style={{ marginLeft: 'auto' }}>
                  <Tension level={scenario.tension} />
                </span>
              </div>

              <p className="small muted mt-sm" style={{ flex: 1 }}>
                {scenario.context}
              </p>

              <div className="spread">
                {record ? (
                  <span className={'chip ' + (record.bestScore === max ? 'good' : 'warn')}>
                    <Icon name="check" size={13} /> Bedste: {record.bestScore}/{max} · {record.runs} gennemløb
                  </span>
                ) : (
                  <span className="chip">Ikke gennemført</span>
                )}
                <button className="primary" onClick={() => setActive(scenario)}>
                  <Icon name="play" size={16} /> Start
                </button>
              </div>
            </section>
          )
        })}
      </div>

      <div className="note mt">
        <Icon name="bulb" size={16} />
        <span>
          Feedbacken på dine egne formuleringer er regelbaseret. Den fanger typiske fejl i tone og skriftsprog,
          men kan ikke vurdere en replik i sin fulde sammenhæng — brug modelsvaret til at sammenligne.
        </span>
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
    const share = Math.round((score / max) * 100)
    return (
      <>
        <section className="card">
          <div className="row" style={{ gap: '1.5rem' }}>
            <div className="pop">
              <Ring value={score} max={max} size={108} thickness={9} label={score + '/' + max} sub="point" />
            </div>
            <div style={{ flex: '1 1 240px' }}>
              <span className="eyebrow">{scenario.title}</span>
              <h1 style={{ fontSize: 'var(--t-3)' }}>
                {share === 100 ? 'Fejlfrit gennemløb' : share >= 67 ? 'Solidt — men ikke skarpt hele vejen' : 'Tonen skred undervejs'}
              </h1>
              <p style={{ marginBottom: 0 }}>
                Kør scenariet igen, og skriv alle replikker selv i fritekst, inden du vælger. Det er dér, det
                sidder fast.
              </p>
            </div>
          </div>
          <div className="row mt">
            <button
              className="primary btn-lg"
              onClick={() => {
                reported.current = false
                setIndex(0)
                setScore(0)
                setDone(false)
              }}
            >
              <Icon name="refresh" size={18} /> Kør igen
            </button>
            <button onClick={onExit}>
              <Icon name="back" size={18} /> Alle situationer
            </button>
          </div>
        </section>

        <section className="card">
          <h2>Principperne i denne situation</h2>
          <ul className="list-reset stacklist">
            {scenario.principles.map((principle) => (
              <li key={principle} className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start', gap: '0.7rem' }}>
                <Icon name="check" size={17} strokeWidth={2.2} style={{ marginTop: '0.2rem', color: 'var(--ok)', flex: 'none' }} />
                <span style={{ color: 'var(--text-soft)' }}>{principle}</span>
              </li>
            ))}
          </ul>
        </section>
      </>
    )
  }

  return (
    <section className="card">
      <div className="drill-head">
        <div className="drill-meta">
          <Ring value={index} max={scenario.turns.length} size={46} thickness={5} tone="" label={index + 1} />
          <div>
            <div style={{ fontWeight: 600 }}>{scenario.title}</div>
            <div className="small muted">
              Replik {index + 1} af {scenario.turns.length} · {score} point indtil nu
            </div>
          </div>
        </div>
        <div className="row" style={{ gap: '0.5rem' }}>
          <Tension level={scenario.tension} />
          <button className="btn-ghost icon-btn" onClick={onExit} title="Afbryd scenariet" aria-label="Afbryd scenariet">
            <Icon name="x" size={18} />
          </button>
        </div>
      </div>

      {index === 0 ? (
        <p className="small muted" style={{ marginTop: '0.75rem' }}>
          {scenario.context}
        </p>
      ) : null}

      <div className="situation">
        <div className="who">
          <Icon name="quote" size={15} style={{ color: 'var(--muted)' }} />
          <span className="eyebrow">Situationen</span>
        </div>
        <p>{turn.situation}</p>
      </div>

      <div className="field">
        <label htmlFor="draft">Hvad siger du? Formulér det selv — det er her træningen ligger</label>
        <textarea
          id="draft"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Skriv din replik, præcis som du ville sige den."
        />
        <div className="row mt-sm">
          <button onClick={() => setAnalysis(analyzeReply(draft, turn))} disabled={!draft.trim()}>
            <Icon name="spark" size={16} /> Analysér min replik
          </button>
        </div>
      </div>

      {analysis ? (
        <div className="feedback">
          <div className="spread">
            <span className="verdict" style={{ margin: 0 }}>
              <Icon name="volume" size={19} /> Tone: {toneLabel(analysis.score)}
            </span>
            <span className="chip accent num">{analysis.score} / 100</span>
          </div>
          <div style={{ margin: '0.7rem 0' }}>
            <ProgressBar value={analysis.score} max={100} />
          </div>
          <div>
            {analysis.findings.map((finding, i) => (
              <div className="finding" key={i}>
                <span className={'chip ' + (finding.level === 'good' ? 'good' : finding.level === 'warn' ? 'warn' : 'error')}>
                  {finding.level === 'good' ? 'ok' : finding.level === 'warn' ? 'skærp' : 'fejl'}
                </span>
                <span>{finding.text}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <h3 className="mt">Vælg det svar, der kommer tættest på dit eget</h3>
      <div className="choices">
        {turn.options.map((option, i) => {
          let className = 'choice'
          let mark = null
          if (picked) {
            if (option === picked) {
              className += option.score === 2 ? ' correct' : ' wrong'
              mark = option.score === 2 ? 'check' : 'x'
            } else if (option.score === 2) {
              className += ' correct'
              mark = 'check'
            }
          }
          return (
            <button
              key={i}
              className={className}
              style={{ '--i': i }}
              disabled={Boolean(picked)}
              onClick={() => {
                setPicked(option)
                setScore((prev) => prev + option.score)
                playSound(option.score === 2 ? 'correct' : 'wrong')
              }}
            >
              <span className="key">{i + 1}</span>
              <span className="choice-text">{option.text}</span>
              {mark ? <Icon name={mark} size={18} strokeWidth={2.4} className="mark" /> : null}
            </button>
          )
        })}
      </div>

      {picked ? (
        <div className={'feedback ' + (picked.score === 2 ? 'ok' : 'bad')}>
          <div className="spread">
            <span className="verdict" style={{ margin: 0 }}>
              <Icon name={picked.score === 2 ? 'check' : 'x'} size={20} strokeWidth={2.4} />
              {picked.score} af 2 point
            </span>
            <span className="chip">{picked.tone}</span>
          </div>
          <p className="mt-sm">{picked.feedback}</p>
          <div className="rule-card">
            <div className="rule-line">
              <Icon name="quote" size={18} />
              <div>
                <span className="eyebrow">Modelsvar</span>
                <p>{turn.modelAnswer}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {picked ? (
        <div className="row mt">
          <button
            className="primary btn-lg"
            onClick={() => {
              if (index + 1 >= scenario.turns.length) setDone(true)
              else setIndex(index + 1)
            }}
          >
            {index + 1 >= scenario.turns.length ? 'Afslut scenarie' : 'Næste replik'}
            <Icon name="arrow" size={18} />
          </button>
        </div>
      ) : null}
    </section>
  )
}
