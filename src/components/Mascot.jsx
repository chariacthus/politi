/**
 * Makkeren. En simpel figur i politikasket, der reagerer på, hvordan det går.
 * Tegnet som SVG, så den skalerer og følger temaets farver.
 */
export default function Mascot({ mood = 'neutral', size = 96 }) {
  const happy = mood === 'happy'
  const sad = mood === 'sad'

  return (
    <svg
      className={'mascot mascot-' + mood}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      {/* Krop */}
      <path d="M28 112c0-20 14-32 32-32s32 12 32 32z" fill="var(--brand)" />
      <path d="M52 84h16v8a8 8 0 0 1-16 0z" fill="var(--brand-2)" />

      {/* Hoved */}
      <circle cx="60" cy="56" r="30" fill="var(--surface)" stroke="var(--ink)" strokeWidth="3" />

      {/* Kasket */}
      <path d="M30 44a30 30 0 0 1 60 0z" fill="var(--brand)" />
      <rect x="26" y="42" width="68" height="8" rx="4" fill="var(--ink)" />
      <path d="M52 28h16v10H52z" fill="var(--accent)" />
      <circle cx="60" cy="33" r="3" fill="var(--brand)" />

      {/* Øjne */}
      {sad ? (
        <>
          <path d="M44 58c2-3 6-3 8 0" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
          <path d="M68 58c2-3 6-3 8 0" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="48" cy="58" r="4.5" fill="var(--ink)" />
          <circle cx="72" cy="58" r="4.5" fill="var(--ink)" />
          {happy ? (
            <>
              <circle cx="49.5" cy="56.5" r="1.6" fill="var(--surface)" />
              <circle cx="73.5" cy="56.5" r="1.6" fill="var(--surface)" />
            </>
          ) : null}
        </>
      )}

      {/* Mund */}
      {happy ? (
        <path d="M50 70c4 6 16 6 20 0" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" fill="none" />
      ) : sad ? (
        <path d="M50 74c4-6 16-6 20 0" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M52 71h16" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      )}

      {/* Kinder når det går godt */}
      {happy ? (
        <>
          <circle cx="40" cy="67" r="4" fill="var(--brick)" opacity="0.35" />
          <circle cx="80" cy="67" r="4" fill="var(--brick)" opacity="0.35" />
        </>
      ) : null}
    </svg>
  )
}
