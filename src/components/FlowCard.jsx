import { FLOW } from '../data/scenario'
import { useStory } from '../state/story'
import FlowLine from './FlowLine'
import SampleTag from './SampleTag'

export default function FlowCard({ selected, onSelect, showCustomers = false }) {
  const { moment } = useStory()
  const { invoicesWaiting, valueOnHold, customers } = moment.metrics

  return (
    <section className="rounded-2xl border border-rule bg-card px-8 pb-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-ink">{FLOW.name}</div>
          <div className="text-xs text-muted">
            {moment.day} {moment.time} · live flow health{onSelect ? ' · select a stage for detail' : ''}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Stat label="Invoices waiting" value={invoicesWaiting} warn={invoicesWaiting > 0} />
          <Stat label="Value on hold" value={valueOnHold ? `$${valueOnHold.toFixed(1)}M` : '$0'} warn={valueOnHold > 0} />
          {showCustomers && <Stat label="Customers affected" value={customers} warn={customers > 0} />}
          <SampleTag />
        </div>
      </div>
      <FlowLine stages={moment.stages} impact={`${invoicesWaiting} invoices waiting`} selected={selected} onSelect={onSelect} />
    </section>
  )
}

export function Stat({ label, value, warn }) {
  return (
    <div className="text-right">
      <div className={`font-serif text-2xl font-semibold tabular-nums transition-colors ${warn ? 'text-amber-ink' : 'text-ink'}`}>{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  )
}
