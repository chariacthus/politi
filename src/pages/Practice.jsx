/**
 * Øv. Alt det, der ikke er stien: fri grammatik, diktat, rapportskrivning og
 * situationer — plus tre genveje, der peger på det, du har mest brug for
 * lige nu.
 */
import { useMemo } from 'react'
import Icon from '../components/Icon.jsx'
import SectionHead from '../components/SectionHead.jsx'
import { dictations } from '../data/dictation.js'
import { daItems, daTopics } from '../data/grammar.da.js'
import { enItems, enTopics } from '../data/grammar.en.js'
import { assignments } from '../data/reports.js'
import { scenarios } from '../data/scenarios.js'
import { plural } from '../lib/media.js'
import { Link, navigate } from '../lib/router.jsx'
import { topicStats } from '../lib/srs.js'
import { useProgress } from '../lib/state.jsx'

const ALL_ITEMS = [...daItems, ...enItems]

const MODULES = [
  {
    to: '/grammar',
    icon: 'grammar',
    tone: 'navy',
    title: 'Grammatik',
    text: 'Femten opgaver ad gangen i det emne, du vælger — eller blandet. Gentagelserne kommer af sig selv.',
    action: 'Start session',
  },
  {
    to: '/dictation',
    icon: 'dictation',
    tone: 'forest',
    title: 'Diktat',
    text: 'Teksten læses op sætning for sætning. Du skriver med, og hver afvigelse bliver forklaret.',
    action: 'Tag en diktat',
  },
  {
    to: '/write',
    icon: 'book',
    tone: 'brass',
    title: 'Rapport',
    text: 'Skriv en rigtig døgnrapport ud fra oplysningerne, og få sproget, tonen og fakta gennemgået.',
    action: 'Skriv en rapport',
  },
  {
    to: '/scenarios',
    icon: 'scenarios',
    tone: 'brick',
    title: 'Situationer',
    text: 'Borgerkontakt under pres. Vælg replik, skriv din egen — og få tonen vurderet.',
    action: 'Åbn en situation',
  },
]

function titleFor(lang, topicId) {
  const list = lang === 'en' ? enTopics : daTopics
  return list.find((entry) => entry.id === topicId)?.title || topicId
}

export default function Practice() {
  const { state } = useProgress()

  const due = useMemo(() => {
    const now = Date.now()
    return ALL_ITEMS.filter((item) => {
      const record = state.items[item.id]
      return record && (!record.due || new Date(record.due).getTime() <= now)
    }).length
  }, [state.items])

  const weakest = useMemo(() => {
    const trained = topicStats(ALL_ITEMS, state.items).filter((entry) => entry.rate !== null)
    return trained[0] || null
  }, [state.items])

  const counts = {
    '/dictation': dictations.length + ' tekster',
    '/write': assignments.length + ' opgaver',
    '/scenarios': scenarios.length + ' scenarier',
    '/grammar': ALL_ITEMS.length + ' opgaver',
  }

  const quick = []
  if (due > 0) {
    quick.push({
      icon: 'refresh',
      title: plural(due, 'gentagelse er forfalden', 'gentagelser er forfaldne'),
      text: 'Det er her, stoffet sætter sig. Tag dem, før du lærer nyt.',
      label: 'Træn gentagelserne',
      to: '/grammar?lang=da&topic=alle&start=1',
    })
  }
  if (weakest) {
    quick.push({
      icon: 'target',
      title: 'Svageste emne: ' + titleFor(weakest.lang, weakest.topic),
      text: Math.round(weakest.rate * 100) + ' % rigtige indtil nu. Læs reglen først — så bliver det træning og ikke gætteri.',
      label: 'Træn emnet',
      to: `/grammar?lang=${weakest.lang}&topic=${weakest.topic}&start=1`,
      second: { label: 'Læs reglen', to: `/rules?lang=${weakest.lang}&topic=${weakest.topic}` },
    })
  }
  if (quick.length < 2) {
    quick.push({
      icon: 'spark',
      title: 'Blandet session',
      text: 'Femten tilfældige opgaver på tværs af alle danske emner — tættest på prøvens form.',
      label: 'Start blandet',
      to: '/grammar?lang=da&topic=alle&start=1',
    })
  }

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Øv</span>
        <h1>Fri træning</h1>
        <p>
          Stien lærer dig stoffet i rækkefølge. Her vælger du selv: et enkelt emne, en diktat, en rapport eller
          en samtale, der skal håndteres.
        </p>
      </div>

      <div className="quick-grid">
        {quick.slice(0, 2).map((entry) => (
          <div className="quick-card" key={entry.title}>
            <span className="quick-icon">
              <Icon name={entry.icon} size={19} />
            </span>
            <div className="quick-body">
              <b>{entry.title}</b>
              <p className="small muted">{entry.text}</p>
            </div>
            <div className="row" style={{ gap: '0.4rem' }}>
              {entry.second ? (
                <button className="btn-ghost" onClick={() => navigate(entry.second.to)}>
                  {entry.second.label}
                </button>
              ) : null}
              <button className="primary" onClick={() => navigate(entry.to)}>
                {entry.label}
              </button>
            </div>
          </div>
        ))}
      </div>

      <SectionHead title="Moduler" tail={<span className="eyebrow">vælg frit</span>} />
      <div className="module-grid">
        {MODULES.map((entry) => (
          <Link key={entry.to} to={entry.to} className={'module-card ' + entry.tone}>
            <span className="module-icon">
              <Icon name={entry.icon} size={26} />
            </span>
            <div className="module-body">
              <div className="spread">
                <h2>{entry.title}</h2>
                <span className="chip">{counts[entry.to]}</span>
              </div>
              <p>{entry.text}</p>
            </div>
            <span className="module-go">
              {entry.action} <Icon name="arrow" size={17} />
            </span>
          </Link>
        ))}
      </div>

      <div className="note mt">
        <Icon name="bulb" size={16} />
        <span>
          Fri træning tæller også med i streak og XP. Skal det være systematisk, så tag <Link to="/">stien</Link>{' '}
          — den bygger emnerne oven på hinanden.
        </span>
      </div>
    </>
  )
}
