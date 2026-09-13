export default function ProgressBar({ value, max = 100, tone, thin }) {
  const share = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0
  const level = tone ?? (share >= 0.85 ? 'ok' : share >= 0.6 ? 'warn' : 'bad')
  return (
    <div className={'bar ' + level + (thin ? ' bar-thin' : '')} role="presentation">
      <div style={{ width: (share * 100).toFixed(1) + '%' }} />
    </div>
  )
}
