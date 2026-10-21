import { NavLink, Outlet } from 'react-router-dom'
import { useStory } from '../state/story'
import RoleHeader from './RoleHeader'

// Header plus a tab row for one role. A tab's badge lights up at the story
// moments where that screen has something new for the role.
export default function RoleTabs({ roleId, tabs, context }) {
  const { index } = useStory()

  return (
    <div className="mx-auto max-w-[1360px] px-8 pt-10">
      <RoleHeader roleId={roleId} />

      <nav className="mt-8 flex gap-1 border-b border-rule" aria-label="Screens">
        {tabs.map(({ to, end, label, icon: I, badge }) => (
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
        <Outlet context={context} />
      </div>
    </div>
  )
}
