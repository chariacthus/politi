import Shell from './components/Shell.jsx'
import { useRoute } from './lib/router.jsx'
import Dictation from './pages/Dictation.jsx'
import Grammar from './pages/Grammar.jsx'
import Home from './pages/Home.jsx'
import Plan from './pages/Plan.jsx'
import Progress from './pages/Progress.jsx'
import Rules from './pages/Rules.jsx'
import Scenarios from './pages/Scenarios.jsx'
import Write from './pages/Write.jsx'

const ROUTES = {
  '/': Home,
  '/grammar': Grammar,
  '/dictation': Dictation,
  '/scenarios': Scenarios,
  '/write': Write,
  '/rules': Rules,
  '/progress': Progress,
  '/plan': Plan,
}

export default function App() {
  const route = useRoute()
  const Page = ROUTES[route.path] || NotFound

  return (
    <Shell path={route.path}>
      {/* Nøglen indeholder parametrene, så et link som
          #/grammar?topic=kommatering&start=1 starter en ny session, også når
          man allerede står på siden. */}
      <Page key={route.path + '?' + new URLSearchParams(route.params).toString()} params={route.params} />
    </Shell>
  )
}

function NotFound() {
  return (
    <section className="card">
      <h1>Siden findes ikke</h1>
      <p className="muted">Brug menuen foroven til at komme videre.</p>
    </section>
  )
}
