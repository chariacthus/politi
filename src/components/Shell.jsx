import { useEffect, useState } from 'react'
import { scrollTop } from '../lib/media.js'
import { Link } from '../lib/router.jsx'
import { setSoundEnabled, soundEnabled } from '../lib/sound.js'
import { daysUntil, useProgress } from '../lib/state.jsx'
import { applyTheme, readTheme } from '../lib/theme.js'
import Icon from './Icon.jsx'

const NAV = [
  { to: '/', label: 'Forside', icon: 'home', group: null },
  { to: '/grammar', label: 'Grammatik', icon: 'grammar', group: 'Træning' },
  { to: '/dictation', label: 'Diktat', icon: 'dictation', group: null },
  { to: '/write', label: 'Rapport', icon: 'book', group: null },
  { to: '/scenarios', label: 'Situationer', icon: 'scenarios', group: null },
  { to: '/rules', label: 'Regelbogen', icon: 'bulb', group: 'Lær' },
  { to: '/progress', label: 'Fremskridt', icon: 'progress', group: 'Overblik' },
  { to: '/plan', label: 'Træningsplan', icon: 'plan', group: null },
]

// Mobilen har plads til seks faner; resten ligger i "Mere".
const TABS = [
  { to: '/', label: 'Hjem', icon: 'home' },
  { to: '/grammar', label: 'Grammatik', icon: 'grammar' },
  { to: '/dictation', label: 'Diktat', icon: 'dictation' },
  { to: '/write', label: 'Rapport', icon: 'book' },
  { to: '/scenarios', label: 'Situation', icon: 'scenarios' },
]
const MORE = [
  { to: '/rules', label: 'Regelbogen', icon: 'bulb', text: 'Reglerne med eksempler og typiske fejl' },
  { to: '/progress', label: 'Fremskridt', icon: 'progress', text: 'Hvor du står, og hvad du skal træne nu' },
  { to: '/plan', label: 'Træningsplan', icon: 'plan', text: 'Otte uger frem mod prøvedatoen' },
]

const THEME_ORDER = { system: 'light', light: 'dark', dark: 'system' }
const THEME_ICON = { system: 'layers', light: 'sun', dark: 'moon' }
const THEME_TEXT = { system: 'Følger systemet', light: 'Lys', dark: 'Mørk' }

export default function Shell({ path, children }) {
  const { state } = useProgress()
  const [theme, setTheme] = useState(readTheme)
  const [sound, setSound] = useState(soundEnabled)
  const [moreOpen, setMoreOpen] = useState(false)
  const days = daysUntil(state.examDate)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    scrollTop()
    setMoreOpen(false)
  }, [path])

  const controls = (
    <>
      <button
        className="icon-btn"
        onClick={() => setTheme((current) => THEME_ORDER[current])}
        title={'Tema: ' + THEME_TEXT[theme]}
        aria-label={'Skift tema. Nu: ' + THEME_TEXT[theme]}
      >
        <Icon name={THEME_ICON[theme]} size={19} />
      </button>
      <button
        className="icon-btn"
        onClick={() => {
          const next = !sound
          setSound(next)
          setSoundEnabled(next)
        }}
        title={sound ? 'Lyd til' : 'Lyd fra'}
        aria-label={sound ? 'Slå lyd fra' : 'Slå lyd til'}
      >
        <Icon name={sound ? 'volume' : 'x'} size={19} />
      </button>
    </>
  )

  const moreActive = MORE.some((item) => item.to === path)

  return (
    <div className="app">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <Icon name="shield" size={21} />
          </span>
          <span className="brand-text">
            <b>Optagelsestræning</b>
            <span>Dansk · tone · rapport</span>
          </span>
        </Link>

        <nav className="nav">
          {NAV.map((item) => (
            <div key={item.to}>
              {item.group ? <div className="nav-group">{item.group}</div> : null}
              <Link to={item.to} className={'nav-item' + (path === item.to ? ' active' : '')}>
                <Icon name={item.icon} size={19} />
                {item.label}
              </Link>
            </div>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="side-card">
            <div className="side-stat">
              <Icon name="flame" size={20} />
              <div>
                <b className="num">{state.streak.current}</b>
                <span>{state.streak.current === 1 ? 'dag i træk' : 'dage i træk'}</span>
              </div>
            </div>
            {days !== null ? (
              <div className="side-stat">
                <Icon name="clock" size={20} />
                <div>
                  <b className="num">{days}</b>
                  <span>{days === 1 ? 'dag til prøven' : 'dage til prøven'}</span>
                </div>
              </div>
            ) : (
              <Link to="/plan" className="small">
                Sæt din prøvedato
              </Link>
            )}
          </div>

          <div className="row" style={{ gap: '0.4rem' }}>
            {controls}
            <span className="small muted">{THEME_TEXT[theme]}</span>
          </div>
        </div>
      </aside>

      <div className="main">
        <div className="mobile-bar">
          <Link to="/" className="brand">
            <span className="brand-mark">
              <Icon name="shield" size={19} />
            </span>
            <span className="brand-text">
              <b>Optagelsestræning</b>
            </span>
          </Link>
          <div className="row" style={{ gap: '0.35rem' }}>
            <span className="chip accent">
              <Icon name="flame" size={13} /> {state.streak.current}
            </span>
            {controls}
          </div>
        </div>

        <div className="page" key={path}>
          {children}
        </div>

        {moreOpen ? (
          <>
            <div className="sheet-backdrop" onClick={() => setMoreOpen(false)} />
            <div className="sheet">
              <div className="sheet-handle" />
              {MORE.map((item) => (
                <Link key={item.to} to={item.to} className={'sheet-item' + (path === item.to ? ' active' : '')}>
                  <Icon name={item.icon} size={20} />
                  <div>
                    <b>{item.label}</b>
                    <span>{item.text}</span>
                  </div>
                  <Icon name="arrow" size={17} style={{ marginLeft: 'auto', color: 'var(--muted)' }} />
                </Link>
              ))}
            </div>
          </>
        ) : null}

        <nav className="tabbar">
          {TABS.map((item) => (
            <Link key={item.to} to={item.to} className={'tab' + (path === item.to ? ' active' : '')}>
              <Icon name={item.icon} size={21} />
              {item.label}
            </Link>
          ))}
          <button className={'tab' + (moreActive || moreOpen ? ' active' : '')} onClick={() => setMoreOpen((open) => !open)}>
            <Icon name="layers" size={21} />
            Mere
          </button>
        </nav>
      </div>
    </div>
  )
}
