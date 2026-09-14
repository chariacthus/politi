// Valgt kursus. Ligger for sig selv i localStorage, ligesom tema og lyd, så
// et nulstillet fremskridt ikke sender dig tilbage til valgskærmen.

import { courses } from '../data/courses.js'

const KEY = 'politi.course'

export function readCourse() {
  try {
    const stored = window.localStorage.getItem(KEY)
    return courses.some((course) => course.id === stored) ? stored : null
  } catch {
    return null
  }
}

export function applyCourse(id) {
  const root = document.documentElement
  if (id) root.setAttribute('data-course', id)
  else root.removeAttribute('data-course')
  try {
    if (id) window.localStorage.setItem(KEY, id)
    else window.localStorage.removeItem(KEY)
  } catch {
    /* uden localStorage gælder valget kun denne side */
  }
}
