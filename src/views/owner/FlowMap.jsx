import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Eye } from 'lucide-react'
import { FLOW } from '../../data/scenario'
import { OWNER, STAGE_DETAIL } from '../../data/owner'
import { useStory } from '../../state/story'
import FlowCard from '../../components/FlowCard'
import Narration from '../../components/Narration'

const NEXT = {
  4: { to: '/owner/approval', label: 'Review the revert plan' },
  5: { to: '/owner/approval', label: 'See what you approved' },
  6: { to: '/owner/recovery', label: 'See the recovery' },
  7: { to: '/owner/policy', label: 'Review the proposed check' },
}

const STATE_WORDS = {
  healthy: { label: 'Normal', cls: 'bg-green-tint text-green-ink' },
  degraded: { label: 'Degraded', cls: 'bg-amber-tint text-amber-ink' },
  recovering: { label: 'Recovered, verifying', cls: 'bg-green-tint text-green-ink' },
}

export default function FlowMap() {
  const { index, moment } = useStory()
  const [stage, setStage] = useState('einvoice')
  const next = NEXT[index]
  const st = moment.stages[stage]
  const detail = STAGE_DETAIL[stage]
  const stageLabel = FLOW.stages.find((s) => s.id === stage).label

  return (
    <div className="space-y-6">
      <FlowCard selected={stage} onSelect={setStage} showCustomers />

      <div className="grid grid-cols-[2fr_1fr] gap-6">
        <section className="flex flex-col justify-between rounded-2xl bg-indigo p-7 text-white">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-green-soft">Where things stand · {moment.day} {moment.time}</div>
            <p key={moment.id} className="rise-in mt-3 font-serif text-2xl leading-snug">{moment.ownerStatus}</p>
          </div>
          {next && (
            <Link to={next.to} className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo transition hover:bg-green-tint">
              {next.label} <ArrowRight size={15} />
            </Link>
          )}
        </section>

        <section className="rounded-2xl border border-rule bg-card p-6">
          <div className="text-sm font-semibold text-ink">Your flows</div>
          <ul className="mt-3 divide-y divide-rule">
            {OWNER.flows.map((f) => {
              const bad = f.live && Object.values(moment.stages).includes('degraded')
              return (
                <li key={f.id} className="flex items-center gap-3 py-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${bad ? 'bg-amber' : 'bg-green'}`} />
                  <span className="flex-1 text-sm font-medium text-ink">{f.name}</span>
                  <span className={`text-xs ${bad ? 'font-semibold text-amber-ink' : 'text-muted'}`}>
                    {f.live ? (bad ? 'E-invoice degraded' : 'Normal') : f.note}
                  </span>
                </li>
              )
            })}
          </ul>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Health is measured on business outcomes, such as invoices accepted, not on server alarms.
          </p>
        </section>
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-6">
        <section className="rounded-2xl border border-rule bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-ink">{stageLabel} stage</div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATE_WORDS[st].cls}`}>{STATE_WORDS[st].label}</span>
          </div>
          {detail ? (
            <>
              <p className="mt-3 text-sm leading-relaxed text-body">{detail.what}</p>
              <div className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                <Eye size={13} /> What Flowline watches here
              </div>
              <ul className="mt-2 space-y-1.5">
                {detail.watching.map((w) => (
                  <li key={w} className="flex items-center gap-2 text-sm text-ink">
                    <span className={`h-1.5 w-1.5 rounded-full ${st === 'degraded' ? 'bg-amber' : 'bg-green'}`} />{w}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-body">
              Running normally all weekend. Flowline keeps a baseline for this stage and would flag a drop or a leading sign,
              such as jobs running late, before users notice.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-rule bg-card p-4">
          <div className="px-2 pb-2 pt-1 text-sm font-semibold text-ink">What Flowline did</div>
          <div className="max-h-[300px] overflow-y-auto"><Narration /></div>
        </section>
      </div>
    </div>
  )
}
