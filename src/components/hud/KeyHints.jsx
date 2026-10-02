const KEYS = [
  ['Ent', 'Select'],
  ['↑↓', 'Navigate'],
  ['Esc', 'Start'],
]

export default function KeyHints() {
  return (
    <div aria-hidden className="hidden items-center gap-4 sm:flex">
      {KEYS.map(([key, label]) => (
        <span key={key} className="flex items-center gap-1.5">
          <kbd className="rounded border border-bone/20 bg-ink-950/70 px-1.5 py-0.5 font-mono text-[10px] text-bone/80">
            {key}
          </kbd>
          <span className="hud-label">{label}</span>
        </span>
      ))}
    </div>
  )
}
