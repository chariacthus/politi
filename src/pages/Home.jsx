import { useMemo } from 'react'
import Icon from '../components/Icon.jsx'
import Ring from '../components/Ring.jsx'
import StatCard from '../components/StatCard.jsx'
import { daItems, daTopics } from '../data/grammar.da.js'
import { enItems, enTopics } from '../data/grammar.en.js'
import { dictations } from '../data/dictation.js'
import { assignments } from '../data/reports.js'
import { rules } from '../data/rules.js'
import { scenarios } from '../data/scenarios.js'
import { useMediaQuery } from '../lib/media.js'
import { Link, navigate } from '../lib/router.jsx'
import { topicStats } from '../lib/srs.js'
import { daysUntil, useProgress } from '../lib/state.jsx'

const ALL_ITEMS = [...daItems, ...enItems]

const MODULES = [
  {
    to: '/grammar',
    icon: 'grammar',
    title: 'Grammatik',
    text: `${daItems.length} danske og ${enItems.length} engelske opgaver over ${daTopics.length + enTopics.length} emner. Du retter direkte i sætningen og får reglen bagefter.`,
  },
  {
    to: '/dictation',
    icon: 'dictation',
    title: 'Diktat',
    text: `${dictations.length} tekster i fire niveauer. Teksten læses op afsnit for afsnit — hør hvert afsnit så mange gange, du vil.`,
  },
  {
    to: '/write',
    icon: 'book',
    title: 'Rapport og skrivning',
    text: `${assignments.length} skriveopgaver med sagens oplysninger. Din tekst gennemgås for krav, passiv form, vurderinger og tone.`,
  },
  {
    to: '/scenarios',
    icon: 'scenarios',
    title: 'Situationer og tone',
    text: `${scenarios.length} situationer fra virkeligt politiarbejde. Du formulerer replikken selv og får feedback på tonen.`,
  },
  {
    to: '/rules',
    icon: 'bulb',
    title: 'Regelbogen',
    text: `${rules.length} regler forklaret med huskeregel, eksempler på forkert og rigtigt, og de fejl folk oftest laver.`,
  },
  {
    to: '/progress',
    icon: 'progress',
    title: 'Fremskridt',
    text: 'Hvad der er forfaldent til gentagelse, hvilket emne der er svagest, og hvad du bør tage som det næste.',
  },
]

const STEPS = [
  { icon: 'bulb', text: 'Læs reglen i regelbogen, før du træner et nyt emne. Så er drillen en test og ikke en gætteleg.' },
  { icon: 'clock', text: 'Træn hver dag. Femten opgaver dagligt slår hundrede om søndagen — gentagelsen er hele pointen.' },
  { icon: 'book', text: 'Skriv mindst én rapport om ugen. Rapportsprog læres kun ved at skrive det og få det rettet.' },
  { icon: 'scenarios', text: 'Formulér dine egne replikker i situationsøvelserne, før du vælger et svar. Det er dér, tonen sidder.' },
  { icon: 'target', text: 'Start altid på fremskridtssiden: den siger, hvad der er forfaldent, og hvad der er svagest.' },
]

export default function Home() {
  const { state } = useProgress()
  const compact = useMediaQuery('(max-width: 640px)')

  const stats = useMemo(() => topicStats(ALL_ITEMS, state.items), [state.items])
  const weakest = stats.filter((entry) => entry.rate !== null)[0] || null

  const totals = useMemo(() => {
    let seen = 0
    let correct = 0
    let mastered = 0
    for (const record of Object.values(state.items)) {
      seen += record.seen
      correct += record.correct
      if (record.box >= 4) mastered += 1
    }
    return { seen, correct, mastered, rate: seen ? Math.round((correct / seen) * 100) : 0 }
  }, [state.items])

  const days = daysUntil(state.examDate)
  const weakestTitle = weakest
    ? (weakest.lang === 'en' ? enTopics : daTopics).find((t) => t.id === weakest.topic)?.title
    : null
  const target = weakest
    ? `/grammar?lang=${weakest.lang}&topic=${weakest.topic}&start=1`
    : '/grammar?lang=da&topic=alle&start=1'

  return (
    <>
      <section className="hero">
        <div className="hero-row">
          <div style={{ flex: '1 1 380px' }}>
            <span className="eyebrow">Politiets optagelsesprøve</span>
            <h1>
              Skriftlighed og tone, <span className="gradient-text">trænet systematisk</span>
            </h1>
            <p className="lead">
              Sproget er det, der vælter flest ansøgere — og det følger med ind i arbejdet bagefter, hver gang der
              skal skrives en rapport. Her træner du retskrivning, diktat, rapportskrivning og den tone, du taler
              til borgere i.
            </p>
            <div className="row mt">
              <button className="primary btn-lg" onClick={() => navigate(target)}>
                <Icon name="play" size={18} />
                {weakest ? 'Træn svageste emne: ' + weakestTitle : 'Start din første session'}
              </button>
              <Link className="btn btn-lg" to="/plan">
                <Icon name="plan" size={18} /> Træningsplan
              </Link>
            </div>
          </div>

          <div className="pop hero-ring">
            <Ring
              value={totals.mastered}
              max={ALL_ITEMS.length}
              size={compact ? 84 : 148}
              thickness={compact ? 7 : 11}
              label={Math.round((totals.mastered / ALL_ITEMS.length) * 100) + '%'}
              sub="sidder fast"
            />
            <div className="small muted">
              {totals.mastered} af {ALL_ITEMS.length} opgaver
              <br />
              sidder fast i gentagelsessystemet
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-4">
        <StatCard icon="flame" label="Streak" value={state.streak.current} hint={'længste: ' + state.streak.longest} accent={state.streak.current > 0} />
        <StatCard icon="check" label="Besvarede" value={totals.seen} hint={totals.rate + ' % korrekte'} />
        <StatCard icon="target" label="Svageste emne" value={weakestTitle || '—'} hint={weakest ? Math.round(weakest.rate * 100) + ' % korrekte' : 'træn for at få data'} />
        <StatCard icon="clock" label="Dage til prøven" value={days === null ? '—' : days} hint={days === null ? 'sæt dato under planen' : 'hold tempoet'} />
      </section>

      <div className="grid grid-half mt">
        {MODULES.map((module) => (
          <Link key={module.to} to={module.to} className="card card-link card-flush">
            <div className="row" style={{ gap: '0.75rem', flexWrap: 'nowrap' }}>
              <span className="brand-mark" style={{ width: 34, height: 34, borderRadius: 10 }}>
                <Icon name={module.icon} size={18} />
              </span>
              <h2 style={{ margin: 0, fontSize: 'var(--t-1)' }}>{module.title}</h2>
              <Icon name="arrow" size={18} className="card-arrow" style={{ marginLeft: 'auto' }} />
            </div>
            <p className="small muted" style={{ margin: '0.6rem 0 0' }}>
              {module.text}
            </p>
          </Link>
        ))}
      </div>

      <section className="card mt">
        <h2>Sådan bruger du det</h2>
        <ul className="list-reset stacklist">
          {STEPS.map((step) => (
            <li key={step.text} className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Icon name={step.icon} size={18} style={{ marginTop: '0.2rem', color: 'var(--accent)', flex: 'none' }} />
              <span className="small" style={{ color: 'var(--text-soft)' }}>{step.text}</span>
            </li>
          ))}
        </ul>
        <div className="note mt">
          <Icon name="shield" size={16} />
          <span>
            Fremskridt gemmes kun i denne browser på denne enhed. Opgaverne er skrevet ud fra almindelige
            retskrivningsregler og er ikke officielle prøvespørgsmål.
          </span>
        </div>
      </section>
    </>
  )
}
