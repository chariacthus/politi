import { useMemo } from 'react'
import Icon from '../components/Icon.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import Ring from '../components/Ring.jsx'
import StatCard from '../components/StatCard.jsx'
import SectionHead from '../components/SectionHead.jsx'
import { dictations } from '../data/dictation.js'
import { daItems, daTopics } from '../data/grammar.da.js'
import { enItems, enTopics } from '../data/grammar.en.js'
import { assignments } from '../data/reports.js'
import { scenarios } from '../data/scenarios.js'
import { plural } from '../lib/media.js'
import { Link, navigate } from '../lib/router.jsx'
import { currentStage, levelFor, pathProgress, rankFor, stageProgress } from '../lib/lessons.js'
import { stages } from '../data/path.js'
import { policeItems } from '../data/police.js'
import { boxCounts, topicStats } from '../lib/srs.js'
import { useProgress } from '../lib/state.jsx'

const ALL_ITEMS = [...daItems, ...enItems]

const BOXES = [
  { key: 0, label: 'Ikke set', hint: 'endnu ikke mødt', color: 'var(--border-strong)' },
  { key: 1, label: 'Boks 1', hint: 'igen samme dag', color: 'var(--brick)' },
  { key: 2, label: 'Boks 2', hint: 'igen efter 1 dag', color: 'var(--accent)' },
  { key: 3, label: 'Boks 3', hint: 'igen efter 3 dage', color: 'color-mix(in srgb, var(--accent) 45%, var(--forest))' },
  { key: 4, label: 'Boks 4', hint: 'igen efter 1 uge', color: 'color-mix(in srgb, var(--forest) 75%, var(--accent))' },
  { key: 5, label: 'Boks 5', hint: 'igen efter 16 dage', color: 'var(--forest)' },
]

function titleFor(lang, topicId) {
  const list = lang === 'en' ? enTopics : daTopics
  return list.find((entry) => entry.id === topicId)?.title || topicId
}

export default function ProgressView() {
  const { state } = useProgress()

  const stats = useMemo(() => topicStats(ALL_ITEMS, state.items), [state.items])
  const boxes = useMemo(() => boxCounts(ALL_ITEMS, state.items), [state.items])
  const trained = stats.filter((entry) => entry.rate !== null)
  const weakest = trained[0] || null

  const totals = useMemo(() => {
    let seen = 0
    let correct = 0
    for (const record of Object.values(state.items)) {
      seen += record.seen
      correct += record.correct
    }
    return { seen, correct, rate: seen ? Math.round((correct / seen) * 100) : 0 }
  }, [state.items])

  // Hvor mange opgaver er forfaldne til gentagelse lige nu?
  const due = useMemo(() => {
    const now = Date.now()
    return ALL_ITEMS.filter((item) => {
      const record = state.items[item.id]
      return record && (!record.due || new Date(record.due).getTime() <= now)
    }).length
  }, [state.items])

  // Aktivitet de seneste 14 dage.
  const activity = useMemo(() => {
    const days = []
    for (let offset = 13; offset >= 0; offset--) {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - offset)
      days.push({ key: date.toISOString().slice(0, 10), date, count: 0 })
    }
    const index = new Map(days.map((day) => [day.key, day]))
    for (const session of state.sessions) {
      const key = String(session.date).slice(0, 10)
      const day = index.get(key)
      if (day) day.count += session.asked || 0
    }
    return days
  }, [state.sessions])

  const maxActivity = Math.max(1, ...activity.map((day) => day.count))
  const activeDays = activity.filter((day) => day.count > 0).length

  const modules = useMemo(() => {
    const byModule = {}
    for (const session of state.sessions) {
      const entry = byModule[session.module] || { asked: 0, correct: 0, sessions: 0, seconds: 0 }
      entry.asked += session.asked || 0
      entry.correct += session.correct || 0
      entry.seconds += session.seconds || 0
      entry.sessions += 1
      byModule[session.module] = entry
    }
    return byModule
  }, [state.sessions])

  const path = useMemo(() => pathProgress(state.lessons), [state.lessons])

  // Hvor er du henne i uddannelsen, og hvor stærkt står hvert spor?
  const stage = useMemo(() => currentStage(state.lessons, state.unlocked), [state.lessons, state.unlocked])
  const tracks = useMemo(
    () => [
      { id: 'da', label: 'Dansk', icon: 'grammar', level: levelFor(daItems, state.items) },
      { id: 'en', label: 'Engelsk', icon: 'quote', level: levelFor(enItems, state.items) },
      { id: 'politi', label: 'Politifag', icon: 'shield', level: levelFor(policeItems, state.items) },
    ],
    [state.items],
  )
  const rank = useMemo(() => rankFor(state.xp || 0), [state.xp])
  const scenariosDone = Object.keys(state.scenarios).length
  const reportsDone = Object.keys(state.reports).length
  const dictationsSeen = dictations.filter((d) => state.items[d.id]).length
  const sessions = [...state.sessions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 12)
  const mastered = boxes[4] + boxes[5]

  const nextSteps = []
  if (path.done < path.total) {
    nextSteps.push({
      icon: 'home',
      title: `Forløbet: ${path.done} af ${path.total} lektioner klaret`,
      text: 'Forløbet tager dig gennem politiets regelgrundlag og sproget i den rækkefølge, det bygger på hinanden.',
      action: { label: 'Fortsæt forløbet', to: '/' },
    })
  }
  if (due > 0) {
    nextSteps.push({
      icon: 'refresh',
      title: `${due} ${due === 1 ? 'opgave er forfalden' : 'opgaver er forfaldne'} til gentagelse`,
      text: 'Gentagelse på det rigtige tidspunkt er hele grunden til, at stoffet sætter sig. Tag dem først.',
      action: { label: 'Træn gentagelserne', to: '/grammar?lang=da&topic=alle&start=1' },
    })
  }
  if (weakest) {
    nextSteps.push({
      icon: 'target',
      title: `Svageste emne: ${titleFor(weakest.lang, weakest.topic)} (${Math.round(weakest.rate * 100)} %)`,
      text: 'Læs reglen igennem, før du træner emnet igen — ellers gætter du bare på ny.',
      action: { label: 'Læs reglen', to: `/rules?lang=${weakest.lang}&topic=${weakest.topic}` },
      second: { label: 'Træn emnet', to: `/grammar?lang=${weakest.lang}&topic=${weakest.topic}&start=1` },
    })
  }
  if (reportsDone < assignments.length) {
    nextSteps.push({
      icon: 'book',
      title: plural(assignments.length - reportsDone, 'skriveopgave mangler', 'skriveopgaver mangler'),
      text: 'Rapportsprog læres kun ved at skrive. Tag en opgave, og få teksten gennemgået.',
      action: { label: 'Skriv en rapport', to: '/write' },
    })
  }
  if (scenariosDone < scenarios.length) {
    nextSteps.push({
      icon: 'scenarios',
      title: plural(scenarios.length - scenariosDone, 'situation er ikke gennemført', 'situationer er ikke gennemført'),
      text: 'Tonen i borgerkontakt er lige så afgørende som grammatikken — og den trænes på samme måde.',
      action: { label: 'Åbn situationerne', to: '/scenarios' },
    })
  }
  if (nextSteps.length === 0) {
    nextSteps.push({
      icon: 'spark',
      title: 'Alt er ajour',
      text: 'Ingen forfaldne gentagelser, og alle moduler er prøvet. Tag en blandet session for at holde niveauet.',
      action: { label: 'Blandet session', to: '/grammar?lang=da&topic=alle&start=1' },
    })
  }

  return (
    <>
      <section className="card">
        <SectionHead title="Hvor du er i uddannelsen" tail={<span className="chip accent">Trin {stage.number}</span>} />

        <div className="ladder-row">
          {stages.map((entry) => {
            const done = stageProgress(entry.id, state.lessons)
            const state2 = done.complete ? 'done' : entry.id === stage.id ? 'here' : ''
            return (
              <div className={'ladder-step ' + state2} key={entry.id}>
                <span className="ladder-num">{done.complete ? <Icon name="check" size={15} strokeWidth={2.6} /> : entry.number}</span>
                <div>
                  <b>{entry.title}</b>
                  <span className="small muted">
                    {done.done}/{done.total} lektioner
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-3fix mt">
          {tracks.map((track) => (
            <div className="tile" key={track.id}>
              <span className="tile-label">
                <Icon name={track.icon} size={14} /> {track.label}
              </span>
              <span className="tile-value">{['Begynder', 'Øvet', 'Stærk'][track.level - 1]}</span>
              <span className="tile-hint">
                {track.level === 1
                  ? 'opgaverne holdes enkle'
                  : track.level === 2
                    ? 'sværhedsgraden er sat op'
                    : 'du får det sværeste stof'}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <SectionHead
          title="Status"
          tail={<span className="chip accent">{rank.current.title}</span>}
        />
        <div className="row" style={{ gap: '1.5rem' }}>
          <div className="pop" style={{ textAlign: 'center' }}>
            <Ring
              value={mastered}
              max={ALL_ITEMS.length}
              size={104}
              thickness={9}
              label={Math.round((mastered / ALL_ITEMS.length) * 100) + '%'}
              sub="sidder fast"
            />
          </div>
          <div className="grid grid-3fix" style={{ flex: '1 1 380px' }}>
            <StatCard icon="spark" label="XP" value={state.xp || 0} count hint={rank.next ? rank.next.xp - (state.xp || 0) + ' til ' + rank.next.title : 'højeste rang'} />
            <StatCard icon="home" label="Lektioner" value={path.done + '/' + path.total} hint={path.stars + ' af ' + path.maxStars + ' stjerner'} />
            <StatCard icon="flame" label="Streak" value={state.streak.current} count hint={'længste: ' + state.streak.longest} />
            <StatCard icon="target" label="Træfprocent" value={totals.rate + ' %'} hint={totals.seen + ' besvarede'} />
          </div>
        </div>
        <div className="mt-sm">
          <ProgressBar value={path.done} max={path.total} tone="" />
        </div>
      </section>

      <section className="card">
        <SectionHead title="Næste skridt" tail={<span className="eyebrow">prioriteret</span>} />
        <div className="steps mt-sm">
          {nextSteps.slice(0, 3).map((step) => (
            <div className="step" key={step.title}>
              <span className="step-icon">
                <Icon name={step.icon} size={18} />
              </span>
              <div style={{ flex: '1 1 220px' }}>
                <b>{step.title}</b>
                <p className="small muted" style={{ margin: '0.15rem 0 0' }}>
                  {step.text}
                </p>
              </div>
              <div className="row" style={{ gap: '0.4rem' }}>
                {step.second ? (
                  <button className="btn-ghost" onClick={() => navigate(step.second.to)}>
                    {step.second.label}
                  </button>
                ) : null}
                <button className="primary" onClick={() => navigate(step.action.to)}>
                  {step.action.label}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <SectionHead title="Aktivitet" tail={<span className="chip">{activeDays} af 14 dage</span>} />
        <div className="activity">
          {activity.map((day) => (
            <div className="activity-col" key={day.key} title={`${day.date.toLocaleDateString('da-DK')}: ${plural(day.count, 'opgave', 'opgaver')}`}>
              <div className="activity-bar">
                <div
                  style={{ height: day.count ? Math.max(8, (day.count / maxActivity) * 100) + '%' : '3px' }}
                  className={day.count ? 'on' : ''}
                />
              </div>
              <span className="activity-label">{day.date.toLocaleDateString('da-DK', { weekday: 'narrow' })}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <SectionHead title="Moduler" />
        <div className="grid grid-4 mt-sm">
          <StatCard
            icon="grammar"
            label="Grammatik"
            value={modules.grammatik?.asked || 0}
            count
            hint={
              modules.grammatik
                ? 'opgaver · ' + Math.round((modules.grammatik.correct / Math.max(1, modules.grammatik.asked)) * 100) + ' % korrekte'
                : 'opgaver · ikke trænet'
            }
          />
          <StatCard
            icon="dictation"
            label="Diktat"
            value={dictationsSeen + '/' + dictations.length}
            hint={modules.diktat ? 'tekster · ' + plural(modules.diktat.sessions, 'session', 'sessioner') : 'tekster · ikke trænet'}
          />
          <StatCard
            icon="book"
            label="Rapport"
            value={reportsDone + '/' + assignments.length}
            hint={
              reportsDone
                ? 'opgaver · bedste ' + Math.max(...Object.values(state.reports).map((r) => r.bestScore)) + ' point'
                : 'opgaver · ingen skrevet'
            }
          />
          <StatCard
            icon="scenarios"
            label="Situationer"
            value={scenariosDone + '/' + scenarios.length}
            hint={scenariosDone ? 'scenarier gennemført' : 'scenarier · ikke prøvet'}
          />
        </div>
      </section>

      <section className="card">
        <SectionHead
          title="Emner — svageste først"
          tail={trained.length > 0 ? <span className="chip">{trained.length}/{stats.length} trænet</span> : null}
        />

        {trained.length === 0 ? (
          <div className="note mt-sm">
            <Icon name="bulb" size={16} />
            <span>
              Ingen data endnu. <Link to="/grammar">Start en session</Link>, så bygger listen sig selv.
            </span>
          </div>
        ) : (
          trained.map((entry) => {
            const rate = Math.round(entry.rate * 100)
            return (
              <div className="topic-row" key={entry.lang + entry.topic}>
                <div className="topic-name">
                  <Link to={`/grammar?lang=${entry.lang}&topic=${entry.topic}&start=1`}>
                    {titleFor(entry.lang, entry.topic)}
                  </Link>
                  <span className="chip">{entry.lang === 'en' ? 'engelsk' : 'dansk'}</span>
                  <Link className="small muted" to={`/rules?lang=${entry.lang}&topic=${entry.topic}`}>
                    regel
                  </Link>
                </div>
                <div className="row" style={{ gap: '0.5rem', flexWrap: 'nowrap' }}>
                  <span className="small muted num">
                    {entry.correct}/{entry.seen} · {entry.mastered}/{entry.total} fast
                  </span>
                  <span className={'chip ' + (rate >= 85 ? 'good' : rate >= 60 ? 'warn' : 'error')}>{rate} %</span>
                </div>
                <ProgressBar value={rate} max={100} />
              </div>
            )
          })
        )}
      </section>

      <section className="card">
        <SectionHead title="Gentagelsessystemet" tail={<span className="eyebrow">5 bokse</span>} />
        <p className="small muted">Rigtigt svar rykker en opgave et trin op. Forkert sender den ned i boks 1.</p>

        <div className="segbar mt-sm" role="img" aria-label="Fordeling af opgaver over boksene">
          {BOXES.map((box) =>
            boxes[box.key] > 0 ? (
              <div key={box.key} style={{ flexGrow: boxes[box.key], background: box.color }} title={box.label + ': ' + boxes[box.key]} />
            ) : null,
          )}
        </div>

        <div className="grid grid-3fix mt">
          {BOXES.map((box) => (
            <div className="tile" key={box.key}>
              <span className="tile-label">
                <i style={{ width: 9, height: 9, borderRadius: 3, background: box.color, display: 'inline-block' }} />
                {box.label}
              </span>
              <span className="tile-value">{boxes[box.key]}</span>
              <span className="tile-hint">{box.hint}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <SectionHead title="Seneste sessioner" tail={<span className="eyebrow">{state.sessions.length} i alt</span>} />
        {sessions.length === 0 ? (
          <p className="muted small">Ingen sessioner endnu.</p>
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
                {sessions.map((session, index) => {
                  const rate = session.asked ? Math.round((session.correct / session.asked) * 100) : 0
                  return (
                    <tr key={session.date + index}>
                      <td className="num">
                        {new Date(session.date).toLocaleString('da-DK', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td>{session.module}</td>
                      <td>{session.topic === 'alle' ? 'blandet' : session.topic}</td>
                      <td>
                        <span className={'chip ' + (rate >= 85 ? 'good' : rate >= 60 ? 'warn' : 'error')}>
                          {session.correct}/{session.asked}
                        </span>
                      </td>
                      <td className="num">
                        {Math.floor(session.seconds / 60)}:{String(session.seconds % 60).padStart(2, '0')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </>
  )
}
