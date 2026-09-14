/**
 * Sporet mellem stenene. En SVG-kurve, der er tegnet efter stenenes faktiske
 * placering, så den buer med, når stien slår ud til siderne. Den del, du har
 * gået, er fuldt optrukket; resten er stiplet.
 *
 * Kurven måles i browseren og tegnes bag stenene — derfor ligger den i sit
 * eget lag med pointer-events slået fra.
 */
import { useEffect, useRef, useState } from 'react'

export default function Trail({ containerRef, count, doneCount, dep }) {
  const [path, setPath] = useState(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [tick, setTick] = useState(0)
  const frame = useRef(0)

  // Måles efter tegning: forælderens ref er først sat, når vi er børn af den.
  useEffect(() => {
    const node = containerRef.current
    if (!node) {
      const retry = requestAnimationFrame(() => setTick((value) => value + 1))
      return () => cancelAnimationFrame(retry)
    }

    function measure() {
      const stones = [...node.querySelectorAll('.stone-btn')]
      if (stones.length < 2) {
        setPath(null)
        return
      }
      const base = node.getBoundingClientRect()
      const points = stones.map((stone) => {
        const rect = stone.getBoundingClientRect()
        return { x: rect.left - base.left + rect.width / 2, y: rect.top - base.top + rect.height / 2 }
      })
      setBox({ w: base.width, h: base.height })
      setPath(curve(points))
    }

    measure()
    // Stenene glider ind — mål igen, når de står stille.
    const settle = setTimeout(measure, 900)
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(measure)
    })
    observer.observe(node)
    return () => {
      clearTimeout(settle)
      observer.disconnect()
      cancelAnimationFrame(frame.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, count, dep, tick])

  // Andelen af sporet, der er gået — bruges til at farve den fulde streg.
  const [share, setShare] = useState(0)
  useEffect(() => {
    const target = count > 1 ? Math.min(1, doneCount / (count - 1)) : 0
    const id = requestAnimationFrame(() => setShare(target))
    return () => cancelAnimationFrame(id)
  }, [doneCount, count])

  if (!path || !box.w) return null

  return (
    <svg className="trail" width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden="true" focusable="false">
      <path className="trail-line" d={path} pathLength="1" />
      <path className="trail-done" d={path} pathLength="1" style={{ strokeDasharray: `${share} 1` }} />
    </svg>
  )
}

/** Blød kurve gennem punkterne (Catmull-Rom oversat til bézier). */
function curve(points) {
  if (points.length < 2) return ''
  let d = `M ${round(points[0].x)} ${round(points[0].y)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2
    const t = 0.32
    const c1 = { x: p1.x + ((p2.x - p0.x) / 6) * t * 3, y: p1.y + ((p2.y - p0.y) / 6) * t * 3 }
    const c2 = { x: p2.x - ((p3.x - p1.x) / 6) * t * 3, y: p2.y - ((p3.y - p1.y) / 6) * t * 3 }
    d += ` C ${round(c1.x)} ${round(c1.y)}, ${round(c2.x)} ${round(c2.y)}, ${round(p2.x)} ${round(p2.y)}`
  }
  return d
}

function round(value) {
  return Math.round(value * 10) / 10
}
