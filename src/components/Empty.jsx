import { ArrowRight } from 'lucide-react'

export default function Empty({ title, text, action, actionLabel }) {
  return (
    <div className="rounded-2xl border border-dashed border-rule bg-card/60 px-8 py-14 text-center">
      <div className="font-serif text-2xl font-semibold text-ink">{title}</div>
      <p className="mx-auto mt-2 max-w-xl text-[15px] leading-relaxed text-body">{text}</p>
      {action && (
        <button onClick={action} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-2">
          {actionLabel} <ArrowRight size={15} />
        </button>
      )}
    </div>
  )
}
