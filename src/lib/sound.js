// Lydkvitteringer og haptik. Ingen lydfiler — alt genereres med Web Audio, så
// det virker offline og fylder ingenting. Tonerne er holdt i et lavt, roligt
// leje: det skal lyde som et instrument i en radio, ikke som et spil på en
// telefon. Kan slås fra, og valget huskes.

const KEY = 'politi.sound'
const HAPTIC_KEY = 'politi.haptik'
let context = null
let master = null

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

export function hapticsEnabled() {
  try {
    return window.localStorage.getItem(HAPTIC_KEY) !== 'off'
  } catch {
    return true
  }
}

export function setHapticsEnabled(on) {
  try {
    window.localStorage.setItem(HAPTIC_KEY, on ? 'on' : 'off')
  } catch {
    /* ignoreres med vilje */
  }
}

export function hapticsSupported() {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'
}

/** Kort vibration på telefonen. Mønsteret siger, hvad der skete. */
export function buzz(pattern) {
  if (!hapticsEnabled() || !hapticsSupported()) return
  try {
    navigator.vibrate(pattern)
  } catch {
    /* vibration er pynt — fejler den, sker der ikke andet */
  }
}

function ctx() {
  if (typeof window === 'undefined') return null
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return null
  if (!context) {
    context = new AudioCtx()
    master = context.createGain()
    master.gain.value = 0.9
    // Et let lavpasfilter tager kanten af de syntetiske toner.
    const filter = context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 5200
    master.connect(filter).connect(context.destination)
  }
  if (context.state === 'suspended') context.resume().catch(() => {})
  return context
}

/**
 * Én tone. `type` giver klangen: sine er blød, triangle har lidt mere kant,
 * og sawtooth bruges kun til det korte "fejl"-brum.
 */
function tone(frequency, start, duration, { gain = 0.05, type = 'sine', slideTo = null } = {}) {
  const audio = ctx()
  if (!audio) return
  const at = audio.currentTime + start
  const osc = audio.createOscillator()
  const env = audio.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(frequency, at)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, at + duration)
  env.gain.setValueAtTime(0.0001, at)
  env.gain.exponentialRampToValueAtTime(gain, at + 0.014)
  env.gain.exponentialRampToValueAtTime(0.0001, at + duration)
  osc.connect(env).connect(master)
  osc.start(at)
  osc.stop(at + duration + 0.03)
}

/** Et kort sus — bruges under fejring, hvor en ren tone bliver for tynd. */
function sweep(start, duration, gain = 0.03) {
  const audio = ctx()
  if (!audio) return
  const at = audio.currentTime + start
  const length = Math.floor(audio.sampleRate * duration)
  const buffer = audio.createBuffer(1, length, audio.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length)
  const source = audio.createBufferSource()
  source.buffer = buffer
  const filter = audio.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(700, at)
  filter.frequency.exponentialRampToValueAtTime(2600, at + duration)
  const env = audio.createGain()
  env.gain.setValueAtTime(gain, at)
  env.gain.exponentialRampToValueAtTime(0.0001, at + duration)
  source.connect(filter).connect(env).connect(master)
  source.start(at)
}

const SOUNDS = {
  // Rigtigt: en ren kvint opad. Kort og bekræftende.
  correct: () => {
    tone(523.25, 0, 0.14, { gain: 0.05 })
    tone(784, 0.07, 0.22, { gain: 0.045 })
  },
  // Forkert: én lav tone, der falder. Ingen brummer, ingen straf.
  wrong: () => {
    tone(196, 0, 0.26, { gain: 0.05, type: 'triangle', slideTo: 146.8 })
  },
  // Sprunget over: neutralt klik.
  skip: () => tone(392, 0, 0.09, { gain: 0.03, type: 'triangle' }),
  tick: () => tone(660, 0, 0.05, { gain: 0.022 }),
  // Valgt svar: et blødt anslag.
  pick: () => tone(587.33, 0, 0.07, { gain: 0.028 }),
  // Lektion klaret: en lille treklang med luft under.
  done: () => {
    sweep(0, 0.5, 0.025)
    tone(523.25, 0.02, 0.18)
    tone(659.25, 0.12, 0.18)
    tone(783.99, 0.22, 0.34, { gain: 0.055 })
  },
  // Eksamen bestået: samme figur, en oktav bredere og med et efterslag.
  exam: () => {
    sweep(0, 0.7, 0.03)
    tone(392, 0, 0.22, { gain: 0.05 })
    tone(523.25, 0.14, 0.22, { gain: 0.05 })
    tone(659.25, 0.28, 0.24, { gain: 0.05 })
    tone(1046.5, 0.44, 0.5, { gain: 0.05 })
  },
  // Ny sten åbnet.
  unlock: () => {
    tone(880, 0, 0.1, { gain: 0.035 })
    tone(1174.7, 0.08, 0.2, { gain: 0.03 })
  },
  // Liv tabt.
  heart: () => tone(330, 0, 0.16, { gain: 0.04, type: 'triangle', slideTo: 220 }),
}

const BUZZ = {
  correct: 18,
  wrong: [22, 60, 22],
  done: [14, 50, 14, 50, 30],
  exam: [20, 60, 20, 60, 20, 60, 60],
  unlock: [10, 40, 10],
  heart: [30, 40, 30],
  pick: 8,
  skip: 8,
}

export function play(kind) {
  if (BUZZ[kind] !== undefined) buzz(BUZZ[kind])
  if (!soundEnabled()) return
  try {
    SOUNDS[kind]?.()
  } catch {
    /* lyd er pynt — fejler den, sker der ikke andet */
  }
}
