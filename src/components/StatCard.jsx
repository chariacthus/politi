import CountUp from './CountUp.jsx'
import Icon from './Icon.jsx'

export default function StatCard({ label, value, hint, icon, accent, count }) {
  return (
    <div className={'tile' + (accent ? ' accent' : '')}>
      <span className="tile-label">
        {icon ? <Icon name={icon} size={14} /> : null}
        {label}
      </span>
      <span className="tile-value">{count ? <CountUp value={value} /> : value}</span>
      {hint ? <span className="tile-hint">{hint}</span> : null}
    </div>
  )
}
