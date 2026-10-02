import { experience } from '../../data/portfolio'

export default function ExperienceScreen() {
  const current = experience.find((e) => e.current)
  const rest = experience.filter((e) => !e.current)

  return (
    <div className="max-w-xl">
      <h1 className="font-display mb-1 text-[var(--fs-screen)] uppercase italic leading-none text-bone">
        Experience
      </h1>
      <p className="script-sub mb-6 text-[clamp(1rem,0.9rem+0.8vw,1.6rem)]">Journey</p>

      {current && (
        <div
          data-testid="current-role"
          className="mb-5 rounded-lg border-l-2 bg-ink-950/60 px-4 py-3"
          style={{ borderColor: 'var(--accent)' }}
        >
          <p className="font-mono text-[10px] tracking-[0.18em] text-[var(--accent-hi)]">
            {current.date}
          </p>
          <p className="mt-1 text-sm font-semibold text-bone">{current.role}</p>
          <p className="text-xs text-bone/60">{current.org}</p>
        </div>
      )}

      <ol className="relative space-y-4 border-l border-bone/15 pl-5">
        {rest.map((e) => (
          <li key={`${e.date}-${e.role}`} className="relative">
            <span className="absolute -left-[1.6rem] top-1.5 h-2 w-2 rounded-full bg-bone/30" />
            <p className="font-mono text-[10px] tracking-[0.18em] text-bone/45">{e.date}</p>
            <p className="mt-0.5 text-sm font-semibold text-bone">{e.role}</p>
            <p className="text-xs text-bone/60">{e.org}</p>
            {e.desc && (
              <p className="mt-1.5 text-xs leading-relaxed text-bone/50">{e.desc}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
