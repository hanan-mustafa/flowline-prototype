import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { ArrowRight, Check, FileSearch, History, MessageSquareWarning } from 'lucide-react'
import { CASE } from '../../data/engineer'
import IncidentHeader from './IncidentHeader'
import { useStory } from '../../state/story'
import AgentGlyph from '../../components/AgentGlyph'
import Empty from '../../components/Empty'
import SampleTag from '../../components/SampleTag'

export default function CaseFile() {
  const { index } = useStory()
  const { confirmed, setConfirmed } = useOutletContext()
  const [disagree, setDisagree] = useState(false)
  const done = confirmed || index >= 4

  if (index < 3) {
    return (
      <>
        <IncidentHeader />
        <div className="p-8">
          <Empty icon={FileSearch} title="Investigation in progress"
            text="Investigation agent is collecting the timeline, recent changes, logs and similar incidents. Read-only access."
            skipTo={3} />
        </div>
      </>
    )
  }

  const top = CASE.hypotheses[0]
  const ruledOut = CASE.hypotheses.slice(1)

  return (
    <>
    <IncidentHeader />
    <div className="grid grid-cols-[1fr_360px] items-start gap-6 p-8">
      <article className="rounded-xl border border-rule bg-card">
        <header className="border-b border-rule p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">Summary</div>
          <p className="mt-2 text-sm leading-relaxed text-ink">{CASE.summary}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted">
            <AgentGlyph id="investigation" size={20} /> Investigation agent · Sat 22:31 · Sources: SAP, change log, monitoring, incident history
          </div>
        </header>

        <div className="space-y-7 p-6">
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

          <Section title="Change TR-4471 · diff">
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
            <p className="mt-2 text-sm text-muted">Showing 3 of {CASE.idocTotal}. All failures have the same error and use the changed mapping.</p>
          </Section>
        </div>
      </article>

      <aside className="space-y-4">
        <section className="rounded-xl border border-indigo/20 bg-card p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">Probable cause</div>
          <p className="mt-2 text-base font-semibold leading-snug text-ink">{top.text}</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 flex-1 rounded-full bg-indigo-tint">
              <div className="h-2 rounded-full bg-indigo" style={{ width: `${top.confidence}%` }} />
            </div>
            <span className="text-sm font-semibold tabular-nums text-indigo">{top.confidence}%</span>
          </div>

          {done ? (
            <div className="rise-in mt-5 rounded-xl bg-green-tint/70 p-4 text-sm">
              <div className="flex items-center gap-1.5 font-semibold text-green-ink"><Check size={15} />Confirmed by you</div>
              <Link to="/engineer/fix" className="mt-2 inline-flex items-center gap-1 font-semibold text-indigo">
                Go to remediation <ArrowRight size={14} />
              </Link>
            </div>
          ) : disagree ? (
            <div className="mt-5 space-y-2">
              <textarea rows={3} defaultValue="Check whether the tax portal changed its schema today."
                className="w-full rounded-lg border border-rule bg-paper p-2.5 text-sm text-ink outline-none focus:border-indigo" />
              <p className="text-xs text-muted">Investigation agent will re-run with your input and update the findings.</p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmed(true)} className="flex-1 rounded-lg bg-indigo px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-2">Submit</button>
                <button onClick={() => setDisagree(false)} className="rounded-lg border border-rule px-3 py-2 text-sm text-ink hover:bg-paper">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-2">
              <button onClick={() => setConfirmed(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-2">
                <Check size={16} /> Confirm cause
              </button>
              <button onClick={() => setDisagree(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-rule px-4 py-2.5 text-sm font-medium text-ink hover:bg-paper">
                <MessageSquareWarning size={15} /> Dispute
              </button>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-rule bg-card p-6">
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

        <section className="rounded-xl border border-rule bg-card p-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted"><History size={13} />Similar incident</div>
          <p className="mt-2 text-sm text-ink"><span className="font-semibold">{CASE.similar.id}</span> · {CASE.similar.when}</p>
          <p className="mt-1 text-sm leading-relaxed text-body">{CASE.similar.text}</p>
        </section>
      </aside>
    </div>
    </>
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
