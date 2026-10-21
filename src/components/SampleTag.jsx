export default function SampleTag({ className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-dashed border-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted ${className}`}>
      Sample data
    </span>
  )
}
