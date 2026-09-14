import { useEffect, useState } from 'react'
import Icon from '../components/Icon.jsx'
import SectionHead from '../components/SectionHead.jsx'
import { policeTopics } from '../data/police.js'
import { rules } from '../data/rules.js'
import { navigate } from '../lib/router.jsx'
import { scrollTop } from '../lib/media.js'

// Politifaglige emner vises i samme form som sprogreglerne.
const policeRules = policeTopics.map((topic) => ({
  id: topic.id,
  lang: 'police',
  title: topic.title,
  short: topic.short,
  rule: topic.rule,
  trick: topic.trick,
  source: topic.source,
  sections: topic.points?.length
    ? [{ heading: 'Det skal sidde fast', text: 'Punkterne herunder er dem, der går igen i prøver, i tjenesten og i klagesager.', bullets: topic.points }]
    : [],
  mistakes: [],
}))

const BANKS = {
  police: { label: 'Politifag', list: policeRules },
  da: { label: 'Dansk', list: rules.filter((rule) => rule.lang === 'da') },
  en: { label: 'Engelsk', list: rules.filter((rule) => rule.lang === 'en') },
}

export default function Rules({ params }) {
  const [lang, setLang] = useState(params.bank === 'police' ? 'police' : params.lang === 'en' ? 'en' : params.lang === 'da' ? 'da' : 'police')
  const [openId, setOpenId] = useState(params.topic || null)

  // Dybe links fra lektioner, feedback og fremskridt åbner den rigtige regel med det samme.
  useEffect(() => {
    if (!params.topic) return
    setOpenId(params.topic)
    if (params.bank === 'police') setLang('police')
    else if (params.lang === 'en') setLang('en')
    else if (params.lang === 'da') setLang('da')
  }, [params.topic, params.lang, params.bank])

  const list = BANKS[lang].list
  const open = list.find((rule) => rule.id === openId) || null

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Lær</span>
        <h1>Regelbogen</h1>
        <p>
          Reglerne bag politiarbejdet og bag sproget: hovedregel, huskeregel, eksempler og de fejl, folk oftest
          laver. Læs reglen først — så er øvelsen en test og ikke en gætteleg.
        </p>
      </div>

      <section className="card">
        <SectionHead
          title="Emner"
          tail={
            <span className="chip">
              <Icon name="book" size={13} /> {list.length} regler
            </span>
          }
        />
        <div className="spread">
          <div className="segmented">
            {Object.entries(BANKS).map(([key, bank]) => (
              <button
                key={key}
                className={lang === key ? 'on' : ''}
                onClick={() => {
                  setLang(key)
                  setOpenId(null)
                }}
              >
                {bank.label}
              </button>
            ))}
          </div>
          <span className="small muted">Vælg et emne for at folde reglen ud.</span>
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
          <span className="eyebrow">{rule.lang === 'police' ? 'Politifag' : rule.lang === 'en' ? 'Engelsk' : 'Dansk'}</span>
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
            <p style={{ marginBottom: 0, color: 'var(--ink)' }}>{rule.rule}</p>
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
          {section.bullets ? (
            <ul className="list-reset">
              {section.bullets.map((bullet) => (
                <li key={bullet} className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <Icon name="check" size={16} strokeWidth={2.2} style={{ marginTop: '0.25rem', color: 'var(--forest)', flex: 'none' }} />
                  <span style={{ color: 'var(--ink-2)' }}>{bullet}</span>
                </li>
              ))}
            </ul>
          ) : null}
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

      {rule.source ? (
        <div className="rule-section">
          <SectionHead as="h3" title="Grundlag" />
          <p className="small muted" style={{ marginBottom: 0 }}>
            {rule.source}. Lovgivning ændres — kontrollér den gældende ordlyd på retsinformation.dk.
          </p>
        </div>
      ) : null}

      {rule.mistakes.length > 0 ? (
      <div className="rule-section">
        <SectionHead as="h3" title="Typiske fejl" />
        <ul className="list-reset">
          {rule.mistakes.map((mistake) => (
            <li key={mistake} className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <Icon name="target" size={16} style={{ marginTop: '0.25rem', color: 'var(--brass)', flex: 'none' }} />
              <span className="small" style={{ color: 'var(--ink-2)' }}>{mistake}</span>
            </li>
          ))}
        </ul>
        </div>
      ) : null}

      {rule.lang !== 'police' ? (
        <div className="row mt">
          <button className="primary btn-lg" onClick={() => navigate(`/grammar?lang=${rule.lang}&topic=${rule.id}&start=1`)}>
            <Icon name="play" size={18} /> Træn dette emne nu
          </button>
        </div>
      ) : (
        <div className="row mt">
          <button className="primary btn-lg" onClick={() => navigate('/')}>
            <Icon name="play" size={18} /> Træn det i forløbet
          </button>
        </div>
      )}
    </section>
  )
}
