import { diffWords } from '../lib/grader.js'
import { Link } from '../lib/router.jsx'
import Diff from './Diff.jsx'
import Icon from './Icon.jsx'

export default function Feedback({ item, result, given }) {
  const showDiff = !result.correct && item.type !== 'mc' && String(given || '').trim().length > 0

  return (
    <div className={'feedback ' + (result.correct ? 'ok' : 'bad') + (result.correct ? '' : ' nudge')}>
      <div className="verdict">
        <Icon name={result.correct ? 'check' : 'x'} size={20} strokeWidth={2.4} />
        {result.correct ? 'Korrekt' : 'Forkert'}
      </div>

      {!result.correct ? (
        <p>
          Facit: <strong>{item.answer}</strong>
        </p>
      ) : null}

      {showDiff ? (
        <>
          <span className="eyebrow">Dit svar mod facit</span>
          <Diff parts={diffWords(item.answer, given)} legend />
        </>
      ) : null}

      <div className="rule-card">
        <div className="rule-line">
          <Icon name="bulb" size={18} />
          <div>
            <span className="eyebrow">Regel</span>
            <p>{item.rule}</p>
          </div>
        </div>
        <div className="rule-line">
          <Icon name="quote" size={18} />
          <div>
            <span className="eyebrow">Eksempel</span>
            <p>{item.example}</p>
          </div>
        </div>
        <Link className="small rule-more" to={`/rules?lang=${item.lang}&topic=${item.topic}`}>
          Læs hele reglen med flere eksempler →
        </Link>
      </div>
    </div>
  )
}
