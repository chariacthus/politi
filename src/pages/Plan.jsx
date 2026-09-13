import Icon from '../components/Icon.jsx'
import Ring from '../components/Ring.jsx'
import SectionHead from '../components/SectionHead.jsx'
import { examNotes, weeks } from '../data/plan.js'
import { daysUntil, useProgress } from '../lib/state.jsx'

export default function Plan() {
  const { state, setExamDate, togglePlanTask } = useProgress()
  const days = daysUntil(state.examDate)

  // Med en prøvedato regner vi baglæns: otte uger før prøven er uge 1.
  const currentWeek = days === null ? null : Math.min(8, Math.max(1, 9 - Math.ceil(days / 7)))

  const allTasks = weeks.flatMap((week) => week.tasks)
  const doneTotal = allTasks.filter((task) => state.planDone[task.id]).length

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Overblik</span>
        <h1>Træningsplan</h1>
        <p>Otte uger fra grundregler til prøvesimulering. Sæt din prøvedato, så markeres den uge, du bør være i.</p>
      </div>

      <section className="card">
        <div className="row" style={{ gap: '1.5rem' }}>
          <Ring value={doneTotal} max={allTasks.length} size={92} thickness={8} label={doneTotal + '/' + allTasks.length} sub="opgaver" />
          <div className="field field-inline" style={{ marginBottom: 0 }}>
            <label htmlFor="exam-date">Din prøvedato</label>
            <input id="exam-date" type="date" value={state.examDate || ''} onChange={(event) => setExamDate(event.target.value)} />
          </div>
          {days !== null ? (
            <div className="tile accent" style={{ flex: '0 0 auto', minWidth: 150 }}>
              <span className="tile-label">
                <Icon name="clock" size={14} /> Dage til prøven
              </span>
              <span className="tile-value">{days}</span>
              <span className="tile-hint">{days > 0 ? 'du bør være i uge ' + currentWeek : 'datoen er passeret'}</span>
            </div>
          ) : (
            <div className="note" style={{ flex: '1 1 220px' }}>
              <Icon name="bulb" size={16} />
              <span>Sæt en dato, så kan planen fortælle dig, hvilken uge du bør være i lige nu.</span>
            </div>
          )}
        </div>
      </section>

      {weeks.map((week) => {
        const doneCount = week.tasks.filter((task) => state.planDone[task.id]).length
        const complete = doneCount === week.tasks.length
        const isCurrent = currentWeek === week.week && days > 0
        return (
          <section
            className={'card week-card' + (isCurrent ? ' current' : '') + (complete ? ' complete' : '')}
            key={week.week}
          >
            <div className="spread">
              <div className="row" style={{ flexWrap: 'nowrap', gap: '0.75rem' }}>
                <span className="timeline-mark">{complete ? <Icon name="check" size={17} strokeWidth={2.4} /> : week.week}</span>
                <div>
                  <h2 style={{ margin: 0, fontSize: 'var(--t-1)' }}>{week.title}</h2>
                  <div className="small muted">Fokus: {week.focus}</div>
                </div>
              </div>
              <div className="row" style={{ gap: '0.4rem' }}>
                {isCurrent ? <span className="chip accent">i gang</span> : null}
                <span className={'chip ' + (complete ? 'good' : '')}>
                  {doneCount}/{week.tasks.length}
                </span>
              </div>
            </div>

            <ul className="list-reset checklist mt-sm">
              {week.tasks.map((task) => {
                const done = Boolean(state.planDone[task.id])
                return (
                  <li key={task.id} className={done ? 'done' : undefined}>
                    <input type="checkbox" id={task.id} checked={done} onChange={() => togglePlanTask(task.id)} />
                    <label htmlFor={task.id}>{task.text}</label>
                  </li>
                )
              })}
            </ul>

            <div className="note mt-sm">
              <Icon name="target" size={16} />
              <span>Mål: {week.goal}</span>
            </div>
          </section>
        )
      })}

      <section className="card">
        <SectionHead title="Om prøven" />
        <ul className="list-reset stacklist">
          {examNotes.map((note) => (
            <li key={note} className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start', gap: '0.7rem' }}>
              <Icon name="shield" size={17} style={{ marginTop: '0.2rem', color: 'var(--accent)', flex: 'none' }} />
              <span className="small" style={{ color: 'var(--text-soft)' }}>{note}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
