import { useState } from 'react'
import { Check, FileCheck2, PenLine } from 'lucide-react'
import { KB, PROBLEM } from '../../data/engineer'
import { useStory } from '../../state/story'
import AgentGlyph from '../../components/AgentGlyph'
import Empty from '../../components/Empty'
import IncidentHeader from './IncidentHeader'

export default function SignOff() {
  const { index } = useStory()
  const [signed, setSigned] = useState({})

  if (index < 6) {
    return (
      <>
        <IncidentHeader />
        <div className="p-8">
          <Empty icon={FileCheck2} title="No drafts yet"
            text="After the incident is resolved, the knowledge article and problem record are drafted here for your review."
            skipTo={6} />
        </div>
      </>
    )
  }

  return (
    <>
    <IncidentHeader />
    <div className="grid grid-cols-2 items-start gap-6 p-8">
      <Draft agent="knowledge" kind="Knowledge article · Draft" title={KB.title} signed={signed.kb} onSign={() => setSigned({ ...signed, kb: true })}
        after="Published to the knowledge base.">
        <Field label="Symptoms">{KB.symptoms}</Field>
        <Field label="How to check">{KB.check}</Field>
        <Field label="Fix">{KB.fix}</Field>
        <Field label="Learned from">{KB.learnedFrom}</Field>
      </Draft>

      <Draft agent="problem" kind={`Problem record ${PROBLEM.id} · Draft`} title="Incorrect buyer tax ID mapping in TR-4471" signed={signed.prb}
        onSign={() => setSigned({ ...signed, prb: true })} after="Actions assigned; pre-release check sent to the app owner.">
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
    </>
  )
}

function Draft({ agent, kind, title, signed, onSign, after, children }) {
  return (
    <article className="rounded-xl border border-rule bg-card">
      <header className="border-b border-rule p-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
          <AgentGlyph id={agent} size={22} />{kind}
        </div>
        <h3 className="mt-2 text-base font-semibold leading-snug text-ink">{title}</h3>
      </header>
      <div className="space-y-4 p-6">{children}</div>
      <footer className="border-t border-rule p-4">
        {signed ? (
          <div className="rise-in flex items-center gap-2 text-sm text-green-ink">
            <Check size={16} /><span className="font-semibold">Approved.</span><span className="text-body">{after}</span>
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={onSign} className="flex-1 rounded-lg bg-indigo px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-2">Approve</button>
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
