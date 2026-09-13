/**
 * Fast rytme på alle sider: titel, en hårfin linje ud til kanten og
 * eventuelt et nøgletal yderst til højre.
 */
export default function SectionHead({ title, tail, as: Tag = 'h2', id }) {
  return (
    <div className="section-head">
      <Tag id={id}>{title}</Tag>
      <span className="rule" />
      {tail ? <span className="tail">{tail}</span> : null}
    </div>
  )
}
