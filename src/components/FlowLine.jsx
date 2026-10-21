import { FLOW } from '../data/scenario'

// "The flow is the interface": order-to-cash drawn as one line.
// A stage in trouble bends the line and turns it amber; recovery straightens it.

const W = 1000
const Y = 64
const X = FLOW.stages.map((_, i) => 80 + i * ((W - 160) / (FLOW.stages.length - 1)))

const COLORS = { healthy: '#5db33a', degraded: '#d98a1c', recovering: '#5db33a' }

function straight(x1, x2) {
  return `M${x1} ${Y} C ${x1 + 60} ${Y}, ${x2 - 60} ${Y}, ${x2} ${Y}`
}
function kinked(x1, x2) {
  const mid = (x1 + x2) / 2
  return `M${x1} ${Y} C ${x1 + 50} ${Y}, ${mid - 40} ${Y + 52}, ${mid} ${Y + 52} S ${x2 - 50} ${Y}, ${x2} ${Y}`
}

export default function FlowLine({ stages, impact, compact = false, selected, onSelect }) {
  const state = (id) => stages?.[id] ?? 'healthy'
  const H = compact ? 130 : 150

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Order-to-cash flow health">
      {onSelect && FLOW.stages.map((s, i) => (
        <rect key={s.id} x={X[i] - 70} y={Y - 32} width="140" height="112" rx="12"
          fill={selected === s.id ? '#ecebf5' : 'transparent'} onClick={() => onSelect(s.id)}
          className="cursor-pointer transition-colors hover:fill-[#f1f0f7]" />
      ))}

      {FLOW.stages.slice(1).map((s, i) => {
        const x1 = X[i]
        const x2 = X[i + 1]
        const into = state(s.id)
        const prevBad = state(FLOW.stages[i].id) === 'degraded'
        const bent = into === 'degraded'
        const starved = prevBad && !bent
        return (
          <g key={s.id}>
            <path d={straight(x1, x2)} fill="none" stroke={starved ? '#c9c7d8' : COLORS.healthy}
              strokeWidth="6" strokeLinecap="round" strokeDasharray={starved ? '2 12' : undefined}
              style={{ opacity: bent ? 0 : 1, transition: 'opacity 500ms ease' }} />
            <path d={kinked(x1, x2)} fill="none" stroke={COLORS.degraded} strokeWidth="6" strokeLinecap="round"
              style={{ opacity: bent ? 1 : 0, transition: 'opacity 500ms ease' }} />
            {!bent && !starved && (
              <path d={straight(x1, x2)} fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="2"
                strokeDasharray="3 22" strokeLinecap="round">
                <animate attributeName="stroke-dashoffset" from="25" to="0" dur="1.4s" repeatCount="indefinite" />
              </path>
            )}
          </g>
        )
      })}

      {FLOW.stages.map((s, i) => {
        const st = state(s.id)
        const c = COLORS[st]
        return (
          <g key={s.id} transform={`translate(${X[i]} ${Y})`}
            onClick={onSelect ? () => onSelect(s.id) : undefined}
            style={{ cursor: onSelect ? 'pointer' : undefined }}>

            {st !== 'healthy' && (
              <circle r="14" fill={c} opacity="0.25">
                <animate attributeName="r" values="14;24;14" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            <circle r="13" fill="#fdfdfb" stroke={c} strokeWidth="5" style={{ transition: 'stroke 500ms' }} />
            <text y="46" textAnchor="middle" fontSize="17" fontWeight="600" fill="#1c1a3f" fontFamily="IBM Plex Sans, sans-serif">
              {s.label}
            </text>
            {!compact && (
              <text y="70" textAnchor="middle" fontSize="14" fontFamily="IBM Plex Sans, sans-serif"
                fill={st === 'degraded' ? '#8a5208' : '#6e6c88'} fontWeight={st === 'degraded' ? 600 : 400}>
                {st === 'degraded' ? impact ?? 'Degraded' : st === 'recovering' ? 'Recovered, verifying' : 'Normal'}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
