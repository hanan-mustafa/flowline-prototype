import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { ArrowRight, Check, GitCompareArrows, Send, Sparkles } from 'lucide-react'
import { FIXES } from '../../data/engineer'
import { useStory } from '../../state/story'
import AgentGlyph from '../../components/AgentGlyph'
import Empty from '../../components/Empty'
import IncidentHeader from './IncidentHeader'

export default function FixOptions() {
  const { index, go } = useStory()
  const { confirmed, setConfirmed } = useOutletContext()
  const [choice, setChoice] = useState('revert')
  const sent = index >= 4

  if (index < 3) {
    return (
      <>
        <IncidentHeader />
        <div className="p-8">
          <Empty icon={GitCompareArrows} title="No remediation options yet"
            text="Options are prepared once the investigation has a probable cause, each with recovery time, risk and rollback."
            skipTo={3} />
        </div>
      </>
    )
  }

  return (
    <>
    <IncidentHeader />
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-2 text-sm text-body">
        <AgentGlyph id="remediation" size={22} />
        2 options · prepared by Remediation agent · Sat 22:40
      </div>

      <div className="grid grid-cols-2 gap-6">
        {FIXES.map((f) => {
          const picked = (sent ? 'revert' : choice) === f.id
          return (
            <button key={f.id} disabled={sent} onClick={() => setChoice(f.id)}
              className={`rounded-xl border bg-card p-6 text-left transition ${picked ? 'border-indigo ring-4 ring-indigo/10' : 'border-rule hover:border-indigo/30'}`}>
              <div className="flex items-center justify-between">
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${picked ? 'border-indigo bg-indigo text-white' : 'border-rule'}`}>
                  {picked && <Check size={12} strokeWidth={3} />}
                </span>
                {f.recommended && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-tint px-2.5 py-1 text-xs font-semibold text-green-ink">
                    <Sparkles size={12} /> Recommended
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-ink">{f.name}</h3>
              <p className="mt-1 text-sm text-body">{f.how}</p>
              <dl className="mt-5 divide-y divide-rule border-t border-rule text-sm">
                {Object.entries(f.rows).map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[140px_1fr] gap-3 py-2.5">
                    <dt className="text-muted">{k}</dt>
                    <dd className="text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </button>
          )
        })}
      </div>

      {sent ? <Tracker index={index} /> : (
        <div className="flex items-center justify-between rounded-xl border border-rule bg-card px-6 py-4">
          <p className="text-sm text-body">
            {confirmed
              ? 'Requires app owner approval (production change, policy level 3). The investigation is attached to the request.'
              : <>The cause is not yet confirmed. Submitting also confirms the cause in the <Link to="/engineer/case" className="font-semibold text-indigo">investigation</Link>.</>}
          </p>
          <button onClick={() => { setConfirmed(true); go(4) }}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-indigo px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-2">
            <Send size={15} /> Submit {choice === 'revert' ? 'revert' : 'patch'} for approval
          </button>
        </div>
      )}
    </div>
    </>
  )
}

function Tracker({ index }) {
  const steps = [
    { label: 'Submitted for approval', at: 'Sat 22:48', done: true },
    { label: 'Approved by app owner', at: 'Sat 23:02', done: index >= 5 },
    { label: 'Executed and verified', at: 'Sun 00:20', done: index >= 6 },
    { label: 'Post-incident review', at: 'Drafts ready', done: index >= 6, link: '/engineer/signoff' },
  ]
  return (
    <section className="rise-in rounded-xl border border-rule bg-card p-6">
      <div className="text-sm font-semibold text-ink">Status</div>
      <ol className="mt-4 grid grid-cols-4 gap-4">
        {steps.map((s) => (
          <li key={s.label} className={`border-t-4 pt-3 ${s.done ? 'border-green' : 'border-rule'}`}>
            <div className={`text-sm font-medium ${s.done ? 'text-ink' : 'text-muted'}`}>{s.label}</div>
            <div className="text-xs text-muted">{s.done ? s.at : 'Pending'}</div>
            {s.done && s.link && (
              <Link to={s.link} className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-indigo">Open <ArrowRight size={12} /></Link>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
