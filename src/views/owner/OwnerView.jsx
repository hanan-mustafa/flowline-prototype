import { NavLink, Outlet } from 'react-router-dom'
import { Map, BadgeCheck, HeartPulse, SlidersHorizontal } from 'lucide-react'
import { useStory } from '../../state/story'
import RoleHeader from '../../components/RoleHeader'

const TABS = [
  { to: '/owner', end: true, label: 'Flow map', icon: Map },
  { to: '/owner/approval', label: 'Approval', icon: BadgeCheck, badge: (i) => i === 4 },
  { to: '/owner/recovery', label: 'Recovery', icon: HeartPulse, badge: (i) => i === 6 },
  { to: '/owner/policy', label: 'Autonomy policy', icon: SlidersHorizontal, badge: (i) => i === 7 },
]

export default function OwnerView() {
  const { index } = useStory()

  return (
    <div className="mx-auto max-w-[1360px] px-8 pt-10">
      <RoleHeader roleId="owner" />

      <nav className="mt-8 flex gap-1 border-b border-rule" aria-label="Application owner screens">
        {TABS.map(({ to, end, label, icon: I, badge }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `relative -mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                isActive ? 'border-indigo text-ink' : 'border-transparent text-muted hover:text-ink'
              }`}>
            <I size={16} />
            {label}
            {badge?.(index) && <span className="h-2 w-2 rounded-full bg-amber" aria-label="needs attention" />}
          </NavLink>
        ))}
      </nav>

      <div className="pt-6">
        <Outlet />
      </div>
    </div>
  )
}
