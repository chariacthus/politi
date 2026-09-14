/**
 * Valgskærmen. Første gang appen åbnes, vælger man kursus — som i Duolingo.
 * Politi er bygget; matematik har farve og plan, men siger tydeligt fra, til
 * det er klar. Valget kan altid laves om under Profil.
 */
import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import Mascot from '../components/Mascot.jsx'
import { courses } from '../data/courses.js'
import { applyCourse } from '../lib/course.js'
import { navigate } from '../lib/router.jsx'
import { play as playSound } from '../lib/sound.js'

export default function Welcome({ onPick }) {
  const [picked, setPicked] = useState(null)
  const [notice, setNotice] = useState(null)

  function choose(course) {
    if (!course.ready) {
      setNotice(course.id)
      // Farven skifter alligevel, så man kan se, hvad der venter.
      applyCourse(course.id)
      setTimeout(() => applyCourse(picked || 'politi'), 1400)
      return
    }
    setPicked(course.id)
    setNotice(null)
    applyCourse(course.id)
    playSound('correct')
  }

  function start() {
    applyCourse(picked)
    onPick?.(picked)
    navigate('/')
  }

  return (
    <div className="welcome">
      <div className="welcome-inner">
        <div className="welcome-head">
          <Mascot mood="happy" size={92} />
          <div>
            <span className="eyebrow">Politiskolen</span>
            <h1>Hvad vil du træne?</h1>
            <p className="lead">
              Vælg dit spor. Du kan skifte når som helst, og fremskridtet bliver stående i det spor, du
              forlader.
            </p>
          </div>
        </div>

        <div className="course-grid">
          {courses.map((course) => (
            <button
              key={course.id}
              className={'course-card ' + course.id + (picked === course.id ? ' picked' : '') + (course.ready ? '' : ' soon')}
              onClick={() => choose(course)}
              aria-pressed={picked === course.id}
            >
              <span className="course-top">
                <span className="course-icon">
                  <Icon name={course.icon} size={30} />
                </span>
                <span className={'course-flag' + (course.ready ? ' on' : '')}>
                  {course.ready ? 'Klar' : 'Ikke klar endnu'}
                </span>
              </span>
              <span className="course-name">{course.name}</span>
              <span className="course-tagline">{course.tagline}</span>
              <span className="course-blurb">{course.blurb}</span>
              <span className="course-points">
                {course.points.map((point) => (
                  <span key={point}>
                    <Icon name={course.ready ? 'check' : 'clock'} size={14} /> {point}
                  </span>
                ))}
              </span>
              {picked === course.id ? (
                <span className="course-tick">
                  <Icon name="check" size={18} strokeWidth={2.6} />
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {notice ? (
          <div className="note welcome-note" role="status">
            <Icon name="clock" size={16} />
            <span>
              <b>Matematik er ikke bygget endnu.</b> Sporet ligger klar med farve og plan, men der er
              ingen opgaver i det. Vælg politi nu — matematikken kommer samme sted, når den er skrevet
              færdig.
            </span>
          </div>
        ) : null}

        <div className="welcome-foot">
          <button className="btn-3d welcome-go" disabled={!picked} onClick={start}>
            {picked ? 'Kom i gang' : 'Vælg et spor'} <Icon name="arrow" size={19} />
          </button>
          <p className="small muted">
            Alt gemmes kun i denne browser. Ingen konto, ingen server, ingen data der forlader maskinen.
          </p>
        </div>
      </div>
    </div>
  )
}
