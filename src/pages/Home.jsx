import { useMemo } from 'react'
import StatCard from '../components/StatCard.jsx'
import { daItems, daTopics } from '../data/grammar.da.js'
import { enItems, enTopics } from '../data/grammar.en.js'
import { scenarios } from '../data/scenarios.js'
import { Link, navigate } from '../lib/router.jsx'
import { topicStats } from '../lib/srs.js'
import { daysUntil, useProgress } from '../lib/state.jsx'

const ALL_ITEMS = [...daItems, ...enItems]

export default function Home() {
  const { state } = useProgress()

  const weakest = useMemo(() => {
    const trained = topicStats(ALL_ITEMS, state.items).filter((entry) => entry.rate !== null)
    return trained[0] || null
  }, [state.items])

  const answered = useMemo(
    () => Object.values(state.items).reduce((sum, record) => sum + record.seen, 0),
    [state.items],
  )

  const days = daysUntil(state.examDate)
  const weakestTitle = weakest
    ? (weakest.lang === 'en' ? enTopics : daTopics).find((t) => t.id === weakest.topic)?.title
    : null

  const target = weakest
    ? `/grammar?lang=${weakest.lang}&topic=${weakest.topic}&start=1`
    : '/grammar?lang=da&topic=alle&start=1'

  return (
    <>
      <section className="card">
        <h1>Træning mod optagelsesprøven</h1>
        <p>
          Skriftligheden er det, der vælter flest ansøgere — og den følger med ind i arbejdet bagefter, hver
          gang der skal skrives en rapport. Her træner du tre ting: retskrivning, diktat og den tone, du taler
          til borgere i.
        </p>
        <div className="row">
          <button className="primary" onClick={() => navigate(target)}>
            {weakest ? 'Træn dit svageste emne: ' + weakestTitle : 'Start første session'}
          </button>
          <Link className="btn" to="/plan">
            Se træningsplanen
          </Link>
        </div>
      </section>

      <section className="card">
        <div className="grid grid-3">
          <StatCard label="Streak" value={state.streak.current} hint={'længste: ' + state.streak.longest} />
          <StatCard label="Besvarede" value={answered} hint={'af ' + ALL_ITEMS.length + ' opgaver i banken'} />
          <StatCard
            label="Svageste emne"
            value={weakestTitle || '—'}
            hint={weakest ? Math.round(weakest.rate * 100) + ' % korrekte' : 'træn for at få data'}
          />
          <StatCard
            label="Dage til prøven"
            value={days === null ? '—' : days}
            hint={days === null ? 'sæt dato under træningsplan' : ''}
          />
        </div>
      </section>

      <div className="grid grid-2">
        <section className="card" style={{ marginBottom: 0 }}>
          <h2>Grammatik</h2>
          <p className="small muted">
            {daItems.length} danske og {enItems.length} engelske opgaver fordelt på {daTopics.length + enTopics.length}{' '}
            emner. Forkerte svar kommer igen, indtil de sidder fast.
          </p>
          <Link className="btn" to="/grammar">
            Åbn grammatik
          </Link>
        </section>

        <section className="card" style={{ marginBottom: 0 }}>
          <h2>Diktat</h2>
          <p className="small muted">
            Teksten læses op, du skriver den, og hver afvigelse markeres ord for ord. Fire niveauer fra korte
            sætninger til lange perioder.
          </p>
          <Link className="btn" to="/dictation">
            Åbn diktat
          </Link>
        </section>

        <section className="card" style={{ marginBottom: 0 }}>
          <h2>Situationer og tone</h2>
          <p className="small muted">
            {scenarios.length} situationer: færdselskontrol, nabostrid, underretning af pårørende, natteliv,
            psykisk krise og afhøring af et ungt vidne.
          </p>
          <Link className="btn" to="/scenarios">
            Åbn situationer
          </Link>
        </section>

        <section className="card" style={{ marginBottom: 0 }}>
          <h2>Fremskridt</h2>
          <p className="small muted">
            Træfprocent pr. emne, gentagelsessystemets bokse og historik over dine sessioner.
          </p>
          <Link className="btn" to="/progress">
            Åbn fremskridt
          </Link>
        </section>
      </div>

      <section className="card">
        <h2>Sådan bruger du det</h2>
        <ol>
          <li>Træn hver dag — hellere 15 opgaver dagligt end 100 om søndagen. Gentagelse er hele pointen.</li>
          <li>Læs reglen efter hvert forkert svar. Uden reglen lærer du kun den enkelte sætning udenad.</li>
          <li>Skriv dine egne replikker i situationsøvelserne, inden du vælger et svar. Det er der, tonen sidder.</li>
          <li>Følg fremskridtssiden: det emne, der ligger øverst, er det, du skal træne næste gang.</li>
        </ol>
        <p className="note small">
          Fremskridt gemmes kun i denne browser på denne enhed. Rydder du browserdata, starter du forfra.
        </p>
      </section>
    </>
  )
}
