import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ROLES, AGENTS } from '../data/scenario'
import Wordmark from '../components/Wordmark'
import FlowLine from '../components/FlowLine'
import AgentGlyph from '../components/AgentGlyph'
import Icon from '../components/Icon'

const degraded = { einvoice: 'degraded' }

export default function Landing() {
  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-[1200px] px-8 pb-16 pt-12">
        <Wordmark size="lg" />

        <div className="mt-14 grid grid-cols-[1.1fr_1fr] items-end gap-16">
          <div>
            <div className="eyebrow">AI-led application management</div>
            <h1 className="mt-3 font-serif text-[56px] font-semibold leading-[1.05] tracking-tight text-ink">
              Run support around the business flow, not the ticket queue.
            </h1>
            <div className="mt-6 h-1.5 w-24 rounded-full bg-green" />
          </div>
          <p className="text-lg leading-relaxed text-body">
            Agents watch, triage, diagnose and fix. People supervise, decide and govern. This prototype follows one
            incident: on a Saturday night, SAP transport <span className="font-medium text-ink">TR-4471</span> breaks
            e-invoicing in order-to-cash.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-rule bg-card px-8 pb-2 pt-4">
          <FlowLine stages={degraded} impact="Invoices waiting" />
        </div>

        <div className="mt-12 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl font-semibold text-ink">Choose a role</h2>
          <p className="text-sm text-muted">You can switch roles at any point in the story.</p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-5">
          {ROLES.map((r) => (
            <Link key={r.id} to={r.path}
              className="group flex flex-col rounded-2xl border border-rule bg-card p-6 transition hover:-translate-y-0.5 hover:border-indigo/30 hover:shadow-lg hover:shadow-indigo/5">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo text-white">
                <Icon name={r.icon} size={22} />
              </span>
              <div className="mt-4 text-lg font-semibold text-ink">{r.label}</div>
              <p className="mt-1 font-serif text-lg italic leading-snug text-body">“{r.promise}”</p>
              <div className="mt-5 flex-1 border-t border-rule pt-4 text-sm text-body">
                <span className="text-muted line-through decoration-muted/50">{r.shiftFrom}</span>
                <ArrowRight size={14} className="mx-2 inline text-muted" />
                <span className="font-medium text-indigo">{r.shiftTo}</span>
              </div>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo">
                Open the {r.home.toLowerCase()} <ArrowRight size={15} className="transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-rule pt-6">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-1.5">
              {Object.keys(AGENTS).map((id) => <AgentGlyph key={id} id={id} size={28} />)}
            </div>
            <span className="text-sm text-body">Eight specialist agents, each with its own face.</span>
          </div>
          <p className="text-sm text-muted">
            Prototype with a scripted scenario · figures are sample data · service manager and CIO views come next
          </p>
        </div>
      </div>
    </div>
  )
}
