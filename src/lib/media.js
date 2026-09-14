import { useEffect, useState } from 'react'

/** Lytter på en media query, så komponenter kan vælge størrelser efter skærmen. */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (!window.matchMedia) return undefined
    const list = window.matchMedia(query)
    const onChange = (event) => setMatches(event.matches)
    setMatches(list.matches)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** Ruller til toppen — bruges ved sideskift og ved ny opgave i en session. */
export function scrollTop() {
  if (typeof window === 'undefined') return
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/** Dansk ental/flertal: plural(1, 'session', 'sessioner') → "1 session". */
export function plural(count, one, many) {
  return count + ' ' + (count === 1 ? one : many)
}

/** Dato skrevet ud på dansk — <input type="date"> viser browserens eget format. */
export function longDate(value) {
  if (!value) return null
  const date = new Date(value + 'T00:00:00')
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('da-DK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
