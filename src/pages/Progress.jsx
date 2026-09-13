import { useMemo, useState } from 'react'
import ProgressBar from '../components/ProgressBar.jsx'
import StatCard from '../components/StatCard.jsx'
import { daItems, daTopics } from '../data/grammar.da.js'
import { enItems, enTopics } from '../data/grammar.en.js'
import { Link } from '../lib/router.jsx'
import { boxCounts, topicStats } from '../lib/srs.js'
import { useProgress } from '../lib/state.jsx'

const ALL_ITEMS = [...daItems, ...enItems]

function titleFor(lang, topicId) {
  const list = lang === 'en' ? enTopics : daTopics
  return list.find((entry) => entry.id === topicId)?.title || topicId
}

export default function Progress() {
  const { state, resetAll } = useProgress()
  const [confirming, setConfirming] = useState(false)

  const stats = useMemo(() => topicStats(ALL_ITEMS, state.items), [state.items])
  const boxes = useMemo(() => boxCounts(ALL_ITEMS, state.items), [state.items])
  const trained = stats.filter((entry) => entry.rate !== null)

  const totals = useMemo(() => {
    let seen = 0
    let correct = 0
    for (const record of Object.values(state.items)) {
      seen += record.seen
      correct += record.correct
    }
    return { seen, correct, rate: seen ? Math.round((correct / seen) * 100) : 0 }
  }, [state.items])

  const sessions = [...state.sessions].reverse().slice(0, 15)

  return (
    <>
      <section className="card">
        <h1>Fremskridt</h1>
        <div className="grid grid-3">
          <StatCard label="Besvarede" value={totals.seen} hint="opgaver i alt" />
          <StatCard label="Træfprocent" value={totals.rate + ' %'} hint={totals.correct + ' korrekte'} />
          <StatCard label="Streak" value={state.streak.current} hint={'længste: ' + state.streak.longest} />
          <StatCard label="Sidder fast" value={boxes[5]} hint={'af ' + ALL_ITEMS.length + ' opgaver'} />
        </div>
      </section>

      <section className="card">
        <h2>Svage punkter først</h2>
        {trained.length === 0 ? (
          <p className="muted">
            Ingen data endnu. <Link to="/grammar">Start en session</Link>, så bygger listen sig selv.
          </p>
        ) : (
          <>
            <p className="small muted">Sorteret efter træfprocent. Klik på et emne for at træne netop det.</p>
            {trained.map((entry) => (
              <div className="topic-row" key={entry.lang + entry.topic}>
                <div>
                  <Link to={`/grammar?lang=${entry.lang}&topic=${entry.topic}&start=1`}>
                    {titleFor(entry.lang, entry.topic)}
                  </Link>{' '}
                  <span className="pill">{entry.lang === 'en' ? 'engelsk' : 'dansk'}</span>
                </div>
                <div className="mono small">
                  {Math.round(entry.rate * 100)} % · {entry.correct}/{entry.seen} · {entry.mastered}/{entry.total} sidder fast
                </div>
                <ProgressBar value={entry.rate * 100} max={100} />
              </div>
            ))}
          </>
        )}
      </section>

      <section className="card">
        <h2>Gentagelsessystemet</h2>
        <p className="small muted">
          Hver opgave rykker et trin op, når du svarer rigtigt, og helt ned i boks 1, når du svarer forkert.
          Boks 5 kommer først igen efter godt to uger.
        </p>
        <div className="grid grid-3">
          <StatCard label="Ikke set" value={boxes[0]} />
          <StatCard label="Boks 1" value={boxes[1]} hint="samme dag" />
          <StatCard label="Boks 2" value={boxes[2]} hint="efter 1 dag" />
          <StatCard label="Boks 3" value={boxes[3]} hint="efter 3 dage" />
          <StatCard label="Boks 4" value={boxes[4]} hint="efter 1 uge" />
          <StatCard label="Boks 5" value={boxes[5]} hint="efter 16 dage" />
        </div>
      </section>

      <section className="card">
        <h2>Seneste sessioner</h2>
        {sessions.length === 0 ? (
          <p className="muted">Ingen sessioner endnu.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Dato</th>
                  <th>Modul</th>
                  <th>Emne</th>
                  <th>Resultat</th>
                  <th>Tid</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, index) => (
                  <tr key={session.date + index}>
                    <td className="mono">{new Date(session.date).toLocaleString('da-DK', { dateStyle: 'short', timeStyle: 'short' })}</td>
                    <td>{session.module}</td>
                    <td>{session.topic === 'alle' ? 'blandet' : session.topic}</td>
                    <td className="mono">
                      {session.correct}/{session.asked}
                    </td>
                    <td className="mono">{Math.floor(session.seconds / 60)}:{String(session.seconds % 60).padStart(2, '0')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Nulstil</h2>
        <p className="small muted">
          Sletter alle svar, sessioner, scenarieresultater og din træningsplan i denne browser. Kan ikke fortrydes.
        </p>
        {confirming ? (
          <div className="row">
            <button
              className="primary"
              onClick={() => {
                resetAll()
                setConfirming(false)
              }}
            >
              Ja, slet alt
            </button>
            <button onClick={() => setConfirming(false)}>Fortryd</button>
          </div>
        ) : (
          <button onClick={() => setConfirming(true)}>Nulstil alle data</button>
        )}
      </section>
    </>
  )
}
