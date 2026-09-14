import { useMemo } from 'react'

/** Fejring. Ren pynt — stykkerne får tilfældig position, farve og forsinkelse. */
export default function Confetti({ pieces = 28 }) {
  const bits = useMemo(
    () =>
      Array.from({ length: pieces }).map((_, index) => ({
        left: Math.round(Math.random() * 100),
        delay: Math.round(Math.random() * 500),
        duration: 1400 + Math.round(Math.random() * 1200),
        tone: ['var(--brand)', 'var(--accent)', 'var(--forest)', 'var(--brick)', 'var(--brand-2)'][index % 5],
        tilt: Math.round(Math.random() * 360),
        wide: Math.random() > 0.5,
      })),
    [pieces],
  )

  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((bit, index) => (
        <i
          key={index}
          style={{
            left: bit.left + '%',
            background: bit.tone,
            animationDelay: bit.delay + 'ms',
            animationDuration: bit.duration + 'ms',
            transform: `rotate(${bit.tilt}deg)`,
            width: bit.wide ? 9 : 5,
            height: bit.wide ? 5 : 11,
          }}
        />
      ))}
    </div>
  )
}
