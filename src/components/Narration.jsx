import { MOMENTS } from '../data/scenario'
import { useStory } from '../state/story'
import { ActorBadge, actorName } from './Timeline'

// What happened so far, told in plain language by whoever did it.
export default function Narration() {
  const { index, go } = useStory()
  const seen = MOMENTS.slice(0, index + 1).reverse()

  return (
    <ol className="space-y-1">
      {seen.map((m, i) => {
        const latest = i === 0
        return (
          <li key={m.id} className={latest ? 'rise-in' : ''}>
            <button onClick={() => go(MOMENTS.indexOf(m))}
              className={`flex w-full gap-3 rounded-xl p-3 text-left transition ${latest ? 'bg-indigo-tint/60' : 'hover:bg-paper'}`}>
              <ActorBadge actor={m.actor} size={30} />
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-ink">{actorName(m.actor)}</span>
                  <span className="text-xs tabular-nums text-muted">{m.day} {m.time}</span>
                </div>
                <p className={`mt-0.5 text-sm leading-relaxed ${latest ? 'text-ink' : 'text-body'}`}>{m.narration}</p>
              </div>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
