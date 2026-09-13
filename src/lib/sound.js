// Små toner som kvittering. Ingen lydfiler — tonerne genereres med Web Audio,
// så de virker offline og fylder ingenting. Kan slås fra, og valget huskes.

const KEY = 'politi.sound'
let context = null

export function soundEnabled() {
  try {
    return window.localStorage.getItem(KEY) !== 'off'
  } catch {
    return true
  }
}

export function setSoundEnabled(on) {
  try {
    window.localStorage.setItem(KEY, on ? 'on' : 'off')
  } catch {
    /* uden localStorage gælder valget kun denne side */
  }
}

function ctx() {
  if (typeof window === 'undefined') return null
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return null
  if (!context) context = new AudioCtx()
  if (context.state === 'suspended') context.resume().catch(() => {})
  return context
}

function tone(frequency, start, duration, gain = 0.06) {
  const audio = ctx()
  if (!audio) return
  const oscillator = audio.createOscillator()
  const envelope = audio.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  envelope.gain.setValueAtTime(0, audio.currentTime + start)
  envelope.gain.linearRampToValueAtTime(gain, audio.currentTime + start + 0.012)
  envelope.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + start + duration)
  oscillator.connect(envelope).connect(audio.destination)
  oscillator.start(audio.currentTime + start)
  oscillator.stop(audio.currentTime + start + duration + 0.02)
}

export function play(kind) {
  if (!soundEnabled()) return
  try {
    if (kind === 'correct') {
      tone(660, 0, 0.13)
      tone(880, 0.1, 0.18)
    } else if (kind === 'wrong') {
      tone(220, 0, 0.2, 0.05)
    } else if (kind === 'tick') {
      tone(520, 0, 0.06, 0.03)
    } else if (kind === 'done') {
      tone(587, 0, 0.12)
      tone(784, 0.1, 0.12)
      tone(988, 0.2, 0.22)
    }
  } catch {
    /* lyd er pynt — fejler den, sker der ikke andet */
  }
}
