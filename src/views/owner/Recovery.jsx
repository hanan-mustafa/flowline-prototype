import { Link } from 'react-router-dom'
import { ArrowRight, Check, Loader2 } from 'lucide-react'
import { RECOVERY } from '../../data/owner'
import { useStory } from '../../state/story'
import AgentGlyph from '../../components/AgentGlyph'
import SampleTag from '../../components/SampleTag'
import Empty from '../../components/Empty'

// How far the chart has got at each story step (index into RECOVERY.series)
const CUTOFF = { 5: 8, 6: 13, 7: RECOVERY.series.length - 1 }

export default function Recovery() {
  const { index, go } = useStory()

  if (index < 5) {
    return (
      <Empty
        title="Recovery starts once the fix is approved"
        text="When the revert is approved, this page shows the remediation agent's progress and each check it runs before the incident is closed."
        action={() => go(4)}
        actionLabel="Go to the decision point"
      />
    )
  }

  const running = index === 5
  const doneChecks = running ? 1 : RECOVERY.checks.length

  return (
    <div className="space-y-6">
      {!running && (
        <div className="grid grid-cols-4 gap-4">
          {RECOVERY.summary.map((s) => (
            <div key={s.label} className="rise-in rounded-2xl border border-rule bg-card p-5">
              <div className="font-serif text-3xl font-semibold text-ink">{s.value}</div>
              <div className="mt-1 text-sm font-medium text-ink">{s.label}</div>
              <div className="text-xs text-muted">{s.note}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-[1.5fr_1fr] gap-6">
        <section className="rounded-2xl border border-rule bg-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold text-ink">Invoices accepted by the tax portal</div>
              <div className="text-xs text-muted">Every 15 minutes, Saturday night</div>
            </div>
            <SampleTag />
          </div>
          <AcceptanceChart upTo={CUTOFF[index]} />
          <p className="mt-2 text-xs text-muted">
            The tall bars after the fix are the backlog being resent; the flow then settles back to its normal rate.
          </p>
        </section>

        <section className="rounded-2xl border border-rule bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-ink">Checks before closing</div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${running ? 'bg-amber-tint text-amber-ink' : 'bg-green-tint text-green-ink'}`}>
              {running ? 'Fix running' : 'All passed'}
            </span>
          </div>
          <ul className="mt-4 space-y-3">
            {RECOVERY.checks.map((c, i) => {
              const done = i < doneChecks
              const active = running && i === doneChecks
              return (
                <li key={c.text} className={`flex items-start gap-3 ${done || active ? '' : 'opacity-45'}`}>
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${done ? 'bg-green text-white' : 'border border-rule text-muted'}`}>
                    {done ? <Check size={13} strokeWidth={3} /> : active ? <Loader2 size={13} className="animate-spin" /> : null}
                  </span>
                  <span className="flex-1 text-sm leading-relaxed text-ink">{c.text}</span>
                  <AgentGlyph id={c.agent} size={22} />
                </li>
              )
            })}
          </ul>
          {running ? (
            <button onClick={() => go(6)} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo">
              Skip ahead to Sun 00:20 <ArrowRight size={14} />
            </button>
          ) : (
            <div className="mt-6 rounded-xl bg-paper p-4 text-sm leading-relaxed text-body">
              Incident closed by the remediation agent at Sun 00:50. A problem record is open so this does not happen again.{' '}
              <Link to="/owner/policy" className="font-semibold text-indigo">See the proposed check →</Link>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function AcceptanceChart({ upTo }) {
  const data = RECOVERY.series
  const W = 640, H = 230, L = 36, R = 8, T = 28, B = 28
  const max = 200
  const bw = (W - L - R) / data.length
  const y = (v) => T + (H - T - B) * (1 - v / max)
  const xAt = (i) => L + i * bw
  const idx = (t) => data.findIndex(([tt]) => tt === t)
  const outage = [idx('21:45'), idx('23:15')]
  const approveX = xAt(idx('23:00')) + bw * (2 / 15)
  const changeX = xAt(idx('21:30')) + bw * (10 / 15)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Invoices accepted per 15 minutes">
      <rect x={xAt(outage[0])} y={T - 6} width={(outage[1] - outage[0] + 1) * bw} height={H - T - B + 6} fill="#fbf0dc" rx="4" />
      <text x={xAt(outage[0]) + 6} y={T + 8} fontSize="11" fill="#8a5208" fontWeight="600">Invoices stuck</text>
      {[0, 100, 200].map((v) => (
        <g key={v}>
          <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#e2e1ec" strokeDasharray={v ? '2 4' : undefined} />
          <text x={L - 8} y={y(v) + 4} fontSize="11" textAnchor="end" fill="#6e6c88">{v}</text>
        </g>
      ))}
      <line x1={L} x2={W - R} y1={y(44)} y2={y(44)} stroke="#5db33a" strokeDasharray="4 4" opacity="0.7" />
      <text x={W - R} y={y(44) - 5} fontSize="11" textAnchor="end" fill="#2e7d1f">Normal rate</text>
      {data.map(([t, v], i) => i <= upTo && (
        <g key={t}>
          <rect x={xAt(i) + 3} y={y(v)} width={bw - 6} height={Math.max(0, y(0) - y(v))} rx="2"
            fill={v > 60 ? '#2b2370' : '#5db33a'} className="rise-in" />
          {i % 4 === 0 && <text x={xAt(i) + bw / 2} y={H - 8} fontSize="11" textAnchor="middle" fill="#6e6c88">{t}</text>}
        </g>
      ))}
      <Marker x={changeX} label="TR-4471 imported" top={T - 14} />
      {upTo >= idx('23:00') && <Marker x={approveX} label="You approved" top={T - 14} anchor="end" />}
    </svg>
  )
}

function Marker({ x, label, top, anchor = 'start' }) {
  return (
    <g>
      <line x1={x} x2={x} y1={top + 4} y2={202} stroke="#1c1a3f" strokeWidth="1" strokeDasharray="2 3" />
      <text x={anchor === 'end' ? x - 4 : x + 4} y={top + 2} fontSize="11" fontWeight="600" fill="#1c1a3f" textAnchor={anchor}>{label}</text>
    </g>
  )
}
