import { useEffect, useMemo, useRef, useState } from 'react'
import { grade } from '../lib/grader.js'
import { editorMode, parsePrompt } from '../lib/items.js'
import { plural } from '../lib/media.js'
import { shuffle } from '../lib/srs.js'
import { play as playSound } from '../lib/sound.js'
import { loadVoices, pickVoice, speak, speechAvailable, stop } from '../lib/speech.js'
import { gradeSpeech, listen, recognitionSupported } from '../lib/voice.js'
import Icon from './Icon.jsx'
import SentenceEditor from './SentenceEditor.jsx'

/**
 * Én opgave, uanset type. Komponenten står for selve arbejdsfladen og melder
 * tilbage med et resultat; lektionen står for feedback og videre navigation.
 *
 * Typer: mc · fill · correct (fra grammatikbanken) og
 *        tf · order · spot · sort · match · speak (fra den politifaglige bank).
 */
export default function Exercise({ item, locked, result, onAnswer }) {
  const shared = { item, locked, result, onAnswer }
  switch (item.type) {
    case 'tf':
      return <TrueFalse {...shared} />
    case 'order':
      return <OrderWords {...shared} />
    case 'spot':
      return <SpotError {...shared} />
    case 'sort':
      return <SortBuckets {...shared} />
    case 'match':
      return <MatchPairs {...shared} />
    case 'speak':
      return <SpeakTask {...shared} />
    default:
      return <WrittenTask {...shared} />
  }
}

/** Overskriften over opgaven: den korte instruktion. */
// Opgaveteksten er skærmens overskrift — også for skærmlæsere.
function Instruction({ children }) {
  return <h1 className="task-instruction">{children}</h1>
}

/* ---------------- Valg, hul, komma og rettelse (grammatikbanken) ---------------- */
function WrittenTask({ item, locked, result, onAnswer }) {
  const mode = useMemo(() => editorMode(item), [item])
  const parsed = useMemo(() => parsePrompt(item), [item])
  const [given, setGiven] = useState(() => (mode === 'edit' ? parsed.sentence : ''))

  useEffect(() => {
    if (locked || mode !== 'choice') return undefined
    function onKey(event) {
      const number = Number(event.key)
      if (Number.isInteger(number) && number >= 1 && number <= item.options.length) {
        event.preventDefault()
        submit(item.options[number - 1])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function submit(value) {
    if (locked) return
    const answer = value ?? given
    if (mode !== 'choice' && !String(answer).trim()) return
    const graded = grade(item, answer)
    setGiven(answer)
    onAnswer({ correct: graded.correct, given: answer, expected: item.answer })
  }

  if (mode === 'choice') {
    return (
      <>
        <Instruction>{parsed.instruction || item.prompt}</Instruction>
        {parsed.sentence ? (
          <p className="sentence">
            {parsed.hasBlank ? (
              <>
                {parsed.sentence.split('____')[0]}
                <span className={'blank-slot' + (result ? ' filled' : '')}>{result ? given : '?'}</span>
                {parsed.sentence.split('____')[1]}
              </>
            ) : (
              parsed.sentence
            )}
          </p>
        ) : null}
        <Choices
          options={item.options}
          answer={item.answer}
          given={given}
          locked={locked}
          result={result}
          onPick={submit}
        />
      </>
    )
  }

  return (
    <>
      <Instruction>{parsed.instruction || item.prompt}</Instruction>
      <SentenceEditor item={item} mode={mode} value={given} onChange={setGiven} onSubmit={() => submit()} locked={locked} />
      {!locked ? (
        <button className="primary btn-lg mt" onClick={() => submit()} disabled={!String(given).trim()}>
          <Icon name="check" size={18} /> Svar
        </button>
      ) : null}
    </>
  )
}

function Choices({ options, answer, given, locked, result, onPick, keys = true }) {
  const pick = (option) => {
    playSound('pick')
    onPick(option)
  }
  return (
    <div className="choices">
      {options.map((option, index) => {
        let className = 'choice'
        let mark = null
        if (result) {
          if (option === answer) {
            className += ' correct'
            mark = 'check'
          } else if (option === given) {
            className += ' wrong'
            mark = 'x'
          }
        }
        return (
          <button
            key={option}
            className={className}
            style={{ '--i': index }}
            disabled={locked}
            onClick={() => pick(option)}
          >
            {keys ? <span className="key">{index + 1}</span> : null}
            <span className="choice-text">{option}</span>
            {mark ? <Icon name={mark} size={18} strokeWidth={2.4} className="mark" /> : null}
          </button>
        )
      })}
    </div>
  )
}

/* ---------------- Sandt / falsk ---------------- */
function TrueFalse({ item, locked, result, onAnswer }) {
  const [given, setGiven] = useState(null)

  function submit(value) {
    if (locked) return
    setGiven(value)
    onAnswer({ correct: value === item.answer, given: value ? 'Sandt' : 'Falsk', expected: item.answer ? 'Sandt' : 'Falsk' })
  }

  useEffect(() => {
    if (locked) return undefined
    function onKey(event) {
      if (event.key === '1') submit(true)
      if (event.key === '2') submit(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <>
      <Instruction>{item.prompt}</Instruction>
      <p className="sentence statement">{item.statement}</p>
      <div className="choices tf-choices">
        {[true, false].map((value, index) => {
          let className = 'choice tf-choice'
          let mark = null
          if (result) {
            if (value === item.answer) {
              className += ' correct'
              mark = 'check'
            } else if (value === given) {
              className += ' wrong'
              mark = 'x'
            }
          }
          return (
            <button key={String(value)} className={className} style={{ '--i': index }} disabled={locked} onClick={() => submit(value)}>
              <span className="key">{index + 1}</span>
              <span className="choice-text">{value ? 'Sandt' : 'Falsk'}</span>
              {mark ? <Icon name={mark} size={18} strokeWidth={2.4} className="mark" /> : null}
            </button>
          )
        })}
      </div>
    </>
  )
}

/* ---------------- Byg sætningen ---------------- */
function OrderWords({ item, locked, result, onAnswer }) {
  const pool = useMemo(() => shuffle([...item.words].map((word, index) => ({ word, key: word + index }))), [item])
  const [picked, setPicked] = useState([])

  const remaining = pool.filter((entry) => !picked.some((p) => p.key === entry.key))
  const built = picked.map((entry) => entry.word).join(' ')

  function submit() {
    if (locked) return
    onAnswer({ correct: built === item.answer, given: built, expected: item.answer })
  }

  return (
    <>
      <Instruction>{item.prompt}</Instruction>

      <div className={'build-line' + (picked.length ? '' : ' empty')}>
        {picked.length === 0 ? <span className="muted small">Tryk på ordene nedenfor i den rigtige rækkefølge</span> : null}
        {picked.map((entry, index) => (
          <button
            key={entry.key}
            className="token picked"
            disabled={locked}
            onClick={() => setPicked(picked.filter((_, i) => i !== index))}
          >
            {entry.word}
          </button>
        ))}
      </div>

      <div className="token-pool">
        {remaining.map((entry) => (
          <button key={entry.key} className="token" disabled={locked} onClick={() => setPicked([...picked, entry])}>
            {entry.word}
          </button>
        ))}
      </div>

      {!locked ? (
        <button className="primary btn-lg mt" onClick={submit} disabled={remaining.length > 0}>
          <Icon name="check" size={18} /> Svar
        </button>
      ) : null}
    </>
  )
}

/* ---------------- Find fejlen ---------------- */
function SpotError({ item, locked, result, onAnswer }) {
  const words = useMemo(() => item.sentence.split(' '), [item])
  const [picked, setPicked] = useState(null)

  function submit(word, index) {
    if (locked) return
    setPicked(index)
    const clean = word.replace(/[.,;:!?]$/, '')
    onAnswer({ correct: clean === item.wrong || word === item.wrong, given: clean, expected: item.wrong })
  }

  return (
    <>
      <Instruction>{item.prompt}</Instruction>
      <p className="sentence spot-sentence">
        {words.map((word, index) => {
          const clean = word.replace(/[.,;:!?]$/, '')
          let className = 'spot-word'
          if (result) {
            if (clean === item.wrong) className += ' correct'
            else if (index === picked) className += ' wrong'
          }
          return (
            <button key={index} className={className} disabled={locked} onClick={() => submit(word, index)}>
              {word}
            </button>
          )
        })}
      </p>
      <p className="small muted">Tryk på det ord, der er galt.</p>
    </>
  )
}

/* ---------------- Sortér i kasser ---------------- */
function SortBuckets({ item, locked, result, onAnswer }) {
  const tokens = useMemo(() => shuffle([...item.tokens]), [item])
  const [placed, setPlaced] = useState({})

  const unplaced = tokens.filter((token) => !placed[token.text])
  const done = unplaced.length === 0

  function submit() {
    if (locked) return
    const wrong = tokens.filter((token) => placed[token.text] !== token.bucket)
    onAnswer({
      correct: wrong.length === 0,
      given: wrong.length ? plural(wrong.length, 'udsagn er forkert placeret', 'udsagn er forkert placeret') : 'alle korrekt placeret',
      expected: 'alle i den rigtige kasse',
    })
  }

  return (
    <>
      <Instruction>{item.prompt}</Instruction>

      {/* Hvert udsagn kan sendes direkte i den kasse, du vælger — i vilkårlig rækkefølge. */}
      <ul className="list-reset sort-queue">
        {unplaced.map((token) => (
          <li key={token.text}>
            <span className="sort-text">{token.text}</span>
            <span className="sort-actions">
              {item.buckets.map((bucket) => (
                <button key={bucket} className="sort-send" disabled={locked} onClick={() => setPlaced((prev) => ({ ...prev, [token.text]: bucket }))}>
                  {bucket}
                </button>
              ))}
            </span>
          </li>
        ))}
        {done ? <li className="small muted">Alle er placeret — tjek dem igennem, og svar.</li> : null}
      </ul>

      <div className="buckets">
        {item.buckets.map((bucket) => (
          <div className="bucket" key={bucket}>
            <div className="bucket-head">
              <span className="eyebrow">{bucket}</span>
              <span className="chip">{tokens.filter((token) => placed[token.text] === bucket).length}</span>
            </div>
            <ul className="list-reset bucket-list">
              {tokens
                .filter((token) => placed[token.text] === bucket)
                .map((token) => {
                  const right = token.bucket === bucket
                  return (
                    <li key={token.text} className={result ? (right ? 'ok' : 'bad') : ''}>
                      {result ? (
                        <Icon name={right ? 'check' : 'x'} size={15} strokeWidth={2.4} />
                      ) : (
                        <button
                          className="bucket-remove"
                          onClick={() =>
                            setPlaced((prev) => {
                              const next = { ...prev }
                              delete next[token.text]
                              return next
                            })
                          }
                          aria-label={'Tag ' + token.text + ' op igen'}
                        >
                          <Icon name="x" size={13} />
                        </button>
                      )}
                      <span>{token.text}</span>
                    </li>
                  )
                })}
            </ul>
          </div>
        ))}
      </div>

      {!locked ? (
        <button className="primary btn-lg mt" onClick={submit} disabled={!done}>
          <Icon name="check" size={18} /> Svar
        </button>
      ) : null}
    </>
  )
}

/* ---------------- Par sammen ---------------- */
function MatchPairs({ item, locked, result, onAnswer }) {
  const left = useMemo(() => item.pairs.map((pair) => pair[0]), [item])
  const right = useMemo(() => shuffle(item.pairs.map((pair) => pair[1])), [item])

  const [selected, setSelected] = useState(null)
  const [matched, setMatched] = useState({})
  const [mistakes, setMistakes] = useState(0)
  const reported = useRef(false)

  const total = item.pairs.length
  const done = Object.keys(matched).length === total

  useEffect(() => {
    if (done && !reported.current) {
      reported.current = true
      onAnswer({
        correct: mistakes === 0,
        given: mistakes === 0 ? 'parret uden fejl' : plural(mistakes, 'forkert forsøg', 'forkerte forsøg'),
        expected: 'alle par korrekte',
      })
    }
  }, [done, mistakes, onAnswer])

  function pickRight(value) {
    if (locked || !selected || Object.values(matched).includes(value)) return
    const pair = item.pairs.find(([a]) => a === selected)
    if (pair && pair[1] === value) {
      setMatched((prev) => ({ ...prev, [selected]: value }))
    } else {
      setMistakes((count) => count + 1)
    }
    setSelected(null)
  }

  return (
    <>
      <Instruction>{item.prompt}</Instruction>
      <div className="match-grid">
        <div className="match-col">
          {left.map((value) => (
            <button
              key={value}
              className={'token match' + (matched[value] ? ' done' : '') + (selected === value ? ' on' : '')}
              disabled={locked || Boolean(matched[value])}
              onClick={() => setSelected(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="match-col">
          {right.map((value) => {
            const taken = Object.values(matched).includes(value)
            return (
              <button
                key={value}
                className={'token match' + (taken ? ' done' : '')}
                disabled={locked || taken}
                onClick={() => pickRight(value)}
              >
                {value}
              </button>
            )
          })}
        </div>
      </div>
      <p className="small muted">
        {Object.keys(matched).length} af {total} parret{mistakes > 0 ? ' · ' + plural(mistakes, 'forkert forsøg', 'forkerte forsøg') : ''}
      </p>
    </>
  )
}

/* ---------------- Stemmeøvelse ---------------- */
function SpeakTask({ item, locked, result, onAnswer }) {
  const [status, setStatus] = useState('idle')
  const [heard, setHeard] = useState('')
  const [error, setError] = useState(null)
  const [voice, setVoice] = useState(null)
  const stopRef = useRef(null)
  const supported = recognitionSupported()

  useEffect(() => {
    let active = true
    loadVoices().then((voices) => {
      if (active) setVoice(pickVoice(voices, 'da'))
    })
    return () => {
      active = false
      stopRef.current?.()
      stop()
    }
  }, [])

  function start() {
    if (locked) return
    setError(null)
    setHeard('')
    setStatus('listening')
    stopRef.current = listen({
      onResult: (text) => setHeard(text),
      onError: (message) => {
        setError(message)
        setStatus('idle')
      },
      onEnd: (text) => {
        setStatus('idle')
        const final = text || heard
        if (!final) return
        const graded = gradeSpeech(final, item)
        onAnswer({
          correct: graded.correct,
          given: graded.heard,
          expected: item.target,
          missing: graded.missing,
        })
      },
    })
  }

  return (
    <>
      <Instruction>{item.prompt}</Instruction>
      <p className="sentence">{item.target}</p>

      <div className="row mt-sm">
        {/* Oplæsning virker også uden en dansk stemme — så bruger browseren sin egen. */}
        <button onClick={() => speak(item.target, { lang: 'da', rate: 0.9, voice })} disabled={!speechAvailable() || !voice}>
          <Icon name="volume" size={16} /> Hør modellen
        </button>
        {supported ? (
          <button className={'primary' + (status === 'listening' ? ' listening' : '')} onClick={start} disabled={locked || status === 'listening'}>
            <Icon name="dictation" size={16} /> {status === 'listening' ? 'Lytter …' : 'Sig den højt'}
          </button>
        ) : null}
        {status === 'listening' ? (
          <button onClick={() => stopRef.current?.()}>
            <Icon name="check" size={16} /> Færdig
          </button>
        ) : null}
      </div>

      {heard ? (
        <p className="heard">
          <span className="eyebrow">Hørt</span> {heard}
        </p>
      ) : null}

      {error ? (
        <div className="note mt-sm">
          <Icon name="bulb" size={16} />
          <span>{error}</span>
        </div>
      ) : null}

      {!supported ? (
        <div className="note mt-sm">
          <Icon name="bulb" size={16} />
          <span>
            Browseren understøtter ikke talegenkendelse. Sig replikken højt for dig selv, og marker om den sad —
            det er selve det at sige den, der træner den.
          </span>
        </div>
      ) : null}

      {!locked ? (
        <div className="row mt-sm">
          {!supported ? (
            <button className="primary" onClick={() => onAnswer({ correct: true, given: 'sagt højt', expected: item.target })}>
              <Icon name="check" size={16} /> Jeg sagde den
            </button>
          ) : null}
          {/* Stemmeøvelser skal altid kunne springes over — mikrofonen er ikke
              altid en mulighed, og øvelsen må ikke spærre for lektionen. */}
          <button
            className="btn-ghost"
            onClick={() => {
              stopRef.current?.()
              onAnswer({ correct: true, skipped: true, given: 'sprunget over', expected: item.target })
            }}
          >
            Spring over
          </button>
        </div>
      ) : null}
    </>
  )
}
