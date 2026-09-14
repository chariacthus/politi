/**
 * Skallen. Fire steder at være — Lær, Øv, Regler, Profil — og ikke mere end
 * det. Venstre skinne på store skærme, faner i bunden på telefonen, og
 * statistikken i højre skinne, så siderne selv kan koncentrere sig om stoffet.
 */
import { useEffect } from 'react'
import { rankFor } from '../lib/lessons.js'
import { scrollTop } from '../lib/media.js'
import { Link } from '../lib/router.jsx'
import { useProgress } from '../lib/state.jsx'
import Icon from './Icon.jsx'
import Ring from './Ring.jsx'
import Stats, { StatStrip } from './Stats.jsx'

const NAV = [
  { to: '/', label: 'Lær', icon: 'home', match: ['/', '/lesson'] },
  { to: '/practice', label: 'Øv', icon: 'bolt', match: ['/practice', '/grammar', '/dictation', '/write', '/scenarios'] },
  { to: '/rules', label: 'Regler', icon: 'book', match: ['/rules'] },
  { to: '/profile', label: 'Profil', icon: 'user', match: ['/profile', '/progress', '/plan'] },
]

export default function Shell({ path, children }) {
  const { state } = useProgress()
  const rank = rankFor(state.xp || 0)
  const into = rank.span ? Math.min(100, Math.round((rank.into / rank.span) * 100)) : 100

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
        <nav className="rail-nav">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className={'rail-item' + (active(item) ? ' active' : '')}>
              <Icon name={item.icon} size={21} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Nederst står den eneste status, der hører til navigationen: hvor
            langt man er som betjent. */}
        <Link to="/profile" className="rail-rank">
          <Ring value={rank.span ? rank.into : 1} max={rank.span || 1} size={30} thickness={3} tone="ok" />
          <span>
            <b>{rank.current.title}</b>
            <i>{rank.next ? into + '%' : 'højeste rang'}</i>
          </span>
        </Link>
      </aside>

      <header className="topbar">
        <span className="topbar-rank">{rank.current.title}</span>
        <StatStrip />
      </header>

      <main className="view">
        <div className="view-inner" key={path}>
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
