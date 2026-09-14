import { useEffect, useState } from 'react'
import Shell from './components/Shell.jsx'
import { applyCourse, readCourse } from './lib/course.js'
import { useRoute } from './lib/router.jsx'
import Dictation from './pages/Dictation.jsx'
import Grammar from './pages/Grammar.jsx'
import Lesson from './pages/Lesson.jsx'
import Path from './pages/Path.jsx'
import Practice from './pages/Practice.jsx'
import Profile from './pages/Profile.jsx'
import Rules from './pages/Rules.jsx'
import Scenarios from './pages/Scenarios.jsx'
import Welcome from './pages/Welcome.jsx'
import Write from './pages/Write.jsx'

const ROUTES = {
  '/': Path,
  '/lesson': Lesson,
  '/grammar': Grammar,
  '/dictation': Dictation,
  '/scenarios': Scenarios,
  '/write': Write,
  '/practice': Practice,
  '/rules': Rules,
  '/profile': Profile,
  // Gamle adresser peger ind i profilen, så delte links stadig virker.
  '/progress': Profile,
  '/plan': Profile,
}

export default function App() {
  const route = useRoute()
  const [course, setCourse] = useState(readCourse)

  useEffect(() => {
    applyCourse(course)
  }, [course])

  // Uden et valgt spor er der kun ét sted at være: valgskærmen.
  if (!course || route.path === '/start') {
    return <Welcome onPick={setCourse} />
  }

  const Page = ROUTES[route.path] || NotFound

  return (
    <Shell path={route.path}>
      {/* Nøglen indeholder parametrene, så et link som
          #/grammar?topic=kommatering&start=1 starter en ny session, også når
          man allerede står på siden. */}
      <Page key={route.path + '?' + new URLSearchParams(route.params).toString()} params={route.params} path={route.path} />
    </Shell>
  )
}

function NotFound() {
  return (
    <section className="card">
      <h1>Siden findes ikke</h1>
      <p className="muted">Brug menuen til at komme videre — eller tag den næste lektion på stien.</p>
    </section>
  )
}
