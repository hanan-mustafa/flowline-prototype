import { useEffect } from 'react'
import { X, Lock } from 'lucide-react'
import { AUDIT } from '../data/audit'
import { useStory } from '../state/story'
import { ActorBadge, actorName } from './Timeline'

const TAGS = {
  decision: 'bg-indigo text-white',
  approval: 'bg-amber-tint text-amber-ink',
  rollback: 'bg-green-tint text-green-ink',
}
const TAG_TEXT = { decision: 'Human decision', approval: 'Approval', rollback: 'Rollback ready' }

export const auditCount = (index) => AUDIT.filter((a) => a.m <= index).length

export default function AuditTrail({ open, onClose }) {
  const { index } = useStory()
  const rows = AUDIT.filter((a) => a.m <= index)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-ink/20" onClick={onClose}>
      <aside className="rise-in flex h-full w-[480px] flex-col bg-card shadow-2xl" onClick={(e) => e.stopPropagation()} aria-label="Audit trail">
        <header className="flex items-start justify-between border-b border-rule p-6">
          <div>
            <div className="eyebrow">Audit trail</div>
            <div className="mt-1 font-serif text-2xl font-semibold text-ink">Incident O2C-0187</div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted"><Lock size={12} />Append-only · every action with its policy level, approver and rollback</div>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1.5 text-muted hover:bg-paper hover:text-ink"><X size={18} /></button>
        </header>
        <ol className="flex-1 space-y-1 overflow-y-auto p-4">
          {rows.map((r, i) => (
            <li key={i} className="flex gap-3 rounded-xl p-3 hover:bg-paper">
              <ActorBadge actor={r.actor} size={28} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-ink">{actorName(r.actor)}</span>
                  <span className="shrink-0 text-xs tabular-nums text-muted">{r.at}</span>
                </div>
                <p className="text-sm text-ink">{r.text}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                  {r.tag && <span className={`rounded px-1.5 py-0.5 font-semibold ${TAGS[r.tag]}`}>{TAG_TEXT[r.tag]}</span>}
                  {r.meta}
                </div>
              </div>
            </li>
          ))}
        </ol>
        <footer className="border-t border-rule px-6 py-3 text-xs text-muted">
          Showing entries up to the current story step. Use the timeline to see more.
        </footer>
      </aside>
    </div>
  )
}
