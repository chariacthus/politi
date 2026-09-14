/**
 * Oplæseren. Den læser lektionens tekst højt, fremhæver den sætning og det
 * ord, der læses lige nu, og lader dig gå frem og tilbage og skrue på farten.
 * For en, der stadig er ved at lære sproget, er det forskellen på at læse og
 * at forstå.
 *
 * Mangler browseren en stemme, viser oplæseren det og går ikke i stå — man
 * kan stadig bruge den til at følge teksten sætning for sætning.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { loadVoices, pickVoice, readSentence, speechAvailable, splitSentences, stop as stopSpeech } from '../lib/speech.js'

const RATES = [0.75, 1, 1.25]

export default function Reader({ text, lang = 'da', label }) {
  const sentences = useMemo(() => splitSentences(text), [text])
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [word, setWord] = useState(null)
  const [rate, setRate] = useState(1)
  const [voice, setVoice] = useState(null)
  const [mute, setMute] = useState(false)
  const stopRef = useRef(null)
  const playingRef = useRef(false)

  useEffect(() => {
    let alive = true
    loadVoices().then((voices) => {
      if (!alive) return
      const found = pickVoice(voices, lang)
      setVoice(found)
      // Mangler browseren en stemme på sproget, ville oplæsningen enten fejle
      // eller lyde forkert. Så kører den stille: sætningerne fremhæves i
      // læsetempo, så man stadig kan følge med.
      setMute(!found || !speechAvailable())
    })
    return () => {
      alive = false
      stopSpeech()
    }
  }, [lang])

  useEffect(() => () => stopRef.current?.(), [])

  function halt() {
    playingRef.current = false
    setPlaying(false)
    setWord(null)
    stopRef.current?.()
    stopSpeech()
  }

  function play(from = index) {
    if (sentences.length === 0) return
    playingRef.current = true
    setPlaying(true)
    setIndex(from)
    speakAt(from)
  }

  function speakAt(at) {
    setWord(null)
    if (mute || !speechAvailable()) {
      // Uden stemme går vi videre i et roligt tempo, så teksten stadig følges.
      const delay = Math.max(1400, sentences[at].length * 55) / rate
      const timer = setTimeout(() => {
        if (!playingRef.current) return
        advance(at)
      }, delay)
      stopRef.current = () => clearTimeout(timer)
      return
    }
    stopRef.current = readSentence(sentences[at], {
      lang,
      rate,
      voice,
      onWord: (charIndex, charLength) => setWord({ start: charIndex, end: charIndex + (charLength || 0) }),
      onEnd: () => advance(at),
      onError: () => advance(at),
    })
  }

  function advance(at) {
    if (!playingRef.current) return
    if (at + 1 >= sentences.length) {
      playingRef.current = false
      setPlaying(false)
      setWord(null)
      setIndex(0)
      return
    }
    setIndex(at + 1)
    speakAt(at + 1)
  }

  function jump(to) {
    const next = Math.min(sentences.length - 1, Math.max(0, to))
    stopRef.current?.()
    setIndex(next)
    setWord(null)
    if (playingRef.current) speakAt(next)
  }

  function cycleRate() {
    const next = RATES[(RATES.indexOf(rate) + 1) % RATES.length]
    setRate(next)
    if (playingRef.current) {
      stopRef.current?.()
      setTimeout(() => speakAt(index), 60)
    }
  }

  if (sentences.length === 0) return null
  const share = ((index + (playing ? 0.5 : 0)) / sentences.length) * 100

  return (
    <div className={'reader' + (playing ? ' on' : '')}>
      <p className="reader-text">
        {sentences.map((sentence, i) => (
          <span key={i} className={'sent' + (i === index ? ' here' : '') + (i < index ? ' read' : '')} onClick={() => jump(i)}>
            {i === index && word ? highlight(sentence, word) : sentence}{' '}
          </span>
        ))}
      </p>

      <div className="reader-bar">
        <button
          className="reader-play"
          onClick={() => (playing ? halt() : play(index))}
          aria-label={playing ? 'Stop oplæsning' : 'Læs højt'}
        >
          <Icon name={playing ? 'pause' : 'volume'} size={18} />
        </button>

        <button className="reader-btn" onClick={() => jump(index - 1)} aria-label="Forrige sætning" disabled={index === 0}>
          <Icon name="back" size={15} />
        </button>
        <button
          className="reader-btn"
          onClick={() => jump(index + 1)}
          aria-label="Næste sætning"
          disabled={index >= sentences.length - 1}
        >
          <Icon name="arrow" size={15} />
        </button>
        <button className="reader-btn" onClick={() => play(0)} aria-label="Læs forfra">
          <Icon name="refresh" size={15} />
        </button>

        <span className="reader-track" aria-hidden="true">
          <i style={{ width: share + '%' }} />
        </span>

        <span className="reader-count mono">
          {index + 1}/{sentences.length}
        </span>
        <button className="reader-rate" onClick={cycleRate} aria-label={'Læsehastighed ' + rate + ' gange'}>
          {rate}×
        </button>
        <span className="reader-lang mono">{lang === 'en' ? 'EN' : 'DA'}</span>
      </div>

      {label ? <span className="sr-only">{label}</span> : null}
    </div>
  )
}

/** Sætter et mærke om det ord, stemmen er nået til. */
function highlight(sentence, word) {
  const start = Math.max(0, Math.min(sentence.length, word.start))
  let end = word.end > start ? word.end : sentence.slice(start).search(/\s|$/) + start
  if (end <= start) end = sentence.length
  return (
    <>
      {sentence.slice(0, start)}
      <mark>{sentence.slice(start, end)}</mark>
      {sentence.slice(end)}
    </>
  )
}
