import DemoSkip from './DemoSkip'

export default function Empty({ icon: I, title, text, skipTo, skipLabel }) {
  return (
    <div className="rounded-xl border border-rule bg-card px-8 py-12 text-center">
      {I && <I size={28} className="mx-auto text-muted/70" />}
      <div className="mt-3 text-base font-semibold text-ink">{title}</div>
      <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-body">{text}</p>
      {skipTo != null && <div className="mt-5"><DemoSkip to={skipTo} label={skipLabel} /></div>}
    </div>
  )
}
