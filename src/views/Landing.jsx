import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { ROLES, WORKSPACE } from '../data/scenario'
import Wordmark from '../components/Wordmark'
import Icon from '../components/Icon'

// Entry screen styled as the product's sign-in. In the prototype, picking a role signs you in as that user.
export default function Landing() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center"><Wordmark size="lg" /></div>

        <div className="mt-8 rounded-xl border border-rule bg-card p-6 shadow-sm">
          <div className="text-center">
            <h1 className="text-lg font-semibold text-ink">Sign in to {WORKSPACE.org}</h1>
            <p className="mt-1 text-sm text-muted">{WORKSPACE.name}</p>
          </div>

          <div className="mt-6 space-y-2">
            {ROLES.map((r) => (
              <Link key={r.id} to={r.path}
                className="group flex items-center gap-3 rounded-lg border border-rule p-3 transition hover:border-indigo/40 hover:bg-indigo-tint/40">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-tint text-indigo">
                  <Icon name={r.icon} size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-ink">Continue as {r.label}</span>
                  <span className="block text-xs text-muted">{r.desc}</span>
                </span>
                <ChevronRight size={16} className="text-muted transition group-hover:translate-x-0.5 group-hover:text-indigo" />
              </Link>
            ))}
          </div>

          <div className="mt-6 border-t border-rule pt-4 text-center text-xs text-muted">Single sign-on with your organisation account</div>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted">
          Prototype. The scenario and figures are illustrative sample data.
          <br />Use the bar at the bottom of each screen to switch role or move through the scenario.
        </p>
      </div>
    </div>
  )
}
