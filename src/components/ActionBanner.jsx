import { Link, useLocation } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useStory } from '../state/story'

// In-app notice when something waits for the signed-in role elsewhere in the app.
export default function ActionBanner({ roleId }) {
  const { moment } = useStory()
  const { pathname } = useLocation()
  const waiting = moment.awaits?.[roleId]
  if (!waiting || pathname === waiting.to) return null

  return (
    <div className="rise-in flex items-center gap-3 border-b border-amber/30 bg-amber-tint px-8 py-2.5 text-sm">
      <span className="h-2 w-2 rounded-full bg-amber" />
      <span className="flex-1 font-medium text-amber-ink">{waiting.label}</span>
      <Link to={waiting.to} className="inline-flex items-center gap-1 font-semibold text-indigo">Review <ArrowRight size={14} /></Link>
    </div>
  )
}
