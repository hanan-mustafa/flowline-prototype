import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, CircleCheck, Clock, RotateCcw, ShieldAlert, Undo2, X } from 'lucide-react'
import { APPROVAL } from '../../data/owner'
import { AGENTS, roleById } from '../../data/scenario'
import { useStory } from '../../state/story'
import AgentGlyph from '../../components/AgentGlyph'
import SampleTag from '../../components/SampleTag'
import Empty from '../../components/Empty'

const WINDOWS = [
  { id: 'now', label: 'Now', note: 'Recommended: invoices are piling up' },
  { id: 'sun6', label: 'Sun 06:00', note: 'About 300 more invoices would wait' },
  { id: 'mon8', label: 'Mon 08:00', note: 'Customers invoiced late; ruled out by finance policy', disabled: true },
]

export default function Approval() {
  const { index, go } = useStory()

  if (index < 4) {
    return (
      <Empty
        title="Nothing waits for you yet"
        text={index === 3
          ? 'The investigation agent has a probable cause and the on-call engineer is reviewing it. If the fix needs your approval, it will appear here with its evidence and rollback.'
          : 'Flowline is still working out what is wrong. You will only be asked for a decision if a fix is risky enough to need one.'}
        action={() => go(4)}
        actionLabel="Jump to the decision point"
      />
    )
  }

  return <Card pending={index === 4} onApprove={() => go(5)} />
}

function Card({ pending, onApprove }) {
  const [win, setWin] = useState('now')
  const [sendBack, setSendBack] = useState(false)
  const [sentBack, setSentBack] = useState(false)
  const a = APPROVAL

  return (
    <div className="grid grid-cols-[1fr_340px] items-start gap-6">
      <article className="rounded-2xl border border-rule bg-card">
        <header className="border-b border-rule p-7">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${pending ? 'bg-amber-tint text-amber-ink' : 'bg-green-tint text-green-ink'}`}>
              {pending ? 'Waiting for you' : 'Approved'}
            </span>
            <span className="rounded-full bg-indigo-tint px-2.5 py-1 text-xs font-semibold text-indigo">Level {a.level} · {a.levelName}</span>
          </div>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">{a.title}</h2>
          <div className="mt-3 flex items-center gap-2 text-sm text-body">
            <AgentGlyph id={a.preparedBy} size={24} />
            Prepared by the {AGENTS[a.preparedBy].name.toLowerCase()}, backed by the {roleById.engineer.label} at {a.requestedBy.at.split(' ')[1]}
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-ink">{a.why}</p>
        </header>

        <div className="grid grid-cols-2 divide-x divide-rule">
          <div className="space-y-7 p-7">
            <Block title="What will happen">
              <ol className="space-y-2.5">
                {a.plan.map((p, i) => (
                  <li key={p} className="flex gap-3 text-sm leading-relaxed text-ink">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-tint text-xs font-semibold text-indigo">{i + 1}</span>
                    {p}
                  </li>
                ))}
              </ol>
            </Block>
            <Block title="Options considered">
              <div className="space-y-2">
                {a.options.map((o) => (
                  <div key={o.name} className={`rounded-lg border p-3 text-sm ${o.chosen ? 'border-indigo/30 bg-indigo-tint/50' : 'border-rule'}`}>
                    <div className="flex items-center gap-2 font-medium text-ink">
                      {o.chosen ? <Check size={15} className="text-indigo" /> : <X size={15} className="text-muted" />}{o.name}
                    </div>
                    <div className="ml-6 text-body">{o.note}</div>
                  </div>
                ))}
              </div>
            </Block>
          </div>

          <div className="space-y-7 p-7">
            <Block title="Why we think so">
              <ul className="space-y-2">
                {a.evidence.map((e) => (
                  <li key={e.text} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                    <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${e.strength === 'strong' ? 'bg-indigo text-white' : 'bg-indigo-tint text-indigo'}`}>
                      {e.strength}
                    </span>
                    {e.text}
                  </li>
                ))}
              </ul>
            </Block>
            <Block title="Blast radius">
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
              <div className="rounded-xl bg-green-tint/60 p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-green-ink"><Undo2 size={13} />Rollback</div>
                <p className="mt-1.5 text-sm text-ink">{a.rollback.text}</p>
                <p className="mt-1 text-xs text-body">{a.rollback.time} · {a.rollback.tested}</p>
              </div>
              <div className="rounded-xl bg-paper p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted"><RotateCcw size={13} />Track record</div>
                <p className="mt-1.5 font-serif text-2xl font-semibold text-ink">{a.record.success}/{a.record.runs}</p>
                <p className="text-xs text-body">{a.record.action.toLowerCase()}s succeeded · {a.record.lastIssue}</p>
                <div className="mt-2 flex gap-0.5">
                  {Array.from({ length: a.record.runs }).map((_, i) => <span key={i} className="h-2 flex-1 rounded-sm bg-green" />)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="flex items-center justify-between border-t border-rule px-7 py-3 text-xs text-muted">
          <span>Every step, approval and result is written to the incident's audit trail.</span>
          <SampleTag />
        </footer>
      </article>

      <aside className="sticky top-6 space-y-4">
        {pending && !sentBack && (
          <div className="rounded-2xl border border-rule bg-card p-6 shadow-lg shadow-indigo/5">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink"><ShieldAlert size={16} className="text-amber" />Your decision</div>
            <p className="mt-1 text-sm text-body">This changes production, so it needs a named approver.</p>

            <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted">When to run</div>
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
                  <Check size={16} /> Approve {win === 'now' ? 'and run now' : 'for Sun 06:00'}
                </button>
                <button onClick={() => setSendBack(true)}
                  className="w-full rounded-lg border border-rule px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-paper">
                  Send back with a question
                </button>
              </div>
            ) : (
              <div className="mt-5 space-y-2">
                <textarea rows={3} defaultValue="Can we keep the pricing change and patch the mapping instead?"
                  className="w-full rounded-lg border border-rule bg-paper p-2.5 text-sm text-ink outline-none focus:border-indigo" />
                <div className="flex gap-2">
                  <button onClick={() => setSentBack(true)} className="flex-1 rounded-lg bg-indigo px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-2">Send to engineer</button>
                  <button onClick={() => setSendBack(false)} className="rounded-lg border border-rule px-3 py-2 text-sm text-ink hover:bg-paper">Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        {pending && sentBack && (
          <div className="rise-in rounded-2xl border border-rule bg-card p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink"><Clock size={16} className="text-indigo" />Sent back to the engineer</div>
            <p className="mt-2 text-sm leading-relaxed text-body">
              The engineer and the investigation agent will answer here. In this prototype the story continues as if you approved.
            </p>
            <button onClick={onApprove} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo">
              Continue the story <ArrowRight size={14} />
            </button>
          </div>
        )}

        {!pending && (
          <div className="rise-in rounded-2xl bg-indigo p-6 text-white">
            <CircleCheck size={22} className="text-green-soft" />
            <div className="mt-2 font-semibold">Approved by you · Sat 23:02</div>
            <p className="mt-1 text-sm leading-relaxed text-white/80">
              The remediation agent runs the plan step by step. Rollback stays ready until the flow has been normal for 30 minutes.
            </p>
            <Link to="/owner/recovery" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-green-soft">
              Watch the recovery <ArrowRight size={14} />
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
