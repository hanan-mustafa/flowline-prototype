import { ArrowRight, Hammer } from 'lucide-react'
import { roleById, FLOW } from '../data/scenario'
import { useStory } from '../state/story'
import FlowLine from '../components/FlowLine'
import Narration from '../components/Narration'
import SampleTag from '../components/SampleTag'
import Icon from '../components/Icon'

// Foundation placeholder for a role. The shared pieces (flow line, narration,
// story position) are live; the role's own screens arrive in later build steps.
export default function RoleView({ roleId }) {
  const role = roleById[roleId]
  const { moment } = useStory()
  const { invoicesWaiting, valueOnHold } = moment.metrics
  const yourMove = moment.actor.kind === 'role' && moment.actor.id === roleId

  return (
    <div className="mx-auto max-w-[1360px] px-8 pt-10">
      <div className="flex items-end justify-between gap-8">
        <div>
          <div className="eyebrow flex items-center gap-2"><Icon name={role.icon} size={14} />{role.label}</div>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-ink">{role.promise}</h1>
          <p className="mt-2 flex items-center gap-2 text-body">
            {role.shiftFrom} <ArrowRight size={15} className="text-muted" /> <span className="font-medium text-indigo">{role.shiftTo}</span>
          </p>
        </div>
        {yourMove && (
          <div className="rise-in rounded-xl border border-indigo/20 bg-indigo px-4 py-3 text-sm text-white shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-green-soft">Your decision point</div>
            <div className="mt-0.5 font-medium">{moment.title}</div>
          </div>
        )}
      </div>

      <section className="mt-8 rounded-2xl border border-rule bg-card px-8 pb-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-ink">{FLOW.name}</div>
            <div className="text-xs text-muted">{moment.day} {moment.time} · live flow health</div>
          </div>
          <div className="flex items-center gap-6">
            <Stat label="Invoices waiting" value={invoicesWaiting} warn={invoicesWaiting > 0} />
            <Stat label="Value on hold" value={valueOnHold ? `$${valueOnHold.toFixed(1)}M` : '$0'} warn={valueOnHold > 0} />
            <SampleTag />
          </div>
        </div>
        <FlowLine stages={moment.stages} impact={`${invoicesWaiting} invoices waiting`} />
      </section>

      <div className="mt-6 grid grid-cols-[1.25fr_1fr] gap-6">
        <section className="rounded-2xl border border-dashed border-rule bg-card/60 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-ink">Coming in this view</div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-tint px-2.5 py-1 text-xs font-medium text-indigo">
              <Hammer size={12} /> Build step {role.buildStep}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {role.screens.map((s, i) => (
              <div key={s.title} className="rounded-xl border border-rule bg-card p-4">
                <div className="text-xs font-semibold tabular-nums text-green-ink">0{i + 1}</div>
                <div className="mt-1 font-medium text-ink">{s.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-body">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-rule bg-card p-4">
          <div className="px-2 pb-2 pt-1 text-sm font-semibold text-ink">What happened so far</div>
          <Narration />
        </section>
      </div>
    </div>
  )
}

function Stat({ label, value, warn }) {
  return (
    <div className="text-right">
      <div className={`font-serif text-2xl font-semibold tabular-nums ${warn ? 'text-amber-ink' : 'text-ink'}`}>{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  )
}
