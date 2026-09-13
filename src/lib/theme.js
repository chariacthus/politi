// Tema: system som udgangspunkt, men valget kan overstyres og huskes.
const KEY = 'politi.theme'
export const THEMES = ['system', 'light', 'dark']

export function readTheme() {
  try {
    const stored = window.localStorage.getItem(KEY)
    return THEMES.includes(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

export function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', theme)
  try {
    window.localStorage.setItem(KEY, theme)
  } catch {
    /* ingen adgang til localStorage — temaet gælder så kun denne side */
  }
}
