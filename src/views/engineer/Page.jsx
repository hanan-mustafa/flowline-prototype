import { Link } from 'react-router-dom'
import { ArrowRight, BellRing, Check } from 'lucide-react'
import { INCIDENT, PAGE } from '../../data/engineer'
import { useStory } from '../../state/story'
import AgentGlyph from '../../components/AgentGlyph'
import PageHeader, { StatusChip } from '../../components/PageHeader'
import Empty from '../../components/Empty'

const RECENT = [
  { at: 'Tue 14 Oct 03:12', id: 'P2P-0093', title: 'Supplier invoice interface backlog', pri: 'P2', outcome: 'Resolved · 41 min' },
  { at: 'Sat 4 Oct 23:40', id: 'R2R-0031', title: 'Period-close job failed on lock', pri: 'P2', outcome: 'Resolved · 18 min' },
]

export default function Page() {
  const { index } = useStory()
  const active = index >= 3

  return (
    <>
      <PageHeader
        crumbs={['On-call']}
        title="On-call"
        meta={<><StatusChip tone="info">On call</StatusChip><span>Finance SAP rotation · Fri 18:00 – Mon 08:00</span></>}
      />
      <div className="space-y-6 p-8">
        {!active ? (
          <Empty icon={BellRing} title="No active pages"
            text="You're paged only when an incident needs an engineer's decision. Detection, triage and investigation run before the page is sent."
            skipTo={3} />
        ) : (
          <section className="rise-in rounded-xl border border-rule bg-card">
            <header className="flex items-center justify-between border-b border-rule px-5 py-3">
              <div className="flex items-center gap-2 text-sm">
                <BellRing size={16} className="text-amber" />
                <span className="font-semibold text-ink">Page</span>
                <span className="text-muted">{PAGE.at}</span>
              </div>
              {index >= 4
                ? <StatusChip tone="good">Acknowledged · 22:33</StatusChip>
                : <StatusChip tone="warn">Awaiting acknowledgement</StatusChip>}
            </header>
            <div className="grid grid-cols-[1fr_380px] divide-x divide-rule">
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <StatusChip tone="warn">{INCIDENT.priority}</StatusChip>
                  <span className="text-sm font-semibold text-ink">{INCIDENT.id}</span>
                </div>
                <h2 className="mt-2 text-lg font-semibold text-ink">{INCIDENT.title}</h2>
                <dl className="mt-3 space-y-1.5 text-sm">
                  <Row k="Impact">{PAGE.line}</Row>
                  <Row k="Probable cause">{PAGE.cause}</Row>
                  <Row k="Why paged">A production change is the likely fix and needs an engineer's confirmation</Row>
                </dl>
                <Link to="/engineer/case"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-2">
                  {index >= 4 ? 'Open incident' : 'Acknowledge and open incident'} <ArrowRight size={15} />
                </Link>
              </div>
              <div className="p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted">Completed before paging</div>
                <ul className="mt-3 space-y-2.5">
                  {PAGE.done.map((d) => (
                    <li key={d.text} className="flex items-start gap-2.5 text-sm text-ink">
                      <AgentGlyph id={d.agent} size={22} />
                      <span className="flex-1 leading-snug">{d.text}</span>
                      <Check size={15} className="mt-0.5 text-green" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-xl border border-rule bg-card">
          <div className="px-5 py-3 text-sm font-semibold text-ink">Recent pages</div>
          <table className="w-full text-sm">
            <thead className="border-y border-rule bg-paper text-left text-xs text-muted">
              <tr><th className="px-5 py-2 font-medium">Time</th><th className="px-3 py-2 font-medium">Incident</th><th className="px-3 py-2 font-medium">Priority</th><th className="px-5 py-2 font-medium">Outcome</th></tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {RECENT.map((r) => (
                <tr key={r.id}>
                  <td className="px-5 py-2.5 tabular-nums text-body">{r.at}</td>
                  <td className="px-3 py-2.5 text-ink"><span className="font-medium">{r.id}</span> · {r.title}</td>
                  <td className="px-3 py-2.5 text-body">{r.pri}</td>
                  <td className="px-5 py-2.5 text-body">{r.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  )
}

function Row({ k, children }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-2">
      <dt className="text-muted">{k}</dt><dd className="text-ink">{children}</dd>
    </div>
  )
}
