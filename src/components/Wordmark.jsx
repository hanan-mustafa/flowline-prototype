export default function Wordmark({ size = 'md' }) {
  const big = size === 'lg'
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={big ? 40 : 28} height={big ? 40 : 28} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#2b2370" />
        <path d="M5 19 C11 19 12 12 16 12 S21 19 27 19" stroke="#5db33a" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
      <span className={`font-serif font-semibold tracking-tight text-ink ${big ? 'text-4xl' : 'text-xl'}`}>Flowline</span>
    </span>
  )
}
