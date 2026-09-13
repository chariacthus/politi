import Shell from './components/Shell.jsx'
import { useRoute } from './lib/router.jsx'
import Dictation from './pages/Dictation.jsx'
import Grammar from './pages/Grammar.jsx'
import Home from './pages/Home.jsx'
import Plan from './pages/Plan.jsx'
import Progress from './pages/Progress.jsx'
import Scenarios from './pages/Scenarios.jsx'

const ROUTES = {
  '/': Home,
  '/grammar': Grammar,
  '/dictation': Dictation,
  '/scenarios': Scenarios,
  '/progress': Progress,
  '/plan': Plan,
}

export default function App() {
  const route = useRoute()
  const Page = ROUTES[route.path] || NotFound

  return (
    <Shell path={route.path}>
      <Page params={route.params} />
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
