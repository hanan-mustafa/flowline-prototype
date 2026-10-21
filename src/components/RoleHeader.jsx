import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { roleById } from '../data/scenario'
import { useStory } from '../state/story'
import Icon from './Icon'

export default function RoleHeader({ roleId }) {
  const role = roleById[roleId]
  const { moment } = useStory()
  const yourMove = moment.awaits?.[roleId]

  return (
    <div className="flex items-end justify-between gap-8">
      <div>
        <div className="eyebrow flex items-center gap-2"><Icon name={role.icon} size={14} />{role.label}</div>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-ink">{role.promise}</h1>
        <p className="mt-2 flex items-center gap-2 text-body">
          {role.shiftFrom} <ArrowRight size={15} className="text-muted" /> <span className="font-medium text-indigo">{role.shiftTo}</span>
        </p>
      </div>
      {yourMove && (
        <Link to={yourMove.to} className="rise-in block rounded-xl border border-indigo/20 bg-indigo px-4 py-3 text-sm text-white shadow-sm transition hover:bg-indigo-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-green-soft">Your decision point</div>
          <div className="mt-0.5 flex items-center gap-1.5 font-medium">{yourMove.label}<ArrowRight size={14} /></div>
        </Link>
      )}
    </div>
  )
}
