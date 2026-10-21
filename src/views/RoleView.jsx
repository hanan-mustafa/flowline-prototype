import { Hammer } from 'lucide-react'
import { roleById } from '../data/scenario'
import RoleHeader from '../components/RoleHeader'
import FlowCard from '../components/FlowCard'
import Narration from '../components/Narration'

// Placeholder for a role whose screens arrive in a later build step.
export default function RoleView({ roleId }) {
  const role = roleById[roleId]

  return (
    <div className="mx-auto max-w-[1360px] px-8 pt-10">
      <RoleHeader roleId={roleId} />
      <div className="mt-8"><FlowCard /></div>

      <div className="mt-6 grid grid-cols-[1.25fr_1fr] gap-6">
        <section className="rounded-2xl border border-dashed border-rule bg-card/60 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-ink">Coming in this view</div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-tint px-2.5 py-1 text-xs font-medium text-indigo">
              <Hammer size={12} /> Build step {role.buildStep}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {role.screens.map((s, i) => (
              <div key={s.title} className="rounded-xl border border-rule bg-card p-4">
                <div className="text-xs font-semibold tabular-nums text-green-ink">0{i + 1}</div>
                <div className="mt-1 font-medium text-ink">{s.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-body">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-rule bg-card p-4">
          <div className="px-2 pb-2 pt-1 text-sm font-semibold text-ink">What happened so far</div>
          <Narration />
        </section>
      </div>
    </div>
  )
}
