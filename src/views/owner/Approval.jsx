import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Check, CircleCheck, Clock, RotateCcw, ShieldAlert, Undo2, X } from 'lucide-react'
import { APPROVAL } from '../../data/owner'
import { AGENTS, roleById } from '../../data/scenario'
import { useStory } from '../../state/story'
import AgentGlyph from '../../components/AgentGlyph'
import SampleTag from '../../components/SampleTag'
import Empty from '../../components/Empty'
import PageHeader, { StatusChip } from '../../components/PageHeader'

const WINDOWS = [
  { id: 'now', label: 'Run now', note: 'Invoices are queuing at the tax portal' },
  { id: 'sun6', label: 'Sun 06:00', note: 'About 300 more invoices would be delayed' },
  { id: 'mon8', label: 'Mon 08:00', note: 'Not allowed: exceeds the invoicing delay limit', disabled: true },
]

export default function Approval() {
  const { index, go } = useStory()
  const pending = index === 4

  return (
    <>
      <PageHeader
        crumbs={['Approvals']}
        title="Approvals"
        meta={<span>{pending ? '1 pending' : 'No pending approvals'} · Production changes and actions above their autonomy level</span>}
      />
      <div className="p-8">
        {index < 4 ? (
          <Empty icon={BadgeCheck} title="No pending approvals"
            text="You'll be notified when an agent or engineer needs your approval for an action on your flows."
            skipTo={4} />
        ) : (
          <Card pending={pending} onApprove={() => go(5)} />
        )}
      </div>
    </>
  )
}

function Card({ pending, onApprove }) {
  const [win, setWin] = useState('now')
  const [sendBack, setSendBack] = useState(false)
  const [sentBack, setSentBack] = useState(false)
  const a = APPROVAL

  return (
    <div className="grid grid-cols-[1fr_320px] items-start gap-6">
      <article className="rounded-xl border border-rule bg-card">
        <header className="border-b border-rule p-6">
          <div className="flex items-center gap-2">
            {pending ? <StatusChip tone="warn">Pending your approval</StatusChip> : <StatusChip tone="good">Approved</StatusChip>}
            <StatusChip tone="info">Level {a.level} · {a.levelName}</StatusChip>
            <span className="text-xs text-muted">Incident O2C-0187 · requested {a.requestedBy.at}</span>
          </div>
          <h2 className="mt-3 text-lg font-semibold text-ink">{a.title}</h2>
          <div className="mt-2 flex items-center gap-2 text-sm text-body">
            <AgentGlyph id={a.preparedBy} size={22} />
            Prepared by {AGENTS[a.preparedBy].name} · endorsed by {roleById.engineer.label}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink">{a.why}</p>
        </header>

        <div className="grid grid-cols-2 divide-x divide-rule">
          <div className="space-y-6 p-6">
            <Block title="Plan">
              <ol className="space-y-2.5">
                {a.plan.map((p, i) => (
                  <li key={p} className="flex gap-3 text-sm leading-relaxed text-ink">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-tint text-[11px] font-semibold text-indigo">{i + 1}</span>
                    {p}
                  </li>
                ))}
              </ol>
            </Block>
            <Block title="Alternatives considered">
              <div className="space-y-2">
                {a.options.map((o) => (
                  <div key={o.name} className={`rounded-lg border p-3 text-sm ${o.chosen ? 'border-indigo/30 bg-indigo-tint/50' : 'border-rule'}`}>
                    <div className="flex items-center gap-2 font-medium text-ink">
                      {o.chosen ? <Check size={15} className="text-indigo" /> : <X size={15} className="text-muted" />}{o.name}
                      {o.chosen && <span className="text-xs font-normal text-muted">Selected</span>}
                    </div>
                    <div className="ml-6 text-body">{o.note}</div>
                  </div>
                ))}
              </div>
            </Block>
          </div>

          <div className="space-y-6 p-6">
            <Block title="Evidence">
              <ul className="space-y-2">
                {a.evidence.map((e) => (
                  <li key={e.text} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                    <span className={`mt-0.5 w-[74px] shrink-0 rounded px-1.5 py-0.5 text-center text-[10px] font-semibold uppercase tracking-wide ${e.strength === 'strong' ? 'bg-indigo text-white' : 'bg-indigo-tint text-indigo'}`}>
                      {e.strength}
                    </span>
                    {e.text}
                  </li>
                ))}
              </ul>
            </Block>
            <Block title="Scope of impact">
              <dl className="space-y-2 text-sm">
                {a.blast.map((b) => (
                  <div key={b.label} className="grid grid-cols-[100px_1fr] gap-2">
                    <dt className="text-muted">{b.label}</dt>
                    <dd className="text-ink">{b.text}</dd>
                  </div>
                ))}
              </dl>
            </Block>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-rule p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted"><Undo2 size={13} />Rollback</div>
                <p className="mt-1.5 text-sm text-ink">{a.rollback.text}</p>
                <p className="mt-1 text-xs text-body">{a.rollback.time} · {a.rollback.tested}</p>
              </div>
              <div className="rounded-lg border border-rule p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted"><RotateCcw size={13} />Track record</div>
                <p className="mt-1.5 text-lg font-semibold text-ink">{a.record.success}/{a.record.runs} successful</p>
                <p className="text-xs text-body">{a.record.action}s · {a.record.lastIssue}</p>
                <div className="mt-2 flex gap-0.5">
                  {Array.from({ length: a.record.runs }).map((_, i) => <span key={i} className="h-1.5 flex-1 rounded-sm bg-green" />)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="flex items-center justify-between border-t border-rule px-6 py-3 text-xs text-muted">
          <span>All steps, approvals and results are recorded in the audit log.</span>
          <SampleTag />
        </footer>
      </article>

      <aside className="space-y-4">
        {pending && !sentBack && (
          <div className="rounded-xl border border-rule bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink"><ShieldAlert size={16} className="text-amber" />Decision</div>
            <p className="mt-1 text-sm text-body">Production change. Policy level 3 requires a named approver.</p>

            <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted">Schedule</div>
            <div className="mt-2 space-y-1.5">
              {WINDOWS.map((w) => (
                <label key={w.id} className={`flex cursor-pointer gap-2.5 rounded-lg border p-2.5 text-sm transition ${
                  w.disabled ? 'cursor-not-allowed opacity-50' : win === w.id ? 'border-indigo bg-indigo-tint/50' : 'border-rule hover:border-indigo/30'}`}>
                  <input type="radio" name="win" className="mt-1 accent-[#2b2370]" disabled={w.disabled}
                    checked={win === w.id} onChange={() => setWin(w.id)} />
                  <span>
                    <span className="font-medium text-ink">{w.label}</span>
                    <span className="block text-xs text-body">{w.note}</span>
                  </span>
                </label>
              ))}
            </div>

            {!sendBack ? (
              <div className="mt-5 space-y-2">
                <button onClick={onApprove}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-2">
                  <Check size={16} /> Approve
                </button>
                <button onClick={() => setSendBack(true)}
                  className="w-full rounded-lg border border-rule px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-paper">
                  Request changes
                </button>
              </div>
            ) : (
              <div className="mt-5 space-y-2">
                <label className="text-xs font-medium text-muted">Comment to the engineer</label>
                <textarea rows={3} defaultValue="Can we keep the pricing change and patch the mapping instead?"
                  className="w-full rounded-lg border border-rule bg-paper p-2.5 text-sm text-ink outline-none focus:border-indigo" />
                <div className="flex gap-2">
                  <button onClick={() => setSentBack(true)} className="flex-1 rounded-lg bg-indigo px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-2">Send</button>
                  <button onClick={() => setSendBack(false)} className="rounded-lg border border-rule px-3 py-2 text-sm text-ink hover:bg-paper">Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        {pending && sentBack && (
          <div className="rise-in rounded-xl border border-rule bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink"><Clock size={16} className="text-indigo" />Changes requested</div>
            <p className="mt-2 text-sm leading-relaxed text-body">The engineer has been notified. The request returns here once updated.</p>
            <button onClick={onApprove}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-dashed border-indigo/40 px-3 py-1 text-xs font-medium text-indigo hover:bg-indigo-tint">
              Prototype: continue as approved
            </button>
          </div>
        )}

        {!pending && (
          <div className="rise-in rounded-xl border border-rule bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink"><CircleCheck size={16} className="text-green" />Approved by you · Sat 23:02</div>
            <p className="mt-2 text-sm leading-relaxed text-body">
              Remediation agent is executing the plan. Rollback stays available until the flow has been stable for 30 minutes.
            </p>
            <Link to="/owner/recovery" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo">
              View incident <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </aside>
    </div>
  )
}

function Block({ title, children }) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">{title}</h3>
      {children}
    </section>
  )
}
