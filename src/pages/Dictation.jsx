import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Diff from '../components/Diff.jsx'
import Icon from '../components/Icon.jsx'
import Ring from '../components/Ring.jsx'
import { dictationLevels, dictations } from '../data/dictation.js'
import { countErrors, diffWords, normalize } from '../lib/grader.js'
import { loadVoices, pickVoice, segmentText, speak, speechAvailable, stop } from '../lib/speech.js'
import { play as playSound } from '../lib/sound.js'
import { buildSession } from '../lib/srs.js'
import { useProgress } from '../lib/state.jsx'

const SESSION_SIZE = 5

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
      <>
        <section className="card">
          <div className="row" style={{ gap: '1.5rem' }}>
            <div className="pop">
              <Ring value={clean} max={session.results.length || 1} size={108} thickness={9} label={clean + '/' + session.results.length} sub="fejlfri" />
            </div>
            <div style={{ flex: '1 1 240px' }}>
              <span className="eyebrow">Diktat afsluttet</span>
              <h1 style={{ fontSize: 'var(--t-3)' }}>{totalErrors === 0 ? 'Ikke én afvigelse' : totalErrors + ' afvigelser i alt'}</h1>
              <p style={{ marginBottom: 0 }}>
                {clean} af {session.results.length} tekster skrevet helt korrekt.
              </p>
            </div>
          </div>
          <div className="row mt">
            <button className="primary btn-lg" onClick={start}>
              <Icon name="refresh" size={18} /> Ny diktat
            </button>
            <button onClick={() => setSession(null)}>
              <Icon name="back" size={18} /> Skift niveau
            </button>
          </div>
        </section>

        <section className="card">
          <h2>Teksterne</h2>
          <ul className="list-reset stacklist">
            {session.results.map((entry) => (
              <li key={entry.item.id}>
                <div className="spread" style={{ marginBottom: '0.2rem' }}>
                  <span className="small muted">{entry.item.focus.join(' · ')}</span>
                  <span className={'chip ' + (entry.errors === 0 ? 'good' : entry.errors < 3 ? 'warn' : 'error')}>
                    {entry.errors === 0 ? 'fejlfri' : entry.errors + ' afvigelser'}
                  </span>
                </div>
                <div>{entry.item.text}</div>
              </li>
            ))}
          </ul>
        </section>
      </>
    )
  }

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Træning</span>
        <h1>Diktat</h1>
        <p>
          Teksten læses op, og du skriver den. Hver afvigelse markeres ord for ord — tegnsætning og store
          bogstaver tæller med, præcis som til prøven.
        </p>
      </div>

      <section className="card">
        <div className="spread">
          <div className="segmented">
            <button className={lang === 'da' ? 'on' : ''} onClick={() => setLang('da')}>
              Dansk
            </button>
            <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>
              Engelsk
            </button>
          </div>
          <span className="chip">
            <Icon name="layers" size={13} /> {pool.length} tekster
          </span>
        </div>

        <div className="grid grid-3 mt">
          <button className={'pick' + (level === 'alle' ? ' on' : '')} onClick={() => setLevel('alle')}>
            <div className="pick-head">
              <Icon name="spark" size={17} style={{ color: 'var(--accent)' }} />
              <b>Alle niveauer</b>
            </div>
            <span className="pick-desc">Blandet længde og sværhedsgrad.</span>
          </button>
          {dictationLevels
            .filter((entry) => dictations.some((d) => d.lang === lang && d.level === entry.level))
            .map((entry) => {
              const count = dictations.filter((d) => d.lang === lang && d.level === entry.level).length
              const [name, desc] = entry.title.split(' — ')
              return (
                <button
                  key={entry.level}
                  className={'pick' + (String(level) === String(entry.level) ? ' on' : '')}
                  onClick={() => setLevel(entry.level)}
                >
                  <div className="pick-head">
                    <b>{name}</b>
                    <span className="chip" style={{ marginLeft: 'auto' }}>{count}</span>
                  </div>
                  <span className="pick-desc">{desc}</span>
                </button>
              )
            })}
        </div>

        <div className="row mt">
          <button className="primary btn-lg" onClick={start} disabled={pool.length === 0}>
            <Icon name="play" size={18} /> Start diktat ({Math.min(SESSION_SIZE, pool.length)} tekster)
          </button>
        </div>
      </section>
    </>
  )
}

function Round({ session, onAnswer, onNext, onQuit }) {
  const item = session.items[session.index]
  const segments = useMemo(() => segmentText(item.text), [item])

  const [given, setGiven] = useState('')
  const [checked, setChecked] = useState(null)
  const [segIndex, setSegIndex] = useState(0)
  const [plays, setPlays] = useState(() => segments.map(() => 0))
  const [speaking, setSpeaking] = useState(false)
  const [rate, setRate] = useState(0.85)
  const [voice, setVoice] = useState(null)
  const [voiceChecked, setVoiceChecked] = useState(false)
  const [visible, setVisible] = useState(null)
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
    setSegIndex(0)
    setPlays(segments.map(() => 0))
    setVisible(null)
    setSpeaking(false)
    textareaRef.current?.focus()
  }, [item, segments])

  // Fallback: kan browseren ikke læse op, vises afsnittet i stedet.
  const canSpeak = speechAvailable() && Boolean(voice)

  const playSegment = useCallback(
    (index) => {
      if (index < 0 || index >= segments.length) return
      setSegIndex(index)
      setPlays((counts) => counts.map((count, i) => (i === index ? count + 1 : count)))
      playSound('tick')
      if (canSpeak) {
        setSpeaking(true)
        speak(segments[index], {
          lang: item.lang,
          rate,
          voice,
          onEnd: () => setSpeaking(false),
        })
      } else {
        setVisible(index)
        setTimeout(() => setVisible(null), 4500)
      }
    },
    [segments, canSpeak, item.lang, rate, voice],
  )

  function playAll() {
    playSound('tick')
    if (canSpeak) {
      setSpeaking(true)
      speak(item.text, { lang: item.lang, rate, voice, onEnd: () => setSpeaking(false) })
    } else {
      setVisible('all')
      setTimeout(() => setVisible(null), 6000)
    }
  }

  // Genveje, der ikke kolliderer med skrivning i feltet.
  useEffect(() => {
    function onKey(event) {
      if (!event.ctrlKey && !event.metaKey) return
      if (event.code === 'Space') {
        event.preventDefault()
        playSegment(segIndex)
      } else if (event.key === 'Enter' && segIndex < segments.length - 1) {
        event.preventDefault()
        playSegment(segIndex + 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [playSegment, segIndex, segments.length])

  function check() {
    if (checked) return
    stop()
    setSpeaking(false)
    const parts = diffWords(item.text, given)
    const errors = countErrors(parts)
    setChecked({ parts, errors })
    playSound(errors === 0 ? 'correct' : 'wrong')
    onAnswer(item, errors, given)
  }

  const exact = checked
    ? normalize(item.text, { punctuation: true, caseSensitive: true }) ===
      normalize(given, { punctuation: true, caseSensitive: true })
    : false

  const heard = plays.filter((count) => count > 0).length

  return (
    <section className="card">
      <div className="drill-head">
        <div className="drill-meta">
          <Ring value={session.index} max={session.items.length} size={46} thickness={5} tone="" label={session.index + 1} />
          <div>
            <div className="small muted">
              Tekst {session.index + 1} af {session.items.length}
            </div>
            <div className="small muted">{item.focus.join(' · ')}</div>
          </div>
        </div>
        <div className="row" style={{ gap: '0.4rem' }}>
          <span className="chip">Niveau {item.level}</span>
          <button className="btn-ghost icon-btn" onClick={onQuit} title="Afbryd diktaten" aria-label="Afbryd diktaten">
            <Icon name="x" size={18} />
          </button>
        </div>
      </div>

      <div className="player mt-sm">
        <button
          className={'play-btn' + (speaking ? ' speaking' : '')}
          onClick={() => playSegment(segIndex)}
          disabled={Boolean(checked)}
          aria-label={canSpeak ? 'Læs afsnittet op' : 'Vis afsnittet'}
        >
          <Icon name={canSpeak ? 'volume' : 'eye'} size={26} />
        </button>

        <div style={{ flex: '1 1 220px', minWidth: 0 }}>
          <div className="row" style={{ gap: '0.6rem' }}>
            <strong>
              Afsnit {segIndex + 1} af {segments.length}
            </strong>
            {plays[segIndex] > 0 ? (
              <span className="chip">hørt {plays[segIndex]} {plays[segIndex] === 1 ? 'gang' : 'gange'}</span>
            ) : (
              <span className="chip accent">nyt afsnit</span>
            )}
          </div>

          <div className={'visualizer' + (speaking ? ' on' : '')} aria-hidden="true">
            {Array.from({ length: 9 }).map((_, i) => (
              <i key={i} style={{ '--b': i }} />
            ))}
          </div>

          <div className="seg-dots" aria-label={'Afsnit: ' + segments.length}>
            {segments.map((segment, i) => (
              <button
                key={i}
                className={'seg-dot' + (i === segIndex ? ' on' : '') + (plays[i] > 0 ? ' heard' : '')}
                onClick={() => playSegment(i)}
                disabled={Boolean(checked)}
                title={'Afsnit ' + (i + 1) + (plays[i] > 0 ? ' — hørt ' + plays[i] + ' gange' : '')}
                aria-label={'Hør afsnit ' + (i + 1)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="row mt-sm">
        <button onClick={() => playSegment(segIndex)} disabled={Boolean(checked)}>
          <Icon name="refresh" size={16} /> Hør igen
        </button>
        <button onClick={() => playSegment(segIndex + 1)} disabled={Boolean(checked) || segIndex >= segments.length - 1}>
          <Icon name="arrow" size={16} /> Næste afsnit
        </button>
        <button onClick={playAll} disabled={Boolean(checked)}>
          <Icon name="volume" size={16} /> Hele teksten
        </button>
        {canSpeak ? (
          <label className="field-inline" style={{ marginBottom: 0 }}>
            Hastighed: {rate.toFixed(2)}
            <input type="range" min="0.5" max="1.2" step="0.05" value={rate} onChange={(event) => setRate(Number(event.target.value))} />
          </label>
        ) : null}
      </div>

      <p className="small muted mt-sm row" style={{ gap: '0.35rem' }}>
        <Icon name="keyboard" size={15} />
        <span className="kbd">Ctrl</span>+<span className="kbd">mellemrum</span> hører igen ·
        <span className="kbd">Ctrl</span>+<span className="kbd">Enter</span> tager næste afsnit ·
        du kan høre hvert afsnit så mange gange, du vil
      </p>

      {voiceChecked && !canSpeak ? (
        <div className="note mt-sm">
          <Icon name="bulb" size={16} />
          <span>
            Browseren har ingen {item.lang === 'en' ? 'engelsk' : 'dansk'} talestemme. Diktaten kører derfor som
            hukommelsesøvelse: afsnittet vises kort, og så skriver du det.
          </span>
        </div>
      ) : null}

      {visible !== null ? (
        <p className="prompt-box pop">{visible === 'all' ? item.text : segments[visible]}</p>
      ) : null}

      <div className="field mt">
        <label htmlFor="dictation-input">Skriv teksten, som du hørte den</label>
        <textarea
          id="dictation-input"
          ref={textareaRef}
          value={given}
          disabled={Boolean(checked)}
          spellCheck={false}
          placeholder="Husk tegnsætning og store bogstaver."
          onChange={(event) => setGiven(event.target.value)}
        />
      </div>

      {checked ? (
        <div className={'feedback ' + (checked.errors === 0 ? 'ok' : 'bad')}>
          <div className="verdict">
            <Icon name={checked.errors === 0 ? 'check' : 'x'} size={20} strokeWidth={2.4} />
            {checked.errors === 0 ? 'Ingen afvigelser' : checked.errors + ' afvigelser fra facit'}
          </div>
          <p>
            Facit: <strong>{item.text}</strong>
          </p>
          {!exact ? <Diff parts={checked.parts} legend /> : null}
          <p className="small muted" style={{ marginBottom: 0 }}>
            Du hørte {heard} af {segments.length} afsnit, i alt {plays.reduce((sum, count) => sum + count, 0)} gange.
          </p>
        </div>
      ) : null}

      <div className="row mt">
        {checked ? (
          <button className="primary btn-lg" onClick={onNext}>
            {session.index + 1 === session.items.length ? 'Afslut' : 'Næste tekst'}
            <Icon name="arrow" size={18} />
          </button>
        ) : (
          <button className="primary btn-lg" onClick={check} disabled={!given.trim()}>
            <Icon name="check" size={18} /> Ret min tekst
          </button>
        )}
      </div>
    </section>
  )
}
