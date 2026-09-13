import { useEffect, useState } from 'react'

/** Læser den aktuelle rute ud af location.hash. "#/grammar?topic=komma" -> ["/grammar", {topic:"komma"}] */
function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [path, query = ''] = raw.split('?')
  const params = {}
  new URLSearchParams(query).forEach((value, key) => {
    params[key] = value
  })
  return { path: path || '/', params }
}

export function useRoute() {
  const [route, setRoute] = useState(parseHash)

  useEffect(() => {
    const onChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}

export function navigate(to) {
  if (window.location.hash === '#' + to) return
  window.location.hash = to
}

export function Link({ to, className, children, ...rest }) {
  return (
    <a
      href={'#' + to}
      className={className}
      onClick={(event) => {
        // Lad browseren håndtere modifier-klik (ny fane m.m.)
        if (event.metaKey || event.ctrlKey || event.shiftKey) return
        event.preventDefault()
        navigate(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
