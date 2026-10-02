const BARS = [0.35, 0.7, 0.45, 0.9, 0.55]
// Different periods per bar so the EQ never pulses in lockstep.
const PERIODS = [1.1, 0.8, 1.3, 0.9, 1.2]

/**
 * KJ-FM 96.7: the HUD radio toggle. Off by default; ON plays a quiet
 * synthesized pad and turns on menu sounds. The EQ bars move only while the
 * radio is on and ambient motion is allowed, and only via transform (scaleY).
 */
export default function RadioStrip({ on = false, animate = false, onToggle }) {
  const moving = on && animate

  return (
    <button
      type="button"
      data-testid="radio"
      data-radio-toggle=""
      aria-pressed={on}
      aria-label="KJ-FM 96.7 radio"
      title={on ? 'Radio on. Press to turn it off.' : 'Radio off. Press for ambience and menu sounds.'}
      onClick={onToggle}
      className="tap group pointer-events-auto rounded-full px-0.5"
    >
      <span
        className={`flex items-center gap-2 rounded-full border bg-ink-950/60 px-3 py-1.5 transition-colors duration-200 ${
          on ? 'border-[var(--accent)]/50' : 'border-bone/15 group-hover:border-bone/30'
        }`}
      >
        <span className="font-mono text-[10px] tracking-[0.2em] text-bone/70">KJ-FM 96.7</span>
        <span
          data-testid="radio-eq"
          data-eq={moving ? 'on' : 'off'}
          aria-hidden="true"
          className="flex h-3 items-end gap-[2px]"
        >
          {BARS.map((h, i) => (
            <span
              key={i}
              className={moving ? 'eq-bar eq-bar-on' : 'eq-bar'}
              style={{
                '--h': on ? h : h * 0.5,
                opacity: on ? 0.55 + h * 0.45 : 0.4,
                animationDuration: moving ? `${PERIODS[i]}s` : undefined,
                animationDelay: moving ? `${-i * 0.17}s` : undefined,
              }}
            />
          ))}
        </span>
        <span
          data-testid="radio-state"
          className={`w-[2.4em] text-left font-mono text-[10px] tracking-[0.16em] ${
            on ? 'text-bone' : 'text-bone/60'
          }`}
        >
          {on ? 'ON' : 'OFF'}
        </span>
      </span>
    </button>
  )
}
