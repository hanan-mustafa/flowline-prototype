import { useState } from 'react'
import { Check, PenLine } from 'lucide-react'
import { KB, PROBLEM } from '../../data/engineer'
import { useStory } from '../../state/story'
import AgentGlyph from '../../components/AgentGlyph'
import Empty from '../../components/Empty'

export default function SignOff() {
  const { index, go } = useStory()
  const [signed, setSigned] = useState({})

  if (index < 6) {
    return (
      <Empty
        title="Drafts arrive after the fix"
        text="Once the incident is closed, the knowledge and problem agents draft what was learned. You check them, so the next occurrence is fixed faster or never happens."
        action={() => go(6)}
        actionLabel="Jump to Sunday 00:20"
      />
    )
  }

  return (
    <div className="grid grid-cols-2 items-start gap-6">
      <Draft agent="knowledge" kind="Knowledge article · draft" title={KB.title} signed={signed.kb} onSign={() => setSigned({ ...signed, kb: true })}
        after="Agents now match this pattern in minutes and propose the same fix.">
        <Field label="Symptoms">{KB.symptoms}</Field>
        <Field label="How to check">{KB.check}</Field>
        <Field label="Fix">{KB.fix}</Field>
        <Field label="Learned from">{KB.learnedFrom}</Field>
      </Draft>

      <Draft agent="problem" kind={`Problem record ${PROBLEM.id} · draft`} title="Why it happened, and how to stop it" signed={signed.prb}
        onSign={() => setSigned({ ...signed, prb: true })} after="The pre-release check goes to the app owner for approval.">
        <Field label="Root cause">{PROBLEM.rootCause}</Field>
        <Field label="Why it was missed">{PROBLEM.whyMissed}</Field>
        <Field label="Actions">
          <ul className="space-y-2">
            {PROBLEM.actions.map((a) => (
              <li key={a.text}>
                <div>{a.text}</div>
                <div className="text-xs text-muted">Owner: {a.owner}</div>
              </li>
            ))}
          </ul>
        </Field>
      </Draft>
    </div>
  )
}

function Draft({ agent, kind, title, signed, onSign, after, children }) {
  return (
    <article className="rounded-2xl border border-rule bg-card">
      <header className="border-b border-rule p-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
          <AgentGlyph id={agent} size={22} />{kind}
        </div>
        <h3 className="mt-2 font-serif text-xl font-semibold leading-snug text-ink">{title}</h3>
      </header>
      <div className="space-y-4 p-6">{children}</div>
      <footer className="border-t border-rule p-4">
        {signed ? (
          <div className="rise-in flex items-center gap-2 text-sm text-green-ink">
            <Check size={16} /><span className="font-semibold">Signed off by you.</span><span className="text-body">{after}</span>
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={onSign} className="flex-1 rounded-lg bg-indigo px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-2">Sign off</button>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-rule px-4 py-2 text-sm text-ink hover:bg-paper"><PenLine size={14} />Edit</button>
          </div>
        )}
      </footer>
    </article>
  )
}

function Field({ label, children }) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-3 text-sm">
      <div className="text-muted">{label}</div>
      <div className="leading-relaxed text-ink">{children}</div>
    </div>
  )
}
