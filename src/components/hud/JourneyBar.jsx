export default function JourneyBar({ ratio }) {
  return (
    <div aria-hidden className="flex items-center gap-3">
      <span className="hud-label whitespace-nowrap">A developer&apos;s journey continues</span>
      <span className="h-[2px] w-24 overflow-hidden rounded-full bg-bone/15 sm:w-40">
        <span
          className="block h-full w-full origin-left rounded-full transition-transform duration-700"
          style={{ transform: `scaleX(${ratio})`, background: 'var(--accent)' }}
        />
      </span>
    </div>
  )
}
