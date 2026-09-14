/**
 * Profil. Alt om dig ét sted: hvor du står, planen frem mod prøven og
 * indstillingerne. Tre faner i stedet for tre sider i en menu.
 */
import { useEffect, useMemo, useState } from 'react'
import Icon from '../components/Icon.jsx'
import Mascot from '../components/Mascot.jsx'
import SectionHead from '../components/SectionHead.jsx'
import { useStats } from '../components/Stats.jsx'
import { courseById } from '../data/courses.js'
import { readCourse } from '../lib/course.js'
import { DAILY_GOAL } from '../lib/goal.js'
import { longDate } from '../lib/media.js'
import { navigate } from '../lib/router.jsx'
import { hapticsEnabled, hapticsSupported, setHapticsEnabled, setSoundEnabled, soundEnabled } from '../lib/sound.js'
import { loadVoices, readVoiceName, setVoiceName, voicesFor } from '../lib/speech.js'
import { useProgress } from '../lib/state.jsx'
import { applyTheme, readTheme } from '../lib/theme.js'
import { recognitionSupported, setVoicePreference, voicePreference } from '../lib/voice.js'
import PlanView from './Plan.jsx'
import ProgressView from './Progress.jsx'

const TABS = [
  { id: 'stats', label: 'Fremskridt', icon: 'progress' },
  { id: 'plan', label: 'Træningsplan', icon: 'plan' },
  { id: 'settings', label: 'Indstillinger', icon: 'gear' },
]

// De gamle adresser peger stadig det rigtige sted hen.
const FROM_PATH = { '/progress': 'stats', '/plan': 'plan' }

export default function Profile({ params, path }) {
  // Fanen står i adressen, så et link som #/profile?tab=plan åbner det rigtige.
  const tab = TABS.some((entry) => entry.id === params.tab) ? params.tab : FROM_PATH[path] || 'stats'
  const { state } = useProgress()
  const { rank, path: progress, today, goalDone, days } = useStats()

  const since = useMemo(() => longDate(String(state.startedAt).slice(0, 10)), [state.startedAt])

  return (
    <>
      <section className="profile-head">
        <Mascot mood={goalDone ? 'happy' : 'neutral'} size={82} />
        <div className="profile-id">
          <span className="eyebrow">Din profil</span>
          <h1>{rank.current.title}</h1>
          <p className="small muted">
            {state.xp || 0} XP · {progress.done} af {progress.total} lektioner
          </p>
        </div>
        <div className="profile-badges">
          <span className="badge">
            <Icon name="flame" size={16} /> {state.streak.current}
          </span>
          <span className={'badge' + (goalDone ? ' on' : '')}>
            <Icon name="target" size={16} /> {today}/{DAILY_GOAL}
          </span>
          {days !== null ? (
            <span className="badge">
              <Icon name="clock" size={16} /> {days} d
            </span>
          ) : null}
        </div>
      </section>

      <div className="segmented tabs-lg">
        {TABS.map((entry) => (
          <button key={entry.id} className={tab === entry.id ? 'on' : ''} onClick={() => navigate('/profile?tab=' + entry.id)}>
            <Icon name={entry.icon} size={17} /> {entry.label}
          </button>
        ))}
      </div>

      {tab === 'stats' ? <ProgressView /> : null}
      {tab === 'plan' ? <PlanView /> : null}
      {tab === 'settings' ? <Settings /> : null}
    </>
  )
}

const THEMES = [
  { id: 'light', label: 'Lys', icon: 'sun' },
  { id: 'dark', label: 'Mørk', icon: 'moon' },
  { id: 'system', label: 'System', icon: 'layers' },
]

function Settings() {
  const { resetAll } = useProgress()
  const [theme, setThemeState] = useState(readTheme)
  const [sound, setSound] = useState(soundEnabled)
  const [haptics, setHaptics] = useState(hapticsEnabled)
  const [voice, setVoice] = useState(voicePreference)
  const [voiceList, setVoiceList] = useState([])
  const [voiceName, setVoiceChoice] = useState(readVoiceName)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    let alive = true
    loadVoices().then((all) => {
      if (alive) setVoiceList([...voicesFor(all, 'da'), ...voicesFor(all, 'en')])
    })
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const course = courseById(readCourse())

  return (
    <>
      <section className="card">
        <SectionHead title="Spor" tail={<span className="chip accent">{course.name}</span>} />
        <div className="setting-row">
          <div>
            <b>{course.name}</b>
            <p className="small muted">{course.blurb}</p>
          </div>
          <button className="btn-ghost" onClick={() => navigate('/start')}>
            <Icon name="layers" size={16} /> Skift spor
          </button>
        </div>
        <p className="small muted" style={{ marginBottom: 0 }}>
          Matematik er ikke bygget endnu — sporet kan vælges, men siger selv fra, indtil der er opgaver i
          det. Fremskridt i politisporet rører det ikke.
        </p>
      </section>

      <section className="card">
        <SectionHead title="Udseende" />
        <p className="small muted">Vælg et tema. "System" følger indstillingen på din computer eller telefon.</p>
        <div className="segmented mt-sm">
          {THEMES.map((entry) => (
            <button key={entry.id} className={theme === entry.id ? 'on' : ''} onClick={() => setThemeState(entry.id)}>
              <Icon name={entry.icon} size={16} /> {entry.label}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <SectionHead title="Lyd og stemme" />
        <div className="setting-row">
          <div>
            <b>Lydeffekter</b>
            <p className="small muted">Korte toner ved rigtigt, forkert og fuldført lektion.</p>
          </div>
          <Toggle
            on={sound}
            onChange={(next) => {
              setSound(next)
              setSoundEnabled(next)
            }}
            label="lydeffekter"
          />
        </div>
        <div className="setting-row">
          <div>
            <b>Oplæserens stemme</b>
            <p className="small muted">
              {voiceList.length > 0
                ? 'Vælg den stemme, der læser reglerne op.'
                : 'Denne browser har ingen stemmer installeret. Oplæseren fremhæver stadig teksten i læsetempo.'}
            </p>
          </div>
          {voiceList.length > 0 ? (
            <select
              className="voice-pick"
              value={voiceName}
              aria-label="Vælg oplæserens stemme"
              onChange={(event) => {
                setVoiceChoice(event.target.value)
                setVoiceName(event.target.value)
              }}
            >
              <option value="">Vælg automatisk</option>
              {voiceList.map((entry) => (
                <option key={entry.name} value={entry.name}>
                  {entry.name} ({entry.lang})
                </option>
              ))}
            </select>
          ) : null}
        </div>
        <div className="setting-row">
          <div>
            <b>Vibration</b>
            <p className="small muted">
              {hapticsSupported()
                ? 'Et kort ryk i telefonen ved svar og fejring.'
                : 'Denne enhed kan ikke vibrere.'}
            </p>
          </div>
          <Toggle
            on={haptics && hapticsSupported()}
            onChange={(next) => {
              setHaptics(next)
              setHapticsEnabled(next)
            }}
            label="vibration"
          />
        </div>
        <div className="setting-row">
          <div>
            <b>Stemmeøvelser</b>
            <p className="small muted">
              Opgaver, hvor du siger meldingen højt.{' '}
              {recognitionSupported()
                ? 'Browseren kan genkende tale — øvelsen rettes automatisk.'
                : 'Denne browser kan ikke genkende tale; modellen læses op, og du bedømmer selv.'}
            </p>
          </div>
          <Toggle
            on={voice}
            onChange={(next) => {
              setVoice(next)
              setVoicePreference(next)
            }}
            label="stemmeøvelser"
          />
        </div>
      </section>

      <section className="card">
        <SectionHead title="Data" />
        <p className="small muted">
          Alt ligger i denne browser — intet sendes videre. Nulstilling sletter svar, sessioner, stjerner,
          scenarie- og rapportresultater samt træningsplanen. Kan ikke fortrydes.
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
              <Icon name="trash" size={17} /> Ja, slet alt
            </button>
            <button onClick={() => setConfirming(false)}>Fortryd</button>
          </div>
        ) : (
          <button onClick={() => setConfirming(true)}>
            <Icon name="trash" size={17} /> Nulstil alle data
          </button>
        )}
      </section>

      <section className="card">
        <SectionHead title="Om materialet" />
        <p className="small muted" style={{ marginBottom: 0 }}>
          Opgaverne er skrevet ud fra politiets regelgrundlag og almindelige danske retskrivningsregler. Det er
          ikke officielt undervisningsmateriale fra politiet, og lovgivning ændres — kontrollér den gældende
          ordlyd på retsinformation.dk.
        </p>
      </section>
    </>
  )
}

function Toggle({ on, onChange, label }) {
  return (
    <button
      className={'toggle' + (on ? ' on' : '')}
      role="switch"
      aria-checked={on}
      aria-label={(on ? 'Slå fra: ' : 'Slå til: ') + label}
      onClick={() => onChange(!on)}
    >
      <span className="knob" />
    </button>
  )
}
