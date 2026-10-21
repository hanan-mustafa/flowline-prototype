import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { MOMENTS, AGENTS, ROLES, roleById } from '../data/scenario'
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
  actor.kind === 'agent' ? AGENTS[actor.id].name : actor.kind === 'role' ? roleById[actor.id].label : 'Change management'

// Prototype controls, kept visually apart from the product: who you are signed in as,
// and where you are in the scripted TR-4471 scenario.
export default function DemoBar() {
  const { index, go, total, moment } = useStory()

  return (
    <div className="border-t border-black/20 bg-ink text-white">
      <div className="flex items-center gap-6 px-6 py-3">
        <div className="w-[280px] shrink-0">
          <div className="flex items-center gap-2">
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-soft">Prototype</span>
            <span className="text-xs text-white/60">Signed in as</span>
          </div>
          <div className="mt-1.5 flex gap-1 rounded-lg bg-white/5 p-0.5">
            {ROLES.map((r) => (
              <NavLink key={r.id} to={r.path}
                className={({ isActive }) => `flex-1 rounded-md px-2 py-1 text-center text-xs font-medium transition ${
                  isActive ? 'bg-white text-ink' : 'text-white/70 hover:text-white'}`}>
                {r.short}
              </NavLink>
            ))}
          </div>
        </div>

        <ol className="relative grid flex-1" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
          <div className="absolute left-[6.25%] right-[6.25%] top-[11px] h-px bg-white/20" />
          <div className="absolute left-[6.25%] top-[11px] h-px bg-green-soft transition-all duration-300"
            style={{ width: `${(index / (total - 1)) * 87.5}%` }} />
          {MOMENTS.map((m, i) => {
            const active = i === index
            const newDay = i === 0 || MOMENTS[i - 1].day !== m.day
            return (
              <li key={m.id} className="relative flex flex-col items-center text-center">
                <button onClick={() => go(i)} aria-label={`${m.day} ${m.time}: ${m.title}`}
                  className={`relative z-10 h-[22px] w-[22px] rounded-full border-2 transition ${
                    active ? 'border-green-soft bg-green-soft' : i < index ? 'border-green-soft bg-ink' : 'border-white/30 bg-ink hover:border-white/70'}`} />
                <div className={`mt-1 text-[11px] tabular-nums ${active ? 'font-semibold text-white' : 'text-white/55'}`}>
                  {newDay ? `${m.day} ` : ''}{m.time}
                </div>
                <div className={`text-[11px] leading-tight ${active ? 'text-white' : 'text-white/45'}`}>{m.title}</div>
              </li>
            )
          })}
        </ol>

        <div className="flex shrink-0 items-center gap-1.5">
          <button onClick={() => go(0)} aria-label="Restart scenario" title="Restart scenario"
            className="rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white"><RotateCcw size={15} /></button>
          <button onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous step"
            className="rounded-md border border-white/20 p-1.5 hover:bg-white/10 disabled:opacity-30"><ChevronLeft size={16} /></button>
          <button onClick={() => go(index + 1)} disabled={index === total - 1} aria-label="Next step"
            className="rounded-md bg-green px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-green-ink disabled:opacity-30">
            <span className="inline-flex items-center gap-1">Next <ChevronRight size={14} /></span>
          </button>
        </div>
      </div>
      <div className="sr-only" aria-live="polite">{moment.day} {moment.time}: {moment.title}</div>
    </div>
  )
}
