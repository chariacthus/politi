export default function Diff({ parts }) {
  return (
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
  )
}
