import Icon from './Icon'
import { AGENTS } from '../data/scenario'

// Each agent keeps the same glyph and tint in every view,
// so a reviewer can follow who did what without reading labels.
export default function AgentGlyph({ id, size = 32 }) {
  const a = AGENTS[id]
  return (
    <span
      title={a.name}
      className="inline-flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, background: `${a.tint}1a`, color: a.tint, boxShadow: `inset 0 0 0 1px ${a.tint}40` }}
    >
      <Icon name={a.icon} size={size * 0.5} strokeWidth={2} />
    </span>
  )
}
