// Stemmeøvelser. Genkendelsen kører i browseren (Web Speech API) og er
// frivillig — den slås til i indstillingerne og bruges kun, hvis browseren
// understøtter den. Intet lyd sendes videre af siden selv.

const KEY = 'politi.voice'

export function voicePreference() {
  try {
    return window.localStorage.getItem(KEY) === 'on'
  } catch {
    return false
  }
}

export function setVoicePreference(on) {
  try {
    window.localStorage.setItem(KEY, on ? 'on' : 'off')
  } catch {
    /* uden localStorage gælder valget kun denne side */
  }
}

export function recognitionSupported() {
  if (typeof window === 'undefined') return false
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
}

/**
 * Starter en optagelse og kalder tilbage med den genkendte tekst.
 * Returnerer en stop-funktion, så øvelsen kan afbrydes.
 */
export function listen({ lang = 'da-DK', onResult, onError, onEnd }) {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!Recognition) {
    onError?.('Browseren understøtter ikke talegenkendelse.')
    return () => {}
  }

  let recognition
  try {
    recognition = new Recognition()
  } catch {
    onError?.('Talegenkendelsen kunne ikke startes.')
    return () => {}
  }

  recognition.lang = lang
  recognition.interimResults = true
  recognition.continuous = false
  recognition.maxAlternatives = 3

  let best = ''
  recognition.onresult = (event) => {
    let text = ''
    for (let i = 0; i < event.results.length; i++) text += event.results[i][0].transcript + ' '
    best = text.trim()
    onResult?.(best, event.results[event.results.length - 1].isFinal)
  }
  recognition.onerror = (event) => {
    const reason =
      event.error === 'not-allowed'
        ? 'Adgang til mikrofonen blev afvist.'
        : event.error === 'no-speech'
          ? 'Der blev ikke registreret nogen tale.'
          : 'Talegenkendelsen stoppede (' + event.error + ').'
    onError?.(reason)
  }
  recognition.onend = () => onEnd?.(best)

  try {
    recognition.start()
  } catch {
    onError?.('Talegenkendelsen kører allerede.')
  }

  return () => {
    try {
      recognition.stop()
    } catch {
      /* allerede stoppet */
    }
  }
}

/** Vurderer en oplæst replik mod opgavens krav. */
export function gradeSpeech(transcript, item) {
  const said = String(transcript || '')
  const missing = (item.must || []).filter((requirement) => !requirement.pattern.test(said))
  return {
    correct: missing.length === 0 && said.trim().length > 0,
    missing: missing.map((requirement) => requirement.text),
    heard: said.trim(),
  }
}
