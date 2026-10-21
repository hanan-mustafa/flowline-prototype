import { MOMENTS } from '../data/scenario'
import { useStory } from '../state/story'
import { ActorBadge, actorName } from './Timeline'

// Activity feed for the O2C flow, newest first, up to the current scenario time.
export default function Narration() {
  const { index } = useStory()
  const seen = MOMENTS.slice(0, index + 1).reverse()

  return (
    <ol>
      {seen.map((m, i) => (
        <li key={m.id} className={`flex gap-3 rounded-lg p-2.5 ${i === 0 ? 'rise-in bg-indigo-tint/50' : ''}`}>
          <ActorBadge actor={m.actor} size={28} />
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-ink">{actorName(m.actor)}</span>
              <span className="text-xs tabular-nums text-muted">{m.day} {m.time}</span>
            </div>
            <p className="mt-0.5 text-sm leading-relaxed text-body">{m.narration}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
