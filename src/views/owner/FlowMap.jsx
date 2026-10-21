import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FLOW } from '../../data/scenario'
import { STAGE_DETAIL } from '../../data/owner'
import { useStory } from '../../state/story'
import PageHeader, { StatusChip } from '../../components/PageHeader'
import FlowCard from '../../components/FlowCard'
import Narration from '../../components/Narration'

const NEXT = {
  1: { to: '/owner/recovery', label: 'View incident' },
  2: { to: '/owner/recovery', label: 'View incident' },
  3: { to: '/owner/recovery', label: 'View incident' },
  4: { to: '/owner/approval', label: 'Review approval' },
  5: { to: '/owner/recovery', label: 'View remediation' },
  6: { to: '/owner/recovery', label: 'View incident summary' },
  7: { to: '/owner/policy', label: 'Review proposal' },
}

const STATE = {
  healthy: ['Healthy', 'good'],
  degraded: ['Degraded', 'warn'],
  recovering: ['Recovered', 'good'],
}

export default function FlowMap() {
  const { index, moment } = useStory()
  const [stage, setStage] = useState('einvoice')
  const next = NEXT[index]
  const flowState = Object.values(moment.stages).includes('degraded') ? 'degraded' : 'healthy'
  const st = moment.stages[stage]
  const detail = STAGE_DETAIL[stage]
  const stageLabel = FLOW.stages.find((s) => s.id === stage).label

  return (
    <>
      <PageHeader
        crumbs={['Business flows']}
        title={FLOW.name}
        meta={<>
          <StatusChip tone={STATE[flowState][1]}>{STATE[flowState][0]}</StatusChip>
          <span>{FLOW.system}</span><span>5 stages</span><span>Owner: you</span>
        </>}
      />
      <div className="space-y-6 p-8">
        <FlowCard selected={stage} onSelect={setStage} showCustomers />

        <div className="grid grid-cols-[1fr_1fr] gap-6">
          <section className="space-y-6">
            <div className="rounded-xl border border-rule bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-ink">Status</div>
                <span className="text-xs text-muted">{moment.day} {moment.time}</span>
              </div>
              <p key={moment.id} className="rise-in mt-2 text-[15px] leading-relaxed text-ink">{moment.ownerStatus}</p>
              {next && (
                <Link to={next.to} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-indigo px-3.5 py-2 text-sm font-semibold text-white hover:bg-indigo-2">
                  {next.label} <ArrowRight size={15} />
                </Link>
              )}
            </div>

            <div className="rounded-xl border border-rule bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-ink">Stage: {stageLabel}</div>
                <StatusChip tone={STATE[st][1]}>{STATE[st][0]}</StatusChip>
              </div>
              {detail ? (
                <>
                  <p className="mt-2 text-sm leading-relaxed text-body">{detail.what}</p>
                  <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted">Monitored signals</div>
                  <ul className="mt-2 space-y-1.5">
                    {detail.watching.map((w) => (
                      <li key={w} className="flex items-center gap-2 text-sm text-ink">
                        <span className={`h-1.5 w-1.5 rounded-full ${st === 'degraded' ? 'bg-amber' : 'bg-green'}`} />{w}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-2 text-sm leading-relaxed text-body">
                  Operating within baseline. Flowline alerts on drops in throughput and on leading indicators such as late jobs or growing queues.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-rule bg-card p-3">
            <div className="flex items-center justify-between px-2 pb-1 pt-2">
              <div className="text-sm font-semibold text-ink">Activity</div>
              <span className="text-xs text-muted">Agents and people</span>
            </div>
            <div className="max-h-[420px] overflow-y-auto"><Narration /></div>
          </section>
        </div>
      </div>
    </>
  )
}
