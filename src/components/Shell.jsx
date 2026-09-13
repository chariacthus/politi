import { Link } from '../lib/router.jsx'

const NAV = [
  { to: '/', label: 'Forside' },
  { to: '/grammar', label: 'Grammatik' },
  { to: '/dictation', label: 'Diktat' },
  { to: '/scenarios', label: 'Situationer' },
  { to: '/progress', label: 'Fremskridt' },
  { to: '/plan', label: 'Træningsplan' },
]

export default function Shell({ path, children }) {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand">
            Optagelses<span>træning</span>
          </Link>
          <nav className="nav">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} className={path === item.to ? 'active' : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer>
        Privat træningsværktøj. Fremskridt gemmes kun i denne browser. Opgaverne er skrevet ud fra
        almindelige retskrivningsregler og er ikke officielle prøvespørgsmål.
      </footer>
    </div>
  )
}
