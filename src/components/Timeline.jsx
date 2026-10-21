import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MOMENTS, AGENTS, roleById } from '../data/scenario'
import { useStory } from '../state/story'
import AgentGlyph from './AgentGlyph'
import Icon from './Icon'

export function ActorBadge({ actor, size = 28 }) {
  if (actor.kind === 'agent') return <AgentGlyph id={actor.id} size={size} />
  if (actor.kind === 'role') {
    return (
      <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-indigo text-white" style={{ width: size, height: size }}
        title={roleById[actor.id].label}>
        <Icon name={roleById[actor.id].icon} size={size * 0.5} />
      </span>
    )
  }
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-indigo-tint text-muted" style={{ width: size, height: size }} title="Change">
      <Icon name="GitCommitHorizontal" size={size * 0.55} />
    </span>
  )
}

export const actorName = (actor) =>
  actor.kind === 'agent' ? AGENTS[actor.id].name : actor.kind === 'role' ? roleById[actor.id].label : 'Change window'

// The story scrubber: steps through the one incident so every view shows that moment.
export default function Timeline() {
  const { index, go, total } = useStory()

  return (
    <div className="border-t border-rule bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1360px] items-center gap-6 px-8 py-4">
        <div className="w-36 shrink-0">
          <div className="eyebrow">Story</div>
          <div className="mt-1 text-sm text-muted">
            Step {index + 1} of {total}
            {index > 0 && <button onClick={() => go(0)} className="ml-2 text-xs font-semibold text-indigo hover:underline">Restart</button>}
          </div>
          <div className="mt-2 flex gap-1.5">
            <button onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous step"
              className="rounded-md border border-rule p-1.5 text-ink hover:bg-indigo-tint disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => go(index + 1)} disabled={index === total - 1} aria-label="Next step"
              className="rounded-md border border-rule bg-indigo p-1.5 text-white hover:bg-indigo-2 disabled:opacity-30">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <ol className="relative grid flex-1" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
          <div className="absolute left-[6.25%] right-[6.25%] top-[13px] h-0.5 bg-rule" />
          <div className="absolute left-[6.25%] top-[13px] h-0.5 bg-indigo transition-all duration-300"
            style={{ width: `${(index / (total - 1)) * 87.5}%` }} />
          {MOMENTS.map((m, i) => {
            const active = i === index
            const past = i < index
            const newDay = i === 0 || MOMENTS[i - 1].day !== m.day
            const human = m.actor.kind === 'role'
            return (
              <li key={m.id} className="relative flex flex-col items-center text-center">
                <button onClick={() => go(i)} aria-label={`${m.day} ${m.time}: ${m.title}`}
                  className={`relative z-10 rounded-full transition ${active ? 'scale-110 ring-4 ring-indigo/15' : past ? '' : 'opacity-60 hover:opacity-100'}`}>
                  <ActorBadge actor={m.actor} size={28} />
                </button>
                <div className={`mt-1.5 text-[11px] tabular-nums ${active ? 'font-semibold text-ink' : 'text-muted'}`}>
                  {newDay ? <span className="font-semibold text-green-ink">{m.day} </span> : null}{m.time}
                </div>
                <div className={`text-xs leading-tight ${active ? 'font-semibold text-ink' : 'text-body'} ${human ? 'underline decoration-indigo/40 decoration-2 underline-offset-2' : ''}`}>
                  {m.title}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
