// Talesyntese til diktat. Browseren har ikke altid en dansk stemme — og i nogle
// browsere udfyldes stemmelisten først asynkront. Modulet må aldrig gå i stå
// på det, så alt udenom har en fallback.

export function speechAvailable() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

let cachedVoices = null

export function loadVoices() {
  if (!speechAvailable()) return Promise.resolve([])
  if (cachedVoices && cachedVoices.length) return Promise.resolve(cachedVoices)

  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length) {
      cachedVoices = voices
      resolve(voices)
      return
    }

    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      cachedVoices = window.speechSynthesis.getVoices()
      resolve(cachedVoices)
    }

    window.speechSynthesis.addEventListener('voiceschanged', finish, { once: true })
    // Nogle browsere sender aldrig voiceschanged. Giv op efter et sekund.
    setTimeout(finish, 1000)
  })
}

// Stemmer, der lyder som en instruktør frem for en oplæser. Navnene er dem,
// styresystemerne bruger; findes ingen af dem, tages den første på sproget.
const AUTHORITY = [
  // dansk
  'magnus', 'jesper', 'mads', 'rasmus', 'dansk (mand)', 'danish (male)',
  // engelsk
  'daniel', 'george', 'ryan', 'arthur', 'oliver', 'uk english male', 'male',
]
const SOFT = ['helle', 'sara', 'anne', 'female', 'kvinde']

const VOICE_KEY = 'politi.stemme'

export function readVoiceName() {
  try {
    return window.localStorage.getItem(VOICE_KEY) || ''
  } catch {
    return ''
  }
}

export function setVoiceName(name) {
  try {
    if (name) window.localStorage.setItem(VOICE_KEY, name)
    else window.localStorage.removeItem(VOICE_KEY)
  } catch {
    /* ignoreres med vilje */
  }
}

/** Alle stemmer på et sprog — til listen i indstillingerne. */
export function voicesFor(voices, lang) {
  const tag = lang === 'en' ? 'en' : 'da'
  return voices.filter((voice) => voice.lang?.toLowerCase().startsWith(tag))
}

/**
 * Vælg stemme: brugerens eget valg vinder, ellers den dybeste, mest
 * myndige stemme på sproget.
 */
export function pickVoice(voices, lang, { name = readVoiceName() } = {}) {
  const onLang = voicesFor(voices, lang)
  if (onLang.length === 0) return null
  if (name) {
    const chosen = onLang.find((voice) => voice.name === name)
    if (chosen) return chosen
  }
  const score = (voice) => {
    const label = (voice.name || '').toLowerCase()
    if (AUTHORITY.some((hint) => label.includes(hint))) return 0
    if (SOFT.some((hint) => label.includes(hint))) return 2
    return 1
  }
  return [...onLang].sort((a, b) => score(a) - score(b))[0]
}

export function speak(text, { lang = 'da', rate = 0.9, pitch = 0.88, voice = null, onStart, onEnd } = {}) {
  if (!speechAvailable()) return false
  try {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang === 'en' ? 'en-GB' : 'da-DK'
    utterance.rate = rate
    utterance.pitch = pitch
    if (voice) utterance.voice = voice
    if (onStart) utterance.onstart = onStart
    if (onEnd) {
      utterance.onend = onEnd
      utterance.onerror = onEnd
    }
    window.speechSynthesis.speak(utterance)
    return true
  } catch {
    return false
  }
}

/** Deler en tekst i afsnit, der kan læses op ét ad gangen. */
export function segmentText(text) {
  const raw = String(text || '').trim()
  if (!raw) return []

  // Del efter komma, semikolon og kolon — det er dér, en oplæser holder pause.
  const parts = []
  let current = ''
  for (const word of raw.split(/\s+/)) {
    current = current ? current + ' ' + word : word
    if (/[,;:]$/.test(word)) {
      parts.push(current)
      current = ''
    }
  }
  if (current) parts.push(current)

  // Saml stumper på under tre ord med naboen, og del stykker over ti ord.
  const merged = []
  for (const part of parts) {
    const words = part.split(' ')
    if (merged.length && (words.length < 3 || merged[merged.length - 1].split(' ').length < 3)) {
      merged[merged.length - 1] += ' ' + part
    } else if (words.length > 10) {
      const middle = Math.ceil(words.length / 2)
      merged.push(words.slice(0, middle).join(' '), words.slice(middle).join(' '))
    } else {
      merged.push(part)
    }
  }

  return merged.length ? merged : [raw]
}

export function stop() {
  if (!speechAvailable()) return
  try {
    window.speechSynthesis.cancel()
  } catch {
    /* ignoreres med vilje */
  }
}

/** Deler en tekst i sætninger — oplæseren læser og fremhæver én ad gangen. */
export function splitSentences(text) {
  const raw = String(text || '').replace(/\s+/g, ' ').trim()
  if (!raw) return []
  const parts = raw.match(/[^.!?…]+[.!?…]*\s*/g) || [raw]
  const out = []
  for (const part of parts) {
    const piece = part.trim()
    if (!piece) continue
    // Meget korte stumper ("Fx.") hænger sammen med den foregående sætning.
    if (out.length && piece.split(' ').length < 3) out[out.length - 1] += ' ' + piece
    else out.push(piece)
  }
  return out
}

/**
 * Læser én sætning og melder tilbage undervejs: onWord får tegnpositionen på
 * det ord, der læses lige nu, så teksten kan følge med. Returnerer en
 * stop-funktion.
 */
export function readSentence(text, { lang = 'da', rate = 1, pitch = 0.88, voice = null, onWord, onEnd, onError } = {}) {
  if (!speechAvailable()) {
    onError?.()
    return () => {}
  }
  try {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang === 'en' ? 'en-GB' : 'da-DK'
    utterance.rate = rate
    // Lav tonehøjde giver den rolige, myndige klang, en instruktør har.
    utterance.pitch = pitch
    if (voice) utterance.voice = voice
    utterance.onboundary = (event) => {
      if (event.name === 'word' || event.charIndex !== undefined) onWord?.(event.charIndex, event.charLength)
    }
    utterance.onend = () => onEnd?.()
    utterance.onerror = () => onError?.()
    window.speechSynthesis.speak(utterance)
    return () => window.speechSynthesis.cancel()
  } catch {
    onError?.()
    return () => {}
  }
}
