import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { ArrowRight, Check, History, MessageSquareWarning } from 'lucide-react'
import { CASE, INCIDENT } from '../../data/engineer'
import { useStory } from '../../state/story'
import AgentGlyph from '../../components/AgentGlyph'
import Empty from '../../components/Empty'
import SampleTag from '../../components/SampleTag'

export default function CaseFile() {
  const { index, go } = useStory()
  const { confirmed, setConfirmed } = useOutletContext()
  const [disagree, setDisagree] = useState(false)
  const done = confirmed || index >= 4

  if (index < 3) {
    return (
      <Empty
        title="The case file is still being built"
        text="The investigation agent is pulling the timeline, changes, logs and similar past incidents into one brief. It takes no action in production."
        action={() => go(3)}
        actionLabel="Jump to 22:31, when it is ready"
      />
    )
  }

  const top = CASE.hypotheses[0]
  const ruledOut = CASE.hypotheses.slice(1)

  return (
    <div className="grid grid-cols-[1fr_380px] items-start gap-6">
      <article className="rounded-2xl border border-rule bg-card">
        <header className="border-b border-rule p-7">
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full bg-amber-tint px-2.5 py-1 font-semibold text-amber-ink">{INCIDENT.priority}</span>
            <span className="font-semibold text-ink">{INCIDENT.id}</span>
            <span className="text-muted">· opened {INCIDENT.opened} · {INCIDENT.priorityWhy}</span>
          </div>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">{INCIDENT.title}</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink">{CASE.summary}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted">
            <AgentGlyph id="investigation" size={22} /> Written by the investigation agent at 22:31 from SAP, the change log, monitoring and past incidents
          </div>
        </header>

        <div className="space-y-8 p-7">
          <Section title="Timeline">
            <ol className="relative ml-2 space-y-3 border-l-2 border-rule pl-5">
              {CASE.timeline.map((t) => (
                <li key={t.at} className="relative text-sm">
                  <span className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-card ${t.key ? 'bg-amber' : 'bg-indigo/60'}`} />
                  <span className="mr-3 font-semibold tabular-nums text-ink">{t.at}</span>
                  <span className={t.key ? 'font-medium text-amber-ink' : 'text-body'}>{t.text}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="What TR-4471 changed">
            <div className="overflow-hidden rounded-xl border border-rule font-mono text-[13px]">
              <div className="bg-paper px-4 py-2 font-sans text-xs text-muted">{CASE.diff.object}</div>
              <div className="bg-[#fdeeee] px-4 py-2 text-[#8f2d2d]">−  {CASE.diff.before}</div>
              <div className="bg-[#eaf6e4] px-4 py-2 text-green-ink">+  {CASE.diff.after}</div>
            </div>
            <p className="mt-2 text-sm text-body">{CASE.diff.note}</p>
          </Section>

          <Section title="Failing IDocs" aside={<SampleTag />}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted">
                  <th className="pb-2 font-medium">IDoc</th><th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Status</th><th className="pb-2 font-medium">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {CASE.idocs.map((d) => (
                  <tr key={d.no}>
                    <td className="py-2 font-mono text-[13px] text-ink">{d.no}</td>
                    <td className="py-2 text-ink">{d.customer}</td>
                    <td className="py-2"><span className="rounded bg-amber-tint px-1.5 py-0.5 text-xs font-semibold text-amber-ink">{d.status}</span></td>
                    <td className="py-2 text-body">{d.msg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-sm text-muted">…and {CASE.idocTotal - CASE.idocs.length} more, all with the same error and all through the changed mapping.</p>
          </Section>
        </div>
      </article>

      <aside className="space-y-4">
        <section className="rounded-2xl border border-indigo/20 bg-card p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">Probable cause</div>
          <p className="mt-2 font-serif text-xl font-semibold leading-snug text-ink">{top.text}</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 flex-1 rounded-full bg-indigo-tint">
              <div className="h-2 rounded-full bg-indigo" style={{ width: `${top.confidence}%` }} />
            </div>
            <span className="text-sm font-semibold tabular-nums text-indigo">{top.confidence}%</span>
          </div>

          {done ? (
            <div className="rise-in mt-5 rounded-xl bg-green-tint/70 p-4 text-sm">
              <div className="flex items-center gap-1.5 font-semibold text-green-ink"><Check size={15} />Cause confirmed by you</div>
              <Link to="/engineer/fix" className="mt-2 inline-flex items-center gap-1 font-semibold text-indigo">
                Choose the fix <ArrowRight size={14} />
              </Link>
            </div>
          ) : disagree ? (
            <div className="mt-5 space-y-2">
              <textarea rows={3} defaultValue="Check whether the portal changed its schema tonight."
                className="w-full rounded-lg border border-rule bg-paper p-2.5 text-sm text-ink outline-none focus:border-indigo" />
              <p className="text-xs text-muted">The investigation agent re-checks with your hint and updates the case file. In this prototype, the story continues with the agent's cause.</p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmed(true)} className="flex-1 rounded-lg bg-indigo px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-2">Send hint</button>
                <button onClick={() => setDisagree(false)} className="rounded-lg border border-rule px-3 py-2 text-sm text-ink hover:bg-paper">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-2">
              <button onClick={() => setConfirmed(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-2">
                <Check size={16} /> Confirm the cause
              </button>
              <button onClick={() => setDisagree(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-rule px-4 py-2.5 text-sm font-medium text-ink hover:bg-paper">
                <MessageSquareWarning size={15} /> I see it differently
              </button>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-rule bg-card p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">Ruled out</div>
          <ul className="mt-3 space-y-3">
            {ruledOut.map((h) => (
              <li key={h.text} className="text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-ink line-through decoration-muted/40">{h.text}</span>
                  <span className="text-xs tabular-nums text-muted">{h.confidence}%</span>
                </div>
                <p className="mt-0.5 text-body">{h.why}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-rule bg-card p-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted"><History size={13} />Similar past incident</div>
          <p className="mt-2 text-sm text-ink"><span className="font-semibold">{CASE.similar.id}</span> · {CASE.similar.when}</p>
          <p className="mt-1 text-sm leading-relaxed text-body">{CASE.similar.text}</p>
        </section>
      </aside>
    </div>
  )
}

function Section({ title, aside, children }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  )
}
