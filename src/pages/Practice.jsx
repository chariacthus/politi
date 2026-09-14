/**
 * Øv. Alt det, der ikke er stien: fri grammatik, diktat, rapportskrivning og
 * situationer — plus tre genveje, der peger på det, du har mest brug for
 * lige nu.
 */
import { useMemo } from 'react'
import Icon from '../components/Icon.jsx'
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
    text: 'Femten opgaver i det emne, du vælger.',
    action: 'Start',
  },
  {
    to: '/dictation',
    icon: 'dictation',
    tone: 'forest',
    title: 'Diktat',
    text: 'Skriv det, du hører.',
    action: 'Start',
  },
  {
    to: '/write',
    icon: 'book',
    tone: 'brass',
    title: 'Rapport',
    text: 'Skriv en rapport og få den gennemgået.',
    action: 'Start',
  },
  {
    to: '/scenarios',
    icon: 'scenarios',
    tone: 'brick',
    title: 'Situationer',
    text: 'Borgerkontakt under pres.',
    action: 'Start',
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
      short: plural(due, 'gentagelse', 'gentagelser'),
      text: '',
      label: 'Træn gentagelserne',
      to: '/grammar?lang=da&topic=alle&start=1',
    })
  }
  if (weakest) {
    quick.push({
      icon: 'target',
      title: 'Svageste emne: ' + titleFor(weakest.lang, weakest.topic),
      short: titleFor(weakest.lang, weakest.topic),
      text: '',
      label: 'Træn emnet',
      to: `/grammar?lang=${weakest.lang}&topic=${weakest.topic}&start=1`,
      second: { label: 'Læs reglen', to: `/rules?lang=${weakest.lang}&topic=${weakest.topic}` },
    })
  }
  if (quick.length < 2) {
    quick.push({
      icon: 'spark',
      title: 'Blandet session',
      short: 'Blandet session',
      text: '',
      label: 'Start blandet',
      to: '/grammar?lang=da&topic=alle&start=1',
    })
  }

  return (
    <>
      <div className="page-head tight">
        <h1>Øv frit</h1>
      </div>

      <div className="quick-row">
        {quick.slice(0, 2).map((entry) => (
          <button className="quick-chip" key={entry.title} onClick={() => navigate(entry.to)}>
            <Icon name={entry.icon} size={16} />
            {entry.short}
          </button>
        ))}
      </div>

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


    </>
  )
}
