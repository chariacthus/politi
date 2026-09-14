/**
 * Lær-kortet. Står foran opgaverne i en lektion, man ikke har klaret før:
 * hovedreglen, huskereglen og et par eksempler på, hvad der er rigtigt og
 * forkert. Så er øvelsen bagefter en prøve — ikke en gætteleg.
 */
import Icon from './Icon.jsx'
import Mascot from './Mascot.jsx'
import Reader from './Reader.jsx'

export default function Teach({ entries, onStart, onSkip, title }) {
  return (
    <div className="teach">
      <div className="teach-head">
        <Mascot mood="neutral" size={46} />
        <h1>{title}</h1>
      </div>

      {entries.map((entry) => (
        <section className="teach-card" key={entry.id}>
          <Reader text={entry.rule} lang={entry.lang} label={'Reglen for ' + entry.title} />

          {entry.trick ? (
            <p className="teach-trick">
              <Icon name="bulb" size={15} /> {entry.trick}
            </p>
          ) : null}

          {entry.examples.length > 0 ? (
            <ul className="teach-examples list-reset">
              {entry.examples.slice(0, 2).map((example, index) => (
                <li key={index}>
                  {example.wrong ? (
                    <span className="ex wrong">
                      <Icon name="x" size={15} strokeWidth={2.6} /> {example.wrong}
                    </span>
                  ) : null}
                  <span className="ex right">
                    <Icon name="check" size={15} strokeWidth={2.6} /> {example.right}
                  </span>

                </li>
              ))}
            </ul>
          ) : null}

          {entry.points.length > 0 ? (
            <ul className="teach-points list-reset">
              {entry.points.slice(0, 3).map((point) => (
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
          Spring over
        </button>
      </div>
    </div>
  )
}
