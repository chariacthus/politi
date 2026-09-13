import ProgressBar from './ProgressBar.jsx'

export default function SessionSummary({ results, onRestart, onExit, exitLabel = 'Tilbage' }) {
  const correct = results.filter((entry) => entry.correct).length
  const rate = results.length ? Math.round((correct / results.length) * 100) : 0
  const wrong = results.filter((entry) => !entry.correct)

  return (
    <section className="card">
      <h1>Session afsluttet</h1>
      <p className="spread">
        <span>
          <strong className="mono">
            {correct} af {results.length}
          </strong>{' '}
          korrekte
        </span>
        <span className="mono">{rate} %</span>
      </p>
      <ProgressBar value={correct} max={results.length || 1} />

      {wrong.length > 0 ? (
        <>
          <h2 style={{ marginTop: '1.5rem' }}>Det her skal du kigge på igen</h2>
          <ul className="list-reset">
            {wrong.map((entry) => (
              <li key={entry.item.id} style={{ padding: '0.6rem 0', borderTop: '1px solid var(--border)' }}>
                <div className="small muted">{entry.item.prompt}</div>
                <div>
                  Facit: <strong>{entry.item.answer}</strong>
                </div>
                <div className="small muted">{entry.item.rule}</div>
              </li>
            ))}
          </ul>
          <p className="note small">
            De forkerte opgaver er sat tilbage i boks 1 og kommer igen i din næste session.
          </p>
        </>
      ) : (
        <p className="note">Alt korrekt. Stoffet rykker et trin op i gentagelsessystemet.</p>
      )}

      <div className="row" style={{ marginTop: '1rem' }}>
        <button className="primary" onClick={onRestart}>
          Ny session
        </button>
        <button onClick={onExit}>{exitLabel}</button>
      </div>
    </section>
  )
}
