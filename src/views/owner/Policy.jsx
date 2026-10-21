import { useState } from 'react'
import { ArrowUpRight, Check, Lock, Sparkles } from 'lucide-react'
import { LEVELS, POLICY, PROPOSAL } from '../../data/owner'
import { AGENTS } from '../../data/scenario'
import { useStory } from '../../state/story'
import AgentGlyph from '../../components/AgentGlyph'
import SampleTag from '../../components/SampleTag'

export default function Policy() {
  const { index, go } = useStory()
  const [levels, setLevels] = useState(() => POLICY.map((p) => p.level))
  const [proposal, setProposal] = useState(null)
  const setLevel = (i, l) => setLevels((ls) => ls.map((x, j) => (j === i ? l : x)))

  return (
    <div className="space-y-6">
      {index === 7 ? (
        <ProposalCard state={proposal} onDecide={setProposal} />
      ) : (
        <div className="flex items-center justify-between rounded-2xl border border-dashed border-rule bg-card/60 px-6 py-4 text-sm text-body">
          <span>After an incident, the problem and change-risk agents propose ways to stop it happening again. They show up here for you to approve.</span>
          <button onClick={() => go(7)} className="shrink-0 font-semibold text-indigo">Jump to Monday →</button>
        </div>
      )}

      <section className="rounded-2xl border border-rule bg-card">
        <header className="flex items-end justify-between gap-6 border-b border-rule p-6">
          <div>
            <div className="text-sm font-semibold text-ink">What agents may do on order-to-cash</div>
            <p className="mt-1 max-w-2xl text-sm text-body">
              Autonomy is set per action, not per agent. An action moves up only after a clean track record and your sign-off;
              one failure moves it down. Some actions are capped by policy and can never run alone.
            </p>
          </div>
          <SampleTag />
        </header>

        <div className="grid grid-cols-4 gap-px border-b border-rule bg-rule">
          {LEVELS.map((l) => (
            <div key={l.id} className="bg-card px-5 py-3">
              <div className="text-xs font-semibold text-indigo">Level {l.id} · {l.name}</div>
              <div className="text-xs text-muted">{l.text}</div>
            </div>
          ))}
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted">
              <th className="px-6 py-3 font-semibold">Action</th>
              <th className="px-3 py-3 font-semibold">Allowed level</th>
              <th className="px-3 py-3 font-semibold">Track record</th>
              <th className="px-6 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {POLICY.map((p, i) => {
              const changed = levels[i] !== p.level
              return (
                <tr key={p.action} className={changed ? 'bg-indigo-tint/40' : ''}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <AgentGlyph id={p.agent} size={26} />
                      <div>
                        <div className="font-medium text-ink">{p.action}</div>
                        <div className="text-xs text-muted">{AGENTS[p.agent].name}{p.note ? ` · ${p.note}` : ''}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <Dial level={levels[i]} max={p.max} onChange={(l) => setLevel(i, l)} />
                    <div className="mt-1 text-xs text-body">{LEVELS[levels[i] - 1].name}</div>
                  </td>
                  <td className="px-3 py-4 text-body">{p.record}</td>
                  <td className="px-6 py-4 text-right">
                    {changed ? (
                      <span className="text-xs font-medium text-indigo">Changed · logged to the audit trail</span>
                    ) : p.promote ? (
                      <button onClick={() => setLevel(i, p.level + 1)}
                        className="inline-flex items-center gap-1 rounded-full border border-green/50 bg-green-tint px-3 py-1 text-xs font-semibold text-green-ink hover:bg-green-tint/70">
                        <ArrowUpRight size={13} /> Earned: promote to {LEVELS[p.level].name}
                      </button>
                    ) : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

function Dial({ level, max, onChange }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Autonomy level">
      {LEVELS.map((l) => {
        const locked = l.id > max
        const on = l.id <= level
        return (
          <button key={l.id} disabled={locked} onClick={() => onChange(l.id)} role="radio" aria-checked={l.id === level}
            title={locked ? 'Capped by policy' : `Level ${l.id}: ${l.name}`}
            className={`flex h-6 w-9 items-center justify-center rounded transition ${
              locked ? 'cursor-not-allowed bg-[repeating-linear-gradient(135deg,#ecebf5_0_4px,#fdfdfb_4px_8px)] text-muted'
                : on ? 'bg-indigo text-white' : 'bg-indigo-tint text-indigo hover:bg-indigo/20'}`}>
            {locked ? <Lock size={11} /> : <span className="text-[11px] font-semibold">{l.id}</span>}
          </button>
        )
      })}
    </div>
  )
}

function ProposalCard({ state, onDecide }) {
  const p = PROPOSAL
  return (
    <section className="rise-in rounded-2xl border border-indigo/20 bg-card p-6 shadow-lg shadow-indigo/5">
      <div className="flex items-start gap-4">
        <AgentGlyph id={p.agent} size={40} />
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green-ink">
            <Sparkles size={13} /> Proposed by the {AGENTS[p.agent].name.toLowerCase()} · {p.from.toLowerCase()}
          </div>
          <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">{p.title}</h2>
          <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-body">{p.text}</p>
          <p className="mt-2 text-sm font-medium text-indigo">{p.effect}</p>
        </div>
        <div className="w-56 shrink-0">
          {state === 'approved' ? (
            <div className="rise-in rounded-xl bg-green-tint p-4 text-sm text-green-ink">
              <div className="flex items-center gap-1.5 font-semibold"><Check size={15} /> Approved</div>
              <p className="mt-1 text-body">Runs on every matching transport from today.</p>
            </div>
          ) : state === 'later' ? (
            <div className="rise-in rounded-xl bg-paper p-4 text-sm text-body">Saved for the monthly review with the change board.</div>
          ) : (
            <div className="space-y-2">
              <button onClick={() => onDecide('approved')} className="w-full rounded-lg bg-indigo px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-2">
                Approve the check
              </button>
              <button onClick={() => onDecide('later')} className="w-full rounded-lg border border-rule px-4 py-2.5 text-sm font-medium text-ink hover:bg-paper">
                Discuss at change board
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
