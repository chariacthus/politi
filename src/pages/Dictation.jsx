import { useEffect, useMemo, useRef, useState } from 'react'
import Diff from '../components/Diff.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { dictationLevels, dictations } from '../data/dictation.js'
import { countErrors, diffWords, normalize } from '../lib/grader.js'
import { loadVoices, pickVoice, speak, speechAvailable, stop } from '../lib/speech.js'
import { buildSession } from '../lib/srs.js'
import { useProgress } from '../lib/state.jsx'

const SESSION_SIZE = 5
const MAX_REPEATS = 3

export default function Dictation() {
  const { state, recordAnswer, recordSession } = useProgress()
  const [lang, setLang] = useState('da')
  const [level, setLevel] = useState('alle')
  const [session, setSession] = useState(null)
  const startedAt = useRef(0)

  const pool = useMemo(
    () => dictations.filter((d) => d.lang === lang && (level === 'alle' || d.level === Number(level))),
    [lang, level],
  )

  function start() {
    const items = buildSession(pool, state.items, SESSION_SIZE)
    if (items.length === 0) return
    startedAt.current = Date.now()
    setSession({ items, index: 0, results: [] })
  }

  if (session && session.index < session.items.length) {
    return (
      <Round
        session={session}
        onAnswer={(item, errors, given) => {
          recordAnswer(item.id, errors === 0)
          setSession((prev) => ({ ...prev, results: [...prev.results, { item, errors, given }] }))
        }}
        onNext={() => {
          // Uden for state-opdateringen, så sessionen ikke registreres to gange.
          if (session.index + 1 >= session.items.length) {
            recordSession({
              module: 'diktat',
              lang,
              topic: 'diktat',
              asked: session.results.length,
              correct: session.results.filter((r) => r.errors === 0).length,
              seconds: Math.round((Date.now() - startedAt.current) / 1000),
            })
          }
          setSession((prev) => ({ ...prev, index: prev.index + 1 }))
        }}
        onQuit={() => {
          stop()
          setSession(null)
        }}
      />
    )
  }

  if (session) {
    const totalErrors = session.results.reduce((sum, entry) => sum + entry.errors, 0)
    const clean = session.results.filter((entry) => entry.errors === 0).length
    return (
      <section className="card">
        <h1>Diktat afsluttet</h1>
        <p>
          <strong className="mono">{clean}</strong> af {session.results.length} tekster uden fejl. I alt{' '}
          <strong className="mono">{totalErrors}</strong> afvigelser.
        </p>
        <ul className="list-reset">
          {session.results.map((entry) => (
            <li key={entry.item.id} style={{ padding: '0.6rem 0', borderTop: '1px solid var(--border)' }}>
              <div className="spread">
                <span className="small muted">{entry.item.focus.join(' · ')}</span>
                <span className="small mono">{entry.errors === 0 ? 'ingen fejl' : entry.errors + ' afvigelser'}</span>
              </div>
              <div>{entry.item.text}</div>
            </li>
          ))}
        </ul>
        <div className="row" style={{ marginTop: '1rem' }}>
          <button className="primary" onClick={start}>
            Ny diktat
          </button>
          <button onClick={() => setSession(null)}>Skift niveau</button>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="card">
        <h1>Diktat</h1>
        <p className="muted">
          Teksten læses op, og du skriver den. Hver afvigelse bliver markeret ord for ord, så du kan se præcis,
          hvad der gik galt — tegnsætning og store bogstaver tæller med.
        </p>
        <div className="row">
          <button className={lang === 'da' ? 'primary' : undefined} onClick={() => setLang('da')}>
            Dansk
          </button>
          <button className={lang === 'en' ? 'primary' : undefined} onClick={() => setLang('en')}>
            Engelsk
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Niveau</h2>
        <div className="grid grid-3" style={{ marginTop: '0.75rem' }}>
          <button className={'choice' + (level === 'alle' ? ' selected' : '')} onClick={() => setLevel('alle')}>
            <span>Alle niveauer</span>
          </button>
          {dictationLevels
            .filter((entry) => dictations.some((d) => d.lang === lang && d.level === entry.level))
            .map((entry) => (
              <button
                key={entry.level}
                className={'choice' + (String(level) === String(entry.level) ? ' selected' : '')}
                onClick={() => setLevel(entry.level)}
              >
                <span>{entry.title}</span>
              </button>
            ))}
        </div>
        <div className="row" style={{ marginTop: '1rem' }}>
          <button className="primary" onClick={start} disabled={pool.length === 0}>
            Start diktat ({Math.min(SESSION_SIZE, pool.length)} tekster)
          </button>
        </div>
      </section>
    </>
  )
}

function Round({ session, onAnswer, onNext, onQuit }) {
  const item = session.items[session.index]
  const [given, setGiven] = useState('')
  const [checked, setChecked] = useState(null)
  const [plays, setPlays] = useState(0)
  const [rate, setRate] = useState(0.9)
  const [voice, setVoice] = useState(null)
  const [voiceChecked, setVoiceChecked] = useState(false)
  const [visible, setVisible] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    let active = true
    loadVoices().then((voices) => {
      if (!active) return
      setVoice(pickVoice(voices, item.lang))
      setVoiceChecked(true)
    })
    return () => {
      active = false
      stop()
    }
  }, [item.lang])

  useEffect(() => {
    setGiven('')
    setChecked(null)
    setPlays(0)
    setVisible(false)
    textareaRef.current?.focus()
  }, [item])

  // Fallback: kan browseren ikke læse op, vises teksten i fem sekunder i stedet.
  const canSpeak = speechAvailable() && Boolean(voice)

  function play() {
    if (plays >= MAX_REPEATS) return
    setPlays((count) => count + 1)
    if (canSpeak) {
      speak(item.text, { lang: item.lang, rate, voice })
    } else {
      setVisible(true)
      setTimeout(() => setVisible(false), 5000)
    }
  }

  function check() {
    if (checked) return
    const parts = diffWords(item.text, given)
    const errors = countErrors(parts)
    // Et tomt svar skal ikke tælle som "kun manglende ord" — det er alle ord forkert.
    setChecked({ parts, errors })
    onAnswer(item, errors, given)
  }

  const exact = checked ? normalize(item.text, { punctuation: true, caseSensitive: true }) === normalize(given, { punctuation: true, caseSensitive: true }) : false

  return (
    <section className="card">
      <div className="spread">
        <span className="progress-line">
          Tekst {session.index + 1} af {session.items.length}
        </span>
        <span className="pill">Niveau {item.level}</span>
      </div>
      <ProgressBar value={session.index} max={session.items.length} tone="" />

      <p className="small muted" style={{ marginTop: '0.75rem' }}>
        Fælder i denne tekst: {item.focus.join(' · ')}
      </p>

      <div className="row">
        <button className="primary" onClick={play} disabled={plays >= MAX_REPEATS || Boolean(checked)}>
          {canSpeak ? 'Læs op' : 'Vis teksten i 5 sekunder'} ({MAX_REPEATS - plays} tilbage)
        </button>
        {canSpeak ? (
          <label className="inline-field" style={{ marginBottom: 0 }}>
            Hastighed: {rate.toFixed(1)}
            <input
              type="range"
              min="0.5"
              max="1.2"
              step="0.1"
              value={rate}
              onChange={(event) => setRate(Number(event.target.value))}
            />
          </label>
        ) : null}
      </div>

      {voiceChecked && !canSpeak ? (
        <p className="note small">
          Browseren har ingen {item.lang === 'en' ? 'engelsk' : 'dansk'} talestemme. Diktaten kører derfor som
          hukommelsesøvelse: teksten vises kort, og så skriver du den.
        </p>
      ) : null}

      {visible ? <p className="prompt-box">{item.text}</p> : null}

      <div className="field" style={{ marginTop: '1rem' }}>
        <label htmlFor="dictation-input">Skriv teksten, som du hørte den</label>
        <textarea
          id="dictation-input"
          ref={textareaRef}
          value={given}
          disabled={Boolean(checked)}
          spellCheck={false}
          autoCapitalize="sentences"
          onChange={(event) => setGiven(event.target.value)}
        />
      </div>

      {checked ? (
        <div className={'feedback ' + (checked.errors === 0 ? 'ok' : 'bad')}>
          <div className="verdict">
            {checked.errors === 0 ? 'Ingen afvigelser.' : checked.errors + ' afvigelser fra facit.'}
          </div>
          <p>
            Facit: <strong>{item.text}</strong>
          </p>
          {!exact ? (
            <>
              <div className="small muted">
                Grøn = manglede hos dig · gul = stavet eller tegnsat anderledes · rød = stod ikke i teksten
              </div>
              <Diff parts={checked.parts} />
            </>
          ) : null}
        </div>
      ) : null}

      <div className="row" style={{ marginTop: '1rem' }}>
        {checked ? (
          <button className="primary" onClick={onNext}>
            {session.index + 1 === session.items.length ? 'Afslut' : 'Næste tekst'}
          </button>
        ) : (
          <button className="primary" onClick={check} disabled={!given.trim()}>
            Ret min tekst
          </button>
        )}
        <button onClick={onQuit}>Afbryd</button>
      </div>
    </section>
  )
}
