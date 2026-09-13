import { examNotes, weeks } from '../data/plan.js'
import { daysUntil, useProgress } from '../lib/state.jsx'

export default function Plan() {
  const { state, setExamDate, togglePlanTask } = useProgress()
  const days = daysUntil(state.examDate)

  // Med en prøvedato regner vi baglæns: otte uger før prøven er uge 1.
  const currentWeek = days === null ? null : Math.min(8, Math.max(1, 9 - Math.ceil(days / 7)))

  return (
    <>
      <section className="card">
        <h1>Træningsplan</h1>
        <p className="muted">
          Otte uger fra grundregler til prøvesimulering. Sæt din prøvedato, så markeres den uge, du bør være i.
        </p>
        <div className="row">
          <div className="inline-field">
            <label htmlFor="exam-date">Prøvedato</label>
            <input
              id="exam-date"
              type="date"
              value={state.examDate || ''}
              onChange={(event) => setExamDate(event.target.value)}
            />
          </div>
          {days !== null ? (
            <div className="stat" style={{ flex: '0 0 auto' }}>
              <div className="label">Dage til prøven</div>
              <div className="value">{days}</div>
              <div className="hint">{days > 0 ? 'du bør være i uge ' + currentWeek : 'datoen er passeret'}</div>
            </div>
          ) : null}
        </div>
      </section>

      {weeks.map((week) => {
        const isCurrent = currentWeek === week.week && days > 0
        const doneCount = week.tasks.filter((task) => state.planDone[task.id]).length
        return (
          <section className="card" key={week.week} style={isCurrent ? { borderColor: 'var(--accent)' } : undefined}>
            <div className="spread">
              <h2>
                Uge {week.week} — {week.title}
              </h2>
              <span className={'pill' + (isCurrent ? ' accent' : '')}>
                {isCurrent ? 'i gang · ' : ''}
                {doneCount}/{week.tasks.length}
              </span>
            </div>
            <p className="small muted">Fokus: {week.focus}</p>
            <ul className="list-reset checklist">
              {week.tasks.map((task) => {
                const done = Boolean(state.planDone[task.id])
                return (
                  <li key={task.id} className={done ? 'done' : undefined}>
                    <input
                      type="checkbox"
                      id={task.id}
                      checked={done}
                      onChange={() => togglePlanTask(task.id)}
                    />
                    <label htmlFor={task.id}>{task.text}</label>
                  </li>
                )
              })}
            </ul>
            <p className="note small">Mål: {week.goal}</p>
          </section>
        )
      })}

      <section className="card">
        <h2>Om prøven</h2>
        <ul>
          {examNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
    </>
  )
}
