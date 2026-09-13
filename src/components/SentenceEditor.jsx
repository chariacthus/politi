import { useEffect, useMemo, useRef, useState } from 'react'
import { joinWithCommas, parsePrompt, splitForCommas } from '../lib/items.js'
import Icon from './Icon.jsx'

/**
 * Arbejdsfladen for en opgave. Man retter direkte i sætningen frem for at
 * skrive den af: ordet skrives i hullet, kommaer sættes ved at klikke mellem
 * ordene, og rettelser laves i den forudfyldte sætning.
 */
export default function SentenceEditor({ item, mode, value, onChange, onSubmit, locked }) {
  const parsed = useMemo(() => parsePrompt(item), [item])

  if (mode === 'blank') {
    return <BlankSentence sentence={parsed.sentence} value={value} onChange={onChange} onSubmit={onSubmit} locked={locked} />
  }
  if (mode === 'comma') {
    return <CommaSentence sentence={parsed.sentence} value={value} onChange={onChange} locked={locked} />
  }
  if (mode === 'edit') {
    return <EditSentence sentence={parsed.sentence} value={value} onChange={onChange} onSubmit={onSubmit} locked={locked} />
  }
  return (
    <div className="field">
      <label htmlFor="answer">Skriv dit svar</label>
      <input
        id="answer"
        type="text"
        value={value}
        autoComplete="off"
        spellCheck={false}
        disabled={locked}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !locked) {
            event.preventDefault()
            onSubmit()
          }
        }}
      />
    </div>
  )
}

function BlankSentence({ sentence, value, onChange, onSubmit, locked }) {
  const inputRef = useRef(null)
  const [before, after] = sentence.split('____')

  useEffect(() => {
    if (!locked) inputRef.current?.focus()
  }, [sentence, locked])

  return (
    <>
      <p className="sentence">
        {before}
        <input
          ref={inputRef}
          className="inline-input"
          type="text"
          value={value}
          size={Math.max(6, value.length + 1)}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          disabled={locked}
          aria-label="Skriv det manglende ord"
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !locked) {
              event.preventDefault()
              onSubmit()
            }
          }}
        />
        {after}
      </p>
      <p className="small muted">Skriv ordet direkte i hullet.</p>
    </>
  )
}

function CommaSentence({ sentence, value, onChange, locked }) {
  const { words, preset } = useMemo(() => splitForCommas(sentence), [sentence])
  const [gaps, setGaps] = useState(() => new Set(preset))

  // Sætningen bygges op af ordene plus de kommaer, brugeren har sat.
  useEffect(() => {
    setGaps(new Set(preset))
  }, [sentence, preset])

  useEffect(() => {
    onChange(joinWithCommas(words, gaps))
    // onChange er stabil nok i brugen her; vi vil kun reagere på ændrede kommaer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gaps, words])

  function toggle(index) {
    if (locked) return
    setGaps((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <>
      <p className="sentence comma-sentence">
        {words.map((word, index) => (
          <span key={index} className="word-group">
            <span className="word">{word}</span>
            {index < words.length - 1 ? (
              <button
                type="button"
                className={'gap' + (gaps.has(index) ? ' on' : '')}
                onClick={() => toggle(index)}
                disabled={locked}
                aria-label={gaps.has(index) ? `Fjern komma efter ${word}` : `Sæt komma efter ${word}`}
                title={gaps.has(index) ? 'Fjern komma' : 'Sæt komma'}
              >
                {/* Kommaet står kun i teksten, når det er sat — ellers ville
                    både skærmlæsere og kopieret tekst få kommaer overalt. */}
                <span aria-hidden="true">{gaps.has(index) ? ',' : ''}</span>
              </button>
            ) : null}
            {index < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </p>
      <div className="row small muted" style={{ gap: '0.5rem' }}>
        <Icon name="bulb" size={15} />
        <span>Klik mellem to ord for at sætte et komma. Klik igen for at fjerne det.</span>
        {gaps.size > 0 && !locked ? (
          <button className="btn-ghost small" onClick={() => setGaps(new Set())} style={{ padding: '0.2rem 0.6rem' }}>
            Ryd kommaer
          </button>
        ) : null}
      </div>
      <p className="small muted mono result-preview">{value || sentence}</p>
    </>
  )
}

function EditSentence({ sentence, value, onChange, onSubmit, locked }) {
  const inputRef = useRef(null)
  const touched = useRef(false)

  // Sætningen ligger klar i feltet — man retter i den frem for at skrive den af.
  useEffect(() => {
    onChange(sentence)
    touched.current = false
    if (!locked) {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(sentence.length, sentence.length)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentence])

  return (
    <div className="field">
      <label htmlFor="answer">Ret direkte i sætningen</label>
      <input
        id="answer"
        ref={inputRef}
        className="sentence-input"
        type="text"
        value={value}
        autoComplete="off"
        spellCheck={false}
        disabled={locked}
        onChange={(event) => {
          touched.current = true
          onChange(event.target.value)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !locked) {
            event.preventDefault()
            onSubmit()
          }
        }}
      />
      <div className="row small muted mt-sm" style={{ gap: '0.5rem' }}>
        <Icon name="bulb" size={15} />
        <span>Teksten står klar — ret kun det, der er galt.</span>
        {!locked ? (
          <button className="btn-ghost small" onClick={() => onChange(sentence)} style={{ padding: '0.2rem 0.6rem' }}>
            Fortryd mine rettelser
          </button>
        ) : null}
      </div>
    </div>
  )
}
