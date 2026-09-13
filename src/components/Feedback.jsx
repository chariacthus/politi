import { diffWords } from '../lib/grader.js'
import Diff from './Diff.jsx'

export default function Feedback({ item, result, given }) {
  const showDiff = !result.correct && item.type !== 'mc' && String(given || '').trim().length > 0

  return (
    <div className={'feedback ' + (result.correct ? 'ok' : 'bad')}>
      <div className="verdict">{result.correct ? 'Korrekt.' : 'Forkert.'}</div>

      {!result.correct ? (
        <p>
          Facit: <strong>{item.answer}</strong>
        </p>
      ) : null}

      {showDiff ? (
        <>
          <div className="small muted">Dit svar holdt op mod facit:</div>
          <Diff parts={diffWords(item.answer, given)} />
        </>
      ) : null}

      <dl>
        <dt>Regel</dt>
        <dd>{item.rule}</dd>
        <dt>Eksempel</dt>
        <dd>{item.example}</dd>
      </dl>
    </div>
  )
}
