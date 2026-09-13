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

export function pickVoice(voices, lang) {
  const tag = lang === 'en' ? 'en' : 'da'
  return (
    voices.find((voice) => voice.lang?.toLowerCase().startsWith(tag + '-')) ||
    voices.find((voice) => voice.lang?.toLowerCase() === tag) ||
    null
  )
}

export function speak(text, { lang = 'da', rate = 0.9, voice = null } = {}) {
  if (!speechAvailable()) return false
  try {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang === 'en' ? 'en-GB' : 'da-DK'
    utterance.rate = rate
    if (voice) utterance.voice = voice
    window.speechSynthesis.speak(utterance)
    return true
  } catch {
    return false
  }
}

export function stop() {
  if (!speechAvailable()) return
  try {
    window.speechSynthesis.cancel()
  } catch {
    /* ignoreres med vilje */
  }
}
