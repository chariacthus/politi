import { useMemo, useState } from 'react'
import CountUp from '../components/CountUp.jsx'
import Icon from '../components/Icon.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import SectionHead from '../components/SectionHead.jsx'
import { units } from '../data/path.js'
import { lessonState, nextLesson, pathProgress, rankFor, unitProgress } from '../lib/lessons.js'
import { Link, navigate } from '../lib/router.jsx'
import { useProgress } from '../lib/state.jsx'
import { recognitionSupported, setVoicePreference, voicePreference } from '../lib/voice.js'

const FREE = [
  { to: '/dictation', icon: 'dictation', title: 'Diktat', text: 'Oplæsning afsnit for afsnit' },
  { to: '/write', icon: 'book', title: 'Rapport', text: 'Skriv og få teksten gennemgået' },
  { to: '/scenarios', icon: 'scenarios', title: 'Situationer', text: 'Tone under pres' },
  { to: '/grammar', icon: 'grammar', title: 'Fri grammatik', text: 'Vælg selv emne og længde' },
  { to: '/rules', icon: 'bulb', title: 'Regelbogen', text: 'Slå reglen op' },
  { to: '/progress', icon: 'progress', title: 'Fremskridt', text: 'Tal og svage punkter' },
]

export default function Path() {
  const { state } = useProgress()
  const [voice, setVoice] = useState(voicePreference)

  const progress = useMemo(() => pathProgress(state.lessons), [state.lessons])
  const rank = useMemo(() => rankFor(state.xp || 0), [state.xp])
  const next = useMemo(() => nextLesson(state.lessons), [state.lessons])

  return (
    <>
      <section className="card card-marked path-top">
        <div className="spread">
          <div>
            <span className="eyebrow">Rang · {rank.current.title}</span>
            <h1 style={{ fontSize: 'var(--t-3)', margin: '0.3rem 0 0.2rem' }}>
              <CountUp value={state.xp || 0} /> XP
            </h1>
            <p className="small muted" style={{ marginBottom: 0 }}>
              {rank.next
                ? `${rank.next.xp - (state.xp || 0)} XP til ${rank.next.title}`
                : 'Højeste rang nået — hold den ved lige.'}
            </p>
          </div>
          <div className="path-stats">
            <div>
              <b className="num">
                <CountUp value={progress.done} />/{progress.total}
              </b>
              <span>lektioner</span>
            </div>
            <div>
              <b className="num">
                <CountUp value={progress.stars} />
              </b>
              <span>stjerner</span>
            </div>
            <div>
              <b className="num">
                <CountUp value={state.streak.current} />
              </b>
              <span>dage i træk</span>
            </div>
          </div>
        </div>

        {rank.next ? (
          <div className="mt-sm">
            <ProgressBar value={rank.into} max={rank.span} tone="" />
          </div>
        ) : null}

        <div className="row mt">
          {next ? (
            <button className="primary btn-lg" onClick={() => navigate('/lesson?id=' + next.id)}>
              <Icon name="play" size={18} /> {progress.done === 0 ? 'Start forløbet' : 'Fortsæt: ' + next.title}
            </button>
          ) : (
            <button className="primary btn-lg" onClick={() => navigate('/lesson?id=' + units[0].lessons[0].id)}>
              <Icon name="refresh" size={18} /> Hele forløbet er klaret — tag en runde igen
            </button>
          )}
          <button
            className={voice ? 'btn' : 'btn-ghost'}
            onClick={() => {
              const nextValue = !voice
              setVoice(nextValue)
              setVoicePreference(nextValue)
            }}
            title={recognitionSupported() ? undefined : 'Din browser understøtter ikke talegenkendelse — du kan stadig høre modelsvaret'}
          >
            <Icon name="dictation" size={17} /> Stemmeøvelser: {voice ? 'til' : 'fra'}
          </button>
        </div>
      </section>

      {units.map((unit) => {
        const done = unitProgress(unit, state.lessons)
        const complete = done.done === done.total
        return (
          <section className={'card unit' + (complete ? ' complete' : '')} key={unit.id}>
            <div className="unit-head">
              <span className="unit-number">{unit.number}</span>
              <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                <h2>{unit.title}</h2>
                <p className="small muted" style={{ marginBottom: 0 }}>
                  {unit.blurb}
                </p>
              </div>
              <span className={'chip ' + (complete ? 'good' : '')}>
                {done.done}/{done.total}
              </span>
            </div>

            <ol className="list-reset lesson-path">
              {unit.lessons.map((lesson, lessonIndex) => {
                const status = lessonState(lesson.id, state.lessons)
                const record = state.lessons[lesson.id]
                // Forklaringen på låsen står kun ved den første låste lektion —
                // den samme sætning fire gange i træk er ren støj.
                const firstLocked =
                  status === 'locked' &&
                  unit.lessons.findIndex((entry) => lessonState(entry.id, state.lessons) === 'locked') === lessonIndex
                return (
                  <li key={lesson.id} className={'node ' + status + (lesson.checkpoint ? ' checkpoint' : '')}>
                    <button
                      className="node-dot"
                      disabled={status === 'locked'}
                      onClick={() => navigate('/lesson?id=' + lesson.id)}
                      aria-label={lesson.title + (status === 'locked' ? ' (låst)' : '')}
                    >
                      {status === 'locked' ? (
                        <Icon name="shield" size={17} />
                      ) : lesson.checkpoint ? (
                        <Icon name="target" size={18} />
                      ) : status === 'done' ? (
                        <Icon name="check" size={18} strokeWidth={2.4} />
                      ) : (
                        <Icon name="play" size={16} />
                      )}
                    </button>

                    <div className="node-body">
                      <button
                        className="node-title"
                        disabled={status === 'locked'}
                        onClick={() => navigate('/lesson?id=' + lesson.id)}
                      >
                        {lesson.title}
                      </button>
                      <div className="node-meta">
                        {status === 'locked' ? (
                          firstLocked ? <span className="small muted">Åbnes, når den forrige er klaret</span> : null
                        ) : (
                          <>
                            <span className="small muted">{lesson.size} opgaver</span>
                            {record ? (
                              <span className="stars small" aria-label={record.stars + ' af 3 stjerner'}>
                                {[1, 2, 3].map((star) => (
                                  <Icon key={star} name="spark" size={13} className={star <= record.stars ? 'star on' : 'star'} />
                                ))}
                              </span>
                            ) : null}
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>
        )
      })}

      <div className="head-spaced">
        <SectionHead title="Fri træning" tail={<span className="eyebrow">uden for forløbet</span>} />
      </div>
      <div className="grid grid-3">
        {FREE.map((entry) => (
          <Link key={entry.to} to={entry.to} className="card card-link card-flush card-tight">
            <div className="row" style={{ flexWrap: 'nowrap', gap: '0.6rem' }}>
              <Icon name={entry.icon} size={18} style={{ color: 'var(--navy)', flex: 'none' }} />
              <b>{entry.title}</b>
              <Icon name="arrow" size={16} className="card-arrow" style={{ marginLeft: 'auto' }} />
            </div>
            <p className="small muted" style={{ margin: '0.35rem 0 0' }}>
              {entry.text}
            </p>
          </Link>
        ))}
      </div>

      <div className="note mt">
        <Icon name="shield" size={16} />
        <span>
          Indholdet er skrevet ud fra politiets regelgrundlag og almindelige retskrivningsregler. Det er ikke
          officielt undervisningsmateriale — kontrollér altid gældende regler på retsinformation.dk.
        </span>
      </div>
    </>
  )
}
