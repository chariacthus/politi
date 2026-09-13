import Icon from './Icon.jsx'
import Ring from './Ring.jsx'

export default function SessionSummary({ results, onRestart, onExit, exitLabel = 'Tilbage' }) {
  const correct = results.filter((entry) => entry.correct).length
  const rate = results.length ? Math.round((correct / results.length) * 100) : 0
  const wrong = results.filter((entry) => !entry.correct)

  const verdict =
    rate >= 90 ? 'Stærkt. Stoffet sidder.' : rate >= 70 ? 'Godt — men der er huller tilbage.' : 'Der er arbejde at gøre her.'

  return (
    <>
      <section className="card">
        <div className="row" style={{ gap: '1.5rem', alignItems: 'center' }}>
          <div className="pop">
            <Ring value={correct} max={results.length || 1} size={108} thickness={9} label={rate + '%'} sub="korrekt" />
          </div>
          <div style={{ flex: '1 1 240px' }}>
            <span className="eyebrow">Session afsluttet</span>
            <h1 style={{ fontSize: 'var(--t-3)' }}>
              {correct} af {results.length} korrekte
            </h1>
            <p style={{ marginBottom: 0 }}>{verdict}</p>
          </div>
        </div>

        <div className="row mt">
          <button className="primary btn-lg" onClick={onRestart}>
            <Icon name="refresh" size={18} /> Ny session
          </button>
          <button onClick={onExit}>
            <Icon name="back" size={18} /> {exitLabel}
          </button>
        </div>
      </section>

      {wrong.length > 0 ? (
        <section className="card">
          <div className="spread">
            <h2>Det her skal du kigge på igen</h2>
            <span className="chip error">{wrong.length} fejl</span>
          </div>
          <ul className="list-reset stacklist">
            {wrong.map((entry) => (
              <li key={entry.item.id}>
                <div className="small muted">{entry.item.prompt}</div>
                <div>
                  Facit: <strong>{entry.item.answer}</strong>
                </div>
                <div className="small muted">{entry.item.rule}</div>
              </li>
            ))}
          </ul>
          <div className="note mt">
            <Icon name="refresh" size={16} />
            <span>De forkerte opgaver er sat tilbage i boks 1 og kommer igen i din næste session.</span>
          </div>
        </section>
      ) : (
        <section className="card">
          <div className="note">
            <Icon name="spark" size={16} />
            <span>Alt korrekt. Hele stoffet i sessionen rykker et trin op i gentagelsessystemet.</span>
          </div>
        </section>
      )}
    </>
  )
}
