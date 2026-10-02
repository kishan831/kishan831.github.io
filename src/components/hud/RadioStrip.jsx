const BARS = [0.35, 0.7, 0.45, 0.9, 0.55]

export default function RadioStrip() {
  return (
    <div
      data-testid="radio"
      aria-hidden="true"
      className="flex items-center gap-2 rounded-full border border-bone/10 bg-ink-950/60 px-3 py-1"
    >
      <span className="font-mono text-[10px] tracking-[0.2em] text-bone/70">KJ-FM 96.7</span>
      <span className="flex items-end gap-[2px]">
        {BARS.map((h, i) => (
          <span
            key={i}
            className="w-[2px] rounded-sm bg-[var(--accent)]"
            style={{ height: `${h * 12}px`, opacity: 0.45 + h * 0.5 }}
          />
        ))}
      </span>
    </div>
  )
}
