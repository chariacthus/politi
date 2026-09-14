/**
 * Lær-kortet. Står foran opgaverne i en lektion, man ikke har klaret før:
 * hovedreglen, huskereglen og et par eksempler på, hvad der er rigtigt og
 * forkert. Så er øvelsen bagefter en prøve — ikke en gætteleg.
 */
import Icon from './Icon.jsx'

export default function Teach({ entries, onStart, onSkip, title }) {
  return (
    <div className="teach">
      <div className="teach-head">
        <span className="teach-badge">
          <Icon name="bulb" size={17} /> Lær først
        </span>
        <h1>{title}</h1>
        <p className="lead">
          Læs reglen igennem. Den tager under et minut — og den er svaret på de fleste af opgaverne,
          der kommer nu.
        </p>
      </div>

      {entries.map((entry) => (
        <section className="teach-card" key={entry.id}>
          <header>
            <span className="eyebrow">{entry.kind}</span>
            <h2>{entry.title}</h2>
          </header>

          <div className="teach-rule">
            <Icon name="shield" size={18} />
            <p>{entry.rule}</p>
          </div>

          {entry.trick ? (
            <div className="teach-trick">
              <Icon name="bulb" size={16} />
              <p>
                <b>Huskeregel:</b> {entry.trick}
              </p>
            </div>
          ) : null}

          {entry.examples.length > 0 ? (
            <ul className="teach-examples list-reset">
              {entry.examples.map((example, index) => (
                <li key={index}>
                  {example.wrong ? (
                    <span className="ex wrong">
                      <Icon name="x" size={15} strokeWidth={2.6} /> {example.wrong}
                    </span>
                  ) : null}
                  <span className="ex right">
                    <Icon name="check" size={15} strokeWidth={2.6} /> {example.right}
                  </span>
                  {example.note ? <span className="ex teach-note">{example.note}</span> : null}
                </li>
              ))}
            </ul>
          ) : null}

          {entry.points.length > 0 ? (
            <ul className="teach-points list-reset">
              {entry.points.map((point) => (
                <li key={point}>
                  <Icon name="check" size={15} strokeWidth={2.2} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      <div className="teach-foot">
        <button className="btn-3d teach-go" onClick={onStart}>
          Jeg er klar <Icon name="arrow" size={19} />
        </button>
        <button className="skip-btn" onClick={onSkip}>
          <Icon name="skip" size={15} /> Spring forklaringen over
        </button>
      </div>
    </div>
  )
}
