import { useEffect, useState } from 'react'
import Icon from '../components/Icon.jsx'
import { rules } from '../data/rules.js'
import { navigate } from '../lib/router.jsx'
import { scrollTop } from '../lib/media.js'

export default function Rules({ params }) {
  const [lang, setLang] = useState(params.lang === 'en' ? 'en' : 'da')
  const [openId, setOpenId] = useState(params.topic || null)

  // Dybe links fra feedback og fremskridt åbner den rigtige regel med det samme.
  useEffect(() => {
    if (params.topic) {
      setOpenId(params.topic)
      if (params.lang === 'en') setLang('en')
    }
  }, [params.topic, params.lang])

  const list = rules.filter((rule) => rule.lang === lang)
  const open = list.find((rule) => rule.id === openId) || null

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Lær</span>
        <h1>Regelbogen</h1>
        <p>
          Reglen bag hvert emne, med huskeregel, eksempler på forkert og rigtigt, og de fejl folk oftest laver.
          Læs reglen først — så er drillen en test og ikke en gætteleg.
        </p>
      </div>

      <section className="card">
        <div className="spread">
          <div className="segmented">
            <button
              className={lang === 'da' ? 'on' : ''}
              onClick={() => {
                setLang('da')
                setOpenId(null)
              }}
            >
              Dansk
            </button>
            <button
              className={lang === 'en' ? 'on' : ''}
              onClick={() => {
                setLang('en')
                setOpenId(null)
              }}
            >
              Engelsk
            </button>
          </div>
          <span className="chip">
            <Icon name="book" size={13} /> {list.length} regler
          </span>
        </div>

        <div className="rule-index mt">
          {list.map((rule) => (
            <button
              key={rule.id}
              className={'chip rule-chip' + (openId === rule.id ? ' accent' : '')}
              onClick={() => {
                setOpenId(rule.id === openId ? null : rule.id)
                scrollTop()
              }}
            >
              {rule.title}
            </button>
          ))}
        </div>
      </section>

      {open ? <RuleDetail rule={open} onClose={() => setOpenId(null)} /> : null}

      {list
        .filter((rule) => !open || rule.id !== open.id)
        .map((rule) => (
          <section className="card rule-teaser" key={rule.id}>
            <div className="spread">
              <div>
                <h2 style={{ fontSize: 'var(--t-1)', marginBottom: '0.15rem' }}>{rule.title}</h2>
                <p className="small muted" style={{ margin: 0 }}>
                  {rule.short}
                </p>
              </div>
              <button
                onClick={() => {
                  setOpenId(rule.id)
                  scrollTop()
                }}
              >
                Læs reglen <Icon name="arrow" size={16} />
              </button>
            </div>
          </section>
        ))}
    </>
  )
}

function RuleDetail({ rule, onClose }) {
  return (
    <section className="card rule-detail">
      <div className="spread">
        <div>
          <span className="eyebrow">{rule.lang === 'en' ? 'Engelsk' : 'Dansk'}</span>
          <h2 style={{ fontSize: 'var(--t-3)' }}>{rule.title}</h2>
        </div>
        <button className="btn-ghost icon-btn" onClick={onClose} aria-label="Luk reglen">
          <Icon name="x" size={18} />
        </button>
      </div>

      <div className="rule-hero">
        <div className="rule-line">
          <Icon name="shield" size={19} />
          <div>
            <span className="eyebrow">Hovedregel</span>
            <p style={{ marginBottom: 0, color: 'var(--text)' }}>{rule.rule}</p>
          </div>
        </div>
        <div className="rule-line">
          <Icon name="bulb" size={19} />
          <div>
            <span className="eyebrow">Huskeregel</span>
            <p style={{ marginBottom: 0 }}>{rule.trick}</p>
          </div>
        </div>
      </div>

      {rule.sections.map((section) => (
        <div className="rule-section" key={section.heading}>
          <h3>{section.heading}</h3>
          <p>{section.text}</p>
          {(section.examples || []).map((example, index) => (
            <div className="example" key={index}>
              {example.wrong ? (
                <div className="example-line wrong">
                  <Icon name="x" size={16} strokeWidth={2.4} />
                  <span>{example.wrong}</span>
                </div>
              ) : null}
              <div className="example-line right">
                <Icon name="check" size={16} strokeWidth={2.4} />
                <span>{example.right}</span>
              </div>
              {example.note ? <div className="example-note">{example.note}</div> : null}
            </div>
          ))}
        </div>
      ))}

      <div className="rule-section">
        <h3>Typiske fejl</h3>
        <ul className="list-reset">
          {rule.mistakes.map((mistake) => (
            <li key={mistake} className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <Icon name="target" size={16} style={{ marginTop: '0.25rem', color: 'var(--warn)', flex: 'none' }} />
              <span className="small" style={{ color: 'var(--text-soft)' }}>{mistake}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="row mt">
        <button className="primary btn-lg" onClick={() => navigate(`/grammar?lang=${rule.lang}&topic=${rule.id}&start=1`)}>
          <Icon name="play" size={18} /> Træn dette emne nu
        </button>
      </div>
    </section>
  )
}
