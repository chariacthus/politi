import { useEffect, useRef, useState } from 'react'

/** Tæller op til værdien, når tallet kommer på skærmen. Står stille, hvis brugeren har slået bevægelse fra. */
export default function CountUp({ value, duration = 750, suffix = '' }) {
  const target = Number(value)
  const numeric = Number.isFinite(target)
  const [shown, setShown] = useState(numeric ? 0 : value)
  const frame = useRef(0)

  useEffect(() => {
    if (!numeric) {
      setShown(value)
      return undefined
    }
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced || target === 0) {
      setShown(target)
      return undefined
    }

    const start = performance.now()
    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration)
      // Blød opbremsning, så tallet lander frem for at stoppe brat.
      const eased = 1 - Math.pow(1 - progress, 3)
      setShown(Math.round(target * eased))
      if (progress < 1) frame.current = requestAnimationFrame(step)
    }
    frame.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame.current)
  }, [target, numeric, value, duration])

  return (
    <>
      {shown}
      {suffix}
    </>
  )
}
