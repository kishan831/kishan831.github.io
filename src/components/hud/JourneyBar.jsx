export default function JourneyBar({ ratio }) {
  return (
    <div aria-hidden className="flex items-center gap-3">
      <span className="hud-label whitespace-nowrap">A developer&apos;s journey continues</span>
      <span className="h-[2px] w-24 overflow-hidden rounded-full bg-bone/15 sm:w-40">
        <span
          className="block h-full rounded-full transition-[width] duration-700"
          style={{ width: `${Math.round(ratio * 100)}%`, background: 'var(--accent)' }}
        />
      </span>
    </div>
  )
}
