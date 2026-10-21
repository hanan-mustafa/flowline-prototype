import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, CheckCheck, ChevronRight, Hand, Inbox as InboxIcon, PenLine, ShieldCheck, UserRound } from 'lucide-react'
import { BRIEF, NEEDS_YOU, RESOLVED } from '../../data/l1'
import { AGENTS } from '../../data/scenario'
import { useStory } from '../../state/story'
import PageHeader from '../../components/PageHeader'
import AgentGlyph from '../../components/AgentGlyph'
import Empty from '../../components/Empty'
import SampleTag from '../../components/SampleTag'

const ALL_RESOLVED = RESOLVED.flatMap((g) => g.items.map((i) => ({ ...i, flow: g.flow })))
const findItem = (id) => NEEDS_YOU.find((i) => i.id === id) ?? ALL_RESOLVED.find((i) => i.id === id)

export default function L1View() {
  const { index } = useStory()
  const [selected, setSelected] = useState(NEEDS_YOU[0].id)
  const [handled, setHandled] = useState({})
  const handle = (id, label) => setHandled((h) => ({ ...h, [id]: label }))
  const open = NEEDS_YOU.filter((i) => !handled[i.id]).length

  return (
    <>
      <PageHeader
        crumbs={['Queue']}
        title="Queue"
        meta={<span>Finance applications · {BRIEF.window}</span>}
        actions={<SampleTag />}
      />
      <div className="p-8">
      {index < 7 ? (
        <Empty icon={InboxIcon} title="Nothing needs review"
          text="Agents are handling incoming tickets. Items they can't resolve with confidence, and actions above their autonomy level, appear here."
          skipTo={7} />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4">
            <Stat label="Resolved by agents" value={BRIEF.resolved} note="Since Fri 18:00" />
            <Stat label="Needs review" value={open} note="Handed off, approvals, spot checks" warn={open > 0} />
            <Stat label="Avg. agent confidence" value="94%" note="Resolved items" />
            <Stat label="Corrections this week" value="3" note="Of 212 agent replies" />
          </div>

          <div className="mt-6 grid grid-cols-[380px_1fr] items-start gap-6">
            <nav className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-ink">Needs review</span>
                  <span className="text-xs text-muted">{open} open</span>
                </div>
                <div className="space-y-2">
                  {NEEDS_YOU.map((i) => (
                    <QueueRow key={i.id} item={i} active={selected === i.id} done={handled[i.id]} onClick={() => setSelected(i.id)}
                      tag={i.kind} warn />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-green-ink">Resolved by agents</div>
                <div className="space-y-4">
                  {RESOLVED.map((g) => (
                    <div key={g.flow}>
                      <div className="mb-1.5 px-1 text-xs font-medium text-muted">{g.flow}</div>
                      <div className="space-y-2">
                        {g.items.map((i) => (
                          <QueueRow key={i.id} item={i} active={selected === i.id} done={handled[i.id]} onClick={() => setSelected(i.id)}
                            tag={i.count > 1 ? `${i.count} items` : null} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </nav>

            <Detail key={selected} item={findItem(selected)} done={handled[selected]} onHandle={(label) => handle(selected, label)} />
          </div>
        </>
      )}
      </div>
    </>
  )
}

function Stat({ label, value, note, warn }) {
  return (
    <div className="rounded-xl border border-rule bg-card p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className={`mt-1 text-2xl font-semibold tabular-nums ${warn ? 'text-amber-ink' : 'text-ink'}`}>{value}</div>
      <div className="text-xs text-muted">{note}</div>
    </div>
  )
}

function QueueRow({ item, active, done, onClick, tag, warn }) {
  return (
    <button onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
        active ? 'border-indigo bg-card ring-4 ring-indigo/10' : 'border-rule bg-card hover:border-indigo/30'}`}>
      <AgentGlyph id={item.agent} size={30} />
      <div className="min-w-0 flex-1">
        <div className={`truncate text-sm font-medium ${done ? 'text-muted line-through' : 'text-ink'}`}>{item.title}</div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
          {tag && <span className={warn && !done ? 'font-semibold text-amber-ink' : ''}>{tag}</span>}
          <span>{item.confidence}% confident</span>
        </div>
      </div>
      {done ? <Check size={16} className="text-green" /> : <ChevronRight size={16} className="text-muted" />}
    </button>
  )
}

function Detail({ item, done, onHandle }) {
  const agent = AGENTS[item.agent]
  return (
    <article className="rise-in rounded-xl border border-rule bg-card">
      <header className="border-b border-rule p-6">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-indigo-tint px-2.5 py-1 font-semibold text-indigo">{item.kind ?? item.level}</span>
          <span className="text-muted">{item.flow ?? ''}</span>
        </div>
        <h2 className="mt-3 text-lg font-semibold text-ink">{item.title}{item.count > 1 ? ` (${item.count})` : ''}</h2>
        <div className="mt-3 flex items-center gap-3">
          <AgentGlyph id={item.agent} size={26} />
          <span className="text-sm text-body">{agent.name}</span>
          <Confidence value={item.confidence} />
        </div>
      </header>

      <div className="space-y-6 p-6">
        {(item.why || item.summary) && (
          <div className="rounded-xl bg-paper p-4 text-[15px] leading-relaxed text-ink">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">{item.why ? 'Agent note' : 'Summary'}</span>
            <p className="mt-1">{item.why ?? item.summary}</p>
          </div>
        )}

        {item.id === 'exception' && <Exception item={item} done={done} onHandle={onHandle} />}
        {item.id === 'approval' && <LevelTwo item={item} done={done} onHandle={onHandle} />}
        {item.thread && <Review item={item} done={done} onHandle={onHandle} />}
        {!item.thread && !['exception', 'approval'].includes(item.id) && <Simple done={done} onHandle={onHandle} />}
      </div>
    </article>
  )
}

function Confidence({ value }) {
  const low = value < 85
  return (
    <span className="ml-auto inline-flex items-center gap-2 text-xs text-muted">
      Confidence
      <span className="h-1.5 w-24 rounded-full bg-indigo-tint">
        <span className={`block h-1.5 rounded-full ${low ? 'bg-amber' : 'bg-green'}`} style={{ width: `${value}%` }} />
      </span>
      <span className={`font-semibold tabular-nums ${low ? 'text-amber-ink' : 'text-green-ink'}`}>{value}%</span>
    </span>
  )
}

function Exception({ item, done, onHandle }) {
  return (
    <>
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Suggested next steps</div>
        <ol className="space-y-2">
          {item.steps.map((s, i) => (
            <li key={s.text} className="flex items-start gap-3 text-sm">
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                s.checked || done ? 'bg-green text-white' : 'bg-indigo-tint text-indigo'}`}>
                {s.checked || done ? <Check size={12} strokeWidth={3} /> : i + 1}
              </span>
              <span className="text-ink">{s.text}{s.by && <span className="ml-2 text-xs text-muted">{s.by}</span>}</span>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Draft reply</div>
        <textarea rows={4} defaultValue={item.draft} disabled={!!done}
          className="w-full rounded-xl border border-rule bg-paper p-3 text-sm leading-relaxed text-ink outline-none focus:border-indigo disabled:opacity-70" />
      </div>
      {done ? <Done text={done} /> : (
        <div className="flex gap-2">
          <button onClick={() => onHandle('Reply sent with the accepted invoice; ticket closed.')}
            className="flex-1 rounded-lg bg-indigo px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-2">
            Send reply and close
          </button>
          <button onClick={() => onHandle('Assigned to you.')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rule px-4 py-2.5 text-sm text-ink hover:bg-paper">
            <Hand size={14} /> Take over
          </button>
        </div>
      )}
    </>
  )
}

function LevelTwo({ item, done, onHandle }) {
  return (
    <>
      <dl className="divide-y divide-rule rounded-xl border border-rule text-sm">
        {item.facts.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[130px_1fr] gap-3 px-4 py-2.5">
            <dt className="text-muted">{k}</dt><dd className="text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      {done ? <Done text={done} /> : (
        <div className="flex items-center gap-3">
          <button onClick={() => onHandle(item.after)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-2">
            <ShieldCheck size={16} /> Approve the rerun
          </button>
          <button onClick={() => onHandle('Declined. Billing team notified.')}
            className="rounded-lg border border-rule px-4 py-2.5 text-sm text-ink hover:bg-paper">Decline</button>
        </div>
      )}
      {!done && (
        <p className="text-xs text-muted">
          Policy level 2 for this action: agent recommends, a person approves. Approvals count toward the action's track record.
        </p>
      )}
    </>
  )
}

function Review({ item, done, onHandle }) {
  const [editing, setEditing] = useState(false)
  const last = item.thread.filter((t) => t.from === 'agent').at(-1)
  return (
    <>
      <div className="space-y-3">
        {item.thread.map((t, i) => (
          <div key={i} className={`flex gap-3 ${t.from === 'agent' ? 'flex-row-reverse text-right' : ''}`}>
            {t.from === 'agent' ? <AgentGlyph id={item.agent} size={28} /> : (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-paper text-muted"><UserRound size={15} /></span>
            )}
            <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-left text-sm leading-relaxed ${t.from === 'agent' ? 'bg-indigo-tint/70 text-ink' : 'bg-paper text-ink'}`}>
              {t.name && <div className="mb-0.5 text-xs font-semibold text-muted">{t.name}</div>}
              {t.text}
            </div>
          </div>
        ))}
      </div>
      {item.source && <p className="text-xs text-muted">Sources: {item.source}</p>}
      {item.id === 'o2c-tickets' && (
        <p className="text-xs text-muted">
          Linked incident: <span className="font-semibold text-ink">O2C-0187</span>
        </p>
      )}

      {done ? <Done text={done} /> : editing ? (
        <div className="space-y-2">
          <textarea rows={4} defaultValue={last.text}
            className="w-full rounded-xl border border-rule bg-paper p-3 text-sm leading-relaxed text-ink outline-none focus:border-indigo" />
          <div className="flex gap-2">
            <button onClick={() => onHandle('Correction sent. Added to the agent’s feedback set.')}
              className="flex-1 rounded-lg bg-indigo px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-2">Send correction</button>
            <button onClick={() => setEditing(false)} className="rounded-lg border border-rule px-4 py-2 text-sm text-ink hover:bg-paper">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button onClick={() => onHandle('Accepted.')}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-2">
            <CheckCheck size={16} /> Accept
          </button>
          <button onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rule px-4 py-2.5 text-sm text-ink hover:bg-paper">
            <PenLine size={14} /> Edit reply
          </button>
          <button onClick={() => onHandle('Assigned to you. The user has been notified.')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rule px-4 py-2.5 text-sm text-ink hover:bg-paper">
            <Hand size={14} /> Take over
          </button>
        </div>
      )}
    </>
  )
}

function Simple({ done, onHandle }) {
  return done ? <Done text={done} /> : (
    <div className="flex gap-2">
      <button onClick={() => onHandle('Accepted.')}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-2">
        <CheckCheck size={16} /> Accept
      </button>
      <button onClick={() => onHandle('Flagged for review with the agent’s owner.')}
        className="rounded-lg border border-rule px-4 py-2.5 text-sm text-ink hover:bg-paper">Flag</button>
    </div>
  )
}

function Done({ text }) {
  return (
    <div className="rise-in flex items-start gap-2 rounded-xl bg-green-tint/70 p-4 text-sm text-ink">
      <Check size={16} className="mt-0.5 shrink-0 text-green-ink" />{text}
    </div>
  )
}
