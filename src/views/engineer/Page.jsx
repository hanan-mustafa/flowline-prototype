import { Link } from 'react-router-dom'
import { ArrowRight, Check, X } from 'lucide-react'
import { INCIDENT, PAGE } from '../../data/engineer'
import { useStory } from '../../state/story'
import AgentGlyph from '../../components/AgentGlyph'
import Empty from '../../components/Empty'
import Wordmark from '../../components/Wordmark'

const SKIPPED = ['Searching logs across five tools', 'Joining a bridge call to find out what changed', 'Working out which users are affected']

export default function Page() {
  const { index, go } = useStory()

  if (index < 3) {
    return (
      <Empty
        title="No page so far tonight"
        text="Agents are handling detection and triage. An engineer is only paged when a decision needs one, and the page arrives with the diagnosis already done."
        action={() => go(3)}
        actionLabel="Jump to the page at 22:31"
      />
    )
  }

  return (
    <div className="grid grid-cols-[380px_1fr] items-start gap-10">
      <div className="mx-auto w-[340px] rounded-[44px] bg-ink p-3 shadow-2xl shadow-indigo/20">
        <div className="rounded-[34px] bg-gradient-to-b from-indigo-2 to-indigo px-4 pb-10 pt-6">
          <div className="text-center text-white/90">
            <div className="text-sm">Saturday</div>
            <div className="font-serif text-6xl font-semibold">22:31</div>
          </div>
          <div className="rise-in mt-8 rounded-2xl bg-white/95 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="scale-75 origin-left"><Wordmark /></span>
              <span className="text-[11px] text-muted">now</span>
            </div>
            <div className="mt-1 text-sm font-semibold text-ink">{INCIDENT.priority} · {INCIDENT.id}</div>
            <div className="mt-0.5 text-sm text-ink">{PAGE.line}</div>
            <div className="mt-1 text-sm text-body">{PAGE.cause}</div>
            <Link to="/engineer/case" className="mt-3 block rounded-lg bg-indigo py-2 text-center text-sm font-semibold text-white">
              Open case file
            </Link>
          </div>
          <div className="mt-3 rounded-2xl bg-white/15 p-3 text-xs text-white/80">
            One page for the whole incident. Not 43 alerts.
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="eyebrow">The page, in one line</div>
          <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-ink">
            Which flow, which stage, what it costs, and the probable cause.
          </h2>
        </div>

        <section className="rounded-2xl border border-rule bg-card p-6">
          <div className="text-sm font-semibold text-ink">Already done before you were paged</div>
          <ul className="mt-4 space-y-3">
            {PAGE.done.map((d) => (
              <li key={d.text} className="flex items-center gap-3 text-sm text-ink">
                <AgentGlyph id={d.agent} size={28} />
                <span className="flex-1">{d.text}</span>
                <Check size={16} className="text-green" />
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-rule pt-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">What you no longer do at night</div>
            <ul className="mt-2 flex flex-wrap gap-2">
              {SKIPPED.map((s) => (
                <li key={s} className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1 text-sm text-muted line-through decoration-muted/40">
                  <X size={13} />{s}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {index >= 4 ? (
          <div className="rounded-xl bg-green-tint/70 px-5 py-4 text-sm text-ink">
            <span className="font-semibold">You confirmed the cause at 22:48</span> and backed the revert. It went to the app owner for approval.{' '}
            <Link to="/engineer/fix" className="font-semibold text-indigo">See where it is →</Link>
          </div>
        ) : (
          <Link to="/engineer/case" className="inline-flex items-center gap-2 rounded-lg bg-indigo px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-2">
            Open the case file <ArrowRight size={15} />
          </Link>
        )}
      </div>
    </div>
  )
}
