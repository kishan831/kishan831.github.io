import { experience } from '../../data/portfolio'

const ROWS = [
  { label: 'Experience', value: '5+ years · since 2021' },
  { label: 'Location', value: 'India · working remotely' },
  { label: 'Current role', value: 'Unity Developer, Bilions (Austin, TX)' },
  { label: 'Status', value: 'Open to opportunities' },
]

export default function AboutScreen() {
  const current = experience.find((e) => e.current)

  return (
    <div className="max-w-xl">
      <h1 className="font-display mb-1 text-[var(--fs-screen)] uppercase italic leading-none text-bone">
        About
      </h1>
      <p className="script-sub mb-6 text-[clamp(1rem,0.9rem+0.8vw,1.6rem)]">Me</p>

      <p className="mb-7 text-fluid-base leading-relaxed text-bone/75">
        I build the systems players never see — the mechanics, the state
        synchronisation, the delivery pipelines that let 67 games live on one
        platform. Five years in production, from leading a team of 15 across
        50+ projects to architecting slot games from scratch.
      </p>

      <dl className="mb-7 space-y-2.5">
        {ROWS.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline gap-4 rounded-lg border border-bone/10 bg-ink-950/50 px-3.5 py-2.5"
          >
            <dt className="w-28 shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/50">
              {row.label}
            </dt>
            <dd className="min-w-0 text-sm text-bone">{row.value}</dd>
          </div>
        ))}
      </dl>

      {current && (
        <p className="border-l-2 pl-4 text-sm leading-relaxed text-bone/70" style={{ borderColor: 'var(--accent)' }}>
          {current.desc}
        </p>
      )}
    </div>
  )
}
