import Icon from './Icon.jsx'

export default function StatCard({ label, value, hint, icon, accent }) {
  return (
    <div className={'tile' + (accent ? ' accent' : '')}>
      <span className="tile-label">
        {icon ? <Icon name={icon} size={14} /> : null}
        {label}
      </span>
      <span className="tile-value">{value}</span>
      {hint ? <span className="tile-hint">{hint}</span> : null}
    </div>
  )
}
