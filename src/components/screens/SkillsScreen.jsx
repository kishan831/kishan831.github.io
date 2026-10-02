import { capabilities } from '../../data/portfolio'

const SEGMENTS = 12

export default function SkillsScreen() {
  return (
    <div className="max-w-xl">
      <h1 className="font-display mb-1 text-[var(--fs-screen)] uppercase italic leading-none text-bone">
        Skills
      </h1>
      <p className="script-sub mb-6 text-[clamp(1rem,0.9rem+0.8vw,1.6rem)]">Unlocked</p>

      <ul className="space-y-3.5">
        {capabilities.map((cap) => {
          const filled = Math.round(cap.fill * SEGMENTS)
          return (
            <li key={cap.label}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-bone">
                  {cap.label}
                </span>
                <span
                  data-testid="capability-unit"
                  className="font-mono text-[10px] tracking-[0.12em] text-[var(--accent-hi)]"
                >
                  {cap.unit}
                </span>
              </div>
              <span
                role="img"
                aria-label={`${cap.label}: ${cap.unit}`}
                className="flex gap-[3px]"
              >
                {Array.from({ length: SEGMENTS }, (_, i) => (
                  <span
                    key={i}
                    className="h-[6px] flex-1 rounded-[1px]"
                    style={{
                      background: i < filled ? 'var(--accent)' : 'rgb(245 245 247 / 0.12)',
                    }}
                  />
                ))}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
