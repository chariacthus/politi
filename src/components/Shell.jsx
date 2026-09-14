/**
 * Skallen. Fire steder at være — Lær, Øv, Regler, Profil — og ikke mere end
 * det. Venstre skinne på store skærme, faner i bunden på telefonen, og
 * statistikken i højre skinne, så siderne selv kan koncentrere sig om stoffet.
 */
import { useEffect } from 'react'
import { scrollTop } from '../lib/media.js'
import { Link } from '../lib/router.jsx'
import Icon from './Icon.jsx'
import Stats, { StatStrip } from './Stats.jsx'

const NAV = [
  { to: '/', label: 'Lær', icon: 'home', match: ['/', '/lesson'] },
  { to: '/practice', label: 'Øv', icon: 'bolt', match: ['/practice', '/grammar', '/dictation', '/write', '/scenarios'] },
  { to: '/rules', label: 'Regler', icon: 'book', match: ['/rules'] },
  { to: '/profile', label: 'Profil', icon: 'user', match: ['/profile', '/progress', '/plan'] },
]

export default function Shell({ path, children }) {
  useEffect(() => {
    scrollTop()
  }, [path])

  // Lektionen tager hele skærmen: ingen skinner, ingen faner — kun opgaven.
  if (path === '/lesson') {
    return <div className="play-shell">{children}</div>
  }

  const active = (item) => item.match.includes(path)

  return (
    <div className="duo">
      <aside className="rail">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <Icon name="shield" size={20} />
          </span>
          <span className="brand-text">
            <b>Politiskolen</b>
            <span>optagelsestræning</span>
          </span>
        </Link>

        <nav className="rail-nav">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className={'rail-item' + (active(item) ? ' active' : '')}>
              <Icon name={item.icon} size={22} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <Icon name="shield" size={18} />
          </span>
          <span className="brand-text">
            <b>Politiskolen</b>
          </span>
        </Link>
        <StatStrip />
      </header>

      <main className="stage">
        <div className="stage-inner" key={path}>
          {children}
        </div>
      </main>

      <aside className="side">
        <Stats />
      </aside>

      <nav className="tabbar">
        {NAV.map((item) => (
          <Link key={item.to} to={item.to} className={'tab' + (active(item) ? ' active' : '')}>
            <Icon name={item.icon} size={22} />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
