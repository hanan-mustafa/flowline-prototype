import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronsUpDown, ScrollText, Settings, BarChart3 } from 'lucide-react'
import { WORKSPACE } from '../data/scenario'
import { useStory } from '../state/story'
import Wordmark from './Wordmark'
import Icon from './Icon'

const FLOWS = [
  { name: 'Order to cash', live: true },
  { name: 'Procure to pay' },
  { name: 'Record to report' },
]

export default function Sidebar({ role, onAudit }) {
  const { index, moment } = useStory()
  const { pathname } = useLocation()
  const o2cBad = Object.values(moment.stages).includes('degraded')

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-rule bg-card">
      <div className="px-5 pb-3 pt-4">
        <Link to="/" aria-label="Flowline sign-in"><Wordmark /></Link>
      </div>
      <button className="mx-3 flex items-center gap-2 rounded-lg border border-rule px-3 py-2 text-left hover:bg-paper">
        <span className="flex h-6 w-6 items-center justify-center rounded bg-indigo-tint text-[11px] font-bold text-indigo">C</span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs text-muted">{WORKSPACE.org}</span>
          <span className="block truncate text-sm font-medium text-ink">{WORKSPACE.name}</span>
        </span>
        <ChevronsUpDown size={14} className="text-muted" />
      </button>

      <nav className="mt-4 space-y-0.5 px-3">
        {role.nav.map((n) => {
          const count = n.badge?.(index) ?? 0
          const forced = n.match?.some((m) => pathname.startsWith(m))
          return (
            <NavLink key={n.label} to={n.to} end={n.end}
              className={({ isActive }) => `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive || forced ? 'bg-indigo-tint text-indigo' : 'text-body hover:bg-paper hover:text-ink'}`}>
              <Icon name={n.icon} size={16} />
              <span className="flex-1">{n.label}</span>
              {count > 0 && <span className="rounded-full bg-amber px-1.5 text-[11px] font-semibold text-white">{count}</span>}
            </NavLink>
          )
        })}
        <span className="flex cursor-default items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted/60">
          <BarChart3 size={16} /> Reports
        </span>
      </nav>

      {role.id === 'owner' && (
        <div className="mt-6 px-3">
          <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted">Your flows</div>
          {FLOWS.map((f) => {
            const bad = f.live && o2cBad
            return (
              <div key={f.name} className="flex items-center gap-2.5 px-3 py-1.5 text-sm text-body">
                <span className={`h-2 w-2 rounded-full ${bad ? 'bg-amber' : 'bg-green'}`} />{f.name}
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-auto space-y-0.5 px-3 pb-3">
        <button onClick={onAudit} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-body hover:bg-paper hover:text-ink">
          <ScrollText size={16} /> Audit log
        </button>
        <span className="flex cursor-default items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted/60">
          <Settings size={16} /> Settings
        </span>
        <div className="mt-2 flex items-center gap-2.5 border-t border-rule px-2 pt-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo text-xs font-semibold text-white">{role.user.initials}</span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-ink">{role.label}</span>
            <span className="block truncate text-xs text-muted">{role.user.title}</span>
          </span>
        </div>
      </div>
    </aside>
  )
}
