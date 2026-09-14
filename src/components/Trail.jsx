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
        return {
          x: rect.left - base.left + rect.width / 2,
          y: rect.top - base.top + rect.height / 2,
          r: Math.max(rect.width, rect.height) / 2,
        }
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
      {/* Patruljen kører ruten: en lysprik, der løber vejen igennem. */}
      <circle className="trail-pulse" r="4">
        <animateMotion dur={Math.max(6, count * 2.2) + 's'} repeatCount="indefinite" path={path} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
      </circle>
    </svg>
  )
}

/**
 * Vejen mellem stenene. Hvert stykke starter og slutter på stenens kant —
 * ikke i dens midte — og svinger ud til siden undervejs, så det ligner en
 * vej, der kører ind til hver eneste knap i stedet for en streg, der skærer
 * tværs igennem dem.
 */
function curve(points) {
  if (points.length < 2) return ''
  const parts = []
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]
    const b = points[i + 1]
    const dx = b.x - a.x
    const dy = b.y - a.y
    const length = Math.hypot(dx, dy) || 1
    // Træk enderne ind til kanten af stenen, så linjen rører den præcis.
    const pad = 4
    const from = { x: a.x + (dx / length) * (a.r + pad), y: a.y + (dy / length) * (a.r + pad) }
    const to = { x: b.x - (dx / length) * (b.r + pad), y: b.y - (dy / length) * (b.r + pad) }

    // Svinget: kontrolpunkterne skubbes vinkelret på retningen, skiftevis til
    // hver side, så vejen bugter sig i stedet for at være en lige streg.
    const side = i % 2 === 0 ? 1 : -1
    const bend = Math.min(46, Math.max(16, Math.abs(dx) * 0.55 + 14)) * side
    const nx = -(to.y - from.y) / length
    const ny = (to.x - from.x) / length
    const c1 = { x: from.x + (to.x - from.x) * 0.3 + nx * bend, y: from.y + (to.y - from.y) * 0.3 + ny * bend }
    const c2 = { x: from.x + (to.x - from.x) * 0.7 + nx * bend, y: from.y + (to.y - from.y) * 0.7 + ny * bend }

    parts.push(
      `M ${round(from.x)} ${round(from.y)} C ${round(c1.x)} ${round(c1.y)}, ${round(c2.x)} ${round(c2.y)}, ${round(to.x)} ${round(to.y)}`,
    )
  }
  return parts.join(' ')
}

function round(value) {
  return Math.round(value * 10) / 10
}
