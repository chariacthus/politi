import { useMemo, useState } from 'react'
import Icon from '../components/Icon.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import Ring from '../components/Ring.jsx'
import SectionHead from '../components/SectionHead.jsx'
import { assignments } from '../data/reports.js'
import { scrollTop } from '../lib/media.js'
import { analyzeReport, reportVerdict } from '../lib/report.js'
import { useProgress } from '../lib/state.jsx'

export default function Write() {
  const { state, recordReport, recordSession } = useProgress()
  const [active, setActive] = useState(null)

  if (active) {
    return (
      <Editor
        assignment={active}
        onDone={(score, seconds) => {
          recordReport(active.id, score)
          recordSession({ module: 'rapport', lang: 'da', topic: active.kind, asked: 1, correct: score >= 75 ? 1 : 0, seconds })
        }}
        onExit={() => {
          setActive(null)
          scrollTop()
        }}
      />
    )
  }

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Træning</span>
        <h1>Rapport og skrivning</h1>
        <p>
          Du får sagens råmateriale — tid, sted, personer og hvad der skete — og skriver teksten selv. Bagefter
          gennemgås den for de oplysninger, der skal være med, og for det sprog, en rapport kræver.
        </p>
      </div>

      <div className="grid grid-half">
        {assignments.map((assignment) => {
          const record = state.reports[assignment.id]
          return (
            <section className="card card-flush" key={assignment.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="row" style={{ gap: '0.5rem' }}>
                <span className="chip accent">{assignment.kind}</span>
                {record ? (
                  <span className={'chip ' + (record.bestScore >= 85 ? 'good' : record.bestScore >= 60 ? 'warn' : 'error')}>
                    bedste: {record.bestScore}
                  </span>
                ) : null}
              </div>
              <h2 style={{ fontSize: 'var(--t-1)', margin: '0.6rem 0 0.3rem' }}>{assignment.title}</h2>
              <p className="small muted" style={{ flex: 1 }}>
                {assignment.brief}
              </p>
              <div className="spread">
                <span className="small muted">
                  {assignment.facts.length} oplysninger · {assignment.requirements.length} krav
                </span>
                <button className="primary" onClick={() => setActive(assignment)}>
                  <Icon name="grammar" size={16} /> Skriv
                </button>
              </div>
            </section>
          )
        })}
      </div>

      <div className="note mt">
        <Icon name="bulb" size={16} />
        <span>
          Gennemgangen er en tjekliste, ikke en sprogmodel: den finder manglende oplysninger, passiv form,
          vurderinger uden belæg, fyldeord og typiske stavefejl. Modelteksten står altid til sammenligning.
        </span>
      </div>
    </>
  )
}

function Editor({ assignment, onDone, onExit }) {
  const [text, setText] = useState('')
  const [review, setReview] = useState(null)
  const [showModel, setShowModel] = useState(false)
  const [startedAt] = useState(() => Date.now())

  const words = useMemo(() => text.split(/\s+/).filter(Boolean).length, [text])
  const enough = words >= 20

  function runReview() {
    const result = analyzeReport(text, assignment)
    setReview(result)
    onDone(result.score, Math.round((Date.now() - startedAt) / 1000))
    scrollTop()
  }

  return (
    <>
      <section className="card">
        <div className="spread">
          <div>
            <span className="chip accent">{assignment.kind}</span>
            <h1 style={{ fontSize: 'var(--t-3)', margin: '0.5rem 0 0.25rem' }}>{assignment.title}</h1>
          </div>
          <button className="btn-ghost icon-btn" onClick={onExit} aria-label="Tilbage til opgaverne">
            <Icon name="x" size={18} />
          </button>
        </div>
        <p style={{ marginBottom: 0 }}>{assignment.brief}</p>
      </section>

      <div className="write-layout">
        <section className="card case-file">
          <SectionHead title="Sagens oplysninger" as="h3" tail={<span className="eyebrow">{assignment.facts.length} punkter</span>} />
          <ul className="list-reset fact-list">
            {assignment.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>

          <h3 style={{ marginTop: '1.1rem' }}>Sådan gør du det godt</h3>
          <ul className="list-reset">
            {assignment.guidance.map((line) => (
              <li key={line} className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start', gap: '0.55rem', marginBottom: '0.4rem' }}>
                <Icon name="check" size={15} strokeWidth={2.2} style={{ marginTop: '0.28rem', color: 'var(--ok)', flex: 'none' }} />
                <span className="small" style={{ color: 'var(--text-soft)' }}>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <SectionHead
            title="Din tekst"
            as="h3"
            tail={
              <span className={'chip ' + (words >= assignment.minWords ? 'good' : '')}>
                {words} ord · mål: {assignment.minWords}
              </span>
            }
          />

          <textarea
            className="write-area"
            value={text}
            disabled={Boolean(review)}
            onChange={(event) => setText(event.target.value)}
            placeholder={'Skriv ' + assignment.kind.toLowerCase() + ' her. Begynd med tid og sted.'}
          />

          <div className="row mt">
            {review ? (
              <>
                <button
                  className="primary btn-lg"
                  onClick={() => {
                    setReview(null)
                    setShowModel(false)
                  }}
                >
                  <Icon name="refresh" size={18} /> Ret min tekst
                </button>
                <button onClick={() => setShowModel((value) => !value)}>
                  <Icon name="book" size={17} /> {showModel ? 'Skjul modelteksten' : 'Vis modelteksten'}
                </button>
              </>
            ) : (
              <button className="primary btn-lg" onClick={runReview} disabled={!enough}>
                <Icon name="check" size={18} /> Gennemgå min tekst
              </button>
            )}
            <button onClick={onExit}>
              <Icon name="back" size={17} /> Andre opgaver
            </button>
          </div>
          {!review && !enough ? (
            <p className="small muted mt-sm">Skriv mindst 20 ord, før teksten kan gennemgås.</p>
          ) : null}
        </section>
      </div>

      {review ? <Review review={review} assignment={assignment} showModel={showModel} /> : null}
    </>
  )
}

function Review({ review, assignment, showModel }) {
  return (
    <>
      <section className="card">
        <div className="row" style={{ gap: '1.5rem' }}>
          <div className="pop">
            <Ring value={review.score} max={100} size={108} thickness={9} label={review.score} sub="point" />
          </div>
          <div style={{ flex: '1 1 240px' }}>
            <span className="eyebrow">Gennemgang</span>
            <h2 style={{ fontSize: 'var(--t-2)' }}>{reportVerdict(review.score)}</h2>
            <p style={{ marginBottom: 0 }}>
              {review.metCount} af {review.requirements.length} krav opfyldt · {review.words} ord i{' '}
              {review.sentences} sætninger
            </p>
          </div>
        </div>
        <div className="mt">
          <ProgressBar value={review.metCount} max={review.requirements.length} />
        </div>
      </section>

      <section className="card">
        <SectionHead
          title="Oplysninger, der skal med"
          tail={
            <span className={'chip ' + (review.metCount === review.requirements.length ? 'good' : 'warn')}>
              {review.metCount}/{review.requirements.length}
            </span>
          }
        />
        <ul className="list-reset stacklist">
          {review.requirements.map((requirement) => (
            <li key={requirement.id} className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start', gap: '0.7rem' }}>
              <Icon
                name={requirement.met ? 'check' : 'x'}
                size={18}
                strokeWidth={2.3}
                style={{ marginTop: '0.15rem', color: requirement.met ? 'var(--ok)' : 'var(--error)', flex: 'none' }}
              />
              <div>
                <div style={{ fontWeight: 560, color: requirement.met ? 'var(--text)' : 'var(--error)' }}>{requirement.label}</div>
                {!requirement.met ? <div className="small muted">{requirement.hint}</div> : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {review.findings.length > 0 ? (
        <section className="card">
          <SectionHead title="Sproget" tail={<span className="chip warn">{review.findings.length}</span>} />
          {review.findings.map((finding, index) => (
            <div className="finding" key={index}>
              <span className={'chip ' + (finding.level === 'error' ? 'error' : 'warn')}>
                {finding.level === 'error' ? 'fejl' : 'skærp'}
              </span>
              <span>{finding.text}</span>
            </div>
          ))}
        </section>
      ) : null}

      {review.good.length > 0 ? (
        <section className="card">
          <SectionHead title="Det virker" tail={<span className="chip good">{review.good.length}</span>} />
          {review.good.map((line) => (
            <div className="finding" key={line}>
              <span className="chip good">ok</span>
              <span>{line}</span>
            </div>
          ))}
        </section>
      ) : null}

      {review.tone ? (
        <section className="card">
          <SectionHead title="Tone over for borgeren" tail={<span className="chip accent num">{review.tone.score} / 100</span>} />
          {review.tone.findings.map((finding, index) => (
            <div className="finding" key={index}>
              <span className={'chip ' + (finding.level === 'good' ? 'good' : finding.level === 'warn' ? 'warn' : 'error')}>
                {finding.level === 'good' ? 'ok' : finding.level === 'warn' ? 'skærp' : 'fejl'}
              </span>
              <span>{finding.text}</span>
            </div>
          ))}
        </section>
      ) : null}

      {showModel ? (
        <section className="card">
          <SectionHead title="Modeltekst" tail={<span className="eyebrow">til sammenligning</span>} />
          <p className="small muted">
            Ikke et facit — én måde at gøre det på. Sammenlign strukturen: rækkefølge, tidsangivelser og hvordan
            udsagn er mærket som udsagn.
          </p>
          <div className="model-text">
            {assignment.model.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}
