export default function Diff({ parts, legend }) {
  return (
    <>
      <p className="diff">
        {parts.map((part, index) => {
          const title =
            part.type === 'missing'
              ? 'Manglede i dit svar'
              : part.type === 'extra'
                ? 'Stod ikke i facit'
                : part.type === 'changed'
                  ? 'Facit: ' + part.expected
                  : undefined
          return (
            <span key={index} className={part.type} title={title}>
              {part.text}{' '}
            </span>
          )
        })}
      </p>
      {legend ? (
        <div className="diff-legend">
          <span className="chip good">manglede hos dig</span>
          <span className="chip warn">stavet eller tegnsat anderledes</span>
          <span className="chip error">stod der ikke</span>
        </div>
      ) : null}
    </>
  )
}
