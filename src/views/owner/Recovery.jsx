import { Link } from 'react-router-dom'
import { Check, Loader2, Siren } from 'lucide-react'
import { RECOVERY } from '../../data/owner'
import { INCIDENT } from '../../data/engineer'
import { INCIDENT_STATUS } from '../../components/incident'
import PageHeader, { StatusChip } from '../../components/PageHeader'
import Narration from '../../components/Narration'
import { useStory } from '../../state/story'
import AgentGlyph from '../../components/AgentGlyph'
import SampleTag from '../../components/SampleTag'
import Empty from '../../components/Empty'

// How far the chart has got at each story step (index into RECOVERY.series)
const CUTOFF = [1, 5, 5, 7, 8, 8, 13, RECOVERY.series.length - 1]

export default function Recovery() {
  const { index } = useStory()
  const status = INCIDENT_STATUS[index]

  return (
    <>
      <PageHeader
        crumbs={['Incidents', index ? INCIDENT.id : 'Open']}
        title={index ? `${INCIDENT.id} · ${INCIDENT.title}` : 'Incidents'}
        meta={index ? <>
          <StatusChip tone={status[1]}>{status[0]}</StatusChip>
          <span>{INCIDENT.priority} · Order to cash · E-invoice</span>
          <span>Opened {INCIDENT.opened}</span>
        </> : <span>No open incidents on your flows</span>}
      />
      <div className="p-8">
        {index === 0 ? (
          <Empty icon={Siren} title="No open incidents" text="Incidents affecting your flows appear here, with their business impact and progress." skipTo={1} />
        ) : <IncidentBody index={index} />}
      </div>
    </>
  )
}

function IncidentBody({ index }) {
  const running = index === 5
  const resolved = index >= 6
  const doneChecks = resolved ? RECOVERY.checks.length : running ? 1 : 0

  return (
    <div className="space-y-6">
      {resolved && (
        <div className="grid grid-cols-4 gap-4">
          {RECOVERY.summary.map((s) => (
            <div key={s.label} className="rise-in rounded-xl border border-rule bg-card p-4">
              <div className="text-xs text-muted">{s.label}</div>
              <div className="mt-1 text-2xl font-semibold text-ink">{s.value}</div>
              <div className="text-xs text-muted">{s.note}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-[1.5fr_1fr] gap-6">
        <section className="rounded-xl border border-rule bg-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold text-ink">Invoices accepted by tax portal</div>
              <div className="text-xs text-muted">Per 15 minutes</div>
            </div>
            <SampleTag />
          </div>
          <AcceptanceChart upTo={CUTOFF[index]} />
        </section>

        <section className="rounded-xl border border-rule bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-ink">Remediation checks</div>
            <StatusChip tone={resolved ? 'good' : running ? 'info' : 'neutral'}>
              {resolved ? 'All passed' : running ? 'In progress' : 'Not started'}
            </StatusChip>
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
          {index < 5 && (
            <p className="mt-5 rounded-lg bg-paper p-3 text-sm text-body">
              {index === 4
                ? <>Waiting for your approval of the revert. <Link to="/owner/approval" className="font-semibold text-indigo">Review approval</Link></>
                : 'Starts once a fix is approved.'}
            </p>
          )}
          {resolved && (
            <p className="mt-5 rounded-lg bg-paper p-3 text-sm leading-relaxed text-body">
              Closed by Remediation agent · Sun 00:50. Problem record PRB-0044 opened.{' '}
              {index === 7 && <Link to="/owner/policy" className="font-semibold text-indigo">1 policy proposal</Link>}
            </p>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-rule bg-card p-3">
        <div className="px-2 pb-1 pt-2 text-sm font-semibold text-ink">Activity</div>
        <Narration />
      </section>
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
      {upTo >= outage[0] && <rect x={xAt(outage[0])} y={T - 6} width={(Math.min(outage[1], upTo) - outage[0] + 1) * bw} height={H - T - B + 6} fill="#fbf0dc" rx="4" />}
      {upTo >= outage[0] && <text x={xAt(outage[0]) + 6} y={T + 8} fontSize="11" fill="#8a5208" fontWeight="600">Not accepted</text>}
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
      {upTo >= idx('21:30') && <Marker x={changeX} label="TR-4471 imported" top={T - 14} anchor="end" />}
      {upTo >= idx('23:00') && <Marker x={approveX} label="Revert approved" top={T - 14} />}
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
