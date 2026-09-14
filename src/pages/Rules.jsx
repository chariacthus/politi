import { useEffect, useState } from 'react'
import Icon from '../components/Icon.jsx'
import Reader from '../components/Reader.jsx'
import SectionHead from '../components/SectionHead.jsx'
import { glossary, glossaryGroups } from '../data/glossary.js'
import { policeTopics } from '../data/police.js'
import { rules } from '../data/rules.js'
import { scrollTop } from '../lib/media.js'
import { navigate } from '../lib/router.jsx'

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
  ord: { label: 'Fagordbog', list: [] },
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
        <span className="eyebrow">Regler</span>
        <h1>Regelbogen</h1>
        <p>
          Reglerne bag politiarbejdet og bag sproget: hovedregel, huskeregel, eksempler og de fejl, folk oftest
          laver. Læs reglen først — så er øvelsen en test og ikke en gætteleg.
        </p>
      </div>

      {lang === 'ord' ? <Glossary /> : null}

      {lang === 'ord' ? null : (
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
      </section>

      )}

      {lang === 'ord' ? null : open ? <RuleDetail rule={open} onClose={() => setOpenId(null)} /> : null}

      <div className="grid grid-half">
        {(lang === 'ord' ? [] : list)
          .filter((rule) => !open || rule.id !== open.id)
          .map((rule) => (
            <button
              className="rule-card-btn"
              key={rule.id}
              onClick={() => {
                setOpenId(rule.id)
                scrollTop()
              }}
            >
              <span className="rule-card-title">
                {rule.title}
                <Icon name="arrow" size={16} />
              </span>
              <span className="small muted">{rule.short}</span>
            </button>
          ))}
      </div>
    </>
  )
}

/**
 * Fagordbogen. Hvert ord står med en forklaring i almindeligt dansk, det
 * engelske udtryk, og en sætning på hvert sprog — så ordet kan bruges, ikke
 * bare genkendes.
 */
function Glossary() {
  const [query, setQuery] = useState('')
  const term = query.trim().toLowerCase()
  const matches = term
    ? glossary.filter(
        (entry) =>
          entry.da.toLowerCase().includes(term) ||
          entry.en.toLowerCase().includes(term) ||
          entry.forklaring.toLowerCase().includes(term),
      )
    : glossary

  return (
    <>
      <div className="gloss-search">
        <Icon name="eye" size={16} />
        <input
          type="text"
          value={query}
          placeholder="Søg efter et ord — dansk eller engelsk"
          aria-label="Søg i fagordbogen"
          onChange={(event) => setQuery(event.target.value)}
        />
        <span className="mono">{matches.length}</span>
      </div>

      {glossaryGroups.map((group) => {
        const list = matches.filter((entry) => entry.group === group.id)
        if (list.length === 0) return null
        return (
          <section className="gloss-group" key={group.id}>
            <h2>{group.title}</h2>
            <div className="gloss-list">
              {list.map((entry) => (
                <article className="gloss" key={entry.da}>
                  <header>
                    <b>{entry.da}</b>
                    <span className="gloss-en">{entry.en}</span>
                  </header>
                  <p>{entry.forklaring}</p>
                  <div className="gloss-use">
                    <span>
                      <i>DA</i> {entry.eksempel}
                    </span>
                    <span>
                      <i>EN</i> {entry.engelsk}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )
      })}

      {matches.length === 0 ? <p className="muted">Ingen ord matcher søgningen.</p> : null}
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

      <Reader text={rule.rule} lang={rule.lang === 'en' ? 'en' : 'da'} label={'Hovedreglen for ' + rule.title} />

      <div className="rule-line mt">
        <Icon name="bulb" size={18} />
        <p style={{ marginBottom: 0 }}>{rule.trick}</p>
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
              <Icon name="target" size={16} style={{ marginTop: '0.25rem', color: 'var(--accent)', flex: 'none' }} />
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
            <Icon name="play" size={18} /> Træn det på stien
          </button>
        </div>
      )}
    </section>
  )
}
