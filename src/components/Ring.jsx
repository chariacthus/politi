/**
 * Progressring. Bruges til sessioner, emnebeherskelse og scenariescore.
 * Værdien animeres via stroke-dashoffset, som CSS'en har en overgang på.
 */
import { useEffect, useState } from 'react'

export default function Ring({ value, max = 100, size = 64, thickness = 6, label, sub, tone }) {
  const target = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0
  // Starter på nul og tegnes ind — CSS'en har en overgang på stroke-dashoffset.
  const [share, setShare] = useState(0)

  useEffect(() => {
    const id = requestAnimationFrame(() => setShare(target))
    return () => cancelAnimationFrame(id)
  }, [target])
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const level = tone ?? (target >= 0.85 ? 'ok' : target >= 0.6 ? 'warn' : target > 0 ? 'bad' : '')

  return (
    <div className={'ring ' + level} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle className="track" cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={thickness} />
        <circle
          className="value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - share)}
        />
      </svg>
      {label !== undefined ? (
        <span className="ring-label" style={{ fontSize: Math.max(11, size * 0.24) }}>
          {label}
          {sub ? <small>{sub}</small> : null}
        </span>
      ) : null}
    </div>
  )
}
