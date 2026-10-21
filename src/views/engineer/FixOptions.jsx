import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { ArrowRight, Check, Send, Sparkles } from 'lucide-react'
import { FIXES } from '../../data/engineer'
import { useStory } from '../../state/story'
import AgentGlyph from '../../components/AgentGlyph'
import Empty from '../../components/Empty'

export default function FixOptions() {
  const { index, go } = useStory()
  const { confirmed, setConfirmed } = useOutletContext()
  const [choice, setChoice] = useState('revert')
  const sent = index >= 4

  if (index < 3) {
    return (
      <Empty
        title="No fix options yet"
        text="Once the cause is clear, the remediation agent drafts the ways to fix it, with time, risk and rollback for each."
        action={() => go(3)}
        actionLabel="Jump to 22:31"
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-sm text-body">
        <AgentGlyph id="remediation" size={28} />
        The remediation agent drafted two ways to fix it. It recommends the revert; the choice is yours.
      </div>

      <div className="grid grid-cols-2 gap-6">
        {FIXES.map((f) => {
          const picked = (sent ? 'revert' : choice) === f.id
          return (
            <button key={f.id} disabled={sent} onClick={() => setChoice(f.id)}
              className={`rounded-2xl border bg-card p-6 text-left transition ${picked ? 'border-indigo ring-4 ring-indigo/10' : 'border-rule hover:border-indigo/30'}`}>
              <div className="flex items-center justify-between">
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${picked ? 'border-indigo bg-indigo text-white' : 'border-rule'}`}>
                  {picked && <Check size={12} strokeWidth={3} />}
                </span>
                {f.recommended && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-tint px-2.5 py-1 text-xs font-semibold text-green-ink">
                    <Sparkles size={12} /> Agent recommends
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-serif text-2xl font-semibold text-ink">{f.name}</h3>
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
        <div className="flex items-center justify-between rounded-2xl border border-rule bg-card px-6 py-4">
          <p className="text-sm text-body">
            {confirmed
              ? 'A production change is level 3, so your choice goes to the app owner with the case file attached.'
              : <>Confirm the cause in the <Link to="/engineer/case" className="font-semibold text-indigo">case file</Link> first, or back the fix now to confirm both.</>}
          </p>
          <button onClick={() => { setConfirmed(true); go(4) }}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-indigo px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-2">
            <Send size={15} /> Back {choice === 'revert' ? 'the revert' : 'the patch'} and send to the app owner
          </button>
        </div>
      )}
    </div>
  )
}

function Tracker({ index }) {
  const steps = [
    { label: 'You backed the revert', at: 'Sat 22:48', done: true },
    { label: 'App owner approved', at: 'Sat 23:02', done: index >= 5, link: '/owner/approval' },
    { label: 'Reverted and verified', at: 'Sun 00:20', done: index >= 6, link: '/owner/recovery' },
    { label: 'Knowledge and problem records to sign off', at: 'Mon', done: index >= 7, link: '/engineer/signoff' },
  ]
  return (
    <section className="rise-in rounded-2xl border border-rule bg-card p-6">
      <div className="text-sm font-semibold text-ink">Where your decision went</div>
      <ol className="mt-4 grid grid-cols-4 gap-4">
        {steps.map((s) => (
          <li key={s.label} className={`border-t-4 pt-3 ${s.done ? 'border-green' : 'border-rule'}`}>
            <div className={`text-sm font-medium ${s.done ? 'text-ink' : 'text-muted'}`}>{s.label}</div>
            <div className="text-xs text-muted">{s.done ? s.at : 'Waiting'}</div>
            {s.done && s.link && (
              <Link to={s.link} className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-indigo">Open <ArrowRight size={12} /></Link>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
