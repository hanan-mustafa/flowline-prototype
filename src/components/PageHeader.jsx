import { NavLink } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function PageHeader({ crumbs = [], title, meta, actions, tabs }) {
  return (
    <div className="border-b border-rule bg-card px-8 pt-5">
      {crumbs.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-muted">
          {crumbs.map((c, i) => (
            <span key={c} className="inline-flex items-center gap-1">{i > 0 && <ChevronRight size={12} />}{c}</span>
          ))}
        </div>
      )}
      <div className="mt-1 flex items-start justify-between gap-6 pb-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-ink">{title}</h1>
          {meta && <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">{meta}</div>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {tabs && (
        <nav className="-mb-px flex gap-1">
          {tabs.map((t) => (
            <NavLink key={t.to} to={t.to} end={t.end}
              className={({ isActive }) => `border-b-2 px-3 py-2 text-sm font-medium transition ${
                isActive ? 'border-indigo text-ink' : 'border-transparent text-muted hover:text-ink'}`}>
              {t.label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  )
}

export function StatusChip({ tone = 'neutral', children }) {
  const tones = {
    good: 'bg-green-tint text-green-ink',
    warn: 'bg-amber-tint text-amber-ink',
    info: 'bg-indigo-tint text-indigo',
    neutral: 'bg-paper text-body border border-rule',
  }
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>
}
