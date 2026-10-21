import { Link } from 'react-router-dom'
import { Bell, CircleHelp, Search } from 'lucide-react'
import { useStory } from '../state/story'

export default function AppHeader({ roleId }) {
  const { moment } = useStory()
  const waiting = moment.awaits?.[roleId]

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-rule bg-card px-8">
      <label className="flex w-96 items-center gap-2 rounded-lg border border-rule bg-paper px-3 py-1.5 text-sm text-muted">
        <Search size={15} />
        <input readOnly placeholder="Search incidents, flows, changes" className="w-full bg-transparent outline-none placeholder:text-muted" />
        <kbd className="rounded border border-rule bg-card px-1.5 text-[11px]">/</kbd>
      </label>
      <div className="ml-auto flex items-center gap-1">
        <Link to={waiting?.to ?? '#'} title={waiting?.label ?? 'No new notifications'}
          className="relative rounded-lg p-2 text-body hover:bg-paper hover:text-ink">
          <Bell size={18} />
          {waiting && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber ring-2 ring-card" />}
        </Link>
        <span className="rounded-lg p-2 text-body"><CircleHelp size={18} /></span>
      </div>
    </header>
  )
}
