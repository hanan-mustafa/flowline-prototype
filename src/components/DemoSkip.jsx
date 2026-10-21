import { FastForward } from 'lucide-react'
import { useStory } from '../state/story'
import { MOMENTS } from '../data/scenario'

// Prototype-only control: moves the scripted scenario. Styled apart from product UI.
export default function DemoSkip({ to, label }) {
  const { go } = useStory()
  const m = MOMENTS[to]
  return (
    <button onClick={() => go(to)}
      className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-indigo/40 px-3 py-1 text-xs font-medium text-indigo hover:bg-indigo-tint">
      <FastForward size={12} /> Prototype: {label ?? `skip to ${m.day} ${m.time}`}
    </button>
  )
}
