import { useCallback, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ScrollText } from 'lucide-react'
import { ROLES, FLOW } from '../data/scenario'
import Wordmark from './Wordmark'
import Icon from './Icon'
import AuditTrail, { auditCount } from './AuditTrail'
import { useStory } from '../state/story'

export default function TopBar() {
  const { index } = useStory()
  const [audit, setAudit] = useState(false)
  const close = useCallback(() => setAudit(false), [])

  return (
    <header className="border-b border-rule bg-card">
      <div className="mx-auto flex h-16 max-w-[1360px] items-center gap-6 px-8">
        <Link to="/" aria-label="Flowline home"><Wordmark /></Link>
        <span className="hidden items-center gap-2 rounded-full bg-paper px-3 py-1 text-xs text-body lg:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-green" />
          {FLOW.name} · {FLOW.system}
        </span>

        <nav className="ml-auto flex items-center gap-1 rounded-xl bg-paper p-1" aria-label="Switch role">
          <span className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted">View as</span>
          {ROLES.map((r) => (
            <NavLink key={r.id} to={r.path}
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  isActive ? 'bg-indigo text-white shadow-sm' : 'text-body hover:bg-card hover:text-ink'
                }`}>
              <Icon name={r.icon} size={15} />
              {r.label}
            </NavLink>
          ))}
        </nav>

        <button onClick={() => setAudit(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-rule px-3 py-2 text-sm font-medium text-ink transition hover:bg-paper">
          <ScrollText size={15} /> Audit trail
          <span className="rounded-full bg-indigo-tint px-1.5 text-xs tabular-nums text-indigo">{auditCount(index)}</span>
        </button>
      </div>
      <AuditTrail open={audit} onClose={close} />
    </header>
  )
}
